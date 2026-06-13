interface LocationState {
  order?: Order;
}
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { CargoDetailsSummary } from "../../components/CargoDetailsSummary/CargoDetailsSummary";
import { CargoHeader } from "../../components/CargoHeader/CargoHeader";
import { DestinationDataPanel } from "../../components/DestinationDataPanel/DestinationDataPanel";
import { TrackingProgressCard } from "../../components/TrackingProgressCard/TrackingProgressCard";
import { useOrderDetails } from "../../hooks/useOrderDetails";
import { routes } from "../../routes/routes";
import type { Order } from "../../types/orders.types";

import styles from "./CargoOrderDetailsPage.module.scss";

interface LocationState {
  order?: Order;
}

export function CargoOrderDetailsPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);

  const { orderDetails, isLoading, error, refetch } = useOrderDetails(
    orderNumber,
    state?.order
  );

  const selectedDestination = useMemo(() => {
    if (!orderDetails) {
      return null;
    }

    return orderDetails.destinations[selectedDestinationIndex];
  }, [orderDetails, selectedDestinationIndex]);

  const handleBackToOrders = () => {
    navigate(routes.cargoOrders);
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <CargoHeader title="Cargo Details" onBack={handleBackToOrders} />

        <section className={styles.content}>
          <p className={styles.message}>Cargando detalle de la orden...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <CargoHeader title="Cargo Details" onBack={handleBackToOrders} />

        <section className={styles.content}>
          <p className={styles.message}>{error}</p>

          <button type="button" onClick={refetch}>
            Intentar de nuevo
          </button>
        </section>
      </main>
    );
  }

  if (!orderDetails || !selectedDestination) {
    return (
      <main className={styles.page}>
        <CargoHeader title="Cargo Details" onBack={handleBackToOrders} />

        <section className={styles.content}>
          <p className={styles.message}>No se encontró la orden.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <CargoHeader title="Cargo Details" onBack={handleBackToOrders} />

      <section className={styles.content}>
        <CargoDetailsSummary
          order={orderDetails}
          selectedDestinationIndex={selectedDestinationIndex}
          onSelectDestination={setSelectedDestinationIndex}
        />

        <TrackingProgressCard order={orderDetails} />

        <DestinationDataPanel destination={selectedDestination} />
      </section>
    </main>
  );
}