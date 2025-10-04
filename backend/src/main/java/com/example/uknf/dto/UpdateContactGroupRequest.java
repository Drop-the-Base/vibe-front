package com.example.uknf.dto;

import java.util.Set;

public record UpdateContactGroupRequest(
        String name,
        String description,
        Set<String> memberContactIds,
        Set<String> memberUserIds
) {
}
