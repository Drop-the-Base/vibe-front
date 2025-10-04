package com.example.uknf.dtos.cases;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record CaseCreateRequest(
        @NotBlank String title,
        @NotNull Integer entityId,
        String category,
        String priority,
        String status,
        String assignedTo,
        String description,
        OffsetDateTime dueAt
) {
}
