// StudentRepository.java
package com.example.crud;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Custom query method
    Student findByUserName(String userName);
}
