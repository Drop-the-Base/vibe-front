package com.example.uknf.web;

import com.example.uknf.domain.LibraryFile;
import com.example.uknf.repository.LibraryFileRepository;
import com.example.uknf.service.FileStorageService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class LibraryController {

    private final LibraryFileRepository fileRepository;
    private final FileStorageService storageService;

    public LibraryController(LibraryFileRepository fileRepository, FileStorageService storageService) {
        this.fileRepository = fileRepository;
        this.storageService = storageService;
    }

    public record LibraryFileDto(
        Long id,
        String name,
        String type,
        String category,
        String version,
        String uploadedBy,
        String uploadedDate,
        long size,
        String tags,
        String accessLevel,
        boolean archived
    ) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public List<LibraryFileDto> listFiles() {
        return fileRepository.findAll().stream()
            .map(file -> new LibraryFileDto(
                file.getId(),
                file.getName(),
                file.getType(),
                file.getCategory(),
                file.getVersion(),
                file.getUploadedBy(),
                file.getUploadedAt() != null ? file.getUploadedAt().format(DATE_FORMAT) : null,
                file.getSizeBytes(),
                file.getTags(),
                file.getAccessLevel(),
                file.isArchived()
            ))
            .toList();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public LibraryFileDto uploadFile(
        @RequestPart("file") MultipartFile file,
        @RequestParam @NotBlank String name,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String version,
        @RequestParam(required = false) String uploadedBy,
        @RequestParam(required = false) String tags,
        @RequestParam(required = false) String accessLevel
    ) {
        String storedPath = storageService.store(file);
        LibraryFile entity = new LibraryFile();
        entity.setName(name);
        entity.setType(file.getContentType());
        entity.setCategory(category);
        entity.setVersion(version);
        entity.setUploadedBy(uploadedBy != null ? uploadedBy : "System");
        entity.setUploadedAt(OffsetDateTime.now());
        entity.setSizeBytes(file.getSize());
        entity.setTags(tags);
        entity.setAccessLevel(accessLevel != null ? accessLevel : "public");
        entity.setFilePath(storedPath);
        LibraryFile saved = fileRepository.save(entity);
        return new LibraryFileDto(
            saved.getId(),
            saved.getName(),
            saved.getType(),
            saved.getCategory(),
            saved.getVersion(),
            saved.getUploadedBy(),
            saved.getUploadedAt().format(DATE_FORMAT),
            saved.getSizeBytes(),
            saved.getTags(),
            saved.getAccessLevel(),
            saved.isArchived()
        );
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) throws IOException {
        LibraryFile file = fileRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono pliku"));
        byte[] content = storageService.read(file.getFilePath());
        ByteArrayResource resource = new ByteArrayResource(content);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
            .contentType(MediaType.parseMediaType(file.getType() != null ? file.getType() : MediaType.APPLICATION_OCTET_STREAM_VALUE))
            .contentLength(content.length)
            .body(resource);
    }
}
