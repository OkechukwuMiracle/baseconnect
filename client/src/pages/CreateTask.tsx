import { useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Wallet, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CreateTask() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    reward: "",
    deadline: "",
    skills: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refresh } = useAuth();
  const { address, isConnected } = useAccount(); //  Get wallet connection status

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  Check wallet connection
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a task.",
        variant: "destructive",
      });
      return;
    }

    try {
      const creator = user?.id || localStorage.getItem("userId");
      const token = user?.token || localStorage.getItem("token");

      const payload = {
        title: formData.title,
        description: formData.description,
        status: "pending",
        creator,
        reward: Number(formData.reward),
        deadline: new Date(formData.deadline).toISOString(),
        tags: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (typeof refresh === "function") {
        await refresh();
      }

      toast({
        title: "Task Created Successfully!",
        description: "Your task has been posted and is now visible to task doers.",
      });

      navigate("/dashboard/creator");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/creator")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/*  Wallet Connection Alert */}
          {!isConnected && (
            <Card className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <AlertCircle className="h-5 w-5" />
                  Wallet Connection Required
                </CardTitle>
                <CardDescription className="text-amber-800 dark:text-amber-200">
                  You must connect your wallet to create and fund a task on the blockchain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ConnectButton />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className={!isConnected ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-3xl">Create a New Task</CardTitle>
              <CardDescription>
                Post a task and let talented individuals help you complete it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Create Social Media Graphics"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the task, requirements, and deliverables..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    required
                    disabled={!isConnected}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      disabled={!isConnected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="data">Data Entry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward (USDC)</Label>
                    <Input
                      id="reward"
                      type="number"
                      step="0.001"
                      placeholder="0.05"
                      value={formData.reward}
                      onChange={(e) =>
                        setFormData({ ...formData, reward: e.target.value })
                      }
                      required
                      disabled={!isConnected}
                    />
                    <p className="text-xs text-muted-foreground">
                      10% platform fee will be deducted
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    required
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., Figma, Design, Social Media (comma separated)"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    disabled={!isConnected}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Payment Summary</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Task Reward:</span>
                      <span className="font-medium">
                        {formData.reward || "0"} USDC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Platform Fee (10%):
                      </span>
                      <span className="font-medium">
                        {(parseFloat(formData.reward || "0") * 0.1).toFixed(4)} USDC
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total to Escrow:</span>
                      <span className="font-bold text-primary">
                        {formData.reward || "0"} USDC
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={!isConnected}
                >
                  {!isConnected ? (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet to Create Task
                    </>
                  ) : (
                    "Create Task & Fund Escrow"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}