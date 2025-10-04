package com.example.uknf.dtos.announcements;

import com.example.uknf.entities.AnnouncementReader;

public record AnnouncementReaderResponse(
        String readerId,
        String readerName,
        String readerEntity,
        String readAt
) {
    public static AnnouncementReaderResponse from(AnnouncementReader reader) {
        return new AnnouncementReaderResponse(
                reader.getReaderId(),
                reader.getReaderName(),
                reader.getReaderEntity(),
                reader.getReadAt() != null ? reader.getReadAt().toString() : null
        );
    }
}
