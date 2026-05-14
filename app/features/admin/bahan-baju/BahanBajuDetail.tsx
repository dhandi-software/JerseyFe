import { useMediaQuery } from "~/hooks/useMediaQuery";
import { BahanBajuDetailDesktop } from "./desktop/BahanBajuDetailDesktop";
import { BahanBajuDetailMobile } from "./mobile/BahanBajuDetailMobile";

export function BahanBajuDetail() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return <BahanBajuDetailDesktop />;
    }

    return <BahanBajuDetailMobile />;
}
