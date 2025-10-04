package com.example.uknf.service;

import com.example.uknf.dto.AuditEventDto;
import com.example.uknf.model.AuditEvent;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AuditService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public AuditService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public AuditEventDto record(String type, String message, String actor) {
        AuditEvent event = new AuditEvent();
        event.setId(idService.nextId("AUD"));
        event.setType(type);
        event.setMessage(message);
        event.setActor(actor);
        event.setOccurredAt(Instant.now());
        event.setCreatedAt(Instant.now());
        event.setUpdatedAt(Instant.now());
        db.auditEvents().put(event.getId(), event);
        return toDto(event);
    }

    public List<AuditEventDto> findAll() {
        return db.auditEvents().values().stream().sorted((a, b) -> b.getOccurredAt().compareTo(a.getOccurredAt())).map(this::toDto).toList();
    }

    private AuditEventDto toDto(AuditEvent event) {
        return new AuditEventDto(event.getId(), event.getType(), event.getMessage(), event.getActor(), event.getOccurredAt());
    }
}
