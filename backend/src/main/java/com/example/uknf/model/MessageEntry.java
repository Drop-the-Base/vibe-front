package com.example.uknf.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class MessageEntry {
    private String id;
    private String authorId;
    private String authorName;
    private String content;
    private Instant sentAt = Instant.now();
    private boolean internal;
    private List<MessageFileAttachment> attachments = new ArrayList<>();

    public MessageEntry() {
    }

    public MessageEntry(String id, String authorId, String authorName, String content, Instant sentAt, boolean internal) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.content = content;
        this.sentAt = sentAt;
        this.internal = internal;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isInternal() {
        return internal;
    }

    public void setInternal(boolean internal) {
        this.internal = internal;
    }

    public List<MessageFileAttachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<MessageFileAttachment> attachments) {
        this.attachments = attachments;
    }
}
