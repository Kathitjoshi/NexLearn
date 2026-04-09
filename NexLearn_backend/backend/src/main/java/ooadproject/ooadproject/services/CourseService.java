package ooadproject.ooadproject.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;
import ooadproject.ooadproject.models.Courses;
import ooadproject.ooadproject.repository.CourseRepository;
import java.util.List;
@Service
public class CourseService {
    @Autowired private CourseRepository courseRepository;
    public List<Courses> getAllCourses() { return courseRepository.findAll(); }
    public Courses getCourseById(String id) { return courseRepository.findById(id).orElse(null); }
    public List<Courses> getCoursesByInstructorId(String instructorId) {
        return courseRepository.findByInstructorId(new ObjectId(instructorId));
    }
    public List<Courses> searchCourses(String keyword) { return courseRepository.searchCourses(keyword); }
    public String createCourse(Courses course) { return courseRepository.save(course).getId(); }
    public Courses updateCourse(Courses course) { return courseRepository.save(course); }
    public void deleteCourse(String id) { courseRepository.deleteById(id); }
}
