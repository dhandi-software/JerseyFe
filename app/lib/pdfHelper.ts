import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = async (order: any) => {
    const doc = new jsPDF();
    
    // Load Logo
    try {
        const logoData = await fetch('/images/FSCV.png').then(res => {
            if (!res.ok) throw new Error("Image not found");
            return res.blob();
        }).then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
        
        // Draw dark background box for white logo
        doc.setFillColor(15, 23, 42); // slate-900
        doc.roundedRect(14, 14, 32, 14, 2, 2, 'F');
        
        // Draw image
        doc.addImage(logoData as string, 'PNG', 16, 16, 28, 10);
    } catch (e) {
        console.error("Failed to load logo", e);
        // Fallback to text if logo fails to load
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text("FSCV", 14, 20);
    }
    
    // FSCV Text
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Custom Jersey", 50, 22);
    
    // Header Info Below Logo
    doc.setFontSize(9);
    doc.text("Indonesia", 14, 35);
    doc.text("+62 858-9272-0034 · order@fscv.id", 14, 40);

    // INVOICE text right aligned
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 195, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(`${order.orderId || 'ORD-0001'}`, 195, 26, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tanggal: ${new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}`, 195, 35, { align: 'right' });

    doc.setDrawColor(241, 245, 249);
    doc.line(14, 48, 195, 48);

    // Bill to
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("KEPADA", 14, 60);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    const customerName = order.customerName || order.user?.name || "Customer";
    doc.text(customerName, 14, 66);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    let addressToPrint = "";
    if (order.shippingMethod === "COD") {
        addressToPrint = `COD - Alamat Tujuan:\n${order.shippingAddress || "Alamat tidak diisi."}`;
    } else {
        addressToPrint = `Ambil di tempat (Self-Pickup):\nJalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178`;
    }
    const addressLines = doc.splitTextToSize(addressToPrint, 80);
    doc.text(addressLines, 14, 72);

    // From
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("DARI", 110, 60);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("FSCV", 110, 66);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Bank", 110, 72);
    doc.text("Bank BCA", 140, 72);
    doc.text("No. Rekening", 110, 77);
    doc.text("4921897272", 140, 77);
    doc.text("A/N", 110, 82);
    doc.text("BAHRUDIN YUSUF", 140, 82);

    // Table Summary Data
    const totalUnit = order.details?.length || 0;
    const totalAmount = order.totalAmount || (totalUnit * 150000);
    const subtotal = totalAmount;
    const basePrice = totalUnit > 0 ? Math.round(subtotal / totalUnit) : 150000;
    const productName = order.details?.[0]?.productTitle || "Jersey Custom Full Printing";

    const summaryBody = [
        [productName, totalUnit.toString(), `Rp ${basePrice.toLocaleString('id-ID')}`, `Rp ${subtotal.toLocaleString('id-ID')}`]
    ];

    autoTable(doc, {
        startY: 100,
        head: [['DESKRIPSI', 'QTY', 'HARGA SATUAN', 'SUBTOTAL']],
        body: summaryBody,
        headStyles: { fillColor: [255, 255, 255], textColor: [150, 150, 150], fontStyle: 'bold', lineWidth: {bottom: 0.5}, lineColor: [241, 245, 249] },
        bodyStyles: { textColor: [50, 50, 50], fontStyle: 'normal' },
        theme: 'plain',
        styles: { cellPadding: 5, fontSize: 9 },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] }
        }
    });

    let finalY = (doc as any).lastAutoTable.finalY || 100;

    // Keterangan & Total
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("KETERANGAN", 14, finalY + 15);

    const isPaid = order.status !== "MENUNGGU" && order.status !== "DITOLAK";

    // Badge "Pembayaran diterima" atau "Pembayaran belum diterima"
    doc.setFillColor(isPaid ? 236 : 254, isPaid ? 253 : 242, isPaid ? 245 : 242); // emerald-50 or red-50
    doc.setDrawColor(isPaid ? 16 : 239, isPaid ? 185 : 68, isPaid ? 129 : 68); // emerald-500 or red-500
    doc.roundedRect(14, finalY + 20, 55, 8, 1, 1, 'FD');
    doc.setFillColor(isPaid ? 16 : 239, isPaid ? 185 : 68, isPaid ? 129 : 68);
    doc.circle(18, finalY + 24, 1.5, 'F');
    doc.setFontSize(8);
    doc.setTextColor(isPaid ? 6 : 153, isPaid ? 95 : 27, isPaid ? 70 : 27); // emerald-800 or red-800
    doc.text(isPaid ? "Pembayaran diterima" : "Pembayaran belum diterima", 22, finalY + 26);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Metode: Transfer Bank BCA", 14, finalY + 36);
    doc.text(`Tanggal bayar: ${new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}`, 14, finalY + 41);

    // Total Area
    doc.setDrawColor(241, 245, 249);
    doc.line(110, finalY + 15, 195, finalY + 15);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Subtotal", 110, finalY + 22);
    doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, 195, finalY + 22, { align: 'right' });

    doc.setDrawColor(15, 23, 42); // dark line for total
    doc.setLineWidth(0.5);
    doc.line(110, finalY + 27, 195, finalY + 27);

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("Total", 110, finalY + 35);
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(`Rp ${totalAmount.toLocaleString('id-ID')}`, 195, finalY + 35, { align: 'right' });

    finalY = finalY + 50;

    // Data Pemain Table
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("RINCIAN DATA PEMAIN", 14, finalY);

    const dataPemainBody = (order.details || []).map((item: any, idx: number) => {
        let sizeOnly = item.playerSize || "-";
        let sleeve = "-";
        // Handle "L (Lengan Pendek)" or "L - Lengan Pendek"
        if (sizeOnly.includes("(")) {
            const parts = sizeOnly.split("(");
            sizeOnly = parts[0].trim();
            sleeve = parts[1].replace(")", "").trim();
        } else if (sizeOnly.includes("-")) {
            const parts = sizeOnly.split("-");
            sizeOnly = parts[0].trim();
            sleeve = parts.slice(1).join("-").trim();
        }
        return [
            (idx + 1).toString(),
            item.playerName || "-",
            item.playerNumber || "-",
            sizeOnly,
            sleeve
        ];
    });

    autoTable(doc, {
        startY: finalY + 5,
        head: [['NO', 'NAMA PEMAIN', 'NOMOR', 'UKURAN (SIZE)', 'LENGAN']],
        body: dataPemainBody,
        headStyles: { fillColor: [248, 250, 252], textColor: [100, 100, 100], fontStyle: 'bold' },
        theme: 'grid',
        styles: { cellPadding: 4, fontSize: 8, textColor: [50, 50, 50], lineColor: [241, 245, 249], lineWidth: 0.1 },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'center', cellWidth: 30 },
            4: { halign: 'center', cellWidth: 30 }
        }
    });

    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Catatan
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("CATATAN", 14, finalY);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(
        isPaid 
            ? "Terima kasih sudah mempercayakan pesanan jersey kepada FSCV! Pesanan telah LUNAS dan sedang diproses." 
            : "Terima kasih sudah mempercayakan pesanan jersey kepada FSCV! Pesanan menunggu konfirmasi pembayaran dari admin.", 
        14, 
        finalY + 5
    );

    // Large Faint Watermark Text
    doc.setFontSize(80);
    doc.setTextColor(245, 245, 255);
    doc.setFont("helvetica", "bold");
    doc.text("FSCV", 105, 260, { align: 'center' });

    // Watermark Footer
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("Dokumen ini diterbitkan oleh FSCV · order@fscv.id", 105, 280, { align: 'center' });
    
    doc.save(`Invoice_${order.orderId}.pdf`);
};
