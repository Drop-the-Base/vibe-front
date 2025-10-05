package com.example.uknf.dto;

import com.example.uknf.model.enums.AnnouncementPriority;

import java.time.Instant;
import java.util.Set;

public record UpdateAnnouncementRequest(
        String title,
        String content,
        AnnouncementPriority priority,
        Instant expiresAt,
        Set<String> targetGroups,
        Boolean confirmationRequired
) {
}
