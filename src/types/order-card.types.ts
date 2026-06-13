export type OrderStatusVariant = "transit" | "assigned" | "completed" | "past";

export type OrderStatusDotVariant = "blue" | "gray";

export interface OrderLocation {
  city: string;
  address: string;
  date: string;
  time: string;
}

export interface CargoOrderCardData {
  id: string;
  apiId?: string;
  type: string;
  status: string;
  statusVariant: OrderStatusVariant;
  statusDotVariant: OrderStatusDotVariant;
  pickup: OrderLocation;
  dropoff: OrderLocation;
  highlight?: boolean;
  startDate?: number;
  endDate?: number;
}