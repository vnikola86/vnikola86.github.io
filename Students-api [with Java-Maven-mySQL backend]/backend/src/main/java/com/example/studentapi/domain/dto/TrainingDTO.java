package com.example.studentapi.domain.dto;

import java.util.Objects;

public class TrainingDTO {

    private Long id;
    private String trainingName;

    public TrainingDTO() {
    }

    public TrainingDTO(Long id, String trainingName) {
        this.id = id;
        this.trainingName = trainingName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrainingName() {
        return trainingName;
    }

    public void setTrainingName(String trainingName) {
        this.trainingName = trainingName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TrainingDTO that = (TrainingDTO) o;
        return id.equals(that.id) && trainingName.equals(that.trainingName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainingName);
    }

    @Override
    public String toString() {
        return "TrainingDTO{" +
                "id=" + id +
                ", trainingName='" + trainingName + '\'' +
                '}';
    }
}
