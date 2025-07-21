
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import type { Odd } from "@/lib/types";

type DetailedStatisticsProps = {
  odd: Odd;
};

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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Detailed Statistics: {odd.event}</CardTitle>
        <CardDescription>
          An in-depth look at the factors influencing this matchup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
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

        {chartData.length > 0 && (
            <div>
            <h3 className="text-lg font-semibold mb-4">Head-to-Head History</h3>
            <div className="h-[250px] w-full">
                <ChartContainer config={chartConfig}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="match"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis />
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="teamA" fill="var(--color-teamA)" radius={4} name={odd.teamA} />
                    <Bar dataKey="teamB" fill="var(--color-teamB)" radius={4} name={odd.teamB} />
                </BarChart>
                </ChartContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {chartData.map((d) =>
                    d.similar ? (
                    <Badge key={d.match} variant="default">
                        {d.match} (Similar Conditions)
                    </Badge>
                    ) : null
                )}
            </div>
          </div>
        )}

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