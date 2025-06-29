"use client";

import { useState } from 'react';
import { Gem, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { scoreLead } from '@/app/actions/score-lead';
import type { Lead } from '@/lib/data';
import type { AiScoreLeadsOutput } from '@/ai/flows/ai-lead-scoring';
import { Progress } from '@/components/ui/progress';

export function AiLeadScorer({ lead }: { lead: Lead }) {
  const [result, setResult] = useState<AiScoreLeadsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleScoreLead = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await scoreLead({ leadData: JSON.stringify(lead.leadData || {}) });
      setResult(res);
    } catch (e) {
      setError('Failed to score lead.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const scorePercentage = result ? Math.round(result.score * 100) : 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => {
          setIsOpen(true);
          handleScoreLead();
        }} disabled={isLoading}>
          {isLoading && isOpen ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Gem className="mr-2 h-4 w-4 text-primary" />
          )}
          {isLoading && isOpen ? 'Scoring...' : 'Score Lead'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">AI Lead Score</h4>
            <p className="text-sm text-muted-foreground">
              Likelihood of conversion for "{lead.name}".
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Analyzing lead data...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {result && (
            <div className="grid gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{scorePercentage}%</span>
                <span className="text-sm text-muted-foreground">Conversion Chance</span>
              </div>
              <Progress value={scorePercentage} className="h-2 [&>div]:bg-primary" />
              <div>
                <h5 className="font-semibold mt-4 mb-2 text-sm">Reasoning:</h5>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  {result.reasons.length > 0 ? result.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  )) : (
                    <li>No specific reasons provided.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
