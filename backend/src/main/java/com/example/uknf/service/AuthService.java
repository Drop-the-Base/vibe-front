package com.example.uknf.service;

import com.example.uknf.dto.*;
import com.example.uknf.model.UserAccount;
import com.example.uknf.model.enums.AccessRequestStatus;
import com.example.uknf.model.enums.UserKind;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {
    private final UserService userService;
    private final AccessRequestService accessRequestService;

    public AuthService(UserService userService, AccessRequestService accessRequestService) {
        this.userService = userService;
        this.accessRequestService = accessRequestService;
    }

    public Optional<AuthResponse> login(LoginRequest request) {
        Optional<UserAccount> accountOpt = userService.findEntityByEmail(request.email());
        if (accountOpt.isEmpty()) {
            return Optional.empty();
        }
        UserAccount account = accountOpt.get();
        if (!account.isActive() || !userService.verifyPassword(account, request.password())) {
            return Optional.empty();
        }
        userService.recordLogin(account.getId());
        String token = generateToken(account.getId());
        return Optional.of(new AuthResponse(token, toDto(account)));
    }

    public AuthResponse register(RegisterRequest request) {
        if (userService.findEntityByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Użytkownik z takim adresem e-mail już istnieje");
        }
        CreateUserRequest createRequest = new CreateUserRequest(
                request.name(),
                request.email(),
                request.phone(),
                UserKind.EXTERNAL_ADMIN,
                Set.of("REPORTING", "MESSAGING"),
                Set.of(),
                null,
                request.password()
        );
        UserDto user = userService.create(createRequest);
        userService.recordLogin(user.id());

        String maskedPesel = maskPesel(request.pesel());
        CreateAccessRequestRequest accessRequest = new CreateAccessRequestRequest(
                user.id(),
                user.name(),
                user.email(),
                maskedPesel,
                request.phone(),
                Set.of(),
                Set.of("REPORTING", "MESSAGING")
        );
        accessRequestService.create(accessRequest, AccessRequestStatus.DRAFT);
        String token = generateToken(user.id());
        return new AuthResponse(token, user);
    }

    private UserDto toDto(UserAccount account) {
        return new UserDto(
                account.getId(),
                account.getName(),
                account.getEmail(),
                account.getPhone(),
                account.getKind(),
                account.isActive(),
                account.getLastLogin(),
                Set.copyOf(account.getRoles()),
                Set.copyOf(account.getEntityIds()),
                account.getDefaultEntityId()
        );
    }

    private String generateToken(String userId) {
        String raw = userId + ":" + Instant.now().toString();
        return Base64.getEncoder().encodeToString(raw.getBytes());
    }

    private String maskPesel(String pesel) {
        if (pesel == null || pesel.length() < 4) {
            return "****";
        }
        String suffix = pesel.substring(pesel.length() - 4);
        return "********" + suffix;
    }
}
