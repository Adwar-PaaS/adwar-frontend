import instance from "./axiosInstance";

// Fetch all pickups 
export const fetchAllPickups = async (tenandId: string) => {
  const response = await instance.get(`/tenants/${tenandId}/pickups`);
  return response.data;
};

//  Get orders for a pickup
export const fetchPickupOrders = async (pickupId: string) => {
  return await instance.get(`/pickups/${pickupId}/pickup-orders`);
};

// Approve a pickup request
export const approvePickupRequest = async (requestId: string) => {
  return await instance.post(`/pickups/requests/${requestId}/respond`, {
    status: "APPROVED",
  });
};

// Reject a pickup request
export const rejectPickupRequest = async (requestId: string) => {
  return await instance.post(`/pickups/requests/${requestId}/respond`, {
    status: "REJECTED",
  });
};
