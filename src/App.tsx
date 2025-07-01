
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SignUpSuccess from "./pages/SignUpSuccess";
import Dashboard from "./pages/Dashboard";
import MakeReport from "./pages/MakeReport";
import Pricing from "./pages/Pricing";
import TermsOfUse from "./pages/TermsOfUse";
import AdditionalTermsOfUse from "./pages/AdditionalTermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import { KycProvider } from './contexts/KycContext';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <KycProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/signup-success" element={<SignUpSuccess />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/make-report" element={<MakeReport />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about-us/terms-of-use" element={<TermsOfUse />} />
              <Route path="/about-us/terms-of-use/additional-terms-of-use" element={<AdditionalTermsOfUse />} />
              <Route path="/about-us/privacy-policy" element={<PrivacyPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </KycProvider>
  </AuthProvider>
);

export default App;
