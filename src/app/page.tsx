"use client";

import * as React from "react";
import { OddsTable } from "@/components/odds-table";
import { BetValueCalculator } from "@/components/bet-value-calculator";
import { Header } from "@/components/layout/header";
import { MockDataInterface } from "@/components/mock-data-interface";
import type { Odd, Bet } from "@/lib/types";
import { initialOdds, userBetHistory as mockBetHistory } from "@/lib/mock-data";
import { PredictionAlertModal } from "@/components/prediction-alert-modal";
import { DetailedStatistics } from "@/components/detailed-statistics";
import type { AnalyzeBetHistoryOutput } from "@/ai/flows/analyze-bet-history";
import { analyzeBetHistory } from "./actions";

export default function Home() {
  const [odds, setOdds] = React.useState<Odd[]>(initialOdds);
  const [userBetHistory, setUserBetHistory] = React.useState<Bet[]>(mockBetHistory);
  const [selectedOddForPrediction, setSelectedOddForPrediction] = React.useState<Odd | null>(null);
  const [selectedOddForStatistics, setSelectedOddForStatistics] = React.useState<Odd | null>(null);
  const [historicalAnalysis, setHistoricalAnalysis] = React.useState<AnalyzeBetHistoryOutput | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = React.useState(false);
  
  const [calculatorValues, setCalculatorValues] = React.useState<{
    sport: string;
    marketInfluences: string;
    odds?: number;
    key: number;
    userHistoryAnalysis?: string;
  }>({
    sport: "",
    marketInfluences: "",
    key: 0,
    userHistoryAnalysis: ""
  });


  React.useEffect(() => {
    if (odds.length > 0 && !selectedOddForStatistics) {
      const firstOdd = odds[0];
      handleSelectOddForStatistics(firstOdd);
    }
  }, []);

  const handleAddOdd = (newOdd: Odd) => {
    setOdds((prevOdds) => [...prevOdds, newOdd]);
  };
  
  const handleAddBet = (newBet: Bet) => {
    setUserBetHistory((prevHistory) => [...prevHistory, newBet]);
    if (selectedOddForStatistics) {
      // Re-run analysis if the new bet might be relevant
      runAnalysis(selectedOddForStatistics);
    }
  }

  const runAnalysis = async (odd: Odd) => {
    setIsAnalysisLoading(true);
    setHistoricalAnalysis(null);
    const analysisInput = {
      betHistory: userBetHistory,
      currentBetContext: {
        sport: odd.sport,
        teamA: odd.teamA,
        teamB: odd.teamB,
        marketInfluences: odd.marketInfluences.map(mi => mi.name).join(', ')
      }
    };
    const result = await analyzeBetHistory(analysisInput);
    if ("error" in result) {
      console.error(result.error);
      setHistoricalAnalysis(null);
    } else {
      setHistoricalAnalysis(result);
    }
    setIsAnalysisLoading(false);
  }

  const handleOpenPredictionModal = (odd: Odd) => {
    setSelectedOddForPrediction(odd);
  };

  const handleClosePredictionModal = () => {
    setSelectedOddForPrediction(null);
  };

  const handleSelectOddForStatistics = (odd: Odd) => {
    setSelectedOddForStatistics(odd);
    runAnalysis(odd);
     setCalculatorValues(prev => ({
      ...prev,
      sport: odd.sport,
      marketInfluences: odd.marketInfluences.map(mi => mi.name).join(', ') || 'None',
      key: Math.random() // Force re-render of calculator
    }));
  };
  
  React.useEffect(() => {
    if (historicalAnalysis) {
        setCalculatorValues(prev => ({
            ...prev,
            userHistoryAnalysis: historicalAnalysis.overallSummary,
            key: Math.random()
        }));
    }
  }, [historicalAnalysis]);

  const handleOddSelectForCalculator = (oddValue: number) => {
    setCalculatorValues(prev => ({
        ...prev,
        odds: oddValue,
        key: Math.random() // Force re-render of calculator
    }));
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <OddsTable
              odds={odds}
              onPredictClick={handleOpenPredictionModal}
              onRowClick={handleSelectOddForStatistics}
              onOddSelect={handleOddSelectForCalculator}
              selectedOddId={selectedOddForStatistics?.id}
            />
            {selectedOddForStatistics && (
              <DetailedStatistics 
                odd={selectedOddForStatistics} 
                historicalAnalysis={historicalAnalysis}
                isAnalysisLoading={isAnalysisLoading}
              />
            )}
             <MockDataInterface onAddOdd={handleAddOdd} onAddBet={handleAddBet} />
          </div>
          <aside className="lg:col-span-1 lg:sticky top-8 flex flex-col gap-8">
            <BetValueCalculator
                key={calculatorValues.key}
                initialValues={{
                    sport: calculatorValues.sport,
                    marketInfluences: calculatorValues.marketInfluences,
                    odds: calculatorValues.odds,
                    userHistoryAnalysis: calculatorValues.userHistoryAnalysis
                }}
            />
          </aside>
        </div>
      </main>
      {selectedOddForPrediction && (
        <PredictionAlertModal
          odd={selectedOddForPrediction}
          isOpen={!!selectedOddForPrediction}
          onClose={handleClosePredictionModal}
        />
      )}
    </div>
  );
}
