package ooadproject.ooadproject.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.models.Courses;
import ooadproject.ooadproject.services.CourseService;
import java.util.*;

// UC-03: Course Creation  UC-08: Search Courses
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/courses")
public class CoursesController {
    @Autowired private CourseService courseService;

    // UC-08: Search or list all courses
    @GetMapping
    public ResponseEntity<List<Courses>> getAllCourses(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(courseService.searchCourses(search));
        }
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        Courses course = courseService.getCourseById(id);
        if (course == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(course);
    }

    // UC-07: Instructor's own courses
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<Courses>> getCoursesByInstructor(@PathVariable String instructorId) {
        return ResponseEntity.ok(courseService.getCoursesByInstructorId(instructorId));
    }

    // UC-03: Create course
    @PostMapping("/create")
    public ResponseEntity<String> createCourse(@RequestBody Courses course) {
        String id = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // UC-05: Update course (for content management)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable String id, @RequestBody Courses course) {
        course.setId(id);
        return ResponseEntity.ok(courseService.updateCourse(course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(Map.of("message", "Course deleted"));
    }
}
