package com.example.studentapi.domain.models;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "trainings")
public class Training {

    @Id
    private Long id;

    @Column(name = "training_name", nullable = false, unique = true)
    private String trainingName;

    public Training() {
    }

    public Training(Long id, String trainingName) {
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
        Training training = (Training) o;
        return id.equals(training.id) && trainingName.equals(training.trainingName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainingName);
    }

    @Override
    public String toString() {
        return "Training{" +
                "id=" + id +
                ", trainingName='" + trainingName + '\'' +
                '}';
    }
}
