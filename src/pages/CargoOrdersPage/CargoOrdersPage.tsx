import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { adaptOrderToCard } from "../../adapters/order-card.adapter";
import { CargoHeader } from "../../components/CargoHeader/CargoHeader";
import { OrderCard } from "../../components/OrderCard/OrderCard";
import { OrdersTabs } from "../../components/OrdersTabs/OrdersTabs";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useEnrichedUpcomingOrders } from "../../hooks/useEnrichedUpcomingOrders";
import { routes } from "../../routes/routes";
import type { CargoOrderCardData } from "../../types/order-card.types";

import styles from "./CargoOrdersPage.module.scss";

function normalizeOrderNumber(value: string) {
  return value.replace("#", "").replace(/\s/g, "").trim().toLowerCase();
}

export function CargoOrdersPage() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { orders, isLoading, error, refetch } = useEnrichedUpcomingOrders();
  console.log("Orders first view:", orders);

  const cardOrders = useMemo(() => {
    return orders.map(adaptOrderToCard);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = normalizeOrderNumber(searchValue);

    if (!normalizedSearch) {
      return cardOrders;
    }

    return cardOrders.filter((order) => {
      const normalizedOrderId = normalizeOrderNumber(order.id);

      return normalizedOrderId.includes(normalizedSearch);
    });
  }, [cardOrders, searchValue]);

  const handleResumeOrder = (order: CargoOrderCardData) => {
    const selectedApiOrder = orders.find((apiOrder) => {
      return (
        apiOrder._id === order.apiId ||
        normalizeOrderNumber(apiOrder.order_number) === normalizeOrderNumber(order.id)
      );
    });

    navigate(routes.orderDetails(order.id), {
      state: {
        order: selectedApiOrder,
      },
    });
  };

  return (
    <main className={styles.page}>
      <CargoHeader title="Cargo Orders" />

      <section className={styles.content} aria-label="Cargo orders">
        <OrdersTabs activeTab="Upcoming" />

        <SearchBar value={searchValue} onChange={setSearchValue} />

        {isLoading && (
          <p className={styles.emptyMessage}>Cargando pedidos...</p>
        )}

        {error && !isLoading && (
          <div className={styles.emptyMessage}>
            <p>{error}</p>

            <button type="button" onClick={refetch}>
              Intentar de nuevo
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className={styles.ordersList}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <section
                  key={order.apiId ?? order.id}
                  className={styles.orderBlock}
                >
                  <h2 className={styles.orderTitle}>
                    <span>Order</span> #{order.id}
                  </h2>

                  <OrderCard order={order} onResume={handleResumeOrder} />
                </section>
              ))
            ) : (
              <p className={styles.emptyMessage}>
                No se encontraron órdenes.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}