import React from "react";
import { Package, Trophy, CreditCard, Headphones } from "lucide-react";

export function ValuePropsSection() {
  const features = [
    {
      icon: Package,
      title: "PRODUKSI CEPAT",
      subtitle: "Pengerjaan tepat waktu",
    },
    {
      icon: Trophy,
      title: "JAMINAN KUALITAS",
      subtitle: "100% material premium",
    },
    {
      icon: CreditCard,
      title: "PEMBAYARAN AMAN",
      subtitle: "Transaksi terverifikasi",
    },
    {
      icon: Headphones,
      title: "KONSULTASI RESPONSIF",
      subtitle: "Bantuan tim spesialis jersey",
    },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-4 md:p-5 shadow-lg shadow-sky-950/5 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-4 md:divide-x md:divide-zinc-200/60">
        {features.map((feature, idx) => {
          const IconComp = feature.icon;
          return (
            <div
              key={feature.title}
              className={`flex items-center gap-2.5 md:gap-3.5 ${
                idx > 0 ? "md:pl-4" : ""
              }`}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center text-zinc-900 shrink-0 shadow-xs">
                <IconComp className="w-4 h-4 md:w-5 md:h-5 text-zinc-800 stroke-[1.75]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] md:text-xs font-bold text-[#191C1F] leading-tight tracking-wider uppercase">
                  {feature.title}
                </span>
                <span className="text-[10px] md:text-[11px] text-[#5F6C72] truncate leading-tight mt-0.5 md:mt-1">
                  {feature.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
