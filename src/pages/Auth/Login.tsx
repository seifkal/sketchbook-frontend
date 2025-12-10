import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/axios";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser, type JwtPayload } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const res = await api.post("/auth/login", credentials);
            return res.data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            // Decode the token and update the user context
            const decoded = jwtDecode<JwtPayload>(data.token);
            setUser(decoded);
            navigate("/");
        },
        onError: (error: unknown) => {
            console.error("Login error:", error);
            setError("Invalid email or password. Please try again.");
            // Keep focus on the password field after error
            setTimeout(() => {
                if (passwordRef.current) {
                    passwordRef.current.focus();
                }
            }, 100);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        loginMutation.mutate({ email, password });
    }

    return (
        <div className="flex flex-col h-full w-full justify-center items-center relative overflow-hidden">

            <div className="w-full max-w-md p-8 z-10 mx-4">
                <div className="text-center mb-10">
                    <img src="/logo-text.svg" alt="Sketchbook" className="h-8 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-neutral-400">Please sign in to continue</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <input
                                ref={emailRef}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none transition-all duration-200 placeholder-neutral-500 text-white"
                                placeholder="Email address"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <input
                                ref={passwordRef}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none transition-all duration-200 placeholder-neutral-500 text-white"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${loginMutation.isPending
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5 active:scale-[0.98]'
                            }`}
                    >
                        {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="h-[1px] w-full bg-neutral-800"></div>
                    <span className="text-neutral-500 text-xs whitespace-nowrap">OR CONTINUE WITH</span>
                    <div className="h-[1px] w-full bg-neutral-800"></div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        className="w-full py-3.5 px-4 rounded-xl font-medium text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 transition-all duration-200 flex items-center justify-center gap-2 group relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(45deg, #ff0040, #ff4080, #8040ff, #4080ff, #0040ff, #ff0040)',
                            backgroundSize: '400% 400%',
                            animation: 'rainbowShift 3s ease-in-out infinite'
                        }}
                    >
                        <div className="absolute inset-[1px] bg-neutral-900 rounded-[10px] z-0"></div>
                        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 group-hover:text-white transition-colors">Guest User</span>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-500">
                        Don't have an account?{' '}
                        <Link to="/auth/register" className="text-white hover:text-neutral-300 font-medium transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}