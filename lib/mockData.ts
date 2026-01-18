// Financial data types and mock data generation

export interface RevenueData {
  arr: number
  mrr: number
  yoyGrowth: number
  monthly: { month: string; revenue: number }[]
}

export interface ExpenseData {
  totalExpenses: number
  categories: { name: string; amount: number; percentage: number; color: string }[]
}

export interface RunwayData {
  currentCash: number
  monthlyBurn: number
  runwayMonths: number
}

export interface HeadcountData {
  totalEmployees: number
  departments: { name: string; count: number; color: string; avgSalary: number }[]
  costPerEmployee: number
}

export interface MetricsData {
  ltv: number
  cac: number
  ltvCacRatio: number
  churnRate: number
  nrr: number
}

export interface PLData {
  revenue: number
  grossMargin: number
  netIncome: number
  waterfall: { name: string; value: number; type: 'positive' | 'negative' | 'total' }[]
}

export interface BalanceData {
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  assets: { cash: number; receivables: number; other: number }
  liabilities: { payables: number; debt: number; other: number }
}

export interface ProjectionsData {
  scenarios: {
    conservative: { month: string; revenue: number }[]
    base: { month: string; revenue: number }[]
    optimistic: { month: string; revenue: number }[]
  }
  assumptions: {
    baseGrowth: number
    conservativeGrowth: number
    optimisticGrowth: number
  }
}

export interface FinancialData {
  revenue: RevenueData
  expenses: ExpenseData
  runway: RunwayData
  headcount: HeadcountData
  metrics: MetricsData
  pl: PLData
  balance: BalanceData
  projections: ProjectionsData
}

// Default chart colors (used when no brand colors are provided)
const DEFAULT_CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

// Generate mock financial data
export function generateMockFinancialData(chartColors: string[] = DEFAULT_CHART_COLORS): FinancialData {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const baseRevenue = 450000

  // Ensure we have enough colors
  const colors = chartColors.length >= 5 ? chartColors : DEFAULT_CHART_COLORS

  // Revenue data
  const monthlyRevenue = months.map((month, i) => ({
    month,
    revenue: Math.round(baseRevenue * (1 + i * 0.08) + Math.random() * 50000),
  }))
  const currentMRR = monthlyRevenue[monthlyRevenue.length - 1].revenue
  const arr = currentMRR * 12

  const revenue: RevenueData = {
    arr,
    mrr: currentMRR,
    yoyGrowth: 47,
    monthly: monthlyRevenue,
  }

  // Expense data
  const expenses: ExpenseData = {
    totalExpenses: 4800000,
    categories: [
      { name: 'Löner', amount: 2880000, percentage: 60, color: colors[0] },
      { name: 'Marknadsföring', amount: 720000, percentage: 15, color: colors[1] },
      { name: 'Infrastruktur', amount: 480000, percentage: 10, color: colors[2] },
      { name: 'Drift', amount: 384000, percentage: 8, color: colors[3] },
      { name: 'Övrigt', amount: 336000, percentage: 7, color: colors[4] },
    ],
  }

  // Runway data
  const runway: RunwayData = {
    currentCash: 8500000,
    monthlyBurn: 400000,
    runwayMonths: 21,
  }

  // Headcount data
  const headcount: HeadcountData = {
    totalEmployees: 47,
    departments: [
      { name: 'Teknik', count: 18, color: colors[0], avgSalary: 150000 },
      { name: 'Försäljning', count: 12, color: colors[1], avgSalary: 120000 },
      { name: 'Marknadsföring', count: 8, color: colors[2], avgSalary: 100000 },
      { name: 'Drift', count: 5, color: colors[3], avgSalary: 90000 },
      { name: 'Ekonomi', count: 4, color: colors[4], avgSalary: 110000 },
    ],
    costPerEmployee: 10200,
  }

  // Metrics data
  const metrics: MetricsData = {
    ltv: 24000,
    cac: 6000,
    ltvCacRatio: 4.0,
    churnRate: 2.1,
    nrr: 115,
  }

  // P&L data
  const pl: PLData = {
    revenue: arr,
    grossMargin: 72,
    netIncome: 850000,
    waterfall: [
      { name: 'Intäkter', value: arr, type: 'positive' },
      { name: 'Kostnad Sålda Varor', value: -arr * 0.28, type: 'negative' },
      { name: 'Bruttovinst', value: arr * 0.72, type: 'total' },
      { name: 'Rörelsekostnader', value: -3200000, type: 'negative' },
      { name: 'Nettoresultat', value: 850000, type: 'total' },
    ],
  }

  // Balance sheet data
  const balance: BalanceData = {
    totalAssets: 12500000,
    totalLiabilities: 2800000,
    totalEquity: 9700000,
    assets: { cash: 8500000, receivables: 2500000, other: 1500000 },
    liabilities: { payables: 800000, debt: 1500000, other: 500000 },
  }

  // Projections data
  const futureMonths = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']
  const projections: ProjectionsData = {
    scenarios: {
      conservative: futureMonths.map((month, i) => ({
        month,
        revenue: Math.round(currentMRR * Math.pow(1.02, i + 1)),
      })),
      base: futureMonths.map((month, i) => ({
        month,
        revenue: Math.round(currentMRR * Math.pow(1.04, i + 1)),
      })),
      optimistic: futureMonths.map((month, i) => ({
        month,
        revenue: Math.round(currentMRR * Math.pow(1.06, i + 1)),
      })),
    },
    assumptions: {
      baseGrowth: 48,
      conservativeGrowth: 24,
      optimisticGrowth: 72,
    },
  }

  return {
    revenue,
    expenses,
    runway,
    headcount,
    metrics,
    pl,
    balance,
    projections,
  }
}

