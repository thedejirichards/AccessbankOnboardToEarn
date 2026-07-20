import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import StartScreen from "./pages/StartScreen";
import EntraAccountPickerPage from "./pages/EntraAccountPickerPage";
import EntraPasswordPage from "./pages/EntraPasswordPage";
import StaffHubPage from "./pages/staff-rewards/StaffHubPage";
import StaffProfilePage from "./pages/staff-rewards/StaffProfilePage";
import StaffCustomersPage from "./pages/staff-rewards/StaffCustomersPage";
import StaffAccountConsentPage from "./pages/staff-rewards/StaffAccountConsentPage";
import StaffTermsIdentityPage from "./pages/staff-rewards/StaffTermsIdentityPage";
import StaffVerificationPage from "./pages/staff-rewards/StaffVerificationPage";
import StaffCompletePage from "./pages/staff-rewards/StaffCompletePage";
import RewardsPage from "./pages/staff-rewards/RewardsPage";

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
  { path: "/staff-rewards/verification", element: <StaffVerificationPage /> },
  { path: "/staff-rewards/complete", element: <StaffCompletePage /> },
  { path: "/rewards", element: <RewardsPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
