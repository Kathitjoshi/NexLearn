"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const API = "http://localhost:8090";

interface Question { question: string; options: string[]; answer: string; }
interface Quiz { id: string; courseId: string; questions: Question[]; }

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    if (!token || !userData) { router.push("/login"); return; }
    setUser(JSON.parse(userData));

    fetch(`${API}/quiz/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(q => {
        setQuiz(q);
        if (q) setAnswers(new Array(q.questions.length).fill(""));
      })
      .catch(() => toast.error("Failed to load quiz"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (answers.some(a => !a)) { toast.error("Please answer all questions"); return; }
    const token = localStorage.getItem("authToken");
    const payload = {
      courseId: id,
      userId: user.id,
      answers: quiz!.questions.map((q, i) => ({
        questionText: q.question,
        selectedAnswer: answers[i],
        correct: answers[i] === q.answer,
      })),
    };
    const res = await fetch(`${API}/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setScore(data.score);
      setSubmitted(true);
      toast.success("Quiz submitted!");
    } else {
      toast.error("Failed to submit quiz");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
    </div>
  );

  if (!quiz) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <p className="text-xl mb-4">No quiz available for this course.</p>
      <Link href={`/enrolled/${id}`}><button className="px-6 py-3 rounded-lg bg-purple-600 text-white">Back to Course</button></Link>
    </div>
  );

  return (
    <div className="bg-gray-950 text-white min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link href={`/enrolled/${id}`} className="text-purple-400 hover:text-purple-300 text-sm mb-6 block">← Back to Course</Link>
        <h1 className="text-3xl font-bold mb-2">Course Quiz</h1>
        <p className="text-gray-400 mb-8">{quiz.questions.length} question(s)</p>

        {submitted ? (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-purple-400 mb-2">
              {score}/{quiz.questions.length}
            </p>
            <p className="text-gray-400 mb-6">
              {Math.round((score / quiz.questions.length) * 100)}% – {score === quiz.questions.length ? "Perfect!" : score >= quiz.questions.length * 0.7 ? "Well done!" : "Keep practising!"}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/enrolled/${id}`}>
                <button className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800">Back to Course</button>
              </Link>
              <button onClick={() => { setSubmitted(false); setAnswers(new Array(quiz.questions.length).fill("")); }}
                className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600">Retake</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {quiz.questions.map((q, qi) => (
              <div key={qi} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <p className="font-semibold mb-4 text-lg">{qi + 1}. {q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, oi) => (
                    <label key={oi}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                        answers[qi] === opt
                          ? "border-purple-500 bg-purple-600/20"
                          : "border-gray-700 hover:border-gray-500 bg-gray-900/30"
                      }`}
                    >
                      <input type="radio" name={`q${qi}`} value={opt}
                        checked={answers[qi] === opt}
                        onChange={() => setAnswers(prev => { const n = [...prev]; n[qi] = opt; return n; })}
                        className="accent-purple-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:opacity-90">
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
