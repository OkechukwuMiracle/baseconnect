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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { baseSepolia } from "viem/chains"; //  ensure you import your chain
import { BaseflowTasksUSDCABI } from "@/config/BaseflowTasksUSDCABI";

type Submission = {
  _id: string;
  content: string;
  contributor: {
    _id: string;
    name: string;
    email: string;
    address: string;
    rating: number;
  };
  createdAt: string;
  status: string;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  reward: number;
  status: string;
  hasSubmission: boolean;
  blockchainTaskId?: number;
};

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined;

export default function TaskSubmissionReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { address, isConnected, chain } = useAccount();

  const [task, setTask] = useState<Task | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const USDC_DECIMALS = 6;

  const { writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash ?? undefined,
    });

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (isConfirmed && txHash) handleApprovalSuccess(txHash);
  }, [isConfirmed, txHash]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view submissions.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const taskRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask(taskRes.data);

      try {
        const submissionRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tasks/${id}/submission`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmission(submissionRes.data);
      } catch (err) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as any).response === "object" &&
          (err as any).response?.status === 404
        ) {
          setSubmission(null);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "Error",
        description: "Failed to load submission details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalSuccess = async (transactionHash: `0x${string}`) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/approve-submission`,
        {
          submissionId: submission?._id,
          transactionHash,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Success!",
        description: "Payment released to contributor successfully.",
      });

      navigate("/dashboard/creator");
    } catch (err) {
      console.error("Approval error:", err);
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to release payment.",
        variant: "destructive",
      });
      return;
    }

    if (!submission || !task) return;

    if (
      !submission.contributor.address ||
      submission.contributor.address === "Not connected"
    ) {
      toast({
        title: "Invalid Contributor Address",
        description: "Contributor must connect their wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!CONTRACT_ADDRESS) {
      toast({
        title: "Configuration Error",
        description:
          "Smart contract not deployed. Approving without blockchain.",
        variant: "destructive",
      });
      setIsProcessing(true);
      await handleApprovalSuccess(("0x" + "0".repeat(64)) as `0x${string}`);
      return;
    }

    try {
      setIsProcessing(true);
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: BaseflowTasksUSDCABI,
        functionName: "completeTask",
        args: [
          BigInt(task.blockchainTaskId ?? 1),
          submission.contributor.address as `0x${string}`,
        ],
        chain: chain ?? baseSepolia, //  REQUIRED in wagmi v2.18.2
        account: address, //  REQUIRED in wagmi v2.18.2
      });
      setTxHash(hash);
    } catch (err) {
      console.error("Approve error:", err);
      let message = "Transaction failed.";
      if (err && typeof err === "object") {
        if ("shortMessage" in err && typeof err.shortMessage === "string") {
          message = err.shortMessage;
        } else if ("message" in err && typeof err.message === "string") {
          message = err.message;
        } else if (err instanceof Error && err.message) {
          message = err.message;
        }
      } else if (typeof err === "string") {
        message = err;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reviewNote.trim()) {
      toast({
        title: "Review Note Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/reject-submission`,
        { submissionId: submission?._id, reviewNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Submission Rejected",
        description: "The contributor has been notified.",
      });

      navigate("/dashboard/creator");
    } catch (err) {
      console.error("Reject error:", err);
      toast({
        title: "Error",
        description: "Failed to reject submission.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {/* <Navbar /> */}
        <p className="text-muted-foreground mt-12">Loading submission...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Navbar /> */}
        <div className="pt-24 pb-12 md:px-4">
          <div className="container mx-auto max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/creator")}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Submission Yet
                </h3>
                <p className="text-muted-foreground">
                  The assigned contributor hasn't submitted their work yet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // const platformFee = task ? (task.reward * 0.1).toFixed(4) : "0";
  // const contributorReward = task ? (task.reward * 0.9).toFixed(4) : "0";

  const platformFee = task ? (task.reward * 0.1).toFixed(2) : "0"; // Changed to 2 decimals for USDC
  const contributorReward = task ? (task.reward * 0.9).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <div className="pt-24 pb-12 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/creator")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Review Submission</h1>
            <p className="text-muted-foreground">
              Review the work submitted by the contributor
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{task?.title}</CardTitle>
                  <CardDescription>{task?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{task?.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Reward: {task?.reward} ETH
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Submitted Work</CardTitle>
                    <Badge variant="secondary">
                      <FileText className="mr-2 h-4 w-4" />
                      {submission.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Submitted on{" "}
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {submission.content}
                  </div>
                </CardContent>
              </Card>

              {submission.status === "pending" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Actions</CardTitle>
                    <CardDescription>
                      Approve to release payment or reject to request revisions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reviewNote">
                        Rejection Note (optional)
                      </Label>
                      <Textarea
                        id="reviewNote"
                        placeholder="Provide feedback if rejecting..."
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={4}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="hero"
                        className="flex-1"
                        onClick={handleApprove}
                        disabled={isProcessing || isConfirming}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {isConfirming || isProcessing
                          ? "Processing..."
                          : "Approve & Pay"}
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleReject}
                        disabled={isProcessing || isConfirming}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Request Revisions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contributor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {submission.contributor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {submission.contributor.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.floor(submission.contributor.rating)
                              ? "text-amber-500"
                              : "text-muted"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {submission.contributor.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="p-2 bg-muted rounded-md break-all">
                    <p className="text-xs text-muted-foreground mb-1">
                      Wallet Address:
                    </p>
                    <p className="text-xs font-mono">
                      {submission.contributor.address || "Not connected"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Task Reward:</span>
                    <span className="font-medium">{task?.reward} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Platform Fee (10%):
                    </span>
                    <span className="font-medium">{platformFee} ETH</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">Contributor Receives:</span>
                    <span className="font-bold text-primary">
                      {contributorReward} ETH
                    </span>
                  </div>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader>
                  <CardTitle>Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Task Reward:</span>
                    <span className="font-medium">${task?.reward} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Platform Fee (10%):
                    </span>
                    <span className="font-medium">${platformFee} USDC</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">Contributor Receives:</span>
                    <span className="font-bold text-primary">
                      ${contributorReward} USDC
                    </span>
                  </div>
                </CardContent>
              </Card>

              {!isConnected && (
                <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-6">
                    <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Connect your wallet to release payment
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
