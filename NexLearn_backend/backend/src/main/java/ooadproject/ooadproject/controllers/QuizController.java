package ooadproject.ooadproject.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.models.*;
import ooadproject.ooadproject.services.QuizService;
import java.util.Map;

// UC-03 extension: Quiz per course
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/quiz")
public class QuizController {
    @Autowired private QuizService quizService;

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getQuiz(@PathVariable String courseId) {
        Quiz quiz = quizService.getQuizByCourseId(courseId);
        if (quiz == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "No quiz found for this course"));
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addQuiz(@RequestBody Quiz quiz) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.addQuiz(quiz));
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizResponse> submitQuiz(@RequestBody QuizResponse response) {
        return ResponseEntity.ok(quizService.submitQuiz(response));
    }

    @GetMapping("/response/{courseId}/{userId}")
    public ResponseEntity<?> getQuizResponse(@PathVariable String courseId, @PathVariable String userId) {
        QuizResponse response = quizService.getQuizResponse(courseId, userId);
        if (response == null) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "No quiz response found"));
        return ResponseEntity.ok(response);
    }
}
