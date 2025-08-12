import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./components/auth/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./styles/global.css";
import "antd/dist/reset.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Provider>
  </BrowserRouter>
);
