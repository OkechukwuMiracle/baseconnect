import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import USDCLogo from "@/assets/usdc-logo.png";


// USDC config (Base testnet address used in other page)
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`;
const ERC20_BALANCE_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];
const USDC_DECIMALS = 6;

export default function CreateTask() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    reward: "",
    deadline: "",
    skills: "",
    duration: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refresh } = useAuth();
  const { address, isConnected } = useAccount();
  const { data: usdcBalanceRaw } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --------------------------
  // FIXED HANDLE SUBMIT
  // --------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a task.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      // check USDC balance sufficiency
      const reward = parseFloat(formData.reward || '0');
      const balance = usdcBalanceRaw ? Number(usdcBalanceRaw.toString()) / 10 ** USDC_DECIMALS : 0;
      if (reward > balance) {
        toast({ title: 'Insufficient balance', description: `Your wallet balance (${balance.toFixed(4)} USDC) is lower than the task reward (${reward} USDC).`, variant: 'destructive' });
        return;
      }
      const creator = user?.id || localStorage.getItem("userId");
      const token = user?.token || localStorage.getItem("token");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("reward", formData.reward);
      data.append("deadline", new Date(formData.deadline).toISOString());
      data.append("duration", formData.duration);
      data.append("creator", creator || "");

      const tagsArray = formData.skills
        ? formData.skills.split(",").map((s) => s.trim())
        : [];

      data.append("tags", JSON.stringify(tagsArray));

      if (file) {
        data.append("attachment", file);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
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
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------
  // COMPONENT RETURN (FIXED)
  // --------------------------
  return (
    <div className=" ">
      <div>
        <div>
          <div>
            <CardHeader className="px-0 md:p-6">
              <CardTitle className="text-2xl font-bold">Create Task</CardTitle>
              <CardDescription className="text-muted-foreground ">
                Define your project requirements to connect with the right contributors.
              </CardDescription>
            </CardHeader>

            <CardContent  className="px-0 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ----------------- TASK OVERVIEW ----------------- */}
                <div className="border-2 border-gray-100 shadow-sm rounded-2xl px-4 pb-4">
                  <h1 className="mt-4 text-[18px]">Task Overview</h1>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Create Social Media Graphics"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="design" className="hover:bg-gradient-hero hover:text-white">Design</SelectItem>
                        <SelectItem value="development" className="hover:bg-gradient-hero hover:text-white">Development</SelectItem>
                        <SelectItem value="writing" className="hover:bg-gradient-hero hover:text-white">Writing</SelectItem>
                        <SelectItem value="marketing" className="hover:bg-gradient-hero hover:text-white">Marketing</SelectItem>
                        <SelectItem value="data" className="hover:bg-gradient-hero hover:text-white">Data Entry</SelectItem>
                        <SelectItem value="other" className="hover:bg-gradient-hero hover:text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="skills">Required Skills</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Figma, Design, Social Media"
                      value={formData.skills}
                      onChange={(e) =>
                        setFormData({ ...formData, skills: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the task..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={6}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <input
                      id="upload"
                      type="file"
                      placeholder="Upload attachment"
                      title="Upload attachment"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-[13px] text-muted-foreground">
                      Max file size: 5MB
                    </p>
                  </div>
                </div>

                {/* ----------------- SCOPE & TIMELINE ----------------- */}
                <div className="border-2 border-gray-100 shadow-sm rounded-2xl px-4 pb-4">
                  <h1 className="mt-4 text-[18px]">Scope & Timeline</h1>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="duration">Task Type</Label>
                    <Input
                      id="duration"
                      placeholder="One-Time"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* ----------------- BUDGET & REWARDS ----------------- */}
                <div className="border-2 border-gray-100 shadow-sm rounded-2xl px-4 pb-4">
                  <h1 className="mt-4 text-[18px]">Budgets & Rewards</h1>

                  <div className="space-y-2 mt-6">
                    <Label htmlFor="reward">Amount</Label>
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
                    />
                  </div>

                  <div className="space-y-2 mt-6 w-full">
                    <h3>Currency</h3>
                    <p className="border-2 border-gray-100 p-3 w-full rounded-2xl flex gap-2 text-[15px]">
                      <img src={USDCLogo} alt="" className="w-5 h-5" /> USDC
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-medium">Payment Summary</span>
                   </div>
                   <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">
                         Task Reward:
                       </span>
                       <span className="font-medium">
                         {formData.reward || "0"} USDC
                       </span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">
                         Platform Fee (10%):
                       </span>
                       <span className="font-medium">
                         {(parseFloat(formData.reward || "0") * 0.1).toFixed(4)}{" "}
                         USDC
                       </span>
                     </div>
                     <div className="flex justify-between pt-2 border-t">
                       <span className="font-semibold">Total to Deposite:</span>
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
                  className=" flex justify-end ml-auto"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Task'}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

