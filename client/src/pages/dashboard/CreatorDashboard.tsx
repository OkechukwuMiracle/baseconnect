import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

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

export default function CreatorDashboard() {
  const { user, loading } = useAuth();
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(true);

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

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">Creator Dashboard</h1>
            <p className="text-muted-foreground">Post and manage tasks</p>
          </div>
          <Link to="/create-task">
            <Button variant="hero" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Task
            </Button>
          </Link>
        </div>

        {/* Submissions Pending Review */}
        {postedTasks.some(t => t.hasSubmission) && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Tasks Awaiting Your Review
              </CardTitle>
              <CardDescription>
                Contributors have submitted work for the following tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {postedTasks
                  .filter(t => t.hasSubmission)
                  .map((t) => (
                    <div key={t.id || t._id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div>
                        <h4 className="font-semibold">{t.title}</h4>
                        <p className="text-sm text-muted-foreground">Reward: {t.reward} USDC</p>
                      </div>
                      <Link to={`/dashboard/creator/tasks/${t.id || t._id}/review`}>
                        <Button variant="hero" size="sm">
                          Review Submission
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Tasks */}
        {postedTasks.length ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Your Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postedTasks.map((t) => (
                <TaskCard key={t.id || t._id} id={t.id || t._id || ""} {...t} />
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No posted tasks</CardTitle>
              <CardDescription>Create a task to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/create-task">
                <Button variant="gradient">Create Task</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
