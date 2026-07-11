import { useMediaQuery } from "~/hooks/useMediaQuery";
import { ReturBarangDesktop } from "./desktop/ReturBarangDesktop";
import { ReturBarangMobile } from "./mobile/ReturBarangMobile";

export function ReturBarang() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return <ReturBarangDesktop />;
    }

    return <ReturBarangMobile />;
}
