package com.example.uknf.dtos.users;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;

@Builder
@Data
public class UserDetails {
    Integer id;
    String fullName;
    String email;
    String organization;
    String status;
    String roleName;
    Set<String> permissions;
    OffsetDateTime lastLogin;
    OffsetDateTime createdAt;
}
