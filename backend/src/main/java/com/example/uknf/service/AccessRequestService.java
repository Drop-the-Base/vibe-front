package com.example.uknf.service;

import com.example.uknf.dto.AccessRequestDto;
import com.example.uknf.dto.CreateAccessRequestRequest;
import com.example.uknf.dto.UpdateAccessRequestStatusRequest;
import com.example.uknf.model.AccessRequest;
import com.example.uknf.model.enums.AccessRequestStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AccessRequestService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public AccessRequestService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<AccessRequestDto> findAll() {
        return db.accessRequests().values().stream().map(this::toDto).toList();
    }

    public Optional<AccessRequestDto> findById(String id) {
        return Optional.ofNullable(db.accessRequests().get(id)).map(this::toDto);
    }

    public AccessRequest create(CreateAccessRequestRequest request, AccessRequestStatus initialStatus) {
        AccessRequest entity = new AccessRequest();
        entity.setId(idService.nextId("REQ"));
        entity.setUserId(request.userId());
        entity.setUserName(request.userName());
        entity.setEmail(request.email());
        entity.setPeselMasked(request.peselMasked());
        entity.setPhone(request.phone());
        entity.setEntityIds(Set.copyOf(request.entityIds()));
        entity.setRequestedPermissions(Set.copyOf(request.requestedPermissions()));
        entity.setStatus(initialStatus);
        entity.setCreatedAt(Instant.now());
        if (initialStatus == AccessRequestStatus.NEW) {
            entity.setSubmittedAt(Instant.now());
        }
        db.accessRequests().put(entity.getId(), entity);
        return entity;
    }

    public AccessRequestDto submitDraft(String requestId) {
        AccessRequest entity = db.accessRequests().get(requestId);
        if (entity == null) {
            throw new IllegalArgumentException("Request not found");
        }
        entity.setStatus(AccessRequestStatus.NEW);
        entity.setSubmittedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        return toDto(entity);
    }

    public Optional<AccessRequestDto> updateStatus(String id, UpdateAccessRequestStatusRequest request) {
        AccessRequest entity = db.accessRequests().get(id);
        if (entity == null) {
            return Optional.empty();
        }
        if (request.status() != null) {
            entity.setStatus(request.status());
        }
        entity.setDecidedBy(request.decidedBy());
        entity.setDecidedAt(request.decidedAt() != null ? request.decidedAt() : Instant.now());
        entity.setComment(request.comment());
        entity.setUpdatedAt(Instant.now());
        return Optional.of(toDto(entity));
    }

    public void appendHistory(String id, AccessRequestStatus status, String actor) {
        UpdateAccessRequestStatusRequest request = new UpdateAccessRequestStatusRequest(status, actor, Instant.now(), null);
        updateStatus(id, request);
    }

    public AccessRequestDto toDto(AccessRequest entity) {
        return new AccessRequestDto(
                entity.getId(),
                entity.getUserId(),
                entity.getUserName(),
                entity.getEmail(),
                entity.getPeselMasked(),
                entity.getPhone(),
                Set.copyOf(entity.getEntityIds()),
                Set.copyOf(entity.getRequestedPermissions()),
                entity.getStatus(),
                entity.getSubmittedAt(),
                entity.getDecidedAt(),
                entity.getDecidedBy(),
                entity.getComment()
        );
    }
}
