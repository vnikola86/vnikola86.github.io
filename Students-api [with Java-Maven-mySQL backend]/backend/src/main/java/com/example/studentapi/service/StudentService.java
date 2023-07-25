package com.example.studentapi.service;

import com.example.studentapi.domain.dto.StudentDTO;
import com.example.studentapi.domain.models.Student;

import java.util.List;

public interface StudentService {

    Student getStudentEntityById(Long id);

    StudentDTO createStudent(StudentDTO studentDTO);

    StudentDTO updateStudent(Long id, StudentDTO studentDTO);

    void deleteStudent(Long id);

    StudentDTO getOneStudent(Long id);

    List<StudentDTO> getAllStudents();
}
