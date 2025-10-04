package com.example.uknf.entities;

public enum AnnouncementTargetType {
    ALL,
    GROUP,
    INDIVIDUAL;

    public String toDisplay() {
        return switch (this) {
            case ALL -> "all";
            case GROUP -> "group";
            case INDIVIDUAL -> "individual";
        };
    }
}
