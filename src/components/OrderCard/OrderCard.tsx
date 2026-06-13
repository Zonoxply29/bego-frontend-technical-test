import type {
  CargoOrderCardData,
  OrderLocation,
} from "../../types/order-card.types";
import { NavigationButton } from "../NavigationButton/NavigationButton";
import fclContainerIcon from "../../assets/icons/fcl-container.svg";
import ftlTruckIcon from "../../assets/icons/ftl-truck.svg";
import pickupTruckIcon from "../../assets/icons/pickup-truck.svg";
import locationPinIcon from "../../assets/icons/location-pin.svg";
import eyeIcon from "../../assets/icons/eye.svg";

import styles from "./OrderCard.module.scss";

interface OrderCardProps {
  order: CargoOrderCardData;
  onResume?: (order: CargoOrderCardData) => void;
}

interface RoutePointProps {
  type: "pickup" | "dropoff";
  location: OrderLocation;
}

function RoutePoint({ type, location }: RoutePointProps) {
  const label = type === "pickup" ? "PICKUP" : "DROPOFF";
  const routeIcon = type === "pickup" ? pickupTruckIcon : locationPinIcon;
  const routeIconClass =
    type === "pickup" ? styles.pickupIcon : styles.dropoffIcon;

  return (
    <div className={styles.routePoint}>
      <div className={styles.routeIconWrapper}>
        <img
          className={`${styles.routeIcon} ${routeIconClass}`}
          src={routeIcon}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className={styles.routeInfo}>
        <span className={styles.routeLabel}>{label}</span>
        <strong className={styles.city}>{location.city}</strong>
        <span className={styles.address}>{location.address}</span>
      </div>

      <time className={styles.dateTime}>
        <span>{location.date}</span>
        <strong>{location.time}</strong>
      </time>
    </div>
  );
}

export function OrderCard({ order, onResume }: OrderCardProps) {
  const isInTransit = order.statusVariant === "transit";
  const isFcl = order.type === "FCL";
  const loadIcon = isFcl ? fclContainerIcon : ftlTruckIcon;
  const showPickupAction = Boolean(order.startDate);
  const statusDotClass =
    order.statusDotVariant === "blue"
      ? styles.statusDotBlue
      : styles.statusDotGray;

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.loadType}>
          <img
            className={`${styles.loadIcon} ${isFcl ? styles.fclIcon : styles.ftlIcon
              }`}
            src={loadIcon}
            alt=""
            aria-hidden="true"
          />

          <span>{order.type}</span>
        </div>

        <div className={styles.status}>
          <span className={`${styles.statusDot} ${statusDotClass}`} />
          <span>{order.status}</span>
        </div>
      </header>

      <div className={styles.cardBody}>
        <div className={styles.route}>
          <span className={styles.routeLine} aria-hidden="true" />

          <RoutePoint type="pickup" location={order.pickup} />
          <RoutePoint type="dropoff" location={order.dropoff} />
        </div>
      </div>

      <footer
        className={`${styles.cardFooter} ${showPickupAction ? styles.cardFooterHighlight : ""
          }`}
      >
        {showPickupAction && <NavigationButton startDate={order.startDate} />}

        <button
          className={styles.resumeButton}
          type="button"
          onClick={() => onResume?.(order)}
        >
          <span>Resume</span>
          <img
            className={styles.eyeIcon}
            src={eyeIcon}
            alt=""
            aria-hidden="true"
          />
        </button>
      </footer>
    </article>
  );
}