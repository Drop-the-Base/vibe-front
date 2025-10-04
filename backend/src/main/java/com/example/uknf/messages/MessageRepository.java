package com.example.uknf.messages;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, Long> {

    default List<Message> findAllOrdered() {
        return findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    List<Message> findByThreadIdOrderByCreatedAtAsc(UUID threadId);
}
