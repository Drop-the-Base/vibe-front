package com.example.uknf.entities;

public enum CaseStatus {
    DRAFT,
    NEW,
    IN_PROGRESS,
    TO_COMPLETE,
    CLOSED,
    CANCELLED;

    public String toDisplay() {
        return switch (this) {
            case DRAFT -> "draft";
            case NEW -> "new";
            case IN_PROGRESS -> "in_progress";
            case TO_COMPLETE -> "to_complete";
            case CLOSED -> "closed";
            case CANCELLED -> "cancelled";
        };
    }
}
