package com.example.uknf.dto;

import java.util.Set;

public record ContactGroupDto(
        String id,
        String name,
        String description,
        Set<String> memberContactIds,
        Set<String> memberUserIds
) {
}
