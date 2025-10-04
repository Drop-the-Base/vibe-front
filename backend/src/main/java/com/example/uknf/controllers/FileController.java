package com.example.uknf.controllers;

import com.example.uknf.dtos.FileInfoResponse;
import com.example.uknf.services.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileStorageService service;

    public FileController(FileStorageService service) {
        this.service = service;
    }

    // List all files
    @GetMapping
    public List<FileInfoResponse> listFiles() {
        return service.listFiles();
    }

    // Get metadata for one file
    @GetMapping("/{filename}")
    public FileInfoResponse getFileInfo(@PathVariable String filename) throws IOException {
        return service.getFileInfo(filename);
    }

    // Download a file
    @GetMapping("/{filename}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
        Resource resource = service.loadFileAsResource(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // Upload (create) a file
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileInfoResponse uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @RequestParam(value = "tags", required = false) String tags
    ) throws IOException {
        return service.saveFile(file, category, version, uploadedBy, tags);
    }

    // Replace (update) an existing file
    @PutMapping(value = "/{filename}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileInfoResponse updateFile(
            @PathVariable String filename,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @RequestParam(value = "tags", required = false) String tags
    ) throws IOException {
        return service.updateFile(filename, file, category, version, uploadedBy, tags);
    }

    // Delete a file
    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> deleteFile(@PathVariable String filename) throws IOException {
        service.deleteFile(filename);
        return ResponseEntity.noContent().build();
    }
}
