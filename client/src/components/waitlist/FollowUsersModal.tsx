// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, Search, UserPlus, CheckCircle2, Users } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@/providers/AuthProvider";

// interface FollowUsersModalProps {
//   task: any;
//   onComplete: () => void;
// }

// export function FollowUsersModal({ task, onComplete }: FollowUsersModalProps) {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [following, setFollowing] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);

//   useEffect(() => {
//     loadFollowing();
//   }, []);

//   const loadFollowing = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/profile/me`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFollowing(res.data.following || []);
//     } catch (error) {
//       console.error("Error loading following:", error);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     try {
//       setSearching(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/profile/search?q=${encodeURIComponent(searchQuery)}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSearchResults(res.data);
//     } catch (error) {
//       console.error("Error searching users:", error);
//       toast({
//         title: "Error",
//         description: "Failed to search users",
//         variant: "destructive",
//       });
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleFollow = async (userId: string) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/profile/follow/${userId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast({
//         title: "User Followed!",
//         description: "You are now following this user.",
//       });

//       await loadFollowing();
//       onComplete();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to follow user",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const required = task.requiredValue || 5;
//   const isComplete = following.length >= required;

//   return (
//     <div className="py-4 space-y-4">
//       <div className="space-y-2">
//         <div className="flex items-center justify-between">
//           <Label>Following ({following.length} / {required} required)</Label>
//           {isComplete && (
//             <Badge variant="default" className="flex items-center gap-1">
//               <CheckCircle2 className="h-3 w-3" />
//               Complete
//             </Badge>
//           )}
//         </div>
//         {isComplete && (
//           <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
//             <p className="text-sm text-green-600 flex items-center gap-2">
//               <CheckCircle2 className="h-4 w-4" />
//               You're following {following.length} users! You can now verify this task.
//             </p>
//           </div>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="search">Search Users</Label>
//         <div className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="search"
//               type="text"
//               placeholder="Search by email, name..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   e.preventDefault();
//                   handleSearch();
//                 }
//               }}
//               className="pl-10"
//             />
//           </div>
//           <Button
//             type="button"
//             onClick={handleSearch}
//             disabled={searching || !searchQuery.trim()}
//           >
//             {searching ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Search className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {searchResults.length > 0 && (
//         <div className="space-y-2">
//           <Label>Search Results</Label>
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {searchResults.map((result) => {
//               const isFollowing = following.includes(result._id);
//               return (
//                 <div
//                   key={result._id}
//                   className="p-3 border rounded-md flex items-center justify-between"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {result.firstName} {result.lastName}
//                     </p>
//                     <p className="text-sm text-muted-foreground">{result.email}</p>
//                     {result.walletAddress && (
//                       <p className="text-xs text-muted-foreground font-mono">
//                         {result.walletAddress.slice(0, 10)}...
//                       </p>
//                     )}
//                   </div>
//                   {isFollowing ? (
//                     <Badge variant="outline">Following</Badge>
//                   ) : (
//                     <Button
//                       size="sm"
//                       onClick={() => handleFollow(result._id)}
//                       disabled={loading}
//                     >
//                       <UserPlus className="h-4 w-4 mr-1" />
//                       Follow
//                     </Button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {searchResults.length === 0 && searchQuery && !searching && (
//         <p className="text-sm text-muted-foreground text-center py-4">
//           No users found. Try a different search term.
//         </p>
//       )}
//     </div>
//   );
// }

