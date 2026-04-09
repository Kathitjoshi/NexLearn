package ooadproject.ooadproject.controllers;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.models.LessonProgress;
import ooadproject.ooadproject.services.LessonProgressService;
import java.util.*;

// UC-06: Learning Dashboard & Progress Tracking
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/lesson-progress")
public class LessonProgressController {
    @Autowired private LessonProgressService lessonProgressService;

    @PostMapping("/complete/{userId}/{courseId}/{lessonId}")
    public ResponseEntity<?> markComplete(@PathVariable String userId,
                                          @PathVariable String courseId,
                                          @PathVariable String lessonId) {
        try {
            LessonProgress progress = lessonProgressService.markComplete(
                    new ObjectId(userId), new ObjectId(courseId), new ObjectId(lessonId));
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/{courseId}")
    public ResponseEntity<?> getCourseProgress(@PathVariable String userId,
                                                @PathVariable String courseId) {
        try {
            List<LessonProgress> list = lessonProgressService.findByUserIdAndCourseId(
                    new ObjectId(userId), new ObjectId(courseId));
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
