package com.example.studentapi.repository;

import com.example.studentapi.domain.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmailAddress(String emailAddress);

    Optional<Student> findByPhoneNumber(String phoneNumber);

}
