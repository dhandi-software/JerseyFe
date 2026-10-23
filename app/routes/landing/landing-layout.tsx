import { Outlet, useRouteLoaderData, useLocation } from "react-router";
import type { ContextType } from "~/root";
import Header from "~/components/template/Header";
import Footer from "~/components/template/footer";
import Navbar from "~/components/template/navbar";

export default function LandingLayout() {
    const rootData = useRouteLoaderData<ContextType>("root");
    const isMobile = rootData?.isMobile ?? false;
    const location = useLocation();

    // Hide navbar on article detail pages
    const isArticlePage = location.pathname.startsWith("/article/");

    return (
        <>
            <div className="sticky top-0 z-50 w-full shadow-sm">
                <Header isMobile={isMobile} />
                {!isArticlePage && <Navbar />}
            </div>
            <main>
                <Outlet
                    context={{ isMobile: isMobile } satisfies ContextType}
                />
            </main>
            <Footer isMobile={isMobile} />
        </>
    );
}
