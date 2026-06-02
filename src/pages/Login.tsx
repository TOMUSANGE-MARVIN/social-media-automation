import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(name, email, password);
            } else {
                await signIn(email, password);
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4"
            style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, #AAFF0015 0%, transparent 70%)" }}>

            {/* Subtle grid texture */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-3">
                        <span className="size-8 rounded-full bg-[#AAFF00] flex items-center justify-center">
                            <span className="size-3 rounded-full bg-black" />
                        </span>
                        <span className="text-2xl font-black text-white tracking-tight">Postify</span>
                    </Link>
                    <p className="text-white/40 text-sm">
                        {isSignUp ? "Create your free account" : "Welcome back — sign in"}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8">
                    {error && (
                        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        {isSignUp && (
                            <div>
                                <label className="block mb-1.5 text-white/60 text-xs font-semibold uppercase tracking-wider">Name</label>
                                <div className="relative">
                                    <User2Icon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input type="text" required placeholder="Your full name"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white placeholder-white/25 focus:border-[#AAFF00]/60 focus:ring-1 focus:ring-[#AAFF00]/30 transition-colors"
                                        value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block mb-1.5 text-white/60 text-xs font-semibold uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                                <input type="email" required placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white placeholder-white/25 focus:border-[#AAFF00]/60 focus:ring-1 focus:ring-[#AAFF00]/30 transition-colors"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-white/60 text-xs font-semibold uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                                <input type="password" required placeholder="••••••••" minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-white placeholder-white/25 focus:border-[#AAFF00]/60 focus:ring-1 focus:ring-[#AAFF00]/30 transition-colors"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full mt-2 py-3 px-4 bg-[#AAFF00] hover:bg-[#c8ff33] text-black font-black rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#AAFF00]/20">
                            {loading ? "Please wait…" : (
                                <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRightIcon className="size-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/40">
                        {isSignUp ? (
                            <>Already have an account?{" "}
                                <button onClick={() => { setIsSignUp(false); setError(""); }}
                                    className="text-[#AAFF00] hover:text-[#c8ff33] font-semibold">Sign In</button>
                            </>
                        ) : (
                            <>Don't have an account?{" "}
                                <button onClick={() => { setIsSignUp(true); setError(""); }}
                                    className="text-[#AAFF00] hover:text-[#c8ff33] font-semibold">Create one free</button>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-white/20 text-xs mt-6">
                    © {new Date().getFullYear()} Postify · All rights reserved
                </p>
            </div>
        </div>
    );
}
