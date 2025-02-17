
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import VideoRecommendations from "@/components/VideoRecommendations";
import TextAnalysis from "@/components/TextAnalysis";

const Index = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Please enter some text",
        description: "The text field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulated analysis for MVP
    setTimeout(() => {
      const sampleTopics = extractTopics(text);
      setTopics(sampleTopics);
      setIsAnalyzing(false);
    }, 1500);
  };

  const extractTopics = (text: string) => {
    // Simple topic extraction for MVP
    const words = text.toLowerCase().split(/\W+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    const topics = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);
    return Array.from(new Set(topics));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Study Smart
          </h1>
          <p className="text-lg text-gray-600">
            Paste your text and discover relevant educational videos
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your textbook paragraph here..."
              className="min-h-[200px] resize-none p-4 text-lg"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              onClick={handleAnalyze}
              className="w-full"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Text"}
            </Button>
          </div>
        </Card>

        {topics.length > 0 && (
          <div className="space-y-6">
            <TextAnalysis topics={topics} />
            <VideoRecommendations topics={topics} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
