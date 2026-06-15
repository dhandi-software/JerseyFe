import { client } from "~/api/client";

const mapOrder = (o: any) => {
    if (!o) return o;
    return {
        ...o,
        designStatus: o.designStatus === "PENDING" || !o.designStatus ? (o.mockupUrl ? "SENT" : "PENDING") : o.designStatus
    };
};

export const orderService = {
    async createOrder(orderData: any) {
        const response = await client.post("/orders", orderData);
        return mapOrder(response.data);
    },

    async updateOrder(id: number, orderData: any) {
        const response = await client.put(`/orders/${id}`, orderData);
        return mapOrder(response.data);
    },

    async getOrders() {
        const response = await client.get("/orders");
        return (response.data || []).map(mapOrder);
    },
    
    async updateOrderStatus(id: number, status: string, designerId?: number, isWorking?: boolean) {
        const payload: any = { status };
        if (designerId) payload.designerId = designerId;
        if (isWorking !== undefined) payload.isWorking = isWorking;
        const response = await client.patch(`/orders/${id}/status`, payload);
        return mapOrder(response.data);
    },

    async getCustomerOrders(customerId: number) {
        const response = await client.get(`/orders/customer/${customerId}`);
        return (response.data || []).map(mapOrder);
    },

    async getDesignerOrders(designerId: number) {
        const response = await client.get(`/orders/designer/${designerId}`);
        return (response.data || []).map(mapOrder);
    },

    async trackOrder(orderId: string) {
        const response = await client.get(`/orders/track/${orderId}`);
        return mapOrder(response.data);
    },

    async uploadMockup(id: number, file: File) {
        const formData = new FormData();
        formData.append("mockup", file);
        const response = await client.post(`/orders/${id}/mockup`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return mapOrder(response.data);
    },

    async approveDesign(id: number) {
        const response = await client.patch(`/orders/${id}/approve-design`);
        return mapOrder(response.data);
    },

    async revisiDesign(id: number, feedback: string) {
        const response = await client.patch(`/orders/${id}/revisi-design`, { feedback });
        return mapOrder(response.data);
    },

    async cancelMockup(id: number) {
        const response = await client.patch(`/orders/${id}/cancel-mockup`);
        return mapOrder(response.data);
    }
};
