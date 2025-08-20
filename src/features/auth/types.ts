export interface LoginFormValues {
  email: string;
  passwordHash: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}