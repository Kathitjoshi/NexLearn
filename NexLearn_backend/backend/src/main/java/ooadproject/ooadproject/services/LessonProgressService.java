package ooadproject.ooadproject.services;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ooadproject.ooadproject.models.LessonProgress;
import ooadproject.ooadproject.repository.LessonProgressRepository;
import java.util.List;
@Service
public class LessonProgressService {
    @Autowired private LessonProgressRepository lessonProgressRepository;
    public LessonProgress save(LessonProgress lp) { return lessonProgressRepository.save(lp); }
    public LessonProgress findByUserIdAndLessonId(ObjectId userId, ObjectId lessonId) {
        return lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId);
    }
    public List<LessonProgress> findByUserIdAndCourseId(ObjectId userId, ObjectId courseId) {
        return lessonProgressRepository.findByUserIdAndCourseId(userId, courseId);
    }
    public LessonProgress markComplete(ObjectId userId, ObjectId courseId, ObjectId lessonId) {
        LessonProgress progress = findByUserIdAndLessonId(userId, lessonId);
        if (progress == null) {
            progress = new LessonProgress(userId, courseId, lessonId, true);
        } else {
            progress.setCompleted(true);
        }
        return save(progress);
    }
}
