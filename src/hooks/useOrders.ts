import { useCallback, useEffect, useState } from "react";
import { getAllOrders, getUpcomingOrders } from "../services/ordersService";
import type { Order } from "../types/orders.types";

type OrdersType = "upcoming" | "all";

export function useOrders(type: OrdersType = "upcoming") {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data =
        type === "upcoming" ? await getUpcomingOrders() : await getAllOrders();

      setOrders(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar pedidos";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}