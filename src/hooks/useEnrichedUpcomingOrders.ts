import { useMemo } from "react";
import type { Order } from "../types/orders.types";
import { useOrders } from "./useOrders";

function normalizeOrderNumber(value?: string): string {
  return value?.replace("#", "").trim().toLowerCase() ?? "";
}

function findDetailedOrder(upcomingOrder: Order, detailedOrders: Order[]) {
  return detailedOrders.find((detailOrder) => {
    const sameId = detailOrder._id === upcomingOrder._id;

    const sameOrderNumber =
      normalizeOrderNumber(detailOrder.order_number) ===
      normalizeOrderNumber(upcomingOrder.order_number);

    return sameId || sameOrderNumber;
  });
}

function enrichOrder(upcomingOrder: Order, detailedOrders: Order[]): Order {
  const detailedOrder = findDetailedOrder(upcomingOrder, detailedOrders);

  if (!detailedOrder) {
    return upcomingOrder;
  }

  return {
    ...upcomingOrder,

    // Solo tomamos del detalle lo que no viene en upcoming.
    route: upcomingOrder.route ?? detailedOrder.route,
    reference_number:
      upcomingOrder.reference_number ?? detailedOrder.reference_number,

  };
}

export function useEnrichedUpcomingOrders() {
  const upcomingRequest = useOrders("upcoming");
  const allRequest = useOrders("all");

  const orders = useMemo(() => {
    return upcomingRequest.orders.map((upcomingOrder) =>
      enrichOrder(upcomingOrder, allRequest.orders)
    );
  }, [upcomingRequest.orders, allRequest.orders]);

  return {
    orders,
    isLoading: upcomingRequest.isLoading,
    error: upcomingRequest.error,
    refetch: () => {
      upcomingRequest.refetch();
      allRequest.refetch();
    },
  };
}