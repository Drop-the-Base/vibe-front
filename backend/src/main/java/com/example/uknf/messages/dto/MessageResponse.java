package com.example.uknf.messages.dto;

import com.example.uknf.messages.Message;

import java.util.UUID;

public record MessageResponse(
        Long id,
        UUID threadId,
        String entityRef,
        String subject,
        String content,
        String sender,
        String senderRole,
        String senderType,
        String recipient,
        String recipientRole,
        String recipientType,
        String direction,
        String status,
        boolean hasAttachments,
        Long replyToId,
        String createdAt,
        String updatedAt,
        String readAt
) {
    public static MessageResponse from(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getThreadId(),
                message.getEntityRef(),
                message.getSubject(),
                message.getContent(),
                message.getSender(),
                message.getSenderRole(),
                message.getSenderType(),
                message.getRecipient(),
                message.getRecipientRole(),
                message.getRecipientType(),
                message.getDirection(),
                message.getStatus(),
                message.isHasAttachments(),
                message.getReplyToId(),
                message.getCreatedAt() != null ? message.getCreatedAt().toString() : null,
                message.getUpdatedAt() != null ? message.getUpdatedAt().toString() : null,
                message.getReadAt() != null ? message.getReadAt().toString() : null
        );
    }
}
