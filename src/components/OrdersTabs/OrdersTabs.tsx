import styles from "./OrdersTabs.module.scss";

type OrderTab = "Upcoming" | "Completed" | "Past";

interface OrdersTabsProps {
  activeTab: OrderTab;
}

const tabs: OrderTab[] = ["Upcoming", "Completed", "Past"];

export function OrdersTabs({ activeTab }: OrdersTabsProps) {
  return (
    <nav className={styles.tabs} aria-label="Order status tabs">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            type="button"
            aria-current={isActive ? "page" : undefined}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}