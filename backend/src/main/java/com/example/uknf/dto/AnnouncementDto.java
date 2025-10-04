package com.example.uknf.dto;

import com.example.uknf.model.enums.AnnouncementPriority;

import java.time.Instant;
import java.util.Set;

public record AnnouncementDto(
        String id,
        String title,
        String content,
        AnnouncementPriority priority,
        Instant publishedAt,
        Instant expiresAt,
        Set<String> targetGroups,
        Set<String> acknowledgedBy,
        boolean confirmationRequired
) {
}
