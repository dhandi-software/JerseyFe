import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Link } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";

export function LoginDesktop() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({ email: false, password: false });
    const [loginError, setLoginError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { email: !email, password: !password };
        setErrors(newErrors);
        setLoginError(null);

        if (!newErrors.email && !newErrors.password) {
            try {
                await login({ email, password });
            } catch (error: any) {
                setLoginError(error.response?.data?.message || "Invalid credentials. Please try again.");
            }
        }
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden font-geist py-8 lg:py-12 
            bg-[#0F172A] 
            before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,_rgba(79,70,229,0.3)_0%,_transparent_50%),radial-gradient(circle_at_80%_70%,_rgba(6,182,212,0.2)_0%,_transparent_50%),radial-gradient(circle_at_50%_50%,_rgba(124,58,237,0.1)_0%,_transparent_70%)]
            selection:bg-indigo-500 selection:text-white"
        >
            {/* Background Decorative Blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[500px] flex flex-col bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.4)] border border-white/20 p-8 lg:p-12 my-auto"
            >
                {/* Branding Header */}
                <header className="mb-8 flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-xl mb-4 shadow-indigo-500/10 border border-white/10">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter text-center line-height-1">
                        FCSV PORTAL
                    </h1>
                    <p className="text-slate-500 text-[9px] font-black mt-1 uppercase tracking-[0.3em] opacity-60">
                        Secure Environment Authorization
                    </p>
                </header>

                {loginError && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[13px] font-bold"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                        {loginError}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Identity Key (Email)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input 
                                type="email"
                                placeholder="username@portal.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                    "w-full h-14 pl-12 pr-4 bg-slate-50 border rounded-2xl text-[14px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                    errors.email ? "border-red-200" : "border-slate-100 focus:border-indigo-500"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Security Code (Password)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "w-full h-14 pl-12 pr-12 bg-slate-50 border rounded-2xl text-[14px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                    errors.password ? "border-red-200" : "border-slate-100 focus:border-indigo-500"
                                )}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="flex justify-end pt-1 px-1">
                            <Link to="/forgot-password" className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter italic">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                        <Checkbox 
                            id="remember-ds" 
                            checked={rememberMe} 
                            onCheckedChange={(v) => setRememberMe(v === true)}
                            className="rounded-lg w-5 h-5 border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <Label htmlFor="remember-ds" className="text-xs font-bold text-slate-500 cursor-pointer">Stay Authorized</Label>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-16 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Authenticating...</span>
                            </div>
                        ) : (
                            "LOGIN"
                        )}
                    </Button>

                    <div className="text-center pt-4 px-1">
                        <Link to="/register" className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter italic">
                            Belum punya akun? Daftar di sini
                        </Link>
                    </div>
                </form>

                <footer className="mt-6 pt-6 border-t border-slate-100 text-center shrink-0">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        © {new Date().getFullYear()} FCSV Tech Group
                    </p>
                </footer>
            </motion.div>
        </main>
    );
}
