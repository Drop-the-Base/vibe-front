package com.example.uknf.web;

import com.example.uknf.domain.AppUser;
import com.example.uknf.repository.AppUserRepository;
import com.example.uknf.domain.SupervisedEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record LoginRequest(@Email String email, @NotBlank String password) {
    }

    public record UserDetailsDto(
        Long id,
        String fullName,
        String email,
        String organization,
        String status,
        String roleName,
        List<String> permissions,
        String lastLogin,
        String createdAt
    ) {
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public UserDetailsDto login(@Valid @RequestBody LoginRequest request) {
        AppUser user = userRepository.findByEmailIgnoreCase(request.email())
            .filter(entity -> passwordEncoder.matches(request.password(), entity.getPasswordHash()))
            .orElseThrow(() -> new IllegalArgumentException("Nieprawidłowy login lub hasło"));

        return new UserDetailsDto(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getEntities().stream().findFirst().map(SupervisedEntity::getName).orElse("UKNF"),
            user.isActive() ? "ACTIVE" : "INACTIVE",
            user.getRoleName(),
            user.getPermissions().stream().sorted().toList(),
            user.getLastLogin() != null ? user.getLastLogin().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null,
            user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null
        );
    }
}
