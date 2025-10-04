package com.example.uknf.dtos;

import com.example.uknf.entities.FileEntity;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

public record FileInfoResponse(
    Long id,
    String filename,
    String path,
    Long size,
    String createdAt,
    String category,
    String version,
    String uploadedBy,
    String tags
) {
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    public static FileInfoResponse from(FileEntity entity) {
        return new FileInfoResponse(
                entity.getId(),
                entity.getFilename(),
                entity.getPath(),
                entity.getSize(),
                Optional.ofNullable(entity.getCreatedAt())
                        .map(dt -> dt.atOffset(java.time.ZoneOffset.UTC).format(ISO_FORMATTER))
                        .orElse(null)
                ,
                entity.getCategory(),
                entity.getVersion(),
                entity.getUploadedBy(),
                entity.getTags()
        );
    }
}
