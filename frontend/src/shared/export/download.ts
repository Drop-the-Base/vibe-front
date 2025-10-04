interface DownloadOptions {
  blob: Blob;
  filename: string;
}

export const triggerDownload = ({ blob, filename }: DownloadOptions) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const createBlob = (parts: BlobPart[], mimeType: string) =>
  new Blob(parts, { type: mimeType });
