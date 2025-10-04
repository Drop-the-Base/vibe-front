package com.example.uknf.services;

import com.example.uknf.dto.FaqQuestionDto;
import com.example.uknf.entities.FaqQuestion;
import com.example.uknf.repositories.FaqQuestionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FaqQuestionService {
    @Autowired
    private FaqQuestionRepository faqQuestionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<FaqQuestion> getQuestionsByStatus(String status) {
        return faqQuestionRepository.findByStatus(status);
    }

    public List<FaqQuestion> getAllQuestions() {
        return faqQuestionRepository.findAll();
    }

    public FaqQuestion createQuestion(FaqQuestionDto questionDto) {
        FaqQuestion question = mapDtoToEntity(questionDto);
        return faqQuestionRepository.save(question);
    }

    public FaqQuestion updateQuestion(Integer id, FaqQuestionDto questionDto) {
        FaqQuestion question = mapDtoToEntity(questionDto);
        question.setId(id); // Ensure the ID is set for the update
        return faqQuestionRepository.save(question);
    }

    private FaqQuestion mapDtoToEntity(FaqQuestionDto questionDto) {
        FaqQuestion question = objectMapper.convertValue(questionDto, FaqQuestion.class);
        // Add any additional mapping logic here if needed
        return question;
    }

    public void deleteQuestion(Integer id) {
        faqQuestionRepository.deleteById(id);
    }
}
