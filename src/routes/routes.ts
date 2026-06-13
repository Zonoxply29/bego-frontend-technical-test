export const routes = {
  cargoOrders: "/",
  orderDetails: (orderNumber: string) =>
    `/orders/${encodeURIComponent(orderNumber)}`,
} as const;