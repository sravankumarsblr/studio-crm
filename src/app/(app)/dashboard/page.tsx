"use client";

import { Header } from "@/components/header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, FileText, Package } from "lucide-react";
import { leads, deals, contracts, products } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { stage: 'Lead', count: products.filter(p => p.lifecycleStage === 'Lead').length, fill: "var(--color-lead)" },
  { stage: 'Deal', count: products.filter(p => p.lifecycleStage === 'Deal').length, fill: "var(--color-deal)" },
  { stage: 'Contract', count: products.filter(p => p.lifecycleStage === 'Contract').length, fill: "var(--color-contract)" },
];

const chartConfig = {
  count: {
    label: "Products",
  },
  lead: {
    label: "Lead",
    color: "hsl(var(--chart-1))",
  },
  deal: {
    label: "Deal",
    color: "hsl(var(--chart-2))",
  },
  contract: {
    label: "Contract",
    color: "hsl(var(--chart-3))",
  },
};

export default function DashboardPage() {
  const totalLeadValue = leads.reduce((acc, lead) => acc + lead.value, 0);
  const totalDealValue = deals.reduce((acc, deal) => acc + deal.value, 0);

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">
                ${totalLeadValue.toLocaleString()} total value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Deals</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deals.length}</div>
              <p className="text-xs text-muted-foreground">
                ${totalDealValue.toLocaleString()} in pipeline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contracts.length}</div>
              <p className="text-xs text-muted-foreground">
                {contracts.filter(c => c.status === 'Active').length} currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tracked Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all stages
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Lifecycle Overview</CardTitle>
              <CardDescription>Number of products in each stage of the sales lifecycle.</CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="count" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>A quick look at the newest leads in the pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.slice(0, 3).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>${lead.value.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline">{lead.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
