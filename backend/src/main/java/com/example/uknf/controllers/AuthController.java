package com.example.uknf.controllers;

import com.example.uknf.dtos.users.LoginRequest;
import com.example.uknf.dtos.users.UserDetails;
import com.example.uknf.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserDetails> login(@RequestBody LoginRequest request) {
        UserDetails dto = authService.loginByEmailAndPassword(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(dto);
    }
}