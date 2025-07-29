
import { FinancialDocument, CashFlowEntry, CashFlowPeriod, CashFlowRange } from "@/types/financials";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, addMonths, subMonths, subWeeks, isAfter, isBefore, parseISO, isSameDay } from "date-fns";

export const calculateDateRange = (period: CashFlowPeriod, range: CashFlowRange, now: Date) => {
  let startDate: Date;
  let endDate: Date;
  let totalPeriods: number;
  
  if (period === 'monthly') {
    switch (range) {
      case 'current':
        totalPeriods = 9; // 6 past + current + 2 future
        startDate = startOfMonth(subMonths(now, 6));
        endDate = endOfMonth(addMonths(now, 2));
        break;
      case 'last2':
        totalPeriods = 12; // 8 past + current + 3 future
        startDate = startOfMonth(subMonths(now, 8));
        endDate = endOfMonth(addMonths(now, 3));
        break;
      case 'last3':
        totalPeriods = 15; // 10 past + current + 4 future
        startDate = startOfMonth(subMonths(now, 10));
        endDate = endOfMonth(addMonths(now, 4));
        break;
      case 'last4':
        totalPeriods = 18; // 12 past + current + 5 future
        startDate = startOfMonth(subMonths(now, 12));
        endDate = endOfMonth(addMonths(now, 5));
        break;
      default:
        totalPeriods = 9;
        startDate = startOfMonth(subMonths(now, 6));
        endDate = endOfMonth(addMonths(now, 2));
    }
  } else {
    // Weekly periods
    switch (range) {
      case 'current':
        totalPeriods = 15; // 10 past + current + 4 future
        startDate = startOfWeek(subWeeks(now, 10));
        endDate = endOfWeek(addWeeks(now, 4));
        break;
      case 'last2':
        totalPeriods = 24; // 16 past + current + 7 future
        startDate = startOfWeek(subWeeks(now, 16));
        endDate = endOfWeek(addWeeks(now, 7));
        break;
      case 'last3':
        totalPeriods = 30; // 20 past + current + 9 future
        startDate = startOfWeek(subWeeks(now, 20));
        endDate = endOfWeek(addWeeks(now, 9));
        break;
      case 'last4':
        totalPeriods = 36; // 24 past + current + 11 future
        startDate = startOfWeek(subWeeks(now, 24));
        endDate = endOfWeek(addWeeks(now, 11));
        break;
      default:
        totalPeriods = 15;
        startDate = startOfWeek(subWeeks(now, 10));
        endDate = endOfWeek(addWeeks(now, 4));
    }
  }

  return { startDate, endDate, totalPeriods };
};

export const generateTimePeriods = (startDate: Date, endDate: Date, period: CashFlowPeriod) => {
  const periods: { start: Date; end: Date; label: string }[] = [];
  let current = startDate;
  
  while (isBefore(current, endDate) || isSameDay(current, endDate)) {
    const periodEnd = period === 'monthly' ? endOfMonth(current) : endOfWeek(current);
    periods.push({
      start: current,
      end: periodEnd,
      label: period === 'monthly' ? format(current, 'MMM yyyy') : format(current, 'MMM dd')
    });
    current = period === 'monthly' ? addMonths(current, 1) : addWeeks(current, 1);
  }

  return periods;
};

export const calculateCashFlowForPeriod = (
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
  let historicInflow = 0;  // Actual payments received (from 'payment' type documents)
  let historicOutflow = 0; // Actual payments made (from 'receipt' type documents)
  let projectedInflow = 0; // Expected payments from bills (from 'bill' type documents with expected dates)
  let projectedOutflow = 0; // Expected payments for invoices (from 'invoice' type documents with expected dates)
  
  const isProjected = isAfter(periodStart, now);

  documents.forEach(doc => {
    // Use expectedDate if available, otherwise use uploadDate
    const docDate = doc.expectedDate ? parseISO(doc.expectedDate) : parseISO(doc.uploadDate);
    
    // Check if document falls within this period
    if (docDate >= periodStart && docDate <= periodEnd) {
      if (isProjected || isAfter(docDate, now)) {
        // Projected cash flows based on expected payment dates
        if (doc.type === 'bill') {
          // Bills represent future inflows (payments we expect to receive)
          projectedInflow += doc.amount;
        } else if (doc.type === 'invoice') {
          // Invoices represent future outflows (payments we expect to make)
          projectedOutflow += doc.amount;
        }
      } else {
        // Historic cash flows based on actual transactions
        if (doc.type === 'payment') {
          // Payment documents represent actual inflows (money received)
          historicInflow += doc.amount;
        } else if (doc.type === 'receipt') {
          // Receipt documents represent actual outflows (money paid out)
          historicOutflow += doc.amount;
        }
      }
    }
  });

  return { historicInflow, historicOutflow, projectedInflow, projectedOutflow };
};
