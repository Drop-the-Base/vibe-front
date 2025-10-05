package com.example.uknf.dtos.announcements;

import jakarta.validation.constraints.NotBlank;

public record AnnouncementAcknowledgeRequest(
        @NotBlank String readerId,
        @NotBlank String readerName,
        String readerEntity
) {
}
