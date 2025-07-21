import { Flame, CloudRain, Activity, TrendingUp } from "lucide-react";
import type { Odd, MarketInfluence } from "./types";

export const allMarketInfluences: Record<string, MarketInfluence> = {
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
    marketInfluenceDetails: {
        injury: "Liverpool's star striker is questionable with an ankle sprain sustained in training.",
        market_trend: "A large volume of bets have come in on Real Madrid in the last 24 hours."
    },
    historicalComparisonChartData: [
        { match: "2022 Final", teamA: 1, teamB: 0, similar: true },
        { match: "2018 Final", teamA: 3, teamB: 1, similar: false },
        { match: "2009 Group", teamA: 0, teamB: 4, similar: false }
    ],
    changesSinceLastMatch: "Real Madrid has integrated two new midfielders, while Liverpool has a new defensive coach."
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
    marketInfluenceDetails: {
        team_news: "Reports suggest internal conflict within the Celtics' coaching staff."
    },
    historicalComparisonChartData: [
        { match: "Game 6", teamA: 101, teamB: 112, similar: true },
        { match: "Game 5", teamA: 108, teamB: 99, similar: true },
        { match: "Last Season", teamA: 95, teamB: 120, similar: false }
    ],
    changesSinceLastMatch: "Lakers' key player has recovered from a minor injury that kept him out of their last regular season matchup."
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
    marketInfluenceDetails: {
        weather: "Forecast predicts high humidity and potential for rain delays, which historically favors Alcaraz's endurance."
    },
    historicalComparisonChartData: [
        { match: "French Open", teamA: 2, teamB: 3, similar: false },
        { match: "ATP Finals", teamA: 3, teamB: 1, similar: true }
    ],
    changesSinceLastMatch: "Alcaraz has shown significant improvement in his grass court game this season."
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
    marketInfluenceDetails: {},
    historicalComparisonChartData: [
        { match: "FA Cup", teamA: 1, teamB: 2, similar: false },
        { match: "Last Season (H)", teamA: 4, teamB: 1, similar: true },
        { match: "Last Season (A)", teamA: 3, teamB: 1, similar: false }
    ],
    changesSinceLastMatch: "Arsenal has signed a world-class defender, strengthening their back line."
  },
];

export const availableSports: Odd['sport'][] = ["Soccer", "Basketball", "Tennis"];
export const availableBetTypes = ["Moneyline", "Spread", "Over/Under"];