package com.example.uknf.service;

import com.example.uknf.model.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryDatabase {
    private final Map<String, UserAccount> users = new ConcurrentHashMap<>();
    private final Map<String, SupervisedEntity> entities = new ConcurrentHashMap<>();
    private final Map<String, ReportRecord> reports = new ConcurrentHashMap<>();
    private final Map<String, MessageThread> messageThreads = new ConcurrentHashMap<>();
    private final Map<String, CaseRecord> cases = new ConcurrentHashMap<>();
    private final Map<String, LibraryFile> libraryFiles = new ConcurrentHashMap<>();
    private final Map<String, Announcement> announcements = new ConcurrentHashMap<>();
    private final Map<String, FaqEntry> faqs = new ConcurrentHashMap<>();
    private final Map<String, AccessRequest> accessRequests = new ConcurrentHashMap<>();
    private final Map<String, RoleDefinition> roles = new ConcurrentHashMap<>();
    private final Map<String, Contact> contacts = new ConcurrentHashMap<>();
    private final Map<String, ContactGroup> contactGroups = new ConcurrentHashMap<>();
    private final Map<String, AuditEvent> auditEvents = new ConcurrentHashMap<>();
    private final Map<String, List<EntityChangeLog>> entityHistory = new ConcurrentHashMap<>();
    private final PasswordPolicy passwordPolicy = new PasswordPolicy();

    public Map<String, UserAccount> users() {
        return users;
    }

    public Map<String, SupervisedEntity> entities() {
        return entities;
    }

    public Map<String, ReportRecord> reports() {
        return reports;
    }

    public Map<String, MessageThread> messageThreads() {
        return messageThreads;
    }

    public Map<String, CaseRecord> cases() {
        return cases;
    }

    public Map<String, LibraryFile> libraryFiles() {
        return libraryFiles;
    }

    public Map<String, Announcement> announcements() {
        return announcements;
    }

    public Map<String, FaqEntry> faqs() {
        return faqs;
    }

    public Map<String, AccessRequest> accessRequests() {
        return accessRequests;
    }

    public Map<String, RoleDefinition> roles() {
        return roles;
    }

    public Map<String, Contact> contacts() {
        return contacts;
    }

    public Map<String, ContactGroup> contactGroups() {
        return contactGroups;
    }

    public Map<String, AuditEvent> auditEvents() {
        return auditEvents;
    }

    public List<EntityChangeLog> historyForEntity(String entityId) {
        return entityHistory.computeIfAbsent(entityId, id -> new ArrayList<>());
    }

    public PasswordPolicy passwordPolicy() {
        return passwordPolicy;
    }
}
