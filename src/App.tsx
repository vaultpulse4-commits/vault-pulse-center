import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import UserManagement from "./pages/UserManagement";
import PermissionMatrix from "./pages/PermissionMatrix";
import FinancialDashboard from "./pages/FinancialDashboard";
import EquipmentAnalytics from "./pages/EquipmentAnalytics";
import TeamAnalytics from "./pages/TeamAnalytics";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PWAUpdateNotification from "./components/PWAUpdateNotification";
import NetworkStatus from "./components/NetworkStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WebSocketProvider>
        <Toaster />
        <Sonner />
        <NetworkStatus />
        <PWAInstallPrompt />
        <PWAUpdateNotification />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/permissions" element={<PermissionMatrix />} />
              <Route path="/analytics/financial" element={<FinancialDashboard />} />
              <Route path="/analytics/equipment" element={<EquipmentAnalytics />} />
              <Route path="/analytics/team" element={<TeamAnalytics />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
