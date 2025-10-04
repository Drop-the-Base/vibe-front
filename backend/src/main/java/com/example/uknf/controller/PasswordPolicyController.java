package com.example.uknf.controller;

import com.example.uknf.dto.PasswordPolicyDto;
import com.example.uknf.dto.UpdatePasswordPolicyRequest;
import com.example.uknf.service.PasswordPolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/password-policy")
public class PasswordPolicyController {
    private final PasswordPolicyService passwordPolicyService;

    public PasswordPolicyController(PasswordPolicyService passwordPolicyService) {
        this.passwordPolicyService = passwordPolicyService;
    }

    @GetMapping
    public PasswordPolicyDto getPolicy() {
        return passwordPolicyService.getPolicy();
    }

    @PutMapping
    public ResponseEntity<PasswordPolicyDto> updatePolicy(@RequestBody UpdatePasswordPolicyRequest request) {
        return ResponseEntity.ok(passwordPolicyService.updatePolicy(request));
    }
}
