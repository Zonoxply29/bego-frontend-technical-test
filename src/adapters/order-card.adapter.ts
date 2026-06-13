import type {
  CargoOrderCardData,
  OrderStatusDotVariant,
  OrderStatusVariant,
} from "../types/order-card.types";
import type { Order, OrderDestination } from "../types/orders.types";

function getStatusDotVariant(order: Order): OrderStatusDotVariant {
  const dotSource = [
    order.status_class,
    order.destinations?.[0]?.status_class,
    order.destinations?.[1]?.status_class,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (dotSource.includes("blue-dot") || dotSource.includes("blue")) {
    return "blue";
  }

  if (
    dotSource.includes("gray-dot") ||
    dotSource.includes("grey-dot") ||
    dotSource.includes("gray") ||
    dotSource.includes("grey")
  ) {
    return "gray";
  }

  return "gray";
}
function normalizeTimestamp(timestamp?: number): number | undefined {
  if (!timestamp) {
    return undefined;
  }

  return timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp;
}

function formatDate(timestamp?: number): string {
  const normalizedTimestamp = normalizeTimestamp(timestamp);

  if (!normalizedTimestamp) {
    return "--/--/--";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(normalizedTimestamp));
}

function formatTime(timestamp?: number): string {
  const normalizedTimestamp = normalizeTimestamp(timestamp);

  if (!normalizedTimestamp) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(normalizedTimestamp));
}

function getDestinationDate(destination?: OrderDestination): number | undefined {
  return normalizeTimestamp(
    destination?.start_date ??
    destination?.startDate ??
    destination?.end_date ??
    destination?.endDate
  );
}

function getStatusVariant(order: Order): OrderStatusVariant {
  const statusText = order.status_string?.toLowerCase() ?? "";
  const statusClass = order.status_class?.toLowerCase() ?? "";

  if (statusText.includes("transit") || statusClass.includes("transit")) {
    return "transit";
  }

  if (statusText.includes("assigned") || statusClass.includes("assigned")) {
    return "assigned";
  }

  if (statusText.includes("complete") || statusClass.includes("complete")) {
    return "completed";
  }

  return "past";
}

function buildLocation(
  destination: OrderDestination | undefined,
  fallbackCity: string,
  fallbackDate?: number,
  routeLabel?: string
) {
  const date = getDestinationDate(destination) ?? fallbackDate;

  return {
    city: routeLabel ?? destination?.nickname ?? fallbackCity,
    address: destination?.address ?? "Sin dirección disponible",
    date: formatDate(date),
    time: formatTime(date),
  };
}
function normalizeText(value?: string): string {
  return value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") ?? "";
}

function getStatusLabel(order: Order): string {
  const statusClass = normalizeText(order.status_class);
  const statusString = normalizeText(order.status_string);

  if (statusClass.includes("blue-dot-bg")) {
    return "In transit";
  }

  if (statusString === "orden asignada") {
    return "Assigned";
  }

  if (statusString === "recoleccion completada") {
    return "Pickup completed";
  }

  return order.status_string ?? "Unknown";
}

export function adaptOrderToCard(order: Order): CargoOrderCardData {
  const pickup = order.destinations?.[0];
  const dropoff = order.destinations?.[1];
  const statusDotVariant = getStatusDotVariant(order);

  const startDate = normalizeTimestamp(
    order.start_date ?? pickup?.start_date ?? pickup?.startDate
  );

  const endDate = normalizeTimestamp(
    order.end_date ?? dropoff?.end_date ?? dropoff?.endDate
  );

  const statusVariant = getStatusVariant(order);

  return {
    id: order.order_number,
    apiId: order._id,
    type: order.type ?? "N/A",
    status: getStatusLabel(order),
    statusVariant,
    statusDotVariant,
    pickup: buildLocation(
      pickup,
      "Pickup",
      startDate,
      order.route?.pickup
    ),
    dropoff: buildLocation(
      dropoff,
      "Dropoff",
      endDate,
      order.route?.dropoff
    ),
    highlight: statusVariant === "transit",
    startDate,
    endDate,
  };
}