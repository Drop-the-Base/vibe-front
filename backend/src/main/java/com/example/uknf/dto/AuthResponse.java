package com.example.uknf.dto;

public record AuthResponse(
        String token,
        UserDto user
) {
}
