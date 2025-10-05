package com.example.uknf.service;

import com.example.uknf.dto.CreateMessageThreadRequest;
import com.example.uknf.dto.MessagePostRequest;
import com.example.uknf.dto.MessageThreadDto;
import com.example.uknf.model.LibraryFile;
import com.example.uknf.model.MessageEntry;
import com.example.uknf.model.MessageFileAttachment;
import com.example.uknf.model.MessageThread;
import com.example.uknf.model.enums.MessageStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final InMemoryDatabase db;
    private final IdService idService;
    private final LibraryService libraryService;

    public MessageService(InMemoryDatabase db, IdService idService, LibraryService libraryService) {
        this.db = db;
        this.idService = idService;
        this.libraryService = libraryService;
    }

    public List<MessageThreadDto> findAll() {
        return db.messageThreads().values().stream().map(this::toDto).toList();
    }

    public Optional<MessageThreadDto> findById(String id) {
        return Optional.ofNullable(db.messageThreads().get(id)).map(this::toDto);
    }

    public MessageThreadDto createThread(CreateMessageThreadRequest request) {
        MessageThread thread = new MessageThread();
        thread.setId(idService.nextId("MSG"));
        thread.setSubject(request.subject());
        thread.setEntityId(request.entityId());
        thread.setEntityName(request.entityName());
        thread.setParticipants(request.participants() != null ? request.participants() : Set.of());
        thread.setStatus(MessageStatus.WAITING_FOR_UKNF);
        thread.setCreatedAt(Instant.now());
        thread.setUpdatedAt(Instant.now());
        if (request.initialMessage() != null) {
            MessageEntry entry = toMessageEntry(request.initialMessage());
            thread.getMessages().add(entry);
            thread.setLastMessageAt(entry.getSentAt());
        }
        db.messageThreads().put(thread.getId(), thread);
        return toDto(thread);
    }

    public Optional<MessageThreadDto> postMessage(String threadId, MessagePostRequest request, MessageStatus newStatus) {
        MessageThread thread = db.messageThreads().get(threadId);
        if (thread == null) {
            return Optional.empty();
        }
        MessageEntry entry = toMessageEntry(request);
        thread.getMessages().add(entry);
        thread.setLastMessageAt(entry.getSentAt());
        thread.setUpdatedAt(Instant.now());
        if (newStatus != null) {
            thread.setStatus(newStatus);
        }
        if (request.authorId() != null) {
            thread.getParticipants().add(request.authorId());
        }
        return Optional.of(toDto(thread));
    }

    public Optional<MessageThreadDto> updateStatus(String threadId, MessageStatus status) {
        MessageThread thread = db.messageThreads().get(threadId);
        if (thread == null) {
            return Optional.empty();
        }
        thread.setStatus(status);
        thread.setUpdatedAt(Instant.now());
        return Optional.of(toDto(thread));
    }

    private MessageEntry toMessageEntry(MessagePostRequest request) {
        MessageEntry entry = new MessageEntry();
        entry.setId(idService.nextId("MSG"));
        entry.setAuthorId(request.authorId());
        entry.setAuthorName(request.authorName());
        entry.setContent(request.content());
        entry.setInternal(request.internal());
        entry.setSentAt(Instant.now());
        if (request.attachmentIds() != null) {
            List<MessageFileAttachment> attachments = request.attachmentIds().stream()
                    .map(libraryService::resolve)
                    .filter(file -> file != null)
                    .map(this::toAttachment)
                    .collect(Collectors.toList());
            entry.setAttachments(attachments);
        }
        return entry;
    }

    private MessageFileAttachment toAttachment(LibraryFile file) {
        return new MessageFileAttachment(file.getId(), file.getName(), file.getSize());
    }

    private MessageThreadDto toDto(MessageThread thread) {
        return new MessageThreadDto(
                thread.getId(),
                thread.getSubject(),
                thread.getEntityId(),
                thread.getEntityName(),
                thread.getStatus(),
                Set.copyOf(thread.getParticipants()),
                thread.getLastMessageAt(),
                List.copyOf(thread.getMessages())
        );
    }
}
