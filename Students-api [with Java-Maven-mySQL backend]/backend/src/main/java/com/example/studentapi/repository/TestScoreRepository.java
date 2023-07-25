package com.example.studentapi.repository;

import com.example.studentapi.domain.models.TestScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestScoreRepository extends JpaRepository<TestScore, Long> {

    Optional<TestScore> findByStudentIdAndTrainingId(Long studentId, Long trainingId);

}
