import { useMediaQuery } from "~/hooks/useMediaQuery";
import { BahanBajuEditDesktop } from "./desktop/BahanBajuEditDesktop";
import { BahanBajuEditMobile } from "./mobile/BahanBajuEditMobile";

export function BahanBajuEdit() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return <BahanBajuEditDesktop />;
    }

    return <BahanBajuEditMobile />;
}
