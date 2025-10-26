package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "library_files")
public class LibraryFile extends BaseEntity {

    @Column(name = "file_name", nullable = false, length = 400)
    private String name;

    @Column(name = "file_type", length = 150)
    private String type;

    @Column(name = "category", length = 150)
    private String category;

    @Column(name = "version", length = 50)
    private String version;

    @Column(name = "uploaded_by", length = 200)
    private String uploadedBy;

    @Column(name = "uploaded_at")
    private OffsetDateTime uploadedAt;

    @Column(name = "size_bytes")
    private long sizeBytes;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "access_level", length = 50)
    private String accessLevel;

    @Column(name = "file_path", length = 1000)
    private String filePath;

    @Column(name = "archived")
    private boolean archived;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public OffsetDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(OffsetDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public void setSizeBytes(long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }
}
