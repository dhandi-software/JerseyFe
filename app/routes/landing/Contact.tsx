import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        
        const waNumber = "6285892720034";
        const formattedMsg = `Halo FCSV, saya ${name} (${email}).\nSubjek: ${subject || "Tanya FCSV"}\n\nPesan:\n${message}`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(formattedMsg)}`, "_blank");
        
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAFAFA] py-16 px-4 sm:px-6 md:px-8 font-['Inter'] flex justify-center items-center">
            <div className="w-full max-w-6xl flex flex-col gap-12">
                
                {/* Header */}
                <div className="text-center flex flex-col items-center gap-3">
                    <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tighter italic uppercase">
                        Hubungi <span className="text-[#D25026]">Kami</span>
                    </h1>
                    <div className="w-16 h-1.5 bg-[#D25026] rounded-full"></div>
                    <p className="text-neutral-500 font-medium mt-2 text-sm sm:text-base w-full">
                        Ada pertanyaan atau ingin berkonsultasi tentang desain jersey impianmu? Kami siap melayani Anda sepenuh hati.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column: Contact Cards */}
                    <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                        <div className="flex flex-col gap-6">
                            {/* WhatsApp Card */}
                            <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4 transition-all hover:translate-y-[-4px] hover:shadow-md">
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Admin FCSV</h3>
                                    <span className="text-lg font-bold text-neutral-900 italic block mt-1">+62 858-9272-0034</span>
                                    <p className="text-xs text-neutral-400 mt-1 font-medium">WhatsApp chat respons cepat.</p>
                                    <a 
                                        href="https://wa.me/6285892720034" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs font-black text-[#D25026] hover:underline uppercase tracking-wider block mt-3"
                                    >
                                        Chat Sekarang &rarr;
                                    </a>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4 transition-all hover:translate-y-[-4px] hover:shadow-md">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Surel Resmi</h3>
                                    <span className="text-lg font-bold text-neutral-900 italic block mt-1">support@fcsvjersey.id</span>
                                    <p className="text-xs text-neutral-400 mt-1 font-medium">Kirimkan penawaran atau kerjasama bisnis.</p>
                                    <a 
                                        href="mailto:support@fcsvjersey.id" 
                                        className="text-xs font-black text-[#D25026] hover:underline uppercase tracking-wider block mt-3"
                                    >
                                        Kirim Surel &rarr;
                                    </a>
                                </div>
                            </div>

                            {/* Clock Card */}
                            <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4 transition-all hover:translate-y-[-4px] hover:shadow-md">
                                <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Jam Operasional</h3>
                                    <span className="text-lg font-bold text-neutral-900 italic block mt-1">Setiap Hari</span>
                                    <p className="text-xs text-neutral-500 font-medium mt-1">Pukul 08:00 WIB - 21:00 WIB</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="p-6 bg-neutral-900 text-white rounded-3xl shadow-xl flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl text-white shrink-0 mt-0.5">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-2">Alamat Studio</h3>
                                <p className="text-sm font-bold leading-relaxed italic uppercase tracking-tighter text-white/95">
                                    FCSV Custom Jersey Studio<br/>
                                    Jl. Raya Kampus Bayu No. 45, Jakarta, Indonesia
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Glassmorphic Contact Form */}
                    <div className="lg:col-span-7 bg-white border border-neutral-100 shadow-xl rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden">
                        
                        <div className="absolute w-[200px] h-[200px] bg-[#D25026]/5 rounded-full blur-[80px] top-0 right-0 -z-10" />

                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-neutral-900 tracking-tight italic uppercase">Kirim Pesan</h2>
                            <p className="text-neutral-400 text-xs font-medium mt-1">Isi formulir berikut dan kirimkan langsung via WhatsApp.</p>
                        </div>

                        {submitted && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold animate-in fade-in zoom-in-95 duration-300">
                                Terima kasih! Pesan Anda telah disiapkan. Mengalihkan Anda ke WhatsApp chat...
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className="w-full h-12 px-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all placeholder:text-neutral-200"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Alamat Surel</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Contoh: budi@gmail.com"
                                        className="w-full h-12 px-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all placeholder:text-neutral-200"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Subjek Pesan</label>
                                <input 
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Contoh: Tanya Desain / Bahan Baju"
                                    className="w-full h-12 px-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all placeholder:text-neutral-200"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Isi Pesan</label>
                                <textarea 
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tuliskan pesan atau konsultasi jersey Anda secara detail..."
                                    className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D25026]/10 focus:border-[#D25026] transition-all placeholder:text-neutral-200 resize-none min-h-[120px]"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-14 rounded-2xl bg-[#D25026] hover:bg-[#B13F1D] text-white text-xs font-black italic uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#D25026]/10 hover:shadow-xl hover:shadow-[#D25026]/20 transition-all cursor-pointer"
                            >
                                <span>Kirim Pesan Sekarang</span>
                            </Button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}
