import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Wallet, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import axios from "axios";

export default function Dashboard() {
  const [myTasks, setMyTasks] = useState([]);
  const [postedTasks, setPostedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    // Replace with actual user ID or wallet address
    const userId = localStorage.getItem("userId");
    axios.get(`${import.meta.env.VITE_API_URL}/api/tasks?assignee=${userId}`)
      .then(res => setMyTasks(res.data))
      .catch(() => setMyTasks([]));
    axios.get(`${import.meta.env.VITE_API_URL}/api/tasks?creator=${userId}`)
      .then(res => setPostedTasks(res.data))
      .catch(() => setPostedTasks([]));
    axios.get(`${import.meta.env.VITE_API_URL}/api/tasks?assignee=${userId}&status=completed`)
      .then(res => setCompletedTasks(res.data))
      .catch(() => setCompletedTasks([]));
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Manage your tasks and track your earnings</p>
            </div>
            {/* <Link to="/create-task">
              <Button variant="hero" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Task
              </Button>
            </Link> */}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">0.15 ETH</div>
                <p className="text-xs text-muted-foreground mt-1">≈ $240 USD</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">2 as doer, 1 as creator</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">100% success rate</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tasks Tabs */}
          <Tabs defaultValue="my-tasks" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
              <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="posted">Posted Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-tasks" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Tasks I'm Working On</h2>
                {myTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTasks.map((task) => (
                      <TaskCard key={task.id} {...task} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No active tasks</CardTitle>
                      <CardDescription>
                        Browse available tasks to get started
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/tasks">
                        <Button variant="gradient">Browse Tasks</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="posted" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Tasks I've Posted</h2>
                {postedTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postedTasks.map((task) => (
                      <TaskCard key={task.id} {...task} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No posted tasks</CardTitle>
                      <CardDescription>
                        Create your first task to get help with your project
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/create-task">
                        <Button variant="gradient">Create Task</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} {...task} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
