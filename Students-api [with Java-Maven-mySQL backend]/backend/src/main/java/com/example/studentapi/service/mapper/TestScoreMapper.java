package com.example.studentapi.service.mapper;

import com.example.studentapi.domain.dto.TestScoreDTO;
import com.example.studentapi.domain.models.TestScore;
import org.springframework.stereotype.Service;

@Service
public class TestScoreMapper implements EntityMapper<TestScore, TestScoreDTO> {

    @Override
    public TestScore toEntity(TestScoreDTO testScoreDTO) {

        return new TestScore(testScoreDTO.getId(), testScoreDTO.getStudentId(), testScoreDTO.getTrainingId(), testScoreDTO.getScore());
    }

    @Override
    public TestScoreDTO toDTO(TestScore testScore) {

        return new TestScoreDTO(testScore.getId(), testScore.getStudentId(), testScore.getTrainingId(), testScore.getScore());
    }
}
