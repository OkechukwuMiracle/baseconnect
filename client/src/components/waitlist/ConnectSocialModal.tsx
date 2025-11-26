// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, X, Link2, CheckCircle2 } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@/providers/AuthProvider";

// interface ConnectSocialModalProps {
//   task: any;
//   onComplete: () => void;
// }

// const socialPlatforms = [
//   { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
//   { value: 'github', label: 'GitHub', icon: '💻' },
//   { value: 'discord', label: 'Discord', icon: '💬' },
//   { value: 'telegram', label: 'Telegram', icon: '✈️' },
//   { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
// ];

// export function ConnectSocialModal({ task, onComplete }: ConnectSocialModalProps) {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [platform, setPlatform] = useState("");
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [socialLinks, setSocialLinks] = useState<any[]>([]);

//   useEffect(() => {
//     loadSocialLinks();
//   }, []);

//   const loadSocialLinks = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/profile/me`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSocialLinks(res.data.socialLinks || []);
//     } catch (error) {
//       console.error("Error loading social links:", error);
//     }
//   };

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       toast({
//         title: "Authentication Required",
//         description: "Please log in to add social links",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/profile/social`,
//         { platform, username },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast({
//         title: "Social Link Added!",
//         description: "Your social link has been saved successfully.",
//       });

//       setPlatform("");
//       setUsername("");
//       await loadSocialLinks();
//       onComplete();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to add social link",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async (platformToRemove: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(
//         `${import.meta.env.VITE_API_URL}/api/profile/social/${platformToRemove}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast({
//         title: "Social Link Removed",
//         description: "The social link has been removed.",
//       });

//       await loadSocialLinks();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to remove social link",
//         variant: "destructive",
//       });
//     }
//   };

//   const getPlatformLabel = (platformValue: string) => {
//     return socialPlatforms.find(p => p.value === platformValue)?.label || platformValue;
//   };

//   return (
//     <div className="py-4 space-y-4">
//       {socialLinks.length > 0 && (
//         <div className="space-y-2">
//           <Label>Connected Social Links</Label>
//           <div className="flex flex-wrap gap-2">
//             {socialLinks.map((link) => (
//               <Badge key={link.platform} variant="default" className="flex items-center gap-2">
//                 {getPlatformLabel(link.platform)}: {link.username}
//                 <button
//                   onClick={() => handleRemove(link.platform)}
//                   className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             ))}
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleAdd} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="platform">Platform</Label>
//           <Select value={platform} onValueChange={setPlatform} required>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a platform" />
//             </SelectTrigger>
//             <SelectContent>
//               {socialPlatforms.map((p) => (
//                 <SelectItem key={p.value} value={p.value}>
//                   {p.icon} {p.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="username">Username</Label>
//           <div className="relative">
//             <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               id="username"
//               type="text"
//               placeholder="Enter your username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="pl-10"
//               required
//             />
//           </div>
//         </div>

//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               Adding...
//             </>
//           ) : (
//             <>
//               <Link2 className="h-4 w-4 mr-2" />
//               Add Social Link
//             </>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// }

