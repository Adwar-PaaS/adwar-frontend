import axios from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (data: LoginPayload) => {
  const response = await axios.post(
    "https://adwar-backend-project.onrender.com/auth/login",
    data
  );
  return response.data;
};
