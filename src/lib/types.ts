import type { LucideIcon } from "lucide-react";

export type MarketInfluenceId = "team_news" | "weather" | "market_trend" | "injury";

export type MarketInfluence = {
  id: MarketInfluenceId;
  name: "Team News" | "Weather" | "Market Trend" | "Injury";
  description: string;
  icon: LucideIcon;
};

export type Sport = "Soccer" | "Basketball" | "Tennis";

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
};
