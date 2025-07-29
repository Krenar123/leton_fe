
import { FinancialDocument, CashFlowEntry } from "@/types/financials";
import { format, startOfYear, endOfYear, addMonths, isBefore, isAfter, parseISO, isSameDay } from "date-fns";
import { QuarterlyPeriod } from "@/components/financials/QuarterlyCashFlowControls";

export const calculateQuarterlyDateRange = (period: QuarterlyPeriod, now: Date) => {
  let startDate: Date;
  let endDate: Date;
  
  switch (period) {
    case 'current-year':
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    case 'q1':
      startDate = new Date(now.getFullYear(), 0, 1); // January 1st
      endDate = new Date(now.getFullYear(), 2, 31); // March 31st
      break;
    case 'q2':
      startDate = new Date(now.getFullYear(), 3, 1); // April 1st
      endDate = new Date(now.getFullYear(), 5, 30); // June 30th
      break;
    case 'q3':
      startDate = new Date(now.getFullYear(), 6, 1); // July 1st
      endDate = new Date(now.getFullYear(), 8, 30); // September 30th
      break;
    case 'q4':
      startDate = new Date(now.getFullYear(), 9, 1); // October 1st
      endDate = new Date(now.getFullYear(), 11, 31); // December 31st
      break;
    default:
      startDate = startOfYear(now);
      endDate = endOfYear(now);
  }

  return { startDate, endDate };
};

export const generateQuarterlyTimePeriods = (startDate: Date, endDate: Date, period: QuarterlyPeriod) => {
  const periods: { start: Date; end: Date; label: string }[] = [];
  
  if (period === 'current-year') {
    // Generate exactly 12 months for current year
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(startDate.getFullYear(), i, 1);
      const monthEnd = new Date(startDate.getFullYear(), i + 1, 0);
      
      periods.push({
        start: monthStart,
        end: monthEnd,
        label: format(monthStart, 'MMM')
      });
    }
  } else {
    // Generate exactly 3 months for quarters
    const startMonth = startDate.getMonth();
    for (let i = 0; i < 3; i++) {
      const monthStart = new Date(startDate.getFullYear(), startMonth + i, 1);
      const monthEnd = new Date(startDate.getFullYear(), startMonth + i + 1, 0);
      
      periods.push({
        start: monthStart,
        end: monthEnd,
        label: format(monthStart, 'MMM')
      });
    }
  }

  return periods;
};

export const calculateQuarterlyCashFlowForPeriod = (
  periodStart: Date,
  periodEnd: Date,
  documents: FinancialDocument[],
  now: Date
): {
  historicInflow: number;
  historicOutflow: number;
  projectedInflow: number;
  projectedOutflow: number;
} => {
  let historicInflow = 0;
  let historicOutflow = 0;
  let projectedInflow = 0;
  let projectedOutflow = 0;
  
  const isProjected = isAfter(periodStart, now);

  documents.forEach(doc => {
    const docDate = doc.expectedDate ? parseISO(doc.expectedDate) : parseISO(doc.uploadDate);
    
    if (docDate >= periodStart && docDate <= periodEnd) {
      if (isProjected || isAfter(docDate, now)) {
        if (doc.type === 'bill') {
          projectedInflow += doc.amount;
        } else if (doc.type === 'invoice') {
          projectedOutflow += doc.amount;
        }
      } else {
        if (doc.type === 'payment') {
          historicInflow += doc.amount;
        } else if (doc.type === 'receipt') {
          historicOutflow += doc.amount;
        }
      }
    }
  });

  return { historicInflow, historicOutflow, projectedInflow, projectedOutflow };
};
