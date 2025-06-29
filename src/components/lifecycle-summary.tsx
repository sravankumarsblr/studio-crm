
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
    { name: "Deals", description: "Qualified leads become active sales opportunities.", icon: Briefcase },
    { name: "Contracts", description: "Won deals are converted into formal contracts.", icon: FileText },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Lifecycle at a Glance</CardTitle>
        <CardDescription>Follow a customer's journey from initial contact to a signed contract.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex items-center justify-center gap-4 md:gap-12 py-4">
            {stages.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 text-center cursor-default">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                        <stage.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold">{stage.name}</h3>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{stage.description}</p>
                  </TooltipContent>
                </Tooltip>

                {index < stages.length - 1 && (
                  <ChevronRight className="w-8 h-8 text-muted-foreground shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
