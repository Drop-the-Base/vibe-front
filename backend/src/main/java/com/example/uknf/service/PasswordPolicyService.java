package com.example.uknf.service;

import com.example.uknf.dto.PasswordPolicyDto;
import com.example.uknf.dto.UpdatePasswordPolicyRequest;
import com.example.uknf.model.PasswordPolicy;
import org.springframework.stereotype.Service;

@Service
public class PasswordPolicyService {
    private final InMemoryDatabase db;

    public PasswordPolicyService(InMemoryDatabase db) {
        this.db = db;
    }

    public PasswordPolicyDto getPolicy() {
        return toDto(db.passwordPolicy());
    }

    public PasswordPolicyDto updatePolicy(UpdatePasswordPolicyRequest request) {
        PasswordPolicy policy = db.passwordPolicy();
        if (request.minLength() != null) policy.setMinLength(request.minLength());
        if (request.requireUppercase() != null) policy.setRequireUppercase(request.requireUppercase());
        if (request.requireLowercase() != null) policy.setRequireLowercase(request.requireLowercase());
        if (request.requireDigit() != null) policy.setRequireDigit(request.requireDigit());
        if (request.requireSpecial() != null) policy.setRequireSpecial(request.requireSpecial());
        if (request.rotationDays() != null) policy.setRotationDays(request.rotationDays());
        if (request.historySize() != null) policy.setHistorySize(request.historySize());
        return toDto(policy);
    }

    private PasswordPolicyDto toDto(PasswordPolicy policy) {
        return new PasswordPolicyDto(
                policy.getMinLength(),
                policy.isRequireUppercase(),
                policy.isRequireLowercase(),
                policy.isRequireDigit(),
                policy.isRequireSpecial(),
                policy.getRotationDays(),
                policy.getHistorySize()
        );
    }
}
