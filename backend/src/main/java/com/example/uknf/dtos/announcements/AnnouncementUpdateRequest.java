package com.example.uknf.dtos.announcements;

import java.time.OffsetDateTime;
import java.util.List;

public record AnnouncementUpdateRequest(
        String title,
        String content,
        String priority,
        String targetType,
        Boolean requiresAcknowledgement,
        OffsetDateTime expiresAt,
        Boolean clearExpiry,
        Integer totalRecipients,
        List<String> targetGroups
) {
}
