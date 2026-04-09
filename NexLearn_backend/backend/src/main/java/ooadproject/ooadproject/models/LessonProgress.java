package ooadproject.ooadproject.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "lesson_progress")
public class LessonProgress {
    @Id
    private String id;

    @Field("user_id")
    private ObjectId userId;

    @Field("course_id")
    private ObjectId courseId;

    @Field("lesson_id")
    private ObjectId lessonId;

    @Field("completed")
    private boolean completed;

    public LessonProgress() {}

    public LessonProgress(ObjectId userId, ObjectId courseId, ObjectId lessonId, boolean completed) {
        this.userId = userId;
        this.courseId = courseId;
        this.lessonId = lessonId;
        this.completed = completed;
    }

    public String getId() { return id; }

    // FIX: return userId/courseId/lessonId as plain hex strings so frontend can use them as map keys
    public String getUserId() { return userId != null ? userId.toHexString() : null; }
    public String getCourseId() { return courseId != null ? courseId.toHexString() : null; }
    public String getLessonId() { return lessonId != null ? lessonId.toHexString() : null; }
    public boolean isCompleted() { return completed; }

    public void setId(String id) { this.id = id; }
    public void setUserId(ObjectId userId) { this.userId = userId; }
    public void setCourseId(ObjectId courseId) { this.courseId = courseId; }
    public void setLessonId(ObjectId lessonId) { this.lessonId = lessonId; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
