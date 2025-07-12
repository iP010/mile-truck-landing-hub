
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AdminProvider } from "./contexts/AdminContext";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DriverRegistration from "./pages/DriverRegistration";
import CompanyRegistration from "./pages/CompanyRegistration";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminProfile from "./pages/AdminProfile";
import Admin from "./pages/Admin";
import PricingManagement from "./pages/PricingManagement";
import CompanyPricing from "./pages/CompanyPricing";
import CitiesVehiclesManagement from "./pages/CitiesVehiclesManagement";
import TripPricing from "./pages/TripPricing";
import PricingReports from "./pages/PricingReports";
import PriceCalculator from "./pages/PriceCalculator";
import PricingSettings from "./pages/PricingSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/driver-registration" element={<DriverRegistration />} />
                <Route path="/company-registration" element={<CompanyRegistration />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-profile" element={<AdminProfile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/pricing-management" element={<PricingManagement />} />
                <Route path="/pricing/:membershipNumber" element={<CompanyPricing />} />
                <Route path="/pricing/:membershipNumber/edit" element={<CompanyPricing />} />
                <Route path="/cities-vehicles-management" element={<CitiesVehiclesManagement />} />
                <Route path="/trip-pricing" element={<TripPricing />} />
                <Route path="/pricing-reports" element={<PricingReports />} />
                <Route path="/price-calculator" element={<PriceCalculator />} />
                <Route path="/pricing-settings" element={<PricingSettings />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
