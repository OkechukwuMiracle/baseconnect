import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import axios from "axios";

// USDC Contract Address for Base Sepolia
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`;

// Your task contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

// Standard ERC20 ABI for approve function
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

import { BaseflowTasksUSDCABI } from "../../../../../contracts/contracts/BaseflowTasksUSDCABI";

const USDC_DECIMALS = 6;

export default function CreateTaskTraditionalUSDC() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | null>(null);
  const [createTaskTxHash, setCreateTaskTxHash] = useState<`0x${string}` | null>(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    reward: "",
    deadline: "",
  });

  const { writeContractAsync } = useWriteContract();

  // Check current allowance
  const { data: currentAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && CONTRACT_ADDRESS ? [address, CONTRACT_ADDRESS] : undefined,
  });

  // Wait for approval transaction
  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalTxHash ?? undefined,
  });

  // Wait for create task transaction
  const { isSuccess: isCreateTaskConfirmed } = useWaitForTransactionReceipt({
    hash: createTaskTxHash ?? undefined,
  });

  const handleApproveAndCreate = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      const rewardInUSDC = parseUnits(taskData.reward, USDC_DECIMALS);

      // Step 1: Check if approval is needed
      const needsApproval = !currentAllowance || currentAllowance < rewardInUSDC;

      if (needsApproval) {
        toast({
          title: "Approval Required",
          description: "Please approve USDC spending...",
        });

        // Approve USDC spending
        const approvalHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, rewardInUSDC],
          chain: baseSepolia,
          account: address,
        });

        setApprovalTxHash(approvalHash);

        toast({
          title: "Approval Submitted",
          description: "Waiting for confirmation...",
        });

        // Wait for approval to be confirmed (you can use useEffect with isApprovalConfirmed)
        // For simplicity, we'll add a delay here
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      // Step 2: Create task (this will transfer USDC to contract)
      toast({
        title: "Creating Task",
        description: "Please confirm the transaction...",
      });

      const deadlineTimestamp = Math.floor(new Date(taskData.deadline).getTime() / 1000);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: BaseflowTasksUSDCABI,
        functionName: "createTask",
        args: [
          taskData.title,
          taskData.description,
          BigInt(deadlineTimestamp),
          rewardInUSDC,
        ],
        chain: baseSepolia,
        account: address,
      });

      setCreateTaskTxHash(hash);

      toast({
        title: "Success!",
        description: "Task created successfully with USDC escrow.",
      });

      // Save to backend
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          ...taskData,
          transactionHash: hash,
          currency: "USDC",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    } catch (error) {
      console.error("Create task error:", error);
      toast({
        title: "Error",
        description: error?.shortMessage || error?.message || "Failed to create task.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Your form fields here */}
      <Button
        onClick={handleApproveAndCreate}
        disabled={isProcessing}
        variant="hero"
      >
        {isProcessing ? "Processing..." : "Create Task with USDC"}
      </Button>

      {/* Show approval status */}
      {currentAllowance && (
        <p className="text-sm text-muted-foreground mt-2">
          Current USDC Allowance: {(Number(currentAllowance) / 10 ** USDC_DECIMALS).toFixed(2)}
        </p>
      )}
    </div>
  );
}