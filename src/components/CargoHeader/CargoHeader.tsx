import arrowLeftIcon from "../../assets/icons/arrow-left.svg";
import bellIcon from "../../assets/icons/bell.svg";
import styles from "./CargoHeader.module.scss";

interface CargoHeaderProps {
  title: string;
  onBack?: () => void;
}

export function CargoHeader({ title , onBack}: CargoHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.iconButton}
        type="button"
        onClick={onBack}
        aria-label="Go back"
      >
        <img src={arrowLeftIcon} alt="" aria-hidden="true" />
      </button>

      <h1 className={styles.title}>{title}</h1>

      <button
        className={styles.iconButton}
        type="button"
        aria-label="Notifications"
      >
        <img src={bellIcon} alt="" aria-hidden="true" />
      </button>
    </header>
  );
}