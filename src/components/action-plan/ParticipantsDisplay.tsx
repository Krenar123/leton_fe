
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ParticipantsDisplayProps {
  participants: string[];
}

export const ParticipantsDisplay = ({ participants }: ParticipantsDisplayProps) => {
  if (participants.length === 0) return <span className="text-gray-500">No participants</span>;
  
  if (participants.length <= 2) {
    return (
      <div className="flex flex-wrap gap-1">
        {participants.map((participant, index) => (
          <span 
            key={index}
            className="text-gray-700 text-sm"
          >
            {participant}{index < participants.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    );
  }

  const displayedParticipants = participants.slice(0, 2);
  const remainingCount = participants.length - 2;

  return (
    <div className="flex flex-wrap gap-1">
      {displayedParticipants.map((participant, index) => (
        <span 
          key={index}
          className="text-gray-700 text-sm"
        >
          {participant}, 
        </span>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <span className="text-blue-600 text-sm cursor-pointer hover:text-blue-800 transition-colors underline">
            +{remainingCount} others
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="space-y-1">
            <p className="font-medium text-sm">All Participants:</p>
            {participants.map((participant, index) => (
              <div key={index} className="text-sm text-gray-600">
                {participant}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
