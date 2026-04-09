"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <nav className="w-full flex justify-between items-center py-4 px-8 bg-gray-900/80 backdrop-blur-sm fixed top-0 z-50">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">NexLearn</span>
        </Link>
        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/courses" className="hover:text-white">Courses</Link>
          <Link href="/about" className="text-white font-medium">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text mb-4">
            About NexLearn
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A Learning Management System built as part of the UE23CS352B Object Oriented Analysis &amp; Design course at PES University.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/40 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Tech Stack</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              {[
                "Spring Boot 3.4 — MVC Backend with JWT security",
                "Next.js 15 — React frontend with App Router",
                "MongoDB Atlas — NoSQL cloud database",
                "Tailwind CSS — Utility-first styling",
                "Framer Motion — Animations",
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-purple-400">✓</span>{t}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/40 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Use Cases Implemented</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              {[
                "UC-01: User Registration",
                "UC-02: Login / Logout (JWT)",
                "UC-03: Course Creation",
                "UC-04: Course Enrollment",
                "UC-05: Content Upload & Management",
                "UC-06: Learning Dashboard & Progress",
                "UC-07: Student Monitoring by Instructor",
                "UC-08: Search Courses",
                "UC-09: User Profile Management",
                "UC-10: Contact & Support",
              ].map((uc, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-green-400">✓</span>{uc}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/40 rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-purple-300">Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Laharish S", id: "PES2UG23CS298" },
              { name: "Kathit Joshi", id: "PES2UG23CS264" },
              { name: "Kavyansh Jain", id: "PES2UG23CS268" },
              { name: "Kumarchandra E", id: "PES2UG23CS292" },
            ].map((m, i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold mx-auto mb-2">
                  {m.name[0]}
                </div>
                <p className="text-white text-sm font-medium">{m.name}</p>
                <p className="text-gray-500 text-xs">{m.id}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <Link href="/courses">
            <motion.button whileHover={{ scale: 1.05 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
              Explore Courses
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
