package com.example.uknf.repository;

import com.example.uknf.domain.RoleDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleDefinitionRepository extends JpaRepository<RoleDefinition, Long> {
    Optional<RoleDefinition> findByRoleNameIgnoreCase(String roleName);
}
