package ooadproject.ooadproject.models;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("enroll")
public class Enroll {
    @Id
    private String id;
    @Field("user_id")
    private String userId;
    @Field("course_id")
    private String courseId;
    @Field("enrolled_at")
    private LocalDateTime enrolledAt;

    public Enroll() {}

    public Enroll(String userId, String courseId) {
        this.userId = userId;
        this.courseId = courseId;
        this.enrolledAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getCourseId() { return courseId; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
}
