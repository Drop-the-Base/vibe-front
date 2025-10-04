package com.example.uknf.services;

import com.example.uknf.entities.FaqQuestion;
import com.example.uknf.repositories.FaqQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FaqQuestionService {
    @Autowired
    private FaqQuestionRepository faqQuestionRepository;

    public List<FaqQuestion> getQuestionsByStatus(String status) {
        return faqQuestionRepository.findByStatus(status);
    }

    public List<FaqQuestion> getAllQuestions() {
        return faqQuestionRepository.findAll();
    }

    public FaqQuestion createQuestion(FaqQuestion question) {
        return faqQuestionRepository.save(question);
    }

    public FaqQuestion updateQuestion(FaqQuestion question) {
        return faqQuestionRepository.save(question);
    }

    public void deleteQuestion(Integer id) {
        faqQuestionRepository.deleteById(id);
    }
}
