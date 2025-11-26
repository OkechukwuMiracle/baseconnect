import { useEffect, useState, useMemo } from "react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import logo from "@/assets/baseconnect-logo-1.png";
import CreateTask from "@/pages/CreateTask";
import CompleteProfile from "@/pages/CompleteProfile";
import Waitlist from "@/pages/Waitlist";
import { useAccount } from "wagmi";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LuLayoutDashboard } from "react-icons/lu";
import { GrDocumentText } from "react-icons/gr";
import { LiaCoinsSolid } from "react-icons/lia";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LuClock4 } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import Usdc from "@/assets/usdc-logo.png";
import { useNavigate } from "react-router-dom";

interface Task {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  reward: string;
  status: "open" | "in_progress" | "completed";
  deadline: string;
  skills: [];
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

export default function CreatorDashboard() {
  const { user, loading, logout } = useAuth();
  const { address: connectedAddress, isConnected } = useAccount();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"dashboard"|"create"|"earn"|"profile">("dashboard");
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeTab, setActiveTab] = useState<"posts"|"proposals"|"inprogress"|"completed">("posts");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [hiring, setHiring] = useState(false);

  // Add this helper function after your imports
  const formatDeadlineAsDuration = (deadline: string): string => {
    if (!deadline) return '—';
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 14) return '1 week';
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    if (diffDays < 60) return '1 month';
    return `${Math.ceil(diffDays / 30)} months`;
  };

  useEffect(() => {
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
  }, [user?.id, user?.token]);

  // Aggregate proposals (applications) for tasks that have applicants
  useEffect(() => {
    const loadProposals = async () => {
      if (!user?.id || !user?.token) return;
      try {
        const allProposals: Proposal[] = [];
        // For each task, if it has applicants, fetch them
        await Promise.all(
          postedTasks.map(async (t) => {
            if (!t._id && !t.id) return;
            const id = t._id || t.id;
            if (!t.applicants || t.applicants === 0) return;
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}/applicants`, {
                headers: { Authorization: `Bearer ${user.token}` },
              });
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
  navigate('/login');
};

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <SidebarProvider className="w-full">
          <Sidebar collapsible="icon" className="fixed left-0 top-0 h-screen w-[16rem] border-r bg-white z-50">
            <SidebarHeader className="px-4 py-4 border-b-2 border-b-gray-200">
               <Link 
                                   to="/dashboard/creator" 
                                   className="flex items-center gap-3 mb-2 hover:opacity-80 transition-opacity overflow-hidden cursor-pointer"
                                   
                                 >
                                   <img 
                                     src={logo} 
                                     alt="BaseConnect Logo" 
                                     className="h-8 w-8 cursor-pointer md:cursor-auto" 
                                   />
                                       <motion.span 
                                         className="text-[18px] font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap"
                                         initial={{ width: 0, opacity: 0 }}
                                         animate={{ width: "auto", opacity: 1 }}
                                         exit={{ width: 0, opacity: 0 }}
                                         transition={{ duration: 1, ease: "easeInOut" }}
                                       >
                                         BaseConnect
                                       </motion.span>
                                    
                                 </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={() => setActiveView("dashboard")} className="flex items-center gap-3 px-4 py-6 w-full text-left">
                        <LuLayoutDashboard />
                        <p>Dashboard</p>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={() => setActiveView("create")} className="flex items-center gap-3 px-4 py-6 w-full text-left">
                        <GrDocumentText />
                        <p>Create Task</p>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={() => setActiveView("earn")} className="flex items-center gap-3 px-4 py-6 w-full text-left">
                        <LiaCoinsSolid className="w-6 h-6" />
                        <p>Earn</p>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button onClick={() => setActiveView("profile")} className="flex items-center gap-3 px-4 py-6 w-full text-left">
                        <FaRegCircleUser />
                        <p>Profile</p>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="px-4 py-6">
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="ghost" className="w-full hover:bg-gradient-hero">
        <div className="flex items-center gap-3 w-full">
          <IoIosLogOut className="text-red-500" />
          <p>Logout</p>
        </div>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
        <AlertDialogDescription>
          You will need to sign in again to access your dashboard.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:bg-gradient-hero hover:border-white">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleLogout} className="bg-gradient-hero">
          Logout
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</SidebarFooter>
          </Sidebar>


          {/* mainLayout */}
          {/* adjust inset padding depending on sidebar/mobile state */}
          <SidebarInset className='h-screen overflow-x-hidden relative z-10 pl-0 md:pl-[16rem]'>
            <div className=" px-0 container mx-auto w-ful">
              <div className="flex items-center justify-between mb-6 fixed bg-white left-0 right-0 px-4 border-b-2 border-b-gray-200 py-4 z-30">
                 <div>
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="hover:bg-gradient-hero" />
                    <p className="text-sm text-muted-foreground hidden md:flex">&lt; &gt;  Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-3"><ConnectButton /></div>
              </div>

              {/* Main inset content - only show dashboard tabs when dashboard view is active */}
              {activeView === 'dashboard' && (
                <div className="w-[90%] m-auto z-10 mt-24">
                  <h1 className="text-2xl font-normal">Creator Dashboard</h1>
                  <p className="text-[12px] text-gray-400">View available tasks, manage your active work, and track complete project</p>
                  <div className="md:flex md:justify-between items-center gap-3 mb-6 mt-3 bg-gray-100 rounded-xl">
                
                <button
                  className={`px-4 py-2 mr-6 rounded-md ${activeTab === 'posts' ? 'bg-white shadow' : 'bg-transparent text-muted-foreground text-[14px]'}`}
                  onClick={() => setActiveTab('posts')}
                >
                  Job Posts ({postedTasks.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeTab === 'proposals' ? 'bg-white shadow' : 'bg-transparent text-muted-foreground text-[14px]'}`}
                  onClick={() => setActiveTab('proposals')}
                >
                  Proposals ({proposals.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeTab === 'inprogress' ? 'bg-white shadow' : 'bg-transparent text-muted-foreground text-[14px]'}`}
                  onClick={() => setActiveTab('inprogress')}
                >
                  In Progress ({postedTasks.filter(t=>t.status==='in_progress').length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-white shadow' : 'bg-transparent text-muted-foreground text-[14px]'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed ({postedTasks.filter(t=>t.status==='completed').length})
                </button>
              </div>
              

              {/* Content */}
              {activeTab === 'posts' && (
                <div className="grid grid-cols-1 gap-6">
                  {postedTasks.length ? (
                    postedTasks.map((t) => (
                      <div key={t._id || t.id} className="p-4 bg-white rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{t.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{t.description?.slice?.(0,150)}</p>
                            <div className="flex gap-2 mt-3">
                              {(t.tags||t.skills||[]).slice?.(0,3).map((tag,idx:number)=>(<span key={idx} className="text-xs text-blue-600 px-3 py-1 rounded-xl bg-accent/10">{tag}</span>))}
                            </div>
                            <div className="flex items-center gap-5 ">
                              <div className="text-[12px] text-muted-foreground mt-6  flex items-center gap-2 "><LuClock4 />Estimated Duration: {formatDeadlineAsDuration(t.deadline)}</div>
                            <div className="text-[12px] text-muted-foreground mt-6  flex items-center gap-2" > <span><FiUsers /></span> {t.applicants || 0} proposals</div>
                            </div>
                          </div>
                          <div className="text-right">
                            
                            <div className="">
                              <div className="flex items-center gap-2">
                                <img src={Usdc} alt="Usdc icon" />
                                <p className="mr-2 text-blue-700">{t.reward}</p>
                              </div>
                                <p className="text-muted-foreground text-[10px]">Budget</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">No posted tasks</CardTitle>
                        <CardDescription>Create a task to get started</CardDescription>
                      </CardHeader>
                      <CardContent>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'proposals' && (
                <div className="space-y-4">
                  {proposals.length ? proposals.map((p) => (
                    <div key={p.applicationId} className="p-4 bg-white rounded-lg border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={p.avatar || '/placeholder-avatar.png'} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-sm text-muted-foreground">{p.bio || 'No bio provided'}</div>
                        </div>
                        <div className="ml-4">
                          <div className="text-xs text-muted-foreground">Skills</div>
                          <div className="flex gap-2 mt-1">{(p.skills||[]).map((s:any, i:number)=>(<span key={i} className="text-xs bg-muted/20 px-2 py-1 rounded">{s}</span>))}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" onClick={() => { setSelectedProposal(p); setSheetOpen(true); }}>
                          View Proposal
                        </Button>
                        <Button size="sm" variant="ghost" onClick={async ()=>{
                          // quick hire shortcut
                          if(!confirm('Hire this contributor?')) return;
                          try{
                            setHiring(true);
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${p.task._id || p.task.id}/accept`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                              body: JSON.stringify({ applicantId: p.id })
                            });
                            if(!res.ok) throw new Error('Failed to hire');
                            // Refresh tasks
                            const refreshed = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?creator=${user.id}`, { headers: { Authorization: `Bearer ${user.token}` } });
                            const dt = await refreshed.json();
                            setPostedTasks(Array.isArray(dt)?dt:[]);
                            setProposals(proposals.filter(pp=>pp.applicationId!==p.applicationId));
                          }catch(err){
                            alert((err as Error).message || 'Hire failed');
                          }finally{ setHiring(false); }
                        }}>Hire</Button>
                      </div>
                    </div>
                  )) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">No proposals yet</CardTitle>
                        <CardDescription>Wait for contributors to apply</CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'inprogress' && (
                <div>
                  {postedTasks.filter(t=>t.status==='in_progress').length ? (
                    postedTasks.filter(t=>t.status==='in_progress').map(t=> (
                      <div key={t._id || t.id} className="p-4 bg-white rounded-lg border">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{t.title}</h3>
                            <p className="text-sm text-muted-foreground">{t.description?.slice?.(0,120)}</p>
                          </div>
                          <div>
                            <Link to={`/dashboard/creator/tasks/${t._id || t.id}/review`}><Button size="sm">Review Submission</Button></Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">No progress</CardTitle>
                        <CardDescription>Waiting for contributors to begin task</CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="grid grid-cols-1 gap-4">
                  {postedTasks.filter(t=>t.status==='completed').length ? (
                    postedTasks.filter(t=>t.status==='completed').map(t=> (
                      <div key={t._id || t.id} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-semibold">{t.title}</h3>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    ))
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-normal">No Completed task</CardTitle>
                        <CardDescription>Waiting for contributors to begin task</CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              )}
              </div>
            )}

            {activeView === 'create' && (
              <div className="pt-6 w-[90%] m-auto">
                <CreateTask />
              </div>
            )}

            {activeView === 'profile' && (
              <div className="pt-6 w-[90%] m-auto">
                <CompleteProfile />
              </div>
            )}

            {activeView === 'earn' && (
              <div className="pt-6 w-[90%] m-auto">
                <h2 className="text-xl font-semibold">Earnings</h2>
                <Waitlist />
              </div>
            )}
            </div>
          </SidebarInset>
      </SidebarProvider>
    </div>
  );
}





        {/* Proposal side sheet */}
        {/* <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Proposal Details</SheetTitle>
              <SheetDescription>Review contributor proposal and hire if appropriate</SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              {selectedProposal ? (
                <div>
                  <div className="flex items-center gap-4">
                    <img src={selectedProposal.avatar || '/placeholder-avatar.png'} className="h-12 w-12 rounded-full" />
                    <div>
                      <div className="font-semibold">{selectedProposal.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedProposal.email}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold">Cover letter</h4>
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{selectedProposal.coverLetter || 'No cover letter'}</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button onClick={async ()=>{
                      if(!confirm('Confirm hire?')) return;
                      try{
                        setHiring(true);
                        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${selectedProposal.task._id || selectedProposal.task.id}/accept`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                          body: JSON.stringify({ applicantId: selectedProposal.id })
                        });
                        if(!res.ok) throw new Error('Hire failed');
                        const refreshed = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?creator=${user.id}`, { headers: { Authorization: `Bearer ${user.token}` } });
                        const dt = await refreshed.json();
                        setPostedTasks(Array.isArray(dt)?dt:[]);
                        setProposals(proposals.filter(pp=>pp.applicationId!==selectedProposal.applicationId));
                        setSheetOpen(false);
                      }catch(err){
                        alert((err as Error).message || 'Hire failed');
                      }finally{ setHiring(false); }
                    }}>Hire</Button>
                    <Button variant="ghost" onClick={()=>setSheetOpen(false)}>Close</Button>
                  </div>
                </div>
              ) : (
                <p>No proposal selected</p>
              )}
            </div>
            <SheetFooter />
          </SheetContent>
        </Sheet> */}