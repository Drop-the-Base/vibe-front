package com.example.uknf.controller;

import com.example.uknf.dto.FileUploadResponse;
import com.example.uknf.dto.LibraryFileDto;
import com.example.uknf.dto.UpdateLibraryFileRequest;
import com.example.uknf.service.LibraryService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {
    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping
    public List<LibraryFileDto> listFiles() {
        return libraryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibraryFileDto> getFile(@PathVariable String id) {
        return libraryService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestPart("file") MultipartFile file,
                                                         @RequestPart("uploadedBy") @NotBlank String uploadedBy,
                                                         @RequestPart(value = "category", required = false) String category,
                                                         @RequestPart(value = "accessLevel", required = false) String accessLevel,
                                                         @RequestPart(value = "tags", required = false) List<String> tags,
                                                         @RequestPart(value = "changeNote", required = false) String changeNote) throws IOException {
        LibraryFileDto dto = libraryService.storeFile(file, uploadedBy, category, accessLevel, tags, changeNote);
        return ResponseEntity.ok(new FileUploadResponse(dto.id(), dto.name(), dto.size(), "/api/library/" + dto.id() + "/download"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryFileDto> updateFile(@PathVariable String id, @RequestBody UpdateLibraryFileRequest request) {
        return libraryService.update(id, request, "api").map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id) throws IOException {
        return libraryService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable String id) {
        Resource resource = libraryService.loadAsResource(id);
        if (resource == null || !resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFilename())
                .body(resource);
    }
}
