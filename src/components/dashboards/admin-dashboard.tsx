'use client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import {
  Activity,
  Download,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { MOCK_ADMIN_DATA } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { StatCard } from '@/components/shared/stat-card';

export default function AdminDashboard() {
  const { stats, riskDistribution, aiForecast } = MOCK_ADMIN_DATA;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Beneficiaries"
          value={stats.totalBeneficiaries}
          icon={<Users className="h-4 w-4" />}
          description="+20.1% from last month"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
        <StatCard
          title="Active Loans"
          value={stats.activeLoans}
          icon={<Wallet className="h-4 w-4" />}
          description="+180.1% from last month"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
        <StatCard
          title="Average Score"
          value={stats.averageScore}
          icon={<TrendingUp className="h-4 w-4" />}
          description="+12 since last month"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
        <StatCard
          title="Regional Default Rate"
          value={`${stats.regionalDefaultRate}`}
          icon={<Activity className="h-4 w-4" />}
          description="-1.2% from last month"
          className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle>AI Forecast Graph</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <AreaChart data={aiForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={
                    <ChartTooltipContent
                      labelKey="score"
                      indicator="dot"
                      hideLabel
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-12 lg:col-span-3">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: 'Beneficiaries' },
              }}
              className="h-[300px] w-full"
            >
              <PieChart>
                <Tooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie data={riskDistribution} dataKey="value" nameKey="name">
                  {riskDistribution.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Reporting</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">
              Generate comprehensive policy reports based on current data and
              trends.
            </p>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Generate Policy Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
