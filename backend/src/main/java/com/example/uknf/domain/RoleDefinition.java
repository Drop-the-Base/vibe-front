package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "role_definitions")
public class RoleDefinition extends BaseEntity {

    @Column(name = "role_name", nullable = false, unique = true, length = 150)
    private String roleName;

    @Column(name = "description", length = 500)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "permission")
    private Set<String> permissions = new HashSet<>();

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }
}
