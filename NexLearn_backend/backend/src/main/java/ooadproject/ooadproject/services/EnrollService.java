package ooadproject.ooadproject.services;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ooadproject.ooadproject.models.Enroll;
import ooadproject.ooadproject.repository.EnrollRepository;
@Service
public class EnrollService {
    @Autowired private EnrollRepository enrollRepository;
    public Enroll save(Enroll enroll) { return enrollRepository.save(enroll); }
    public Enroll findByUserIdAndCourseId(String userId, String courseId) {
        return enrollRepository.findByUserIdAndCourseId(userId, courseId);
    }
    public List<Enroll> findByUserId(String userId) { return enrollRepository.findByUserId(userId); }
    public List<Enroll> findByCourseId(String courseId) { return enrollRepository.findByCourseId(courseId); }
    public void deleteEnrollment(String userId, String courseId) {
        enrollRepository.deleteByUserIdAndCourseId(userId, courseId);
    }
}
