package com.example.uknf.dtos.messages;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageCreateRequest(
        @NotBlank @Size(max = 200) String subject,
        @NotBlank String content,
        @NotBlank @Size(max = 200) String sender,
        @NotBlank @Size(max = 200) String recipient,
        @Size(max = 100) String senderRole,
        @Size(max = 50) String senderType,
        @Size(max = 100) String recipientRole,
        @Size(max = 50) String recipientType,
        @Size(max = 100) String entityRef,
        @Size(max = 50) String status,
        @Size(max = 20) String direction,
        Boolean hasAttachments,
        Long replyToId,
        String threadId
) {
}
