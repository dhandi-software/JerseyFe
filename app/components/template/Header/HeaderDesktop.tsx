import { cn } from "~/lib/utils";

export default function HeaderDesktop() {
    return (
        <div className={cn("w-full px-[1.85rem] py-[0.5rem] bg-[#F7F7F7] border-b border-black/5 flex justify-between items-center font-['Inter']")}>
            {/* Left Section: Company Info */}
            <div className="flex items-center gap-[1.5rem]">
                <div className="text-neutral-500 hover:text-black text-[0.875rem] font-medium tracking-wide cursor-pointer transition-colors">About Us</div>
                <div className="text-neutral-500 hover:text-black text-[0.875rem] font-medium tracking-wide cursor-pointer transition-colors">Visi Misi Perusahaan</div>
            </div>

            {/* Right Section: Support Links */}
            <div className="flex items-center gap-[1.5rem]">
                <div className="text-neutral-500 hover:text-black text-[0.875rem] font-medium tracking-wide cursor-pointer transition-colors">Tracking Package</div>
                <div className="text-neutral-500 hover:text-black text-[0.875rem] font-medium tracking-wide cursor-pointer transition-colors">FAQ</div>
                <div className="text-neutral-500 hover:text-black text-[0.875rem] font-medium tracking-wide cursor-pointer transition-colors">Contact Us</div>
            </div>
        </div>
    );
}
