import { API_BASE_URL } from '../../config/environment';

export interface AttachmentDto {
  id: number;
  fileName: string;
  contentType?: string;
  fileSize: number;
  storagePath?: string;
  createdAt?: string;
}

export const listAttachments = async (messageId: number): Promise<AttachmentDto[]> => {
  const res = await fetch(`${API_BASE_URL}/messages/${messageId}/attachments`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return (await res.json()) as AttachmentDto[];
};

export const uploadAttachment = async (messageId: number, file: File): Promise<number> => {
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch(`${API_BASE_URL}/messages/${messageId}/attachments`, {
    method: 'POST',
    body: fd,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || res.statusText);
  }

  // controller returns numeric id in the response body
  const parsed = parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const downloadAttachmentUrl = (attachmentId: number) =>
  `${API_BASE_URL}/messages/attachments/${attachmentId}`;
