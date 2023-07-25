package com.example.studentapi.controllers;

import com.example.studentapi.domain.dto.TrainingDTO;
import com.example.studentapi.service.TrainingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class TrainingsController {
    private final TrainingService trainingService;

    public TrainingsController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @GetMapping("/trainings")
    public List<TrainingDTO> getAllTrainings() {
        return trainingService.getAllTrainings();
    }

    @GetMapping("/trainings/{id}")
    public TrainingDTO getOneTraining(@PathVariable("id") Long id) {
        return trainingService.getOneTraining(id);
    }

    @PutMapping("/trainings/{id}")
    public TrainingDTO updateTraining(@PathVariable("id") Long id, @RequestBody TrainingDTO trainingDTO) {
        trainingDTO = trainingService.updateTraining(id, trainingDTO);
        return trainingDTO;
    }

    @DeleteMapping("/trainings/{id}")
    public void deleteTraining(@PathVariable("id") Long id) {
        trainingService.deleteTraining(id);
    }

    @PostMapping("/trainings")
    public TrainingDTO createTraining(@RequestBody TrainingDTO trainingDTO) {
        trainingDTO = trainingService.createTraining(trainingDTO);
        return trainingDTO;
    }
}
