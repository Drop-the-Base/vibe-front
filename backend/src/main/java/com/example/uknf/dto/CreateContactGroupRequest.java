package com.example.uknf.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record CreateContactGroupRequest(
        @NotBlank String name,
        String description,
        Set<String> memberContactIds,
        Set<String> memberUserIds
) {
}
