import { useEffect, useMemo, useState } from "react";

const ONE_SECOND = 1000;

/**
 * Convierte milisegundos restantes a formato HH:MM:SS.
 */
function formatRemainingTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / ONE_SECOND));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

/**
 * Hook encargado de comparar el startDate de una orden
 * contra la hora actual para saber si ya se puede navegar.
 */
export function useNavigationCountdown(startDate?: number) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    /**
     * Actualizamos la hora actual cada segundo para refrescar
     * el contador en pantalla.
     */
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, ONE_SECOND);

    /**
     * Limpiamos el intervalo cuando el componente se desmonta
     * para evitar fugas de memoria.
     */
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const remainingTime = useMemo(() => {
    if (!startDate) {
      return 0;
    }

    return startDate - currentTime;
  }, [startDate, currentTime]);

  /**
   * El botón se habilita únicamente cuando ya existe startDate
   * y la hora actual alcanzó o superó ese tiempo.
   */
  const canNavigate = Boolean(startDate) && remainingTime <= 0;

  return {
    canNavigate,
    remainingLabel: formatRemainingTime(remainingTime),
  };
}