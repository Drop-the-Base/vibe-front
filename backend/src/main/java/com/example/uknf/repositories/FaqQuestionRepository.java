package com.example.uknf.repositories;

import com.example.uknf.entities.FaqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Repository
public interface FaqQuestionRepository extends JpaRepository<FaqQuestion, Integer> {
    List<FaqQuestion> findByStatus(String status);
}
