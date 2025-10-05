package com.example.uknf.dtos.cases;

import com.example.uknf.entities.CaseRecord;

public record CaseResponse(
        Long id,
        String caseNumber,
        String title,
        Integer entityId,
        String entityName,
        String category,
        String status,
        String priority,
        String assignedTo,
        String description,
        String createdAt,
        String updatedAt,
        String dueAt
) {
    public static CaseResponse from(CaseRecord record) {
        return new CaseResponse(
                record.getId(),
                record.getCaseNumber(),
                record.getTitle(),
                record.getEntity() != null ? record.getEntity().getId() : null,
                record.getEntity() != null ? record.getEntity().getName() : null,
                record.getCategory(),
                record.getStatus() != null ? record.getStatus().toDisplay() : null,
                record.getPriority() != null ? record.getPriority().toDisplay() : null,
                record.getAssignedTo(),
                record.getDescription(),
                record.getCreatedAt() != null ? record.getCreatedAt().toString() : null,
                record.getUpdatedAt() != null ? record.getUpdatedAt().toString() : null,
                record.getDueAt() != null ? record.getDueAt().toString() : null
        );
    }
}
