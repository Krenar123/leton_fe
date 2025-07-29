
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContactDialog } from "@/components/faq/ContactDialog";
import { MessageCircle } from "lucide-react";

const faqData = {
  functionality: [
    {
      id: "func-1",
      question: "How do I create a new project in Leton?",
      answer: "To create a new project, navigate to the Projects page and click the 'New Project' button. Fill in the project details including name, client, timeline, and budget information."
    },
    {
      id: "func-2",
      question: "How can I track project financials?",
      answer: "Use the Financials tab in each project to track income, expenses, invoices, and payments. You can view cash flow graphs and generate financial reports."
    },
    {
      id: "func-3",
      question: "How do I manage team assignments?",
      answer: "Go to the Team section to add team members, assign them to projects, and track their tasks and objectives. You can also manage wage payments and generate team reports."
    },
    {
      id: "func-4",
      question: "What is the Action Plan feature?",
      answer: "The Action Plan helps you organize project objectives and tasks in a structured way. You can create objectives, break them down into tasks, assign team members, and track progress using Gantt charts."
    },
    {
      id: "func-5",
      question: "How do I generate reports?",
      answer: "Navigate to the Reports section where you can generate various types of reports including project summaries, financial reports, team performance reports, and custom reports based on your specific needs."
    }
  ],
  account: [
    {
      id: "acc-1",
      question: "How do I change my account password?",
      answer: "Go to Settings > Account and click on 'Change Password'. Enter your current password and your new password twice to confirm the change."
    },
    {
      id: "acc-2",
      question: "How can I upgrade my subscription plan?",
      answer: "Visit Settings > Account > Subscription to view available plans and upgrade options. You can change your plan at any time, and billing will be adjusted accordingly."
    },
    {
      id: "acc-3",
      question: "Can I add more users to my account?",
      answer: "Yes, you can add team members through Settings > Account > Team Management. The number of users depends on your subscription plan."
    },
    {
      id: "acc-4",
      question: "How do I cancel my subscription?",
      answer: "To cancel your subscription, go to Settings > Account > Subscription and click 'Cancel Subscription'. Your account will remain active until the end of your current billing period."
    },
    {
      id: "acc-5",
      question: "How can I export my data?",
      answer: "You can export your data through Settings > Account > Data Export. Choose the data types you want to export and the format (CSV, PDF, Excel)."
    },
    {
      id: "acc-6",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions."
    }
  ]
};

const FAQContact = () => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Find answers to common questions or contact our team for personalized assistance
        </p>
        
        <Button 
          onClick={() => setIsContactDialogOpen(true)}
          className="bg-[#0a1f44] hover:bg-[#0d2356] text-white px-6 py-3 rounded-md flex items-center space-x-2 mx-auto"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Contact Leton Team</span>
        </Button>
      </div>

      {/* FAQ Sections */}
      <div className="w-full space-y-8">
        {/* Functionality FAQ */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
              <span>Functionality</span>
            </CardTitle>
            <p className="text-sm text-slate-600">Learn how to use Leton's features and capabilities</p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.functionality.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left hover:text-[#0a1f44]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Account FAQ */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
              <span>Account</span>
            </CardTitle>
            <p className="text-sm text-slate-600">Manage your account, billing, and subscription settings</p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.account.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left hover:text-[#0a1f44]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Contact Dialog */}
      <ContactDialog 
        isOpen={isContactDialogOpen} 
        onClose={() => setIsContactDialogOpen(false)} 
      />
    </div>
  );
};

export default FAQContact;
