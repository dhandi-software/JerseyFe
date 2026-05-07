import { ShieldCheck, Zap, Heart, Users } from "lucide-react";

export function VisiMisiSection() {
    const missions = [
        { 
            title: "Kualitas Premium", 
            description: "Bahan kain dan tinta terbaik untuk hasil yang tahan lama dan warna yang tajam.", 
            icon: ShieldCheck 
        },
        { 
            title: "Inovasi Desain", 
            description: "Tren desain apparel modern dan kustomisasi tanpa batas untuk identitas tim Anda.", 
            icon: Zap 
        },
        { 
            title: "Kepuasan Pelanggan", 
            description: "Layanan responsif dan proses kustomisasi yang mudah mulai dari konsep hingga jadi.", 
            icon: Heart 
        },
        { 
            title: "Kolaborasi Lokal", 
            description: "Mendukung pertumbuhan industri kreatif lokal melalui kemitraan yang berkelanjutan.", 
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="space-y-4 max-w-[42rem]">
                            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 italic uppercase tracking-tighter leading-tight">
                                Visi & <br className="hidden md:block" />
                                <span className="text-[#D25026]">Misi Perusahaan</span>
                            </h2>
                            <p className="text-lg md:text-xl text-neutral-600 font-medium leading-relaxed">
                                Menjadi penyedia layanan custom jersey nomor satu yang mengedepankan kualitas premium dan inovasi desain untuk setiap komunitas.
                            </p>
                        </div>
                    </div>

                    {/* Missions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {missions.map((mission, idx) => (
                            <div
                                key={idx}
                                className="p-8 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/60 transition-all duration-500 group cursor-default w-full"
                            >
                                <div className="shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#D25026] group-hover:scale-110 transition-all duration-300">
                                    <mission.icon className="w-7 h-7 text-neutral-800 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter group-hover:text-[#D25026] transition-colors">
                                        {mission.title}
                                    </h3>
                                    <p className="text-neutral-500 font-medium text-sm leading-relaxed">
                                        {mission.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

