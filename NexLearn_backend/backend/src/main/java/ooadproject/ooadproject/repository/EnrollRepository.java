package ooadproject.ooadproject.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import ooadproject.ooadproject.models.Enroll;
public interface EnrollRepository extends MongoRepository<Enroll, String> {
    Enroll findByUserIdAndCourseId(String userId, String courseId);
    List<Enroll> findByUserId(String userId);
    List<Enroll> findByCourseId(String courseId);
    void deleteByUserIdAndCourseId(String userId, String courseId);
}
