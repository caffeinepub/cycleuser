import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import LandingPage from "./pages/LandingPage";

export type Page = "landing" | "driver-dashboard" | "admin-dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {page === "landing" && <LandingPage navigate={navigate} />}
      {page === "driver-dashboard" && <DriverDashboard navigate={navigate} />}
      {page === "admin-dashboard" && <AdminDashboard navigate={navigate} />}
      <Toaster richColors position="top-right" />
    </>
  );
}
