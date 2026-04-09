package ooadproject.ooadproject.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import ooadproject.ooadproject.models.Quiz;
import org.bson.types.ObjectId;
public interface QuizRepository extends MongoRepository<Quiz, String> {
    @Query("{ 'courseId': ?0 }")
    Quiz findByCourseId(ObjectId courseId);
}
