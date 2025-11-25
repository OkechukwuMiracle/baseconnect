import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, Coins, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";

type Creator = {
  name?: string;
  address?: string;
  rating?: number;
};

type Task = {
  id?: string;
  _id?: string;
  title: string;
  tags?: string[];
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
  const { user } = useAuth();
  const [task, setTask] = React.useState<Task | null>(null);
  const [submission, setSubmission] = React.useState("");
  const [hasApplied, setHasApplied] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          }
        );
        console.log("Task data:", res.data);
        console.log("Creator data:", res.data.creator);
        setTask(res.data);
      } catch (err) {
        console.error("Error fetching task:", err);
        if (err.response?.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in to view this task.",
            variant: "destructive",
          });
          navigate("/login");
        } else {
          toast({
            title: "Error",
            description: "Failed to load task details.",
            variant: "destructive",
          });
        }
      }
    };

    fetchTask();
  }, [id, toast, navigate]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for tasks.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (user.role !== "contributor") {
      toast({
        title: "Access Denied",
        description: "Only contributors can apply for tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/apply`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setHasApplied(true);
      toast({
        title: "Application Submitted!",
        description: "The task creator will review your application.",
      });

      // Refresh task data to update applicants count
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setTask(res.data);
    } catch (err) {
      console.error("Apply error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to apply for task.",
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

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit work.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/submit`,
        { userId, submission },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast({
        title: "Work Submitted!",
        description: "The task creator will review your submission.",
      });
      setSubmission("");

      // Refresh task data
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setTask(res.data);
    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit work.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {/* <Navbar /> */}
        <p className="text-muted-foreground mt-12">Loading task...</p>
      </div>
    );
  }

  const creatorName =
    typeof task.creator === "string"
      ? task.creator
      : task.creator?.name || "Unknown Creator";

  const creatorAddress =
    typeof task.creator === "string"
      ? "N/A"
      : task.creator?.address || "N/A";

  const creatorRating =
    typeof task.creator === "string" ? 0 : task.creator?.rating ?? 0;

  const isCreator = user?.role === "creator";
  const isContributor = user?.role === "contributor";
  const taskId = task._id || task.id;

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(isCreator ? "/dashboard/creator" : "/dashboard/contributor")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">
                        {task.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {task.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
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
                        <p className="font-semibold text-primary">
                          {task.reward} USDC
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Deadline
                        </p>
                        <p className="font-semibold">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Posted</p>
                        <p className="font-semibold">
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Applicants
                        </p>
                        <p className="font-semibold">{task.applicants || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isContributor && (
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
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Work for Review"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Creator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg mb-2">{creatorName}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(creatorRating)
                                ? "text-amber-500"
                                : "text-muted"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {creatorRating.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="p-2 bg-muted rounded-md break-all">
                      <p className="text-xs text-muted-foreground mb-1">
                        Wallet Address:
                      </p>
                      <p className="text-xs font-mono">{creatorAddress}</p>
                    </div>
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
                    <span className="font-medium">{task.reward} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="font-medium">
                      {(Number(task.reward) * 0.1).toFixed(4)} USDC
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">You'll Receive:</span>
                    <span className="font-bold text-primary">
                      {(Number(task.reward) * 0.9).toFixed(4)} USDC
                    </span>
                  </div>
                </CardContent>
              </Card>

              {isContributor && (
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleApply}
                  disabled={hasApplied}
                >
                  {hasApplied ? "Applied ✓" : "Apply for Task"}
                </Button>
              )}

              {isCreator && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(`/dashboard/creator/tasks/${taskId}/applicants`)}
                >
                  View Applicants
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




