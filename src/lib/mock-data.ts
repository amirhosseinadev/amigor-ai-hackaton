import { Flame, CloudRain, Activity, TrendingUp } from "lucide-react";
import type { Odd, MarketInfluence } from "./types";

const allMarketInfluences: Record<string, MarketInfluence> = {
  team_news: {
    id: "team_news",
    name: "Team News",
    description: "Recent news or announcements related to the teams.",
    icon: Flame,
  },
  weather: {
    id: "weather",
    name: "Weather",
    description: "Weather conditions that might affect the game's outcome.",
    icon: CloudRain,
  },
  injury: {
    id: "injury",
    name: "Injury",
    description: "A key player is injured, potentially impacting team performance.",
    icon: Activity,
  },
  market_trend: {
    id: "market_trend",
    name: "Market Trend",
    description: "Significant betting volume or line movement in the market.",
    icon: TrendingUp,
  },
};

export const initialOdds: Odd[] = [
  {
    id: "1",
    sport: "Soccer",
    event: "Champions League Final",
    teamA: "Real Madrid",
    teamAOdds: 2.5,
    teamB: "Liverpool",
    teamBOdds: 3.0,
    drawOdds: 3.5,
    marketInfluences: [allMarketInfluences.injury, allMarketInfluences.market_trend],
    historicalOdds: "Historically, home teams in this matchup have a 60% win rate.",
  },
  {
    id: "2",
    sport: "Basketball",
    event: "NBA Finals Game 7",
    teamA: "LA Lakers",
    teamAOdds: 1.9,
    teamB: "Boston Celtics",
    teamBOdds: 2.1,
    marketInfluences: [allMarketInfluences.team_news],
    historicalOdds: "In the last 5 finals, the team with the higher regular season score won.",
  },
  {
    id: "3",
    sport: "Tennis",
    event: "Wimbledon Men's Final",
    teamA: "N. Djokovic",
    teamAOdds: 1.5,
    teamB: "C. Alcaraz",
    teamBOdds: 2.5,
    marketInfluences: [allMarketInfluences.weather],
    historicalOdds: "Djokovic has won 8 of the last 10 matches on grass courts.",
  },
  {
    id: "4",
    sport: "Soccer",
    event: "Premier League",
    teamA: "Man City",
    teamAOdds: 1.3,
    teamB: "Arsenal",
    teamBOdds: 5.5,
    drawOdds: 4.0,
    marketInfluences: [],
    historicalOdds: "Man City has not lost a home game against Arsenal in 5 years.",
  },
];

export const availableSports: Odd['sport'][] = ["Soccer", "Basketball", "Tennis"];
export const availableBetTypes = ["Moneyline", "Spread", "Over/Under"];
