
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Briefcase, FileText, ChevronRight } from "lucide-react"

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
        <div className="grid gap-8 md:grid-cols-3">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.name}>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                  <stage.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{stage.name}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

    