package com.example.uknf.repositories;

import com.example.uknf.entities.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByPublishedAtDesc();
}
