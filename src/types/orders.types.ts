export interface OrderDestination {
  lat?: number;
  lng?: number;
  address: string;

  start_date?: number;
  end_date?: number;
  startDate?: number;
  endDate?: number;

  zip_code?: number | string;
  place_id_pickup?: string;
  place_id_dropoff?: string;

  contact_info?: OrderDestinationContactInfo;

  nickname?: string;
  show_navigation?: boolean;
  status?: number;
  status_string?: string;
  status_class?: string;
}

export interface OrderUser {
  _id: string;
  nickname?: string;
  email?: string;
  telephone?: string;
  thumbnail?: string;
}

export interface OrderPricing {
  subtotal?: number;
  taxes?: number;
  total?: number;
  insurance?: number;
  customs?: number;
  cruce?: number;
  extras?: number;
}

export interface OrderRoute {
  route?: string;
  pickup?: string;
  dropoff?: string;
  start_date?: number;
  end_date?: number;
  single?: number;
  status?: number;
  stay?: string;
}
export interface Order {
  _id: string;
  status: number;
  order_number: string;

  reference_number?: string;
  type?: string;
  version?: string;

  manager?: string | OrderUser;
  driver?: string | OrderUser;

  destinations?: OrderDestination[];

  start_date?: number;
  end_date?: number;
  created?: number;

  is_today?: boolean;
  status_string?: string;
  status_class?: string;
  driver_thumbnail?: string | null;

  route?: OrderRoute;
  pricing?: OrderPricing;

  completion_percentage?: number;
  distance_mts?: number;
}
export interface OrderDestinationContactInfo {
  name?: string;
  telephone?: string;
  email?: string;
  country_code?: string;
  rfc?: string;
}

export type CargoOrder = Order;
