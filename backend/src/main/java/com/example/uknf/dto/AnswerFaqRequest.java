package com.example.uknf.dto;

import jakarta.validation.constraints.NotBlank;

public record AnswerFaqRequest(
        @NotBlank String answer,
        String answeredBy,
        Boolean published
) {
}
