package com.example.uknf.service;

import com.example.uknf.dto.LibraryFileDto;
import com.example.uknf.dto.UpdateLibraryFileRequest;
import com.example.uknf.model.LibraryFile;
import com.example.uknf.model.LibraryFileVersion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class LibraryService {
    private final InMemoryDatabase db;
    private final IdService idService;
    private final Path uploadDir;

    public LibraryService(InMemoryDatabase db, IdService idService, @Value("${app.storage.upload-dir:uploads}") String uploadDir) throws IOException {
        this.db = db;
        this.idService = idService;
        this.uploadDir = Path.of(uploadDir);
        Files.createDirectories(this.uploadDir);
    }

    public List<LibraryFileDto> findAll() {
        return db.libraryFiles().values().stream().map(this::toDto).toList();
    }

    public Optional<LibraryFileDto> findById(String id) {
        return Optional.ofNullable(db.libraryFiles().get(id)).map(this::toDto);
    }

    public LibraryFileDto storeFile(MultipartFile file, String uploadedBy, String category, String accessLevel, List<String> tags, String changeNote) throws IOException {
        String id = idService.nextId("LIB");
        String originalName = file.getOriginalFilename();
        String extension = "dat";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.') + 1);
        }
        String filename = id + "." + extension;
        Path destination = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        LibraryFile libraryFile = new LibraryFile();
        libraryFile.setId(id);
        libraryFile.setName(originalName != null ? originalName : filename);
        libraryFile.setCategory(category);
        libraryFile.setVersion("v1");
        libraryFile.setUploadedBy(uploadedBy);
        libraryFile.setUploadedAt(Instant.now());
        libraryFile.setSize(readableFileSize(file.getSize()));
        libraryFile.setAccessLevel(accessLevel);
        libraryFile.setStoragePath(destination.toString());
        libraryFile.setTags(tags != null ? List.copyOf(tags) : List.of());
        libraryFile.getHistory().add(new LibraryFileVersion("v1", uploadedBy, Instant.now(), changeNote, destination.toString()));
        db.libraryFiles().put(id, libraryFile);
        return toDto(libraryFile);
    }

    public Optional<LibraryFileDto> update(String id, UpdateLibraryFileRequest request, String uploadedBy) {
        LibraryFile libraryFile = db.libraryFiles().get(id);
        if (libraryFile == null) {
            return Optional.empty();
        }
        if (request.name() != null) libraryFile.setName(request.name());
        if (request.category() != null) libraryFile.setCategory(request.category());
        if (request.version() != null) libraryFile.setVersion(request.version());
        if (request.accessLevel() != null) libraryFile.setAccessLevel(request.accessLevel());
        if (request.archived() != null) libraryFile.setArchived(request.archived());
        if (request.tags() != null) libraryFile.setTags(List.copyOf(request.tags()));
        libraryFile.setUpdatedAt(Instant.now());
        if (request.changeNote() != null) {
            libraryFile.getHistory().add(new LibraryFileVersion(
                    libraryFile.getVersion(),
                    uploadedBy,
                    Instant.now(),
                    request.changeNote(),
                    libraryFile.getStoragePath()
            ));
        }
        return Optional.of(toDto(libraryFile));
    }

    public boolean delete(String id) throws IOException {
        LibraryFile libraryFile = db.libraryFiles().remove(id);
        if (libraryFile == null) {
            return false;
        }
        if (libraryFile.getStoragePath() != null) {
            Files.deleteIfExists(Path.of(libraryFile.getStoragePath()));
        }
        return true;
    }

    public Resource loadAsResource(String id) {
        LibraryFile libraryFile = db.libraryFiles().get(id);
        if (libraryFile == null || libraryFile.getStoragePath() == null) {
            return null;
        }
        return new FileSystemResource(libraryFile.getStoragePath());
    }

    public LibraryFile resolve(String id) {
        return db.libraryFiles().get(id);
    }

    private LibraryFileDto toDto(LibraryFile file) {
        return new LibraryFileDto(
                file.getId(),
                file.getName(),
                file.getCategory(),
                file.getVersion(),
                file.getUploadedBy(),
                file.getUploadedAt(),
                file.getSize(),
                file.getAccessLevel(),
                file.getStoragePath(),
                file.isArchived(),
                List.copyOf(file.getTags()),
                List.copyOf(file.getHistory())
        );
    }

    private String readableFileSize(long size) {
        if (size <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.1f %s", size / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
