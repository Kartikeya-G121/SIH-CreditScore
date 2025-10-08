import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  MoreHorizontal,
  Flag,
  ShieldAlert,
  TrendingUp,
  MapPin,
  Filter,
} from 'lucide-react';
import { MOCK_BENEFICIARIES_LIST } from '@/lib/data';
import { StatCard } from '../shared/stat-card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';

const riskVariant: { [key: string]: 'default' | 'destructive' | 'outline' } = {
  Low: 'default',
  Medium: 'outline',
  High: 'destructive',
};
const riskColorClass = {
  Low: 'bg-accent text-accent-foreground',
  Medium: 'bg-yellow-500 text-white',
  High: 'bg-destructive text-destructive-foreground',
};

export default function OfficerDashboard() {
  const geoData = [
    { name: 'Maharashtra', repayment: 98 },
    { name: 'Gujarat', repayment: 92 },
    { name: 'Andhra', repayment: 85 },
    { name: 'UP', repayment: 95 },
    { name: 'Bihar', repayment: 88 },
    { name: 'Rajasthan', repayment: 99 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Top Performing Region"
          value="Rajasthan"
          icon={<TrendingUp className="h-4 w-4" />}
          description="99% repayment rate"
        />
        <StatCard
          title="Default Prediction Alert"
          value="3 High-Risk Profiles"
          icon={<ShieldAlert className="h-4 w-4 text-destructive" />}
          description="In West Bengal"
        />
        <StatCard
          title="Most Active Region"
          value="Maharashtra"
          icon={<MapPin className="h-4 w-4" />}
          description="Highest loan applications"
        />
      </div>

      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Beneficiaries</CardTitle>
            <CardDescription>
              A list of beneficiaries under your purview.
            </CardDescription>
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Loan Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_BENEFICIARIES_LIST.map((beneficiary) => (
                <TableRow key={beneficiary.id}>
                  <TableCell className="font-medium">
                    {beneficiary.name}
                  </TableCell>
                  <TableCell>{beneficiary.region}</TableCell>
                  <TableCell>{beneficiary.score}</TableCell>
                  <TableCell>
                    <Badge
                      variant={riskVariant[beneficiary.risk]}
                      className={riskColorClass[beneficiary.risk as keyof typeof riskColorClass]}
                    >
                      {beneficiary.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>{beneficiary.loanStage}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Flag className="mr-2 h-4 w-4" />
                          Flag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Request Verification</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Repayment by State (Mock Heatmap)</CardTitle>
          <CardDescription>Visualization of repayment rates across key states.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{ repayment: { label: "Repayment %", color: "hsl(var(--primary))"}}} className="h-[300px] w-full">
              <BarChart data={geoData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} />
                <XAxis type="number" hide />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="repayment" radius={5} fill="var(--color-repayment)" />
              </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
