package ooadproject.ooadproject.models;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "quiz")
public class Quiz {
    @Id
    private String id;
    @Field("courseId")
    private ObjectId courseId;
    @Field("questions")
    private List<Question> questions;

    public Quiz() {}

    public Quiz(ObjectId courseId, List<Question> questions) {
        this.courseId = courseId;
        this.questions = questions;
    }

    public String getId() { return id; }
    public ObjectId getCourseId() { return courseId; }
    public List<Question> getQuestions() { return questions; }

    public void setId(String id) { this.id = id; }
    public void setCourseId(ObjectId courseId) { this.courseId = courseId; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}
