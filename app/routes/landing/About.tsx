import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { AboutSection as AboutDesktop } from "~/features/landing/home/components/Home/HomeDesktop/AboutSection";
import { AboutSection as AboutMobile } from "~/features/landing/home/components/Home/HomeMobile/AboutSection";

export default function AboutPage() {
    const { isMobile } = useOutletContext<ContextType>();
    return isMobile ? <AboutMobile /> : <AboutDesktop />;
}
