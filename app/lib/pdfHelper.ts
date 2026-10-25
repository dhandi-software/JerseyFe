import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = async (order: any) => {
    const doc = new jsPDF();
    
    // Large Faint Watermark Text (Drawn first so it acts as background)
    doc.setFontSize(80);
    doc.setTextColor(248, 248, 250); // Make it slightly lighter
    doc.setFont("helvetica", "bold");
    doc.text("FCSV", 105, 260, { align: 'center' });
    
    // Load Logo
    try {
        const logoData = await fetch('/images/FCSV.png').then(res => {
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
        doc.text("FCSV", 14, 20);
    }
    
    // FCSV Text
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Custom Jersey", 50, 22);
    
    // Header Info Below Logo
    doc.setFontSize(9);
    doc.text("Indonesia", 14, 35);
    doc.text("+62 858-9272-0034 · order@fcsv.id", 14, 40);

    // INVOICE text right aligned
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 195, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(`${order.id || order.orderId || 'ORD-0001'}`, 195, 26, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tanggal: ${new Date(order.createdAt || order.dateTime || Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}`, 195, 35, { align: 'right' });

    doc.setDrawColor(241, 245, 249);
    doc.line(14, 48, 195, 48);

    // Bill to
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("KEPADA", 14, 60);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    const customerName = order.customer || order.customerName || (order.user as any)?.customer?.nama || (order.user as any)?.username || "Customer";
    const customerPhone = order.customerPhone || (order.user as any)?.customer?.phone;
    if (customerPhone) {
        doc.text(`${customerName} - ${customerPhone}`, 14, 66);
    } else {
        doc.text(customerName, 14, 66);
    }
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
    doc.text("FCSV", 110, 66);
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
    const memberItems = (order.details && order.details.length > 0)
        ? order.details
        : (order.playerInfo || []).map((p: any) => ({
            playerName: p.name || p.playerName,
            playerNumber: p.number || p.playerNumber,
            playerSize: p.size || p.playerSize,
            statusBaju: p.statusBaju,
            statusCelana: p.statusCelana
        }));
    const totalUnit = memberItems.length;
    const totalAmount = order.totalAmount || (totalUnit * 150000);
    const subtotal = totalAmount;
    const basePrice = totalUnit > 0 ? Math.round(subtotal / totalUnit) : 150000;
    const productName = order.details?.[0]?.productTitle || order.product || "Jersey Custom Full Printing";

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
    const isDP = order.paymentType === "DP" || (order.paidAmount > 0 && order.paidAmount < totalAmount);
    const paidAmount = order.paidAmount !== undefined 
        ? order.paidAmount 
        : (isDP ? Math.round(totalAmount * 0.5) : (isPaid ? totalAmount : 0));
    const remainingAmount = order.remainingAmount !== undefined 
        ? order.remainingAmount 
        : Math.max(0, totalAmount - paidAmount);

    // Payment Status Badge
    if (isDP) {
        doc.setFillColor(254, 243, 199); // amber-100
        doc.setDrawColor(245, 158, 11);  // amber-500
        doc.roundedRect(14, finalY + 20, 68, 8, 1, 1, 'FD');
        doc.setFillColor(217, 119, 6);   // amber-600
        doc.circle(18, finalY + 24, 1.5, 'F');
        doc.setFontSize(8);
        doc.setTextColor(180, 83, 9);    // amber-800
        doc.text(remainingAmount > 0 ? "DP Diterima (Belum Lunas)" : "Lunas (Pelunasan DP)", 22, finalY + 25.5);
    } else {
        doc.setFillColor(isPaid ? 236 : 254, isPaid ? 253 : 242, isPaid ? 245 : 242);
        doc.setDrawColor(isPaid ? 16 : 239, isPaid ? 185 : 68, isPaid ? 129 : 68);
        doc.roundedRect(14, finalY + 20, 60, 8, 1, 1, 'FD');
        doc.setFillColor(isPaid ? 16 : 239, isPaid ? 185 : 68, isPaid ? 129 : 68);
        doc.circle(18, finalY + 24, 1.5, 'F');
        doc.setFontSize(8);
        doc.setTextColor(isPaid ? 6 : 153, isPaid ? 95 : 27, isPaid ? 70 : 27);
        doc.text(isPaid ? "Lunas (Full Cash)" : "Menunggu Pembayaran", 22, finalY + 25.5);
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Metode: Transfer BCA (${isDP ? "DP / Uang Muka" : "Full Cash"})`, 14, finalY + 36);
    doc.text(`Tanggal bayar: ${new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}`, 14, finalY + 41);

    // Total Area
    doc.setDrawColor(241, 245, 249);
    doc.line(110, finalY + 15, 195, finalY + 15);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Subtotal", 110, finalY + 22);
    doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, 195, finalY + 22, { align: 'right' });

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(110, finalY + 26, 195, finalY + 26);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("Total Tagihan", 110, finalY + 33);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Rp ${totalAmount.toLocaleString('id-ID')}`, 195, finalY + 33, { align: 'right' });

    if (isDP) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Dibayar (DP):", 110, finalY + 41);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text(`Rp ${paidAmount.toLocaleString('id-ID')}`, 195, finalY + 41, { align: 'right' });

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.2);
        doc.line(110, finalY + 45, 195, finalY + 45);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(225, 29, 72); // rose-600
        doc.text("Sisa Kekurangan:", 110, finalY + 52);
        doc.setFontSize(12);
        doc.text(`Rp ${remainingAmount.toLocaleString('id-ID')}`, 195, finalY + 52, { align: 'right' });

        finalY = finalY + 68;
    } else {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Status:", 110, finalY + 41);
        doc.setTextColor(isPaid ? 6 : 153, isPaid ? 95 : 27, isPaid ? 70 : 27);
        doc.setFont("helvetica", "bold");
        doc.text(isPaid ? "LUNAS (100%)" : "BELUM LUNAS", 195, finalY + 41, { align: 'right' });

        finalY = finalY + 56;
    }

    // Data Pemain Table
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "bold");
    doc.text("RINCIAN DATA PEMAIN", 14, finalY);

    const dataPemainBody = memberItems.map((item: any, idx: number) => {
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
    const catatanText = isDP
        ? (remainingAmount > 0
            ? `Pembayaran DP sebesar Rp ${paidAmount.toLocaleString('id-ID')} telah dicatat. Sisa kekurangan tagihan sebesar Rp ${remainingAmount.toLocaleString('id-ID')} wajib dilunasi sebelum pesanan dikirim atau diambil.`
            : `Pembayaran DP dan sisa tagihan telah LUNAS. Pesanan sedang diproses.`)
        : (isPaid
            ? "Terima kasih sudah mempercayakan pesanan jersey kepada FCSV! Pesanan telah LUNAS (Full Cash) dan sedang diproses."
            : "Terima kasih sudah mempercayakan pesanan jersey kepada FCSV! Pesanan menunggu konfirmasi pembayaran dari admin.");
    doc.text(catatanText, 14, finalY + 5);

    // Watermark Footer
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("Dokumen ini diterbitkan oleh FCSV · order@fcsv.id", 105, 280, { align: 'center' });
    
    doc.save(`Invoice_${order.id || order.orderId}.pdf`);
};
