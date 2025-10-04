package com.example.uknf.dto;

public record UpdatePasswordPolicyRequest(
        Integer minLength,
        Boolean requireUppercase,
        Boolean requireLowercase,
        Boolean requireDigit,
        Boolean requireSpecial,
        Integer rotationDays,
        Integer historySize
) {
}
