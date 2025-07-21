"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import type { MarketInfluence, Odd } from "@/lib/types";
import { allMarketInfluences, availableSports } from "@/lib/mock-data";

type MockDataInterfaceProps = {
  onAddOdd: (newOdd: Odd) => void;
};

const marketInfluenceIds = Object.keys(allMarketInfluences) as [string, ...string[]];

const formSchema = z.object({
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
  changesSinceLastMatch: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const influenceList = Object.values(allMarketInfluences);

export function MockDataInterface({ onAddOdd }: MockDataInterfaceProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: "",
      sport: "Soccer",
      teamA: "",
      teamAOdds: 1.0,
      teamB: "",
      teamBOdds: 1.0,
      marketInfluences: [],
      marketInfluenceDetails: '{"injury": "Star player is out with a knee injury."}',
      historicalComparisonChartData: '[{"match":"Last Season","teamA":2,"teamB":1,"similar":true},{"match":"Two Seasons Ago","teamA":2,"teamB":2,"similar":false}]',
      changesSinceLastMatch: "Team A has a new coach and a stronger defense.",
    },
  });

  const onSubmit = (values: FormValues) => {
    const selectedInfluences: MarketInfluence[] = (values.marketInfluences || [])
        .map(id => allMarketInfluences[id])
        .filter(Boolean);

    let influenceDetails;
    try {
        influenceDetails = values.marketInfluenceDetails ? JSON.parse(values.marketInfluenceDetails) : {};
    } catch (e) {
        console.error("Invalid JSON for market influence details");
        influenceDetails = {};
    }

    let chartData;
    try {
        chartData = values.historicalComparisonChartData ? JSON.parse(values.historicalComparisonChartData) : [];
    } catch (e) {
        console.error("Invalid JSON for chart data");
        chartData = [];
    }

    const newOdd: Odd = {
      ...values,
      id: new Date().toISOString(),
      marketInfluences: selectedInfluences,
      marketInfluenceDetails: influenceDetails,
      historicalComparisonChartData: chartData,
      changesSinceLastMatch: values.changesSinceLastMatch || "",
      historicalOdds: "No historical data available for mock events.",
    };
    onAddOdd(newOdd);
    form.reset();
  };

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
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., World Cup Final" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSports.map((sport) => (
                              <SelectItem key={sport} value={sport}>
                                {sport}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="teamA"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team A</FormLabel>
                            <FormControl><Input placeholder="Name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="teamAOdds"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team A Odds</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="teamB"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team B</FormLabel>
                            <FormControl><Input placeholder="Name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="teamBOdds"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team B Odds</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="drawOdds"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Draw Odds (Optional)</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                  control={form.control}
                  name="marketInfluences"
                  render={() => (
                    <FormItem>
                      <FormLabel>Market Influences</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {influenceList.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="marketInfluences"
                            render={({ field }) => {
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
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketInfluenceDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Influence Details (JSON)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='e.g., {"injury": "Star player out for 2 weeks."}' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="historicalComparisonChartData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Chart Data (JSON)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='e.g., [{"match":"Last Season","teamA":2,"teamB":1,"similar":true}]' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="changesSinceLastMatch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Changes Since Last Match</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Team A has a new coach." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Mock Event
                </Button>
              </form>
            </Form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}