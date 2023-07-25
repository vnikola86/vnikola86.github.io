package com.example.studentapi.service.mapper;

import com.example.studentapi.domain.dto.TrainingDTO;
import com.example.studentapi.domain.models.Training;
import org.springframework.stereotype.Service;

@Service
public class TrainingMapper implements EntityMapper<Training, TrainingDTO> {

    public static final TrainingMapper INSTANCE = new TrainingMapper();

    @Override
    public TrainingDTO toDTO(Training training) {
        return new TrainingDTO(training.getId(), training.getTrainingName());
    }

    @Override
    public Training toEntity(TrainingDTO trainingDTO) {
        return new Training(trainingDTO.getId(), trainingDTO.getTrainingName());
    }
}
