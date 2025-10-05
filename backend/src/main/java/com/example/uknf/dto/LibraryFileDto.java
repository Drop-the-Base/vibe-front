package com.example.uknf.dto;

import com.example.uknf.model.LibraryFileVersion;

import java.time.Instant;
import java.util.List;

public record LibraryFileDto(
        String id,
        String name,
        String category,
        String version,
        String uploadedBy,
        Instant uploadedAt,
        String size,
        String accessLevel,
        String storagePath,
        boolean archived,
        List<String> tags,
        List<LibraryFileVersion> history
) {
}
