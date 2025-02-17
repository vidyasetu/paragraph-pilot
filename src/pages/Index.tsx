
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, ImageOptions, CameraResultType, CameraSource } from '@capacitor/camera';
import VideoRecommendations from "@/components/VideoRecommendations";
import TextAnalysis from "@/components/TextAnalysis";
import { Camera as CameraIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const { toast } = useToast();

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        setIsProcessingImage(true);
        try {
          const { data, error } = await supabase.functions.invoke('process-image', {
            body: { image: image.base64String },
          });

          if (error) throw error;

          if (data.text) {
            setText(data.text);
            toast({
              title: "Text extracted successfully",
              description: "The text has been extracted from your image.",
            });
          }
        } catch (error) {
          console.error('Error processing image:', error);
          toast({
            title: "Error processing image",
            description: "Could not extract text from the image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessingImage(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access camera. Please ensure camera permissions are granted.",
        variant: "destructive",
      });
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Vidya Setu
          </h1>
          <p className="text-lg text-gray-600">
            Your right to quality education
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <Button
                onClick={takePicture}
                variant="outline"
                className="gap-2"
                disabled={isProcessingImage}
              >
                {isProcessingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CameraIcon className="w-4 h-4" />
                )}
                {isProcessingImage ? "Processing..." : "Take Picture"}
              </Button>
            </div>
            <Textarea
              placeholder="Paste your textbook paragraph here or take a picture..."
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
