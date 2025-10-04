package com.example.uknf.service;

import com.example.uknf.dto.*;
import com.example.uknf.model.Contact;
import com.example.uknf.model.ContactGroup;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ContactService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public ContactService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<ContactDto> findAllContacts() {
        return db.contacts().values().stream().map(this::toDto).toList();
    }

    public ContactDto createContact(CreateContactRequest request) {
        Contact contact = new Contact();
        contact.setId(idService.nextId("CON"));
        contact.setName(request.name());
        contact.setEmail(request.email());
        contact.setPhone(request.phone());
        contact.setEntityId(request.entityId());
        contact.setCreatedAt(Instant.now());
        contact.setUpdatedAt(Instant.now());
        db.contacts().put(contact.getId(), contact);
        return toDto(contact);
    }

    public Optional<ContactDto> updateContact(String id, UpdateContactRequest request) {
        Contact contact = db.contacts().get(id);
        if (contact == null) {
            return Optional.empty();
        }
        if (request.name() != null) contact.setName(request.name());
        if (request.email() != null) contact.setEmail(request.email());
        if (request.phone() != null) contact.setPhone(request.phone());
        if (request.entityId() != null) contact.setEntityId(request.entityId());
        contact.setUpdatedAt(Instant.now());
        return Optional.of(toDto(contact));
    }

    public boolean deleteContact(String id) {
        return db.contacts().remove(id) != null;
    }

    public List<ContactGroupDto> findAllGroups() {
        return db.contactGroups().values().stream().map(this::toDto).toList();
    }

    public ContactGroupDto createGroup(CreateContactGroupRequest request) {
        ContactGroup group = new ContactGroup();
        group.setId(idService.nextId("GRP"));
        group.setName(request.name());
        group.setDescription(request.description());
        group.setMemberContactIds(request.memberContactIds() != null ? Set.copyOf(request.memberContactIds()) : Set.of());
        group.setMemberUserIds(request.memberUserIds() != null ? Set.copyOf(request.memberUserIds()) : Set.of());
        group.setCreatedAt(Instant.now());
        group.setUpdatedAt(Instant.now());
        db.contactGroups().put(group.getId(), group);
        return toDto(group);
    }

    public Optional<ContactGroupDto> updateGroup(String id, UpdateContactGroupRequest request) {
        ContactGroup group = db.contactGroups().get(id);
        if (group == null) {
            return Optional.empty();
        }
        if (request.name() != null) group.setName(request.name());
        if (request.description() != null) group.setDescription(request.description());
        if (request.memberContactIds() != null) group.setMemberContactIds(Set.copyOf(request.memberContactIds()));
        if (request.memberUserIds() != null) group.setMemberUserIds(Set.copyOf(request.memberUserIds()));
        group.setUpdatedAt(Instant.now());
        return Optional.of(toDto(group));
    }

    public boolean deleteGroup(String id) {
        return db.contactGroups().remove(id) != null;
    }

    private ContactDto toDto(Contact contact) {
        return new ContactDto(contact.getId(), contact.getName(), contact.getEmail(), contact.getPhone(), contact.getEntityId());
    }

    private ContactGroupDto toDto(ContactGroup group) {
        return new ContactGroupDto(
                group.getId(),
                group.getName(),
                group.getDescription(),
                Set.copyOf(group.getMemberContactIds()),
                Set.copyOf(group.getMemberUserIds())
        );
    }
}
