"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { predictOddsChanges } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, BarChart, FileText } from "lucide-react";
import type { Odd } from "@/lib/types";

type PredictionAlertModalProps = {
  odd: Odd;
  isOpen: boolean;
  onClose: () => void;
};

type PredictionResult = {
  predictedChange: string;
  confidenceLevel: string;
  reasoning: string;
};

export function PredictionAlertModal({
  odd,
  isOpen,
  onClose,
}: PredictionAlertModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    setIsLoading(true);
    setResult(null);
    const response = await predictOddsChanges({
      currentOdds: (odd.teamAOdds + odd.teamBOdds) / 2, // Simple average for demo
      marketInfluences:
        odd.marketInfluences.map((mi) => mi.name).join(", ") || "None",
      historicalOdds: odd.historicalOdds,
    });
    if ("error" in response) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    } else {
      setResult(response);
    }
    setIsLoading(false);
  };
  
  React.useEffect(() => {
    if (isOpen) {
      setResult(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const confidenceValue = result
    ? parseInt(result.confidenceLevel.replace("%", ""), 10)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Predict Odds Change</DialogTitle>
          <DialogDescription>
            Use AI to predict potential changes for: {odd.event}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {!result && !isLoading &&
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                            Click the button below to analyze market influences and historical data to forecast significant shifts in betting odds for this event.
                        </p>
                    </CardContent>
                </Card>
            }

            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing data...</p>
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Predicted Change</p>
                            <p className="text-lg font-bold">{result.predictedChange}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                        <BarChart className="h-6 w-6 text-primary" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <p className="text-sm text-muted-foreground">Confidence Level</p>
                                <p className="text-sm font-bold">{result.confidenceLevel}</p>
                            </div>
                            <Progress value={confidenceValue} />
                        </div>
                    </div>
                     <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary">
                        <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-muted-foreground">Reasoning</p>
                            <p className="text-sm">{result.reasoning}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handlePredict} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {result ? 'Re-predict' : 'Predict'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
