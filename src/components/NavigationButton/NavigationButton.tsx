import { useNavigationCountdown } from "../../hooks/useNavigationCountdown";
import styles from "./NavigationButton.module.scss";

interface NavigationButtonProps {
  startDate?: number;
}

export function NavigationButton({ startDate }: NavigationButtonProps) {
  const { canNavigate, remainingLabel } = useNavigationCountdown(startDate);

  const handleNavigate = () => {
    if (!canNavigate) {
      return;
    }

    console.log("Navegar");
  };

  if (!startDate) {
    return null;
  }

  return (
    <button
      className={`${styles.button} ${
        canNavigate ? styles.buttonActive : styles.buttonWaiting
      }`}
      type="button"
      disabled={!canNavigate}
      onClick={handleNavigate}
    >
      {canNavigate ? (
        <span>Its time for pickup</span>
      ) : (
        <>
          <span>Start pickup in</span>
          <strong>{remainingLabel}</strong>
        </>
      )}
    </button>
  );
}