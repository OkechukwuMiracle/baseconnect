import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

// Update the Task interface to match TaskCardProps
interface Task {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  reward: string; // Changed from number to string to match TaskCardProps
  status: "open" | "in_progress" | "completed"; // Made required and specific
  deadline: string; // Added required property
  skills: string[]; // Added required property
}

export default function ContributorDashboard() {
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const base = `${import.meta.env.VITE_API_URL}`;
      const headers: HeadersInit = { 
        Authorization: `Bearer ${user?.token}` 
      };
      
      const [a, b] = await Promise.all([
        fetch(`${base}/api/tasks?assignee=${user?.id}`, { headers }),
        fetch(`${base}/api/tasks?assignee=${user?.id}&status=completed`, { headers }),
      ]);
      
      setMyTasks(await a.json());
      setCompleted(await b.json());
    };
    
    if (user?.id && user?.token) {
      load();
    }
  }, [user?.id, user?.token]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contributor Dashboard</h1>
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Active Tasks</h2>
            {myTasks.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTasks.map((t) => (
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
                  <CardTitle>No active tasks</CardTitle>
                  <CardDescription>Browse tasks and accept one to start</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Link to browse tasks */}
                </CardContent>
              </Card>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Completed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map((t) => (
                <TaskCard 
                  key={(t.id || t._id) + "c"} 
                  id={t.id || t._id || ''} 
                  {...t} 
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}