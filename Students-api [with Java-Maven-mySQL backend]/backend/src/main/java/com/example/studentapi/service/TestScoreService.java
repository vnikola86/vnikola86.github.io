package com.example.studentapi.service;

import com.example.studentapi.domain.dto.TestScoreDTO;

import java.util.List;

public interface TestScoreService {
    List<TestScoreDTO> getAllTestScores();

    TestScoreDTO createTestScore(TestScoreDTO testScoreDTO);

    TestScoreDTO updateTestScore(Long id, TestScoreDTO testScoreDTO);

    TestScoreDTO getOneTestScore(Long id);

    void deleteTestScore(Long id);
}
