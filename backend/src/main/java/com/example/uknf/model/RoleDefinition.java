package com.example.uknf.model;

import java.util.HashSet;
import java.util.Set;

public class RoleDefinition extends BaseEntity {
    private String name;
    private String description;
    private Set<String> permissions = new HashSet<>();
    private boolean systemRole;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public boolean isSystemRole() {
        return systemRole;
    }

    public void setSystemRole(boolean systemRole) {
        this.systemRole = systemRole;
    }
}
