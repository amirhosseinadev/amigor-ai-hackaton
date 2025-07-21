"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WandSparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Odd } from "@/lib/types";

type OddsTableProps = {
  odds: Odd[];
  onPredictClick: (odd: Odd) => void;
  onRowClick: (odd: Odd) => void;
  onOddSelect: (oddValue: number) => void;
  selectedOddId?: string;
};

export function OddsTable({ odds, onPredictClick, onRowClick, onOddSelect, selectedOddId }: OddsTableProps) {
  const [highlightedCells, setHighlightedCells] = React.useState<Set<string>>(
    new Set()
  );
  const prevOddsRef = React.useRef<Odd[]>(odds);

  React.useEffect(() => {
    const newHighlights = new Set<string>();
    odds.forEach((odd) => {
      const prevOdd = prevOddsRef.current.find((p) => p.id === odd.id);
      if (prevOdd) {
        if (odd.teamAOdds !== prevOdd.teamAOdds)
          newHighlights.add(`${odd.id}-teamA`);
        if (odd.teamBOdds !== prevOdd.teamBOdds)
          newHighlights.add(`${odd.id}-teamB`);
        if (odd.drawOdds !== prevOdd.drawOdds)
          newHighlights.add(`${odd.id}-draw`);
      }
    });

    if (newHighlights.size > 0) {
      setHighlightedCells(newHighlights);
      const timer = setTimeout(() => setHighlightedCells(new Set()), 2000);
      return () => clearTimeout(timer);
    }

    prevOddsRef.current = odds;
  }, [odds]);
  
  const handleOddClick = (e: React.MouseEvent, oddValue: number) => {
    e.stopPropagation();
    onOddSelect(oddValue);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Real-Time Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-center">Team A</TableHead>
                  <TableHead className="text-center">Team B</TableHead>
                  {odds.some((o) => o.drawOdds) && (
                    <TableHead className="text-center">Draw</TableHead>
                  )}
                  <TableHead className="text-center">Influences</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {odds.map((odd) => (
                  <TableRow
                    key={odd.id}
                    onClick={() => onRowClick(odd)}
                    className={cn(
                        "cursor-pointer",
                        odd.id === selectedOddId && "bg-muted/50"
                    )}
                  >
                    <TableCell>
                      <div className="font-medium">{odd.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {odd.sport}
                      </div>
                    </TableCell>
                    <TableCell
                      onClick={(e) => handleOddClick(e, odd.teamAOdds)}
                      className={cn("text-center font-mono text-lg", {
                        "animate-highlight": highlightedCells.has(
                          `${odd.id}-teamA`
                        ),
                      })}
                    >
                      <div className="text-xs text-muted-foreground">{odd.teamA}</div>
                      {odd.teamAOdds.toFixed(2)}
                    </TableCell>
                    <TableCell
                      onClick={(e) => handleOddClick(e, odd.teamBOdds)}
                      className={cn("text-center font-mono text-lg", {
                        "animate-highlight": highlightedCells.has(
                          `${odd.id}-teamB`
                        ),
                      })}
                    >
                      <div className="text-xs text-muted-foreground">{odd.teamB}</div>
                      {odd.teamBOdds.toFixed(2)}
                    </TableCell>
                    {odds.some((o) => o.drawOdds) && (
                      <TableCell
                        onClick={(e) => odd.drawOdds && handleOddClick(e, odd.drawOdds)}
                        className={cn("text-center font-mono text-lg", {
                          "animate-highlight": highlightedCells.has(
                            `${odd.id}-draw`
                          ),
                        })}
                      >
                         <div className="text-xs text-muted-foreground">Draw</div>
                        {odd.drawOdds ? odd.drawOdds.toFixed(2) : "-"}
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        {odd.marketInfluences.map((influence) => (
                          <Tooltip key={influence.id}>
                            <TooltipTrigger asChild>
                              <span
                                className="cursor-pointer"
                                aria-label={influence.name}
                              >
                                <influence.icon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">{influence.name}</p>
                              <p>{influence.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {odd.marketInfluences.length === 0 && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPredictClick(odd);
                            }}
                          >
                            <WandSparkles className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Predict Odds Change</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
