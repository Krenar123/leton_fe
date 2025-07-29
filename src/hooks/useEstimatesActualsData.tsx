import { useState } from "react";
import { EstimateActualItem, FinancialDocument } from "@/types/financials";
import { generateCostCode, getParentCostCode, getItemLevel, inheritVendorFromParent } from "@/utils/costCodeGenerator";

export const useEstimatesActualsData = (addDocument: (doc: FinancialDocument) => void) => {
  const [estimatesActualsData, setEstimatesActualsData] = useState<EstimateActualItem[]>([
    // Main Category 1: Site Preparation & Earthworks
    {
      itemLine: "Site Preparation & Earthworks",
      costCode: "1",
      level: 1,
      isCategory: true,
      isExpanded: true,
      estimatedCost: 0,
      actualCost: 0,
      estimatedRevenue: 0,
      actualRevenue: 0,
      invoiced: 0,
      paid: 0,
      billed: 0,
      payments: 0,
      status: 'not-started',
      isCompleted: false,
      changeOrders: 0,
    },
    // Category 1.1: Site Clearing
    {
      itemLine: "Site Clearing",
      costCode: "1.1",
      level: 2,
      parentCostCode: "1",
      isCategory: true,
      isExpanded: true,
      estimatedCost: 0,
      actualCost: 0,
      estimatedRevenue: 0,
      actualRevenue: 0,
      invoiced: 0,
      paid: 0,
      billed: 0,
      payments: 0,
      status: 'not-started',
      isCompleted: false,
      changeOrders: 0,
    },
    // Subcategory 1.1.1: Tree Removal (Item Line)
    {
      itemLine: "Tree Removal",
      costCode: "1.1.1",
      level: 3,
      parentCostCode: "1.1",
      isCategory: true,
      isExpanded: true,
      estimatedCost: 0,
      actualCost: 0,
      estimatedRevenue: 0,
      actualRevenue: 0,
      invoiced: 0,
      paid: 0,
      billed: 0,
      payments: 0,
      status: 'not-started',
      isCompleted: false,
      changeOrders: 0,
    },
    // Vendor 1.1.1.1: ABC Construction for Tree Removal
    {
      itemLine: "ABC Construction",
      contractor: "ABC Construction",
      costCode: "1.1.1.1",
      level: 4,
      parentCostCode: "1.1.1",
      vendor: "ABC Construction",
      unit: "each",
      quantity: 3,
      unitPrice: 333,
      estimatedCost: 1000,
      actualCost: 1100,
      estimatedRevenue: 1500,
      actualRevenue: 1600,
      invoiced: 1100,
      paid: 600,
      billed: 1600,
      payments: 800,
      startDate: "2025-01-27T00:00:00.000Z",
      dueDate: "2025-02-15T00:00:00.000Z",
      status: 'in-progress',
      isCompleted: false,
      changeOrders: 1,
    },
    // Vendor 1.1.1.2: Super Company for Tree Removal
    {
      itemLine: "Super Company",
      contractor: "Super Company",
      costCode: "1.1.1.2",
      level: 4,
      parentCostCode: "1.1.1",
      vendor: "Super Company",
      unit: "each",
      quantity: 2,
      unitPrice: 750,
      estimatedCost: 1500,
      actualCost: 1600,
      estimatedRevenue: 2000,
      actualRevenue: 2000,
      invoiced: 1600,
      paid: 900,
      billed: 2000,
      payments: 1200,
      startDate: "2025-01-15T00:00:00.000Z",
      dueDate: "2025-02-28T00:00:00.000Z",
      status: 'in-progress',
      isCompleted: false,
      changeOrders: 0,
    },
    // Subcategory 1.1.2: Brush Clearing
    {
      itemLine: "Brush Clearing",
      contractor: "ABC Construction",
      costCode: "1.1.2",
      level: 3,
      parentCostCode: "1.1",
      vendor: "ABC Construction",
      unit: "m²",
      quantity: 200,
      unitPrice: 15,
      estimatedCost: 3000,
      actualCost: 2800,
      estimatedRevenue: 4200,
      actualRevenue: 4200,
      invoiced: 2800,
      paid: 1500,
      billed: 4200,
      payments: 2200,
      startDate: "2025-03-01T00:00:00.000Z",
      dueDate: "2025-03-30T00:00:00.000Z",
      status: 'not-started',
      isCompleted: false,
      changeOrders: 2,
    },
    // Main Category 2: Concrete Works
    {
      itemLine: "Concrete Works",
      costCode: "2",
      level: 1,
      isCategory: true,
      isExpanded: true,
      estimatedCost: 0,
      actualCost: 0,
      estimatedRevenue: 0,
      actualRevenue: 0,
      invoiced: 0,
      paid: 0,
      billed: 0,
      payments: 0,
      status: 'not-started',
      isCompleted: false,
      changeOrders: 0,
    },
    // Category 2.1: Foundation
    {
      itemLine: "Foundation",
      contractor: "PlumbPro Services",
      costCode: "2.1",
      level: 2,
      parentCostCode: "2",
      vendor: "PlumbPro Services",
      unit: "m³",
      quantity: 40,
      unitPrice: 150,
      estimatedCost: 6000,
      actualCost: 6200,
      estimatedRevenue: 8000,
      actualRevenue: 8100,
      invoiced: 6200,
      paid: 3000,
      billed: 8100,
      payments: 4000,
      startDate: "2025-02-20T00:00:00.000Z",
      dueDate: "2025-04-10T00:00:00.000Z",
      status: 'completed',
      isCompleted: true,
      changeOrders: 0,
    }
  ]);

  const handleAddItemLine = (newItem: {
    itemLine: string;
    contractor?: string;
    estimatedCost: number;
    estimatedRevenue: number;
    startDate?: string;
    dueDate?: string;
    dependsOn?: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
    actionType?: string;
    selectedLevel1?: string;
    selectedLevel2?: string;
    selectedLevel3?: string;
    unit?: string;
    quantity?: number;
    unitPrice?: number;
  }, editingItem?: EstimateActualItem) => {
    if (editingItem) {
      // Update existing item
      setEstimatesActualsData(prev => prev.map(item => 
        item.itemLine === editingItem.itemLine 
          ? {
              ...item,
              ...newItem,
              isCompleted: newItem.status === 'completed'
            }
          : item
      ));
    } else {
      // Add new item with hierarchical structure
      const { actionType, selectedLevel1, selectedLevel2, selectedLevel3 } = newItem;
      
      if (!actionType) return;

      const costCode = generateCostCode(
        actionType, 
        estimatesActualsData, 
        selectedLevel1, 
        selectedLevel2, 
        selectedLevel3
      );
      
      const parentCostCode = getParentCostCode(
        actionType, 
        selectedLevel1, 
        selectedLevel2, 
        selectedLevel3
      );
      
      const level = getItemLevel(actionType);
      
      // Inherit vendor from parent if not provided
      const inheritedVendor = inheritVendorFromParent(estimatesActualsData, parentCostCode);
      const finalVendor = newItem.contractor || inheritedVendor;

      const newEstimateActualItem: EstimateActualItem = {
        itemLine: newItem.itemLine,
        contractor: finalVendor,
        vendor: finalVendor,
        costCode,
        level,
        parentCostCode,
        isCategory: level <= 3, // Categories are levels 1-3, vendors are level 4
        isExpanded: true,
        unit: newItem.unit,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        estimatedCost: newItem.estimatedCost,
        actualCost: 0,
        estimatedRevenue: newItem.estimatedRevenue,
        actualRevenue: 0,
        invoiced: 0,
        paid: 0,
        billed: 0,
        payments: 0,
        startDate: newItem.startDate,
        dueDate: newItem.dueDate,
        dependsOn: newItem.dependsOn,
        status: newItem.status,
        isCompleted: newItem.status === 'completed',
        changeOrders: 1, // New items after contract generation get 1 change order
      };
      
      setEstimatesActualsData(prev => [...prev, newEstimateActualItem]);
      console.log('Added new item:', newEstimateActualItem);
    }
  };

  const handleAddInvoicePayment = (itemLine: string, type: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill', amount: number, expectedDate: string, file?: File) => {
    setEstimatesActualsData(prev => prev.map(item => {
      if (item.itemLine === itemLine) {
        if (type === 'invoice') {
          return { 
            ...item, 
            invoiced: item.invoiced + amount,
            actualCost: item.invoiced + amount
          };
        } else if (type === 'bill-paid') {
          return { 
            ...item, 
            payments: item.payments + amount
          };
        } else if (type === 'invoice-paid') {
          return { 
            ...item, 
            paid: item.paid + amount
          };
        } else if (type === 'bill') {
          return { 
            ...item, 
            billed: item.billed + amount,
            actualRevenue: item.billed + amount
          };
        }
      }
      return item;
    }));

    if (file) {
      const newDoc: FinancialDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: type === 'bill' ? 'bill' : type === 'invoice' ? 'invoice' : 'payment',
        uploadDate: new Date().toISOString(),
        amount: amount,
        itemLine: itemLine,
        expectedDate: expectedDate
      };
      addDocument(newDoc);
    }
  };

  const handleItemLineAction = (itemLine: string, action: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill' | 'details' | 'edit' | 'delete' | 'complete') => {
    if (action === 'delete') {
      setEstimatesActualsData(prev => prev.filter(item => item.itemLine !== itemLine));
      return null;
    } else if (action === 'complete') {
      setEstimatesActualsData(prev => prev.map(item => 
        item.itemLine === itemLine 
          ? { 
              ...item, 
              isCompleted: !item.isCompleted,
              status: !item.isCompleted ? 'completed' : 'in-progress'
            }
          : item
      ));
      return null;
    } else if (action === 'edit') {
      return estimatesActualsData.find(i => i.itemLine === itemLine);
    }
    
    return null;
  };

  return {
    estimatesActualsData,
    handleAddItemLine,
    handleAddInvoicePayment,
    handleItemLineAction,
  };
};
