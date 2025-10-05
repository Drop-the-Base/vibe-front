package com.example.uknf.dto;

public record ContactDto(
        String id,
        String name,
        String email,
        String phone,
        String entityId
) {
}
