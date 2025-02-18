
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Camera as CameraIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isProcessingImage, setIsProcessingImage] = useState(false);
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
            if (data.text.includes("Heart, the mesodermally derived organ")) {
              window.open("https://www.youtube.com/watch?v=Y8GZ8Ue39FA", "_blank");
              toast({
                title: "Content recognized!",
                description: "Opening relevant educational video.",
              });
            } else {
              toast({
                title: "No matching content",
                description: "Could not find relevant educational content for this text.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error('Error processing image:', error);
          toast({
            title: "Error processing image",
            description: "Could not process the image. Please try again.",
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
          <div className="flex justify-center">
            <Button
              onClick={takePicture}
              size="lg"
              className="gap-2"
              disabled={isProcessingImage}
            >
              {isProcessingImage ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <CameraIcon className="w-6 h-6" />
              )}
              {isProcessingImage ? "Processing..." : "Take Picture"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
