package com.example.uknf.dto;

import com.example.uknf.model.enums.ReportStatus;

import java.time.Instant;
import java.util.List;

public record ReportDto(
        String id,
        String entityId,
        String entityName,
        String title,
        String period,
        String category,
        ReportStatus status,
        Instant dueDate,
        Instant submittedAt,
        String validationReportPath,
        List<String> corrections,
        Instant createdAt,
        Instant updatedAt
) {
}
