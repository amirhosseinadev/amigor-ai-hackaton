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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateBetValue } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Shield, Lightbulb } from "lucide-react";
import { availableSports, availableBetTypes } from "@/lib/mock-data";

const formSchema = z.object({
  sport: z.string().min(1, "Sport is required"),
  betType: z.string().min(1, "Bet type is required"),
  odds: z.coerce.number().min(1, "Odds must be at least 1"),
  stake: z.coerce.number().positive("Stake must be a positive number"),
  marketInfluences: z.string().min(1, "Market influences are required"),
});

type FormValues = z.infer<typeof formSchema>;
type CalculationResult = {
    betValue: number;
    riskAssessment: string;
    suggestedAction: string;
};

export function BetValueCalculator() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sport: "",
      betType: "",
      odds: 1.5,
      stake: 10,
      marketInfluences: "No significant news, standard market conditions.",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    const response = await calculateBetValue(values);
    if ("error" in response) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    } else {
      setResult(response);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI Bet Value Calculator</CardTitle>
        <CardDescription>
          Estimate the value of your bet with our AI-powered tool.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <FormField
              control={form.control}
              name="betType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bet Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bet type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableBetTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="odds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odds</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stake ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="marketInfluences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Influences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Key player injury, bad weather..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Calculate Value
            </Button>
          </form>
        </Form>
        {result && (
            <Card className="mt-6 bg-secondary">
                <CardHeader>
                    <CardTitle className="text-lg">Calculation Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <TrendingUp className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Calculated Bet Value</p>
                            <p className="text-xl font-bold">${result.betValue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <Shield className="h-6 w-6 text-primary mt-1"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Risk Assessment</p>
                            <p>{result.riskAssessment}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                         <Lightbulb className="h-6 w-6 text-primary mt-1"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Suggested Action</p>
                            <p className="font-semibold">{result.suggestedAction}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
