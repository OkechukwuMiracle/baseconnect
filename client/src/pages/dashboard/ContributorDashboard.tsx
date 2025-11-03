import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  reward: number;
  status: string;
  deadline: string;
  tags?: string[];
  applicants?: number;
  hasSubmission?: boolean;
}

interface Submission {
  _id: string;
  task: string;
  status: string;
  reviewNote?: string;
}

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: string;
  skills: string[];
  status: "open" | "in_progress" | "completed";
  needsRevision?: boolean;
  reviewNote?: string;
}

export default function ContributorDashboard() {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const baseURL = import.meta.env.VITE_API_URL;

        // Fetch all available tasks (status: pending)
        const availableRes = await axios.get(
          `${baseURL}/api/tasks?status=pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch tasks assigned to this contributor
        const myTasksRes = await axios.get(
          `${baseURL}/api/tasks?assignee=${userId}&status=in-progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch completed tasks
        const completedRes = await axios.get(
          `${baseURL}/api/tasks?assignee=${userId}&status=completed`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAvailableTasks(availableRes.data || []);
        
        const myTasksData = myTasksRes.data || [];
        setMyTasks(myTasksData);

        // 🔥 Fetch submission status for each active task
        const submissionsMap: Record<string, Submission> = {};
        for (const task of myTasksData) {
          try {
            const subRes = await axios.get(
              `${baseURL}/api/tasks/${task._id}/my-submission`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            submissionsMap[task._id] = subRes.data;
          } catch (err) {
            // No submission yet, that's fine
            if (err.response?.status !== 404) {
              console.error(`Error fetching submission for task ${task._id}:`, err);
            }
          }
        }
        setSubmissions(submissionsMap);

        setCompletedTasks(completedRes.data || []);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  const filteredTasks = availableTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTaskForCard = (task: Task): TaskCardProps => {
    let status: "open" | "in_progress" | "completed" = "open";
    
    if (task.status === "pending") {
      status = "open";
    } else if (task.status === "in-progress") {
      status = "in_progress";
    } else if (task.status === "completed") {
      status = "completed";
    }

    // 🔥 Check if this task has a rejected submission
    const submission = submissions[task._id || task.id || ""];
    const needsRevision = submission?.status === 'rejected';

    return {
      id: task._id || task.id || "",
      title: task.title,
      description: task.description,
      reward: task.reward.toString(),
      deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A",
      skills: task.tags || [],
      status,
      needsRevision,
      reviewNote: submission?.reviewNote,
    };
  };

  // Count tasks needing revision
  const revisionsNeeded = myTasks.filter(
    task => submissions[task._id || ""]?.status === 'rejected'
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 container mx-auto">
          <p className="text-center text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">Contributor Dashboard</h1>
          <p className="text-muted-foreground">
            View available tasks, manage your active work, and track completed projects
          </p>
        </div>

        {/*  Revision Alert Banner */}
        {revisionsNeeded > 0 && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                {revisionsNeeded} Task{revisionsNeeded !== 1 ? 's' : ''} Need{revisionsNeeded === 1 ? 's' : ''} Revision
              </CardTitle>
              <CardDescription>
                Review the feedback and resubmit your work
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="available">
              Available ({filteredTasks.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Active ({myTasks.length})
              {revisionsNeeded > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {revisionsNeeded}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id || task.id} {...formatTaskForCard(task)} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Available Tasks</CardTitle>
                  <CardDescription>
                    {searchQuery
                      ? "No tasks match your search. Try different keywords."
                      : "Check back later for new tasks to work on."}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active">
            {myTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTasks.map((task) => (
                  <TaskCard key={task._id || task.id} {...formatTaskForCard(task)} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Tasks</CardTitle>
                  <CardDescription>
                    Browse available tasks and apply to start working
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTasks.map((task) => (
                  <TaskCard key={task._id || task.id} {...formatTaskForCard(task)} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Completed Tasks Yet</CardTitle>
                  <CardDescription>
                    Completed tasks will appear here once you finish your work
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {completedTasks.reduce((sum, task) => sum + (task.reward || 0), 0).toFixed(4)} ETH
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedTasks.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {myTasks.length + completedTasks.length > 0
                  ? Math.round((completedTasks.length / (myTasks.length + completedTasks.length)) * 100)
                  : 0}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}