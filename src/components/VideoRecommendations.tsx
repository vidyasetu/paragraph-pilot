
import { Card } from "@/components/ui/card";
import { VideoCard } from "./VideoCard";

interface VideoRecommendationsProps {
  topics: string[];
}

const VideoRecommendations = ({ topics }: VideoRecommendationsProps) => {
  // Simulated video recommendations for MVP
  const mockVideos = topics.map((topic) => ({
    id: topic,
    title: `Understanding ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
    thumbnail: `https://picsum.photos/seed/${topic}/300/200`,
    duration: "5:30",
    views: "1.2K",
    channel: "Educational Hub",
  }));

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </Card>
  );
};

export default VideoRecommendations;
