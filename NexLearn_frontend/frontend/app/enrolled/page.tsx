"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Course, EnrolledCourse } from "@/types";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API = "http://localhost:8090";

export default function EnrolledPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [enrollData, setEnrollData] = useState<EnrolledCourse[]>([]);
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
    const userData = localStorage.getItem("userData");
    if (!token || !userData) { router.push("/login"); return; }
    setIsAuthenticated(true);
    const parsed = JSON.parse(userData);
    setUser(parsed);

    const fetchAll = async () => {
      try {
        // UC-06: get all enrollments for this student
        const enrollRes = await fetch(`${API}/enroll/user/${parsed.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!enrollRes.ok) return;
        const enrollments: EnrolledCourse[] = await enrollRes.json();

        // For each enrollment, check if there is any progress
        const enhanced = await Promise.all(enrollments.map(async (e) => {
          const progRes = await fetch(`${API}/lesson-progress/${parsed.id}/${e.courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const progData = progRes.ok ? await progRes.json() : [];
          return { ...e, hasProgress: Array.isArray(progData) && progData.length > 0 };
        }));
        setEnrollData(enhanced);

        // Fetch full course objects
        const courseObjects = await Promise.all(
          enhanced.map(e => fetch(`${API}/courses/${e.courseId}`).then(r => r.json()).catch(() => null))
        );
        setEnrolledCourses(courseObjects.filter(Boolean));
      } catch (err) {
        toast.error("Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeEnroll = async (courseId: string, hasProgress: boolean) => {
    if (hasProgress) { toast.error("Cannot de-enroll: you have lesson progress in this course"); return; }
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API}/enroll/${user.id}/${courseId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success("De-enrolled successfully");
    } else {
      toast.error("Failed to de-enroll");
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
      <div className="relative pt-32 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            My Learning
          </h1>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">No enrolled courses yet</h3>
              <p className="text-gray-400 mb-6">Browse and enroll in courses to start learning.</p>
              <Link href="/courses">
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Browse Courses
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledCourses.map((course, i) => {
                const ed = enrollData.find(e => e.courseId === course.id);
                return (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 flex flex-col md:flex-row overflow-hidden"
                  >
                    <div className="w-full md:w-56 h-40 md:h-auto bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl opacity-30">📚</span>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <p className="text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">{course.difficulty}</span>
                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">{course.lessons} lessons</span>
                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">{course.hours}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link href={`/enrolled/${course.id}`}>
                          <motion.button whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white">
                            Continue Learning
                          </motion.button>
                        </Link>
                        <button
                          onClick={() => handleDeEnroll(course.id, ed?.hasProgress || false)}
                          disabled={ed?.hasProgress}
                          title={ed?.hasProgress ? "Cannot de-enroll: you have progress" : "De-enroll"}
                          className={`px-4 py-2 rounded-md border text-sm ${
                            ed?.hasProgress
                              ? "border-gray-600 text-gray-500 cursor-not-allowed"
                              : "border-red-800/50 text-red-400 hover:bg-red-900/30"
                          }`}
                        >
                          De-enroll
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
