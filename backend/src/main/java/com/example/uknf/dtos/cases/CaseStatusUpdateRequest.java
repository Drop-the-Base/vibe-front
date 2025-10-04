package com.example.uknf.dtos.cases;

import jakarta.validation.constraints.NotBlank;

public record CaseStatusUpdateRequest(
        @NotBlank String status,
        String assignedTo,
        String description
) {
}
