import { 
    type RouteConfig,
    index,
    route,
    prefix,
    layout,
} from "@react-router/dev/routes";

export default [
    route("login", "routes/login/login.tsx"),
    route("register", "routes/register/register.tsx"),

    layout("routes/landing/landing-layout.tsx", [
        route("/", "routes/landing/Home.tsx"),
        route("category", "routes/landing/ListCategory.tsx"),
        route("tracking", "./routes/customer/tracking-pesanan.tsx"),
        route("product/:id", "routes/landing/ProductDetail.tsx"),
        route("about", "routes/landing/About.tsx"),
        route("visi-misi", "routes/landing/VisiMisi.tsx"),
        route("faq", "routes/landing/FAQ.tsx"),
        route("contact", "routes/landing/Contact.tsx"),
    ]),

    // Customer
    layout("routes/customer/layout.tsx", [
        ...prefix("customer", [
            index("routes/customer/customer-dashboard.tsx"),
            route("chat", "routes/customer/customer-chat.tsx"),
            route("profile", "routes/customer/customer-profile.tsx"),
            route("custom-jersey", "routes/customer/CustomJersey.tsx"),
            route("custom-jersey/detail/:id", "routes/customer/custom_jersey_detail.tsx"),
            route("custom-jersey/checkout", "routes/customer/CustomJerseyCheckout.tsx"),
            route("progress-pesanan", "./routes/customer/progress-pesanan.tsx"),
        ]),
    ]),

    // Admin
    layout("routes/admin/layout.tsx", [
        ...prefix("admin", [
            index("routes/admin/dashboard.tsx"),
            route("omset", "routes/admin/omset.tsx"),
            route("users", "routes/admin/users.tsx"),
            route("monitoring-pesanan", "routes/admin/monitoring-pesanan.tsx"),
            route("bahan-baju/create", "routes/admin/bahan-baju-create.tsx"),
            route("bahan-baju/edit/:id", "routes/admin/bahan-baju-edit.$id.tsx"),
            route("bahan-baju/detail/:id", "routes/admin/bahan-baju-detail.$id.tsx"),
            route("bahan-baju", "routes/admin/bahan-baju.tsx"),
            route("chat", "routes/admin/chat.tsx"),
            route("create-account", "routes/admin/create-account.tsx"),
            route("edit-account/:id", "routes/admin/edit-account.$id.tsx"),
            route("retur-barang", "routes/admin/retur-barang.tsx"),
            route("buat-pesanan", "routes/admin/buat-pesanan.tsx"),
        ]),
    ]),

    // Tim Desain
    layout("routes/desain/layout.tsx", [
        ...prefix("desain", [
            index("routes/desain/dashboard.tsx"),
            route("chat", "routes/desain/chat_new.tsx"),
        ]),
    ]),

    // Manager
    layout("routes/manager/layout.tsx", [
        ...prefix("manager", [
            index("routes/manager/index.tsx"), // Default to dashboard
            route("dashboard", "routes/manager/dashboard.tsx"),
            route("users", "routes/manager/users.tsx"),
            route("edit-account/:id", "routes/manager/edit-account.$id.tsx"),
            route("omset", "routes/manager/omset.tsx"),
            route("create-account", "routes/manager/create-account.tsx"),
        ]),
    ]),
    
    // Gudang
    layout("routes/gudang/layout.tsx", [
        ...prefix("gudang", [
            index("routes/gudang/dashboard.tsx"),
            route("bahan-baju/create", "routes/gudang/bahan-baju-create.tsx"),
            route("packing", "routes/gudang/packing.tsx"),
            route("retur-barang", "routes/gudang/retur-barang.tsx"),
        ]),
    ]),
   
] satisfies RouteConfig;

