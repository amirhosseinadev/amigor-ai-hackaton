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

  React.useEffect(() => {
    if (odds.length > 0 && !selectedOddForStatistics) {
      setSelectedOddForStatistics(odds[0]);
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
              selectedOddId={selectedOddForStatistics?.id}
            />
            {selectedOddForStatistics && <DetailedStatistics odd={selectedOddForStatistics} />}
            <MockDataInterface onAddOdd={handleAddOdd} />
          </div>
          <aside className="lg:col-span-1 lg:sticky top-8">
            <BetValueCalculator />
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