import { useState, useEffect } from "react";
// import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc, Loader2 } from "lucide-react";
import axios from "axios";

interface Task {
  _id: string;
  id?: string;
  title: string;
  description: string;
  reward: number;
  status: string;
  deadline: string;
  createdAt: string;
  tags?: string[];
  applicants?: number;
  hasSubmission?: boolean;
}

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: string;
  skills: string[];
  status: "open" | "in_progress" | "completed";
  applicants?: number;
  hasSubmission?: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      
      console.log('Fetching tasks from:', `${import.meta.env.VITE_API_URL}/api/tasks`);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`
      );
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Number of tasks:', response.data?.length);
      
      setTasks(response.data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Map backend status to frontend status
  const mapStatus = (status: string): "open" | "in_progress" | "completed" => {
    if (status === "pending") return "open";
    if (status === "in-progress") return "in_progress";
    if (status === "completed") return "completed";
    return "open";
  };

  // Filter tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Status filter
      if (filterStatus !== "all") {
        const mappedStatus = mapStatus(task.status);
        if (mappedStatus !== filterStatus) return false;
      }

      // Category filter (by tags)
      if (filterCategory !== "all") {
        if (!task.tags || !task.tags.some(tag => 
          tag.toLowerCase().includes(filterCategory.toLowerCase())
        )) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    })
    // Sort tasks
    .sort((a, b) => {
      switch (sortBy) {
        case "reward":
          return b.reward - a.reward; // Highest first
        case "reward-low":
          return a.reward - b.reward; // Lowest first
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); // Earliest first
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Oldest first
        case "applicants":
          return (b.applicants || 0) - (a.applicants || 0); // Most applicants first
        default:
          return 0;
      }
    });

  // Format task for TaskCard component
  const formatTask = (task: Task): TaskCardProps => ({
    id: task._id || task.id || "",
    title: task.title,
    description: task.description,
    reward: task.reward.toString(),
    deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A",
    skills: task.tags || [],
    status: mapStatus(task.status),
    applicants: task.applicants,
    hasSubmission: task.hasSubmission,
  });

  // Get unique categories from all tasks
  const categories = Array.from(
    new Set(
      tasks.flatMap(task => task.tags || [])
        .filter(tag => tag && tag.length > 0)
    )
  ).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      
      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
              Explore Tasks
            </h1>
            <p className="text-muted-foreground">
              Find tasks that match your skills and start earning
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Tasks</CardDescription>
                <CardTitle className="text-2xl">{tasks.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Open Tasks</CardDescription>
                <CardTitle className="text-2xl">
                  {tasks.filter(t => t.status === "pending").length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="text-2xl">
                  {tasks.filter(t => t.status === "in-progress").length}
                </CardTitle>
              </CardHeader>
            </Card>
            {/* <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Rewards</CardDescription>
                <CardTitle className="text-2xl">
                  {tasks.reduce((sum, t) => sum + t.reward, 0).toFixed(2)} ETH
                </CardTitle>
              </CardHeader>
            </Card> */}
          </div>
          
          {/* Filters & Search */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Filter & Sort Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, description, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          Open
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                          In Progress
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                          Completed
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="reward">Highest Reward</SelectItem>
                    <SelectItem value="reward-low">Lowest Reward</SelectItem>
                    <SelectItem value="deadline">Earliest Deadline</SelectItem>
                    <SelectItem value="applicants">Most Applicants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Filter by Category:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={filterCategory === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFilterCategory("all")}
                    >
                      All
                    </Badge>
                    {categories.slice(0, 10).map((category) => (
                      <Badge
                        key={category}
                        variant={filterCategory === category ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setFilterCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters Summary */}
              {(searchQuery || filterStatus !== "all" || filterCategory !== "all") && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                      setFilterCategory("all");
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading tasks...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredTasks.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Tasks Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== "all" || filterCategory !== "all"
                    ? "Try adjusting your filters or search query"
                    : "No tasks have been posted yet. Check back soon!"}
                </p>
                {(searchQuery || filterStatus !== "all" || filterCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                      setFilterCategory("all");
                    }}
                    className="text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Task Grid */}
          {!loading && filteredTasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard key={task._id || task.id} {...formatTask(task)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}