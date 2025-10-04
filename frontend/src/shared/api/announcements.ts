import { apiClient } from './api-client';

export interface AnnouncementReaderDto {
  readerId: string;
  readerName: string;
  readerEntity: string | null;
  readAt: string | null;
}

export interface AnnouncementDto {
  id: number;
  title: string;
  content: string;
  priority: string;
  targetType: string;
  requiresAcknowledgement: boolean;
  publishedAt: string;
  expiresAt: string | null;
  totalRecipients: number | null;
  targetGroups: string[];
  readers: AnnouncementReaderDto[];
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  priority?: string;
  targetType?: string;
  requiresAcknowledgement?: boolean;
  publishedAt?: string;
  expiresAt?: string | null;
  totalRecipients?: number | null;
  targetGroups?: string[];
}

export interface UpdateAnnouncementRequest extends Partial<CreateAnnouncementRequest> {
  clearExpiry?: boolean;
}

export interface AcknowledgeAnnouncementRequest {
  readerId: string;
  readerName: string;
  readerEntity?: string | null;
}

export const announcementsApi = {
  list: () => apiClient.get<AnnouncementDto[]>('/announcements'),
  get: (id: number) => apiClient.get<AnnouncementDto>(`/announcements/${id}`),
  create: (payload: CreateAnnouncementRequest) => apiClient.post<AnnouncementDto>('/announcements', payload),
  update: (id: number, payload: UpdateAnnouncementRequest) =>
    apiClient.patch<AnnouncementDto>(`/announcements/${id}`, payload),
  acknowledge: (id: number, payload: AcknowledgeAnnouncementRequest) =>
    apiClient.post<AnnouncementDto>(`/announcements/${id}/acknowledgements`, payload),
};
