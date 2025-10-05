package com.example.uknf.model;

import java.time.Instant;

public class CaseTimelineEntry {
    private Instant timestamp;
    private String author;
    private String message;
    private String type;

    public CaseTimelineEntry() {
    }

    public CaseTimelineEntry(Instant timestamp, String author, String message, String type) {
        this.timestamp = timestamp;
        this.author = author;
        this.message = message;
        this.type = type;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
