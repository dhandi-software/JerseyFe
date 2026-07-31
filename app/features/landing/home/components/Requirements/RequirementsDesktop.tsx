import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function RequirementsDesktop() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <Button asChild variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-brand-primary">
                <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Beranda
                </Link>
            </Button>

            <h1 className="text-3xl font-bold mb-8 text-foreground uppercase">SYARAT PESERTA Pemesanan Jersey</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: "Akademik",
                        items: [
                            "Terdaftar sebagai customer aktif Program Studi Teknik Informatika Fakultas Teknik FCSV pada tahun akademik semester berjalan",
                            "Telah memenuhi 100 SKS dengan IPK ≥ 2,00 dan maksimal nilai D atau E sebanyak 6 SKS (tidak termasuk mata kuliah Praktikum, MKWU dan MKWN)",
                            "Untuk nilai mata kuliah Praktikum dan MKWU/MKWN adalah minimal C",
                            "Memrogramkan/memilih mata kuliah Pemesanan Jersey (2 SKS) pada Kartu Rencana Studi (KRS)"
                        ]
                    },
                    {
                        title: "Waktu Pelaksanaan Pemesanan Jersey",
                        items: [
                            "Durasi pelaksanaan kegiatan FCSV menyesuaikan jam kerja dan kebijakan tempat yang dipilih oleh customer",
                            "Jangka waktu pelaksanaan FCSV di perusahaan minimal selama 1 (satu) bulan dan penyusunan laporan FCSV dilakukan dalam 1 (satu) semester",
                            "Apabila di luar dari jangka waktu tersebut, customer diwajibkan untuk memrogramkan kembali mata kuliah FCSV di KRS semester berikutnya"
                        ]
                    },
                    {
                        title: "Tempat Pemesanan Jersey",
                        items: [
                            "customer dipersilakan untuk menentukan sendiri tempat pelaksanaan KP",
                            "Kegiatan FCSV dapat dilakukan di seluruh perusahaan, instansi pemerintahan atau institusi pendidikan yang telah mempunyai sistem informasi atau sistem jaringan komputer",
                            "customer juga dapat diikutsertakan dalam kegiatan-kegiatan di lingkungan kampus FCSV yang berkaitan dengan pengembangan teknologi informasi"
                        ]
                    }
                ].map((category, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-zinc-200">
                        <CardHeader className="bg-slate-50 border-b border-zinc-100 pb-4">
                            <CardTitle className="text-xl text-orange-600">{category.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-3">
                                {category.items.map((req, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium leading-relaxed">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
