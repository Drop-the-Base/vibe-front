package com.example.uknf.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record CreateMessageThreadRequest(
        @NotBlank String subject,
        @NotBlank String entityId,
        @NotBlank String entityName,
        Set<String> participants,
        MessagePostRequest initialMessage
) {
}
