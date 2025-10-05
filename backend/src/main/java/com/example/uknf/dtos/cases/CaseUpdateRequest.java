package com.example.uknf.dtos.cases;

import java.time.OffsetDateTime;

public record CaseUpdateRequest(
        String title,
        Integer entityId,
        String category,
        String priority,
        String status,
        String assignedTo,
        String description,
        OffsetDateTime dueAt,
        Boolean clearDueAt
) {
}
