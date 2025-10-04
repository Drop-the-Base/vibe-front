import { utils, write } from 'xlsx';

import { createBlob, triggerDownload } from './download';

type RowValue = unknown;

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

const toSheetValue = (
  value: RowValue,
): string | number | boolean | Date => {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'object') {
    return normaliseCell(value);
  }
  return String(value);
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

export const exportToTXT = (
  headers: string[],
  rows: RowValue[][],
  filename: string,
) => {
  const safeFilename = ensureExtension(filename, '.txt');
  const headerLine = headers.join('\t');
  const lines = rows.map((row) =>
    row.map((cell) => normaliseCell(cell).replace(/\t/g, ' ')).join('\t'),
  );
  const content = [headerLine, ...lines].join('\n');
  const blob = createBlob([content], 'text/plain;charset=utf-8;');
  triggerDownload({ blob, filename: safeFilename });
};

export const exportToXLSX = (
  headers: string[],
  rows: RowValue[][],
  filename: string,
) => {
  const safeFilename = ensureExtension(filename, '.xlsx');
  const worksheet = utils.aoa_to_sheet([
    headers,
    ...rows.map((row) => row.map((cell) => toSheetValue(cell))),
  ]);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Dane');
  const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = createBlob([buffer], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  triggerDownload({ blob, filename: safeFilename });
};
