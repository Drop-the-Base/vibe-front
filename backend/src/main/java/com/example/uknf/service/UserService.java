package com.example.uknf.service;

import com.example.uknf.dto.CreateUserRequest;
import com.example.uknf.dto.UpdateUserRequest;
import com.example.uknf.dto.UserDto;
import com.example.uknf.model.UserAccount;
import com.example.uknf.model.enums.UserKind;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final InMemoryDatabase db;
    private final IdService idService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<UserDto> findAll() {
        return db.users().values().stream().map(this::toDto).toList();
    }

    public Optional<UserDto> findById(String id) {
        return Optional.ofNullable(db.users().get(id)).map(this::toDto);
    }

    public Optional<UserAccount> findEntityByEmail(String email) {
        return db.users().values().stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    public UserDto create(CreateUserRequest request) {
        UserAccount account = new UserAccount();
        account.setId(idService.nextId("USR"));
        account.setName(request.name());
        account.setEmail(request.email().toLowerCase());
        account.setPhone(request.phone());
        account.setKind(request.kind());
        account.setActive(true);
        account.setCreatedAt(Instant.now());
        account.setUpdatedAt(Instant.now());
        account.setRoles(normalize(request.roles()));
        account.setEntityIds(normalize(request.entityIds()));
        account.setDefaultEntityId(request.defaultEntityId());
        account.setPasswordHash(passwordEncoder.encode(request.password()));
        db.users().put(account.getId(), account);
        return toDto(account);
    }

    public Optional<UserDto> update(String id, UpdateUserRequest request) {
        UserAccount existing = db.users().get(id);
        if (existing == null) {
            return Optional.empty();
        }
        if (request.name() != null) existing.setName(request.name());
        if (request.phone() != null) existing.setPhone(request.phone());
        if (request.kind() != null) existing.setKind(request.kind());
        if (request.active() != null) existing.setActive(request.active());
        if (request.roles() != null) existing.setRoles(normalize(request.roles()));
        if (request.entityIds() != null) existing.setEntityIds(normalize(request.entityIds()));
        if (request.defaultEntityId() != null) existing.setDefaultEntityId(request.defaultEntityId());
        if (request.password() != null && !request.password().isBlank()) {
            existing.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        existing.setUpdatedAt(Instant.now());
        return Optional.of(toDto(existing));
    }

    public boolean delete(String id) {
        return db.users().remove(id) != null;
    }

    public void recordLogin(String userId) {
        UserAccount account = db.users().get(userId);
        if (account != null) {
            account.setLastLogin(Instant.now());
        }
    }

    public UserAccount ensureDemoUser(String email, String name, UserKind kind, Set<String> roles) {
        return findEntityByEmail(email).orElseGet(() -> {
            CreateUserRequest request = new CreateUserRequest(name, email, null, kind, roles, Set.of(), null, "ChangeMe123!");
            UserDto dto = create(request);
            UserAccount created = db.users().get(dto.id());
            created.setPasswordHash(passwordEncoder.encode("kowalski"));
            created.setLastLogin(Instant.now());
            return created;
        });
    }

    private Set<String> normalize(Set<String> values) {
        if (values == null) return Set.of();
        return values.stream().map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toSet());
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

    public boolean verifyPassword(UserAccount account, String rawPassword) {
        return passwordEncoder.matches(rawPassword, account.getPasswordHash());
    }
}
