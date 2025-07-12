
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { PricingSidebar } from './components/PricingSidebar';
import HomePage from './pages/HomePage';
import DriverRegistration from './pages/DriverRegistration';
import CompanyRegistration from './pages/CompanyRegistration';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './pages/AdminProfile';
import Dashboard from './pages/Dashboard';
import PricingManagement from './pages/PricingManagement';
import CompanyPricing from './pages/CompanyPricing';

function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/drivers" element={<DriverRegistration />} />
              <Route path="/companies" element={<CompanyRegistration />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-profile" element={<AdminProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing-management" element={
                <div>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                      <PricingSidebar />
                      <SidebarInset className="flex-1">
                        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                          <SidebarTrigger />
                        </header>
                        <PricingManagement />
                      </SidebarInset>
                    </div>
                  </SidebarProvider>
                </div>
              } />
              <Route path="/pricing/:membershipNumber" element={<CompanyPricing />} />
              <Route path="/pricing/:membershipNumber/edit" element={<CompanyPricing />} />
            </Routes>
            <Toaster position="top-center" richColors />
          </div>
        </Router>
      </AdminProvider>
    </LanguageProvider>
  );
}

export default App;
