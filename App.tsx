import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Lazy load pages for better performance  
const LiveActivity = React.lazy(() => import('./pages/LiveActivity'));
const FraudDetection = React.lazy(() => import('./pages/FraudDetection'));
const RiskAnalytics = React.lazy(() => import('./pages/RiskAnalytics'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Merchants = React.lazy(() => import('./pages/Merchants'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Bills = React.lazy(() => import('./pages/Bills'));
const Settlement = React.lazy(() => import('./pages/Settlement'));
const AIInsights = React.lazy(() => import('./pages/AIInsights'));
const SystemHealth = React.lazy(() => import('./pages/SystemHealth'));
const Configuration = React.lazy(() => import('./pages/Configuration'));
import "@/i18n"; // Initialize i18n

const queryClient = new QueryClient();

// Loading component for suspense
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
      <span className="text-muted-foreground">Loading...</span>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } 
            />
            <Route path="/activity" element={<AppLayout><Suspense fallback={<PageLoading />}><LiveActivity /></Suspense></AppLayout>} />
            <Route path="/fraud" element={<AppLayout><Suspense fallback={<PageLoading />}><FraudDetection /></Suspense></AppLayout>} />
            <Route path="/risk" element={<AppLayout><Suspense fallback={<PageLoading />}><RiskAnalytics /></Suspense></AppLayout>} />
            <Route path="/customers" element={<AppLayout><Suspense fallback={<PageLoading />}><Customers /></Suspense></AppLayout>} />
            <Route path="/merchants" element={<AppLayout><Suspense fallback={<PageLoading />}><Merchants /></Suspense></AppLayout>} />
            <Route path="/transactions" element={<AppLayout><Suspense fallback={<PageLoading />}><Transactions /></Suspense></AppLayout>} />
            <Route path="/bills" element={<AppLayout><Suspense fallback={<PageLoading />}><Bills /></Suspense></AppLayout>} />
            <Route path="/settlement" element={<AppLayout><Suspense fallback={<PageLoading />}><Settlement /></Suspense></AppLayout>} />
            <Route path="/ai-insights" element={<AppLayout><Suspense fallback={<PageLoading />}><AIInsights /></Suspense></AppLayout>} />
            <Route path="/system-health" element={<AppLayout><Suspense fallback={<PageLoading />}><SystemHealth /></Suspense></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Suspense fallback={<PageLoading />}><Configuration /></Suspense></AppLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
