import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Coins, AlertCircle, Users, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: string;
  skills: string[];
  status: "open" | "in_progress" | "completed";
  hasSubmission?: boolean;
  applicants?: number;
  needsRevision?: boolean;
  reviewNote?: string;
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

export function TaskCard({ 
  id, 
  title, 
  description, 
  reward, 
  deadline, 
  skills, 
  status,
  hasSubmission = false,
  applicants = 0,
  needsRevision = false,
  reviewNote
}: TaskCardProps) {
  const { user } = useAuth();
  const isCreator = user?.role === "creator";
  const isContributor = user?.role === "contributor";

  return (
    <Card className="w-full  group hover:shadow-card transition-all duration-300 border-border/50 hover:border-primary/50 relative">
      {/* Submission Alert Badge for Creator */}
      {hasSubmission && isCreator && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-primary text-primary-foreground shadow-lg animate-pulse">
            <AlertCircle className="h-3 w-3 mr-1" />
            Review Needed
          </Badge>
        </div>
      )}

      {/* Revision Request Badge for Contributor  NEW */}
      {needsRevision && isContributor && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-destructive text-destructive-foreground shadow-lg animate-pulse">
            <XCircle className="h-3 w-3 mr-1" />
            Needs Revision
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2 ">
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

        {/* Show review note for contributor  NEW */}
        {needsRevision && isContributor && reviewNote && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-xs font-semibold text-destructive mb-1">Revision Feedback:</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{reviewNote}</p>
          </div>
        )}
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
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-primary font-semibold">
              <Coins className="h-4 w-4" />
              <span>{reward} USDC</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">{deadline}</span>
            </div>
          </div>

          {/* Applicants count for creators */}
          {isCreator && applicants > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{applicants} applicant{applicants !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="gap-2">
        {/* If creator and has submission, show Review button */}
        {isCreator && hasSubmission ? (
          <Link to={`/dashboard/creator/tasks/${id}/review`} className="w-full">
            <Button variant="hero" className="w-full group-hover:shadow-glow transition-all">
              <AlertCircle className="mr-2 h-4 w-4" />
              Review Submission
            </Button>
          </Link>
        ) : needsRevision && isContributor ? (
          // If contributor and needs revision, show Resubmit button  NEW
          <Link to={`/tasks/${id}`} className="w-full">
            <Button variant="destructive" className="w-full group-hover:shadow-glow transition-all">
              <XCircle className="mr-2 h-4 w-4" />
              Resubmit Work
            </Button>
          </Link>
        ) : (
          <Link to={`/tasks/${id}`} className="w-full">
            <Button variant="gradient" className="w-full group-hover:shadow-glow transition-all">
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}