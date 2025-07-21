
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, HelpCircle, History, TrendingUp, TrendingDown, Info, Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import type { Odd, PlayerStatus, AvailabilityStatus } from "@/lib/types";
import type { AnalyzeBetHistoryOutput } from "@/ai/flows/analyze-bet-history";
import { Separator } from "./ui/separator";

type DetailedStatisticsProps = {
  odd: Odd;
  historicalAnalysis: AnalyzeBetHistoryOutput | null;
  isAnalysisLoading: boolean;
};

const AvailabilityIcon = ({ status }: { status: AvailabilityStatus }) => {
    switch(status) {
        case 'Yes':
            return <Check className="h-5 w-5 text-green-500" />;
        case 'Doubtful':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'Unclear':
        case 'Likely sub':
             return <HelpCircle className="h-5 w-5 text-gray-500" />;
        default:
            return null;
    }
}

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

const getTrendIcon = (winRate: string) => {
    if (winRate.includes("loss")) {
        return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    const rate = parseInt(winRate, 10);
    if (rate >= 60) {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    }
    if (rate <= 40) {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return <History className="h-5 w-5 text-yellow-500" />;
  };


export function DetailedStatistics({ odd, historicalAnalysis, isAnalysisLoading }: DetailedStatisticsProps) {
  const chartData = odd.historicalComparisonChartData || [];
  const chartConfig = {
    teamA: {
      label: odd.teamA,
      color: "hsl(var(--chart-1))",
    },
    teamB: {
      label: odd.teamB,
      color: "hsl(var(--chart-2))",
    },
  };

  const playerStatusData = odd.playerStatusData || [];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI Summary & Insights: {odd.event}</CardTitle>
        <CardDescription>
          An in-depth look at the matchup and your historical performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Historical Insights Section */}
        <div>
            <h3 className="text-lg font-semibold mb-4">Your Historical Insights</h3>
            {isAnalysisLoading && <InsightSkeleton />}
            {!isAnalysisLoading && !historicalAnalysis && (
                <div className="flex flex-col items-center justify-center gap-4 py-8 text-center text-sm text-muted-foreground">
                    <Info className="h-8 w-8" />
                    <p>Select an event to see personalized insights based on your betting history.</p>
                </div>
            )}
            {!isAnalysisLoading && historicalAnalysis && historicalAnalysis.insights.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-8 text-center text-sm text-muted-foreground">
                    <Info className="h-8 w-8" />
                    <p>No specific insights found for this event based on your history. Add more bets to improve analysis.</p>
                </div>
            )}
            {!isAnalysisLoading && historicalAnalysis && historicalAnalysis.insights.length > 0 && (
            <div className="space-y-6">
                {historicalAnalysis.insights.map((insight, index) => {
                    const isLossRate = insight.winRate.includes("loss");
                    const isWin = !isLossRate && parseInt(insight.winRate, 10) >= 50;

                    return (
                        <div key={index} className="flex items-start gap-4">
                            <div className="mt-1">{getTrendIcon(insight.winRate)}</div>
                            <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{insight.condition}</p>
                                <Badge className="text-nowrap" variant={isLossRate ? "destructive" : "default"}>
                                    {isLossRate ? insight.winRate : `${insight.winRate} Win Rate`}
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
                    );
                })}
            </div>
            )}
        </div>
        
        <Separator />
        
        {/* Match-specific analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {chartData.length > 0 && (
                <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Head-to-Head Results (Last {chartData.length} Matches)</h3>
                <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig}>
                        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="matchDate"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                                label={{ value: 'Goals Scored', angle: -90, position: 'insideLeft', offset: -10, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Legend />
                            <Line type="monotone" dataKey="teamA" stroke="var(--color-teamA)" strokeWidth={2} name={odd.teamA} dot={{ r: 4, fill: "var(--color-teamA)" }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="teamB" stroke="var(--color-teamB)" strokeWidth={2} name={odd.teamB} dot={{ r: 4, fill: "var(--color-teamB)" }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ChartContainer>
                </div>
              </div>
            )}

            {playerStatusData.length > 0 && (
                 <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">Player Status</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-center">Availability</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {playerStatusData.map((player) => (
                                    <TableRow key={player.player}>
                                        <TableCell className="font-medium">{player.player}</TableCell>
                                        <TableCell>{player.status}</TableCell>
                                        <TableCell>{player.role}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <AvailabilityIcon status={player.availability} />
                                                <span>{player.availability}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                 </div>
            )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Market Influence Details</h3>
          <div className="space-y-4">
            {odd.marketInfluences.map((influence) => (
              <div key={influence.id} className="flex items-start gap-4">
                <influence.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{influence.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {odd.marketInfluenceDetails?.[influence.id] || "No specific details available."}
                  </p>
                </div>
              </div>
            ))}
            {odd.marketInfluences.length === 0 && (
                <p className="text-sm text-muted-foreground">No significant market influences reported.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            What's Changed Since The Last Match?
          </h3>
          <p className="text-sm text-muted-foreground">
            {odd.changesSinceLastMatch || "No significant changes reported."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
