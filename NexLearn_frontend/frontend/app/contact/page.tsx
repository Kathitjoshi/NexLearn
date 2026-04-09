"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

const API = "http://localhost:8090";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    if (!name || !email || !subject || !message) { toast.error("All fields are required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! We will get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch { toast.error("Server error. Is the backend running?"); }
    finally { setSubmitting(false); }
  };

  const inputCls = "w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500";

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Minimal nav */}
      <nav className="w-full flex justify-between items-center py-4 px-8 bg-gray-900/80 backdrop-blur-sm fixed top-0 z-50">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">NexLearn</span>
        </Link>
        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/courses" className="hover:text-white">Courses</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="text-white font-medium">Contact</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text mb-3">
            Contact & Support
          </h1>
          <p className="text-gray-400 text-lg">Have a question or need help? We are here for you.</p>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "📧", title: "Email", detail: "support@nexlearn.edu", sub: "Response within 24 hours" },
            { icon: "📞", title: "Phone", detail: "+1 (555) 123-4567", sub: "Mon–Fri, 9am–5pm EST" },
            { icon: "📍", title: "Address", detail: "PES University, Bengaluru", sub: "Visit us on campus" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-gray-800/40 rounded-xl border border-gray-700 p-5 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-white text-sm mb-1">{item.detail}</p>
              <p className="text-gray-500 text-xs">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/40 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-5 text-purple-300">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject *</label>
                <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  placeholder="How can we help?" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message *</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  rows={5} placeholder="Describe your query..."
                  className={inputCls + " resize-none"} />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} type="submit" disabled={submitting}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium disabled:opacity-60">
                {submitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/40 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-5 text-purple-300">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I enroll in a course?", a: "Create an account as a Student, browse courses, and click Enroll on any course page." },
                { q: "Can I de-enroll from a course?", a: "Yes, from My Learning page — but only if you have not started any lessons yet." },
                { q: "How do I become an instructor?", a: "Register with the Instructor role. You can then create courses with lessons and quizzes." },
                { q: "Are there certificates?", a: "Complete all lessons and pass the quiz to earn a course completion badge." },
              ].map((faq, i) => (
                <div key={i} className="border-b border-gray-700 pb-4 last:border-0">
                  <h4 className="text-sm font-semibold text-white mb-1">{faq.q}</h4>
                  <p className="text-gray-400 text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
