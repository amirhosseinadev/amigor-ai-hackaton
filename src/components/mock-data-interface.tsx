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
import type { Odd } from "@/lib/types";
import { availableSports } from "@/lib/mock-data";

type MockDataInterfaceProps = {
  onAddOdd: (newOdd: Odd) => void;
};

const formSchema = z.object({
  event: z.string().min(3, "Event name is too short"),
  sport: z.enum(availableSports),
  teamA: z.string().min(2, "Team name is too short"),
  teamAOdds: z.coerce.number().min(1),
  teamB: z.string().min(2, "Team name is too short"),
  teamBOdds: z.coerce.number().min(1),
  drawOdds: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
    },
  });

  const onSubmit = (values: FormValues) => {
    const newOdd: Odd = {
      ...values,
      id: new Date().toISOString(),
      marketInfluences: [],
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
