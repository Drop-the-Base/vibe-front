package com.example.uknf.dto;

import java.time.Instant;

public record AuditEventDto(
        String id,
        String type,
        String message,
        String actor,
        Instant occurredAt
) {
}
