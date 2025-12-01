import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Common pages
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

// Resi pages
import ResiRegister from "./pages/resi/ResiRegister";
import ResiOTP from "./pages/resi/ResiOTP";
import ResiBasicInfo from "./pages/resi/ResiBasicInfo";
import ResiKYCDocument from "./pages/resi/ResiKYCDocument";
import ResiKYCSelfie from "./pages/resi/ResiKYCSelfie";
import ResiBankAccount from "./pages/resi/ResiBankAccount";
import ResiTrustCode from "./pages/resi/ResiTrustCode";
import ResiDashboard from "./pages/resi/ResiDashboard";
import ResiWallet from "./pages/resi/ResiWallet";
import ResiVisitDetail from "./pages/resi/ResiVisitDetail";
import ResiVisitCheckin from "./pages/resi/ResiVisitCheckin";
import ResiVisitMission from "./pages/resi/ResiVisitMission";
import ResiVisitFlag from "./pages/resi/ResiVisitFlag";
import ResiVisitCheckout from "./pages/resi/ResiVisitCheckout";

// Client pages
import ClientRegister from "./pages/client/ClientRegister";
import ClientOTP from "./pages/client/ClientOTP";
import ClientHomeInfo from "./pages/client/ClientHomeInfo";
import ClientSelectSize from "./pages/client/ClientSelectSize";
import ClientSelectFrequency from "./pages/client/ClientSelectFrequency";
import ClientPlanSummary from "./pages/client/ClientPlanSummary";
import ClientPayment from "./pages/client/ClientPayment";
import ClientConfirmation from "./pages/client/ClientConfirmation";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientVisitDetail from "./pages/client/ClientVisitDetail";
import ClientVisitTracking from "./pages/client/ClientVisitTracking";
import ClientVisitRating from "./pages/client/ClientVisitRating";
import ClientVisitUpsell from "./pages/client/ClientVisitUpsell";
import ClientSupport from "./pages/client/ClientSupport";
import ClientSupportDetail from "./pages/client/ClientSupportDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Splash />} />
          
          {/* Resi Routes */}
          <Route path="/resi/register" element={<ResiRegister />} />
          <Route path="/resi/otp" element={<ResiOTP />} />
          <Route path="/resi/basic-info" element={<ResiBasicInfo />} />
          <Route path="/resi/kyc-document" element={<ResiKYCDocument />} />
          <Route path="/resi/kyc-selfie" element={<ResiKYCSelfie />} />
          <Route path="/resi/bank-account" element={<ResiBankAccount />} />
          <Route path="/resi/trust-code" element={<ResiTrustCode />} />
          <Route path="/resi/dashboard" element={<ResiDashboard />} />
          <Route path="/resi/wallet" element={<ResiWallet />} />
          <Route path="/resi/visit/:id" element={<ResiVisitDetail />} />
          <Route path="/resi/visit/:id/checkin" element={<ResiVisitCheckin />} />
          <Route path="/resi/visit/:id/mission" element={<ResiVisitMission />} />
          <Route path="/resi/visit/:id/flag" element={<ResiVisitFlag />} />
          <Route path="/resi/visit/:id/checkout" element={<ResiVisitCheckout />} />
          
          {/* Client Routes */}
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/otp" element={<ClientOTP />} />
          <Route path="/client/home-info" element={<ClientHomeInfo />} />
          <Route path="/client/select-size" element={<ClientSelectSize />} />
          <Route path="/client/select-frequency" element={<ClientSelectFrequency />} />
          <Route path="/client/plan-summary" element={<ClientPlanSummary />} />
          <Route path="/client/payment" element={<ClientPayment />} />
          <Route path="/client/confirmation" element={<ClientConfirmation />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/visit/:id" element={<ClientVisitDetail />} />
          <Route path="/client/visit/:id/tracking" element={<ClientVisitTracking />} />
          <Route path="/client/visit/:id/rating" element={<ClientVisitRating />} />
          <Route path="/client/visit/:id/upsell" element={<ClientVisitUpsell />} />
          <Route path="/client/support" element={<ClientSupport />} />
          <Route path="/client/support/:id" element={<ClientSupportDetail />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
