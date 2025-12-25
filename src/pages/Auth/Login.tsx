import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/axios";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { login } = useUser();

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const res = await api.post("/auth/login", credentials);
            return res.data;
        },
        onSuccess: async () => {
            // Fetch user data after successful login (cookie is now set)
            await login();
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
        <div className="flex flex-col h-full w-full justify-center items-center relative overflow-hidden bg-neutral-100">

            <div className="w-full max-w-md p-8 z-10 mx-4">
                <div className="text-center mb-10">
                    <img src="/logo-4.svg" alt="Sketchbook" className="h-48 mx-auto mb-6" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back!</h2>
                    <p className="text-gray-500">Please sign in to continue</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
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
                                className="w-full px-5 py-3.5 bg-neutral-700 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder-neutral-450 text-white caret-white"
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
                                className="w-full px-5 py-3.5 bg-neutral-700 border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder-neutral-450 text-white caret-white"
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
                            ? 'bg-neutral-600 text-gray-400 cursor-not-allowed'
                            : 'bg-black border-1 text-white hover:bg-neutral-100 hover:text-black hover:border-black hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] cursor-pointer'
                            }`}
                    >
                        {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between gap-2">
                    <div className="h-[2px] w-full bg-neutral-200"></div>
                    <span className="text-neutral-500 text-xs whitespace-nowrap">or</span>
                    <div className="h-[2px] w-full bg-neutral-200"></div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        className="w-full py-3.5 px-4 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                        <p>Continue as Guest</p>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/auth/register" className="text-violet-600 hover:text-violet-700 font-medium transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}