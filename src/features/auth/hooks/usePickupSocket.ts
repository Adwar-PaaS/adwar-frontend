import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import instance from "../api/axiosInstance";

export const usePickupSocket = (
  onNewPickup: (pickup: any) => void,
  options?: { namespace?: string; eventName?: string }
) => {
  useEffect(() => {
    const baseURL = import.meta.env.DEV ? "" : instance.defaults.baseURL || "";
    const namespace = options?.namespace || "";
    const eventName = options?.eventName || "notification";

    const socket: Socket = io(`${baseURL}${namespace}`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    socket.on(eventName, (data) => {
      console.log("New pickup notification:", data);
      onNewPickup(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewPickup, options?.eventName, options?.namespace]);
};
