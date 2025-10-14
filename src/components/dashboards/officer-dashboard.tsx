'use client';
import { useState, useMemo } from 'react';
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  MoreHorizontal,
  Flag,
  ShieldAlert,
  TrendingUp,
  MapPin,
  Filter,
  FileText,
  AlertCircle,
  ThumbsUp,
  Meh,
} from 'lucide-react';
import { MOCK_BENEFICIARIES_LIST } from '@/lib/data';
import { StatCard } from '../shared/stat-card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';

type Beneficiary = typeof MOCK_BENEFICIARIES_LIST[0];

const riskVariant: { [key: string]: 'default' | 'destructive' | 'outline' } = {
  Low: 'default',
  Medium: 'outline',
  High: 'destructive',
};
const riskColorClass = {
  Low: 'bg-green-600 text-white',
  Medium: 'bg-yellow-500 text-white',
  High: 'bg-destructive text-destructive-foreground',
};
const riskIcon = {
    Low: <ThumbsUp className="h-5 w-5 text-green-600" />,
    Medium: <Meh className="h-5 w-5 text-yellow-500" />,
    High: <AlertCircle className="h-5 w-5 text-destructive" />
}

function RiskAnalysisDialog({ beneficiary }: { beneficiary: Beneficiary | null }) {
    if (!beneficiary) return null;
    const risk = beneficiary.risk as keyof typeof riskIcon;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    {riskIcon[risk]}
                    Risk Analysis for {beneficiary.name}
                </DialogTitle>
                <DialogDescription>
                    AI-generated insights into the beneficiary's credit risk profile.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="flex justify-around rounded-lg bg-muted p-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">AI Score</p>
                        <p className="text-2xl font-bold">{beneficiary.score}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Risk Level</p>
                        <div className="text-2xl font-bold flex items-center gap-2 justify-center">
                             <Badge
                                variant={riskVariant[beneficiary.risk]}
                                className={riskColorClass[beneficiary.risk as keyof typeof riskColorClass]}
                                >
                                {beneficiary.risk}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Key Risk Factors:</h4>
                    <ul className="space-y-2 list-disc list-inside">
                        {beneficiary.riskFactors.map((factor, index) => (
                            <li key={index} className="text-sm text-foreground">{factor}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </DialogContent>
    )
}

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState(MOCK_BENEFICIARIES_LIST);
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateLoanStage = (beneficiaryId: string, stage: 'Approved' | 'Flagged') => {
    setBeneficiaries(prev => 
        prev.map(b => 
            b.id === beneficiaryId ? { ...b, loanStage: stage } : b
        )
    );
    toast({
        title: `Beneficiary ${stage}`,
        description: `The loan application has been marked as ${stage}.`
    });
  };

  const handleViewRiskAnalysis = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDialogOpen(true);
  }

  const geoData = [
    { name: 'Maharashtra', repayment: 98 },
    { name: 'Gujarat', repayment: 92 },
    { name: 'Andhra', repayment: 85 },
    { name: 'UP', repayment: 95 },
    { name: 'Bihar', repayment: 88 },
    { name: 'Rajasthan', repayment: 99 },
  ];

  const filteredBeneficiaries = useMemo(() => {
    if (riskFilter === 'All') {
      return beneficiaries;
    }
    return beneficiaries.filter(b => b.risk === riskFilter);
  }, [beneficiaries, riskFilter]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Top Performing Region"
          value="Rajasthan"
          icon={<TrendingUp className="h-4 w-4" />}
          description="99% repayment rate"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
        <StatCard
          title="Default Prediction Alert"
          value="3 High-Risk Profiles"
          icon={<ShieldAlert className="h-4 w-4 text-destructive" />}
          description="In West Bengal"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
        <StatCard
          title="Most Active Region"
          value="Maharashtra"
          icon={<MapPin className="h-4 w-4" />}
          description="Highest loan applications"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
      </div>

      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>{t('officer_beneficiaries_title')}</CardTitle>
            <CardDescription>
              {t('officer_beneficiaries_desc')}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> {t('officer_filter')}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Risk</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={riskFilter} onValueChange={setRiskFilter}>
                    <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Low">Low</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="High">High</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t('officer_table_beneficiary')}</TableHead>
                        <TableHead>{t('officer_table_region')}</TableHead>
                        <TableHead>{t('officer_table_ai_score')}</TableHead>
                        <TableHead>{t('officer_table_risk')}</TableHead>
                        <TableHead>{t('officer_table_loan_stage')}</TableHead>
                        <TableHead className="text-right">{t('officer_table_actions')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredBeneficiaries.map((beneficiary) => (
                        <TableRow key={beneficiary.id} className="transition-colors hover:bg-muted/50">
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
                                    <DropdownMenuItem onSelect={() => handleUpdateLoanStage(beneficiary.id, 'Approved')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onSelect={() => handleUpdateLoanStage(beneficiary.id, 'Flagged')}
                                    >
                                    <Flag className="mr-2 h-4 w-4" />
                                    Flag
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                   
                                    <DropdownMenuItem onSelect={() => handleViewRiskAnalysis(beneficiary)}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Risk Analysis
                                    </DropdownMenuItem>
                                   
                                    <DropdownMenuItem>Request Verification</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                           
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <RiskAnalysisDialog beneficiary={selectedBeneficiary} />
            </Dialog>
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
