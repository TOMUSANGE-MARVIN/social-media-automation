import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName]         = useState("");
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState("");
    const { signIn, signUp, setUserFromToken } = useAuth();
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

    const handleGoogleSuccess = async (accessToken: string) => {
        setError("");
        setLoading(true);
        try {
            const data = await authApi.googleLogin(accessToken);
            localStorage.setItem("auth_token", data.token);
            setUserFromToken(data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4"
            style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, #AAFF0015 0%, transparent 70%)" }}>

            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="relative w-full max-w-md">
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

                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-8">
                    {error && (
                        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <GoogleLoginButton
                        onSuccess={handleGoogleSuccess}
                        onError={(msg) => setError(msg)}
                        disabled={loading}
                    />

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/30 text-xs">or continue with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

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

function GoogleLoginButton({
    onSuccess,
    onError,
    disabled,
}: {
    onSuccess: (accessToken: string) => void;
    onError: (msg: string) => void;
    disabled: boolean;
}) {
    const login = useGoogleLogin({
        onSuccess: (res) => onSuccess(res.access_token),
        onError:   () => onError("Google sign-in was cancelled or failed"),
    });

    const handleClick = () => {
        if (!GOOGLE_CLIENT_ID) {
            onError("Google sign-in is not configured on this server yet");
            return;
        }
        login();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-3 px-4 py-3
                bg-white hover:bg-gray-50 active:bg-gray-100
                text-gray-700 font-medium text-sm rounded-xl
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <GoogleIcon />
            Continue with Google
        </button>
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}
