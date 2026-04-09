package ooadproject.ooadproject.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "lessons")
public class Lessons {
    @Id
    private String id;
    @Field("courseId")
    private ObjectId courseId;
    @Field("title")
    private String title;
    @Field("chapters")
    private String[] chapters;
    @Field("order")
    private int order;

    public Lessons() {}

    public Lessons(ObjectId courseId, String title, String[] chapters, int order) {
        this.courseId = courseId;
        this.title = title;
        this.chapters = chapters;
        this.order = order;
    }

    public String getId() { return id; }
    public ObjectId getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public String[] getChapters() { return chapters; }
    public int getOrder() { return order; }

    public void setId(String id) { this.id = id; }
    public void setCourseId(ObjectId courseId) { this.courseId = courseId; }
    public void setTitle(String title) { this.title = title; }
    public void setChapters(String[] chapters) { this.chapters = chapters; }
    public void setOrder(int order) { this.order = order; }
}
