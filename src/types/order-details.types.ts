export type DestinationType = "pickup" | "dropoff";

export type DetailsStatusDotVariant = "blue" | "gray";

export interface OrderDetailsDestination {
  type: DestinationType;
  title: string;
  city: string;
  address: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  statusLabel: string;
  statusDotVariant: DetailsStatusDotVariant;
}

export interface OrderDetailsTimelineStep {
  id: string;
  label: string;
  minStatus: number;
  completed: boolean;
}

export interface CargoOrderDetailsData {
  id: string;
  apiId: string;
  orderNumber: string;
  referenceNumber: string;
  statusNumber: number;
  driverName: string;
  driverAvatar?: string | null;
  mainTime: string;
  destinations: OrderDetailsDestination[];
  timeline: OrderDetailsTimelineStep[];
  canTrackOrder: boolean;
}