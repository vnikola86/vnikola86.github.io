package com.example.studentapi.service.mapper;

import com.example.studentapi.domain.dto.StudentDTO;
import com.example.studentapi.domain.models.Student;
import org.springframework.stereotype.Service;

@Service
public class StudentMapper implements EntityMapper<Student, StudentDTO> {

    @Override
    public StudentDTO toDTO(Student student) {
        return new StudentDTO(student.getId(), student.getFirstName(), student.getLastName(), student.getDateOfBirth(), student.getEmailAddress(), student.getPhoneNumber());
    }

    @Override
    public Student toEntity(StudentDTO studentDTO) {
        return new Student(studentDTO.getId(), studentDTO.getFirstName(), studentDTO.getLastName(), studentDTO.getDateOfBirth(), studentDTO.getEmailAddress(), studentDTO.getPhoneNumber());
    }
}
