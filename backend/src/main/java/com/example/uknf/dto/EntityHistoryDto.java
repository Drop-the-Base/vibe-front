package com.example.uknf.dto;

import java.time.Instant;
import java.util.Map;

public record EntityHistoryDto(
        Instant timestamp,
        String user,
        Map<String, Object> changes
) {
}
