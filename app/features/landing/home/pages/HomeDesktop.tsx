import { NewHeroSection } from "~/features/landing/home/components/Home/HomeDesktop/NewHeroSection";
import { TrackingSection } from "~/features/landing/home/components/Home/HomeDesktop/TrackingSection";
import { AboutSection } from "~/features/landing/home/components/Home/HomeDesktop/AboutSection";
import { StepsSection } from "~/features/landing/home/components/Home/HomeDesktop/StepsSection";
import { VisiMisiSection } from "~/features/landing/home/components/Home/HomeDesktop/VisiMisiSection";


import { InfoSection } from "~/features/landing/home/components/Home/HomeDesktop/InfoSection";

export function HomeDesktop() {
    return (
        <main className="w-full bg-white flex flex-col items-center">
            <NewHeroSection />
            <TrackingSection />
            <InfoSection />
            <AboutSection />
            <VisiMisiSection />
         
        </main>
    );
}
