
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { AIChatDialog } from "./AIChatDialog";

export const AIButton = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <>
      <Button 
        size="icon" 
        className="rounded-full bg-[#d9a44d] hover:bg-[#c7933e] animate-pulse"
        onClick={() => setIsAIChatOpen(true)}
      >
        <Bot className="h-5 w-5" />
      </Button>

      <AIChatDialog 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />
    </>
  );
};
