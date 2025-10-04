package com.example.uknf.repositories;

import com.example.uknf.entities.FaqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqQuestionRepository extends JpaRepository<FaqQuestion, Integer> { }