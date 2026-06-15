import { Award, HeartHandshake, Palette, Timer, Sparkles, Users } from "lucide-react";

export function VisiMisiSection() {
    const missions = [
        { 
            title: "Kualitas Premium", 
            description: "Menghadirkan produk jersey custom dengan kualitas bahan premium dan printing terbaik.", 
            icon: Award 
        },
        { 
            title: "Pelayanan Profesional", 
            description: "Memberikan pelayanan yang cepat, ramah, dan profesional kepada setiap pelanggan.", 
            icon: HeartHandshake 
        },
        { 
            title: "Desain Unik & Modern", 
            description: "Membantu pelanggan menciptakan desain jersey yang unik, modern, dan sesuai karakter tim.", 
            icon: Palette 
        },
        { 
            title: "Ketepatan Waktu", 
            description: "Menjaga kualitas produksi dan ketepatan waktu pengerjaan setiap pesanan.", 
            icon: Timer 
        },
        { 
            title: "Inovasi Apparel", 
            description: "Mengembangkan inovasi apparel olahraga yang nyaman, stylish, dan mengikuti tren masa kini.", 
            icon: Sparkles 
        },
        { 
            title: "Partner Terpercaya", 
            description: "Menjadi partner terpercaya bagi komunitas, sekolah, instansi, dan club olahraga di seluruh Indonesia.", 
            icon: Users 
        },
    ];

    return (
        <section className="w-full py-20 md:py-24 relative overflow-hidden flex justify-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/jpg2.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/30" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col gap-12 md:gap-16">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8 text-center md:text-left">
                        <div className="space-y-4 max-w-[42rem] mx-auto md:mx-0">
                            <h2 className="text-[2.5rem] md:text-6xl font-black text-neutral-900 italic uppercase tracking-tighter leading-[1.1]">
                                Visi & <br className="hidden md:block" />
                                <span className="text-[#D25026]">Misi Perusahaan</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 md:gap-12">
                        {/* Visi Sub-section */}
                        <div className="bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/20 p-6 md:p-10 shadow-xl w-full h-fit text-center md:text-left flex flex-col items-center md:items-start">
                            <h3 className="text-xl font-black text-[#D25026] italic uppercase tracking-tighter mb-3">
                                Visi FCSV Apparel
                            </h3>
                            <p className="text-base text-neutral-800 font-medium leading-relaxed italic">
                                Menjadi brand custom jersey terpercaya di Indonesia yang menghadirkan apparel olahraga berkualitas, inovatif, dan berkarakter untuk mendukung identitas serta semangat setiap tim dan komunitas.
                            </p>
                        </div>

                        {/* Misi Sub-section */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="space-y-2 text-center md:text-left">
                                <h3 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter pl-0 md:pl-4 border-l-0 md:border-l-4 border-[#D25026]">
                                    Misi Kami
                                </h3>
                                <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed max-w-[40rem] mx-auto md:mx-0">
                                    Untuk mewujudkan visi tersebut, kami berkomitmen penuh untuk menjalankan langkah-langkah strategis dalam menghadirkan produk jersey berkualitas tinggi, inovasi tiada henti, dan pelayanan yang terbaik bagi setiap pelanggan.
                                </p>
                            </div>

                            {/* Missions Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {missions.map((mission, idx) => (
                                    <div
                                        key={idx}
                                        className="p-7 md:p-8 bg-white/50 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/70 transition-all duration-500 group cursor-default w-full text-center md:text-left flex flex-col items-center md:items-start"
                                    >
                                        <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center mb-5 md:mb-6 shadow-sm group-hover:bg-[#D25026] group-hover:scale-110 transition-all duration-300">
                                            <mission.icon className="w-6 h-6 md:w-7 md:h-7 text-neutral-800 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-lg md:text-xl font-black text-neutral-900 italic uppercase tracking-tighter group-hover:text-[#D25026] transition-colors">
                                                {mission.title}
                                            </h3>
                                            <p className="text-neutral-600 font-medium text-sm leading-relaxed">
                                                {mission.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

