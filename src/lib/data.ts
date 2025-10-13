export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'beneficiary' | 'officer' | 'admin';
  region: string;
};

export const MOCK_USERS: User[] = [
  {
    id: 'usr_001',
    name: 'Aarav Sharma (Demo)',
    email: 'beneficiary@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_001',
    role: 'beneficiary',
    region: 'Maharashtra',
  },
  {
    id: 'usr_002',
    name: 'Priya Singh (Demo)',
    email: 'officer@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_002',
    role: 'officer',
    region: 'National',
  },
  {
    id: 'usr_003',
    name: 'Rohan Gupta (Demo)',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_003',
    role: 'admin',
    region: 'National',
  },
   {
    id: 'usr_004',
    name: 'Sunita Devi',
    email: 'sunita.d@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_004',
    role: 'beneficiary',
    region: 'Bihar',
  },
   {
    id: 'usr_005',
    name: 'Amit Kumar',
    email: 'amit.k@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_005',
    role: 'beneficiary',
    region: 'Uttar Pradesh',
  },
];

export const MOCK_BENEFICIARY_DATA = {
  creditScore: 786,
  riskLevel: 'Low',
  insights: [
    'Excellent repayment history.',
    'Diversified sources of income.',
    'Low credit utilization.',
  ],
  repaymentSchedule: [
    { id: 'pay_01', dueDate: '2024-08-05', amount: 5000, status: 'Paid' },
    { id: 'pay_02', dueDate: '2024-09-05', amount: 5000, status: 'Upcoming' },
    { id: 'pay_03', dueDate: '2024-10-05', amount: 5000, status: 'Upcoming' },
  ],
  consumptionBehavior: [
    { name: 'Jan', essential: 4000, discretionary: 2400 },
    { name: 'Feb', essential: 3000, discretionary: 1398 },
    { name: 'Mar', essential: 2000, discretionary: 9800 },
    { name: 'Apr', essential: 2780, discretionary: 3908 },
    { name: 'May', essential: 1890, discretionary: 4800 },
    { name: 'Jun', essential: 2390, discretionary: 3800 },
    { name: 'Jul', essential: 3490, discretionary: 4300 },
  ],
  repaymentTrends: [
    { name: 'Jan', paid: 5000, due: 5000 },
    { name: 'Feb', paid: 5000, due: 5000 },
    { name: 'Mar', paid: 5000, due: 5000 },
    { name: 'Apr', paid: 4500, due: 5000 },
    { name: 'May', paid: 5000, due: 5000 },
    { name: 'Jun', paid: 5000, due: 5000 },
    { name: 'Jul', paid: 5000, due: 5000 },
  ],
  financialAdvice: [
    { id: 'adv_1', title: 'Tip for Rural Entrepreneurs', advice: 'Consider using UPI for business transactions to create a digital footprint, which can improve your credit score.'},
    { id: 'adv_2', title: 'Saving for a Rainy Day', advice: 'Try to save at least 10% of your monthly income in a separate savings account for emergencies.'},
    { id: 'adv_3', title: 'Understanding Interest', advice: 'Always check the interest rate on any loan. A lower rate can save you a lot of money over time.'}
  ]
};

export const MOCK_BENEFICIARIES_LIST = [
  { id: 'ben_01', name: 'Aarav Sharma', region: 'Maharashtra', score: 786, risk: 'Low', loanStage: 'Active' },
  { id: 'ben_02', name: 'Diya Patel', region: 'Gujarat', score: 650, risk: 'Medium', loanStage: 'Active' },
  { id: 'ben_03', name: 'Kiran Reddy', region: 'Andhra Pradesh', score: 520, risk: 'High', loanStage: 'Defaulted' },
  { id: 'ben_04', name: 'Suresh Kumar', region: 'Uttar Pradesh', score: 710, risk: 'Low', loanStage: 'Approved' },
  { id: 'ben_05', name: 'Meena Kumari', region: 'Bihar', score: 680, risk: 'Medium', loanStage: 'Verification' },
  { id: 'ben_06', name: 'Rajesh Singh', region: 'Rajasthan', score: 810, risk: 'Low', loanStage: 'Active' },
  { id: 'ben_07', name: 'Anita Das', region: 'West Bengal', score: 590, risk: 'High', loanStage: 'Active' },
  { id: 'ben_08', name: 'Vijay Iyer', region: 'Tamil Nadu', score: 750, risk: 'Low', loanStage: 'Approved' },
];


export const MOCK_ADMIN_DATA = {
    stats: {
        totalBeneficiaries: '1.2M',
        activeLoans: '850K',
        averageScore: 712,
        regionalDefaultRate: '3.4%',
    },
    riskDistribution: [
        { name: 'Low Risk', value: 65, fill: 'hsl(var(--accent))' },
        { name: 'Medium Risk', value: 25, fill: 'hsl(var(--chart-3))' },
        { name: 'High Risk', value: 10, fill: 'hsl(var(--destructive))' },
    ],
    aiForecast: [
        { month: 'Aug', score: 715 },
        { month: 'Sep', score: 718 },
        { month: 'Oct', score: 721 },
        { month: 'Nov', score: 725 },
        { month: 'Dec', score: 728 },
        { month: 'Jan', score: 730 },
    ]
};

    