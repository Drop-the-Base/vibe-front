package com.example.uknf.repository;

import com.example.uknf.domain.MessageThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageThreadRepository extends JpaRepository<MessageThread, Long> {
    Optional<MessageThread> findByThreadKey(String threadKey);
}
