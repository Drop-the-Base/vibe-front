package com.example.uknf.dto;

import com.example.uknf.model.enums.AccessRequestStatus;

import java.time.Instant;
import java.util.Set;

public record AccessRequestDto(
        String id,
        String userId,
        String userName,
        String email,
        String peselMasked,
        String phone,
        Set<String> entityIds,
        Set<String> requestedPermissions,
        AccessRequestStatus status,
        Instant submittedAt,
        Instant decidedAt,
        String decidedBy,
        String comment
) {
}
