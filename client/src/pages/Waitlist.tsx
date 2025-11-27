import { useState, useEffect } from "react";
import LandingNavbar from "@/components/LandingNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import {
  CheckCircle2,
  Circle,
  Loader2,
  RefreshCw,
  Target,
  Trophy,
  Users,
  Link2,
  Wallet,
  Sparkles,
  TrendingUp,
  Award,
  Play,
} from "lucide-react";
import axios from "axios";
import { TaskModal } from "@/components/waitlist/TaskModal";
import { LiaCoinsSolid } from "react-icons/lia";
import { LuSquareActivity } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";

interface WaitlistTask {
  _id: string;
  taskId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  taskType: string;
  requiredValue: number | null;
  userProgress?: {
    status: "not_started" | "in_progress" | "completed";
    progress: number;
    completedAt: string | null;
  };
}

interface ProgressData {
  tasks: WaitlistTask[];
  overallProgress: number;
  completedCount: number;
  totalCount: number;
  points?: number;
  activityLevel?: number;
  referralCount?: number;
}

const categoryConfig = {
  "mvp-scope": {
    title: "Complete Tasks",
    icon: Target,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Complete tasks and verify tasks",
  },
};

export default function Waitlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<WaitlistTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        // Load tasks without progress if not authenticated
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/waitlist/tasks`
        );
        setProgressData({
          tasks: response.data.map((task: WaitlistTask) => ({
            ...task,
            userProgress: {
              status: "not_started",
              progress: 0,
              completedAt: null,
            },
          })),
          overallProgress: 0,
          completedCount: 0,
          totalCount: response.data.length,
          points: 0,
          activityLevel: 0,
          referralCount: 0,
        });
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/waitlist/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProgressData(response.data);
    } catch (error) {
      console.error("Error loading progress:", error);
      toast({
        title: "Error",
        description: "Failed to load waitlist progress",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyTask = async (taskId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to verify tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      setVerifying(taskId);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/waitlist/tasks/${taskId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Task Completed!",
          description: response.data.message,
        });
        await loadProgress();
      } else {
        toast({
          title: "Task Not Complete",
          description: response.data.message || "Keep working on this task",
        });
        await loadProgress();
      }
    } catch (error) {
      console.error("Error verifying task:", error);
      toast({
        title: "Verification Failed",
        description:
          (typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof (error as any).response?.data?.message === "string"
            ? (error as any).response.data.message
            : "Failed to verify task"),
        variant: "destructive",
      });
    } finally {
      setVerifying(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "in_progress":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const groupTasksByCategory = (tasks: WaitlistTask[]) => {
    const grouped: Record<string, WaitlistTask[]> = {};
    tasks.forEach((task) => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-background">
        {/* <LandingNavbar /> */}
        <div className="pt-24 pb-12 text-center">
          <p className="text-muted-foreground">No tasks available</p>
        </div>
      </div>
    );
  }

  const groupedTasks = groupTasksByCategory(progressData.tasks);
  const categoryOrder = ["mvp-scope"];

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="md:flex justify-between mb-6 w-full space-y-4 md:space-y-0 ">
            {/* Total Points */}
            <div className="border-2 border-gray-50 shadow-sm rounded-xl flex items-center gap-4 px-3 py-5 md:w-[30%] ">
              <div className="p-2 rounded-full shadow-sm  ">
                <LiaCoinsSolid className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <span className="text-3xl font-semibold">
                  {progressData.points ?? 0}
                </span>
                <p className="text-muted-foreground text-[13px]">
                  Total Points
                </p>
              </div>
            </div>

            {/* Activity Level */}
            <div className="border-2 border-gray-50 shadow-sm rounded-xl flex items-center gap-4 px-3 py-5 md:w-[30%] ">
              <div className="p-2 rounded-full shadow-sm  ">
                <LuSquareActivity className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <span className="text-3xl font-semibold">
                  {progressData.activityLevel ?? 0}
                </span>
                <p className="text-muted-foreground text-[13px]">
                  Activity Level
                </p>
              </div>
            </div>

            {/* Total Referrals */}
            <div className="border-2 border-gray-50 shadow-sm rounded-xl flex items-center gap-4 px-3 py-5 md:w-[30%] ">
              <div className="p-2 rounded-full shadow-sm  ">
                <FiUsers className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <span className="text-3xl font-semibold">
                  {progressData.referralCount ?? 0}
                </span>
                <p className="text-muted-foreground text-[13px]">
                  Total Referrals
                </p>
              </div>
            </div>
          </div>

          {/* Tasks by Category */}
          {categoryOrder.map((category) => {
            const tasks = groupedTasks[category] || [];
            if (tasks.length === 0) return null;

            const categoryInfo =
              categoryConfig[category as keyof typeof categoryConfig];
            const CategoryIcon = categoryInfo.icon;
            const categoryCompleted = tasks.filter(
              (t) => t.userProgress?.status === "completed"
            ).length;
            const categoryProgress =
              tasks.length > 0
                ? Math.round((categoryCompleted / tasks.length) * 100)
                : 0;

            // Group by subcategory if exists
            const subcategoryGroups: Record<string, WaitlistTask[]> = {};
            tasks.forEach((task) => {
              const key = task.subcategory || "general";
              if (!subcategoryGroups[key]) {
                subcategoryGroups[key] = [];
              }
              subcategoryGroups[key].push(task);
            });

            return (
              <div key={category} className="mb-8">
                <Card className="border-0">
                  <CardContent className="p-0 border-0">
                    <div className="space-y-6">
                      {Object.entries(subcategoryGroups).map(
                        ([subcategory, subTasks]) => (
                          <div key={subcategory}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                              {subTasks.map((task) => {
                                const status =
                                  task.userProgress?.status || "not_started";
                                const progress =
                                  task.userProgress?.progress || 0;
                                const isCompleted = status === "completed";
                                const isVerifying = verifying === task.taskId;

                                return (
                                  <Card
                                    key={task._id}
                                    className={`relative transition-all ${
                                      isCompleted
                                        ? "border-green-500/50 bg-green-500/5"
                                        : "hover:border-primary/50"
                                    }`}
                                  >
                                    {isCompleted && (
                                      <div className="absolute -top-2 -right-2 z-10">
                                        <Badge className="bg-green-600 text-white">
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Complete
                                        </Badge>
                                      </div>
                                    )}

                                    <CardHeader>
                                      <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg">
                                          {task.title}
                                        </CardTitle>
                                        {getStatusIcon(status)}
                                      </div>
                                      <CardDescription>
                                        {task.description}
                                      </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                      {task.requiredValue && (
                                        <div className="text-sm text-muted-foreground">
                                          Required: {task.requiredValue}+
                                        </div>
                                      )}

                                      {status === "completed" &&
                                        task.userProgress?.completedAt && (
                                          <div className="text-xs text-muted-foreground">
                                            Completed:{" "}
                                            {new Date(
                                              task.userProgress.completedAt
                                            ).toLocaleDateString()}
                                          </div>
                                        )}
                                    </CardContent>

                                    <div className="px-6 pb-6 space-y-2">
                                      <div className="flex justify-between gap-4 ">
                                        <Button
                                          className=" mb-4 bg-gradient-hero
                                        "
                                          onClick={() => {
                                            setSelectedTask(task);
                                            setModalOpen(true);
                                          }}
                                          disabled={isCompleted}
                                        >
                                          <Play className="h-4 w-4 mr-2" />
                                          Complete Task
                                        </Button>
                                        <Button
                                          variant={
                                            isCompleted ? "outline" : "default"
                                          }
                                          className="w-full"
                                          onClick={() =>
                                            verifyTask(task.taskId)
                                          }
                                          disabled={isVerifying || isCompleted}
                                        >
                                          {isVerifying ? (
                                            <>
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                              Verifying...
                                            </>
                                          ) : isCompleted ? (
                                            <>
                                              <CheckCircle2 className="h-4 w-4 mr-2" />
                                              Completed
                                            </>
                                          ) : (
                                            <>
                                              <RefreshCw className="h-4 w-4 mr-2" />
                                              Verify
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Empty State */}
          {progressData.tasks.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Tasks Available
                </h3>
                <p className="text-muted-foreground">
                  Check back soon to earn points!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) {
              setSelectedTask(null);
              loadProgress(); // Refresh progress when modal closes
            }
          }}
          onComplete={() => {
            loadProgress(); // Refresh progress after task completion
          }}
        />
      )}
    </div>
  );
}
