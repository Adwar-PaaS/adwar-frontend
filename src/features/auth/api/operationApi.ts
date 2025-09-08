import instance from "./axiosInstance";

export const fetchAllPickups = async () => {
  const response = await instance.get(`/pickups/get-all-requests`);
  return response.data;
};
