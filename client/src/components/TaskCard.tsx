// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Clock, Coins } from "lucide-react";
// import { Link } from "react-router-dom";

// interface TaskCardProps {
//   id: string;
//   title: string;
//   description: string;
//   reward: string;
//   deadline: string;
//   skills: [];
//   status: "open" | "in_progress" | "completed";
// }

// const statusColors = {
//   open: "bg-muted text-muted-foreground",
//   in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/20",
//   completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
// };

// export function TaskCard({ id, title, description, reward, deadline, skills, status }: TaskCardProps) {
//   return (
//     <Card className="group hover:shadow-card transition-all duration-300 border-border/50 hover:border-primary/50">
//       <CardHeader>
//         <div className="flex items-start justify-between gap-2">
//           <CardTitle className="text-lg group-hover:text-primary transition-colors">{title}</CardTitle>
//           <Badge variant="outline" className={statusColors[status]}>
//             {status.replace("_", " ")}
//           </Badge>
//         </div>
//         <CardDescription className="line-clamp-2">{description}</CardDescription>
//       </CardHeader>
      
//       <CardContent>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {/* {skills.map((skill) => (
//             <Badge key={skill} variant="secondary" className="text-xs">
//               {skill}
//             </Badge>
//           ))} */}
//           {Array.isArray(skills) &&
//   skills.map((skill) => (
//     <Badge key={skill} variant="secondary" className="text-xs">
//       {skill}
//     </Badge>
//   ))}

//         </div>
        
//         <div className="flex items-center justify-between text-sm">
//           <div className="flex items-center gap-1 text-primary font-semibold">
//             <Coins className="h-4 w-4" />
//             <span>{reward} ETH</span>
//           </div>
//           <div className="flex items-center gap-1 text-muted-foreground">
//             <Clock className="h-4 w-4" />
//             <span>{deadline}</span>
//           </div>
//         </div>
//       </CardContent>
      
//       <CardFooter>
//         <Link to={`/tasks/${id}`} className="w-full">
//           <Button variant="gradient" className="w-full">
//             View Details
//           </Button>
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }



import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Coins } from "lucide-react";
import { Link } from "react-router-dom";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: string;
  skills: string[];
  status: "open" | "in_progress" | "completed";
}

const statusColors = {
  open: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const statusLabels = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
};

export function TaskCard({ id, title, description, reward, deadline, skills, status }: TaskCardProps) {
  return (
    <Card className="group hover:shadow-card transition-all duration-300 border-border/50 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </CardTitle>
          <Badge variant="outline" className={`${statusColors[status]} shrink-0`}>
            {statusLabels[status]}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <Coins className="h-4 w-4" />
            <span>{reward} ETH</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs">{deadline}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/tasks/${id}`} className="w-full">
          <Button variant="gradient" className="w-full group-hover:shadow-glow transition-all">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}