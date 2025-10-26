package com.example.uknf.web;

import com.example.uknf.domain.Message;
import com.example.uknf.domain.MessageThread;
import com.example.uknf.domain.SupervisedEntity;
import com.example.uknf.domain.enums.MessageDirection;
import com.example.uknf.domain.enums.MessageStatus;
import com.example.uknf.repository.MessageRepository;
import com.example.uknf.repository.MessageThreadRepository;
import com.example.uknf.repository.SupervisedEntityRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final MessageThreadRepository threadRepository;
    private final SupervisedEntityRepository entityRepository;

    public MessageController(MessageRepository messageRepository,
                             MessageThreadRepository threadRepository,
                             SupervisedEntityRepository entityRepository) {
        this.messageRepository = messageRepository;
        this.threadRepository = threadRepository;
        this.entityRepository = entityRepository;
    }

    public record MessageDto(
        Long id,
        String threadId,
        String entityRef,
        String subject,
        String content,
        String sender,
        String senderRole,
        String senderType,
        String recipient,
        String recipientRole,
        String recipientType,
        String direction,
        String status,
        boolean hasAttachments,
        Long replyToId,
        String createdAt,
        String updatedAt,
        String readAt
    ) {
    }

    public record CreateMessageRequest(
        String threadId,
        Long entityId,
        @NotBlank String subject,
        @NotBlank String content,
        @NotBlank String sender,
        String senderRole,
        String senderType,
        @NotBlank String recipient,
        String recipientRole,
        String recipientType,
        String status,
        String direction,
        boolean hasAttachments,
        Long replyToId
    ) {
    }

    public record MessageReadPayload(boolean read) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public List<MessageDto> listMessages() {
        return messageRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .map(this::toDto)
            .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public MessageDto createMessage(@Valid @RequestBody CreateMessageRequest request) {
        MessageThread thread = resolveThread(request);
        Message message = new Message();
        message.setThread(thread);
        message.setEntity(thread.getEntity());
        message.setSubject(request.subject());
        message.setContent(request.content());
        message.setSender(request.sender());
        message.setSenderRole(request.senderRole());
        message.setSenderType(request.senderType() != null ? request.senderType() : "INTERNAL");
        message.setRecipient(request.recipient());
        message.setRecipientRole(request.recipientRole());
        message.setRecipientType(request.recipientType() != null ? request.recipientType() : "EXTERNAL");
        message.setDirection(request.direction() != null ? MessageDirection.valueOf(request.direction().toUpperCase()) : MessageDirection.OUTBOUND);
        message.setStatus(request.status() != null ? MessageStatus.valueOf(request.status().toUpperCase()) : MessageStatus.AWAITING_UKNF);
        message.setHasAttachments(request.hasAttachments());
        message.setReplyToId(request.replyToId());

        Message saved = messageRepository.save(message);
        return toDto(saved);
    }

    @PatchMapping("/{id}/read")
    @Transactional
    public MessageDto updateReadStatus(@PathVariable Long id, @Valid @RequestBody MessageReadPayload payload) {
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono wiadomości"));
        message.setReadAt(payload.read() ? OffsetDateTime.now() : null);
        return toDto(message);
    }

    private MessageThread resolveThread(CreateMessageRequest request) {
        if (request.threadId() != null && !request.threadId().isBlank()) {
            return threadRepository.findByThreadKey(request.threadId())
                .orElseGet(() -> createThread(request.threadId(), request));
        }
        String generatedKey = "MSG-" + UUID.randomUUID();
        return createThread(generatedKey, request);
    }

    private MessageThread createThread(String key, CreateMessageRequest request) {
        MessageThread thread = new MessageThread();
        thread.setThreadKey(key);
        thread.setSubject(request.subject());
        SupervisedEntity entity = request.entityId() != null
            ? entityRepository.findById(request.entityId()).orElse(null)
            : null;
        thread.setEntity(entity);
        return threadRepository.save(thread);
    }

    private MessageDto toDto(Message message) {
        return new MessageDto(
            message.getId(),
            message.getThread() != null ? message.getThread().getThreadKey() : null,
            message.getEntity() != null ? message.getEntity().getUknfCode() : null,
            message.getSubject(),
            message.getContent(),
            message.getSender(),
            message.getSenderRole(),
            message.getSenderType(),
            message.getRecipient(),
            message.getRecipientRole(),
            message.getRecipientType(),
            message.getDirection().name().toLowerCase(),
            message.getStatus().name().toLowerCase(),
            message.isHasAttachments(),
            message.getReplyToId(),
            message.getCreatedAt() != null ? message.getCreatedAt().format(DATE_FORMAT) : null,
            message.getUpdatedAt() != null ? message.getUpdatedAt().format(DATE_FORMAT) : null,
            message.getReadAt() != null ? message.getReadAt().format(DATE_FORMAT) : null
        );
    }
}
