package com.example.uknf.dto;

import com.example.uknf.model.enums.ReportStatus;

import java.time.Instant;

public record UpdateReportStatusRequest(
        ReportStatus status,
        Instant submittedAt,
        String validationReportPath,
        String correctionId
) {
}
