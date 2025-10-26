package com.example.uknf.domain;

import com.example.uknf.domain.enums.MessageDirection;
import com.example.uknf.domain.enums.MessageStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "messages")
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id")
    private MessageThread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id")
    private SupervisedEntity entity;

    @Column(name = "subject", length = 400)
    private String subject;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "sender", length = 200)
    private String sender;

    @Column(name = "sender_role", length = 100)
    private String senderRole;

    @Column(name = "sender_type", length = 100)
    private String senderType;

    @Column(name = "recipient", length = 200)
    private String recipient;

    @Column(name = "recipient_role", length = 100)
    private String recipientRole;

    @Column(name = "recipient_type", length = 100)
    private String recipientType;

    @Enumerated(EnumType.STRING)
    @Column(name = "direction", length = 16)
    private MessageDirection direction = MessageDirection.OUTBOUND;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 32)
    private MessageStatus status = MessageStatus.AWAITING_UKNF;

    @Column(name = "has_attachments")
    private boolean hasAttachments;

    @Column(name = "reply_to_id")
    private Long replyToId;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    public MessageThread getThread() {
        return thread;
    }

    public void setThread(MessageThread thread) {
        this.thread = thread;
    }

    public SupervisedEntity getEntity() {
        return entity;
    }

    public void setEntity(SupervisedEntity entity) {
        this.entity = entity;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(String recipientRole) {
        this.recipientRole = recipientRole;
    }

    public String getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(String recipientType) {
        this.recipientType = recipientType;
    }

    public MessageDirection getDirection() {
        return direction;
    }

    public void setDirection(MessageDirection direction) {
        this.direction = direction;
    }

    public MessageStatus getStatus() {
        return status;
    }

    public void setStatus(MessageStatus status) {
        this.status = status;
    }

    public boolean isHasAttachments() {
        return hasAttachments;
    }

    public void setHasAttachments(boolean hasAttachments) {
        this.hasAttachments = hasAttachments;
    }

    public Long getReplyToId() {
        return replyToId;
    }

    public void setReplyToId(Long replyToId) {
        this.replyToId = replyToId;
    }

    public OffsetDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(OffsetDateTime readAt) {
        this.readAt = readAt;
    }
}
