"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown, Info, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyzeBetHistoryOutput } from "@/ai/flows/analyze-bet-history";

type HistoricalInsightsProps = {
  analysis: AnalyzeBetHistoryOutput | null;
  isLoading: boolean;
};

const InsightSkeleton = () => (
    <div className="space-y-4">
        <div className="flex items-start gap-4">
            <Skeleton className="h-6 w-6 rounded-full mt-1" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
        <div className="flex items-start gap-4">
            <Skeleton className="h-6 w-6 rounded-full mt-1" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    </div>
);


export function HistoricalInsights({ analysis, isLoading }: HistoricalInsightsProps) {
  const getTrendIcon = (winRate: string) => {
    const rate = parseInt(winRate, 10);
    if (rate >= 60) {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    }
    if (rate <= 40) {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return <History className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your Historical Insights</CardTitle>
        <CardDescription>
          AI-powered analysis of your betting history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <InsightSkeleton />}
        {!isLoading && !analysis && (
             <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <Info className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Select an event to see personalized insights based on your betting history.</p>
            </div>
        )}
        {!isLoading && analysis && analysis.insights.length === 0 && (
             <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <Info className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No specific insights found for this event based on your history. Add more bets to improve analysis.</p>
            </div>
        )}
        {!isLoading && analysis && analysis.insights.length > 0 && (
          <div className="space-y-6">
            {analysis.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1">{getTrendIcon(insight.winRate)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{insight.condition}</p>
                    <Badge variant={parseInt(insight.winRate, 10) >= 50 ? "default" : "destructive"}>
                      {insight.winRate} Win Rate
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.summary}
                  </p>
                   <p className="text-xs text-muted-foreground/70 mt-1">
                    Based on {insight.betsAnalyzed} bet{insight.betsAnalyzed > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
