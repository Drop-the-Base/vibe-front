package com.example.uknf.model;

public class MessageFileAttachment {
    private String fileId;
    private String fileName;
    private String size;

    public MessageFileAttachment() {
    }

    public MessageFileAttachment(String fileId, String fileName, String size) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.size = size;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}
