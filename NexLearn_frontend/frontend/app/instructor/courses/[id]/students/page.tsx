"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const API = "http://localhost:8090";

interface Student { id: string; username: string; email: string; firstName: string; lastName: string; role: string; }
interface Enrollment { id: string; userId: string; courseId: string; enrolledAt: string; }
interface Course { id: string; title: string; description: string; lessons: number; }
interface LessonProgress { lessonId: string; completed: boolean; }

function StudentCard({ student, enrollment, totalLessons }: {
  student: Student; enrollment: Enrollment; totalLessons: number;
}) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadProgress = async () => {
    if (loaded) { setShowDetails(p => !p); return; }
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API}/lesson-progress/${student.id}/${enrollment.courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setProgress(await res.json());
    setLoaded(true);
    setShowDetails(true);
  };

  const completed = progress.filter(p => p.completed).length;
  const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-purple-500/40 transition-all">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-lg">
          {student.firstName?.[0]}{student.lastName?.[0]}
        </div>
        <div>
          <h3 className="font-bold text-white">{student.firstName} {student.lastName}</h3>
          <p className="text-sm text-gray-400">@{student.username}</p>
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-300 mb-4">
        <p>📧 {student.email}</p>
        <p>📅 Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
      </div>

      <button onClick={loadProgress}
        className="w-full py-2 rounded-lg bg-indigo-700/60 hover:bg-indigo-700 text-white text-sm transition-all">
        {showDetails ? "Hide Progress" : "View Progress"}
      </button>

      {showDetails && loaded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Completion</span>
            <span className="text-white font-bold">{pct}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${pct}%` }} />
          </div>
          {progress.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">No lesson progress yet</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {progress.map((lp, i) => (
                <div key={i} className="flex justify-between items-center px-3 py-1.5 rounded bg-gray-700/40 text-xs">
                  <span className="text-gray-300">Lesson {i + 1}</span>
                  <span className={lp.completed ? "text-green-400" : "text-yellow-400"}>
                    {lp.completed ? "✓ Completed" : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          )}
          {pct === 100 && (
            <div className="mt-3 py-2 text-center rounded-lg bg-green-900/30 border border-green-700/40 text-green-400 text-sm font-medium">
              🎉 Course Completed!
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function CourseStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    setIsAuthenticated(true);
    setUser(parsed);

    const load = async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          fetch(`${API}/courses/${params.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/enroll/students/${params.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (cRes.ok) setCourse(await cRes.json());
        if (eRes.ok) {
          const enrollData: Enrollment[] = await eRes.json();
          setEnrollments(enrollData);
          const sData = await Promise.all(enrollData.map(e =>
            fetch(`${API}/users/${e.userId}`, { headers: { Authorization: `Bearer ${token}` } })
              .then(r => r.json()).catch(() => null)
          ));
          setStudents(sData.filter(Boolean));
        }
      } catch {
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-20">
        <Link href="/instructor" className="text-purple-400 hover:text-purple-300 text-sm mb-4 block">← Your Courses</Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            Enrolled Students
          </h1>
          <p className="text-xl text-gray-400 mt-1">{course?.title}</p>
          <p className="text-sm text-gray-500 mt-1">{students.length} student(s) enrolled</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👨‍🎓</div>
            <h3 className="text-2xl font-bold mb-2">No students enrolled yet</h3>
            <p className="text-gray-400">Share your course to attract students.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((s, i) => (
              <StudentCard key={s.id} student={s} enrollment={enrollments[i]}
                totalLessons={course?.lessons ?? 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
