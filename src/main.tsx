import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from './app/store';
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./styles/global.css";
import "antd/dist/reset.css";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  </BrowserRouter>
);
