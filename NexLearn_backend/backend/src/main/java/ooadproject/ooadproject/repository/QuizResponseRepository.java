package ooadproject.ooadproject.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import ooadproject.ooadproject.models.QuizResponse;
public interface QuizResponseRepository extends MongoRepository<QuizResponse, String> {
    QuizResponse findByCourseIdAndUserId(String courseId, String userId);
}
