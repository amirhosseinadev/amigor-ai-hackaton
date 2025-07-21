"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import type { MarketInfluence, Odd, Bet } from "@/lib/types";
import { allMarketInfluences, availableSports, availableBetTypes } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type MockDataInterfaceProps = {
  onAddOdd: (newOdd: Odd) => void;
  onAddBet: (newBet: Bet) => void;
};

const oddFormSchema = z.object({
  event: z.string().min(3, "Event name is too short"),
  sport: z.enum(availableSports),
  teamA: z.string().min(2, "Team name is too short"),
  teamAOdds: z.coerce.number().min(1),
  teamB: z.string().min(2, "Team name is too short"),
  teamBOdds: z.coerce.number().min(1),
  drawOdds: z.coerce.number().optional(),
  marketInfluences: z.array(z.string()).optional(),
  marketInfluenceDetails: z.string().optional(),
  historicalComparisonChartData: z.string().optional(),
  playerStatusData: z.string().optional(),
  changesSinceLastMatch: z.string().optional(),
});

const betFormSchema = z.object({
  event: z.string().min(3, "Event name is required"),
  sport: z.enum(availableSports),
  betType: z.enum(availableBetTypes),
  betOn: z.string().min(1, "Team/player bet on is required"),
  stake: z.coerce.number().positive(),
  odds: z.coerce.number().min(1),
  outcome: z.enum(["win", "loss"]),
  marketCondition: z.string().optional(),
});


type OddFormValues = z.infer<typeof oddFormSchema>;
type BetFormValues = z.infer<typeof betFormSchema>;
const influenceList = Object.values(allMarketInfluences);

