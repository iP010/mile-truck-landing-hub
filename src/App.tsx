
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import HomePage from './pages/HomePage';
import DriverRegistration from './pages/DriverRegistration';
import CompanyRegistration from './pages/CompanyRegistration';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/drivers" element={<DriverRegistration />} />
            <Route path="/companies" element={<CompanyRegistration />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
