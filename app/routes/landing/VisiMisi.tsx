import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { VisiMisiSection as VisiMisiDesktop } from "~/features/landing/home/components/Home/HomeDesktop/VisiMisiSection";
import { VisiMisiSection as VisiMisiMobile } from "~/features/landing/home/components/Home/HomeMobile/VisiMisiSection";

export default function VisiMisiPage() {
    const { isMobile } = useOutletContext<ContextType>();
    return isMobile ? <VisiMisiMobile /> : <VisiMisiDesktop />;
}
