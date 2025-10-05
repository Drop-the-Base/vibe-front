package com.example.uknf.dto;

import java.time.Instant;
import java.util.Set;

public record FaqDto(
        String id,
        String question,
        String answer,
        String category,
        Set<String> tags,
        Instant askedAt,
        Instant answeredAt,
        String askedBy,
        String answeredBy,
        double averageRating,
        int ratingCount,
        boolean published
) {
}
