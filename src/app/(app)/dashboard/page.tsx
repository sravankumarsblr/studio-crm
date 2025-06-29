
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { opportunities as allOpportunities, contacts } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ThumbsUp, ThumbsDown, DollarSign, Target, Clock, Filter } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Opportunity } from '@/lib/data';

const STAGES = ['Qualification', 'Proposal', 'Negotiation'];
const STATUSES = ['Open', 'Won', 'Lost'];

const STAGE_COLORS: { [key: string]: string } = {
  Qualification: 'hsl(var(--chart-1))',
  Proposal: 'hsl(var(--chart-2))',
  Negotiation: 'hsl(var(--chart-3))',
  'Closed Won': 'hsl(var(--chart-4))',
  'Closed Lost': 'hsl(var(--chart-5))',
};

const getStatus = (stage: Opportunity['stage']) => {
  if (stage === 'Closed Won') return 'Won';
  if (stage === 'Closed Lost') return 'Lost';
  return 'Open';
};

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [stageFilter, setStageFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const dashboardData = useMemo(() => {
    const openOpportunities = allOpportunities.filter(o => getStatus(o.stage) === 'Open');
    const wonOpportunities = allOpportunities.filter(o => getStatus(o.stage) === 'Won');
    const lostOpportunities = allOpportunities.filter(o => getStatus(o.stage) === 'Lost');
    
    const totalOpenValue = openOpportunities.reduce((sum, o) => sum + o.value, 0);
    const expectedValue = openOpportunities.reduce((sum, o) => sum + (o.value * o.winProbability), 0);
    
    const totalWonValue = wonOpportunities.reduce((sum, o) => sum + o.value, 0);
    const totalLostValue = lostOpportunities.reduce((sum, o) => sum + o.value, 0);

    const conversionRate = allOpportunities.length > 0 
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
    };
  }, []);

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(o => {
      const opportunityStatus = getStatus(o.stage);
      const statusMatch = statusFilter.length === 0 || statusFilter.includes(opportunityStatus);
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
  
  const getContactInfo = (contactName: string) => contacts.find(c => c.name === contactName);

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <Header title="Sales Pipeline Tracker" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* Top Row KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{dashboardData.totalOpenValue.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.openOpportunities.length} Open Opportunities</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
                    <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{dashboardData.totalWonValue.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.wonOpportunities.length} Deals</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Deals Lost</CardTitle>
                    <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{dashboardData.totalLostValue.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">{dashboardData.lostOpportunities.length} Deals</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(dashboardData.conversionRate * 100).toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Avg. {dashboardData.timeTuWinDays} days to win</p>
                </CardContent>
            </Card>
        </div>
        
        {/* Pipeline Breakdown */}
        <Card>
            <CardHeader>
                <CardTitle>Pipeline Breakdown</CardTitle>
                <CardDescription>Value of open opportunities by stage.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={30}>
                     <BarChart layout="vertical" data={dashboardData.pipelineChartData} stackOffset="expand" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
                    </BarChart>
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
                                <Badge style={{backgroundColor: STAGE_COLORS[opp.stage]}} className="text-white">{opp.stage}</Badge>
                            </TableCell>
                            <TableCell>{(opp.winProbability * 100).toFixed(0)}%</TableCell>
                            <TableCell>{format(parseISO(opp.closeDate), 'dd-MMM-yyyy')}</TableCell>
                            <TableCell>
                                <Badge variant={getStatus(opp.stage) === 'Won' ? 'default' : getStatus(opp.stage) === 'Lost' ? 'destructive' : 'secondary'}>
                                {getStatus(opp.stage)}
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
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
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
                        <div className="flex flex-col gap-2">
                           {STATUSES.map(status => (
                            <Button
                                key={status}
                                variant={statusFilter.includes(status) ? "default" : "outline"}
                                onClick={() => handleFilterToggle(statusFilter, setStatusFilter, status)}
                                className="w-full justify-start"
                            >
                                {status}
                            </Button>
                           ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Stage</Label>
                        <div className="flex flex-col gap-2">
                           {[...STAGES, 'Closed Won', 'Closed Lost'].map(stage => (
                             <Button
                                key={stage}
                                variant={stageFilter.includes(stage) ? "default" : "outline"}
                                onClick={() => handleFilterToggle(stageFilter, setStageFilter, stage)}
                                className="w-full justify-start"
                            >
                                {stage}
                            </Button>
                           ))}
                        </div>
                    </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
