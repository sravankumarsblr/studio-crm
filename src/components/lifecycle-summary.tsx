
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Briefcase, FileText, ChevronRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LifecycleSummary() {
  const stages = [
    { name: "Leads", description: "Initial interest from potential customers.", icon: Users },
    { name: "Opportunities", description: "Qualified leads become active sales opportunities.", icon: Briefcase },
    { name: "Contracts", description: "Won opportunities are converted into formal contracts.", icon: FileText },
  ];

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <CardTitle className="text-base font-semibold">Sales Lifecycle at a Glance</CardTitle>
          <p className="text-xs text-muted-foreground">
            Follow the journey from initial lead, through the sales opportunity, to a finalized contract.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <TooltipProvider>
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {stages.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-1 text-center cursor-default">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <stage.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-medium">{stage.name}</h3>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{stage.description}</p>
                  </TooltipContent>
                </Tooltip>

                {index < stages.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
