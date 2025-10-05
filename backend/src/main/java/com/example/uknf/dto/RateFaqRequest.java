package com.example.uknf.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record RateFaqRequest(
        @Min(1) @Max(5) int rating
) {
}
