package com.example.uknf.dto;

import com.example.uknf.model.enums.UserKind;

import java.util.Set;

public record UpdateUserRequest(
        String name,
        String phone,
        UserKind kind,
        Boolean active,
        Set<String> roles,
        Set<String> entityIds,
        String defaultEntityId,
        String password
) {
}
