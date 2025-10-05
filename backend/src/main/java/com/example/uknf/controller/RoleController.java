package com.example.uknf.controller;

import com.example.uknf.dto.CreateRoleRequest;
import com.example.uknf.dto.RoleDto;
import com.example.uknf.dto.UpdateRoleRequest;
import com.example.uknf.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public List<RoleDto> listRoles() {
        return roleService.findAll();
    }

    @PostMapping
    public ResponseEntity<RoleDto> createRole(@Valid @RequestBody CreateRoleRequest request) {
        return ResponseEntity.ok(roleService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDto> updateRole(@PathVariable String id, @RequestBody UpdateRoleRequest request) {
        return roleService.update(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable String id) {
        return roleService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
