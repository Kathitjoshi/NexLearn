package ooadproject.ooadproject.models;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "quiz_responses")
public class QuizResponse {
    @Id
    private String id;
    @Field("courseId")
    private String courseId;
    @Field("userId")
    private String userId;
    @Field("answers")
    private List<Answer> answers;
    @Field("score")
    private int score;

    public QuizResponse() {}

    public String getId() { return id; }
    public String getCourseId() { return courseId; }
    public String getUserId() { return userId; }
    public List<Answer> getAnswers() { return answers; }
    public int getScore() { return score; }

    public void setId(String id) { this.id = id; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }
    public void setScore(int score) { this.score = score; }
}
