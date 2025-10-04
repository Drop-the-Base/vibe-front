package com.example.uknf.dto;

import com.example.uknf.model.enums.AccessRequestStatus;

import java.time.Instant;

public record UpdateAccessRequestStatusRequest(
        AccessRequestStatus status,
        String decidedBy,
        Instant decidedAt,
        String comment
) {
}
