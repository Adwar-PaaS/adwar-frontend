import { useState, useCallback } from "react";
import { usePickupSocket } from "./usePickupSocket";

export const usePickupNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleNewPickup = useCallback((pickup: any) => {
    setNotifications((prev) => [pickup, ...prev]);
  }, []);

  usePickupSocket(handleNewPickup);

  const clearNotifications = () => setNotifications([]);

  return { notifications, clearNotifications };
};
