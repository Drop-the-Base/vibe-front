package com.example.uknf.dto;

public record UpdateContactRequest(
        String name,
        String email,
        String phone,
        String entityId
) {
}
