"use client";

import * as React from "react";
import { OddsTable } from "@/components/odds-table";
import { BetValueCalculator } from "@/components/bet-value-calculator";
import { Header } from "@/components/layout/header";
import { MockDataInterface } from "@/components/mock-data-interface";
import type { Odd } from "@/lib/types";
import { initialOdds } from "@/lib/mock-data";
import { PredictionAlertModal } from "@/components/prediction-alert-modal";

export default function Home() {
  const [odds, setOdds] = React.useState<Odd[]>(initialOdds);
  const [selectedOddForPrediction, setSelectedOddForPrediction] = React.useState<Odd | null>(null);

  const handleAddOdd = (newOdd: Odd) => {
    setOdds((prevOdds) => [...prevOdds, newOdd]);
  };

  const handleOpenPredictionModal = (odd: Odd) => {
    setSelectedOddForPrediction(odd);
  };

  const handleClosePredictionModal = () => {
    setSelectedOddForPrediction(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <OddsTable odds={odds} onPredictClick={handleOpenPredictionModal} />
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
