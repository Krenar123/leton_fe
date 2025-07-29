import { useState } from "react";
import { Plus, FileText, Receipt, CreditCard, DollarSign, StickyNote, Upload, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ProjectSelectionDialog } from "./ProjectSelectionDialog";
import { AIButton } from "./AIButton";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  requiresProject: boolean;
  action: () => void;
}

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleActionWithProject = (actionId: string) => {
    setSelectedActionId(actionId);
    setShowProjectSelection(true);
    setIsOpen(false);
  };

  const handleProjectSelected = (projectId: number) => {
    setShowProjectSelection(false);
    switch (selectedActionId) {
      case 'invoice':
        navigate(`/projects/${projectId}/financials`, {
          state: {
            openDialog: 'addInvoicePayment',
            actionType: 'invoice'
          }
        });
        break;
      case 'bill':
        navigate(`/projects/${projectId}/financials`, {
          state: {
            openDialog: 'addInvoicePayment',
            actionType: 'bill'
          }
        });
        break;
      case 'accounts-receivable':
        navigate(`/projects/${projectId}/financials`, {
          state: {
            openDialog: 'addInvoicePayment',
            actionType: 'bill-paid'
          }
        });
        break;
      case 'accounts-payable':
        navigate(`/projects/${projectId}/financials`, {
          state: {
            openDialog: 'addInvoicePayment',
            actionType: 'invoice-paid'
          }
        });
        break;
      case 'note':
        navigate(`/projects/${projectId}`, {
          state: {
            openDialog: 'notes'
          }
        });
        break;
      case 'document':
        navigate(`/projects/${projectId}`, {
          state: {
            openDialog: 'documents'
          }
        });
        break;
    }
    setSelectedActionId(null);
  };

  const quickActions = [{
    id: 'project',
    label: 'New Project',
    icon: <Folder className="h-5 w-5" />,
    requiresProject: false,
    action: () => {
      navigate('/projects', {
        state: {
          openNewProject: true
        }
      });
      setIsOpen(false);
    }
  }, {
    id: 'invoice',
    label: 'New Invoice',
    icon: <Receipt className="h-5 w-5" />,
    requiresProject: true,
    action: () => handleActionWithProject('invoice')
  }, {
    id: 'bill',
    label: 'New Bill',
    icon: <FileText className="h-5 w-5" />,
    requiresProject: true,
    action: () => handleActionWithProject('bill')
  }, {
    id: 'accounts-receivable',
    label: 'Accounts Receivable (Paid Bill)',
    icon: <CreditCard className="h-5 w-5" />,
    requiresProject: true,
    action: () => handleActionWithProject('accounts-receivable')
  }, {
    id: 'accounts-payable',
    label: 'Accounts Payable (Paid Invoice)',
    icon: <DollarSign className="h-5 w-5" />,
    requiresProject: true,
    action: () => handleActionWithProject('accounts-payable')
  }, {
    id: 'note',
    label: 'New Note',
    icon: <StickyNote className="h-5 w-5" />,
    requiresProject: true,
    action: () => handleActionWithProject('note')
  }, {
    id: 'document',
    label: 'New Document Upload',
    icon: <Upload className="h-5 w-5" />,
    requiresProject: true,
    action: () => handleActionWithProject('document')
  }];

  return (
    <div className="flex items-center space-x-3">
      <AIButton />
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full bg-[#d9a44d] hover:bg-[#c7933e] animate-pulse">
            <Plus className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Quick Actions</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-3">
            {quickActions.map(action => (
              <Card key={action.id} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={action.action}>
                <div className="flex items-center space-x-3">
                  <div className="text-primary">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{action.label}</h3>
                    {action.requiresProject && (
                      <p className="text-sm text-muted-foreground">
                        Select project first
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showProjectSelection} onOpenChange={setShowProjectSelection}>
        <ProjectSelectionDialog 
          isOpen={showProjectSelection} 
          onClose={() => setShowProjectSelection(false)} 
          onProjectSelect={handleProjectSelected} 
          title="Select Project" 
          description="Choose a project for this action" 
        />
      </Dialog>
    </div>
  );
};
