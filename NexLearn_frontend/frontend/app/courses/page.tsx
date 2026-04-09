"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Course } from "@/types";
import Navbar from "@/components/Navbar";

const API = "http://localhost:8090";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>({});

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    setIsAuthenticated(!!token);
    setUser(userData ? JSON.parse(userData) : {});

    fetch(`${API}/courses`)
      .then(r => r.json())
      .then(d => { setCourses(d); setFiltered(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // UC-08: Search courses (client-side filter; backend also supports ?search=)
  const handleSearch = (q: string) => {
    setSearch(q);
    if (!q.trim()) { setFiltered(courses); return; }
    setFiltered(courses.filter(c =>
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase())
    ));
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />

      <div className="relative pt-32 pb-12 px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            Explore Courses
          </h1>
          {/* UC-08 search bar */}
          <div className="relative max-w-xl mb-8">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text" value={search} onChange={e => handleSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          {search && (
            <p className="text-sm text-gray-400 mb-4">{filtered.length} result(s) for &quot;{search}&quot;</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-400 mb-6">Try a different search term.</p>
            <button onClick={() => handleSearch("")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((course, i) => (
              <motion.div key={course.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 flex flex-col md:flex-row overflow-hidden"
              >
                <div className="w-full md:w-56 h-40 md:h-auto bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-5xl opacity-30">📚</span>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">{course.difficulty}</span>
                    <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">{course.lessons} lessons</span>
                    <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">{course.hours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    
                    <Link href={`/courses/${course.id}`}>
                      <motion.button whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white hover:from-purple-600 hover:to-blue-600">
                        View Course
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
  );
}
