package com.example.uknf.dto;

import java.util.Set;

public record UpdateRoleRequest(
        String name,
        String description,
        Set<String> permissions,
        Boolean systemRole
) {
}
