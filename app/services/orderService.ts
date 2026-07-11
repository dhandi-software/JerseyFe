import { client } from "~/api/client";

const mapOrder = (o: any) => {
    if (!o) return o;
    return {
        ...o,
        designStatus: o.designStatus === "PENDING" || !o.designStatus ? (o.mockupUrl ? "SENT" : "PENDING") : o.designStatus,
        layoutStatus: o.layoutStatus === "PENDING" || !o.layoutStatus ? (o.layoutUrl ? "SENT" : "PENDING") : o.layoutStatus
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

    async updatePaymentUrl(id: number, paymentUrl: string) {
        const response = await client.patch(`/orders/${id}/payment`, { paymentUrl });
        return response.data;
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
    },

    async recommendAlternatives(id: number, recommendedBahanIds: number[]) {
        const response = await client.patch(`/orders/${id}/recommend-alternatives`, { recommendedBahanIds });
        return mapOrder(response.data);
    },

    async selectAlternative(id: number, selectedBahanId: number) {
        const response = await client.patch(`/orders/${id}/select-alternative`, { selectedBahanId });
        return mapOrder(response.data);
    },

    async uploadLayout(id: number, file: File) {
        const formData = new FormData();
        formData.append("layout", file);
        const response = await client.post(`/orders/${id}/layout`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return mapOrder(response.data);
    },

    async approveLayout(id: number) {
        const response = await client.patch(`/orders/${id}/approve-layout`);
        return mapOrder(response.data);
    },

    async revisiLayout(id: number, feedback: string) {
        const response = await client.patch(`/orders/${id}/revisi-layout`, { feedback });
        return mapOrder(response.data);
    },

    async cancelLayout(id: number) {
        const response = await client.patch(`/orders/${id}/cancel-layout`);
        return mapOrder(response.data);
    },

    async reportDamage(orderId: number, data: { productId: number, pcs: number, keterangan?: string, actor?: string }) {
        const response = await client.post(`/orders/${orderId}/damage`, data);
        return mapOrder(response.data);
    },

    async getDamageHistory(orderId: number) {
        const response = await client.get(`/orders/${orderId}/damage-history`);
        return response.data;
    },

    async updateDamageReport(historyId: number, data: { pcs: number, keterangan?: string, actor?: string }) {
        const response = await client.put(`/orders/damage/${historyId}`, data);
        return response.data;
    }
};