export function MockDataInterface({ onAddOdd, onAddBet }: MockDataInterfaceProps) {
  const oddForm = useForm<OddFormValues>({
    resolver: zodResolver(oddFormSchema),
    defaultValues: {
      event: "La Liga Matchday 5",
      sport: "Soccer",
      teamA: "Barcelona",
      teamAOdds: 1.8,
      teamB: "Atletico Madrid",
      teamBOdds: 4.0,
      drawOdds: 3.6,
      marketInfluences: [],
      marketInfluenceDetails: '{"team_news": "Barcelona\'s key defender is returning from suspension."}',
      historicalComparisonChartData: '[{"matchDate":"Jan 2023","teamA":1,"teamB":0},{"matchDate":"Apr 2022","teamA":0,"teamB":1}]',
      playerStatusData: '[{"player":"Robert Lewandowski","country":"Barcelona","position":"FWD","status":"Fit","matches":5,"role":"Main Striker","availability":"Yes"}]',
      changesSinceLastMatch: "Atletico Madrid has adopted a more aggressive attacking formation this season.",
    },
  });

  const betForm = useForm<BetFormValues>({
      resolver: zodResolver(betFormSchema),
      defaultValues: {
        event: "Champions League Final",
        sport: "Soccer",
        betType: "Moneyline",
        betOn: "Real Madrid",
        stake: 20,
        odds: 2.5,
        outcome: "win",
        marketCondition: "Key Injury"
      }
  })

  const onOddSubmit = (values: OddFormValues) => {
    const selectedInfluences: MarketInfluence[] = (values.marketInfluences || [])
        .map(id => allMarketInfluences[id])
        .filter(Boolean);

    let influenceDetails, chartData, playerStatusData;
    
    try {
        influenceDetails = values.marketInfluenceDetails ? JSON.parse(values.marketInfluenceDetails) : {};
    } catch (e) {
        console.error("Invalid JSON for market influence details");
        influenceDetails = {};
    }

    try {
        chartData = values.historicalComparisonChartData ? JSON.parse(values.historicalComparisonChartData) : [];
    } catch (e) {
        console.error("Invalid JSON for chart data");
        chartData = [];
    }

    try {
        playerStatusData = values.playerStatusData ? JSON.parse(values.playerStatusData) : [];
    } catch (e) {
        console.error("Invalid JSON for player status data");
        playerStatusData = [];
    }


    const newOdd: Odd = {
      ...values,
      id: new Date().toISOString(),
      marketInfluences: selectedInfluences,
      marketInfluenceDetails: influenceDetails,
      historicalComparisonChartData: chartData,
      playerStatusData: playerStatusData,
      changesSinceLastMatch: values.changesSinceLastMatch || "",
      historicalOdds: "No historical data available for mock events.",
    };
    onAddOdd(newOdd);
    oddForm.reset();
  };

  const onBetSubmit = (values: BetFormValues) => {
    const newBet: Bet = {
        ...values,
        id: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
    };
    onAddBet(newBet);
    betForm.reset();
  }

  return (
    <Card className="shadow-lg">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className="flex w-full cursor-pointer items-center justify-between p-4">
             <div>
                <CardTitle>Mock Data Interface</CardTitle>
                <CardDescription>For development and testing purposes.</CardDescription>
             </div>
             <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="events">Add Event</TabsTrigger>
                    <TabsTrigger value="history">Add Bet History</TabsTrigger>
                </TabsList>
                <TabsContent value="events">
                    <CardContent className="pt-4">
                        <Form {...oddForm}>
                        <form onSubmit={oddForm.handleSubmit(onOddSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={oddForm.control} name="event" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Event Name</FormLabel>
                                <FormControl><Input placeholder="e.g., World Cup Final" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={oddForm.control} name="sport" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sport</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a sport" /></SelectTrigger></FormControl>
                                    <SelectContent>{availableSports.map((sport) => (<SelectItem key={sport} value={sport}>{sport}</SelectItem>))}</SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={oddForm.control} name="teamA" render={({ field }) => ( <FormItem><FormLabel>Team A</FormLabel><FormControl><Input placeholder="Name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={oddForm.control} name="teamAOdds" render={({ field }) => ( <FormItem><FormLabel>Team A Odds</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={oddForm.control} name="teamB" render={({ field }) => (<FormItem><FormLabel>Team B</FormLabel><FormControl><Input placeholder="Name" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={oddForm.control} name="teamBOdds" render={({ field }) => (<FormItem><FormLabel>Team B Odds</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            <FormField control={oddForm.control} name="drawOdds" render={({ field }) => (<FormItem><FormLabel>Draw Odds (Optional)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={oddForm.control} name="marketInfluences" render={() => (
                                <FormItem>
                                <FormLabel>Market Influences</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    {influenceList.map((item) => (
                                    <FormField key={item.id} control={oddForm.control} name="marketInfluences" render={({ field }) => {
                                        return (
                                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item.id])
                                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.name}</FormLabel>
                                        </FormItem>
                                        );
                                    }}/>
                                    ))}
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={oddForm.control} name="marketInfluenceDetails" render={({ field }) => (<FormItem><FormLabel>Market Influence Details (JSON)</FormLabel><FormControl><Textarea placeholder='e.g., {"injury": "Star player out for 2 weeks."}' {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={oddForm.control} name="historicalComparisonChartData" render={({ field }) => (<FormItem><FormLabel>Historical Chart Data (JSON)</FormLabel><FormControl><Textarea placeholder='e.g., [{"matchDate":"May 2022","teamA":2,"teamB":1}]' {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={oddForm.control} name="playerStatusData" render={({ field }) => (<FormItem><FormLabel>Player Status Data (JSON)</FormLabel><FormControl><Textarea placeholder='e.g., [{"player":"John Doe","country":"Team A",...}]' {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={oddForm.control} name="changesSinceLastMatch" render={({ field }) => (<FormItem><FormLabel>Changes Since Last Match</FormLabel><FormControl><Textarea placeholder="e.g., Team A has a new coach." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <Button type="submit" className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Add Mock Event</Button>
                        </form>
                        </Form>
                    </CardContent>
                </TabsContent>
                <TabsContent value="history">
                     <CardContent className="pt-4">
                        <Form {...betForm}>
                        <form onSubmit={betForm.handleSubmit(onBetSubmit)} className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={betForm.control} name="event" render={({ field }) => (<FormItem><FormLabel>Event Name</FormLabel><FormControl><Input placeholder="e.g., World Cup Final" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={betForm.control} name="sport" render={({ field }) => (<FormItem><FormLabel>Sport</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{availableSports.map((sport) => (<SelectItem key={sport} value={sport}>{sport}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={betForm.control} name="betType" render={({ field }) => (<FormItem><FormLabel>Bet Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{availableBetTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                <FormField control={betForm.control} name="betOn" render={({ field }) => (<FormItem><FormLabel>Bet On (Team/Player)</FormLabel><FormControl><Input placeholder="e.g., Real Madrid" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={betForm.control} name="stake" render={({ field }) => (<FormItem><FormLabel>Stake ($)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={betForm.control} name="odds" render={({ field }) => (<FormItem><FormLabel>Odds</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={betForm.control} name="outcome" render={({ field }) => (<FormItem><FormLabel>Outcome</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="win">Win</SelectItem><SelectItem value="loss">Loss</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                                <FormField control={betForm.control} name="marketCondition" render={({ field }) => (<FormItem><FormLabel>Market Condition (Optional)</FormLabel><FormControl><Input placeholder="e.g., Rainy, Key Injury" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            <Button type="submit" className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Add Bet to History</Button>
                        </form>
                        </Form>
                     </CardContent>
                </TabsContent>
            </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
