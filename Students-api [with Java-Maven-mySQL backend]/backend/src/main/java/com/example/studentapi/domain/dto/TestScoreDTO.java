package com.example.studentapi.domain.dto;

import java.util.Objects;

public class TestScoreDTO {
    private Long id;

    private Long studentId;

    private Long trainingId;

    private Integer score;

    public TestScoreDTO() {
    }
    public TestScoreDTO(Long id, Long studentId, Long trainingId, Integer score) {
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

    public Long getStudentId() { return studentId; }

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
        TestScoreDTO that = (TestScoreDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(studentId, that.studentId) && Objects.equals(trainingId, that.trainingId) && Objects.equals(score, that.score);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, studentId, trainingId, score);
    }

    @Override
    public String toString() {
        return "TestScoreDTO{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", trainingId=" + trainingId +
                ", score=" + score +
                '}';
    }
}
