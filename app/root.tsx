import {
    data,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "react-router";
import { UAParser } from "ua-parser-js";
import type { Route } from "./+types/root";
import { useChangeLanguage } from "remix-i18next/react";
import {
    getLocale,
    i18nextMiddleware,
    localeCookie,
} from "~/middleware/i18next";
import { useTranslation } from "react-i18next";

import { AuthProvider } from "~/context/AuthContext";
// Tambahkan import PasswordProvider
import { PasswordProvider } from "~/context/PasswordContext";

import "~/app.css";

export const unstable_middleware = [i18nextMiddleware];

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
    },
    { rel: "icon", href: "/images/FCSV.jpeg", type: "image/jpeg" },
    { rel: "apple-touch-icon", href: "/images/FCSV.jpeg" },
];

export async function loader({ context, request }: Route.LoaderArgs) {
    const locale = getLocale(context);
    const userAgent = request.headers.get("user-agent");
    const ua = new UAParser(userAgent || "");
    const isMobile = ua.getDevice().type === "mobile";
    return data(
        { locale, isMobile },
        { headers: { "Set-Cookie": await localeCookie.serialize(locale) } },
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    let { i18n } = useTranslation();
    return (
        <html lang={i18n.language} dir={i18n.dir(i18n.language)}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {/* <Header isMobile={isMobile} /> */}
                {children}
                {/* <Footer isMobile={isMobile} /> */}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export type ContextType = { isMobile: boolean | false };

import { CartProvider } from "~/context/CartContext";
import { WishlistProvider } from "~/context/WishlistContext";

export default function App() {
    const { isMobile, locale } = useLoaderData<typeof loader>();
    useChangeLanguage(locale);

    return (
        <AuthProvider>
            <PasswordProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Outlet context={{ isMobile } satisfies ContextType} />
                    </WishlistProvider>
                </CartProvider>
            </PasswordProvider>
        </AuthProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "Terjadi kesalahan yang tidak terduga.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "Halaman yang Anda tuju tidak ditemukan."
                : error.statusText || details;
    } else if (error && error instanceof Error) {
        details = error.message;
        if (import.meta.env.DEV) {
            stack = error.stack;
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 text-center">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-black text-xl">
                    !
                </div>
                <h1 className="text-2xl font-black text-neutral-900">{message}</h1>
                <p className="text-neutral-600 text-sm leading-relaxed">{details}</p>
                <div className="pt-2 flex gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                window.location.href = "/";
                            }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        Ke Beranda
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                window.location.href = "/login";
                            }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                        Halaman Login
                    </button>
                </div>
                {stack && (
                    <details className="text-left mt-4 pt-4 border-t border-neutral-100">
                        <summary className="text-[11px] text-neutral-400 font-mono cursor-pointer hover:underline">
                            Detail Debug
                        </summary>
                        <pre className="mt-2 text-[10px] p-3 bg-neutral-900 text-red-300 rounded-xl overflow-x-auto font-mono">
                            <code>{stack}</code>
                        </pre>
                    </details>
                )}
            </div>
        </main>
    );
}
