import { client } from "~/api/client";

export const orderService = {
    async createOrder(orderData: any) {
        const response = await client.post("/orders", orderData);
        return response.data;
    },

    async getOrders() {
        const response = await client.get("/orders");
        return response.data;
    },
    
    async updateOrderStatus(id: number, status: string, designerId?: number) {
        const payload: any = { status };
        if (designerId) payload.designerId = designerId;
        const response = await client.patch(`/orders/${id}/status`, payload);
        return response.data;
    },

    async getCustomerOrders(customerId: number) {
        const response = await client.get(`/orders/customer/${customerId}`);
        return response.data;
    },

    async getDesignerOrders(designerId: number) {
        const response = await client.get(`/orders/designer/${designerId}`);
        return response.data;
    },

    async trackOrder(orderId: string) {
        const response = await client.get(`/orders/track/${orderId}`);
        return response.data;
    }
};
