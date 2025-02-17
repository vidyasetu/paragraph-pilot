
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TextAnalysisProps {
  topics: string[];
}

const TextAnalysis = ({ topics }: TextAnalysisProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4">Identified Topics</h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Badge
            key={topic}
            variant="secondary"
            className="px-3 py-1 text-sm capitalize"
          >
            {topic}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default TextAnalysis;
