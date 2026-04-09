"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const API = "http://localhost:8090";

type CourseForm = { title: string; description: string; difficulty: string; hours: string };
type LessonForm = { title: string; chapters: string[] };
type QuestionForm = { question: string; options: string[]; answerIndex: number };

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courseId, setCourseId] = useState("");

  const [courseForm, setCourseForm] = useState<CourseForm>({
    title: "", description: "", difficulty: "Beginner", hours: "10",
  });
  const [lessons, setLessons] = useState<LessonForm[]>([{ title: "", chapters: [""] }]);
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { question: "", options: ["", "", "", ""], answerIndex: 0 },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const ud = localStorage.getItem("userData");
    if (!token || !ud) { router.push("/login"); return; }
    const parsed = JSON.parse(ud);
    if (parsed.role !== "INSTRUCTOR") { router.push("/"); return; }
    setIsAuthenticated(true);
    setUser(parsed);
  }, []);

  const addLesson = () => setLessons(p => [...p, { title: "", chapters: [""] }]);
  const removeLesson = (i: number) => setLessons(p => p.filter((_, idx) => idx !== i));
  const updateLessonTitle = (i: number, v: string) =>
    setLessons(p => p.map((l, idx) => idx === i ? { ...l, title: v } : l));
  const addChapter = (li: number) =>
    setLessons(p => p.map((l, idx) => idx === li ? { ...l, chapters: [...l.chapters, ""] } : l));
  const removeChapter = (li: number, ci: number) =>
    setLessons(p => p.map((l, idx) =>
      idx === li ? { ...l, chapters: l.chapters.filter((_, c) => c !== ci) } : l));
  const updateChapter = (li: number, ci: number, v: string) =>
    setLessons(p => p.map((l, idx) =>
      idx === li ? { ...l, chapters: l.chapters.map((c, cIdx) => cIdx === ci ? v : c) } : l));

  const addQuestion = () =>
    setQuestions(p => [...p, { question: "", options: ["", "", "", ""], answerIndex: 0 }]);
  const removeQuestion = (i: number) => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, v: string) =>
    setQuestions(p => p.map((q, idx) => idx === i ? { ...q, question: v } : q));
  const updateOption = (qi: number, oi: number, v: string) =>
    setQuestions(p => p.map((q, idx) =>
      idx === qi ? { ...q, options: q.options.map((o, oIdx) => oIdx === oi ? v : o) } : q));
  const updateAnswer = (qi: number, ai: number) =>
    setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, answerIndex: ai } : q));

  const submitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, hours } = courseForm;
    if (!title || !description || !hours) { toast.error("All fields required"); return; }
    if (title.length < 5) { toast.error("Title must be at least 5 characters"); return; }
    if (description.length < 20) { toast.error("Description must be at least 20 characters"); return; }
    setStep(2);
  };

  const submitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const l of lessons) {
      if (!l.title) { toast.error("All lesson titles required"); return; }
      for (const ch of l.chapters) if (!ch) { toast.error("All chapter names required"); return; }
    }
    setSubmitting(true);
    const token = localStorage.getItem("authToken");
    try {
      const cRes = await fetch(`${API}/courses/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: courseForm.title,
          description: courseForm.description,
          difficulty: courseForm.difficulty,
          hours: parseInt(courseForm.hours),
          price: "Free",
          instructorId: user.id,
          lessons: lessons.length,
          rating: 5,
        }),
      });
      if (!cRes.ok) throw new Error("Course creation failed");
      const newCourseId = await cRes.text();
      setCourseId(newCourseId);

      await Promise.all(lessons.map((l, i) =>
        fetch(`${API}/lessons/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: l.title, chapters: l.chapters, courseId: newCourseId, order: i + 1 }),
        })
      ));
      toast.success("Course and lessons created!");
      setStep(3);
    } catch {
      toast.error("Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  const submitStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const q of questions) {
      if (!q.question) { toast.error("All questions required"); return; }
      for (const o of q.options) if (!o) { toast.error("All options required"); return; }
    }
    setSubmitting(true);
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API}/quiz/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          courseId,
          questions: questions.map(q => ({
            question: q.question,
            options: q.options,
            answer: q.options[q.answerIndex],
          })),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Quiz added! Course is live.");
      router.push("/instructor");
    } catch {
      toast.error("Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500";

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-10">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > s ? "bg-green-600" : step === s ? "bg-purple-600" : "bg-gray-700"
              }`}>{step > s ? "✓" : s}</div>
              {s < 3 && <div className={`h-0.5 w-16 ${step > s ? "bg-green-600" : "bg-gray-700"}`} />}
            </div>
          ))}
          <span className="ml-2 text-gray-400 text-sm">
            {step === 1 ? "Course Details" : step === 2 ? "Lessons & Chapters" : "Quiz"}
          </span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Course Information
            </h1>
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/30 border border-green-700/50 text-green-300 text-sm">
              🆓 All courses on NexLearn are <strong>free</strong> — no payment gateway needed.
            </div>
            <form onSubmit={submitStep1} className="space-y-5 bg-gray-800/40 p-6 rounded-xl border border-gray-700">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Course Title *</label>
                <input value={courseForm.title}
                  onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                  placeholder="e.g. Java for Beginners" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description *</label>
                <textarea value={courseForm.description}
                  onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                  rows={4} placeholder="Describe what students will learn (min 20 chars)..."
                  className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Difficulty</label>
                  <select value={courseForm.difficulty}
                    onChange={e => setCourseForm({...courseForm, difficulty: e.target.value})}
                    className={inputCls}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Duration (hours)</label>
                  <input type="number" min={1} value={courseForm.hours}
                    onChange={e => setCourseForm({...courseForm, hours: e.target.value})}
                    className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <motion.button whileHover={{ scale: 1.03 }} type="submit"
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
                  Continue to Lessons →
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Lessons & Chapters
            </h1>
            <form onSubmit={submitStep2} className="space-y-4">
              {lessons.map((lesson, li) => (
                <div key={li} className="bg-gray-800/40 p-5 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-purple-300">Lesson {li + 1}</span>
                    {lessons.length > 1 && (
                      <button type="button" onClick={() => removeLesson(li)}
                        className="text-red-400 hover:text-red-300 text-sm">✕ Remove</button>
                    )}
                  </div>
                  <input value={lesson.title} onChange={e => updateLessonTitle(li, e.target.value)}
                    placeholder="Lesson title" className={inputCls + " mb-3"} />
                  <div className="space-y-2 pl-4">
                    {lesson.chapters.map((ch, ci) => (
                      <div key={ci} className="flex gap-2">
                        <input value={ch} onChange={e => updateChapter(li, ci, e.target.value)}
                          placeholder={`Chapter ${ci + 1}`} className={inputCls} />
                        {lesson.chapters.length > 1 && (
                          <button type="button" onClick={() => removeChapter(li, ci)}
                            className="text-red-400 px-2 hover:text-red-300">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addChapter(li)}
                    className="mt-3 text-sm text-purple-400 hover:text-purple-300">+ Add Chapter</button>
                </div>
              ))}
              <button type="button" onClick={addLesson}
                className="w-full py-3 border border-dashed border-gray-600 rounded-xl text-purple-400 hover:border-purple-500 hover:bg-purple-900/10">
                + Add Lesson
              </button>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800">← Back</button>
                <motion.button whileHover={{ scale: 1.03 }} type="submit" disabled={submitting}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium disabled:opacity-60">
                  {submitting ? "Creating..." : "Create Course & Continue →"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Course Quiz
            </h1>
            <p className="text-gray-400 mb-6 text-sm">Add quiz questions students answer after completing all lessons.</p>
            <form onSubmit={submitStep3} className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="bg-gray-800/40 p-5 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-purple-300">Question {qi + 1}</span>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qi)}
                        className="text-red-400 hover:text-red-300 text-sm">✕ Remove</button>
                    )}
                  </div>
                  <input value={q.question} onChange={e => updateQuestion(qi, e.target.value)}
                    placeholder="Enter question" className={inputCls + " mb-3"} />
                  <p className="text-xs text-gray-400 mb-2">Options — click radio button to mark correct answer:</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={`flex gap-2 items-center p-2 rounded-lg border ${
                        q.answerIndex === oi ? "border-green-500 bg-green-900/20" : "border-gray-700"
                      }`}>
                        <input type="radio" name={`ans-${qi}`} checked={q.answerIndex === oi}
                          onChange={() => updateAnswer(qi, oi)} className="accent-green-500" />
                        <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 bg-transparent text-white focus:outline-none text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addQuestion}
                className="w-full py-3 border border-dashed border-gray-600 rounded-xl text-purple-400 hover:border-purple-500 hover:bg-purple-900/10">
                + Add Question
              </button>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800">← Back</button>
                <motion.button whileHover={{ scale: 1.03 }} type="submit" disabled={submitting}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium disabled:opacity-60">
                  {submitting ? "Saving Quiz..." : "Finish & Publish Course ✓"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
