// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, X, Plus, CheckCircle2 } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@/providers/AuthProvider";

// interface InterestsModalProps {
//   task: any;
//   onComplete: () => void;
// }

// const popularInterests = [
//   'Web3', 'DeFi', 'NFTs', 'Gaming', 'DAO', 'Crypto', 'Blockchain',
//   'Ethereum', 'Base', 'Layer 2', 'Smart Contracts', 'DApps',
//   'Trading', 'Investing', 'Development', 'Design', 'Marketing',
//   'Community', 'Content Creation', 'Research'
// ];

// export function InterestsModal({ task, onComplete }: InterestsModalProps) {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [interests, setInterests] = useState<string[]>([]);
//   const [newInterest, setNewInterest] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentInterests, setCurrentInterests] = useState<string[]>([]);

//   useEffect(() => {
//     loadInterests();
//   }, []);

//   const loadInterests = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/profile/me`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const loaded = res.data.interests || [];
//       setCurrentInterests(loaded);
//       setInterests(loaded);
//     } catch (error) {
//       console.error("Error loading interests:", error);
//     }
//   };

//   const handleAddInterest = (interest: string) => {
//     const trimmed = interest.trim();
//     if (trimmed && !interests.includes(trimmed)) {
//       setInterests([...interests, trimmed]);
//       setNewInterest("");
//     }
//   };

//   const handleRemoveInterest = (interest: string) => {
//     setInterests(interests.filter(i => i !== interest));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       toast({
//         title: "Authentication Required",
//         description: "Please log in to update interests",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/profile/interests`,
//         { interests },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast({
//         title: "Interests Updated!",
//         description: "Your interests have been saved successfully.",
//       });

//       setCurrentInterests(interests);
//       onComplete();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to update interests",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const required = task.requiredValue || 3;
//   const isComplete = interests.length >= required;

//   return (
//     <div className="py-4 space-y-4">
//       <div className="space-y-2">
//         <Label>Your Interests ({interests.length} / {required} required)</Label>
//         {interests.length > 0 ? (
//           <div className="flex flex-wrap gap-2">
//             {interests.map((interest) => (
//               <Badge key={interest} variant="default" className="flex items-center gap-1">
//                 {interest}
//                 <button
//                   onClick={() => handleRemoveInterest(interest)}
//                   className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-muted-foreground">No interests added yet</p>
//         )}
//       </div>

//       {isComplete && (
//         <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
//           <p className="text-sm text-green-600 flex items-center gap-2">
//             <CheckCircle2 className="h-4 w-4" />
//             Interest graph complete! You can now verify this task.
//           </p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="interest">Add Interest</Label>
//           <div className="flex gap-2">
//             <Input
//               id="interest"
//               type="text"
//               placeholder="Enter an interest"
//               value={newInterest}
//               onChange={(e) => setNewInterest(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   e.preventDefault();
//                   handleAddInterest(newInterest);
//                 }
//               }}
//             />
//             <Button
//               type="button"
//               onClick={() => handleAddInterest(newInterest)}
//               variant="outline"
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label>Popular Interests</Label>
//           <div className="flex flex-wrap gap-2">
//             {popularInterests
//               .filter(i => !interests.includes(i))
//               .map((interest) => (
//                 <Badge
//                   key={interest}
//                   variant="outline"
//                   className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
//                   onClick={() => handleAddInterest(interest)}
//                 >
//                   {interest}
//                 </Badge>
//               ))}
//           </div>
//         </div>

//         <Button type="submit" className="w-full" disabled={loading || interests.length === 0}>
//           {loading ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <CheckCircle2 className="h-4 w-4 mr-2" />
//               Save Interests
//             </>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// }

