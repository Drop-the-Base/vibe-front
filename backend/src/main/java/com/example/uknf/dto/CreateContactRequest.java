package com.example.uknf.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateContactRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        String entityId
) {
}
