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

// Client pages - Dashboard and visit management
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientVisitDetail from "./pages/client/ClientVisitDetail";
import ClientVisitTracking from "./pages/client/ClientVisitTracking";
import ClientVisitRating from "./pages/client/ClientVisitRating";
import ClientVisitUpsell from "./pages/client/ClientVisitUpsell";
import ClientVisitReschedule from "./pages/client/ClientVisitReschedule";
import ClientSupport from "./pages/client/ClientSupport";
import ClientSupportDetail from "./pages/client/ClientSupportDetail";
import ClientSupportNew from "./pages/client/ClientSupportNew";

// Flash cleaning flow
import ClientFlashSelect from "./pages/client/ClientFlashSelect";
import ClientFlashPhoto from "./pages/client/ClientFlashPhoto";
import ClientFlashAddress from "./pages/client/ClientFlashAddress";
import ClientFlashAvailability from "./pages/client/ClientFlashAvailability";
import ClientFlashSummary from "./pages/client/ClientFlashSummary";
import ClientFlashPayment from "./pages/client/ClientFlashPayment";
import ClientFlashTracking from "./pages/client/ClientFlashTracking";

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
          
          {/* Client Routes - Dashboard and visit management */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/visit/:id" element={<ClientVisitDetail />} />
          <Route path="/client/visit/:id/tracking" element={<ClientVisitTracking />} />
          <Route path="/client/visit/:id/rating" element={<ClientVisitRating />} />
          <Route path="/client/visit/:id/upsell" element={<ClientVisitUpsell />} />
          <Route path="/client/visit/:id/reschedule" element={<ClientVisitReschedule />} />
          <Route path="/client/support" element={<ClientSupport />} />
          <Route path="/client/support/new" element={<ClientSupportNew />} />
          <Route path="/client/support/:id" element={<ClientSupportDetail />} />
          
          {/* Flash Cleaning Routes */}
          <Route path="/client/flash-select" element={<ClientFlashSelect />} />
          <Route path="/client/flash-photo" element={<ClientFlashPhoto />} />
          <Route path="/client/flash-address" element={<ClientFlashAddress />} />
          <Route path="/client/flash-availability" element={<ClientFlashAvailability />} />
          <Route path="/client/flash-summary" element={<ClientFlashSummary />} />
          <Route path="/client/flash-payment" element={<ClientFlashPayment />} />
          <Route path="/client/flash-tracking" element={<ClientFlashTracking />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
