
import { EstimateActualItem } from "@/types/financials";

export const generateCostCode = (
  actionType: string,
  existingItems: EstimateActualItem[],
  selectedLevel1?: string,
  selectedLevel2?: string,
  selectedLevel3?: string
): string => {
  switch (actionType) {
    case 'add-main-category': {
      // Find the highest level 1 number
      const level1Items = existingItems.filter(item => item.level === 1);
      const maxLevel1 = level1Items.length > 0 
        ? Math.max(...level1Items.map(item => parseInt(item.costCode?.split('.')[0] || '0')))
        : 0;
      return (maxLevel1 + 1).toString();
    }
    
    case 'add-category': {
      if (!selectedLevel1) return '';
      // Find the highest level 2 number under the selected level 1
      const level2Items = existingItems.filter(item => 
        item.level === 2 && item.parentCostCode === selectedLevel1
      );
      const maxLevel2 = level2Items.length > 0
        ? Math.max(...level2Items.map(item => parseInt(item.costCode?.split('.')[1] || '0')))
        : 0;
      return `${selectedLevel1}.${maxLevel2 + 1}`;
    }
    
    case 'add-item-line': {
      if (!selectedLevel2) return '';
      // Find the highest level 3 number under the selected level 2
      const level3Items = existingItems.filter(item => 
        item.level === 3 && item.parentCostCode === selectedLevel2
      );
      const maxLevel3 = level3Items.length > 0
        ? Math.max(...level3Items.map(item => parseInt(item.costCode?.split('.')[2] || '0')))
        : 0;
      return `${selectedLevel2}.${maxLevel3 + 1}`;
    }
    
    case 'add-vendor': {
      if (!selectedLevel3) return '';
      // Find the highest level 4 number under the selected level 3
      const level4Items = existingItems.filter(item => 
        item.level === 4 && item.parentCostCode === selectedLevel3
      );
      const maxLevel4 = level4Items.length > 0
        ? Math.max(...level4Items.map(item => parseInt(item.costCode?.split('.')[3] || '0')))
        : 0;
      return `${selectedLevel3}.${maxLevel4 + 1}`;
    }
    
    default:
      return '';
  }
};

export const getParentCostCode = (
  actionType: string,
  selectedLevel1?: string,
  selectedLevel2?: string,
  selectedLevel3?: string
): string | undefined => {
  switch (actionType) {
    case 'add-main-category':
      return undefined;
    case 'add-category':
      return selectedLevel1;
    case 'add-item-line':
      return selectedLevel2;
    case 'add-vendor':
      return selectedLevel3;
    default:
      return undefined;
  }
};

export const getItemLevel = (actionType: string): number => {
  switch (actionType) {
    case 'add-main-category':
      return 1;
    case 'add-category':
      return 2;
    case 'add-item-line':
      return 3;
    case 'add-vendor':
      return 4;
    default:
      return 1;
  }
};

export const inheritVendorFromParent = (
  existingItems: EstimateActualItem[],
  parentCostCode?: string
): string | undefined => {
  if (!parentCostCode) return undefined;
  
  const parentItem = existingItems.find(item => item.costCode === parentCostCode);
  return parentItem?.contractor || parentItem?.vendor;
};
