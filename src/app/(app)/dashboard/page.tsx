
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { opportunities as allOpportunities, contacts, leads, contracts, products } from "@/lib/data";
import { BarChart as BarChartIcon, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ThumbsUp, ThumbsDown, IndianRupee, Target, Clock, Filter, ChevronsUpDown, Check } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Opportunity } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { LifecycleSummary } from '@/components/lifecycle-summary';

const STAGES = ['Qualification', 'Proposal', 'Negotiation'] as const;
const STATUSES = ['New', 'In Progress', 'Won', 'Lost'];

const STAGE_COLORS: { [key: string]: string } = {
  Qualification: 'hsl(var(--chart-1))',
  Proposal: 'hsl(var(--chart-2))',
  Negotiation: 'hsl(var(--chart-3))',
  Won: 'hsl(var(--chart-4))',
  Lost: 'hsl(var(--chart-5))',
};

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [stageFilter, setStageFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const dashboardData = useMemo(() => {
    const openOpportunities = allOpportunities.filter(o => o.status === 'New' || o.status === 'In Progress');
    const wonOpportunities = allOpportunities.filter(o => o.status === 'Won');
    const lostOpportunities = allOpportunities.filter(o => o.status === 'Lost');
    
    const totalOpenValue = openOpportunities.reduce((sum, o) => sum + o.value, 0);
    const expectedValue = openOpportunities.reduce((sum, o) => sum + (o.value * o.winProbability), 0);
    
    const totalWonValue = wonOpportunities.reduce((sum, o) => sum + o.value, 0);
    const totalLostValue = lostOpportunities.reduce((sum, o) => sum + o.value, 0);

    const conversionRate = allOpportunities.length > 0 && (wonOpportunities.length + lostOpportunities.length > 0)
      ? wonOpportunities.length / (wonOpportunities.length + lostOpportunities.length)
      : 0;

    const timeTuWinDays = wonOpportunities.length > 0 
      ? Math.round(wonOpportunities.reduce((sum, o) => sum + differenceInDays(parseISO(o.closeDate), parseISO(o.createdDate)), 0) / wonOpportunities.length)
      : 0;
      
    const stageStats = STAGES.map(stage => {
        const stageOpps = openOpportunities.filter(o => o.stage === stage);
        return {
            stage,
            count: stageOpps.length,
            value: stageOpps.reduce((sum, o) => sum + o.value, 0),
        };
    });
    
    const pipelineChartData = [
      stageStats.reduce((acc, s) => {
        acc[s.stage] = s.value;
        return acc;
      }, { name: 'pipeline' } as Record<string, any>)
    ];

    const winLossAnalysis = STAGES.map(stage => {
        const closedStageOpps = allOpportunities.filter(o => (o.status === 'Won' || o.status === 'Lost') && o.stage === stage);
        return {
            stage,
            Won: closedStageOpps.filter(o => o.status === 'Won').length,
            Lost: closedStageOpps.filter(o => o.status === 'Lost').length,
        }
    });

    return {
      openOpportunities,
      wonOpportunities,
      lostOpportunities,
      totalOpenValue,
      expectedValue,
      totalWonValue,
      totalLostValue,
      conversionRate,
      timeTuWinDays,
      stageStats,
      pipelineChartData,
      winLossAnalysis,
    };
  }, []);

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(o => {
      const statusMatch = statusFilter.length === 0 || statusFilter.includes(o.status);
      const stageMatch = stageFilter.length === 0 || stageFilter.includes(o.stage);
      
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = !searchTerm || 
        o.name.toLowerCase().includes(searchTermLower) ||
        o.companyName.toLowerCase().includes(searchTermLower);

      return statusMatch && stageMatch && searchMatch;
    });
  }, [statusFilter, stageFilter, searchTerm]);

  const handleFilterToggle = (filterList: string[], setFilterList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    const currentIndex = filterList.indexOf(item);
    const newList = [...filterList];
    if (currentIndex === -1) {
      newList.push(item);
    } else {
      newList.splice(currentIndex, 1);
    }
    setFilterList(newList);
  };
  
  const getContactInfo = (contactName: string) => contacts.find(c => `${c.firstName} ${c.lastName}` === contactName);
  
  const getStatusVariant = (status: Opportunity['status']) => {
    if (status === 'Won') return 'default';
    if (status === 'Lost') return 'destructive';
    if (status === 'New') return 'outline';
    return 'secondary';
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <Header title="Sales Pipeline Tracker" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        <LifecycleSummary />
        
        {/* Top Row KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-baseline justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{dashboardData.totalOpenValue.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.openOpportunities.length} Open Opportunities</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-baseline justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Opportunities Won</CardTitle>
                    <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{dashboardData.totalWonValue.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.wonOpportunities.length} Opportunities</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-baseline justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Opportunities Lost</CardTitle>
                    <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{dashboardData.totalLostValue.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.lostOpportunities.length} Opportunities</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-baseline justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(dashboardData.conversionRate * 100).toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Based on won & lost deals</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-baseline justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time to Win</CardTitle>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.timeTuWinDays}</div>
                    <p className="text-xs text-muted-foreground">days</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Pipeline Breakdown</CardTitle>
                    <CardDescription>Value of open opportunities by stage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={30}>
                        <BarChartIcon layout="vertical" data={dashboardData.pipelineChartData} stackOffset="expand" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <XAxis type="number" hide domain={[0, 1]}/>
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const stage = payload[0].name;
                                        const value = payload[0].payload[stage!];
                                        const stageData = dashboardData.stageStats.find(s => s.stage === stage);

                                        return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <p className="font-bold">{stage}</p>
                                            <p className="text-sm">{`Count: ${stageData?.count}`}</p>
                                            <p className="text-sm">{`Value: ₹${value.toLocaleString('en-IN')}`}</p>
                                        </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {STAGES.map((stage, index) => (
                            <Bar 
                                key={stage} 
                                dataKey={stage} 
                                stackId="a" 
                                fill={STAGE_COLORS[stage]} 
                                radius={
                                    STAGES.length === 1 ? [4, 4, 4, 4] :
                                    index === 0 ? [4, 0, 0, 4] :
                                    index === STAGES.length - 1 ? [0, 4, 4, 0] : 0
                                }
                            />
                            ))}
                        </BarChartIcon>
                    </ResponsiveContainer>
                    <div className="flex justify-around text-center mt-4">
                        {dashboardData.stageStats.map(s => (
                            <div key={s.stage}>
                                <p className="text-sm text-muted-foreground">{s.stage}</p>
                                <p className="font-bold text-lg">₹{s.value.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-muted-foreground">{s.count} opportunities</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Analysis by Stage</CardTitle>
                <CardDescription>Number of deals won or lost at each stage.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChartIcon data={dashboardData.winLossAnalysis} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Won" stackId="a" fill={STAGE_COLORS['Won']} />
                    <Bar dataKey="Lost" stackId="a" fill={STAGE_COLORS['Lost']} radius={[4, 4, 0, 0]} />
                  </BarChartIcon>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
        
        {/* Table View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>
                  A filterable list of all sales opportunities in the pipeline.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Win %</TableHead>
                            <TableHead>Close Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredOpportunities.map((opp) => (
                            <TableRow key={opp.id}>
                            <TableCell className="font-medium">{opp.companyName}</TableCell>
                            <TableCell>{opp.contactName}</TableCell>
                            <TableCell>₹{opp.value.toLocaleString('en-IN')}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" style={{backgroundColor: STAGE_COLORS[opp.stage]}} className="text-white">{opp.stage}</Badge>
                            </TableCell>
                            <TableCell>{(opp.winProbability * 100).toFixed(0)}%</TableCell>
                            <TableCell>{format(parseISO(opp.closeDate), 'dd-MMM-yyyy')}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(opp.status)}>
                                {opp.status}
                                </Badge>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                 </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
             <Card>
                <CardHeader className="flex flex-row items-baseline gap-2 pb-4">
                    <Filter className="w-4 h-4" />
                    <CardTitle className="text-base">Filter & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="opp-search">Search</Label>
                        <Input 
                          id="opp-search"
                          placeholder="By opportunity or company..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {statusFilter.length > 0
                                ? `${statusFilter.length} selected`
                                : "Select status..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Filter status..." />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                  {STATUSES.map((status) => (
                                    <CommandItem
                                      key={status}
                                      onSelect={() => handleFilterToggle(statusFilter, setStatusFilter, status)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          statusFilter.includes(status) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <span>{status}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {statusFilter.length > 0 && (
                                  <>
                                    <Separator />
                                    <CommandGroup>
                                      <CommandItem onSelect={() => setStatusFilter([])} className="justify-center text-center">
                                        Clear filters
                                      </CommandItem>
                                    </CommandGroup>
                                  </>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label>Stage</Label>
                         <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {stageFilter.length > 0
                                ? `${stageFilter.length} selected`
                                : "Select stage..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Filter stages..." />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                  {STAGES.map((stage) => (
                                    <CommandItem
                                      key={stage}
                                      onSelect={() => handleFilterToggle(stageFilter, setStageFilter, stage)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          stageFilter.includes(stage) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <span>{stage}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {stageFilter.length > 0 && (
                                  <>
                                    <Separator />
                                    <CommandGroup>
                                      <CommandItem onSelect={() => setStageFilter([])} className="justify-center text-center">
                                        Clear filters
                                      </CommandItem>
                                    </CommandGroup>
                                  </>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
