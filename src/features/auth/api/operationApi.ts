import instance from "./axiosInstance";

// Fetch all pickups 
export const fetchAllPickups = async () => {
  const response = await instance.get(`/pickups/get-all-requests`);
  return response.data;
};

//  Get orders for a pickup
export const fetchPickupOrders = async (pickupId: string) => {
  return await instance.get(`/pickups/${pickupId}/pickup-orders`);
};
