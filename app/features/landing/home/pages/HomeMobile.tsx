import { NewHeroSection } from "~/features/landing/home/components/Home/HomeMobile/NewHeroSection";
import { TrackingSectionMobile } from "~/features/landing/home/components/Home/HomeMobile/TrackingSectionMobile";
import { AboutSection } from "~/features/landing/home/components/Home/HomeMobile/AboutSection";
import { VisiMisiSection } from "~/features/landing/home/components/Home/HomeMobile/VisiMisiSection";
import { InfoSection } from "~/features/landing/home/components/Home/HomeMobile/InfoSection";


export function HomeMobile() {
    return (
        <main className="w-full bg-white min-h-screen pb-12">
             <div className="flex flex-col w-full">
                <NewHeroSection />
                <TrackingSectionMobile />
                <AboutSection />
                <InfoSection />
                <VisiMisiSection />
             </div>
        </main>
    );
}
