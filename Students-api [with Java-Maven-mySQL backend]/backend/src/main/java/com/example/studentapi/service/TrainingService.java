package com.example.studentapi.service;

import com.example.studentapi.domain.dto.TrainingDTO;
import com.example.studentapi.domain.models.Training;

import java.util.List;

public interface TrainingService {

    Training getTrainingEntityById(Long id);

    TrainingDTO createTraining(TrainingDTO trainingDTO);

    TrainingDTO updateTraining(Long id, TrainingDTO trainingDTO);

    void deleteTraining(Long id);

    TrainingDTO getOneTraining(Long id);

    List<TrainingDTO> getAllTrainings();
}
