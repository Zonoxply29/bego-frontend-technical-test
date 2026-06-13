import type { Order, OrderDestination, OrderUser } from "../types/orders.types";
import type {
  CargoOrderDetailsData,
  DetailsStatusDotVariant,
  DestinationType,
  OrderDetailsDestination,
  OrderDetailsTimelineStep,
} from "../types/order-details.types";

function normalizeTimestamp(timestamp?: number): number | undefined {
  if (!timestamp) {
    return undefined;
  }

  return timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp;
}

function formatDate(timestamp?: number): string {
  const normalizedTimestamp = normalizeTimestamp(timestamp);

  if (!normalizedTimestamp) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
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
    hour12: true,
  }).format(new Date(normalizedTimestamp));
}

function getSafeString(
  source: unknown,
  keys: string[],
  fallback = ""
): string {
  if (!source || typeof source !== "object") {
    return fallback;
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function getDestinationTimestamp(destination?: OrderDestination): number | undefined {
  return normalizeTimestamp(
    destination?.start_date ??
    destination?.startDate ??
    destination?.end_date ??
    destination?.endDate
  );
}

function getDestinationCity(destination?: OrderDestination): string {
  return getSafeString(
    destination,
    ["city", "nickname", "name"],
    "New York"
  );
}

function getDestinationPhone(destination?: OrderDestination): string {
  const contactPhone = destination?.contact_info?.telephone?.trim();

  if (contactPhone) {
    return contactPhone;
  }

  return getSafeString(
    destination,
    ["phone", "telephone", "contact_phone", "contactPhone"],
    "Sin teléfono"
  );
}

function getDestinationEmail(destination?: OrderDestination): string {
  const contactEmail = destination?.contact_info?.email?.trim();

  if (contactEmail) {
    return contactEmail;
  }

  return getSafeString(
    destination,
    ["email", "contact_email", "contactEmail"],
    "Sin correo"
  );
}

function getDestinationStatusLabel(
  destination: OrderDestination | undefined,
  type: DestinationType,
  order: Order
): string {
  const statusString = getSafeString(
    destination,
    ["status_string", "statusString"],
    ""
  );

  if (statusString) {
    const normalized = statusString
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("accepted") || normalized.includes("acept")) {
      return "Accepted";
    }

    if (normalized.includes("hold") || normalized.includes("espera")) {
      return "On hold";
    }

    return statusString;
  }

  const orderStatusClass = order.status_class?.toLowerCase() ?? "";

  if (
    type === "pickup" &&
    (order.status >= 2 || orderStatusClass.includes("blue-dot-bg"))
  ) {
    return "Accepted";
  }

  return "On hold";
}

function getDestinationDotVariant(
  destination: OrderDestination | undefined,
  type: DestinationType,
  order: Order
): DetailsStatusDotVariant {
  const destinationStatusClass = getSafeString(
    destination,
    ["status_class", "statusClass"],
    ""
  ).toLowerCase();

  if (destinationStatusClass.includes("blue")) {
    return "blue";
  }

  const orderStatusClass = order.status_class?.toLowerCase() ?? "";

  if (
    type === "pickup" &&
    (order.status >= 2 || orderStatusClass.includes("blue-dot-bg"))
  ) {
    return "blue";
  }

  return "gray";
}

function buildDestination(
  destination: OrderDestination | undefined,
  type: DestinationType,
  order: Order,
  routeLabel?: string,
  routeTimestamp?: number
): OrderDetailsDestination {
  const timestamp =
    getDestinationTimestamp(destination) ?? normalizeTimestamp(routeTimestamp);

  return {
    type,
    title: type === "pickup" ? "Pickup Data" : "Dropoff Data",
    city: routeLabel || getDestinationCity(destination),
    address: destination?.address ?? "Sin dirección disponible",
    date: formatDate(timestamp),
    time: formatTime(timestamp),
    phone: getDestinationPhone(destination),
    email: getDestinationEmail(destination),
    statusLabel: getDestinationStatusLabel(destination, type, order),
    statusDotVariant: getDestinationDotVariant(destination, type, order),
  };
}

function getDriverName(driver?: string | OrderUser): string {
  if (!driver) {
    return "Driver";
  }

  if (typeof driver === "string") {
    return "Driver";
  }

  return driver.nickname ?? driver.email ?? "Driver";
}

function getDriverAvatar(order: Order): string | null {
  if (order.driver_thumbnail) {
    return order.driver_thumbnail;
  }

  if (order.driver && typeof order.driver === "object") {
    return order.driver.thumbnail ?? null;
  }

  return null;
}

function buildTimeline(statusNumber: number): OrderDetailsTimelineStep[] {
  const steps = [
    {
      id: "created",
      label: "Created Order",
      minStatus: 1,
    },
    {
      id: "accepted",
      label: "Accepted Order",
      minStatus: 2,
    },
    {
      id: "pickup-setup",
      label: "Pickup set up by William",
      minStatus: 3,
    },
    {
      id: "pickup-completed",
      label: "Pickup Completed",
      minStatus: 4,
    },
  ];

  return steps.map((step) => ({
    ...step,
    completed: statusNumber >= step.minStatus,
  }));
}
function getOrderReferenceNumber(order: Order): string {
  return getSafeString(
    order,
    ["reference_number", "referenceNumber", "reference"],
    "Sin referencia"
  );
}
export function adaptOrderToDetails(order: Order): CargoOrderDetailsData {
  const pickup = order.destinations?.[0];
  const dropoff = order.destinations?.[1];

  const mainTimestamp = normalizeTimestamp(
    order.route?.start_date ??
    order.start_date ??
    pickup?.start_date ??
    pickup?.startDate
  );

  return {
    id: order._id,
    apiId: order._id,
    orderNumber: order.order_number,
    referenceNumber: getOrderReferenceNumber(order),
    statusNumber: order.status,
    driverName: getDriverName(order.driver),
    driverAvatar: getDriverAvatar(order),
    mainTime: formatTime(mainTimestamp),
    destinations: [
      buildDestination(
        pickup,
        "pickup",
        order,
        order.route?.pickup,
        order.route?.start_date
      ),
      buildDestination(
        dropoff,
        "dropoff",
        order,
        order.route?.dropoff,
        order.route?.end_date
      ),
    ],
    timeline: buildTimeline(order.status),
    canTrackOrder: order.status >= 3,
  };
}