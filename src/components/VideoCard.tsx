
import { Card } from "@/components/ui/card";
import { Clock, Eye } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
  url: string;
}

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const handleClick = () => {
    if (video.url) {
      window.open(video.url, '_blank');
    }
  };

  return (
    <Card 
      className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {video.duration}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{video.channel}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {video.views} views
          </div>
        </div>
      </div>
    </Card>
  );
};
