"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Course, Lesson, Users } from "@/types";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const API = "http://localhost:8090";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Users | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Users | null>(null);
  const [expanded, setExpanded] = useState<number[]>([0]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    setIsAuthenticated(!!token);
    const parsedUser = userData ? JSON.parse(userData) : null;
    setUser(parsedUser);

    const id = params.id as string;
    fetch(`${API}/courses/${id}`)
      .then(r => r.json())
      .then(async (c: Course) => {
        setCourse(c);
        // fetch instructor
        if (c.instructorId) {
          fetch(`${API}/users/${c.instructorId}`).then(r => r.json()).then(setInstructor).catch(() => {});
        }
        // fetch lessons
        fetch(`${API}/lessons/course/${id}`).then(r => r.json()).then((l: Lesson[]) =>
          setLessons([...l].sort((a, b) => a.order - b.order))
        ).catch(() => {});
        // check enrollment
        if (parsedUser?.id) {
          fetch(`${API}/enroll/${parsedUser.id}/${id}`).then(r => {
            if (r.ok) setEnrolled(true);
          }).catch(() => {});
        }
      })
      .catch(() => toast.error("Course not found"))
      .finally(() => setLoading(false));
  }, [params.id]);

  // UC-04: Enroll
  const handleEnroll = async () => {
    if (!user) { router.push("/login"); return; }
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API}/enroll/${user.id}/${params.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) { setEnrolled(true); toast.success("Enrolled successfully!"); }
    else if (res.status === 409) toast.error("Already enrolled");
    else toast.error("Enrollment failed");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500" />
    </div>
  );

  if (!course) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Course not found</h2>
      <Link href="/courses"><button className="px-6 py-3 rounded-lg bg-purple-600 text-white">Browse Courses</button></Link>
    </div>
  );

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />

      {/* Header */}
      <div className="relative pt-32 pb-12 px-8 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-2 py-1 bg-gray-700/50 rounded text-sm">{course.difficulty}</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded text-sm">{course.lessons} lessons</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded text-sm">{course.hours}h total</span>
              <span className="text-yellow-400">{"★".repeat(Math.floor(course.rating || 0))} {course.rating}</span>
            </div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl">{course.description}</p>
            {instructor && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold">
                  {instructor.firstName?.[0]}{instructor.lastName?.[0]}
                </div>
                <div>
                  <p className="font-medium">{instructor.firstName} {instructor.lastName}</p>
                  <p className="text-sm text-gray-400">Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* Enroll card */}
          <div className="lg:w-80 bg-gray-800/50 rounded-xl border border-gray-700 p-6 self-start sticky top-24">
            <div className="h-40 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg flex items-center justify-center mb-4">
              <span className="text-6xl opacity-30">📚</span>
            </div>
            <div className="text-2xl font-bold mb-4 text-green-400">🆓 Free Course</div>
            {user?.role === "INSTRUCTOR" ? (
              <button disabled className="w-full py-3 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed">
                Instructors cannot enroll
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: enrolled ? 1 : 1.02 }}
                onClick={handleEnroll}
                disabled={enrolled}
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  enrolled ? "bg-green-700 cursor-default" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                }`}
              >
                {enrolled ? "✓ Enrolled" : "Enroll Now"}
              </motion.button>
            )}
            {enrolled && (
              <Link href={`/enrolled/${params.id}`}>
                <button className="w-full mt-3 py-3 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-900/30">
                  Go to Course
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="border border-gray-700 rounded-lg overflow-hidden">
              <div
                className="bg-gray-800/70 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setExpanded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-sm text-gray-400">({lesson.chapters.length} chapters)</span>
                </div>
                <span className="text-gray-400">{expanded.includes(i) ? "−" : "+"}</span>
              </div>
              {expanded.includes(i) && (
                <div className="divide-y divide-gray-700/50">
                  {lesson.chapters.map((ch, ci) => (
                    <div key={ci} className="px-6 py-3 bg-gray-900/40 flex items-center gap-3">
                      <span className="text-gray-400">▶</span>
                      <span className="text-gray-300 text-sm">{ch}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {lessons.length === 0 && <p className="text-gray-400">No lessons added yet.</p>}
        </div>
      </div>
    </div>
  );
}
