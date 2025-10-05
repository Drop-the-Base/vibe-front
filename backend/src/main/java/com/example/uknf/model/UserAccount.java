package com.example.uknf.model;

import com.example.uknf.model.enums.UserKind;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class UserAccount extends BaseEntity {
    private String name;
    private String email;
    private String phone;
    private UserKind kind;
    private boolean active;
    private Instant lastLogin;
    private Set<String> roles = new HashSet<>();
    private Set<String> entityIds = new HashSet<>();
    private String defaultEntityId;
    private String passwordHash;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserKind getKind() {
        return kind;
    }

    public void setKind(UserKind kind) {
        this.kind = kind;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Instant lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Set<String> getEntityIds() {
        return entityIds;
    }

    public void setEntityIds(Set<String> entityIds) {
        this.entityIds = entityIds;
    }

    public String getDefaultEntityId() {
        return defaultEntityId;
    }

    public void setDefaultEntityId(String defaultEntityId) {
        this.defaultEntityId = defaultEntityId;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}
