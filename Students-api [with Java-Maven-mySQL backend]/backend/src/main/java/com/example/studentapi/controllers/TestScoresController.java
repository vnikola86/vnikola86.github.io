package com.example.studentapi.controllers;

import com.example.studentapi.domain.dto.TestScoreDTO;
import com.example.studentapi.service.TestScoreService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class TestScoresController {
    private final TestScoreService testScoreService;

    public TestScoresController(TestScoreService testScoreService) {
        this.testScoreService = testScoreService;
    }

    @GetMapping("/test_scores")
    public List<TestScoreDTO> getAllTestScores() {
        return testScoreService.getAllTestScores();
    }

    @GetMapping("/test_scores/{id}")
    public TestScoreDTO getOneTestScore(@PathVariable("id") Long id) {
        return testScoreService.getOneTestScore(id);
    }

    @PutMapping("/test_scores/{id}")
    public TestScoreDTO updateTestScore(@PathVariable("id") Long id, @RequestBody TestScoreDTO testScoreDTO) {
        testScoreDTO = testScoreService.updateTestScore(id, testScoreDTO);
        return testScoreDTO;
    }

    @DeleteMapping("/test_scores/{id}")
    public void deleteTestScore(@PathVariable("id") Long id) {
        testScoreService.deleteTestScore(id);
    }

    @PostMapping("/test_scores")
    public TestScoreDTO createTestScore(@RequestBody TestScoreDTO testScoreDTO) {
        testScoreDTO = testScoreService.createTestScore(testScoreDTO);
        return testScoreDTO;
    }

}
