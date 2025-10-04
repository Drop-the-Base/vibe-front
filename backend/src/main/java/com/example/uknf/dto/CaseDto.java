package com.example.uknf.dto;

import com.example.uknf.model.CaseTimelineEntry;
import com.example.uknf.model.enums.CaseStatus;
import com.example.uknf.model.enums.PriorityLevel;

import java.time.Instant;
import java.util.List;

public record CaseDto(
        String id,
        String entityId,
        String entityName,
        String title,
        String category,
        CaseStatus status,
        PriorityLevel priority,
        String assignedTo,
        String createdBy,
        Instant openedAt,
        Instant lastUpdatedAt,
        List<CaseTimelineEntry> timeline
) {
}
