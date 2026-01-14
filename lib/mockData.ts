// Types for financial data
export interface RevenueData {
  monthly: { month: string; revenue: number; growth: number }[];
  totalRevenue: number;
  yoyGrowth: number;
  mrr: number;
  arr: number;
}

export interface ExpenseData {
  categories: { name: string; amount: number; percentage: number; color: string }[];
  totalExpenses: number;
  monthlyTrend: { month: string; amount: number }[];
}

export interface RunwayData {
  currentCash: number;
  monthlyBurn: number;
  runwayMonths: number;
  burnTrend: { month: string; burn: number; cash: number }[];
}

export interface HeadcountData {
  totalEmployees: number;
  departments: { name: string; count: number; avgSalary: number; color: string }[];
  monthlyBurnByDept: { month: string; engineering: number; sales: number; operations: number; other: number }[];
  costPerEmployee: number;
  hiringPlan: { month: string; planned: number; actual: number }[];
}

export interface MetricsData {
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  churnRate: number;
  nrr: number;
  arpu: number;
  paybackMonths: number;
  trends: {
    cac: { month: string; value: number }[];
    ltv: { month: string; value: number }[];
    churn: { month: string; value: number }[];
  };
}

export interface PLData {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: {
    salesMarketing: number;
    rd: number;
    ga: number;
  };
  operatingIncome: number;
  netIncome: number;
  waterfall: { name: string; value: number; type: 'positive' | 'negative' | 'total' }[];
}

