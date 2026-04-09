package ooadproject.ooadproject.repository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import ooadproject.ooadproject.models.LessonProgress;
import java.util.List;
public interface LessonProgressRepository extends MongoRepository<LessonProgress, String> {
    LessonProgress findByUserIdAndLessonId(ObjectId userId, ObjectId lessonId);
    List<LessonProgress> findByUserId(ObjectId userId);
    List<LessonProgress> findByUserIdAndCourseId(ObjectId userId, ObjectId courseId);
}
