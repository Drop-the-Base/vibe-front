package com.example.uknf.dto;

import com.example.uknf.model.enums.AnnouncementPriority;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.Set;

public record CreateAnnouncementRequest(
        @NotBlank String title,
        @NotBlank String content,
        AnnouncementPriority priority,
        Instant expiresAt,
        Set<String> targetGroups,
        boolean confirmationRequired
) {
}
