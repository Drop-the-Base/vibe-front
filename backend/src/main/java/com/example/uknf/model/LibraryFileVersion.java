package com.example.uknf.model;

import java.time.Instant;

public class LibraryFileVersion {
    private String version;
    private String uploadedBy;
    private Instant uploadedAt;
    private String changeNote;
    private String storagePath;

    public LibraryFileVersion() {
    }

    public LibraryFileVersion(String version, String uploadedBy, Instant uploadedAt, String changeNote, String storagePath) {
        this.version = version;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;
        this.changeNote = changeNote;
        this.storagePath = storagePath;
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

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public String getChangeNote() {
        return changeNote;
    }

    public void setChangeNote(String changeNote) {
        this.changeNote = changeNote;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }
}
