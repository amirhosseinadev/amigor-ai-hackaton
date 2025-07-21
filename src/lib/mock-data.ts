import { Flame, CloudRain, Activity, TrendingUp } from "lucide-react";
import type { Odd, MarketInfluence, Bet } from "./types";

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
        { matchDate: "May 2022", teamA: 1, teamB: 0 },
        { matchDate: "May 2018", teamA: 3, teamB: 1 },
        { matchDate: "Feb 2009", teamA: 0, teamB: 4 },
        { matchDate: "Mar 2009", teamA: 1, teamB: 0 },
        { matchDate: "Nov 2014", teamA: 1, teamB: 0 },
    ],
    playerStatusData: [
        { player: "Mohamed Salah", country: "Liverpool", position: "FW", status: "Ankle sprain; game-time decision", matches: 38, role: "Star striker, top scorer", availability: "Doubtful" },
        { player: "Virgil van Dijk", country: "Liverpool", position: "CB", status: "Fit to play", matches: 35, role: "Defensive core, Captain", availability: "Yes" },
        { player: "Karim Benzema", country: "Real Madrid", position: "CF", status: "Fully fit", matches: 40, role: "Playmaker, clinical finisher", availability: "Yes" },
        { player: "Luka Modrić", country: "Real Madrid", position: "Midfielder", status: "Knee recovery; easing back in", matches: 32, role: "Engine room, goal threat", availability: "Likely sub" },
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
        { matchDate: "Game 6", teamA: 101, teamB: 112 },
        { matchDate: "Game 5", teamA: 108, teamB: 99 },
        { matchDate: "Last Season", teamA: 95, teamB: 120 }
    ],
    playerStatusData: [],
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
        { matchDate: "French Open", teamA: 2, teamB: 3 },
        { matchDate: "ATP Finals", teamA: 3, teamB: 1 }
    ],
    playerStatusData: [],
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
        { matchDate: "FA Cup", teamA: 1, teamB: 2 },
        { matchDate: "Last Season (H)", teamA: 4, teamB: 1 },
        { matchDate: "Last Season (A)", teamA: 3, teamB: 1 }
    ],
    playerStatusData: [],
    changesSinceLastMatch: "Arsenal has signed a world-class defender, strengthening their back line."
  },
];

export const userBetHistory: Bet[] = [
    { id: "hist1", sport: "Soccer", event: "Premier League", betType: "Moneyline", betOn: "Man City", stake: 20, odds: 1.5, outcome: "win", date: "2023-10-01" },
    { id: "hist2", sport: "Soccer", event: "La Liga", betType: "Moneyline", betOn: "Real Madrid", stake: 10, odds: 2.1, outcome: "win", date: "2023-10-02" },
    { id: "hist3", sport: "Basketball", event: "NBA", betType: "Over/Under", betOn: "Over 210.5", stake: 15, odds: 1.9, outcome: "loss", date: "2023-10-03" },
    { id: "hist4", sport: "Soccer", event: "Serie A", betType: "Draw", betOn: "Draw", stake: 5, odds: 3.5, outcome: "loss", date: "2023-10-04" },
    { id: "hist5", sport: "Soccer", event: "Champions League", betType: "Moneyline", betOn: "Liverpool", stake: 25, odds: 2.8, outcome: "loss", date: "2023-10-05", marketCondition: "Injury" },
    { id: "hist6", sport: "Soccer", event: "FA Cup", betType: "Moneyline", betOn: "Man City", stake: 10, odds: 1.3, outcome: "win", date: "2023-11-01" },
    { id: "hist7", sport: "Tennis", event: "US Open", betType: "Moneyline", betOn: "N. Djokovic", stake: 50, odds: 1.2, outcome: "win", date: "2023-11-05" },
    { id: "hist8", sport: "Soccer", event: "Friendly", betType: "Moneyline", betOn: "Liverpool", stake: 10, odds: 2.2, outcome: "win", date: "2023-11-10", marketCondition: "Injury" },
    { id: "hist9", sport: "Soccer", event: "Champions League", betType: "Moneyline", betOn: "Real Madrid", stake: 30, odds: 1.8, outcome: "win", date: "2023-09-15" },
    { id: "hist10", sport: "Soccer", event: "Exhibition", betType: "Moneyline", betOn: "Real Madrid", stake: 15, odds: 1.5, outcome: "loss", date: "2023-09-01", marketCondition: "Market Trend" },
    { id: "hist11", sport: "Soccer", event: "Premier League", betType: "Moneyline", betOn: "Liverpool", stake: 20, odds: 2.5, outcome: "loss", date: "2023-08-20", marketCondition: "Injury" },
    { id: "hist12", sport: "Soccer", event: "La Liga", betType: "Moneyline", betOn: "Real Madrid", stake: 25, odds: 2.0, outcome: "win", date: "2023-08-10" },
    { id: "hist13", sport: "Basketball", event: "Regular Season", betType: "Moneyline", betOn: "LA Lakers", stake: 40, odds: 1.7, outcome: "win", date: "2023-12-01" },
    { id: "hist14", sport: "Basketball", event: "Regular Season", betType: "Moneyline", betOn: "Boston Celtics", stake: 20, odds: 2.2, outcome: "loss", date: "2023-12-05", marketCondition: "Team News" },
    { id: "hist15", sport: "Basketball", event: "Regular Season", betType: "Moneyline", betOn: "LA Lakers", stake: 10, odds: 1.9, outcome: "win", date: "2023-11-20" },
    { id: "hist16", sport: "Tennis", event: "Australian Open", betType: "Moneyline", betOn: "C. Alcaraz", stake: 30, odds: 2.3, outcome: "loss", date: "2024-01-20", marketCondition: "Weather" },
    { id: "hist17", sport: "Soccer", event: "Premier League", betType: "Moneyline", betOn: "Man City", stake: 100, odds: 1.2, outcome: "win", date: "2024-02-10" },
    { id: "hist18", sport: "Soccer", event: "FA Cup", betType: "Moneyline", betOn: "Arsenal", stake: 15, odds: 3.5, outcome: "loss", date: "2024-02-18" },
    { id: "hist19", sport: "Soccer", event: "League Cup", betType: "Moneyline", betOn: "Arsenal", stake: 20, odds: 2.8, outcome: "win", date: "2024-01-15" }
]

export const availableSports: readonly ["Soccer", "Basketball", "Tennis"] = ["Soccer", "Basketball", "Tennis"];
export const availableBetTypes: readonly ["Moneyline", "Spread", "Over/Under", "Draw"] = ["Moneyline", "Spread", "Over/Under", "Draw"];
