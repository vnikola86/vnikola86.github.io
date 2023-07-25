package com.example.studentapi.controllers;

import com.example.studentapi.domain.dto.StudentDTO;
import com.example.studentapi.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class StudentsController {
    private final StudentService studentService;

    public StudentsController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    public List<StudentDTO> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/students/{id}")
    public StudentDTO getOneStudent(@PathVariable("id") Long id) {
        return studentService.getOneStudent(id);
    }


    @PutMapping("/students/{id}")
    public StudentDTO updateStudent(@PathVariable("id") Long id, @RequestBody StudentDTO studentDTO) {
        studentDTO = studentService.updateStudent(id, studentDTO);
        return studentDTO;
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
    }

    @PostMapping("/students")
    public StudentDTO createStudent(@RequestBody StudentDTO studentDTO) {
        studentDTO = studentService.createStudent(studentDTO);
        return studentDTO;
    }

}
