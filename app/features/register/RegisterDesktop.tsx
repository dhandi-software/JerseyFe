import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";
import { useRegister } from "./UseRegister";
import { Toast } from "~/components/ui/toast";

export function RegisterDesktop() {
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
                        Secure Environment Registration
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Full Name</label>
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
                                    "w-full h-14 pl-12 pr-4 bg-slate-50 border rounded-2xl text-[14px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                    "border-slate-100 focus:border-indigo-500"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Identity Key (Email)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input 
                                type="email"
                                name="email"
                                placeholder="kustomer@portal.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={cn(
                                    "w-full h-14 pl-12 pr-4 bg-slate-50 border rounded-2xl text-[14px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                    "border-slate-100 focus:border-indigo-500"
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
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={cn(
                                    "w-full h-14 pl-12 pr-12 bg-slate-50 border rounded-2xl text-[14px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5",
                                    "border-slate-100 focus:border-indigo-500"
                                )}
                            />
                            <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-16 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Registering...</span>
                            </div>
                        ) : (
                            "REGISTER"
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <Link to="/login" className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter italic">
                            Sudah punya akun? Masuk di sini
                        </Link>
                    </div>
                </form>

                <footer className="mt-6 pt-6 border-t border-slate-100 text-center shrink-0">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        © {new Date().getFullYear()} FCSV Tech Group
                    </p>
                </footer>
            </motion.div>

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
