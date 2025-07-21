"use client";

import * as React from "react";
import { OddsTable } from "@/components/odds-table";
import { BetValueCalculator } from "@/components/bet-value-calculator";
import { Header } from "@/components/layout/header";
import { MockDataInterface } from "@/components/mock-data-interface";
import type { Odd } from "@/lib/types";
import { initialOdds } from "@/lib/mock-data";
import { PredictionAlertModal } from "@/components/prediction-alert-modal";
import { DetailedStatistics } from "@/components/detailed-statistics";

export default function Home() {
  const [odds, setOdds] = React.useState<Odd[]>(initialOdds);
  const [selectedOddForPrediction, setSelectedOddForPrediction] = React.useState<Odd | null>(null);
  const [selectedOddForStatistics, setSelectedOddForStatistics] = React.useState<Odd | null>(null);
  const [calculatorValues, setCalculatorValues] = React.useState<{
    sport: string;
    marketInfluences: string;
    odds?: number;
    key: number;
  }>({
    sport: "",
    marketInfluences: "",
    key: 0,
  });


  React.useEffect(() => {
    if (odds.length > 0 && !selectedOddForStatistics) {
      const firstOdd = odds[0];
      setSelectedOddForStatistics(firstOdd);
      setCalculatorValues({
        sport: firstOdd.sport,
        marketInfluences: firstOdd.marketInfluences.map((mi) => mi.name).join(", ") || "None",
        odds: firstOdd.teamAOdds,
        key: Math.random(),
      });
    }
  }, [odds, selectedOddForStatistics]);


  const handleAddOdd = (newOdd: Odd) => {
    setOdds((prevOdds) => [...prevOdds, newOdd]);
  };

  const handleOpenPredictionModal = (odd: Odd) => {
    setSelectedOddForPrediction(odd);
  };

  const handleClosePredictionModal = () => {
    setSelectedOddForPrediction(null);
  };

  const handleSelectOddForStatistics = (odd: Odd) => {
    setSelectedOddForStatistics(odd);
     setCalculatorValues(prev => ({
      ...prev,
      sport: odd.sport,
      marketInfluences: odd.marketInfluences.map(mi => mi.name).join(', ') || 'None',
      key: Math.random() // Force re-render of calculator
    }));
  };

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
            {selectedOddForStatistics && <DetailedStatistics odd={selectedOddForStatistics} />}
            <MockDataInterface onAddOdd={handleAddOdd} />
          </div>
          <aside className="lg:col-span-1 lg:sticky top-8">
            <BetValueCalculator
                key={calculatorValues.key}
                initialValues={{
                    sport: calculatorValues.sport,
                    marketInfluences: calculatorValues.marketInfluences,
                    odds: calculatorValues.odds
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
