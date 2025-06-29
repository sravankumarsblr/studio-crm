import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deals } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stageProgress: { [key: string]: number } = {
  'Qualification': 20,
  'Proposal': 50,
  'Negotiation': 75,
  'Closed Won': 100,
  'Closed Lost': 100,
};

const stageVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Qualification': 'outline',
  'Proposal': 'secondary',
  'Negotiation': 'default',
  'Closed Won': 'default',
  'Closed Lost': 'destructive',
};

export default function DealsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Deals" actionText="Add Deal" onActionClick={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.companyName}</TableCell>
                  <TableCell>${deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={stageVariant[deal.stage]}>{deal.stage}</Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={stageProgress[deal.stage]} className="h-2" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
