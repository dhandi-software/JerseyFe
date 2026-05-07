import { 
    type RouteConfig,
    index,
    route,
    prefix,
    layout,
} from "@react-router/dev/routes";

export default [
    route("login", "routes/login/login.tsx"),

    layout("routes/landing/landing-layout.tsx", [
        route("/", "routes/landing/Home.tsx"),
        route("category", "routes/landing/ListCategory.tsx"),
        route("tracking", "./routes/customer/tracking-pesanan.tsx"),
    ]),

    // Customer
    layout("routes/customer/layout.tsx", [
        ...prefix("customer", [
            index("routes/customer/customer-dashboard.tsx"),
            route("chat", "routes/customer/customer-chat.tsx"),
            route("profile", "routes/customer/customer-profile.tsx"),
            route("custom-jersey", "routes/customer/CustomJersey.tsx"),
            route("custom-jersey/checkout", "routes/customer/CustomJerseyCheckout.tsx"),
            route("progress-pesanan", "./routes/customer/progress-pesanan.tsx"),
        ]),
    ]),

    // Admin
    layout("routes/admin/layout.tsx", [
        ...prefix("admin", [
            index("routes/admin/dashboard.tsx"),
            route("users", "routes/admin/users.tsx"),
            route("monitoring-pesanan", "routes/admin/monitoring-pesanan.tsx"),
            route("chat", "routes/admin/chat.tsx"),
            route("create-account", "routes/admin/create-account.tsx"),
            route("edit-account/:id", "routes/admin/edit-account.$id.tsx"),
        ]),
    ]),

    // Tim Desain
    layout("routes/desain/layout.tsx", [
        ...prefix("desain", [
            index("routes/desain/dashboard.tsx"),
            route("chat", "routes/desain/chat_new.tsx"),
        ]),
    ]),
   
] satisfies RouteConfig;

