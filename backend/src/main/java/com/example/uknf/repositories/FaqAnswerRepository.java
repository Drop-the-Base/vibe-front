package com.example.uknf.repositories;

import com.example.uknf.entities.FaqAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqAnswerRepository extends JpaRepository<FaqAnswer, Integer> {
    List<FaqAnswer> findByQuestion_Id(Integer questionId);
}
