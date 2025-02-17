
import { Card } from "@/components/ui/card";
import { VideoCard } from "./VideoCard";

interface VideoRecommendationsProps {
  topics: string[];
  text?: string;
}

const VideoRecommendations = ({ topics, text }: VideoRecommendationsProps) => {
  // Predefined content mapping for specific text
  const HEART_TEXT = "Heart, the mesodermally derived organ";
  const heartVideo = {
    id: "heart-anatomy",
    title: "Heart Anatomy and Physiology",
    thumbnail: `https://img.youtube.com/vi/Y8GZ8Ue39FA/maxresdefault.jpg`,
    duration: "13:37",
    views: "1.2M",
    channel: "CrashCourse",
    url: "https://www.youtube.com/watch?v=Y8GZ8Ue39FA"
  };

  // Check if the current text matches our predefined content
  const isHeartContent = text?.includes(HEART_TEXT);

  // If we have a match, show the specific video first
  const videos = isHeartContent 
    ? [heartVideo]
    : topics.map((topic) => ({
        id: topic,
        title: `Understanding ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
        thumbnail: `https://picsum.photos/seed/${topic}/300/200`,
        duration: "5:30",
        views: "1.2K",
        channel: "Educational Hub",
        url: ""
      }));

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </Card>
  );
};

export default VideoRecommendations;
