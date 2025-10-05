package com.example.uknf.dto;

public record CaseNoteRequest(
        String author,
        String message,
        String type
) {
}
