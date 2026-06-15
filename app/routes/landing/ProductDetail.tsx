import { CustomJerseyDetailDesktop } from "~/features/customer/custom-jersey/CustomJerseyDetailDesktop";
import { CustomJerseyDetailMobile } from "~/features/customer/custom-jersey/CustomJerseyDetailMobile";
import { useRouteLoaderData } from "react-router";
import type { ContextType } from "~/root";

export default function ProductDetailRoute() {
    const { isMobile } = useRouteLoaderData("root") as ContextType;
    
    if (isMobile) {
        return <CustomJerseyDetailMobile />;
    }
    
    return <CustomJerseyDetailDesktop />;
}
