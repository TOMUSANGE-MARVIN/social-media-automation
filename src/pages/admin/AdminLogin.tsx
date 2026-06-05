import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { signIn, theme, toggleTheme } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const dark = theme === "dark";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 relative transition-colors duration-300
      ${dark ? "bg-slate-950" : "bg-slate-50"}`}>

      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className={`absolute top-5 right-5 size-9 flex items-center justify-center rounded-xl border transition-colors
          ${dark
            ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            : "bg-white border-slate-200 text-slate-500 hover:text-slate-900"
          }`}>
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>

      {/* Card */}
      <div className={`w-full max-w-sm rounded-2xl border p-8 shadow-2xl transition-colors duration-300
        ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 rounded-2xl bg-[#AAFF00] flex items-center justify-center mb-4 shadow-lg shadow-[#AAFF00]/20">
            <Shield className="size-7 text-black" />
          </div>
          <h1 className={`text-xl font-black ${dark ? "text-white" : "text-slate-900"}`}>Admin Access</h1>
          <p className={`text-sm mt-1 ${dark ? "text-slate-500" : "text-slate-500"}`}>
            Postify super admin panel
          </p>
        </div>

        {error && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm border
            ${dark
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
            }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide
              ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Email
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com" required autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors
                focus:border-[#AAFF00]/60 focus:ring-2 focus:ring-[#AAFF00]/10
                ${dark
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide
              ${dark ? "text-slate-400" : "text-slate-600"}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                className={`w-full px-4 py-3 pr-11 rounded-xl text-sm border outline-none transition-colors
                  focus:border-[#AAFF00]/60 focus:ring-2 focus:ring-[#AAFF00]/10
                  ${dark
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2
                  ${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-700"}`}>
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-[#AAFF00] text-black font-black text-sm
              hover:bg-[#c8ff33] active:scale-[0.98] transition-all disabled:opacity-60 mt-2 shadow-lg shadow-[#AAFF00]/20">
            {loading ? "Signing in…" : "Sign in to Admin"}
          </button>
        </form>

        <p className={`text-center text-xs mt-6 ${dark ? "text-slate-600" : "text-slate-400"}`}>
          Only authorised administrators may access this panel.
        </p>
      </div>
    </div>
  );
}
