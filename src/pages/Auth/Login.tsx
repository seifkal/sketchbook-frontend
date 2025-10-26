import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { useState, useRef } from "react";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        setIsLoading(true);
        
        try {
            const res = await api.post("/auth/login", {email, password});
            const token = res.data.token;

            localStorage.setItem("token", token);

            navigate("/");
        } catch (error: any) {
            console.error("Login error:", error);
            setError("Invalid email or password. Please try again.");
            // Keep focus on the password field after error
            setTimeout(() => {
                if (passwordRef.current) {
                    passwordRef.current.focus();
                }
            }, 100);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="flex flex-col h-full justify-center items-center">
            <div className="w-full">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-16 rounded-lg" style={{ fontFamily: '"BoldPixels", sans-serif' }}>SKETCHBOOK</h1>
                    <h2 className="text-lg font-bold text-gray-100 mb-2">Welcome Back!</h2>
                    <p className="text-gray-300 font-light">Please sign in to your account</p>
                </div>
                
                <form className="space-y-4 max-w-xs mx-auto" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-2xl text-sm">
                            {error}
                        </div>
                    )}
                    
                    <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-800 border-0 rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all duration-200 placeholder-gray-600 text-white focus:text-black"
                        placeholder="Email"
                        required
                    />
                    
                    <input
                        ref={passwordRef}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-800 border-0 rounded-2xl focus:ring-2 focus:bg-white outline-none transition-all duration-200 placeholder-gray-600 text-white focus:text-black"
                        placeholder="Password"
                        required
                    />
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-2xl font-medium focus:ring-2 focus:ring-offset-2 transition-all duration-200 border-white border-1 ${
                            isLoading 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-white hover:text-black cursor-pointer'
                        }`}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-4">
                    <button
                        type="button"
                        className="w-full py-3 px-4 rounded-2xl font-medium text-white focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer relative overflow-hidden group border-white border-1"
                        style={{
                            background: 'linear-gradient(45deg, #ff0040, #ff4080, #8040ff, #4080ff, #0040ff, #ff0040)',
                            backgroundSize: '400% 400%',
                            animation: 'rainbowShift 3s ease-in-out infinite'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.animation = 'rainbowShift 0.5s ease-in-out infinite';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.animation = 'rainbowShift 3s ease-in-out infinite';
                        }}
                    >
                        <span className="relative z-10">Guest User</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/auth/register" className="text-white hover:underline font-medium">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}