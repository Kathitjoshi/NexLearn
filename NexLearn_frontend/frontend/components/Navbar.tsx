"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarProps {
  isAuthenticated: boolean;
  user: any;
  handleLogout: () => void;
}

export default function Navbar({ isAuthenticated, user, handleLogout }: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-between items-center py-4 px-8 bg-gray-900/80 backdrop-blur-sm fixed top-0 z-50"
    >
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text"
        >
          NexLearn
        </motion.div>
      </Link>

      <div className="flex gap-8">
        <Link href="/courses" className="text-gray-300 hover:text-white transition-colors">
          Explore Courses
        </Link>
        {user?.role === "INSTRUCTOR" && (
          <Link href="/instructor" className="text-gray-300 hover:text-white transition-colors">
            Your Courses
          </Link>
        )}
        {user?.role === "STUDENT" && (
          <Link href="/enrolled" className="text-gray-300 hover:text-white transition-colors">
            My Learning
          </Link>
        )}
        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
          Contact
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white px-3 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/30">
            {user?.firstName}
          </span>
          <Link href="/profile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white hover:from-purple-600 hover:to-blue-600"
            >
              Profile
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Logout
          </motion.button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-md text-gray-300 border border-gray-700 hover:bg-gray-800"
            >
              Login
            </motion.button>
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
