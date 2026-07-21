import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import StartScreen from "./pages/StartScreen";
import EntraAccountPickerPage from "./pages/EntraAccountPickerPage";
import EntraPasswordPage from "./pages/EntraPasswordPage";
import StaffHubPage from "./pages/staff-rewards/StaffHubPage";
import StaffProfilePage from "./pages/staff-rewards/StaffProfilePage";
import StaffCustomersPage from "./pages/staff-rewards/StaffCustomersPage";
import StaffAccountConsentPage from "./pages/staff-rewards/StaffAccountConsentPage";
import StaffTermsIdentityPage from "./pages/staff-rewards/StaffTermsIdentityPage";

import StaffCompletePage from "./pages/staff-rewards/StaffCompletePage";
import RewardsPage from "./pages/staff-rewards/RewardsPage";
import LoansPage from "./pages/staff-rewards/LoansPage";
import DeviceFinancePage from "./pages/staff-rewards/DeviceFinancePage";
import VehicleFinancePage from "./pages/staff-rewards/VehicleFinancePage";
import PayWithQuickboxPage from "./pages/staff-rewards/PayWithQuickboxPage";
import SupportPage from "./pages/staff-rewards/SupportPage";

const routes = [
  { path: "/", element: <StartScreen /> },
  { path: "/login/entra", element: <EntraAccountPickerPage /> },
  { path: "/login/entra/password", element: <EntraPasswordPage /> },
  { path: "/home", element: <StaffHubPage /> },
  { path: "/staff-rewards", element: <StaffHubPage /> },
  { path: "/staff-rewards/profile", element: <StaffProfilePage /> },
  { path: "/staff-rewards/customers", element: <StaffCustomersPage /> },
  { path: "/staff-rewards/account", element: <StaffAccountConsentPage /> },
  { path: "/staff-rewards/terms-identity", element: <StaffTermsIdentityPage /> },
  { path: "/staff-rewards/complete", element: <StaffCompletePage /> },
  { path: "/rewards", element: <RewardsPage /> },
  { path: "/loans", element: <LoansPage /> },
  { path: "/device-finance", element: <DeviceFinancePage /> },
  { path: "/vehicle-finance", element: <VehicleFinancePage /> },
  { path: "/pay-with-quickbox", element: <PayWithQuickboxPage /> },
  { path: "/support", element: <SupportPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
