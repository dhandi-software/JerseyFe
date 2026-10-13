import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

export default function Header({ isMobile }: { isMobile?: boolean }) {
    return (
        <>
            <div className="md:hidden">
                <HeaderMobile />
            </div>
            <div className="hidden md:block">
                <HeaderDesktop />
            </div>
        </>
    );
}