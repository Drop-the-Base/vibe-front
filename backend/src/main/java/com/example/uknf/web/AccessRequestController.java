package com.example.uknf.web;

import com.example.uknf.domain.AccessRequest;
import com.example.uknf.domain.enums.AccessRequestStatus;
import com.example.uknf.repository.AccessRequestRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/access-requests")
public class AccessRequestController {

    private final AccessRequestRepository accessRequestRepository;

    public AccessRequestController(AccessRequestRepository accessRequestRepository) {
        this.accessRequestRepository = accessRequestRepository;
    }

    public record AccessRequestDto(
        Long id,
        String userName,
        String email,
        String entityName,
        List<String> requestedPermissions,
        String status,
        String requestDate,
        String reviewedBy,
        String reviewDate
    ) {
    }

    public record UpdateStatusRequest(@NotBlank String status) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public List<AccessRequestDto> listRequests() {
        return accessRequestRepository.findAll().stream()
            .map(this::toDto)
            .toList();
    }

    @PatchMapping("/{id}")
    @Transactional
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        AccessRequest accessRequest = accessRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono wniosku"));
        accessRequest.setStatus(AccessRequestStatus.valueOf(request.status().toUpperCase()));
        accessRequest.setReviewedAt(OffsetDateTime.now());
        accessRequest.setReviewedBy("System");
    }

    private AccessRequestDto toDto(AccessRequest accessRequest) {
        return new AccessRequestDto(
            accessRequest.getId(),
            accessRequest.getUser().getFullName(),
            accessRequest.getUser().getEmail(),
            accessRequest.getEntity() != null ? accessRequest.getEntity().getName() : null,
            accessRequest.getRequestedPermissions().stream().sorted().toList(),
            accessRequest.getStatus().name().toLowerCase(),
            accessRequest.getSubmittedAt() != null ? accessRequest.getSubmittedAt().format(DATE_FORMAT) : null,
            accessRequest.getReviewedBy(),
            accessRequest.getReviewedAt() != null ? accessRequest.getReviewedAt().format(DATE_FORMAT) : null
        );
    }
}
