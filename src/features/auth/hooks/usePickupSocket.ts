import { useEffect } from "react";

export const usePickupSocket = (onNewPickup: (pickup: any) => void) => {
  useEffect(() => {
    // Connect to backend WebSocket
    const socket = new WebSocket("ws://localhost:5173");

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Subscribe to pickup events (depends on your backend protocol)
      socket.send(JSON.stringify({ type: "subscribe", channel: "pickups" }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // backend sends { type: "pickup:new", payload: {...} }
        if (data.type === "pickup:new") {
          onNewPickup(data.payload);
        }
      } catch (err) {
        console.error(" Error parsing WS message:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [onNewPickup]);
};
