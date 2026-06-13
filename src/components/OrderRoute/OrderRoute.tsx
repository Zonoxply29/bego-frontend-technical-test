import styles from './OrderRoute.module.scss';

type OrderRouteProps = {
  origin: string;
  destination: string;
  route: string;
};

function OrderRoute({ origin, destination, route }: OrderRouteProps) {
  return (
    <div className={styles.route} aria-label={`Route from ${origin} to ${destination}`}>
      <span className={styles.location}>{origin}</span>
      <span className={styles.line} aria-hidden="true" />
      <span className={styles.location}>{destination}</span>
      <p className={styles.description}>{route}</p>
    </div>
  );
}

export default OrderRoute;
