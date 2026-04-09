package ooadproject.ooadproject.services;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ooadproject.ooadproject.models.*;
import ooadproject.ooadproject.repository.*;
import java.util.ArrayList;
import java.util.List;
@Service
public class QuizService {
    @Autowired private QuizRepository quizRepository;
    @Autowired private QuizResponseRepository quizResponseRepository;

    public Quiz getQuizByCourseId(String courseId) {
        return quizRepository.findByCourseId(new ObjectId(courseId));
    }
    public String addQuiz(Quiz quiz) { return quizRepository.save(quiz).getId(); }
    public QuizResponse submitQuiz(QuizResponse response) {
        Quiz quiz = quizRepository.findByCourseId(new ObjectId(response.getCourseId()));
        if (quiz == null) { response.setScore(0); return quizResponseRepository.save(response); }
        int score = 0;
        List<Answer> answers = response.getAnswers();
        List<Question> questions = quiz.getQuestions();
        for (int i = 0; i < Math.min(answers.size(), questions.size()); i++) {
            Answer a = answers.get(i);
            Question q = questions.get(i);
            boolean correct = q.getAnswer() != null && q.getAnswer().equals(a.getSelectedAnswer());
            a.setCorrect(correct);
            if (correct) score++;
        }
        response.setScore(score);
        // Upsert: overwrite previous response if exists
        QuizResponse existing = quizResponseRepository.findByCourseIdAndUserId(
                response.getCourseId(), response.getUserId());
        if (existing != null) { response.setId(existing.getId()); }
        return quizResponseRepository.save(response);
    }
    public QuizResponse getQuizResponse(String courseId, String userId) {
        return quizResponseRepository.findByCourseIdAndUserId(courseId, userId);
    }
}
