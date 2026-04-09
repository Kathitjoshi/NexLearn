"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Course } from "@/types";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API = "http://localhost:8090";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>({});

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser({});
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    setIsAuthenticated(!!token);
    setUser(userData ? JSON.parse(userData) : {});

    fetch(`${API}/courses`)
      .then((r) => r.json())
      .then((d) => setCourses(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />

      {/* Hero */}
      <div className="relative pt-32 pb-20 px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent z-0" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-700/30 rounded-full filter blur-3xl" />
        <div className="absolute top-60 -right-20 w-80 h-80 bg-blue-700/20 rounded-full filter blur-3xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"
          >
            Welcome to NexLearn
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl"
          >
            A full-stack Learning Management System. Instructors create courses, students learn and track progress.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <Link href="/courses">
              <motion.button whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
                Explore Courses
              </motion.button>
            </Link>
            {!isAuthenticated && (
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 rounded-md border border-gray-700 text-gray-300 font-medium hover:bg-gray-800">
                  Get Started
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Featured courses */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <Link href="/courses">
            <button className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800">
              View All
            </button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -8 }}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50"
              >
                <div className="h-40 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
                  <span className="text-5xl opacity-40">📚</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-white">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    
                    <Link href={`/courses/${course.id}`}>
                      <button className="px-3 py-1.5 rounded bg-purple-600/80 text-white text-sm hover:bg-purple-600">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 py-16 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: "👨‍🎓", value: "10,000+", label: "Students" },
            { icon: "📚", value: "200+", label: "Courses" },
            { icon: "👨‍🏫", value: "50+", label: "Instructors" },
            { icon: "🌎", value: "120+", label: "Countries" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-purple-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-8 text-center mt-0">
        <p className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-2">NexLearn</p>
        <p className="text-sm">© 2024 NexLearn. OOAD Mini Project – Team: Laharish, Kathit, Kavyansh, Kumarchandra</p>
      </footer>
    </div>
  );
}