// Simulation functions
export function simulateRevenueGrowth(data: RevenueData, additionalGrowthPercent: number): RevenueData {
  const multiplier = 1 + additionalGrowthPercent / 100
  return {
    ...data,
    arr: Math.round(data.arr * multiplier),
    mrr: Math.round(data.mrr * multiplier),
    yoyGrowth: Math.round(data.yoyGrowth + additionalGrowthPercent),
    monthly: data.monthly.map((m) => ({
      ...m,
      revenue: Math.round(m.revenue * multiplier),
    })),
  }
}

export function simulateExpenseReduction(
  data: ExpenseData,
  category: string,
  reductionPercent: number
): ExpenseData {
  const newCategories = data.categories.map((c) => {
    if (c.name === category) {
      const newAmount = Math.round(c.amount * (1 - reductionPercent / 100))
      return { ...c, amount: newAmount }
    }
    return c
  })

  const newTotal = newCategories.reduce((sum, c) => sum + c.amount, 0)
  const categoriesWithPercentages = newCategories.map((c) => ({
    ...c,
    percentage: Math.round((c.amount / newTotal) * 100),
  }))

  return {
    totalExpenses: newTotal,
    categories: categoriesWithPercentages,
  }
}

export function simulateBurnRate(data: RunwayData, newBurnRate: number): RunwayData {
  return {
    ...data,
    monthlyBurn: newBurnRate,
    runwayMonths: Math.round(data.currentCash / newBurnRate),
  }
}

export function simulateHiring(
  data: HeadcountData,
  newHires: number,
  department: string,
  avgSalary: number
): HeadcountData {
  const newDepartments = data.departments.map((d) => {
    if (d.name === department) {
      return { ...d, count: d.count + newHires }
    }
    return d
  })

  const newTotal = newDepartments.reduce((sum, d) => sum + d.count, 0)
  const totalCost = newDepartments.reduce((sum, d) => sum + d.count * d.avgSalary, 0)

  return {
    totalEmployees: newTotal,
    departments: newDepartments,
    costPerEmployee: Math.round(totalCost / newTotal / 12),
  }
}

export function simulateChurnImprovement(data: MetricsData, improvementPercent: number): MetricsData {
  const newChurnRate = data.churnRate * (1 - improvementPercent / 100)
  const monthlyChurn = newChurnRate / 100
  const avgLifetimeMonths = 1 / monthlyChurn
  const monthlyRevenue = 2000 // Assumed ARPU
  const newLtv = Math.round(monthlyRevenue * avgLifetimeMonths)

  return {
    ...data,
    churnRate: Math.round(newChurnRate * 10) / 10,
    ltv: newLtv,
    ltvCacRatio: Math.round((newLtv / data.cac) * 10) / 10,
  }
}

export function simulateGrossMargin(data: PLData, newGrossMargin: number): PLData {
  const grossProfit = Math.round(data.revenue * (newGrossMargin / 100))
  const cogs = data.revenue - grossProfit
  const opex = 3200000
  const netIncome = grossProfit - opex

  return {
    ...data,
    grossMargin: newGrossMargin,
    netIncome,
    waterfall: [
      { name: 'Intäkter', value: data.revenue, type: 'positive' },
      { name: 'Kostnad Sålda Varor', value: -cogs, type: 'negative' },
      { name: 'Bruttovinst', value: grossProfit, type: 'total' },
      { name: 'Rörelsekostnader', value: -opex, type: 'negative' },
      { name: 'Nettoresultat', value: netIncome, type: 'total' },
    ],
  }
}

export function simulateFundraising(data: BalanceData, amount: number): BalanceData {
  return {
    ...data,
    totalAssets: data.totalAssets + amount,
    totalEquity: data.totalEquity + amount,
    assets: {
      ...data.assets,
      cash: data.assets.cash + amount,
    },
  }
}

export function simulateGrowthRate(data: ProjectionsData, newGrowthRate: number): ProjectionsData {
  const monthlyGrowth = Math.pow(1 + newGrowthRate / 100, 1 / 12)
  const baseRevenue = 720000 // Starting MRR

  const futureMonths = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']

  return {
    ...data,
    assumptions: {
      ...data.assumptions,
      baseGrowth: newGrowthRate,
    },
    scenarios: {
      conservative: futureMonths.map((month, i) => ({
        month,
        revenue: Math.round(baseRevenue * Math.pow(monthlyGrowth * 0.7, i + 1)),
      })),
      base: futureMonths.map((month, i) => ({
        month,
        revenue: Math.round(baseRevenue * Math.pow(monthlyGrowth, i + 1)),
      })),
      optimistic: futureMonths.map((month, i) => ({
        month,
        revenue: Math.round(baseRevenue * Math.pow(monthlyGrowth * 1.3, i + 1)),
      })),
    },
  }
}
