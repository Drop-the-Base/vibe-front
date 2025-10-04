package com.example.uknf.service;

import com.example.uknf.config.FileStorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;

@Service
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService(FileStorageProperties properties) {
        this.storageLocation = Paths.get(properties.getUploadDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to initialize storage directory", e);
        }
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Plik nie może być pusty");
        }

        String originalName = file.getOriginalFilename();
        String sanitized = originalName != null ? originalName.replace("..", "") : "plik";
        String filename = OffsetDateTime.now().toEpochSecond() + "_" + sanitized;
        Path target = storageLocation.resolve(filename);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return target.toString();
        } catch (IOException e) {
            throw new IllegalStateException("Nie udało się zapisać pliku", e);
        }
    }

    public byte[] read(String path) throws IOException {
        Path filePath = Paths.get(path);
        return Files.readAllBytes(filePath);
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(storageLocation.toFile());
    }
}
