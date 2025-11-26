import { useState, useEffect } from "react";
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
import { ArrowLeft, User, Mail, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

type Applicant = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  rating: number;
  appliedAt: string;
  address?: string;
};

type Task = {
  _id: string;
  title: string;
  status: string;
  applicants?: number;
};

export default function TaskApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view applicants.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        console.log("Fetching task and applicants for task ID:", id);
        
        // Fetch task details
        const taskRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
          }
        );
        console.log("Task data:", taskRes.data);
        setTask(taskRes.data);

        // Fetch applicants with cache disabled
        const applicantsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tasks/${id}/applicants`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            params: {
              // Add timestamp to prevent caching
              _t: new Date().getTime()
            }
          }
        );
        
        console.log("Applicants response:", applicantsRes.data);
        console.log("Number of applicants:", applicantsRes.data.length);
        
        setApplicants(applicantsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        console.error("Error response:", err.response?.data);
        
        if (err.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "Only task creators can view applicants.",
            variant: "destructive",
          });
          navigate("/dashboard/creator");
        } else if (err.response?.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate("/");
        } else {
          toast({
            title: "Error",
            description: "Failed to load applicants. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, toast, navigate]);

  const handleAcceptApplicant = async (applicantId: string) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/accept`,
        { applicantId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Applicant Accepted!",
        description: "The contributor has been notified and assigned to the task.",
      });

      navigate("/dashboard/creator");
    } catch (err) {
      console.error("Accept error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to accept applicant.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {/* <Navbar /> */}
        <p className="text-muted-foreground mt-12">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(`/tasks/${id}`)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {task && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{task.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  {applicants.length} {applicants.length === 1 ? "applicant" : "applicants"}
                </span>
              </div>
            </div>
          )}

          {applicants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Applicants Yet</h3>
                <p className="text-muted-foreground">
                  Check back later for applicants to this task.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <Card key={applicant.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{applicant.name || "Anonymous"}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          {applicant.email}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{applicant.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {applicant.bio && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {applicant.bio}
                      </p>
                    )}
                    {applicant.address && (
                      <div className="p-2 bg-muted rounded-md mb-4 break-all">
                        <p className="text-xs text-muted-foreground mb-1">
                          Wallet Address:
                        </p>
                        <p className="text-xs font-mono">{applicant.address}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // View profile functionality - to be implemented
                            toast({
                              title: "Coming Soon",
                              description: "Profile view feature is under development.",
                            });
                          }}
                        >
                          View Profile
                        </Button> */}
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => handleAcceptApplicant(applicant.id)}
                        >
                          Accept Applicant
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}