
import { useState } from "react";
import { Plus, FileText, Receipt, CreditCard, DollarSign, StickyNote, Upload, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProjectSelectionDialog } from "./ProjectSelectionDialog";

interface QuickActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionsDialog = ({ isOpen, onClose }: QuickActionsDialogProps) => {
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleActionWithProject = (actionId: string) => {
    setSelectedActionId(actionId);
    setShowProjectSelection(true);
    onClose();
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
      onClose();
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-96 bg-slate-900/90 backdrop-blur-sm border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Quick Actions</DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-3">
            {quickActions.map(action => (
              <Card key={action.id} className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors bg-slate-800/30 border-slate-600" onClick={action.action}>
                <div className="flex items-center space-x-3">
                  <div className="text-[#d9a44d]">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{action.label}</h3>
                    {action.requiresProject && (
                      <p className="text-sm text-slate-400">
                        Select project first
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ProjectSelectionDialog 
        isOpen={showProjectSelection} 
        onClose={() => setShowProjectSelection(false)} 
        onProjectSelect={handleProjectSelected} 
        title="Select Project" 
        description="Choose a project for this action" 
      />
    </>
  );
};
