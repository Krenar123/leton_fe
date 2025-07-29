import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TutorialVideosDialog } from "./TutorialVideosDialog";
export const LogoButton = () => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  return <>
      

      <TutorialVideosDialog isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </>;
};