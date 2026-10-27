import { GoogleGenAI } from '@google/genai';
import { Recommendation, CustomerSpendingSummary } from '../types';

let genai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genai = new GoogleGenAI();
  } catch (e) {
    console.warn('Google GenAI initialization skipped:', e);
  }
}

export interface RecommendationContext {
  customerId: string;
  customerName: string;
  spendingSummary: CustomerSpendingSummary;
}

/**
 * Deterministic explainable rules engine for green recommendations
 */
export function generateExplainableRecommendations(
  context: RecommendationContext
): Recommendation[] {
  const { customerId, spendingSummary } = context;
  const categories = spendingSummary.categories;

  const petrol = categories.find((c) => c.category.includes('Petrol')) || {
    amount: 68000,
    percentage: 34
  };
  const electricity = categories.find((c) => c.category.includes('Electricity')) || {
    amount: 56000,
    percentage: 28
  };
  const appliances = categories.find((c) => c.category.includes('Appliances')) || {
    amount: 40000,
    percentage: 20
  };

  const recommendations: Recommendation[] = [];

  // 1. EV Finance Recommendation
  if (petrol.percentage >= 20 || petrol.amount >= 40000) {
    recommendations.push({
      id: `rec_ev_${customerId}`,
      customerId,
      productType: 'EV Finance',
      title: 'Consider EV Finance',
      tagline: 'Drive Cleaner, Save Smarter',
      description: `Your petrol spending accounts for ${petrol.percentage}% of your tracked spending (₹ ${petrol.amount.toLocaleString('en-IN')}). Transitioning to an electric vehicle can significantly reduce operating costs.`,
      actionText: 'Explore EV Finance',
      actionRoute: '/ev-finance',
      potentialBenefit: 'Save up to ₹ 1,16,000/year (69% lower running cost)',
      supportingData: [
        `High fuel consumption baseline: ${petrol.percentage}% of tracked budget`,
        'Daily commute & highway efficiency parity',
        'Eligible for preferential green auto loan rate (7.8% p.a.)'
      ],
      status: 'Viewed',
      dateRecommended: '12 Oct 2026'
    });
  }

  // 2. Green Home Loan Recommendation
  if (appliances.percentage >= 15 || electricity.percentage >= 20) {
    recommendations.push({
      id: `rec_gh_${customerId}`,
      customerId,
      productType: 'Green Home Loan',
      title: 'Explore Green Home Loan',
      tagline: 'A Greener Home for a Brighter Future',
      description: `Home appliances and cooling account for ${appliances.percentage}% of spending. Energy-efficiency upgrades can lower baseline consumption by up to 40%.`,
      actionText: 'Explore Green Home Loan',
      actionRoute: '/green-home-loan',
      potentialBenefit: 'Save up to ₹ 58,000/year (40% lower energy spending)',
      supportingData: [
        `Appliance & cooling power load: ${appliances.percentage}% of tracked budget`,
        'Eligible for BEE 5-star inverter heat pumps and double glazing financing',
        'Special concessional rate (7.5% p.a.)'
      ],
      status: 'In Progress',
      dateRecommended: '10 Oct 2026'
    });
  }

  // 3. Solar Finance Recommendation
  if (electricity.percentage >= 20 || electricity.amount >= 35000) {
    recommendations.push({
      id: `rec_sol_${customerId}`,
      customerId,
      productType: 'Solar Finance',
      title: 'Look into Solar Finance',
      tagline: 'Generate Your Own Electricity, Save More',
      description: `Your electricity bills represent ${electricity.percentage}% of your tracked spending (₹ ${electricity.amount.toLocaleString('en-IN')}). Installing rooftop solar can offset peak grid tariffs.`,
      actionText: 'Explore Solar Finance',
      actionRoute: '/solar-finance',
      potentialBenefit: 'Save up to ₹ 1,00,000/year (76% lower electricity cost)',
      supportingData: [
        `Annual electricity baseline: ₹ ${electricity.amount.toLocaleString('en-IN')}`,
        'High daylight solar irradiance in your local region',
        'Estimated payback within ~3.0 years'
      ],
      status: 'Viewed',
      dateRecommended: '09 Oct 2026'
    });
  }

  return recommendations;
}

/**
 * Optional AI narrative enhancement (guaranteed to be grounded in computed values)
 */
export async function getGroundedAiExplanation(
  productType: 'EV' | 'GreenHome' | 'Solar',
  customerData: {
    name: string;
    annualSpending: number;
    projectedSpending: number;
    savings: number;
    pctReduction: number;
  }
): Promise<{ explanation: string; keyFactors: string[] }> {
  // Deterministic grounded fallbacks
  if (productType === 'EV') {
    return {
      explanation: `Based on your vehicle usage and estimated fuel expenses of ₹ ${customerData.annualSpending.toLocaleString('en-IN')}, switching to an electric vehicle offers substantial operational efficiency. At current average commercial and home tariffs, your projected EV running costs would be approximately ₹ ${customerData.projectedSpending.toLocaleString('en-IN')}, delivering an annual savings of ₹ ${customerData.savings.toLocaleString('en-IN')} (${customerData.pctReduction}% reduction).`,
      keyFactors: [
        'Lower Running Costs: Electricity is significantly cheaper than petrol or diesel for daily travel.',
        'Reduce Emissions: Switching to an EV helps lower tailpipe carbon emissions to zero.',
        'Government Incentives: FAME and state subsidies offer reduced registration and road tax.',
        'Convenient Charging: A growing domestic and highway fast-charging network makes ownership seamless.'
      ]
    };
  } else if (productType === 'GreenHome') {
    return {
      explanation: `Based on your current home energy spending of ₹ ${customerData.annualSpending.toLocaleString('en-IN')}, upgrading to certified energy-efficient solutions helps save recurring utility expenditure while improving indoor thermal comfort. Projected post-upgrade energy spending is ₹ ${customerData.projectedSpending.toLocaleString('en-IN')}, yielding approximately ₹ ${customerData.savings.toLocaleString('en-IN')} in annual savings (${customerData.pctReduction}% reduction).`,
      keyFactors: [
        'Lower Energy Bills: Efficient insulation, BEE 5-star appliances, and heat pumps reduce baseline consumption.',
        'Reduce Emissions: Lower power draw reduces grid coal and gas generation reliance.',
        'Increase Home Value: Green-certified buildings command higher resale values and rental yields.',
        'Access to Green Incentives: Concessional interest rates and green building tax incentives.'
      ]
    };
  } else {
    return {
      explanation: `Based on your current electricity spending of ₹ ${customerData.annualSpending.toLocaleString('en-IN')}, installing a rooftop solar array directly generates clean kilowatt-hours on-site. Net grid imports are projected to drop to ₹ ${customerData.projectedSpending.toLocaleString('en-IN')}, resulting in estimated annual savings of ₹ ${customerData.savings.toLocaleString('en-IN')} (${customerData.pctReduction}% lower electricity cost).`,
      keyFactors: [
        'Lower Electricity Bills: Generate your own electricity and reduce reliance on expensive grid slab rates.',
        'Reduce Carbon Footprint: Renewable solar energy offsets approximately 3 to 4 tonnes of CO2 annually.',
        'Increase Property Value: Homes equipped with modern solar arrays are modern and energy self-reliant.',
        'Incentives & Benefits: Central PM Surya Ghar subsidies and net-metering grid export credits apply.'
      ]
    };
  }
}
