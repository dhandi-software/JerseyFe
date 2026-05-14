import { useMediaQuery } from "~/hooks/useMediaQuery";
import { BahanBajuCreateDesktop } from "./desktop/BahanBajuCreateDesktop";
import { BahanBajuCreateMobile } from "./mobile/BahanBajuCreateMobile";

export function BahanBajuCreate() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return <BahanBajuCreateDesktop />;
    }

    return <BahanBajuCreateMobile />;
}
