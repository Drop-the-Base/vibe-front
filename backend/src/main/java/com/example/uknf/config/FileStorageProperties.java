package com.example.uknf.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file-storage")
public class FileStorageProperties {

    /**
     * Relative directory where uploaded files are persisted.
     */
    private String uploadDir = "uploads";

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
}
