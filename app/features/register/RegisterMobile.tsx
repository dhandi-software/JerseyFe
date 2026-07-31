import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User } from "lucide-react";
import { cn } from "~/lib/utils";
import { useRegister } from "./UseRegister";
import { Toast } from "~/components/ui/toast";

export function RegisterMobile() {
    const {
        formData,
        showPassword,
        isLoading,
        toastProps,
        setToastProps,
        handleInputChange,
        togglePasswordVisibility,
        handleSubmit,
    } = useRegister();

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
                        FCSV Portal
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold mt-0.5 uppercase tracking-widest opacity-60">Mobile Registration</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white overflow-hidden flex flex-col">
                    <header className="mb-6 shrink-0">
                        <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight text-center">Create Account</h2>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic opacity-80">Full Name</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input 
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={cn(
                                        "w-full h-12 pl-11 pr-4 bg-slate-50 border rounded-2xl text-[13px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                        "border-slate-100 focus:border-indigo-500"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic opacity-80">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input 
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={cn(
                                        "w-full h-12 pl-11 pr-4 bg-slate-50 border rounded-2xl text-[13px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                        "border-slate-100 focus:border-indigo-500"
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
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={cn(
                                        "w-full h-12 pl-11 pr-11 bg-slate-50 border rounded-2xl text-[13px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                        "border-slate-100 focus:border-indigo-500"
                                    )}
                                />
                                <button 
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 active:scale-95 transition-all mt-6"
                        >
                            {isLoading ? "Registering..." : "REGISTER"}
                        </Button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="text-[10px] font-black text-indigo-600 uppercase italic">
                                Sudah punya akun? Masuk di sini
                            </Link>
                        </div>
                    </form>
                </div>

                <footer className="mt-8 text-center shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">
                        © {new Date().getFullYear()} FCSV Tech
                    </p>
                </footer>
            </div>

            {toastProps && (
                <Toast
                    title={toastProps.title}
                    variant={toastProps.variant}
                    onClose={() => setToastProps(null)}
                />
            )}
        </main>
    );
}
