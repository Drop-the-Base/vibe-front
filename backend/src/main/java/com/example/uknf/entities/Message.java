package com.example.uknf.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thread_id", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID threadId;

    @Column(name = "entity_ref", length = 100)
    private String entityRef;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(name = "body", nullable = false, columnDefinition = "nvarchar(max)")
    private String content;

    @Column(nullable = false, length = 200)
    private String sender;

    @Column(name = "sender_role", length = 100)
    private String senderRole;

    @Column(name = "sender_type", nullable = false, length = 50)
    private String senderType;

    @Column(nullable = false, length = 200)
    private String recipient;

    @Column(name = "recipient_role", length = 100)
    private String recipientRole;

    @Column(name = "recipient_type", nullable = false, length = 50)
    private String recipientType;

    @Column(nullable = false, length = 20)
    private String direction;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "has_attachments", nullable = false)
    private boolean hasAttachments;

    @Column(name = "reply_to_id")
    private Long replyToId;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    @Column(name = "created_at", nullable = false, columnDefinition = "datetime2")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime2")
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        var now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (threadId == null) {
            threadId = UUID.randomUUID();
        }
        if (senderType == null) {
            senderType = "internal";
        }
        if (recipientType == null) {
            recipientType = "external";
        }
        if (direction == null) {
            direction = "outbound";
        }
        if (status == null) {
            status = "sent";
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
