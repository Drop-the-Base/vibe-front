package com.example.uknf.dto;

import com.example.uknf.model.enums.UserKind;

import java.time.Instant;
import java.util.Set;

public record UserDto(
        String id,
        String name,
        String email,
        String phone,
        UserKind kind,
        boolean active,
        Instant lastLogin,
        Set<String> roles,
        Set<String> entityIds,
        String defaultEntityId
) {
}
