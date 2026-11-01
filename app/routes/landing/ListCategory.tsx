import { useOutletContext } from "react-router";
import { getInstance } from "~/middleware/i18next";
import { ListCategoryDesktop, ListCategoryMobile } from "~/features/landing/ListCategory";

export async function loader({ context }: { context?: any }) {
    const i18next = getInstance(context);
    return {
        title: "List Category - FCSV Apparel",
        description: "Katalog Bahan & Koleksi Jersey Resmi FCSV Apparel",
    };
}

export function meta() {
    return [
        { title: "List Category - FCSV Apparel" },
        {
            name: "description",
            content: "Katalog Bahan & Koleksi Jersey Resmi FCSV Apparel",
        },
    ];
}

export default function ListCategory() {
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    return isMobile ? <ListCategoryMobile /> : <ListCategoryDesktop />;
}