export interface BalanceData {
  assets: {
    cash: number;
    accountsReceivable: number;
    inventory: number;
    otherCurrentAssets: number;
    propertyEquipment: number;
    intangibles: number;
  };
  liabilities: {
    accountsPayable: number;
    shortTermDebt: number;
    longTermDebt: number;
    deferredRevenue: number;
  };
  equity: {
    commonStock: number;
    retainedEarnings: number;
  };
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface ProjectionsData {
  scenarios: {
    conservative: { month: string; revenue: number; expenses: number; profit: number }[];
    base: { month: string; revenue: number; expenses: number; profit: number }[];
    optimistic: { month: string; revenue: number; expenses: number; profit: number }[];
  };
  assumptions: {
    conservativeGrowth: number;
    baseGrowth: number;
    optimisticGrowth: number;
  };
}

export interface FinancialData {
  revenue: RevenueData;
  expenses: ExpenseData;
  runway: RunwayData;
  headcount: HeadcountData;
  metrics: MetricsData;
  pl: PLData;
  balance: BalanceData;
  projections: ProjectionsData;
}

// Generate mock data
export function generateMockFinancialData(): FinancialData {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const futureMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Revenue data
  const baseRevenue = 850000;
  const revenueMonthly = months.map((month, i) => {
    const growth = 0.05 + Math.random() * 0.03;
    const revenue = Math.round(baseRevenue * Math.pow(1.06, i) * (0.95 + Math.random() * 0.1));
    return { month, revenue, growth: Math.round(growth * 100) };
  });
  
  const revenue: RevenueData = {
    monthly: revenueMonthly,
    totalRevenue: revenueMonthly.reduce((sum, m) => sum + m.revenue, 0),
    yoyGrowth: 68,
    mrr: 1420000,
    arr: 17040000,
  };

  // Expense data
  const expenseCategories = [
    { name: 'Salaries & Benefits', amount: 4200000, percentage: 52, color: '#3B82F6' },
    { name: 'Marketing', amount: 1600000, percentage: 20, color: '#8B5CF6' },
    { name: 'Infrastructure', amount: 800000, percentage: 10, color: '#06B6D4' },
    { name: 'Office & Admin', amount: 640000, percentage: 8, color: '#10B981' },
    { name: 'R&D', amount: 480000, percentage: 6, color: '#F59E0B' },
    { name: 'Other', amount: 320000, percentage: 4, color: '#EF4444' },
  ];

  const expenses: ExpenseData = {
    categories: expenseCategories,
    totalExpenses: expenseCategories.reduce((sum, c) => sum + c.amount, 0),
    monthlyTrend: months.map((month, i) => ({
      month,
      amount: Math.round(650000 + i * 15000 + Math.random() * 30000),
    })),
  };

  // Runway data
  const currentCash = 8500000;
  const monthlyBurn = 420000;
  const runway: RunwayData = {
    currentCash,
    monthlyBurn,
    runwayMonths: Math.round(currentCash / monthlyBurn),
    burnTrend: months.map((month, i) => ({
      month,
      burn: Math.round(monthlyBurn * (0.9 + Math.random() * 0.2)),
      cash: Math.round(currentCash - (monthlyBurn * i * 0.8)),
    })),
  };

  // Headcount data
  const departments = [
    { name: 'Engineering', count: 45, avgSalary: 145000, color: '#3B82F6' },
    { name: 'Sales', count: 22, avgSalary: 95000, color: '#8B5CF6' },
    { name: 'Marketing', count: 12, avgSalary: 85000, color: '#06B6D4' },
    { name: 'Operations', count: 8, avgSalary: 75000, color: '#10B981' },
    { name: 'Finance', count: 5, avgSalary: 110000, color: '#F59E0B' },
    { name: 'HR', count: 4, avgSalary: 80000, color: '#EF4444' },
  ];

  const headcount: HeadcountData = {
    totalEmployees: departments.reduce((sum, d) => sum + d.count, 0),
    departments,
    monthlyBurnByDept: months.map((month, i) => ({
      month,
      engineering: Math.round(500000 + i * 10000),
      sales: Math.round(180000 + i * 5000),
      operations: Math.round(80000 + i * 2000),
      other: Math.round(120000 + i * 3000),
    })),
    costPerEmployee: 11200,
    hiringPlan: months.map((month, i) => ({
      month,
      planned: 3 + Math.floor(i / 3),
      actual: 2 + Math.floor(Math.random() * 3),
    })),
  };

  // Key metrics
  const metrics: MetricsData = {
    cac: 1850,
    ltv: 14200,
    ltvCacRatio: 7.7,
    churnRate: 2.3,
    nrr: 118,
    arpu: 289,
    paybackMonths: 6.4,
    trends: {
      cac: months.map((month, i) => ({
        month,
        value: Math.round(2100 - i * 25 + Math.random() * 100),
      })),
      ltv: months.map((month, i) => ({
        month,
        value: Math.round(12000 + i * 200 + Math.random() * 500),
      })),
      churn: months.map((month, i) => ({
        month,
        value: parseFloat((3.2 - i * 0.08 + Math.random() * 0.3).toFixed(1)),
      })),
    },
  };

  // P&L data
  const plRevenue = revenue.totalRevenue;
  const cogs = Math.round(plRevenue * 0.25);
  const grossProfit = plRevenue - cogs;
  const salesMarketing = Math.round(plRevenue * 0.28);
  const rd = Math.round(plRevenue * 0.22);
  const ga = Math.round(plRevenue * 0.12);
  const operatingIncome = grossProfit - salesMarketing - rd - ga;

  const pl: PLData = {
    revenue: plRevenue,
    cogs,
    grossProfit,
    grossMargin: 75,
    operatingExpenses: {
      salesMarketing,
      rd,
      ga,
    },
    operatingIncome,
    netIncome: Math.round(operatingIncome * 0.85),
    waterfall: [
      { name: 'Revenue', value: plRevenue, type: 'positive' },
      { name: 'COGS', value: -cogs, type: 'negative' },
      { name: 'Gross Profit', value: grossProfit, type: 'total' },
      { name: 'S&M', value: -salesMarketing, type: 'negative' },
      { name: 'R&D', value: -rd, type: 'negative' },
      { name: 'G&A', value: -ga, type: 'negative' },
      { name: 'Net Income', value: operatingIncome, type: 'total' },
    ],
  };

  // Balance sheet
  const balance: BalanceData = {
    assets: {
      cash: 8500000,
      accountsReceivable: 2100000,
      inventory: 450000,
      otherCurrentAssets: 320000,
      propertyEquipment: 1200000,
      intangibles: 800000,
    },
    liabilities: {
      accountsPayable: 680000,
      shortTermDebt: 500000,
      longTermDebt: 2000000,
      deferredRevenue: 1400000,
    },
    equity: {
      commonStock: 5000000,
      retainedEarnings: 3790000,
    },
    totalAssets: 13370000,
    totalLiabilities: 4580000,
    totalEquity: 8790000,
  };

  // Projections
  const generateProjection = (growthRate: number) => {
    let currentRevenue = revenue.mrr;
    let currentExpenses = expenses.totalExpenses / 12;
    
    return futureMonths.map((month, i) => {
      currentRevenue = Math.round(currentRevenue * (1 + growthRate / 12));
      currentExpenses = Math.round(currentExpenses * 1.02);
      return {
        month: `${month} '26`,
        revenue: currentRevenue,
        expenses: currentExpenses,
        profit: currentRevenue - currentExpenses,
      };
    });
  };

  const projections: ProjectionsData = {
    scenarios: {
      conservative: generateProjection(0.15),
      base: generateProjection(0.35),
      optimistic: generateProjection(0.55),
    },
    assumptions: {
      conservativeGrowth: 15,
      baseGrowth: 35,
      optimisticGrowth: 55,
    },
  };

  return {
    revenue,
    expenses,
    runway,
    headcount,
    metrics,
    pl,
    balance,
    projections,
  };
}

// Simulation helpers
export function simulateRevenueGrowth(data: RevenueData, growthPercentage: number): RevenueData {
  const multiplier = 1 + growthPercentage / 100;
  return {
    ...data,
    monthly: data.monthly.map(m => ({
      ...m,
      revenue: Math.round(m.revenue * multiplier),
    })),
    totalRevenue: Math.round(data.totalRevenue * multiplier),
    mrr: Math.round(data.mrr * multiplier),
    arr: Math.round(data.arr * multiplier),
    yoyGrowth: Math.round(data.yoyGrowth + growthPercentage),
  };
}

export function simulateExpenseReduction(data: ExpenseData, category: string, reductionPercentage: number): ExpenseData {
  const newCategories = data.categories.map(c => {
    if (c.name === category) {
      const newAmount = Math.round(c.amount * (1 - reductionPercentage / 100));
      return { ...c, amount: newAmount };
    }
    return c;
  });
  
  const newTotal = newCategories.reduce((sum, c) => sum + c.amount, 0);
  const withPercentages = newCategories.map(c => ({
    ...c,
    percentage: Math.round((c.amount / newTotal) * 100),
  }));

  return {
    ...data,
    categories: withPercentages,
    totalExpenses: newTotal,
  };
}

export function simulateBurnRate(data: RunwayData, newBurnRate: number): RunwayData {
  return {
    ...data,
    monthlyBurn: newBurnRate,
    runwayMonths: Math.round(data.currentCash / newBurnRate),
  };
}

export function simulateHiring(data: HeadcountData, newHires: number, department: string, avgSalary: number): HeadcountData {
  const newDepartments = data.departments.map(d => {
    if (d.name === department) {
      return { ...d, count: d.count + newHires };
    }
    return d;
  });

  const additionalMonthlyCost = Math.round((newHires * avgSalary) / 12);
  
  return {
    ...data,
    totalEmployees: data.totalEmployees + newHires,
    departments: newDepartments,
    costPerEmployee: Math.round(
      (data.costPerEmployee * data.totalEmployees + additionalMonthlyCost) / (data.totalEmployees + newHires)
    ),
  };
}

export function simulateChurnImprovement(data: MetricsData, improvementPercentage: number): MetricsData {
  const newChurn = data.churnRate * (1 - improvementPercentage / 100);
  const churnFactor = data.churnRate / newChurn;
  
  return {
    ...data,
    churnRate: parseFloat(newChurn.toFixed(1)),
    ltv: Math.round(data.ltv * churnFactor),
    ltvCacRatio: parseFloat((data.ltv * churnFactor / data.cac).toFixed(1)),
    nrr: Math.min(Math.round(data.nrr + improvementPercentage * 0.5), 150),
  };
}

export function simulateGrossMargin(data: PLData, newMargin: number): PLData {
  const marginDiff = newMargin - data.grossMargin;
  const newCogs = Math.round(data.revenue * (1 - newMargin / 100));
  const newGrossProfit = data.revenue - newCogs;
  const operatingExpenses = data.operatingExpenses.salesMarketing + data.operatingExpenses.rd + data.operatingExpenses.ga;
  const newOperatingIncome = newGrossProfit - operatingExpenses;
  
  return {
    ...data,
    cogs: newCogs,
    grossProfit: newGrossProfit,
    grossMargin: newMargin,
    operatingIncome: newOperatingIncome,
    netIncome: Math.round(newOperatingIncome * 0.85),
  };
}

export function simulateFundraising(data: BalanceData, amount: number): BalanceData {
  return {
    ...data,
    assets: {
      ...data.assets,
      cash: data.assets.cash + amount,
    },
    equity: {
      ...data.equity,
      commonStock: data.equity.commonStock + amount,
    },
    totalAssets: data.totalAssets + amount,
    totalEquity: data.totalEquity + amount,
  };
}

export function simulateGrowthRate(data: ProjectionsData, newGrowthRate: number): ProjectionsData {
  const futureMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let currentRevenue = 1420000; // MRR
  let currentExpenses = 670000;
  
  const newBase = futureMonths.map((month, i) => {
    currentRevenue = Math.round(currentRevenue * (1 + newGrowthRate / 100 / 12));
    currentExpenses = Math.round(currentExpenses * 1.02);
    return {
      month: `${month} '26`,
      revenue: currentRevenue,
      expenses: currentExpenses,
      profit: currentRevenue - currentExpenses,
    };
  });

  return {
    ...data,
    scenarios: {
      ...data.scenarios,
      base: newBase,
    },
    assumptions: {
      ...data.assumptions,
      baseGrowth: newGrowthRate,
    },
  };
}
