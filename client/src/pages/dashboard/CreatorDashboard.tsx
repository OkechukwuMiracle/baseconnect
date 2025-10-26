import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

// Define the Task interface to match TaskCardProps
interface Task {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  reward: string;
  status: "open" | "in_progress" | "completed";
  deadline: string;
  skills: string[];
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !user?.token) return;
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?creator=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setPostedTasks(Array.isArray(data) ? data : []);
    };
    load();
  }, [user?.id, user?.token]); // Added user?.token to dependency array

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Post and manage tasks</p>
          </div>
          <Link to="/create-task">
            <Button variant="hero" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Task
            </Button>
          </Link>
        </div>
        {postedTasks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postedTasks.map((t) => (
              <TaskCard 
                key={t.id || t._id} 
                id={t.id || t._id || ''} 
                {...t} 
              />
            ))}
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
