package com.example.uknf.repository;

import com.example.uknf.domain.PasswordPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordPolicyRepository extends JpaRepository<PasswordPolicy, Long> {
}
