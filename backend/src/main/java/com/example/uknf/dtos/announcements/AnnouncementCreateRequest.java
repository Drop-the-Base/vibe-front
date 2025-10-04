package com.example.uknf.dtos.announcements;

import jakarta.validation.constraints.NotBlank;

import java.time.OffsetDateTime;
import java.util.List;

public record AnnouncementCreateRequest(
        @NotBlank String title,
        @NotBlank String content,
        String priority,
        String targetType,
        boolean requiresAcknowledgement,
        OffsetDateTime publishedAt,
        OffsetDateTime expiresAt,
        Integer totalRecipients,
        List<String> targetGroups
) {
}
