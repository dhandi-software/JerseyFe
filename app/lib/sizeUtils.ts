import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const SIZE_ORDER = [
    'XXS',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '2XL',
    '3XL',
    '4XL',
    '5XL',
    '6XL'
];

/**
 * Sorts an array of player objects by their size based on the standard SIZE_ORDER.
 * @param players Array of player objects with a 'size' property.
 * @returns Sorted array of players.
 */
export const sortPlayersBySize = (players: any[]) => {
    return [...players].sort((a, b) => {
        const sizeA = (a.size || a.playerSize || "").toUpperCase();
        const sizeB = (b.size || b.playerSize || "").toUpperCase();

        const indexA = SIZE_ORDER.indexOf(sizeA);
        const indexB = SIZE_ORDER.indexOf(sizeB);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        return sizeA.localeCompare(sizeB);
    });
};



export const downloadPlayersPDF = (order: any) => {
    const doc = new jsPDF();
    const orderId = order.id || order.orderId;
    const customer = order.customer || order.customerName || "GUEST";
    const date = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : "-");
    const totalAmount = order.totalAmount || 0;
    const qty = order.playerInfo.length || 0;
    const pricePerItem = qty > 0 ? totalAmount / qty : 0;

    // --- Header ---
    doc.setFillColor(30, 58, 138); // Dark Blue #1e3a8a
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("FSCV Custom Jersey", 15, 18);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Penyedia Layanan Custom Jersey & Sportswear Premium", 15, 24);

    // --- Info Grid ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DETAIL PESANAN", 15, 45);
    doc.setDrawColor(238, 238, 238);
    doc.line(15, 48, 195, 48);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("ID PESANAN", 15, 58);
    doc.text("PELANGGAN", 60, 58);
    doc.text("TANGGAL", 130, 58);
    doc.text("STATUS", 175, 58);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(orderId, 15, 65);
    
    // Handle long email/username
    const customerText = customer.length > 25 ? customer.substring(0, 22) + "..." : customer;
    doc.text(customerText, 60, 65);
    doc.text(date, 130, 65);
    doc.text(order.status || "-", 175, 65);

    // --- Table ---
    const tableData = order.playerInfo.map((p: any, index: number) => [
        (index + 1).toString(),
        (p.name || p.playerName || "-").toUpperCase(),
        p.number || p.playerNumber || "-",
        p.size || p.playerSize || "-"
    ]);

    autoTable(doc, {
        startY: 75,
        head: [['NO', 'NAMA PEMAIN', 'NOMOR', 'UKURAN']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [248, 250, 252],
            textColor: [51, 65, 85],
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.1,
            lineColor: [226, 232, 240]
        },
        bodyStyles: {
            textColor: [30, 41, 59],
            fontSize: 9,
            cellPadding: 5
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { halign: 'left' },
            2: { halign: 'center', cellWidth: 30 },
            3: { halign: 'center', cellWidth: 30 }
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        margin: { left: 15, right: 15 }
    });

    // --- Summary Section ---
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    
    doc.text("Jumlah Item:", 110, finalY);
    doc.text("Harga per Item:", 110, finalY + 7);
    
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(`${qty} Jersey`, 195, finalY, { align: 'right' });
    doc.text(formatCurrency(pricePerItem), 195, finalY + 7, { align: 'right' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(110, finalY + 12, 195, finalY + 12);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138); // Blue
    doc.text("TOTAL PEMBAYARAN", 110, finalY + 22);
    doc.setFontSize(16);
    doc.text(formatCurrency(totalAmount), 195, finalY + 22, { align: 'right' });

    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `FSCV Official | Halaman ${i} dari ${pageCount}`,
            105,
            285,
            { align: "center" }
        );
    }

    doc.save(`Pesanan_FSCV_${orderId}.pdf`);
};

export const SIZE_REGEX = /\b(XXS|XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL|6XL)\b/i;
