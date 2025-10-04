package com.example.uknf.entities;

public enum CasePriority {
    LOW,
    MEDIUM,
    HIGH;

    public String toDisplay() {
        return switch (this) {
            case LOW -> "low";
            case MEDIUM -> "medium";
            case HIGH -> "high";
        };
    }
}
