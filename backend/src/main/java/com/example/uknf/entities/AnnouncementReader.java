package com.example.uknf.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class AnnouncementReader {

    @Column(name = "reader_id", length = 100)
    private String readerId;

    @Column(name = "reader_name", length = 200)
    private String readerName;

    @Column(name = "reader_entity", length = 200)
    private String readerEntity;

    @Column(name = "read_at", columnDefinition = "datetime2")
    private OffsetDateTime readAt;

    public AnnouncementReader(String readerId, String readerName, String readerEntity, OffsetDateTime readAt) {
        this.readerId = readerId;
        this.readerName = readerName;
        this.readerEntity = readerEntity;
        this.readAt = readAt;
    }

    public boolean matches(String otherReaderId, String otherEntity) {
        return Objects.equals(readerId, otherReaderId)
                && Objects.equals(readerEntity, otherEntity);
    }
}
