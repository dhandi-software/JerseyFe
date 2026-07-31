import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { CustomJerseyCheckoutDesktop } from "~/features/customer/custom-jersey/CustomJerseyCheckoutDesktop";
import { CustomJerseyCheckoutMobile } from "~/features/customer/custom-jersey/CustomJerseyCheckoutMobile";

export default function CustomJerseyCheckoutRoute() {
    const { isMobile } = useOutletContext<ContextType>();
    
    return isMobile ? (
        <CustomJerseyCheckoutMobile title="Checkout Custom Jersey" />
    ) : (
        <CustomJerseyCheckoutDesktop title="Checkout Custom Jersey" />
    );
}

export function meta() {
    return [
        { title: "Checkout Custom Jersey - FCSV" },
        { name: "description", content: "Lengkapi detail pesanan jersey custom Anda" },
    ];
}
