import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import logo from "@/assets/baseconnect-logo-1.png";
import CreateTask from "@/pages/dashboard/creator/CreateTask";
import CompleteProfile from "@/pages/dashboard/contributor/CompleteContributorProfile";
import Waitlist from "@/pages/Waitlist";
import { useAccount } from "wagmi";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrDocumentText } from "react-icons/gr";
import { LiaCoinsSolid } from "react-icons/lia";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import CustomConnectButton from "@/components/CustomConnectButton";
import { LuClock4 } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import Usdc from "@/assets/usdc-logo.png";
import CompleteCreatorProfile from "./CompleteCreatorProfile";
import MyCreatorProfile from "./MyCreatorProfile";

interface Task {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  reward: string;
  status: "open" | "in_progress" | "completed";
  deadline: string;
  skills: string[];
  hasSubmission?: boolean;
  applicants?: number;
}

interface Proposal {
  applicationId?: string;
  id?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  email?: string;
  coverLetter?: string;
  skills?: string[];
  task?: Task;
}

// Create a separate component for the main content that can access sidebar context
function DashboardContent() {
  const { user, loading, logout } = useAuth();
  const { address: connectedAddress, isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  
  const [activeView, setActiveView] = useState<
    "dashboard" | "create" | "earn" | "profile"
  >("dashboard");
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeTab, setActiveTab] = useState<
    "posts" | "proposals" | "inprogress" | "completed"
  >("posts");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [hiring, setHiring] = useState(false);

   const isDesktop = window.innerWidth >= 768;

const computedSidebarWidth = useMemo(() => {
  if (!isDesktop) return "0rem"; // MOBILE → full width
  return sidebarState === "expanded" ? "16rem" : "3rem";
}, [sidebarState, isDesktop]);

  const formatDeadlineAsDuration = (deadline: string): string => {
    if (!deadline) return "—";

    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 14) return "1 week";
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    if (diffDays < 60) return "1 month";
    return `${Math.ceil(diffDays / 30)} months`;
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search || "");
      const view = params.get("view");
      if (
        view === "profile" ||
        view === "create" ||
        view === "earn" ||
        view === "dashboard"
      ) {
        setActiveView(view);
        navigate(location.pathname, { replace: true });
      }
    } catch (e) {
      // ignore
    }

    const load = async () => {
      if (!user?.id || !user?.token) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks?creator=${user.id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const data = await res.json();
        setPostedTasks(Array.isArray(data) ? data : []);
      } catch {
        setPostedTasks([]);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [user?.id, user?.token, location.pathname, location.search, navigate]);

  useEffect(() => {
    const loadProposals = async () => {
      if (!user?.id || !user?.token) return;
      try {
        const allProposals: Proposal[] = [];
        await Promise.all(
          postedTasks.map(async (t) => {
            if (!t._id && !t.id) return;
            const id = t._id || t.id;
            if (!t.applicants || t.applicants === 0) return;
            try {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/tasks/${id}/applicants`,
                {
                  headers: { Authorization: `Bearer ${user.token}` },
                }
              );
              if (!res.ok) return;
              const apps = await res.json();
              const mapped = Array.isArray(apps)
                ? apps.map((a) => ({ ...a, task: t }))
                : [];
              allProposals.push(...mapped);
            } catch (err) {
              // ignore per-task errors
            }
          })
        );

        setProposals(allProposals);
      } catch (err) {
        setProposals([]);
      }
    };

    loadProposals();
  }, [postedTasks, user?.token, user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const viewLabels: Record<string, string> = {
    dashboard: "Dashboard",
    create: "Create Task",
    earn: "Earn",
    profile: "Profile",
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center m-auto">
        <p className="text-muted-foreground text-center">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="fixed left-0 top-0 h-screen w-[16rem] border-r bg-white z-50"
      >
        <SidebarHeader className=" py-4 border-b-2 border-b-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <SidebarTrigger className="mr-0 hover:bg-gradient-hero p-2" />
            <Link
              to="/dashboard/creator"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity overflow-hidden cursor-pointer"
            >
              <img
                src={logo}
                alt="BaseConnect Logo"
                className="h-8 w-8 cursor-pointer md:cursor-auto"
              />
              <motion.span
                className="text-[16px] font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                BaseConnect
              </motion.span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className={`flex items-center gap-3 px-4 py-6 w-full text-left ${
                      activeView === "dashboard"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                        : ""
                    }`}
                  >
                    <LuLayoutDashboard />
                    <p>Dashboard</p>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setActiveView("create")}
                    className={`flex items-center gap-3 px-4 py-6 w-full text-left ${
                      activeView === "create"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                        : ""
                    }`}
                  >
                    <GrDocumentText />
                    <p>Create Task</p>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setActiveView("earn")}
                    className={`flex items-center gap-3 px-4 py-6 w-full text-left ${
                      activeView === "earn"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                        : ""
                    }`}
                  >
                    <LiaCoinsSolid className="w-6 h-6" />
                    <p>Earn</p>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setActiveView("profile")}
                    className={`flex items-center gap-3 px-4 py-6 w-full text-left ${
                      activeView === "profile"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                        : ""
                    }`}
                  >
                    <FaRegCircleUser />
                    <p>Profile</p>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="py-6 border-t border-t-gray-100">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full hover:bg-red-50 justify-start p-0 pr-4 text-left flex items-center"
              >
                <div className="flex items-center gap-3 w-full px-2">
                  <IoIosLogOut className="text-red-500 flex-shrink-0" />
                  <span className="text-red-500 group-data-[collapsible=icon]:hidden">
                    Logout
                  </span>
                </div>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-gradient-hero hover:border-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-gradient-hero"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarFooter>
      </Sidebar>

      {/* Main Layout - Adjusts based on sidebar state */}
      <SidebarInset 
        className="h-screen overflow-x-hidden relative z-10 transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: computedSidebarWidth,
  width: isDesktop ? `calc(100% - ${computedSidebarWidth})` : "100%"
        }}
      >
        <div className="px-0 container mx-auto">
          {/* Fixed Header */}
          <div 
            className="flex items-center justify-between mb-6 fixed bg-white px-4 border-b-2 border-b-gray-100 py-4 z-30 transition-all duration-300 ease-in-out"
            style={{ 
              left: isDesktop ? computedSidebarWidth : 0,
  width: isDesktop ? `calc(100% - ${computedSidebarWidth})` : "100%"
            }}
          >
            <div>
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hover:bg-gradient-hero md:hidden" />
                <p className="text-sm text-muted-foreground hidden md:flex ml-4">
                  &lt; &gt; {viewLabels[activeView]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CustomConnectButton />
            </div>
          </div>

          {/* Main Content */}
          {activeView === "dashboard" && (
            <div className="w-[90%] m-auto z-10 mt-24">
              <h1 className="text-2xl font-bold">Creator Dashboard</h1>
              <p className="text-[13px] text-muted-foreground">
                View available tasks, manage your active work, and track
                complete project
              </p>
              <div className="md:flex justify-between items-center gap-3 mb-6 mt-3 p-2 bg-gray-100 rounded-xl">
                <button
                  className={`px-4 py-2 mr-6 rounded-md ${
                    activeTab === "posts"
                      ? "bg-white shadow"
                      : "bg-transparent text-muted-foreground text-[14px]"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  Job Posts ({postedTasks.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "proposals"
                      ? "bg-white shadow"
                      : "bg-transparent text-muted-foreground text-[14px]"
                  }`}
                  onClick={() => setActiveTab("proposals")}
                >
                  Proposals ({proposals.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "inprogress"
                      ? "bg-white shadow"
                      : "bg-transparent text-muted-foreground text-[14px]"
                  }`}
                  onClick={() => setActiveTab("inprogress")}
                >
                  In Progress (
                  {
                    postedTasks.filter((t) => t.status === "in_progress")
                      .length
                  }
                  )
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "completed"
                      ? "bg-white shadow"
                      : "bg-transparent text-muted-foreground text-[14px]"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed (
                  {postedTasks.filter((t) => t.status === "completed").length}
                  )
                </button>
              </div>

              {/* Tab Content - keeping existing code */}
              {activeTab === "posts" && (
                <div className="grid grid-cols-1 gap-6">
                  {postedTasks.length ? (
                    postedTasks.map((t) => (
                      <div
                        key={t._id || t.id}
                        className="p-4 bg-white rounded-lg shadow-sm border"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {t.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t.description?.slice?.(0, 150)}
                            </p>
                            <div className="flex gap-2 mt-3">
                              {(t.skills || [])
                                .slice?.(0, 3)
                                .map((tag, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-xs text-blue-600 px-3 py-1 rounded-xl bg-accent/10"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-5 ">
                              <div className="text-[12px] text-muted-foreground mt-6  flex items-center gap-2 ">
                                <LuClock4 />
                                Estimated Duration:{" "}
                                {formatDeadlineAsDuration(t.deadline)}
                              </div>
                              <div className="text-[12px] text-muted-foreground mt-6  flex items-center gap-2">
                                <FiUsers />
                                {t.applicants || 0} proposals
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="">
                              <div className="flex items-center gap-2">
                                <img src={Usdc} alt="Usdc icon" />
                                <p className="mr-2 text-blue-700">
                                  {t.reward}
                                </p>
                              </div>
                              <p className="text-muted-foreground text-[10px]">
                                Budget
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">
                          No posted tasks
                        </CardTitle>
                        <CardDescription>
                          Create a task to get started
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}

              {/* Other tabs content remains the same... */}
              {activeTab === "proposals" && (
                <div className="space-y-4">
                  {proposals.length ? (
                    proposals.map((p) => (
                      <div
                        key={p.applicationId}
                        className="p-4 bg-white rounded-lg border flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={p.avatar || "/placeholder-avatar.png"}
                            alt={p.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {p.bio || "No bio provided"}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-xs text-muted-foreground">
                              Skills
                            </div>
                            <div className="flex gap-2 mt-1">
                              {(p.skills || []).map((s: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs bg-muted/20 px-2 py-1 rounded"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedProposal(p);
                              setSheetOpen(true);
                            }}
                          >
                            View Proposal
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              if (!confirm("Hire this contributor?")) return;
                              try {
                                setHiring(true);
                                const res = await fetch(
                                  `${import.meta.env.VITE_API_URL}/api/tasks/${
                                    p.task._id || p.task.id
                                  }/accept`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${user.token}`,
                                    },
                                    body: JSON.stringify({
                                      applicantId: p.id,
                                    }),
                                  }
                                );
                                if (!res.ok)
                                  throw new Error("Failed to hire");
                                const refreshed = await fetch(
                                  `${
                                    import.meta.env.VITE_API_URL
                                  }/api/tasks?creator=${user.id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${user.token}`,
                                    },
                                  }
                                );
                                const dt = await refreshed.json();
                                setPostedTasks(Array.isArray(dt) ? dt : []);
                                setProposals(
                                  proposals.filter(
                                    (pp) =>
                                      pp.applicationId !== p.applicationId
                                  )
                                );
                              } catch (err) {
                                alert(
                                  (err as Error).message || "Hire failed"
                                );
                              } finally {
                                setHiring(false);
                              }
                            }}
                          >
                            Hire
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">
                          No proposals yet
                        </CardTitle>
                        <CardDescription>
                          Wait for contributors to apply
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "inprogress" && (
                <div>
                  {postedTasks.filter((t) => t.status === "in_progress")
                    .length ? (
                    postedTasks
                      .filter((t) => t.status === "in_progress")
                      .map((t) => (
                        <div
                          key={t._id || t.id}
                          className="p-4 bg-white rounded-lg border"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold">{t.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t.description?.slice?.(0, 120)}
                              </p>
                            </div>
                            <div>
                              <Link
                                to={`/dashboard/creator/tasks/${
                                  t._id || t.id
                                }/review`}
                              >
                                <Button size="sm">Review Submission</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">
                          No progress
                        </CardTitle>
                        <CardDescription>
                          Waiting for contributors to begin task
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "completed" && (
                <div className="grid grid-cols-1 gap-4">
                  {postedTasks.filter((t) => t.status === "completed")
                    .length ? (
                    postedTasks
                      .filter((t) => t.status === "completed")
                      .map((t) => (
                        <div
                          key={t._id || t.id}
                          className="p-4 bg-white rounded-lg border"
                        >
                          <h3 className="font-semibold">{t.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Completed
                          </p>
                        </div>
                      ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">
                          No Completed task
                        </CardTitle>
                        <CardDescription>
                          Waiting for contributors to begin task
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {activeView === "create" && (
            <div className="pt-16 w-[90%] m-auto">
              <CreateTask />
            </div>
          )}

          {activeView === "profile" && (
            <div className="pt-24 w-[90%] m-auto">
              {user?.profileCompleted ? (
                <MyCreatorProfile />
              ) : (
                <CompleteCreatorProfile />
              )}
            </div>
          )}

          {activeView === "earn" && (
            <div className="pt-24 w-[90%] m-auto">
              <Waitlist />
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
}

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-background w-full">
      <SidebarProvider>
        <DashboardContent />
      </SidebarProvider>
    </div>
  );
}