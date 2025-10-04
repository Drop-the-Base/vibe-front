package com.example.uknf.controllers;

import com.example.uknf.services.MessageService;
import com.example.uknf.dtos.messages.MessageCreateRequest;
import com.example.uknf.dtos.messages.MessageResponse;
import com.example.uknf.dtos.messages.MessageReadRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @GetMapping
    public List<MessageResponse> list() {
        return service.findAll().stream().map(MessageResponse::from).toList();
    }

    @GetMapping("/thread/{threadId}")
    public List<MessageResponse> byThread(@PathVariable UUID threadId) {
        return service.findByThread(threadId).stream().map(MessageResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse create(@RequestBody @Valid MessageCreateRequest request) {
        return MessageResponse.from(service.create(request));
    }

    @PatchMapping("/{id}/read")
    public MessageResponse updateReadStatus(@PathVariable Long id, @RequestBody @Valid MessageReadRequest request) {
        return MessageResponse.from(service.updateReadStatus(id, request.read()));
    }

}
