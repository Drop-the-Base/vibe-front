package com.example.uknf.controllers;

import com.example.uknf.services.MessageService;
import com.example.uknf.services.AttachmentService;
import com.example.uknf.entities.MessageAttachment;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
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
    private final AttachmentService attachmentService;

    public MessageController(MessageService service, AttachmentService attachmentService) {
        this.service = service;
        this.attachmentService = attachmentService;
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

    // Upload single attachment for a message
    @PostMapping(path = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAttachment(@PathVariable Long id, @RequestPart("file") MultipartFile file) throws Exception {
        // ensure message exists
        service.findById(id);
        MessageAttachment saved = attachmentService.save(id, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    // List attachments for a message
    @GetMapping("/{id}/attachments")
    public List<MessageAttachment> listAttachments(@PathVariable Long id) {
        // ensure message exists
        service.findById(id);
        return attachmentService.listForMessage(id);
    }

    // Download attachment
    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long attachmentId) throws Exception {
        MessageAttachment att = attachmentService.findById(attachmentId);
        var path = java.nio.file.Path.of(att.getStoragePath());
        if (!java.nio.file.Files.exists(path)) {
            throw new jakarta.persistence.EntityNotFoundException("Attachment file not found on disk: " + att.getStoragePath());
        }
        byte[] bytes = java.nio.file.Files.readAllBytes(path);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + att.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(att.getContentType() != null ? att.getContentType() : "application/octet-stream"))
                .body(bytes);
    }

}
