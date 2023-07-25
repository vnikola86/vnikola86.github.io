package com.example.studentapi.service.impl;

import com.example.studentapi.domain.dto.StudentDTO;
import com.example.studentapi.domain.models.Student;
import com.example.studentapi.repository.StudentRepository;
import com.example.studentapi.service.StudentService;
import com.example.studentapi.service.mapper.StudentMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    private final StudentMapper studentMapper;

    public StudentServiceImpl(StudentRepository studentRepository, StudentMapper studentMapper) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
    }

    @Override
    public Student getStudentEntityById(Long id) {
        final Optional<Student> studentOptional = studentRepository.findById(id);

        if (studentOptional.isPresent()) {

            return studentOptional.get();

        }

        throw new IllegalArgumentException("Student with id: " + id + " does not exist.");
    }

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {

        final Student student = studentMapper.toEntity(studentDTO);
        final Optional<Student> byEmailAddress = studentRepository.findByEmailAddress( student.getEmailAddress() );
        final Optional<Student> byPhoneNumber = studentRepository.findByPhoneNumber( student.getPhoneNumber() );
        checkIfStudentAlreadyExist(studentDTO, byEmailAddress);
        checkIfStudentAlreadyExist(studentDTO, byPhoneNumber);
        return studentMapper.toDTO(studentRepository.save(student));
    }

    private static void checkIfStudentAlreadyExist(StudentDTO studentDTO, Optional<Student> byField) {

        if ( byField.isPresent() ) {

            throw new IllegalArgumentException("Student " + studentDTO.getFirstName() + " " + studentDTO.getLastName() + " already exists.");

        }

    }

    private static void checkIfStudentAlreadyExist(StudentDTO studentDTO, Optional<Student> byField, Long id) {

        if ( byField.isPresent() ) {

            if ( byField.get().getId() != id) {

                throw new IllegalArgumentException("Student " + studentDTO.getFirstName() + " " + studentDTO.getLastName() + " already exists.");
            }

        }

    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {

        Student student = this.getStudentEntityById(id);
        final Optional<Student> byEmailAddress = studentRepository.findByEmailAddress( studentDTO.getEmailAddress() );
        final Optional<Student> byPhoneNumber = studentRepository.findByPhoneNumber( studentDTO.getPhoneNumber() );
        checkIfStudentAlreadyExist(studentDTO, byEmailAddress, id);
        checkIfStudentAlreadyExist(studentDTO, byPhoneNumber, id);
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setEmailAddress(studentDTO.getEmailAddress());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student = studentRepository.save(student);
        return  studentMapper.toDTO(student);
    }

    @Override
    public void deleteStudent(Long id) {

        final Student student = this.getStudentEntityById(id);
        studentRepository.delete(student);
    }

    @Override
    public StudentDTO getOneStudent(Long id) {
        return studentMapper.toDTO(this.getStudentEntityById(id));
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentMapper.toDTOList(studentRepository.findAll());
    }
}
