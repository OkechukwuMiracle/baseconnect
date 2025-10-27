// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { WalletProvider } from "@/providers/WalletProvider";
// import { AuthProvider } from "@/providers/AuthProvider";
// import { ProtectedRoute } from "@/components/ProtectedRoute";
// import Landing from "./pages/Landing";
// import Tasks from "./pages/Tasks";
// import TaskDetail from "./pages/TaskDetail";
// import Dashboard from "./pages/Dashboard";
// import Onboarding from "./pages/Onboarding";
// import CreateTask from "./pages/CreateTask";
// import NotFound from "./pages/NotFound";
// import CreatorDashboard from "./pages/dashboard/CreatorDashboard";
// import ContributorDashboard from "./pages/dashboard/ContributorDashboard";
// import Signup from "./pages/auth/Signup";
// import Login from "./pages/auth/Login";
// import TaskApplicants from "./pages/TaskApplicants";

// const App = () => (
//   <WalletProvider>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Landing />} />
//             <Route path="/tasks" element={<Tasks />} />
//             <Route path="/tasks/:id" element={<TaskDetail />} />

//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />

//             <Route path="/onboarding" element={<Onboarding />} />

//             <Route element={<ProtectedRoute roles={["creator"]} />}>
//               <Route path="/dashboard/creator" element={<CreatorDashboard />} />
//               <Route path="/create-task" element={<CreateTask />} />
//             </Route>

//             <Route element={<ProtectedRoute roles={["contributor"]} />}>
//               <Route path="/dashboard/contributor" element={<ContributorDashboard />} />
//             </Route>

//             {/* Backward-compatible generic dashboard if used */}
//             <Route element={<ProtectedRoute requireProfile roles={["creator","contributor"]} />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//             </Route>

//              {/* Shared Routes (both creators and contributors can access) */}
//           <Route 
//             path="/tasks/:id" 
//             element={
//               <ProtectedRoute>
//                 <TaskDetail />
//               </ProtectedRoute>
//             } 
//           />

//           <Route 
//   path="/dashboard/creator/tasks/:id/applicants" 
//   element={
//     <ProtectedRoute requiredRole="creator">
//       <TaskApplicants />
//     </ProtectedRoute>
//   } 
// />

//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </WalletProvider>
// );

// export default App;




import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/providers/WalletProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CreateTask from "./pages/CreateTask";
import NotFound from "./pages/NotFound";
import CreatorDashboard from "./pages/dashboard/CreatorDashboard";
import ContributorDashboard from "./pages/dashboard/ContributorDashboard";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import TaskApplicants from "./pages/TaskApplicants";

const App = () => (
  <WalletProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tasks" element={<Tasks />} />

            {/* Onboarding - requires auth but not completed profile */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute requireProfile={false}>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />

            {/* Creator Routes - nested with Outlet */}
            <Route element={<ProtectedRoute roles={["creator"]} />}>
              <Route path="/dashboard/creator" element={<CreatorDashboard />} />
              <Route path="/create-task" element={<CreateTask />} />
              <Route path="/dashboard/creator/tasks/:id/applicants" element={<TaskApplicants />} />
            </Route>

            {/* Contributor Routes - nested with Outlet */}
            <Route element={<ProtectedRoute roles={["contributor"]} />}>
              <Route path="/dashboard/contributor" element={<ContributorDashboard />} />
            </Route>

            {/* Shared Routes - accessible by both roles */}
            <Route 
              path="/tasks/:id" 
              element={
                <ProtectedRoute roles={["creator", "contributor"]}>
                  <TaskDetail />
                </ProtectedRoute>
              } 
            />

            {/* Backward-compatible generic dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={["creator", "contributor"]}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all 404 route - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </WalletProvider>
);

export default App;