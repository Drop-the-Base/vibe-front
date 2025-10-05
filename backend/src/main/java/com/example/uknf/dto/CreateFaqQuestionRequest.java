package com.example.uknf.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record CreateFaqQuestionRequest(
        @NotBlank String question,
        String askedBy,
        String category,
        Set<String> tags
) {
}
