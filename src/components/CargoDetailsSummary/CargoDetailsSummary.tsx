import type {
  CargoOrderDetailsData,
  OrderDetailsDestination,
} from "../../types/order-details.types";

import pickupTruckIcon from "../../assets/icons/pickup-truck.svg";

import styles from "./CargoDetailsSummary.module.scss";

interface CargoDetailsSummaryProps {
  order: CargoOrderDetailsData;
  selectedDestinationIndex: number;
  onSelectDestination: (index: number) => void;
}

interface DestinationItemProps {
  destination: OrderDetailsDestination;
  index: number;
  isSelected: boolean;
  onSelectDestination: (index: number) => void;
}

function DestinationItem({
  destination,
  index,
  isSelected,
  onSelectDestination,
}: DestinationItemProps) {
  const isPickup = destination.type === "pickup";

  const statusDotClass =
    destination.statusDotVariant === "blue"
      ? styles.statusDotBlue
      : styles.statusDotGray;

  return (
    <button
      className={`${styles.destinationItem} ${
        isPickup ? styles.destinationItemPickup : styles.destinationItemDropoff
      } ${isSelected ? styles.destinationItemSelected : ""}`}
      type="button"
      onClick={() => onSelectDestination(index)}
    >
      <div
        className={`${styles.iconWrapper} ${
          isPickup ? styles.iconWrapperPickup : styles.iconWrapperDropoff
        }`}
      >
        {isPickup && (
          <img
            className={`${styles.destinationIcon} ${styles.pickupIcon}`}
            src={pickupTruckIcon}
            alt=""
            aria-hidden="true"
          />
        )}
      </div>

      <div className={styles.destinationInfo}>
        <span className={styles.destinationLabel}>
          {isPickup ? "PICKUP" : "DROPOFF"}
        </span>

        <strong className={styles.destinationCity}>
          {destination.city}
        </strong>

        <span className={styles.destinationAddress}>
          {destination.address}
        </span>

        <span className={styles.statusPill}>
          <span className={`${styles.statusDot} ${statusDotClass}`} />
          {destination.statusLabel}
        </span>
      </div>
    </button>
  );
}

export function CargoDetailsSummary({
  order,
  selectedDestinationIndex,
  onSelectDestination,
}: CargoDetailsSummaryProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.reference}>
          Referencia {order.referenceNumber}
        </span>

        <h1 className={styles.title}>Order #{order.orderNumber}</h1>
      </header>

      <div className={styles.route}>
        <span className={styles.routeLine} aria-hidden="true" />

        {order.destinations.map((destination, index) => (
          <DestinationItem
            key={destination.type}
            destination={destination}
            index={index}
            isSelected={selectedDestinationIndex === index}
            onSelectDestination={onSelectDestination}
          />
        ))}
      </div>
    </article>
  );
}