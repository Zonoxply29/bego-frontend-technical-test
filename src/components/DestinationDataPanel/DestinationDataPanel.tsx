import { useState } from "react";
import type { OrderDetailsDestination } from "../../types/order-details.types";
import detailsIcon from "../../assets/icons/details-icon.svg";
import styles from "./DestinationDataPanel.module.scss";

interface DestinationDataPanelProps {
  destination: OrderDetailsDestination;
}

export function DestinationDataPanel({ destination }: DestinationDataPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className={styles.wrapper}>
      <button
        className={styles.header}
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
      >
        <span>{destination.title}</span>

        <img
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          src={detailsIcon}
          alt=""
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className={styles.content}>
          <p className={styles.address}>{destination.address}</p>

          <p className={styles.date}>
            <span>{destination.date}</span>
            <span className={styles.separator}>•</span>
            <span>{destination.time}</span>
          </p>

          <p>{destination.phone}</p>

          <p>{destination.email}</p>
        </div>
      )}
    </section>
  );
}