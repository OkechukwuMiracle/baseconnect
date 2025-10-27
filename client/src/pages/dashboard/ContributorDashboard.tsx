import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
}

export default function ContributorDashboard() {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch tasks assigned to this contributor
        const myTasksRes = await axios.get(
          `${baseURL}/api/tasks?assignee=${userId}&status=in-progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch completed tasks
        const completedRes = await axios.get(
          `${baseURL}/api/tasks?assignee=${userId}&status=completed`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAvailableTasks(availableRes.data || []);
        setMyTasks(myTasksRes.data || []);
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

    return {
      id: task._id || task.id || "",
      title: task.title,
      description: task.description,
      reward: task.reward.toString(),
      deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A",
      skills: task.tags || [],
      status,
    };
  };

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
          <h1 className="text-4xl font-bold mb-2">Contributor Dashboard</h1>
          <p className="text-muted-foreground">
            Browse available tasks, manage your active work, and track completed projects
          </p>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="available">
              Available ({filteredTasks.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({myTasks.length})
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