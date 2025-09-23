import instance from "./axiosInstance";

// Fetch all pickups 
export const fetchAllPickups = async (tenandId: string) => {
  const response = await instance.get(`/tenants/${tenandId}/pickups`);
  return response.data;
};

//  Get orders for a pickup
export const fetchPickupOrders = async (pickupId: string) => {
  return await instance.get(`/pickups/${pickupId}/orders`);
};

// Approve a pickup request
export const approvePickupRequest = async (pickupId: string) => {
  return await instance.patch(`/pickups/${pickupId}/respond`, {
    pickupStatus: "APPROVED",
    orderStatus: "ASSIGNED_FOR_PICKUP", 
  });
};

// Reject a pickup request
export const rejectPickupRequest = async (pickupId: string) => {
  return await instance.patch(`/pickups/${pickupId}/respond`, {
    pickupStatus: "CANCELLED",
    orderStatus: "CANCELLED",
  });
};

