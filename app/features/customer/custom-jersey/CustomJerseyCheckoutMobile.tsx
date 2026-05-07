import { useState, useEffect } from "react";
import { 
    ChevronLeft, 
    User, 
    Hash, 
    Ruler, 
    Upload, 
    FileText, 
    CheckCircle2, 
    ArrowRight, 
    CreditCard, 
    ShoppingCart,
    Info,
    FileUp,
    AlertCircle,
    Loader2,
    X,
    ClipboardPaste,
    Plus,
    Minus,
    Trash2
} from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/CartContext";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { orderService } from "~/services/orderService";
import { chatService } from "~/services/chatService";
import { useAuth } from "~/context/AuthContext";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";
import { Toast } from "~/components/ui/toast";

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 1000;
                const MAX_HEIGHT = 1000;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" }));
                    } else {
                        resolve(file);
                    }
                }, "image/jpeg", 0.7);
            };
        };
    });
};

export function CustomJerseyCheckoutMobile({ title }: { title: string }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const [step, setStep] = useState(1);
    
    const [customDetails, setCustomDetails] = useState<any[]>([]);
    const [designNote, setDesignNote] = useState("");
    const [designReferenceFile, setDesignReferenceFile] = useState<File | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [pasteText, setPasteText] = useState("");
    const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [playerCountInput, setPlayerCountInput] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string, variant: "success" | "destructive" | "default" }>({ 
        show: false, 
        message: "", 
        variant: "success" 
    });

    const generateTable = () => {
        const count = parseInt(playerCountInput);
        if (isNaN(count) || count <= 0) {
            setToast({ show: true, message: "Masukkan jumlah pemain yang valid", variant: "destructive" });
            return;
        }
        const productId = cart[0]?.product.id || 101;
        const productTitle = cart[0]?.product.title || "Custom Jersey";
        const price = cart[0]?.product.price || 150000;
        const image = cart[0]?.product.image || "";
        
        const newDetails = Array.from({ length: count }).map((_, idx) => ({
            id: `gen-m-${idx}-${Date.now()}`,
            productId,
            productTitle,
            price,
            image,
            name: "",
            number: "",
            size: "L"
        }));
        setCustomDetails(newDetails);
        setPlayerCountInput("");
        setToast({ show: true, message: `Berhasil membuat tabel untuk ${count} pemain`, variant: "success" });
    };

    const resetTable = () => {
        setCustomDetails([]);
        setIsResetDialogOpen(false);
        setToast({ show: true, message: "Tabel berhasil direset", variant: "success" });
    };

    useEffect(() => {
        if (customDetails.length === 0 && cart.length > 0) {
            const initialDetails = cart.flatMap(item => 
                Array.from({ length: item.quantity }).map((_, idx) => ({
                    id: `${item.product.id}-${Math.random().toString(36).substr(2, 9)}`,
                    productId: item.product.id,
                    productTitle: item.product.title,
                    price: item.product.price,
                    image: item.product.image,
                    name: "",
                    number: "",
                    size: "L"
                }))
            );
            setCustomDetails(initialDetails);
        }
    }, [cart, customDetails.length]);

    const parsePasteData = () => {
        const lines = pasteText.split('\n').filter(l => l.trim());
        const newDetails = lines.map((line, idx) => {
            let tempLine = line.trim();
            
            // Extract Size (S-5XL)
            const sizeRegex = /\b(S|M|L|XL|XXL|XXXL|4XL|5XL)\b/i;
            const sizeMatch = tempLine.match(sizeRegex);
            const size = sizeMatch ? sizeMatch[0].toUpperCase() : "L";
            if (sizeMatch) tempLine = tempLine.replace(sizeMatch[0], "");

            // Extract Number
            const numberRegex = /"\s*(\d+)\s*"|\b(\d+)\b/;
            const numberMatch = tempLine.match(numberRegex);
            const number = numberMatch ? (numberMatch[1] || numberMatch[2]) : "";
            if (numberMatch) tempLine = tempLine.replace(numberMatch[0], "");

            // Extract Name
            let name = tempLine
                .replace(/^\d+[\.\)]\s*/, '')
                .replace(/["'\(\)\[\]\{\}]/g, '')
                .replace(/[-–—,;|]/g, ' ')
                .trim();

            return {
                id: `pasted-m-${idx}-${Date.now()}`,
                productId: cart[0]?.product.id || 101,
                productTitle: cart[0]?.product.title || "Custom Jersey",
                price: cart[0]?.product.price || 150000,
                image: cart[0]?.product.image || "",
                name: name.toUpperCase(),
                number: number,
                size: size
            };
        });
        setCustomDetails(newDetails);
        setIsPasteDialogOpen(false);
        setPasteText("");
        setToast({ show: true, message: `Parsed ${newDetails.length} players!`, variant: "success" });
    };

    const removeUnit = (id: string) => {
        setCustomDetails(prev => prev.filter(d => d.id !== id));
    };

    const isStepValid = () => {
        if (step === 1) {
            if (pdfFile) return true;
            if (customDetails.length === 0) return false;
            return customDetails.every(d => d.name.trim() !== "" && d.number.trim() !== "" && d.size !== "");
        }
        if (step === 2) return true;
        if (step === 3) return !!paymentProofFile;
        return true;
    };

    const handleNextStep = () => {
        if (!isStepValid()) {
            setShowValidation(true);
            setToast({ 
                show: true, 
                message: step === 1 ? "Mohon lengkapi detail pemain secara lengkap" : "Lengkapi langkah ini dulu", 
                variant: "destructive" 
            });
            return;
        }
        setShowValidation(false);
        setStep(prev => prev + 1);
    };

    const updateUnitQuantity = (productId: number, delta: number) => {
        if (delta > 0) {
            const product = cart.find(item => item.product.id === productId)?.product || 
                          { id: productId, title: "Custom Jersey", price: 150000, image: "" };
            
            setCustomDetails(prev => [...prev, {
                id: `${productId}-${Math.random().toString(36).substr(2, 9)}`,
                productId: productId,
                productTitle: product.title,
                price: product.price,
                image: product.image,
                name: "",
                number: "",
                size: "L"
            }]);
        } else {
            const lastIdx = [...customDetails].reverse().findIndex(d => d.productId === productId);
            if (lastIdx !== -1) {
                const actualIdx = customDetails.length - 1 - lastIdx;
                setCustomDetails(prev => prev.filter((_, i) => i !== actualIdx));
            }
        }
    };

    const totalCalculated = customDetails.reduce((acc, d) => acc + (d.price || 0), 0);

    const handleDetailChange = (id: string, field: string, value: string) => {
        setCustomDetails(prev => prev.map(detail => 
            detail.id === id ? { ...detail, [field]: value } : detail
        ));
    };

    const handleSubmit = async () => {
        if (!isStepValid()) {
            setShowValidation(true);
            setToast({ show: true, message: "Mohon lengkapi seluruh data (Pemain & Bukti Bayar) sebelum mengirim.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);
        try {
            let designUrl = "";
            let paymentUrl = "";

            if (designReferenceFile) {
                setUploadProgress(30);
                const compressed = await compressImage(designReferenceFile);
                const res = await chatService.uploadFile(compressed);
                designUrl = res.url;
            }

            if (paymentProofFile) {
                setUploadProgress(60);
                const compressed = await compressImage(paymentProofFile);
                const res = await chatService.uploadFile(compressed);
                paymentUrl = res.url;
            }

            setUploadProgress(90);
            
            try {
                await orderService.createOrder({
                    customerId: user?.id || 0,
                    totalAmount: totalCalculated,
                    designNote: designNote,
                    designUrl: designUrl,
                    paymentUrl: paymentUrl,
                    details: customDetails.map(d => ({
                        productId: d.productId,
                        productTitle: d.productTitle,
                        playerName: d.name,
                        playerNumber: d.number,
                        playerSize: d.size
                    }))
                });

                setUploadProgress(100);
                setToast({ show: true, message: "Pesanan berhasil dibuat dan telah terkirim ke sistem admin!", variant: "success" });
                setTimeout(() => {
                    clearCart();
                    navigate("/customer");
                }, 1500);
            } catch (apiErr) {
                console.error("API Order failed", apiErr);
                setToast({ show: true, message: "Gagal membuat pesanan. Silakan coba lagi.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setToast({ show: true, message: "Gagal mengunggah data. Silakan coba lagi.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-['Inter']">
            {/* Mobile Header */}
            <div className="bg-white px-5 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 z-50 shrink-0">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ChevronLeft className="w-6 h-6 text-neutral-400" />
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#D25026] rounded-lg flex items-center justify-center">
                            <ShoppingCart className="text-white w-3.5 h-3.5" />
                        </div>
                        <span className="font-black italic uppercase text-xs tracking-tighter text-neutral-900">Checkout</span>
                    </div>
                    <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-1 italic leading-none">{user?.username || "Guest User"}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                    <User className="w-4 h-4 text-neutral-300" />
                </div>
            </div>

            {/* Step Indicator Mobile */}
            <div className="px-5 py-6 bg-white border-b border-neutral-100 shrink-0">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 flex-1 relative">
                            {s !== 1 && <div className={cn("absolute left-0 right-1/2 top-4 h-0.5 -translate-x-1/2 w-full", step >= s ? "bg-[#D25026]" : "bg-neutral-100")}></div>}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black z-10 transition-all",
                                step === s ? "bg-black text-white shadow-lg" : 
                                step > s ? "bg-[#D25026] text-white" : "bg-neutral-100 text-neutral-400"
                            )}>
                                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest italic", step === s ? "text-neutral-900" : "text-neutral-300")}>
                                {s === 1 ? "Players" : s === 2 ? "Design" : "Payment"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-8 space-y-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-black italic uppercase tracking-tighter">Player Info</h2>
                            <div className="flex gap-2 flex-wrap justify-end">
                                <div className="flex items-center gap-1.5 bg-white rounded-xl border border-neutral-200 p-1">
                                    <Input 
                                        type="number" 
                                        placeholder="Jml" 
                                        value={playerCountInput} 
                                        onChange={(e) => setPlayerCountInput(e.target.value)}
                                        className="w-16 rounded-lg h-7 border-none focus-visible:ring-0 text-[10px] font-bold bg-transparent px-2"
                                    />
                                    <Button onClick={generateTable} variant="default" className="rounded-lg h-7 px-2 bg-black text-white hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest italic transition-all shadow-sm">
                                        Buat
                                    </Button>
                                </div>
                                
                                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="rounded-xl h-9 px-2 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-3xl p-6 w-[calc(100vw-2.5rem)] max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-black italic uppercase tracking-tighter">Reset Tabel?</DialogTitle>
                                            <DialogDescription className="text-[10px] font-medium text-neutral-500 italic mt-1">
                                                Seluruh data pemain yang sudah dimasukkan akan dihapus secara permanen.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex gap-2 mt-6">
                                            <Button onClick={() => setIsResetDialogOpen(false)} variant="ghost" className="flex-1 rounded-xl h-10 text-[9px] font-black uppercase italic">Batal</Button>
                                            <Button onClick={resetTable} variant="destructive" className="flex-1 rounded-xl h-10 text-[9px] font-black uppercase italic shadow-lg shadow-red-500/20">Reset</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1.5">
                                            <ClipboardPaste className="w-3 h-3" />
                                            PASTE
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100vw-2rem)] max-w-lg rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                                        <div className="relative h-24 bg-black flex flex-col justify-center px-8 shrink-0">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 0.0625rem 0.0625rem, white 0.0625rem, transparent 0)', backgroundSize: '1rem 1rem' }}></div>
                                            <DialogTitle className="text-lg font-black italic uppercase tracking-tighter text-white">Paste Player List</DialogTitle>
                                            <DialogDescription className="text-neutral-400 font-medium text-[10px]">Format: Nama "No" Ukuran</DialogDescription>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-neutral-400 ml-1 italic">Paste Your List Here</Label>
                                                <Textarea 
                                                    value={pasteText}
                                                    onChange={(e) => setPasteText(e.target.value)}
                                                    placeholder={"1. zax_two \" 42 \" (XL)\n2. yusuf \" 23 \" (XL)"}
                                                    className="min-h-[15.625rem] rounded-2xl border-neutral-100 text-sm p-4 focus:ring-[#D25026]/10 bg-neutral-50 resize-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-6 pt-4 border-t border-neutral-50 bg-white shrink-0">
                                            <div className="flex gap-2">
                                                <Button onClick={() => setIsPasteDialogOpen(false)} variant="ghost" className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest italic">Cancel</Button>
                                                <Button onClick={parsePasteData} className="flex-[2] rounded-xl h-12 bg-[#D25026] text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D25026]/20">Process</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <div className="relative">
                                    <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 z-10" />
                                    <Button variant="outline" size="sm" className="rounded-xl h-9 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1.5">
                                        <FileText className="w-3 h-3" />
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {pdfFile && (
                            <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
                                <FileText className="text-emerald-500 w-5 h-5" />
                                <span className="text-[11px] font-bold text-emerald-900 truncate flex-1">{pdfFile.name}</span>
                                <button onClick={() => setPdfFile(null)}><X className="w-4 h-4 text-emerald-400" /></button>
                            </div>
                        )}

                        {!pdfFile && (
                                <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl overflow-hidden relative ring-1 ring-black/5">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[5rem] pointer-events-none"></div>
                                    <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                                        <table className="w-full text-left border-collapse min-w-[40.625rem]">
                                            <thead>
                                                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                                    <th className="p-4 pl-5 text-[9px] font-black uppercase tracking-widest text-neutral-400 italic w-12 text-center">No</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-400 italic">Nama</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-400 italic text-center w-20">No. Punggung</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-400 italic text-center w-[180px]">Ukuran Baju</th>
                                                    <th className="p-4 pr-5 text-[9px] font-black uppercase tracking-widest text-neutral-400 italic text-right w-14"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {customDetails.map((detail, index) => (
                                                    <tr key={detail.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                                        <td className="p-3 pl-5 text-center">
                                                            <span className="text-[11px] font-black text-neutral-400">{index + 1}</span>
                                                        </td>
                                                        <td className="p-3">
                                                            <Input 
                                                                value={detail.name}
                                                                onChange={(e) => handleDetailChange(detail.id, "name", e.target.value)}
                                                                placeholder="NAME" 
                                                                className={cn(
                                                                    "h-9 rounded-xl border-neutral-200 focus:ring-[#D25026]/10 focus:border-[#D25026]/30 bg-white text-[10px] font-black uppercase text-neutral-900 placeholder:text-neutral-300 px-3 transition-all",
                                                                    showValidation && !detail.name.trim() && "border-red-500 bg-red-50/30"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <Input 
                                                                value={detail.number}
                                                                onChange={(e) => handleDetailChange(detail.id, "number", e.target.value)}
                                                                placeholder="00" 
                                                                className={cn(
                                                                    "h-9 rounded-xl border-neutral-200 focus:ring-[#D25026]/10 focus:border-[#D25026]/30 bg-white text-[10px] font-black text-center text-neutral-900 placeholder:text-neutral-300 px-2 transition-all",
                                                                    showValidation && !detail.number.trim() && "border-red-500 bg-red-50/30"
                                                                )}
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl h-9 w-max mx-auto border border-neutral-200">
                                                                {["S", "M", "L", "XL", "XXL"].map(size => (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => handleDetailChange(detail.id, "size", size)}
                                                                        className={cn(
                                                                            "w-7 rounded-lg text-[9px] font-black transition-all",
                                                                            detail.size === size 
                                                                                ? "bg-black text-white shadow-md shadow-black/10" 
                                                                                : "text-neutral-400 hover:text-black hover:bg-neutral-200"
                                                                        )}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 pr-5 text-right">
                                                            <button 
                                                                onClick={() => removeUnit(detail.id)}
                                                                className="w-8 h-8 bg-red-50 text-red-500 rounded-xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all ml-auto"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Design Reference</h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase italic text-neutral-400">Catatan Desain</Label>
                                <Textarea 
                                    value={designNote}
                                    onChange={(e) => setDesignNote(e.target.value)}
                                    placeholder="Warna logo, sponsor, dll..." 
                                    className="min-h-[120px] rounded-2xl border-neutral-100 p-4 text-sm"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase italic text-neutral-400">Referensi Gambar</Label>
                                <div className="h-48 border-2 border-dashed border-neutral-100 rounded-3xl bg-white flex flex-col items-center justify-center gap-3 relative overflow-hidden group transition-all active:scale-95">
                                    {designReferenceFile ? (
                                        <img src={URL.createObjectURL(designReferenceFile)} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center">
                                                <FileUp className="w-6 h-6 text-neutral-300" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase italic text-neutral-400">Click to Upload</span>
                                        </>
                                    )}
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 z-10" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setDesignReferenceFile(file);
                                                setToast({ show: true, message: "Design reference uploaded!", variant: "success" });
                                            }
                                        }} 
                                    />
                                </div>
                                {designReferenceFile && <button onClick={() => setDesignReferenceFile(null)} className="w-full text-center text-[10px] font-black text-red-400 uppercase italic pt-2">Remove Reference</button>}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Payment Details</h2>

                        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="w-16 h-8 bg-[#00529C] rounded flex items-center justify-center font-black text-white italic tracking-tighter text-lg">BCA</div>
                                <span className="text-[9px] font-black uppercase italic text-emerald-500">Official</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase italic text-neutral-300">Account Number</span>
                                <p className="text-2xl font-black italic tracking-tighter">4921 8972 72</p>
                                <p className="text-[10px] font-black uppercase italic text-neutral-900 mt-1">AN. BAHRUDIN YUSUF</p>
                            </div>
                        </div>

                        {/* Order Summary Card Mobile */}
                        <div className="bg-black rounded-[2rem] p-6 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/20 blur-[2.5rem] rounded-full z-0"></div>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase italic text-white/40">Subtotal</span>
                                    <span className="text-xs font-black text-white italic">{formatRupiah(totalCalculated)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase italic text-white/40">Service Fee</span>
                                    <span className="text-xs font-black text-white italic">{formatRupiah(20000)}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase italic text-white">Grand Total</span>
                                    <span className="text-lg font-black text-blue-400 italic tracking-tighter">{formatRupiah(totalCalculated + 20000)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase italic text-neutral-400">Bukti Pembayaran (DP/Lunas)</Label>
                            <div className={cn(
                                "h-64 border-2 border-dashed border-neutral-100 rounded-[2rem] bg-white flex flex-col items-center justify-center gap-3 relative overflow-hidden active:scale-95 transition-transform",
                                showValidation && step === 3 && !paymentProofFile && "border-red-500 bg-red-50/10"
                            )}>
                                {paymentProofFile ? (
                                    <img src={URL.createObjectURL(paymentProofFile)} className="w-full h-full object-contain" />
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center">
                                            <CreditCard className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase italic text-neutral-400">Upload Receipt</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 z-10" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setPaymentProofFile(file);
                                            setToast({ show: true, message: "Payment proof uploaded!", variant: "success" });
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Footer Sticky */}
            <div className="bg-white border-t border-neutral-100 p-5 sticky bottom-0 z-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase italic text-neutral-400">Grand Total</span>
                    <span className="text-xl font-black italic tracking-tighter text-[#D25026]">{formatRupiah(totalCalculated + 20000)}</span>
                </div>
                
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => step === 1 ? navigate(-1) : setStep(s => s - 1)}
                        className="flex-1 h-12 rounded-xl border-neutral-100 text-xs font-black uppercase italic"
                    >
                        {step === 1 ? "Exit" : "Back"}
                    </Button>
                    <Button 
                        onClick={() => step === 3 ? handleSubmit() : handleNextStep()}
                        disabled={isUploading || (step === 3 && !paymentProofFile)}
                        className="flex-[2] h-12 rounded-xl bg-[#D25026] text-white text-xs font-black uppercase italic shadow-lg shadow-[#D25026]/20"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 3 ? "Complete Order" : "Next Step")}
                    </Button>
                </div>

                {isUploading && (
                    <div className="mt-4 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D25026] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
            </div>

            {toast.show && (
                <Toast 
                    title={toast.message} 
                    variant={toast.variant} 
                    onClose={() => setToast(prev => ({ ...prev, show: false }))} 
                />
            )}
        </div>
    );
}
