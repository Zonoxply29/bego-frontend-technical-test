import { apiClient } from "../api/apiClient";
import { endpoints } from "../api/endpoints";
import type { Order } from "../types/orders.types";

export async function getUpcomingOrders(): Promise<Order[]> {
  return apiClient<Order[]>(endpoints.orders.upcoming);
}

export async function getAllOrders(): Promise<Order[]> {
  const result = await apiClient<Order | Order[]>(endpoints.orders.all);

  return Array.isArray(result) ? result : [result];
}