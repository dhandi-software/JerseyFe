import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Link } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import { cn } from "~/lib/utils";

export function LoginMobile() {
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
                setLoginError(error.response?.data?.message || "Invalid credentials.");
            }
        }
    };

    return (
        <main className="relative h-[100dvh] w-full flex flex-col items-center justify-center bg-[#F8FAFC] overflow-hidden font-geist p-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[30%] bg-indigo-200/40 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-5%] right-[-10%] w-[60%] h-[30%] bg-cyan-200/40 rounded-full blur-[80px]"></div>

            <div className="relative z-10 w-full max-w-[400px] max-h-[94dvh] flex flex-col">
                {/* Logo Area */}
                <div className="mb-6 flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-2xl mb-4 shadow-indigo-500/20">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                        FSCV Portal
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold mt-0.5 uppercase tracking-widest opacity-60">Mobile Authorization</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white overflow-hidden flex flex-col">
                    <header className="mb-6 shrink-0">
                        <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight text-center">Identity Login</h2>
                    </header>

                    {loginError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[11px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic opacity-80">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input 
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={cn(
                                        "w-full h-12 pl-11 pr-4 bg-slate-50 border rounded-2xl text-[13px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                        errors.email ? "border-red-200" : "border-slate-100 focus:border-indigo-500"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic opacity-80">Security Code</label>
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
                                        "w-full h-12 pl-11 pr-11 bg-slate-50 border rounded-2xl text-[13px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                        errors.password ? "border-red-200" : "border-slate-100 focus:border-indigo-500"
                                    )}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end pt-1 px-1">
                                <Link to="/forgot-password" className="text-[10px] font-black text-indigo-600 uppercase italic">
                                    Forgot Code?
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1 pt-2">
                            <Checkbox 
                                id="remember-mb" 
                                checked={rememberMe} 
                                onCheckedChange={(v) => setRememberMe(v === true)}
                                className="rounded-md w-5 h-5 border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                            <Label htmlFor="remember-mb" className="text-[11px] font-bold text-slate-500 cursor-pointer">Stay Authorized</Label>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 active:scale-95 transition-all mt-4"
                        >
                            {isLoading ? "Validating..." : "Enter Portal"}
                        </Button>
                    </form>
                </div>

                <footer className="mt-8 text-center shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">
                        © {new Date().getFullYear()} FSCV Tech
                    </p>
                </footer>
            </div>
        </main>
    );
}
