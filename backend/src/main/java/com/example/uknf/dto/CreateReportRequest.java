package com.example.uknf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record CreateReportRequest(
        @NotBlank String entityId,
        @NotBlank String entityName,
        @NotBlank String title,
        @NotBlank String period,
        String category,
        @NotNull Instant dueDate
) {
}
