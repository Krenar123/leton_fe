import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Triangle, Building2, Upload, HelpCircle, Settings as SettingsIcon } from "lucide-react";
import FAQContact from "./FAQContact";

const settingsSections = [{
  id: "sops",
  title: "SOPs",
  description: "Standard Operating Procedures and Leton Consulting guidelines",
  icon: Triangle,
  badge: "Guide"
}, {
  id: "account",
  title: "Account",
  description: "Company details, pricing plans, and payment management",
  icon: Building2,
  badge: "Business"
}, {
  id: "manual-journals",
  title: "Manual Journals",
  description: "Import data manually or via Excel into Leton",
  icon: Upload,
  badge: "Import"
}, {
  id: "faqs",
  title: "FAQs & Contact",
  description: "Help center and support contact information",
  icon: HelpCircle,
  badge: "Support"
}, {
  id: "settings",
  title: "Settings",
  description: "Tool preferences, themes, and notification settings",
  icon: SettingsIcon,
  badge: "Config"
}];

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  const renderSectionContent = () => {
    if (selectedSection === "faqs") {
      return <FAQContact />;
    }
    
    return <div className="bg-white rounded-lg border border-slate-200 p-8">
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {settingsSections.find(s => s.id === selectedSection)?.title}
        </h3>
        <p className="text-slate-600">
          This section is under development. The {settingsSections.find(s => s.id === selectedSection)?.title.toLowerCase()} functionality will be available soon.
        </p>
        <button onClick={() => setSelectedSection(null)} className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Back to Profile
        </button>
      </div>
    </div>;
  };

  if (selectedSection) {
    return <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button onClick={() => setSelectedSection(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Back to Profile
        </button>
      </div>
      {renderSectionContent()}
    </div>;
  }
  return <div className="space-y-6">
    <div className="space-y-4 my-[16px] px-0 mx-[16px]">
      {settingsSections.map(section => <Card key={section.id} className="cursor-pointer hover:shadow-md transition-shadow border border-slate-200 w-full" onClick={() => setSelectedSection(section.id)}>
          <CardContent className="p-6 px-[16px] py-[16px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-inherit">
                  <section.icon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {section.description}
                  </p>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>)}
    </div>
  </div>;
};

export default Settings;
