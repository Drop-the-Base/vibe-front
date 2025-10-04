package com.example.uknf.dto;

import com.example.uknf.model.enums.CaseStatus;
import com.example.uknf.model.enums.PriorityLevel;

public record UpdateCaseRequest(
        String title,
        String category,
        CaseStatus status,
        PriorityLevel priority,
        String assignedTo
) {
}
