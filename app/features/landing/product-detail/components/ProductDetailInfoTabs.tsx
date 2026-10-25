import * as React from "react";
import { Check, Truck, ShieldCheck, RotateCcw, Sparkles, Shirt } from "lucide-react";
import type { ProductDetailData, ProductDetailTabType } from "~/types/productDetail";

interface ProductDetailInfoTabsProps {
  activeTab: ProductDetailTabType;
  setActiveTab: (tab: ProductDetailTabType) => void;
  product: ProductDetailData;
}

export function ProductDetailInfoTabs({ activeTab, setActiveTab, product }: ProductDetailInfoTabsProps) {
  const tabs: { id: ProductDetailTabType; label: string }[] = [
    { id: "description", label: "Deskripsi Lengkap" },
    { id: "specifications", label: "Spesifikasi Kain" },
    { id: "care", label: "Perawatan & Sablon" },
    { id: "guarantee", label: "Garansi & Ekspedisi" },
  ];

  return (
    <div className="mt-10 border-t border-zinc-200 pt-8 space-y-6">
      {/* Tabs Header */}
      <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 border-b border-zinc-200 pb-3 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors pb-3 -mb-3 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "border-[#FA8232] text-[#D25026]"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Description */}
      {activeTab === "description" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-2 text-xs text-zinc-600">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900">
              Karakteristik & Keunggulan Bahan
            </h3>
            <p className="text-zinc-600 leading-relaxed text-xs">
              {product.description}
            </p>
            <p className="text-zinc-500 leading-relaxed text-xs">
              Diproduksi khusus untuk kebutuhan jersey olahraga profesional. Memiliki sirkulasi udara mikro yang efektif menjaga suhu tubuh tetap sejuk saat beraktivitas dengan intensitas tinggi di lapangan.
            </p>
          </div>

          <div className="lg:col-span-3 space-y-4 lg:border-l lg:border-zinc-200 lg:pl-6">
            <h3 className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
              <Sparkles className="size-4 text-[#FA8232]" />
              <span>Fitur Utama</span>
            </h3>
            <ul className="space-y-3">
              {product.features.map((featItem, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                  <div className="size-6 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3.5 text-[#D25026]" />
                  </div>
                  <span className="leading-tight">{featItem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4 lg:border-l lg:border-zinc-200 lg:pl-6">
            <h3 className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
              <Truck className="size-4 text-[#FA8232]" />
              <span>Info Distribusi</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-zinc-800 block">Jasa Ekspedisi:</span>
                <span className="text-zinc-600">{product.shippingWarranty?.courier || "J&T Cargo, SiCepat, JNE"}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-800 block">Estimasi Sampai:</span>
                <span className="text-zinc-600">{product.shippingWarranty?.deliveryTime || "1-3 hari kerja untuk seluruh wilayah Indonesia"}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-800 block">Jaminan Keaslian:</span>
                <span className="text-zinc-600">{product.shippingWarranty?.guarantee || "100% Bahan Resmi Standar FCSV Sportswear"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Specifications */}
      {activeTab === "specifications" && (
        <div className="py-2 space-y-4">
          <h3 className="font-extrabold text-sm text-zinc-900">
            Tabel Spesifikasi Teknis Kain
          </h3>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-zinc-200">
                {Object.entries(product.specs).map(([label, value], idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-zinc-50/60" : "bg-white"}>
                    <td className="py-3 px-4 font-bold text-zinc-800 w-1/3 border-r border-zinc-200">{label}</td>
                    <td className="py-3 px-4 text-zinc-600 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Care & Printing Instructions */}
      {activeTab === "care" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2 text-xs">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <Shirt className="size-4 text-[#D25026]" />
              <span>Petunjuk Sablon Jersey</span>
            </h4>
            <ul className="space-y-2 text-zinc-600 list-disc list-inside">
              <li>Mendukung teknik sablon Sublimasi Full Print pada suhu 190-205 derajat Celcius (30-40 detik).</li>
              <li>Kompatibel dengan Polyflex PU Korea dan DTF (Direct Transfer Film) kualitas tinggi.</li>
              <li>Hasil cetak warna menyatu kuat ke dalam serat pori kain tanpa mengeras atau pecah.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <RotateCcw className="size-4 text-[#D25026]" />
              <span>Cara Pencucian & Perawatan</span>
            </h4>
            <ul className="space-y-2 text-zinc-600 list-disc list-inside">
              <li>Cuci menggunakan air biasa (suhu ruang) dengan detergen cair lembut.</li>
              <li>Hindari penggunaan pemutih pakaian berkonsentrasi klorin tinggi.</li>
              <li>Jemur di tempat teduh dengan membalik bagian dalam baju ke luar.</li>
              <li>Setrika pada suhu sedang (khusus bagian sablon, lapisi dengan kain pelindung).</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Guarantee & Delivery */}
      {activeTab === "guarantee" && (
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 text-xs">
          <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <ShieldCheck className="size-6 shrink-0" />
            <div>
              <p className="font-bold text-sm">Garansi Mutu FCSV Apparel</p>
              <p className="text-emerald-800 mt-0.5">Semua produk kain dan jahitan telah melalui proses kendali mutu (quality control) sebelum dikirim.</p>
            </div>
          </div>

          <div className="space-y-2 text-zinc-600">
            <p className="font-bold text-zinc-800">Ketentuan Retur & Garansi:</p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li>Pengajuan komplain dapat dilakukan maksimal 3 hari setelah barang diterima dengan melampirkan video unboxing.</li>
              <li>Garansi penggantian bahan kain berlaku jika terdapat cacat tenun, noda pabrik, atau selisih kuantitas.</li>
              <li>Untuk pemesanan seragam tim partai besar, tim customer care kami siap membantu koordinasi pengiriman armada kargo.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
