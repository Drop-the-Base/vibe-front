package com.example.uknf.web;

import com.example.uknf.domain.AppUser;
import com.example.uknf.repository.AppUserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AppUserRepository userRepository;

    public UserController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public record UserDto(
        Long id,
        String name,
        String email,
        String organization,
        String role,
        boolean active,
        String status,
        String lastLogin,
        String createdAt
    ) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public List<UserDto> listUsers() {
        return userRepository.findAll().stream()
            .map(user -> new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getEntities().stream().findFirst().map(entity -> entity.getName()).orElse(null),
                user.getRoleName(),
                user.isActive(),
                user.isActive() ? "active" : "inactive",
                user.getLastLogin() != null ? user.getLastLogin().format(DATE_FORMAT) : null,
                user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMAT) : null
            ))
            .toList();
    }
}
