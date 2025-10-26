package com.example.uknf.repository;

import com.example.uknf.domain.FaqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqQuestionRepository extends JpaRepository<FaqQuestion, Long> {
}
