package com.example.uknf.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String filename;

    private String path;

    private Long size;

    private LocalDateTime createdAt = LocalDateTime.now();

    // New metadata fields
    private String category;

    private String version;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    // store tags as comma-separated values for simplicity
    private String tags;

    // Getters / setters
    public Long getId() { return id; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
