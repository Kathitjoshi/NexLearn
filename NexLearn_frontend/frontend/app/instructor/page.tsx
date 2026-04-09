"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Course } from "@/types";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API = "http://localhost:8090";

export default function InstructorPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
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
    const parsed = JSON.parse(userData);
    if (parsed.role !== "INSTRUCTOR") { router.push("/"); return; }
    setIsAuthenticated(true);
    setUser(parsed);

    fetch(`${API}/courses/instructor/${parsed.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setCourses)
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
      <div className="relative pt-32 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Your Courses
            </h1>
            <Link href="/instructor/create">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
                + Create New Course
              </motion.button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
              <p className="text-gray-400 mb-6">Create your first course to start teaching.</p>
              <Link href="/instructor/create">
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Create First Course
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course, i) => (
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
                      <span className="px-2 py-1 bg-green-900/40 text-green-300 rounded text-xs">🆓 Free</span>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/instructor/courses/${course.id}/students`}>
                        <motion.button whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 rounded-md bg-indigo-700/80 text-white text-sm hover:bg-indigo-700">
                          👥 View Students
                        </motion.button>
                      </Link>
                      <Link href={`/courses/${course.id}`}>
                        <motion.button whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 rounded-md bg-gray-700/80 text-white text-sm hover:bg-gray-700">
                          👁 Preview
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
