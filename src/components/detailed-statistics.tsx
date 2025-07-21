
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
import { Check, AlertTriangle, HelpCircle } from 'lucide-react';
import type { Odd, PlayerStatus, AvailabilityStatus } from "@/lib/types";

type DetailedStatisticsProps = {
  odd: Odd;
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

export function DetailedStatistics({ odd }: DetailedStatisticsProps) {
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
        <CardTitle>AI Summary: {odd.event}</CardTitle>
        <CardDescription>
          An in-depth look at the factors influencing this matchup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
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
