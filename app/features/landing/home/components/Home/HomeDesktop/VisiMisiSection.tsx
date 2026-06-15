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
        <section className="w-full py-24 relative overflow-hidden flex justify-center">
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
                <div className="flex flex-col gap-16">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4 max-w-[42rem]">
                            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 italic uppercase tracking-tighter leading-tight">
                                Visi & <br className="hidden md:block" />
                                <span className="text-[#D25026]">Misi Perusahaan</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 w-full">
                        {/* Visi Sub-section */}
                        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-8 md:p-10 shadow-xl flex flex-col justify-center w-full h-fit">
                            <h3 className="text-2xl font-black text-[#D25026] italic uppercase tracking-tighter mb-4">
                                Visi FCSV Apparel
                            </h3>
                            <p className="text-lg md:text-xl text-neutral-800 font-medium leading-relaxed italic">
                                Menjadi brand custom jersey terpercaya di Indonesia yang menghadirkan apparel olahraga berkualitas, inovatif, dan berkarakter untuk mendukung identitas serta semangat setiap tim dan komunitas.
                            </p>
                        </div>

                        {/* Misi Sub-section */}
                        <div className="bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-xl flex flex-col w-full gap-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-neutral-900 italic uppercase tracking-tighter pl-4 border-l-4 border-[#D25026]">
                                    Misi Kami
                                </h3>
                                <p className="text-base text-neutral-600 font-medium leading-relaxed">
                                    Untuk mewujudkan visi tersebut, kami berkomitmen penuh untuk menjalankan langkah-langkah strategis dalam menghadirkan produk jersey berkualitas tinggi, inovasi tiada henti, dan pelayanan yang terbaik bagi setiap pelanggan.
                                </p>
                            </div>

                            {/* Missions Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {missions.map((mission, idx) => (
                                    <div
                                        key={idx}
                                        className="p-6 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-sm hover:shadow-md hover:bg-white/75 transition-all duration-500 group cursor-default w-full"
                                    >
                                        <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-[#D25026] group-hover:scale-110 transition-all duration-300">
                                            <mission.icon className="w-6 h-6 text-neutral-800 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-base font-black text-neutral-900 italic uppercase tracking-tighter group-hover:text-[#D25026] transition-colors">
                                                {mission.title}
                                            </h3>
                                            <p className="text-neutral-600 font-medium text-xs md:text-sm leading-relaxed">
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

