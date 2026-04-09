package ooadproject.ooadproject.config;

import ooadproject.ooadproject.models.*;
import ooadproject.ooadproject.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.bson.types.ObjectId;

import java.util.Arrays;
import java.util.List;

/**
 * DataSeeder – runs once on startup.
 * If the users collection is empty, inserts sample data so the app
 * works immediately without any manual seeding step.
 *
 * Sample accounts created:
 *   Instructor  username=instructor1  password=password123
 *   Student     username=student1     password=password123
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository     userRepository;
    private final CourseRepository   courseRepository;
    private final LessonRepository   lessonRepository;
    private final QuizRepository     quizRepository;

    public DataSeeder(UserRepository userRepository,
                      CourseRepository courseRepository,
                      LessonRepository lessonRepository,
                      QuizRepository quizRepository) {
        this.userRepository   = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository   = quizRepository;
    }

    @Override
    public void run(String... args) {

        // Only seed if DB is completely empty
        if (userRepository.count() > 0) {
            System.out.println("[NexLearn] DB already has data – skipping seed.");
            return;
        }

        System.out.println("[NexLearn] Empty DB detected – seeding sample data...");

        // ── Users ─────────────────────────────────────────────────────────────
        Users instructor = new Users(
                "instructor1", "instructor@nexlearn.com", "password123",
                "INSTRUCTOR", "John", "Doe");
        userRepository.save(instructor);

        Users student = new Users(
                "student1", "student@nexlearn.com", "password123",
                "STUDENT", "Jane", "Smith");
        userRepository.save(student);

        // ── Course ────────────────────────────────────────────────────────────
        Courses course = new Courses(
                "Introduction to Java",
                "A beginner-friendly course covering Java fundamentals: OOP, collections, exceptions, and more.",
                instructor.getId(),
                "Beginner", 12, 3, "Free", 5);
        courseRepository.save(course);

        // ── Lessons ───────────────────────────────────────────────────────────
        Lessons l1 = new Lessons(
                new ObjectId(course.getId()),
                "Java Basics",
                new String[]{"Variables & Data Types", "Control Flow", "Methods"},
                1);
        lessonRepository.save(l1);

        Lessons l2 = new Lessons(
                new ObjectId(course.getId()),
                "Object Oriented Programming",
                new String[]{"Classes & Objects", "Inheritance", "Polymorphism"},
                2);
        lessonRepository.save(l2);

        Lessons l3 = new Lessons(
                new ObjectId(course.getId()),
                "Collections & Exceptions",
                new String[]{"ArrayList & HashMap", "Try-Catch-Finally", "Custom Exceptions"},
                3);
        lessonRepository.save(l3);

        // Update lesson count on course
        course.setLessons(3);
        courseRepository.save(course);

        // ── Quiz ──────────────────────────────────────────────────────────────
        Question q1 = new Question();
        q1.setQuestion("Which keyword is used to create a class in Java?");
        q1.setOptions(Arrays.asList("define", "class", "struct", "object"));
        q1.setAnswer("class");

        Question q2 = new Question();
        q2.setQuestion("What does OOP stand for?");
        q2.setOptions(Arrays.asList("Object Oriented Programming", "Open Operational Process",
                "Optional Object Pattern", "Ordered Object Pipeline"));
        q2.setAnswer("Object Oriented Programming");

        Question q3 = new Question();
        q3.setQuestion("Which collection allows key-value pairs in Java?");
        q3.setOptions(Arrays.asList("ArrayList", "LinkedList", "HashMap", "HashSet"));
        q3.setAnswer("HashMap");

        Quiz quiz = new Quiz(new ObjectId(course.getId()), List.of(q1, q2, q3));
        quizRepository.save(quiz);

        System.out.println("[NexLearn] Seed complete!");
        System.out.println("[NexLearn]   Instructor -> username: instructor1 / password: password123");
        System.out.println("[NexLearn]   Student    -> username: student1    / password: password123");
        System.out.println("[NexLearn]   Sample course 'Introduction to Java' with 3 lessons + quiz created.");
    }
}
