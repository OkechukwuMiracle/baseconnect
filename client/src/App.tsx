// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { WalletProvider } from "@/providers/WalletProvider";
// import { AuthProvider } from "@/providers/AuthProvider";
// import { ProtectedRoute } from "@/components/ProtectedRoute";

// import Landing from "./pages/Landing";
// import About from "./pages/About";
// import Tasks from "./pages/Tasks";
// import TaskDetail from "./pages/TaskDetail";
// import Dashboard from "./pages/Dashboard";
// import Onboarding from "./pages/Onboarding";
// import NotFound from "./pages/NotFound";
// import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
// import ContributorDashboard from "./pages/dashboard/contributor/ContributorDashboard";
// import Signup from "./pages/auth/Signup";
// import Login from "./pages/auth/Login";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import VerifyOTP from "./pages/auth/VerifyOTP";
// import VerifySignupOTP from "./pages/auth/VerifySignupOTP";
// import ResetPassword from "./pages/auth/ResetPassword";
// import GoogleCallback from "./pages/auth/GoogleCallback";
// import CompleteContributorProfile from "./pages/dashboard/contributor/CompleteContributorProfile";
// import TaskApplicants from "./pages/TaskApplicants";
// import TaskSubmissionReview from "./pages/TaskSubmissionReview";
// import Waitlist from "./pages/Waitlist";
// import CompleteCreatorProfile from "./pages/dashboard/creator/CompleteCreatorProfile";

// import "@/config/web3modal";

// const App = () => (
//     <WalletProvider>
//       <AuthProvider>
//         <TooltipProvider>
//           <Toaster />
//           <Sonner />

//           <BrowserRouter>
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<Landing />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/verify-otp" element={<VerifyOTP />} />
//               <Route path="/verify-signup-otp" element={<VerifySignupOTP />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//               <Route path="/auth/callback" element={<GoogleCallback />} />
//               <Route path="/tasks" element={<Tasks />} />
//               <Route path="/waitlist" element={<Waitlist />} />

//               <Route 
//                 path="/onboarding"
//                 element={
//                   <ProtectedRoute requireProfile={false}>
//                     <Onboarding />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="/about" element={<About />} />
//               <Route path="/complete-profile" element={<CompleteContributorProfile />} />

//               <Route 
//                 path="/dashboard/creator/creator-profile"
//                 element={
//                   <ProtectedRoute requireProfile={false}>
//                     <CompleteCreatorProfile />
//                   </ProtectedRoute>
//                 }
//               /> 

//               <Route element={<ProtectedRoute roles={["creator"]} requireProfile={false} />}>
//                 <Route path="/dashboard/creator" element={<CreatorDashboard />} />
//                 <Route path="/dashboard/creator/tasks/:id/applicants" element={<TaskApplicants />} />
//                 <Route path="/dashboard/creator/tasks/:id/review" element={<TaskSubmissionReview />} />
//               </Route>

//               <Route element={<ProtectedRoute roles={["contributor"]} requireProfile={false} />}>
//                 <Route path="/dashboard/contributor" element={<ContributorDashboard />} />
//               </Route>

//               <Route 
//                 path="/tasks/:id"
//                 element={
//                   <ProtectedRoute roles={["creator", "contributor"]}>
//                     <TaskDetail />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route 
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute roles={["creator", "contributor"]}>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </BrowserRouter>
//         </TooltipProvider>
//       </AuthProvider>
//     </WalletProvider>
// );

// export default App;




// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/providers/WalletProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import ContributorDashboard from "./pages/dashboard/contributor/ContributorDashboard";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import VerifySignupOTP from "./pages/auth/VerifySignupOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import GoogleCallback from "./pages/auth/GoogleCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import CompleteContributorProfile from "./pages/dashboard/contributor/CompleteContributorProfile";
import TaskApplicants from "./pages/TaskApplicants";
import TaskSubmissionReview from "./pages/TaskSubmissionReview";
import Waitlist from "./pages/Waitlist";
import CompleteCreatorProfile from "./pages/dashboard/creator/CompleteCreatorProfile";

import "@/config/web3modal";

const App = () => (
  <WalletProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/verify-signup-otp" element={<VerifySignupOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<GoogleCallback />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/waitlist" element={<Waitlist />} />

              <Route 
                path="/onboarding"
                element={
                  <ProtectedRoute requireProfile={false}>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/complete-profile" element={<CompleteContributorProfile />} />

              <Route 
                path="/dashboard/creator/creator-profile"
                element={
                  <ProtectedRoute requireProfile={false}>
                    <CompleteCreatorProfile />
                  </ProtectedRoute>
                }
              /> 

            <Route element={<ProtectedRoute roles={["creator"]} requireProfile={false} />}>
              <Route path="/dashboard/creator" element={<CreatorDashboard />} />
              <Route path="/dashboard/creator/tasks/:id/applicants" element={<TaskApplicants />} />
              <Route path="/dashboard/creator/tasks/:id/review" element={<TaskSubmissionReview />} />
            </Route>

            <Route element={<ProtectedRoute roles={["contributor"]} requireProfile={false} />}>
              <Route path="/dashboard/contributor" element={<ContributorDashboard />} />
            </Route>

            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute roles={["creator", "contributor"]}>
                  <TaskDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["creator", "contributor"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </WalletProvider>
);

export default App;
