package com.studentmanagement;

import com.studentmanagement.model.Student;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.service.StudentService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceTest {

    @Test
    void getAllStudentsReturnsStudents() {
        StudentRepository repository = mock(StudentRepository.class);
        StudentService service = new StudentService(repository);

        when(repository.findAll()).thenReturn(List.of(
                new Student(1L, "Priya", "priya@example.com", "MSc IT", 22)
        ));

        List<Student> result = service.getAllStudents();

        assertEquals(1, result.size());
        assertEquals("Priya", result.get(0).getName());
        verify(repository).findAll();
    }

    @Test
    void createStudentSavesStudent() {
        StudentRepository repository = mock(StudentRepository.class);
        StudentService service = new StudentService(repository);
        Student student = new Student(null, "Aarav", "aarav@example.com", "BSc IT", 21);

        when(repository.save(student)).thenReturn(student);

        Student result = service.createStudent(student);

        assertEquals("Aarav", result.getName());
        verify(repository).save(student);
    }

    @Test
    void deleteStudentDeletesExistingStudent() {
        StudentRepository repository = mock(StudentRepository.class);
        StudentService service = new StudentService(repository);

        when(repository.existsById(1L)).thenReturn(true);

        service.deleteStudent(1L);

        verify(repository).deleteById(1L);
    }
}
