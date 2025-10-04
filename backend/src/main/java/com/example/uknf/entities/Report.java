package com.example.uknf.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer id;

    @Column(name = "report_code", nullable = false, length = 50, unique = true)
    private String reportCode;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private SupervisedEntity entity;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "status", length = 100)
    private String status;

    @Column(name = "created_at", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "deadline", columnDefinition = "datetime2")
    private OffsetDateTime deadline;

    @Column(name = "assigned_to", length = 150)
    private String assignedTo;

    @Column(name = "last_modified", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime lastModified;
}
