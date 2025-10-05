package com.example.uknf.dto;

import com.example.uknf.model.enums.PriorityLevel;
import jakarta.validation.constraints.NotBlank;

public record CreateCaseRequest(
        @NotBlank String entityId,
        @NotBlank String entityName,
        @NotBlank String title,
        String category,
        PriorityLevel priority,
        String createdBy,
        String description
) {
}
