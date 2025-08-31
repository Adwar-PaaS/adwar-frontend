import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../features/auth/api/tenantApi";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};
