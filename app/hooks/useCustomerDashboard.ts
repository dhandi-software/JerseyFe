import { useState, useEffect, useMemo } from "react";
import { useAuth } from "~/hooks/useAuth";
import { orderService } from "~/services/orderService";

export function useCustomerDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const data = await orderService.getCustomerOrders(user.id);
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch customer orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const activeOrders = useMemo(() => {
        return orders.filter(o => o.status !== "SELESAI" && o.status !== "DITOLAK");
    }, [orders]);

    return {
        user,
        orders,
        activeOrders,
        loading
    };
}
