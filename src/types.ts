export type UserRole = 'customer' | 'officer';

export interface CustomerProfile {
  id: string; // e.g. C10234
  name: string; // Arun Kumar
  email: string;
  phone: string;
  bankName: string;
  branch: string;
  location: string;
  linkedAccount: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface OfficerProfile {
  id: string; // e.g. EMP-8842
  name: string; // R. Srinivas
  email: string;
  bankName: string;
  branch: string;
  location: string;
  employeeId: string;
  avatarUrl?: string;
}

export interface SpendingCategory {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  icon: 'fuel' | 'bolt' | 'home' | 'other';
  color: string;
}

export interface CustomerSpendingSummary {
  customerId: string;
  period: string; // e.g. "Annual (Trailing 12 Months)"
  totalTrackedSpending: number;
  currency: string;
  categories: SpendingCategory[];
  isDemoData: boolean;
}

export type ProductType = 'EV Finance' | 'Green Home Loan' | 'Solar Finance' | 'Go Paperless';
export type EngagementStatus = 'Not Started' | 'Viewed' | 'In Progress' | 'Completed';

export interface Recommendation {
  id: string;
  customerId: string;
  productType: ProductType;
  title: string;
  tagline: string;
  description: string;
  actionText: string;
  actionRoute: string;
  potentialBenefit: string;
  supportingData: string[];
  status: EngagementStatus;
  dateRecommended: string;
  lastActivity?: string;
}

export interface LoanCalculationInput {
  purchasePrice: number;
  downPayment?: number;
  loanTenureYears: number;
  interestRateAnnual?: number;
  productType: 'EV' | 'GreenHome' | 'Solar';
  modelOrType?: string;
  systemSizeKw?: number;
}

export interface LoanCalculationResult {
  loanAmount: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  annualInterestRate: number;
  tenureYears: number;
  monthlyInterestRate: number;
  numberOfPayments: number;
  disclaimer: string;
  // Specific comparative metrics
  comparison?: {
    currentAnnualCost: number;
    projectedAnnualCost: number;
    estimatedAnnualSavings: number;
    percentageReduction: number;
    assumptions: string[];
  };
  // Specific solar metrics
  solarDetails?: {
    estimatedAnnualGenerationKwh: number;
    estimatedMonthlyBillReduction: number;
    estimatedAnnualSavings: number;
    estimatedPaybackYears: number | null;
  };
}

export interface EngagementRecord {
  id: string;
  customerId: string;
  customerName: string;
  productRecommended: ProductType;
  dateRecommended: string;
  status: EngagementStatus;
  lastActivity: string;
  branch: string;
  history: Array<{
    status: EngagementStatus;
    timestamp: string;
    details?: string;
  }>;
}

export interface OfficerMetrics {
  totalCustomers: number;
  totalCustomersTrend: string;
  viewedRecommendations: number;
  viewedPercentage: number;
  viewedTrend: string;
  startedProduct: number;
  startedPercentage: number;
  startedTrend: string;
  completedProduct: number;
  completedPercentage: number;
  completedTrend: string;
}

export interface OfficerAnalytics {
  productBreakdown: Array<{
    name: ProductType;
    count: number;
  }>;
  statusOverview: Array<{
    status: EngagementStatus;
    count: number;
    percentage: number;
  }>;
  trend: Array<{
    month: string;
    viewed: number;
    inProgress: number;
    completed: number;
    notStarted: number;
  }>;
}
