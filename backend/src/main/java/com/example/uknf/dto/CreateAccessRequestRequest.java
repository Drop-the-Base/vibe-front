package com.example.uknf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record CreateAccessRequestRequest(
        @NotBlank String userId,
        @NotBlank String userName,
        @NotBlank String email,
        @NotBlank String peselMasked,
        @NotBlank String phone,
        @NotEmpty Set<String> entityIds,
        @NotEmpty Set<String> requestedPermissions
) {
}
