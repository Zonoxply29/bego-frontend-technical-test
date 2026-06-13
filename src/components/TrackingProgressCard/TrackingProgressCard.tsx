import type { CargoOrderDetailsData } from "../../types/order-details.types";
import checkIcon from "../../assets/icons/check-icon.svg";
import styles from "./TrackingProgressCard.module.scss";

interface TrackingProgressCardProps {
    order: CargoOrderDetailsData;
}

function getDriverInitials(name: string) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function TrackingProgressCard({ order }: TrackingProgressCardProps) {
    const handleTrackOrder = () => {
        if (!order.canTrackOrder) {
            return;
        }

        console.log("Track Order");
    };

    return (
        <article className={styles.card}>
            <div className={styles.avatarWrapper}>
                {order.driverAvatar ? (
                    <img
                        className={styles.avatar}
                        src={order.driverAvatar}
                        alt={order.driverName}
                    />
                ) : (
                    <div className={styles.avatarFallback}>
                        {getDriverInitials(order.driverName)}
                    </div>
                )}
            </div>

            <strong className={styles.mainTime}>{order.mainTime}</strong>

            <div className={styles.timeline}>
                {order.timeline.map((step, index) => (
                    <div
                        key={step.id}
                        className={`${styles.timelineStep} ${step.completed ? styles.timelineStepCompleted : ""
                            }`}
                    >
                        <div className={styles.stepMarker}>
                            {step.completed && (
                                <img
                                    className={styles.checkIcon}
                                    src={checkIcon}
                                    alt=""
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        {index < order.timeline.length - 1 && (
                            <span
                                className={`${styles.stepLine} ${step.completed ? styles.stepLineCompleted : ""
                                    }`}
                                aria-hidden="true"
                            />
                        )}

                        <span className={styles.stepLabel}>{step.label}</span>
                    </div>
                ))}
            </div>

            <button
                className={`${styles.trackButton} ${order.canTrackOrder ? styles.trackButtonActive : ""
                    }`}
                type="button"
                disabled={!order.canTrackOrder}
                onClick={handleTrackOrder}
            >
                Track Order
            </button>
        </article>
    );
}