package com.example.uknf.services;

import com.example.uknf.entities.FaqAnswer;
import com.example.uknf.repositories.FaqAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FaqAnswerService {
    @Autowired
    private FaqAnswerRepository faqAnswerRepository;

    public List<FaqAnswer> getAllAnswers() {
        return faqAnswerRepository.findAll();
    }

    public FaqAnswer getAnswerById(Integer id) {
        return faqAnswerRepository.findById(id).orElse(null);
    }

    public FaqAnswer createAnswer(FaqAnswer answer) {
        return faqAnswerRepository.save(answer);
    }

    public FaqAnswer updateAnswer(FaqAnswer answer) {
        return faqAnswerRepository.save(answer);
    }

    public void deleteAnswer(Integer id) {
        faqAnswerRepository.deleteById(id);
    }
}
