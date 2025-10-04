package com.example.uknf.controller;

import com.example.uknf.dto.CreateMessageThreadRequest;
import com.example.uknf.dto.MessagePostRequest;
import com.example.uknf.dto.MessageThreadDto;
import com.example.uknf.model.enums.MessageStatus;
import com.example.uknf.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<MessageThreadDto> listThreads() {
        return messageService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageThreadDto> getThread(@PathVariable String id) {
        return messageService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MessageThreadDto> createThread(@Valid @RequestBody CreateMessageThreadRequest request) {
        return ResponseEntity.ok(messageService.createThread(request));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageThreadDto> postMessage(@PathVariable String id, @RequestBody MessagePostRequest request, @RequestParam(value = "status", required = false) MessageStatus status) {
        return messageService.postMessage(id, request, status).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MessageThreadDto> updateStatus(@PathVariable String id, @RequestParam MessageStatus status) {
        return messageService.updateStatus(id, status).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
