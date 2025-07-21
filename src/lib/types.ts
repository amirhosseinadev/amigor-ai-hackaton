import type { LucideIcon } from "lucide-react";

export type MarketInfluenceId = "team_news" | "weather" | "market_trend" | "injury";

export type MarketInfluence = {
  id: MarketInfluenceId;
  name: "Team News" | "Weather" | "Market Trend" | "Injury";
  description: string;
  icon: LucideIcon;
};

export type Sport = "Soccer" | "Basketball" | "Tennis";
export type BetType = "Moneyline" | "Spread" | "Over/Under" | "Draw";

export type HistoricalComparisonDataPoint = {
    matchDate: string;
    teamA: number;
    teamB: number;
};

export type AvailabilityStatus = "Doubtful" | "Yes" | "Unclear" | "Likely sub";

export type PlayerStatus = {
    player: string;
    country: string;
    position: string;
    status: string;
    matches: number;
    role: string;
    availability: AvailabilityStatus;
};

export type Odd = {
  id: string;
  event: string;
  teamA: string;
  teamAOdds: number;
  teamB: string;
  teamBOdds: number;
  drawOdds?: number;
  sport: Sport;
  marketInfluences: MarketInfluence[];
  historicalOdds: string;
  marketInfluenceDetails: Partial<Record<MarketInfluenceId, string>>;
  historicalComparisonChartData: HistoricalComparisonDataPoint[];
  changesSinceLastMatch: string;
  playerStatusData: PlayerStatus[];
};

export type Bet = {
  id: string;
  sport: Sport;
  event: string;
  betType: BetType;
  betOn: string;
  stake: number;
  odds: number;
  outcome: "win" | "loss";
  date: string;
  marketCondition?: string;
};
