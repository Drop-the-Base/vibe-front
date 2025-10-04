package com.example.uknf.services;

import com.example.uknf.entities.Message;
import com.example.uknf.repositories.MessageRepository;
import com.example.uknf.dtos.messages.MessageCreateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@Transactional
public class MessageService {

    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Message> findAll() {
        return repository.findAllOrdered();
    }

    @Transactional(readOnly = true)
    public List<Message> findByThread(UUID threadId) {
        return repository.findByThreadIdOrderByCreatedAtAsc(threadId);
    }

    public Message create(MessageCreateRequest request) {
        var message = new Message();
        message.setThreadId(resolveThreadId(request.threadId()));
        message.setEntityRef(request.entityRef());
        message.setSubject(request.subject());
        message.setContent(request.content());
        message.setSender(request.sender());
        message.setRecipient(request.recipient());
        message.setSenderRole(request.senderRole());
        message.setRecipientRole(request.recipientRole());
        message.setSenderType(Optional.ofNullable(request.senderType()).orElse("internal"));
        message.setRecipientType(Optional.ofNullable(request.recipientType()).orElse("external"));
        message.setDirection(Optional.ofNullable(request.direction()).orElse("outbound"));
        message.setStatus(Optional.ofNullable(request.status()).orElse("sent"));
        message.setHasAttachments(Optional.ofNullable(request.hasAttachments()).orElse(false));
        message.setReplyToId(request.replyToId());
        return repository.save(message);
    }

    public Message updateReadStatus(Long id, boolean read) {
        var message = repository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Message not found: id=" + id));
        if (read) {
            message.setReadAt(OffsetDateTime.now());
        } else {
            message.setReadAt(null);
        }
        return repository.save(message);
    }

    private UUID resolveThreadId(String provided) {
        if (provided == null || provided.isBlank()) {
            return UUID.randomUUID();
        }
        try {
            return UUID.fromString(provided);
        } catch (IllegalArgumentException ex) {
            return UUID.randomUUID();
        }
    }
}
