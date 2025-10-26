package com.example.uknf.web;

import com.example.uknf.domain.PasswordPolicy;
import com.example.uknf.repository.PasswordPolicyRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/password-policy")
public class PasswordPolicyController {

    private final PasswordPolicyRepository passwordPolicyRepository;

    public PasswordPolicyController(PasswordPolicyRepository passwordPolicyRepository) {
        this.passwordPolicyRepository = passwordPolicyRepository;
    }

    public record PasswordPolicyDto(
        Long id,
        int minimumLength,
        boolean requireUppercase,
        boolean requireLowercase,
        boolean requireDigit,
        boolean requireSpecial,
        int expireAfterDays,
        int historySize
    ) {
    }

    public record UpdatePasswordPolicyRequest(
        @Min(6) int minimumLength,
        boolean requireUppercase,
        boolean requireLowercase,
        boolean requireDigit,
        boolean requireSpecial,
        @Min(0) int expireAfterDays,
        @Min(0) int historySize
    ) {
    }

    @GetMapping
    public PasswordPolicyDto getPolicy() {
        PasswordPolicy policy = passwordPolicyRepository.findAll().stream().findFirst()
            .orElseGet(() -> passwordPolicyRepository.save(new PasswordPolicy()));
        return toDto(policy);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void updatePolicy(@Valid @RequestBody UpdatePasswordPolicyRequest request) {
        PasswordPolicy policy = passwordPolicyRepository.findAll().stream().findFirst()
            .orElseGet(() -> passwordPolicyRepository.save(new PasswordPolicy()));
        policy.setMinimumLength(request.minimumLength());
        policy.setRequireUppercase(request.requireUppercase());
        policy.setRequireLowercase(request.requireLowercase());
        policy.setRequireDigit(request.requireDigit());
        policy.setRequireSpecial(request.requireSpecial());
        policy.setExpireAfterDays(request.expireAfterDays());
        policy.setHistorySize(request.historySize());
    }

    private PasswordPolicyDto toDto(PasswordPolicy policy) {
        return new PasswordPolicyDto(
            policy.getId(),
            policy.getMinimumLength(),
            policy.isRequireUppercase(),
            policy.isRequireLowercase(),
            policy.isRequireDigit(),
            policy.isRequireSpecial(),
            policy.getExpireAfterDays(),
            policy.getHistorySize()
        );
    }
}
