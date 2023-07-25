package com.example.studentapi.service.impl;

import com.example.studentapi.domain.dto.TestScoreDTO;
import com.example.studentapi.domain.models.TestScore;
import com.example.studentapi.repository.TestScoreRepository;
import com.example.studentapi.service.StudentService;
import com.example.studentapi.service.TestScoreService;
import com.example.studentapi.service.mapper.StudentMapper;
import com.example.studentapi.service.mapper.TestScoreMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestScoreServiceImpl implements TestScoreService {
    private final TestScoreRepository testScoreRepository;
    private final TestScoreMapper testScoreMapper;

    public TestScoreServiceImpl(TestScoreRepository testScoreRepository, TestScoreMapper testScoreMapper, StudentMapper studentMapper, StudentService studentService) {
        this.testScoreRepository = testScoreRepository;
        this.testScoreMapper = testScoreMapper;
    }

    @Override
    public List<TestScoreDTO> getAllTestScores() {
        final List<TestScore> all = testScoreRepository.findAll();
        return testScoreMapper.toDTOList(all);
    }

    @Override
    public TestScoreDTO createTestScore(TestScoreDTO testScoreDTO) {
        final Optional<TestScore> byStudentIdAndTrainingId = testScoreRepository.findByStudentIdAndTrainingId(testScoreDTO.getStudentId(), testScoreDTO.getTrainingId());
        checkIfTestScoreAlreadyExist(testScoreDTO, byStudentIdAndTrainingId);
        TestScore newTestScore = testScoreMapper.toEntity(testScoreDTO);
        newTestScore.setStudentId(testScoreDTO.getStudentId());
        newTestScore = testScoreRepository.save(newTestScore);
        return testScoreMapper.toDTO(newTestScore);
    }

    private static void checkIfTestScoreAlreadyExist(TestScoreDTO testScoreDTO, Optional<TestScore> byStudentIdAndTrainingId) {

        if (byStudentIdAndTrainingId.isPresent()) {

            if (byStudentIdAndTrainingId.get().getId() != testScoreDTO.getId()) {

                throw new IllegalArgumentException("Test score for student already exists.");

            }
        }
    }

    private static void checkIfTestScoreAlreadyExist(Optional<TestScore> byStudentIdAndTrainingId, Long id) {

        if (byStudentIdAndTrainingId.isPresent()) {

            if (byStudentIdAndTrainingId.get().getId() != id) {

                throw new IllegalArgumentException("Test score for student already exists.");

            }
        }
    }

    @Override
    public TestScoreDTO updateTestScore(Long id, TestScoreDTO testScoreDTO) {
        final Optional<TestScore> byStudentIdAndTrainingId = testScoreRepository.findByStudentIdAndTrainingId(testScoreDTO.getStudentId(), testScoreDTO.getTrainingId());
        checkIfTestScoreAlreadyExist(byStudentIdAndTrainingId, id);
        TestScore testScore = this.getOneTestScoreEntity(id);
        testScore.setStudentId(testScoreDTO.getStudentId());
        testScore.setTrainingId(testScoreDTO.getTrainingId());
        testScore.setScore(testScoreDTO.getScore());
        testScore = testScoreRepository.save(testScore);
        return testScoreMapper.toDTO(testScore);
    }

    private TestScore getOneTestScoreEntity(Long id) {
        final Optional<TestScore> testScoreOptional = testScoreRepository.findById(id);
        if (testScoreOptional.isPresent()) {
            return testScoreOptional.get();
        }
        throw new IllegalArgumentException("TestScore with id: " + id + " does not exist.");
    }

    @Override
    public TestScoreDTO getOneTestScore(Long id) {
        final TestScore testScore = this.getOneTestScoreEntity(id);
        return testScoreMapper.toDTO(testScore);
    }

    @Override
    public void deleteTestScore(Long id) {
        final TestScore testScore = this.getOneTestScoreEntity(id);
        testScoreRepository.delete(testScore);
    }

}
