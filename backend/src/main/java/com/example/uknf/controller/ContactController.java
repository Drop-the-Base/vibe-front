package com.example.uknf.controller;

import com.example.uknf.dto.*;
import com.example.uknf.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public List<ContactDto> listContacts() {
        return contactService.findAllContacts();
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@Valid @RequestBody CreateContactRequest request) {
        return ResponseEntity.ok(contactService.createContact(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> updateContact(@PathVariable String id, @RequestBody UpdateContactRequest request) {
        return contactService.updateContact(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        return contactService.deleteContact(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/groups")
    public List<ContactGroupDto> listGroups() {
        return contactService.findAllGroups();
    }

    @PostMapping("/groups")
    public ResponseEntity<ContactGroupDto> createGroup(@Valid @RequestBody CreateContactGroupRequest request) {
        return ResponseEntity.ok(contactService.createGroup(request));
    }

    @PutMapping("/groups/{id}")
    public ResponseEntity<ContactGroupDto> updateGroup(@PathVariable String id, @RequestBody UpdateContactGroupRequest request) {
        return contactService.updateGroup(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String id) {
        return contactService.deleteGroup(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
