import { useState, useEffect } from "react";
import { getInstance } from "~/middleware/i18next";
import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { ListCategoryDesktop, ListCategoryMobile } from "~/features/landing/ListCategory";
import type { Route } from "./+types";

export async function loader({ context }: Route.LoaderArgs) {
    let i18next = getInstance(context);
    return {
        title: "List Category",
        description: "Sistem Point of Sale",
    };
}

export default function ListCategory({ loaderData }: Route.ComponentProps) {
    const context = useOutletContext<ContextType>();
    const [isMobileClient, setIsMobileClient] = useState(context?.isMobile ?? false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobileClient(window.innerWidth < 768);
        };
        
        // Check once on mount
        checkMobile();
        
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobileClient ? <ListCategoryMobile /> : <ListCategoryDesktop />;
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "List Category" },
        { name: "description", content: "Sistem Point of Sale" },
    ];
}
