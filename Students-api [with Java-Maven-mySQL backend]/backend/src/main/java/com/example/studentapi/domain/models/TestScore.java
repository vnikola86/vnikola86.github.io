package com.example.studentapi.domain.models;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "test_scores")
public class TestScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    @Column(name = "training_id", nullable = false)
    private Long trainingId;

    @Column(name = "score", nullable = false)
    private Integer score;


    public TestScore() {
    }

    public TestScore(Long id, Long studentId, Long trainingId, Integer score) {
        this.id = id;
        this.studentId = studentId;
        this.trainingId = trainingId;
        this.score = score;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTrainingId() {
        return trainingId;
    }

    public void setTrainingId(Long trainingId) {
        this.trainingId = trainingId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TestScore testScore = (TestScore) o;
        return Objects.equals(id, testScore.id) && Objects.equals(studentId, testScore.studentId) && Objects.equals(trainingId, testScore.trainingId) && Objects.equals(score, testScore.score);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, studentId, trainingId, score);
    }

    @Override
    public String toString() {
        return "TestScore{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", trainingId=" + trainingId +
                ", score=" + score +
                '}';
    }
}
