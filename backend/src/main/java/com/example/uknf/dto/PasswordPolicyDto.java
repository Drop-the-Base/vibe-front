package com.example.uknf.dto;

public record PasswordPolicyDto(
        int minLength,
        boolean requireUppercase,
        boolean requireLowercase,
        boolean requireDigit,
        boolean requireSpecial,
        int rotationDays,
        int historySize
) {
}
