import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, Coins, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, fetch based on task ID
const mockTask = {
  id: "1",
  title: "Create Social Media Graphics",
  description: "Design 5 Instagram posts for a tech startup. Must include brand colors and modern aesthetic. Looking for someone with experience in creating engaging social media content that drives engagement.",
  reward: "0.05",
  deadline: "3 days",
  skills: ["Design", "Figma", "Social Media"],
  status: "open" as const,
  creator: {
    address: "0x1234...5678",
    name: "TechStartup Inc",
    rating: 4.8,
  },
  createdAt: "2024-01-15",
  applicants: 3,
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState("");

  const handleApply = () => {
    toast({
      title: "Application Submitted!",
      description: "The task creator will review your application.",
    });
  };

  const handleSubmit = () => {
    if (!submission.trim()) {
      toast({
        title: "Submission Required",
        description: "Please provide details of your completed work.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Work Submitted!",
      description: "The task creator will review your submission.",
    });
    setSubmission("");
  };

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
                      <CardTitle className="text-3xl mb-2">{mockTask.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mockTask.skills.map((skill) => (
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
                      {mockTask.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {mockTask.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="font-semibold text-primary">{mockTask.reward} ETH</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="font-semibold">{mockTask.deadline}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Posted</p>
                        <p className="font-semibold">{mockTask.createdAt}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Applicants</p>
                        <p className="font-semibold">{mockTask.applicants}</p>
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
                    <p className="font-semibold mb-1">{mockTask.creator.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {mockTask.creator.address}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < Math.floor(mockTask.creator.rating) ? "text-amber-500" : "text-muted"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {mockTask.creator.rating}/5
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
                    <span className="font-medium">{mockTask.reward} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="font-medium">
                      {(parseFloat(mockTask.reward) * 0.1).toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">You'll Receive:</span>
                    <span className="font-bold text-primary">
                      {(parseFloat(mockTask.reward) * 0.9).toFixed(4)} ETH
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
