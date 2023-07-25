
package com.example.studentapi.service.impl;

import com.example.studentapi.domain.dto.TrainingDTO;
import com.example.studentapi.domain.models.Training;
import com.example.studentapi.service.mapper.TrainingMapper;
import com.example.studentapi.service.TrainingService;
import com.example.studentapi.repository.TrainingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingServiceImpl implements TrainingService {

    private final TrainingRepository trainingRepository;

    public TrainingServiceImpl(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @Override
    public Training getTrainingEntityById(Long id) {
        Optional<Training> optionalTraining = trainingRepository.findById(id);
        return optionalTraining.orElse(null);
    }

    @Override
    public TrainingDTO createTraining(TrainingDTO trainingDTO) {
        Training training = TrainingMapper.INSTANCE.toEntity(trainingDTO);
        training = trainingRepository.save(training);
        return TrainingMapper.INSTANCE.toDTO(training);
    }

    @Override
    public TrainingDTO updateTraining(Long id, TrainingDTO trainingDTO) {
        Training existingTraining = getTrainingEntityById(id);
        if (existingTraining == null) {
            return null;
        }

        existingTraining.setTrainingName(trainingDTO.getTrainingName());
        trainingRepository.save(existingTraining);

        return TrainingMapper.INSTANCE.toDTO(existingTraining);
    }

    @Override
    public void deleteTraining(Long id) {
        trainingRepository.deleteById(id);
    }

    @Override
    public TrainingDTO getOneTraining(Long id) {
        Training training = getTrainingEntityById(id);
        if (training != null) {
            return TrainingMapper.INSTANCE.toDTO(training);
        } else {
            return null;
        }
    }

    @Override
    public List<TrainingDTO> getAllTrainings() {
        List<Training> trainings = trainingRepository.findAll();
        return trainings.stream()
                .map(TrainingMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }
}
