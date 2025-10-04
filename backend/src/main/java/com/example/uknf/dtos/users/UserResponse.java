package com.example.uknf.dtos.users;

import java.time.OffsetDateTime;

public record UserResponse(
        Integer id,
        String fullName,
        String email,
        String organization,
        String role,
        String status,
        OffsetDateTime lastLogin,
        OffsetDateTime createdAt
) {
}
