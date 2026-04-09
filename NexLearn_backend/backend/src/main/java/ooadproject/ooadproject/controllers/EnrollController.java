package ooadproject.ooadproject.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.models.Enroll;
import ooadproject.ooadproject.services.EnrollService;
import java.util.*;

// UC-04: Course Enrollment
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/enroll")
public class EnrollController {
    @Autowired private EnrollService enrollService;

    // UC-04: Enroll student
    @PostMapping("/{userId}/{courseId}")
    public ResponseEntity<?> enrollUser(@PathVariable String userId, @PathVariable String courseId) {
        if (enrollService.findByUserIdAndCourseId(userId, courseId) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Already enrolled"));
        }
        Enroll saved = enrollService.save(new Enroll(userId, courseId));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{userId}/{courseId}")
    public ResponseEntity<?> checkEnrollment(@PathVariable String userId, @PathVariable String courseId) {
        Enroll enroll = enrollService.findByUserIdAndCourseId(userId, courseId);
        if (enroll == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","Not enrolled"));
        return ResponseEntity.ok(enroll);
    }

    // UC-06: Student's enrolled courses
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Enroll>> getUserEnrollments(@PathVariable String userId) {
        return ResponseEntity.ok(enrollService.findByUserId(userId));
    }

    // UC-07: Students enrolled in a course
    @GetMapping("/students/{courseId}")
    public ResponseEntity<List<Enroll>> getStudentsByCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(enrollService.findByCourseId(courseId));
    }

    @DeleteMapping("/{userId}/{courseId}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable String userId, @PathVariable String courseId) {
        enrollService.deleteEnrollment(userId, courseId);
        return ResponseEntity.ok(Map.of("message", "De-enrolled successfully"));
    }
}
