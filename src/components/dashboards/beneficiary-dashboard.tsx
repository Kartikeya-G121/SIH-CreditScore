'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  IndianRupee,
  Languages,
  Lightbulb,
  MoreHorizontal,
  ThumbsUp,
  UploadCloud,
  FileText,
} from 'lucide-react';

import { MOCK_BENEFICIARY_DATA, type User } from '@/lib/data';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useRouter } from 'next/navigation';
import BillUpload from './bill-upload';
import { type BillParserOutput } from '@/ai/flows/bill-parser';

const chartConfig: ChartConfig = {
  essential: {
    label: 'Essential',
    color: 'hsl(var(--chart-1))',
  },
  discretionary: {
    label: 'Discretionary',
    color: 'hsl(var(--chart-2))',
  },
};

const repaymentChartConfig: ChartConfig = {
    paid: { label: "Paid", color: "hsl(var(--chart-2))" },
    due: { label: "Due", color: "hsl(var(--chart-1))" },
}

export default function BeneficiaryDashboard({ activeTab = 'overview' }: { activeTab?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [savedBills, setSavedBills] = useState<BillParserOutput[]>([]);

  const {
    creditScore,
    riskLevel,
    insights,
    repaymentSchedule,
    consumptionBehavior,
    repaymentTrends,
    financialAdvice,
  } = MOCK_BENEFICIARY_DATA;

  const scorePercentage = (creditScore / 1000) * 100;
  
  const handleTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`, { scroll: false });
  };
  
  const handleSaveBill = (bill: BillParserOutput) => {
    setSavedBills(prev => [...prev, bill]);
  };


  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="overview">
      <TabsContent value="overview" className="space-y-6 mt-0">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Welcome, {user?.name.split(' ')[0]}!</CardTitle>
              <CardDescription>Your financial summary.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: scorePercentage }, { value: 100 - scorePercentage }]}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={450}
                      cornerRadius={5}
                      cy="50%"
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{creditScore}</span>
                  <span className="text-sm font-medium text-muted-foreground">Credit Score</span>
                </div>
              </div>
              <Badge variant={riskLevel === 'Low' ? 'default' : 'destructive'} className={`mt-4 ${riskLevel === 'Low' ? 'bg-green-600 text-white' : ''}`}>
                {riskLevel} Risk
              </Badge>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>AI Score & Insights</CardTitle>
              <CardDescription>Factors influencing your credit score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-md">
                  <ThumbsUp className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <p className="text-sm text-foreground">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Consumption Behavior Index</CardTitle>
                <CardDescription>Your spending habits over the last 7 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={consumptionBehavior}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Legend />
                        <Bar dataKey="essential" fill="var(--color-essential)" radius={4} />
                        <Bar dataKey="discretionary" fill="var(--color-discretionary)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="repayments" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
            <CardDescription>Your upcoming and past payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repaymentSchedule.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell className="font-medium flex items-center"><IndianRupee className="h-4 w-4 mr-1" />{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'Paid' ? 'outline' : 'default'} className={payment.status === 'Paid' ? 'border-green-600 text-green-600' : ''}>
                        {payment.status === 'Paid' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === 'Upcoming' ? <Button size="sm">Pay Now</Button> : <Button size="sm" variant="outline" disabled>View</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Repayment Trends</CardTitle>
                <CardDescription>Your payment performance over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={repaymentChartConfig} className="h-[300px] w-full">
                    <AreaChart data={repaymentTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent indicator="line" />} />
                        <Legend />
                        <Area type="monotone" dataKey="paid" stackId="1" stroke="var(--color-paid)" fill="var(--color-paid)" fillOpacity={0.4} />
                        <Area type="monotone" dataKey="due" stackId="1" stroke="var(--color-due)" fill="var(--color-due)" fillOpacity={0.4}/>
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="profile" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your personal and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-4">
               <Avatar className="h-16 w-16">
                 <AvatarImage src={user?.avatar} />
                 <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
               </Avatar>
               <div>
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
               </div>
             </div>
             <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Bills</CardTitle>
            <CardDescription>Bills you have uploaded for consumption analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            {savedBills.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                You haven&apos;t saved any bills yet. Upload one in the &apos;Bill Upload&apos; tab.
              </p>
            ) : (
              <div className="space-y-4">
                {savedBills.map((bill, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-lg flex items-center justify-between">
                         <span>{bill.vendorName}</span>
                         <span className="text-lg font-bold flex items-center"><IndianRupee className="inline h-4 w-4 mr-1"/>{bill.totalAmount}</span>
                       </CardTitle>
                       <CardDescription>{bill.transactionDate}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bill.lineItems.map((item, i) => (
                              <TableRow key={i}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right flex items-center justify-end"><IndianRupee className="inline h-4 w-4 mr-1"/>{item.amount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                       </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Language Preference</CardTitle>
            <CardDescription>Select your preferred language for the portal.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline"><Languages className="mr-2 h-4 w-4" /> English</Button>
            <Button variant="ghost">हिंदी</Button>
            <Button variant="ghost">বাংলা</Button>
            <Button variant="ghost">தமிழ்</Button>
          </CardContent>
        </Card>
      </TabsContent>

       <TabsContent value="advice" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Financial Advice Feed</CardTitle>
              <CardDescription>Personalized tips for rural entrepreneurs like you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {financialAdvice.map(item => (
                <div key={item.id} className="flex items-start space-x-4 rounded-lg border p-4 transition-all hover:shadow-md hover:bg-muted/50">
                  <div className="flex-shrink-0 pt-1">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.advice}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
       </TabsContent>
      
       <TabsContent value="bill-upload" className="mt-0">
          <BillUpload onBillConfirmed={handleSaveBill} />
       </TabsContent>

    </Tabs>
  );
}
