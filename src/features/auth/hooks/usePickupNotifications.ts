import { useState, useCallback } from "react";
import { usePickupSocket } from "./usePickupSocket";

interface PickupNotification {
  notificationId: string;
  pickupId: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export const usePickupNotifications = () => {
  const [notifications, setNotifications] = useState<PickupNotification[]>([]);

  const handleNewNotification = useCallback((notif: PickupNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  usePickupSocket(handleNewNotification);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    clearNotifications,
  };
};
