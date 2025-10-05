package com.example.uknf.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "case_records")
@Getter
@Setter
@NoArgsConstructor
public class CaseRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "case_id")
    private Long id;

    @Column(name = "case_number", nullable = false, length = 50, unique = true)
    private String caseNumber;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "category", length = 100)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private SupervisedEntity entity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private CaseStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private CasePriority priority;

    @Column(name = "assigned_to", length = 150)
    private String assignedTo;

    @Column(name = "description", columnDefinition = "nvarchar(max)")
    private String description;

    @Column(name = "created_at", nullable = false, columnDefinition = "datetime2")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime2")
    private OffsetDateTime updatedAt;

    @Column(name = "due_at", columnDefinition = "datetime2")
    private OffsetDateTime dueAt;

    @PrePersist
    void onCreate() {
        var now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (status == null) {
            status = CaseStatus.NEW;
        }
        if (priority == null) {
            priority = CasePriority.MEDIUM;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
