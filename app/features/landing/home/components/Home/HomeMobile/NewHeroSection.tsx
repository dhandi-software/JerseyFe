import { ArrowUpRight } from "lucide-react";

export function NewHeroSection() {
    return (
        <section className="w-full flex justify-center py-4 px-[1rem] sm:px-[1.85rem] font-['Inter']">
            <div className="w-full max-w-[90rem] flex flex-col gap-4">
                {/* Upper Row */}
                <div className="w-full flex items-stretch gap-4 flex-col lg:flex-row">
                    {/* Main Banner */}
                    <div className="flex-[2] relative overflow-hidden bg-[#E5E7EB] rounded-[2rem] h-[25rem] md:h-[35rem] group cursor-pointer">
                        <img 
                            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop" 
                            alt="Summer Outfit" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-opacity group-hover:from-black" />
                        <div className="absolute left-[1rem] top-[2rem] flex flex-col items-start gap-6 max-w-[18rem]">
                            <div className="flex flex-col gap-3">
                                <h1 className="text-white text-[2.5rem] font-medium leading-[1.1] drop-shadow-2xl">
                                    Color of<br/>Summer<br/>Outfit
                                </h1>
                                <p className="text-white/90 text-[0.8rem] font-medium leading-relaxed drop-shadow-lg">
                                    100+ Collections for your outfit inspirations in this summer
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-white hover:bg-black group/btn transition-all rounded-full flex justify-center items-center shadow-xl">
                                <span className="text-black group-hover:text-white transition-colors text-[0.6rem] font-bold tracking-widest uppercase">VIEW COLLECTIONS</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Side Stacked Covers */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[12rem] group cursor-pointer">
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop" 
                                alt="Outdoor Active" 
                            />
                            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] top-[1.25rem]">
                                <div className="text-white text-[1.25rem] font-medium leading-[1.1] tracking-tight drop-shadow-lg">
                                    Outdoor<br/>Active
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[12rem] group cursor-pointer">
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop" 
                                alt="Casual Comfort" 
                            />
                            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] top-[1.25rem]">
                                <div className="text-white text-[1.25rem] font-medium leading-[1.1] tracking-tight drop-shadow-lg">
                                    Casual<br/>Comfort
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Row */}
                <div className="w-full flex flex-col lg:flex-row items-stretch gap-4 mt-2">
                    {/* Left Text Block */}
                    <div className="flex-[0.8] flex flex-col justify-center items-start gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-8 w-full">
                        <div className="flex flex-col items-start gap-3 md:gap-4">
                            <h2 className="text-[#111111] text-[2rem] md:text-[3.5rem] font-medium leading-[1] tracking-tight">
                                Casual<br/>Inspirations
                            </h2>
                            <p className="text-[#111111]/60 text-[0.8rem] md:text-[1rem] leading-relaxed max-w-[22rem]">
                                Our favorite combinations for casual outfit that can inspire you to apply on your daily activity.
                            </p>
                        </div>
                        <button className="px-6 md:px-10 py-2 md:py-3 border-[1px] border-[#111111]/20 rounded-full hover:bg-[#111111] hover:border-[#111111] transition-all flex justify-center items-center group/btn mt-2">
                            <span className="text-[#111111] group-hover/btn:text-white transition-colors text-[0.6rem] md:text-[0.7rem] font-bold tracking-widest uppercase">BROWSE INSPIRATIONS</span>
                        </button>
                    </div>

                    {/* Right Images */}
                    <div className="flex-[2] flex gap-4 flex-col sm:flex-row">
                        <div className="flex-1 relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[18rem] group cursor-pointer">
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop" 
                                alt="Say it with Shirt" 
                            />
                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] bottom-[1.25rem] text-white text-[1.5rem] font-medium leading-[1.1] tracking-tight drop-shadow-lg">
                                Say it <br/>with Shirt
                            </div>
                            <div className="absolute right-[1.25rem] bottom-[1.25rem] w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[18rem] group cursor-pointer">
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop" 
                                alt="Funky never get old" 
                            />
                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] bottom-[1.25rem] text-white text-[1.5rem] font-medium leading-[1.1] tracking-tight drop-shadow-lg">
                                Funky never <br/>get old
                            </div>
                            <div className="absolute right-[1.25rem] bottom-[1.25rem] w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
