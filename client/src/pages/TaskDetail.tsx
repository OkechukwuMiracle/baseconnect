import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, Coins, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import axios from "axios";

type Creator = {
  name?: string;
  address?: string;
  rating?: number;
};

type Task = {
  id?: string;
  title: string;
  skills?: string[];
  status?: string;
  description?: string;
  reward: string | number;
  deadline?: string;
  createdAt?: string;
  applicants?: number;
  creator?: Creator | string;
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = React.useState<Task | null>(null);
  const [submission, setSubmission] = React.useState("");

  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`)
      .then(res => setTask(res.data))
      .catch(() => setTask(null));
  }, [id]);

  const handleApply = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/${id}/apply`, { userId });
      toast({
        title: "Application Submitted!",
        description: "The task creator will review your application.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to apply for task.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!submission.trim()) {
      toast({
        title: "Submission Required",
        description: "Please provide details of your completed work.",
        variant: "destructive",
      });
      return;
    }
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/${id}/submit`, { userId, submission });
      toast({
        title: "Work Submitted!",
        description: "The task creator will review your submission.",
      });
      setSubmission("");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit work.",
        variant: "destructive",
      });
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">Loading task...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/tasks")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">{task.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {task.skills && task.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-muted text-muted-foreground whitespace-nowrap"
                    >
                      {task.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="font-semibold text-primary">{task.reward} ETH</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="font-semibold">{task.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Posted</p>
                        <p className="font-semibold">{task.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Applicants</p>
                        <p className="font-semibold">{task.applicants || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Submission Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Work</CardTitle>
                  <CardDescription>
                    Provide details and proof of your completed work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="submission">Work Details</Label>
                    <Textarea
                      id="submission"
                      placeholder="Describe what you've completed and provide links to deliverables..."
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <Button 
                    variant="gradient" 
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    Submit Work for Review
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Creator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1">
                      {typeof task.creator === "string" ? task.creator : task.creator?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {task.creator && typeof task.creator !== "string" ? task.creator.address || "N/A" : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        const rating = typeof task.creator === "string" ? 0 : task.creator?.rating ?? 0;
                        return (
                          <span
                            key={i}
                            className={i < Math.floor(rating) ? "text-amber-500" : "text-muted"}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {typeof task.creator === "string" ? 0 : task.creator?.rating || 0}/5
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Task Reward:</span>
                    <span className="font-medium">{task.reward} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="font-medium">
                      {(Number(task.reward) * 0.1).toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">You'll Receive:</span>
                    <span className="font-bold text-primary">
                      {(Number(task.reward) * 0.9).toFixed(4)} ETH
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleApply}
              >
                Apply for Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
