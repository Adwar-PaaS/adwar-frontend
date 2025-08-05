import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  passwordHash: Yup.string()
    .min(4, "Too short")
    .required("Password is required"),
});
