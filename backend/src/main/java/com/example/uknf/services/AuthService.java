package com.example.uknf.services;

import com.example.uknf.dtos.users.UserDetails;
import com.example.uknf.entities.User;
import com.example.uknf.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public UserDetails loginByEmailAndPassword(String email, String password) {
        User users = userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new IllegalArgumentException("User with email not found: " + email));

        // update last login (UTC)
        users.setLastLogin(OffsetDateTime.now(ZoneOffset.UTC));

        return UserDetails.builder()
                .id(users.getId())
                .fullName(users.getFullName())
                .email(users.getEmail())
                .organization(users.getOrganization())
                .status(users.getStatus())
                .roleName(users.getRole() != null ? users.getRole().getName() : null)
                .lastLogin(users.getLastLogin())
                .createdAt(users.getCreatedAt())
                .build();
    }
}



