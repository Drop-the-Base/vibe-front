package com.example.uknf.web;

import com.example.uknf.domain.RoleDefinition;
import com.example.uknf.repository.RoleDefinitionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleDefinitionRepository roleDefinitionRepository;

    public RoleController(RoleDefinitionRepository roleDefinitionRepository) {
        this.roleDefinitionRepository = roleDefinitionRepository;
    }

    public record RoleDto(
        Long id,
        String roleName,
        String description,
        List<String> permissions
    ) {
    }

    @GetMapping
    public List<RoleDto> listRoles() {
        return roleDefinitionRepository.findAll().stream()
            .map(role -> new RoleDto(
                role.getId(),
                role.getRoleName(),
                role.getDescription(),
                role.getPermissions().stream().sorted().toList()
            ))
            .toList();
    }
}
