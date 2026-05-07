export function AboutSection() {
    return (
        <section className="w-full py-20 md:py-32 relative overflow-hidden flex justify-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/jpg1.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* Left Side: Content */}
                    <div className="flex-1 flex flex-col justify-start items-start gap-8 md:gap-10">
                        <div className="self-stretch flex flex-col justify-start items-start gap-6 md:gap-8">
                            <div className="self-stretch flex flex-col justify-start items-start gap-4">
                                <h2 className="text-white text-[2.5rem] sm:text-[3rem] md:text-[4.5rem] font-black leading-[1.1] italic uppercase tracking-tighter">
                                    Custom Jersey <br/>
                                    <span className="text-[#D25026]">Premium Quality</span>
                                </h2>
                            </div>
                            
                            <div className="self-stretch text-white/80 text-base md:text-xl font-medium leading-relaxed max-w-[32rem]">
                                <p className="mb-4 md:mb-6">
                                    Wujudkan desain jersey impianmu dengan kualitas bahan terbaik dan hasil cetak yang tajam. Cocok untuk tim esports, sepak bola, hingga komunitas.
                                </p>
                                <p>
                                    Kami menggunakan teknologi sublimasi terbaru untuk memastikan warna yang awet dan tidak luntur. Desain bebas sesuai keinginan Anda!
                                </p>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 md:gap-6 pt-2 md:pt-4">
                                <div className="p-5 md:p-6 bg-white/5 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl">
                                    <h4 className="text-3xl md:text-4xl font-black text-white mb-1 italic">100%</h4>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">High Quality Material</p>
                                </div>
                                <div className="p-5 md:p-6 bg-white/5 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl">
                                    <h4 className="text-3xl md:text-4xl font-black text-white mb-1 italic">FREE</h4>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Custom Design</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Product Image */}
                    <div className="flex-1 relative w-full flex items-center justify-center group mt-8 lg:mt-0">
                        <div className="relative w-full max-w-[400px] md:max-w-[550px] aspect-square flex items-center justify-center">
                            {/* Decorative Glow */}
                            <div className="absolute w-[80%] h-[80%] bg-[#D25026]/20 rounded-full blur-[80px] md:blur-[120px] group-hover:bg-[#D25026]/30 transition-all duration-700" />
                            
                            <img 
                                className="relative z-10 w-full h-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)] md:drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-700" 
                                src="/images/jersey_hero.png" 
                                alt="Custom Jersey Preview"
                            />

                            {/* Floating Badge */}
                            <div className="absolute -right-2 top-0 md:-right-4 md:top-10 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 border border-neutral-100">
                                <div className="flex flex-col items-center">
                                    <span className="text-[8px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Starts From</span>
                                    <span className="text-sm md:text-xl font-black text-neutral-900 italic uppercase tracking-tighter">Rp 150rb</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
             </div>
        </section>
    );
}

