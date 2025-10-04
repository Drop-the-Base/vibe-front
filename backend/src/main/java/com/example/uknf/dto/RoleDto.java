package com.example.uknf.dto;

import java.time.Instant;
import java.util.Set;

public record RoleDto(
        String id,
        String name,
        String description,
        Set<String> permissions,
        boolean systemRole,
        Instant createdAt,
        Instant updatedAt
) {
}
