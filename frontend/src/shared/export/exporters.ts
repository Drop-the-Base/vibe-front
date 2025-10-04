import { createBlob, triggerDownload } from './download';

type RowValue = unknown;

const textEncoder = new TextEncoder();

const encodeUtf8 = (value: string) => textEncoder.encode(value);

const ensureExtension = (filename: string, extension: string) =>
  filename.toLowerCase().endsWith(extension) ? filename : `${filename}${extension}`;

const normaliseCell = (value: RowValue): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  return String(value);
};

const toSheetValue = (value: RowValue): string => normaliseCell(value);

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\r?\n/g, '&#10;');

const toExcelColumn = (index: number): string => {
  let result = '';
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    current = Math.floor((current - 1) / 26);
  }
  return result;
};

const buildSheetXml = (headers: string[], rows: string[][]): string => {
  const data = [headers, ...rows];
  const rowCount = data.length || 1;
  const columnCount = headers.length || (rows[0]?.length ?? 0);
  const rowsXml = data
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, columnIndex) => {
          const ref = `${toExcelColumn(columnIndex)}${rowIndex + 1}`;
          return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></c>`;
        })
        .join('');
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  const lastColumn = columnCount > 0 ? toExcelColumn(columnCount - 1) : 'A';
  const dimensionRef = `A1:${lastColumn}${rowCount}`;

  return `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n`
    + `  <dimension ref="${dimensionRef}" />\n`
    + `  <sheetData>${rowsXml}</sheetData>\n`
    + `</worksheet>`;
};

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let crc = i;
    for (let j = 0; j < 8; j += 1) {
      if ((crc & 1) !== 0) {
        crc = 0xedb88320 ^ (crc >>> 1);
      } else {
        crc >>>= 1;
      }
    }
    table[i] = crc >>> 0;
  }
  return table;
})();

const crc32 = (data: Uint8Array): number => {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    const byte = data[i];
    crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const concatUint8Arrays = (chunks: Uint8Array[]): Uint8Array => {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });
  return result;
};

interface ZipEntry {
  path: string;
  content: Uint8Array;
}

const createZipArchive = (entries: ZipEntry[]): Uint8Array => {
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let offset = 0;

  entries.forEach((entry) => {
    const fileNameBytes = encodeUtf8(entry.path);
    const content = entry.content;
    const crc = crc32(content);

    const localHeader = new Uint8Array(30 + fileNameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, 0, true);
    localView.setUint16(12, 0, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, content.length, true);
    localView.setUint32(22, content.length, true);
    localView.setUint16(26, fileNameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(fileNameBytes, 30);

    const localData = concatUint8Arrays([localHeader, content]);
    localChunks.push(localData);

    const centralHeader = new Uint8Array(46 + fileNameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 0x0014, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, 0, true);
    centralView.setUint16(14, 0, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, content.length, true);
    centralView.setUint32(24, content.length, true);
    centralView.setUint16(28, fileNameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(fileNameBytes, 46);
    centralChunks.push(centralHeader);

    offset += localData.length;
  });

  const centralDirectory = concatUint8Arrays(centralChunks);
  const localDataCombined = concatUint8Arrays(localChunks);

  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralDirectory.length, true);
  endView.setUint32(16, localDataCombined.length, true);
  endView.setUint16(20, 0, true);

  return concatUint8Arrays([localDataCombined, centralDirectory, endRecord]);
};

export const exportToJSON = (
  records: Record<string, RowValue>[],
  filename: string,
) => {
  const safeFilename = ensureExtension(filename, '.json');
  const content = JSON.stringify(records, null, 2);
  const blob = createBlob([content], 'application/json;charset=utf-8;');
  triggerDownload({ blob, filename: safeFilename });
};

export const exportToCSV = (
  headers: string[],
  rows: RowValue[][],
  filename: string,
) => {
  const safeFilename = ensureExtension(filename, '.csv');
  const headerLine = headers.join(';');
  const lines = rows.map((row) =>
    row
      .map((cell) => {
        const value = normaliseCell(cell);
        if (/[";\n]/.test(value)) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(';'),
  );
  const content = [headerLine, ...lines].join('\n');
  const blob = createBlob([content], 'text/csv;charset=utf-8;');
  triggerDownload({ blob, filename: safeFilename });
};

export const exportToXLSX = (
  headers: string[],
  rows: RowValue[][],
  filename: string,
) => {
  const safeFilename = ensureExtension(filename, '.xlsx');
  const normalisedRows = rows.map((row) => row.map((cell) => toSheetValue(cell)));
  const sheetXml = buildSheetXml(headers, normalisedRows);

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n` +
    `  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n` +
    `  <Default Extension="xml" ContentType="application/xml"/>\n` +
    `  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>\n` +
    `  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\n` +
    `</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n` +
    `  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\n` +
    `</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n` +
    `  <sheets>\n` +
    `    <sheet name="Dane" sheetId="1" r:id="rId1"/>\n` +
    `  </sheets>\n` +
    `</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n` +
    `  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>\n` +
    `</Relationships>`;

  const archive = createZipArchive([
    { path: '[Content_Types].xml', content: encodeUtf8(contentTypesXml) },
    { path: '_rels/.rels', content: encodeUtf8(rootRelsXml) },
    { path: 'xl/workbook.xml', content: encodeUtf8(workbookXml) },
    { path: 'xl/_rels/workbook.xml.rels', content: encodeUtf8(workbookRelsXml) },
    { path: 'xl/worksheets/sheet1.xml', content: encodeUtf8(sheetXml) },
  ]);

  const blob = createBlob(
    [archive],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  triggerDownload({ blob, filename: safeFilename });
};
