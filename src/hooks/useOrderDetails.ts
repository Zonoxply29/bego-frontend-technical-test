import { useMemo } from "react";
import { adaptOrderToDetails } from "../adapters/order-details.adapter";
import type { Order } from "../types/orders.types";
import { useOrders } from "./useOrders";

function normalizeOrderNumber(value?: string): string {
  return decodeURIComponent(value ?? "")
    .replace("#", "")
    .trim()
    .toLowerCase();
}

function findOrderByNumber(orders: Order[], orderNumber?: string) {
  const normalizedOrderNumber = normalizeOrderNumber(orderNumber);

  if (!normalizedOrderNumber) {
    return undefined;
  }

  return orders.find((order) => {
    return normalizeOrderNumber(order.order_number) === normalizedOrderNumber;
  });
}

export function useOrderDetails(orderNumber?: string, initialOrder?: Order) {
  const allOrdersRequest = useOrders("all");
  const upcomingOrdersRequest = useOrders("upcoming");

  const orderDetails = useMemo(() => {
    const orderFromAll = findOrderByNumber(
      allOrdersRequest.orders,
      orderNumber
    );

    const orderFromUpcoming = findOrderByNumber(
      upcomingOrdersRequest.orders,
      orderNumber
    );

    const selectedOrder = orderFromAll ?? initialOrder ?? orderFromUpcoming;

    if (!selectedOrder) {
      return null;
    }

    return adaptOrderToDetails(selectedOrder);
  }, [
    allOrdersRequest.orders,
    upcomingOrdersRequest.orders,
    initialOrder,
    orderNumber,
  ]);

  const isLoading =
    !orderDetails &&
    (allOrdersRequest.isLoading || upcomingOrdersRequest.isLoading);

  const error = allOrdersRequest.error ?? upcomingOrdersRequest.error;

  const refetch = () => {
    allOrdersRequest.refetch();
    upcomingOrdersRequest.refetch();
  };

  return {
    orderDetails,
    isLoading,
    error,
    refetch,
  };
}