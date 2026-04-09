"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const API = "http://localhost:8090";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", password: "" });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const ud = localStorage.getItem("userData");
    if (!token || !ud) { router.push("/login"); return; }
    const parsed = JSON.parse(ud);
    setUser(parsed);
    setIsAuthenticated(true);
    setForm({ firstName: parsed.firstName, lastName: parsed.lastName, password: "" });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) { toast.error("Name fields are required"); return; }
    if (form.password && form.password.length < 6) { toast.error("Password must be at least 6 chars"); return; }
    setSaving(true);
    const token = localStorage.getItem("authToken");
    const body: any = { firstName: form.firstName, lastName: form.lastName };
    if (form.password) body.password = form.password;
    try {
      const res = await fetch(`${API}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) { toast.error("Update failed"); return; }
      const updated = await res.json();
      const newUser = { ...user, firstName: updated.firstName, lastName: updated.lastName };
      localStorage.setItem("userData", JSON.stringify(newUser));
      setUser(newUser);
      setForm(f => ({ ...f, password: "" }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Server error"); }
    finally { setSaving(false); }
  };

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
    </div>
  );

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} user={user} handleLogout={handleLogout} />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">My Profile</h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-purple-900/50 border border-purple-500/30 text-purple-300">{user.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { label: "Username", value: user.username },
              { label: "Email", value: user.email },
              { label: "User ID", value: user.id, mono: true },
              { label: "Role", value: user.role },
            ].map(item => (
              <div key={item.label} className="bg-gray-900/40 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                <p className={`text-white ${item.mono ? "font-mono text-xs break-all" : ""}`}>{item.value}</p>
              </div>
            ))}
          </div>
          {!editing ? (
            <motion.button whileHover={{ scale: 1.03 }} onClick={() => setEditing(true)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
              Edit Profile
            </motion.button>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-200">Update Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">First Name</label>
                  <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                  <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password <span className="text-gray-500">(leave blank to keep current)</span></label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button whileHover={{ scale: 1.03 }} type="submit" disabled={saving}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </motion.button>
                <button type="button" onClick={() => { setEditing(false); setForm(f => ({ ...f, password: "" })); }}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800">Cancel</button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
