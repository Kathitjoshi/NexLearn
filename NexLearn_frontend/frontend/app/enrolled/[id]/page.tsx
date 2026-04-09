"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Course, Lesson } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

const API = "http://localhost:8090";

interface LessonProgress {
  lessonId: string;
  completed: boolean;
}

export default function EnrolledCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  // key = lessonId hex string, value = true/false
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [checkedChapters, setCheckedChapters] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const [quizResponse, setQuizResponse] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  const fetchProgress = async (parsedUser: any, token: string) => {
    try {
      const res = await fetch(`${API}/lesson-progress/${parsedUser.id}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: LessonProgress[] = await res.json();
        const map: Record<string, boolean> = {};
        data.forEach(p => {
          // lessonId is now a plain hex string from backend
          if (p.lessonId && typeof p.lessonId === "string") {
            map[p.lessonId] = p.completed;
          }
        });
        setCompletedLessons(map);
      }
    } catch (err) {
      console.error("Error fetching progress", err);
    }
  };

  const fetchQuizResponse = async (parsedUser: any, token: string) => {
    try {
      const res = await fetch(`${API}/quiz/response/${id}/${parsedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQuizResponse(data && data.score !== undefined ? data : null);
      } else {
        setQuizResponse(null);
      }
    } catch {
      setQuizResponse(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    if (!token || !userData) { router.push("/login"); return; }
    const parsed = JSON.parse(userData);
    setUser(parsed);

    const loadAll = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`${API}/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/lessons/course/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (courseRes.ok) setCourse(await courseRes.json());
        if (lessonsRes.ok) {
          const l: Lesson[] = await lessonsRes.json();
          const sorted = [...l].sort((a, b) => a.order - b.order);
          setLessons(sorted);
          if (sorted.length > 0) {
            setSelectedLesson(sorted[0]);
            setSelectedChapter(sorted[0].chapters[0] || "");
            setExpandedLessons([sorted[0].id]);
          }
        }
        await fetchProgress(parsed, token);
        await fetchQuizResponse(parsed, token);
      } catch (err) {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [id]);

  // Count: only count lessons that actually exist in the lessons list
  const completedCount = lessons.filter(l => completedLessons[l.id] === true).length;
  const totalCount = lessons.length;

  const allChaptersChecked = (lesson: Lesson) =>
    lesson.chapters.every(ch => checkedChapters.has(`${lesson.id}-${ch}`));

  const allLessonsDone = () =>
    totalCount > 0 && completedCount === totalCount;

  const handleCompleteLesson = async () => {
    if (!selectedLesson || !user) return;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${API}/lesson-progress/complete/${user.id}/${id}/${selectedLesson.id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) {
        // Update local map immediately using the lesson's own id as key
        setCompletedLessons(prev => ({ ...prev, [selectedLesson.id]: true }));
        setCheckedChapters(prev => {
          const n = new Set(prev);
          selectedLesson.chapters.forEach(ch => n.delete(`${selectedLesson.id}-${ch}`));
          return n;
        });
        toast.success("Lesson marked as complete!");
        // Re-fetch from backend to stay in sync
        await fetchProgress(user, token!);
      } else {
        toast.error("Failed to mark lesson complete");
      }
    } catch {
      toast.error("Server error");
    }
    setConfirming(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/enrolled" className="text-purple-400 hover:text-purple-300 text-sm">← My Learning</Link>
          <h2 className="text-base font-bold mt-2 line-clamp-2">{course?.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {/* FIX: count against actual lesson list, not raw object values */}
            {completedCount}/{totalCount} lessons complete
          </p>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="p-3">
          {lessons.map((lesson, li) => (
            <div key={lesson.id} className="mb-2">
              <button
                onClick={() => setExpandedLessons(prev =>
                  prev.includes(lesson.id) ? prev.filter(x => x !== lesson.id) : [...prev, lesson.id]
                )}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {completedLessons[lesson.id] ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-gray-500">{li + 1}.</span>
                  )}
                  <span className={completedLessons[lesson.id] ? "text-green-400" : "text-white"}>
                    {lesson.title}
                  </span>
                </span>
                <span className="text-gray-500 text-xs">
                  {expandedLessons.includes(lesson.id) ? "▲" : "▼"}
                </span>
              </button>

              {expandedLessons.includes(lesson.id) && (
                <div className="pl-4 space-y-1 mt-1">
                  {lesson.chapters.map((ch, ci) => (
                    <div key={ci}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                        selectedLesson?.id === lesson.id && selectedChapter === ch
                          ? "bg-purple-600/30 border border-purple-500/50 text-white"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1"
                        onClick={() => { setSelectedLesson(lesson); setSelectedChapter(ch); }}>
                        <span>▶</span><span>{ch}</span>
                      </div>
                      {!completedLessons[lesson.id] && (
                        <input type="checkbox"
                          checked={checkedChapters.has(`${lesson.id}-${ch}`)}
                          onChange={() => {
                            const key = `${lesson.id}-${ch}`;
                            setCheckedChapters(prev => {
                              const n = new Set(prev);
                              n.has(key) ? n.delete(key) : n.add(key);
                              return n;
                            });
                          }}
                          className="accent-purple-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson && selectedChapter ? (
          <div className="p-8 max-w-4xl">
            <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center mb-6 border border-gray-700">
              <div className="text-center">
                <span className="text-5xl">▶</span>
                <p className="text-gray-400 mt-2 text-sm">Video content placeholder</p>
              </div>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">{selectedChapter}</h1>
                <p className="text-gray-400">{selectedLesson.title}</p>
              </div>
              {!completedLessons[selectedLesson.id] ? (
                <button
                  onClick={() => setConfirming(true)}
                  disabled={!allChaptersChecked(selectedLesson)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    allChaptersChecked(selectedLesson)
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {allChaptersChecked(selectedLesson) ? "Mark Lesson Complete" : "Check all chapters first"}
                </button>
              ) : (
                <span className="text-green-400 font-medium">✓ Lesson Complete</span>
              )}
            </div>

            <p className="text-gray-300">
              Viewing: <strong>{selectedChapter}</strong> from <strong>{selectedLesson.title}</strong>.
              Check every chapter checkbox in the sidebar, then click &quot;Mark Lesson Complete&quot;.
            </p>

            {/* Quiz — only after all lessons done */}
            {allLessonsDone() && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold mb-3">🏆 Course Quiz</h2>
                {quizResponse ? (
                  <div>
                    <p className="text-gray-300 mb-2">You completed this quiz.</p>
                    <p className="text-2xl font-bold mb-4">
                      Score: {quizResponse.score}/{quizResponse.answers?.length ?? "?"}{" "}
                      ({Math.round((quizResponse.score / (quizResponse.answers?.length || 1)) * 100)}%)
                    </p>
                    <Link href={`/enrolled/${id}/quiz`}>
                      <button className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600">
                        Retake Quiz
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-300 mb-4">
                      All lessons complete! Take the final quiz to finish the course.
                    </p>
                    <Link href={`/enrolled/${id}/quiz`}>
                      <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90">
                        Take Quiz
                      </button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chapter from the sidebar to begin.</p>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      {confirming && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Complete Lesson?</h3>
            <p className="text-gray-400 mb-5 text-sm">
              Mark &quot;{selectedLesson?.title}&quot; as complete? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)}
                className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800">
                Cancel
              </button>
              <button onClick={handleCompleteLesson}
                className="flex-1 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
