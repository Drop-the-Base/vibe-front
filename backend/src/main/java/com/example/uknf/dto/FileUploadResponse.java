package com.example.uknf.dto;

public record FileUploadResponse(
        String id,
        String name,
        String size,
        String downloadUrl
) {
}
