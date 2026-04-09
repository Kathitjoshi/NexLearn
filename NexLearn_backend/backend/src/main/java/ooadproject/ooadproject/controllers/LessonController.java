package ooadproject.ooadproject.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.models.Lessons;
import ooadproject.ooadproject.services.LessonService;
import java.util.*;

// UC-05: Content Upload & Management
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/lessons")
public class LessonController {
    @Autowired private LessonService lessonService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonById(@PathVariable String id) {
        Lessons lesson = lessonService.getLessonById(id);
        if (lesson == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(lesson);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lessons>> getLessonsByCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourseId(courseId));
    }

    @PostMapping("/create")
    public ResponseEntity<String> createLesson(@RequestBody Lessons lesson) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lessonService.createLesson(lesson));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable String id, @RequestBody Lessons lesson) {
        lesson.setId(id);
        return ResponseEntity.ok(lessonService.updateLesson(lesson));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable String id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok(Map.of("message", "Lesson deleted"));
    }
}
