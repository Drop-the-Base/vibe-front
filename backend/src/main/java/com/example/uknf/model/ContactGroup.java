package com.example.uknf.model;

import java.util.HashSet;
import java.util.Set;

public class ContactGroup extends BaseEntity {
    private String name;
    private String description;
    private Set<String> memberContactIds = new HashSet<>();
    private Set<String> memberUserIds = new HashSet<>();

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

    public Set<String> getMemberContactIds() {
        return memberContactIds;
    }

    public void setMemberContactIds(Set<String> memberContactIds) {
        this.memberContactIds = memberContactIds;
    }

    public Set<String> getMemberUserIds() {
        return memberUserIds;
    }

    public void setMemberUserIds(Set<String> memberUserIds) {
        this.memberUserIds = memberUserIds;
    }
}
