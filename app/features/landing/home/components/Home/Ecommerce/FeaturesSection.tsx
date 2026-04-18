import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

export function FeaturesSection() {
    const features = [
        { icon: Truck, title: "Free Shipping", description: "On all orders over $150" },
        { icon: ShieldCheck, title: "Secure Payment", description: "100% secure payment processing" },
        { icon: RefreshCcw, title: "Easy Returns", description: "30-day money back guarantee" },
        { icon: Headphones, title: "24/7 Support", description: "Dedicated support anytime" },
    ];

    return (
        <section className="w-full py-12 border-t border-b border-neutral-100 bg-white font-['Inter']">
            <div className="max-w-[90rem] mx-auto px-[1.85rem]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="bg-orange-50 p-4 rounded-2xl group-hover:bg-orange-600 transition-colors duration-300">
                                <feature.icon className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div>
                                <h4 className="text-[0.875rem] font-bold text-neutral-900">{feature.title}</h4>
                                <p className="text-neutral-400 text-[0.75rem] mt-0.5">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
