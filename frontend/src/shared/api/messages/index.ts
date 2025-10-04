import { apiClient } from '../api-client';

export interface MessageDto {
  id: number;
  threadId: string;
  entityRef?: string;
  subject: string;
  content: string;
  sender: string;
  senderRole?: string;
  senderType: string;
  recipient: string;
  recipientRole?: string;
  recipientType: string;
  direction: string;
  status: string;
  hasAttachments: boolean;
  replyToId?: number;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

export interface CreateMessagePayload {
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  senderRole?: string;
  senderType?: string;
  recipientRole?: string;
  recipientType?: string;
  entityRef?: string;
  status?: string;
  direction?: string;
  hasAttachments?: boolean;
  replyToId?: number;
  threadId?: string;
}

export const createMessage = (payload: CreateMessagePayload) =>
  apiClient.post<MessageDto>('/messages', payload);

export const fetchMessages = () => apiClient.get<MessageDto[]>('/messages');
