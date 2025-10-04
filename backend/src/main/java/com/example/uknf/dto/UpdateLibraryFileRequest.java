package com.example.uknf.dto;

import java.util.List;

public record UpdateLibraryFileRequest(
        String name,
        String category,
        String version,
        String changeNote,
        String accessLevel,
        Boolean archived,
        List<String> tags
) {
}
