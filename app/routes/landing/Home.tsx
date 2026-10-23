import { getInstance } from "~/middleware/i18next";
import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { HomeDesktop, HomeMobile } from "~/features/landing/home/pages";
import type { Route } from "./+types/Home";
export async function loader({ context }: Route.LoaderArgs) {
    try {
        const i18next = context ? getInstance(context) : null;
        return {
            title: i18next?.t ? i18next.t("title") : "FCSV",
            description: i18next?.t ? i18next.t("description") : "Welcome to FCSV - Custom Jersey Premium",
        };
    } catch {
        return {
            title: "FCSV",
            description: "Welcome to FCSV - Custom Jersey Premium",
        };
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const outletContext = useOutletContext<ContextType | null | undefined>();
    const isMobile = Boolean(outletContext?.isMobile);
    return isMobile ? <HomeMobile /> : <HomeDesktop />;
}

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "FCSV" },
        { name: "description", content: "Welcome to FCSV - Custom Jersey Premium" },
    ];
}
