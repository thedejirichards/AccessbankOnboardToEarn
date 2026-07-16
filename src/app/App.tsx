import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import StartScreen from "./pages/StartScreen";
import StaffHubPage from "./pages/staff-rewards/StaffHubPage";
import StaffAuthPage from "./pages/staff-rewards/StaffAuthPage";
import StaffCategoryPage from "./pages/staff-rewards/StaffCategoryPage";
import StaffAccountTypePage from "./pages/staff-rewards/StaffAccountTypePage";
import StaffConsentPage from "./pages/staff-rewards/StaffConsentPage";
import StaffIdentityPage from "./pages/staff-rewards/StaffIdentityPage";
import StaffValidationPage from "./pages/staff-rewards/StaffValidationPage";
import StaffLivenessPage from "./pages/staff-rewards/StaffLivenessPage";
import StaffOtpPage from "./pages/staff-rewards/StaffOtpPage";
import StaffReviewPage from "./pages/staff-rewards/StaffReviewPage";
import StaffAdditionalInfoPage from "./pages/staff-rewards/StaffAdditionalInfoPage";
import StaffSuccessPage from "./pages/staff-rewards/StaffSuccessPage";
import RewardsPage from "./pages/staff-rewards/RewardsPage";

const routes = [
  { path: "/", element: <StartScreen /> },
  { path: "/home", element: <StaffHubPage /> },
  { path: "/staff-rewards", element: <StaffHubPage /> },
  { path: "/staff-rewards/auth", element: <StaffAuthPage /> },
  { path: "/staff-rewards/category", element: <StaffCategoryPage /> },
  { path: "/staff-rewards/account-type", element: <StaffAccountTypePage /> },
  { path: "/staff-rewards/consent", element: <StaffConsentPage /> },
  { path: "/staff-rewards/identity", element: <StaffIdentityPage /> },
  { path: "/staff-rewards/validating", element: <StaffValidationPage /> },
  { path: "/staff-rewards/liveness", element: <StaffLivenessPage /> },
  { path: "/staff-rewards/otp", element: <StaffOtpPage /> },
  { path: "/staff-rewards/review", element: <StaffReviewPage /> },
  { path: "/staff-rewards/additional-info", element: <StaffAdditionalInfoPage /> },
  { path: "/staff-rewards/success", element: <StaffSuccessPage /> },
  { path: "/rewards", element: <RewardsPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
