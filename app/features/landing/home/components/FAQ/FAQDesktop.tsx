import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function FAQDesktop() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-brand-primary">
            <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
            </Link>
          </Button>

          <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-brand-primary" />
              <h1 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-3 text-foreground">Berapa lama proses pembuatan jersey custom?</h3>
          <p className="text-muted-foreground leading-relaxed">Proses pengerjaan biasanya memakan waktu 7-14 hari kerja setelah desain akhir disetujui dan pembayaran uang muka (DP) diterima, tergantung antrean dan jumlah pesanan.</p>
        </div>
        <div className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-3 text-foreground">Apakah ada minimal jumlah pemesanan (MOQ)?</h3>
          <p className="text-muted-foreground leading-relaxed">Ya, untuk pembuatan jersey custom kami menetapkan minimal pemesanan sebanyak 12 pcs (1 lusin) per desain untuk memastikan kualitas dan efisiensi produksi.</p>
        </div>
        <div className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-3 text-foreground">Bahan kain apa saja yang tersedia?</h3>
          <p className="text-muted-foreground leading-relaxed">Kami menyediakan berbagai bahan olahraga premium seperti Dryfit Milano, Benzema, Pique, dan bahan lainnya yang menyerap keringat dengan sangat baik dan nyaman digunakan.</p>
        </div>
        {/* Added placeholder for more Q&A if needed to show grid effect */}
      </div>
    </div>
  );
}
