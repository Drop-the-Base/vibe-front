package com.example.uknf.dto;

import com.example.uknf.model.enums.UserKind;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record CreateUserRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        @NotNull UserKind kind,
        Set<String> roles,
        Set<String> entityIds,
        String defaultEntityId,
        @NotBlank String password
) {
}
