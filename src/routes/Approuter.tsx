import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CargoOrdersPage } from "../pages/CargoOrdersPage/CargoOrdersPage";
import { CargoOrderDetailsPage } from "../pages/CargoOrderDetailsPage/CargoOrderDetailsPage";
import { routes } from "./routes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.cargoOrders} element={<CargoOrdersPage />} />
        <Route path="/orders/:orderNumber" element={<CargoOrderDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}