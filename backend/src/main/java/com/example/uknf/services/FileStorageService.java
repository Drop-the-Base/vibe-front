package com.example.uknf.services;


import com.example.uknf.dtos.FileInfoResponse;
import com.example.uknf.entities.FileEntity;
import com.example.uknf.repositories.FileRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");
    private final FileRepository fileRepository;

    public FileStorageService(FileRepository fileRepository) throws IOException {
        this.fileRepository = fileRepository;
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }
    }

    public List<FileInfoResponse> listFiles() {
        // Prefer metadata from DB; include filesystem-only files as fallback
        List<FileInfoResponse> fromDb = fileRepository.findAll().stream()
                .map(FileInfoResponse::from)
                .collect(Collectors.toList());

        try {
            List<FileInfoResponse> fromFs = Files.list(root)
                    .filter(Files::isRegularFile)
                    .map(path -> {
                        String filename = path.getFileName().toString();
                        return fileRepository.findByFilename(filename)
                                .map(FileInfoResponse::from)
                                .orElse(new FileInfoResponse(null, filename, path.toAbsolutePath().toString(), getFileSize(path), null, null, null, null, null));
                    })
                    .collect(Collectors.toList());

            // Merge: prefer DB entries (by filename), but include any FS-only files
            Map<String, FileInfoResponse> map = new java.util.LinkedHashMap<>();
            for (FileInfoResponse r : fromDb) map.put(r.filename(), r);
            for (FileInfoResponse r : fromFs) map.putIfAbsent(r.filename(), r);
            return new java.util.ArrayList<>(map.values());
        } catch (IOException e) {
            throw new RuntimeException("Failed to list files", e);
        }
    }

    public FileInfoResponse getFileInfo(String filename) throws IOException {
        // Try DB first
        return fileRepository.findByFilename(filename)
                .map(FileInfoResponse::from)
                .orElseGet(() -> {
                    Path file = root.resolve(filename);
                    if (!Files.exists(file)) throw new RuntimeException("File not found: " + filename);
                    return new FileInfoResponse(null, filename, file.toAbsolutePath().toString(), getFileSize(file), null, null, null, null, null);
                });
    }

    public FileInfoResponse saveFile(MultipartFile file, String category, String version, String uploadedBy, String tags) throws IOException {
        String filename = file.getOriginalFilename();
        Path destination = root.resolve(filename);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        // persist metadata
        FileEntity entity = fileRepository.findByFilename(filename).orElseGet(FileEntity::new);
        entity.setFilename(filename);
        entity.setPath(destination.toAbsolutePath().toString());
        entity.setSize(file.getSize());
        entity.setCategory(category);
        entity.setVersion(version);
        entity.setUploadedBy(uploadedBy);
        entity.setTags(tags);
        FileEntity saved = fileRepository.save(entity);
        return FileInfoResponse.from(saved);
    }

    public FileInfoResponse updateFile(String filename, MultipartFile newFile, String category, String version, String uploadedBy, String tags) throws IOException {
        Path destination = root.resolve(filename);
        Files.copy(newFile.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        FileEntity entity = fileRepository.findByFilename(filename).orElseGet(FileEntity::new);
        entity.setFilename(filename);
        entity.setPath(destination.toAbsolutePath().toString());
        entity.setSize(newFile.getSize());
        entity.setCategory(category);
        entity.setVersion(version);
        entity.setUploadedBy(uploadedBy);
        entity.setTags(tags);
        FileEntity saved = fileRepository.save(entity);
        return FileInfoResponse.from(saved);
    }

    public void deleteFile(String filename) throws IOException {
        Path file = root.resolve(filename);
        Files.deleteIfExists(file);
    }

    public Resource loadFileAsResource(String filename) throws IOException {
        Path file = root.resolve(filename);
        if (!Files.exists(file)) throw new NoSuchFileException(filename);
        return new FileSystemResource(file);
    }

    private long getFileSize(Path path) {
        try {
            return Files.size(path);
        } catch (IOException e) {
            return 0L;
        }
    }
}