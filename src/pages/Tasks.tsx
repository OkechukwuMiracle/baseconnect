import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock data
const mockTasks = [
  {
    id: "1",
    title: "Create Social Media Graphics",
    description: "Design 5 Instagram posts for a tech startup. Must include brand colors and modern aesthetic.",
    reward: "0.05",
    deadline: "3 days",
    skills: ["Design", "Figma", "Social Media"],
    status: "open" as const,
  },
  {
    id: "2",
    title: "Write Blog Article",
    description: "Write a 1000-word article about Web3 trends in 2024. Must be SEO optimized and engaging.",
    reward: "0.08",
    deadline: "5 days",
    skills: ["Writing", "SEO", "Web3"],
    status: "open" as const,
  },
  {
    id: "3",
    title: "Smart Contract Audit",
    description: "Review and audit an ERC-20 token contract. Provide detailed security report.",
    reward: "0.25",
    deadline: "7 days",
    skills: ["Solidity", "Security", "Blockchain"],
    status: "in_progress" as const,
  },
  {
    id: "4",
    title: "Video Editing",
    description: "Edit a 5-minute promotional video. Add transitions, music, and captions.",
    reward: "0.1",
    deadline: "4 days",
    skills: ["Video Editing", "After Effects"],
    status: "open" as const,
  },
  {
    id: "5",
    title: "Data Entry Task",
    description: "Enter 500 product listings into a spreadsheet with proper formatting.",
    reward: "0.03",
    deadline: "2 days",
    skills: ["Data Entry", "Excel"],
    status: "completed" as const,
  },
  {
    id: "6",
    title: "Website Bug Fixes",
    description: "Fix 10 reported bugs on a React website. Testing required.",
    reward: "0.15",
    deadline: "6 days",
    skills: ["React", "JavaScript", "Testing"],
    status: "open" as const,
  },
];

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("reward");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Browse Tasks</h1>
            <p className="text-muted-foreground">Find tasks that match your skills and start earning</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reward">Highest Reward</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTasks
              .filter((task) => filterStatus === "all" || task.status === filterStatus)
              .filter((task) => 
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
