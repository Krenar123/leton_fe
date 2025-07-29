
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Clock, CheckCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl: string;
}

const mockVideos: TutorialVideo[] = [
  {
    id: "1",
    title: "Getting Started with Projects",
    description: "Learn how to create and manage projects in Leton",
    duration: "5:30",
    category: "Projects",
    videoUrl: "#"
  },
  {
    id: "2",
    title: "Managing Clients and Suppliers",
    description: "How to add and organize your business contacts",
    duration: "8:15",
    category: "Clients",
    videoUrl: "#"
  },
  {
    id: "3",
    title: "Financial Tracking and Reports",
    description: "Understanding cash flow and generating reports",
    duration: "12:45",
    category: "Financials",
    videoUrl: "#"
  },
  {
    id: "4",
    title: "Team Collaboration Features",
    description: "Working with team members and assigning tasks",
    duration: "7:20",
    category: "Team",
    videoUrl: "#"
  },
  {
    id: "5",
    title: "Action Plans and Objectives",
    description: "Creating and tracking project objectives",
    duration: "9:10",
    category: "Planning",
    videoUrl: "#"
  },
  {
    id: "6",
    title: "Calendar Management",
    description: "Scheduling meetings and managing your calendar",
    duration: "6:45",
    category: "Calendar",
    videoUrl: "#"
  },
  {
    id: "7",
    title: "Supplier Management",
    description: "Managing supplier relationships and invoices",
    duration: "10:30",
    category: "Suppliers",
    videoUrl: "#"
  },
  {
    id: "8",
    title: "Dashboard Overview",
    description: "Understanding your dashboard and key metrics",
    duration: "4:15",
    category: "Dashboard",
    videoUrl: "#"
  },
  {
    id: "9",
    title: "Reports and Analytics",
    description: "Generating and customizing business reports",
    duration: "11:20",
    category: "Reports",
    videoUrl: "#"
  },
  {
    id: "10",
    title: "Settings and Configuration",
    description: "Customizing your Leton workspace",
    duration: "7:50",
    category: "Settings",
    videoUrl: "#"
  }
];

const categories = ["All", "Dashboard", "Projects", "Clients", "Suppliers", "Calendar", "Team", "Reports", "Settings", "Financials", "Planning"];

interface TutorialVideosDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialVideosDialog = ({ isOpen, onClose }: TutorialVideosDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [watchedVideos, setWatchedVideos] = useState<string[]>(["1", "3", "6"]); // Mock watched videos

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const watchedVideosList = mockVideos.filter(video => watchedVideos.includes(video.id));

  const handleWatchVideo = (videoId: string) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos([...watchedVideos, videoId]);
    }
    // Here you would typically open the video player or navigate to the video
    console.log(`Playing video: ${videoId}`);
  };

  const VideoCard = ({ video, isWatched = false }: { video: TutorialVideo; isWatched?: boolean }) => (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">{video.title}</h3>
            {isWatched && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">{video.category}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {video.duration}
            </span>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={() => handleWatchVideo(video.id)}
          className="ml-4"
        >
          <Play className="h-4 w-4 mr-1" />
          {isWatched ? 'Rewatch' : 'Watch'}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Tutorial Videos</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="history">Watch History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredVideos.map((video) => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    isWatched={watchedVideos.includes(video.id)}
                  />
                ))}
                {filteredVideos.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No videos found matching your search and filters.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-3">
                {watchedVideosList.map((video) => (
                  <VideoCard key={video.id} video={video} isWatched={true} />
                ))}
                {watchedVideosList.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No videos watched yet. Start watching tutorials to see your history here.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
