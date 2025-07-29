
import { CheckCircle, Clock, AlertCircle, Cog } from "lucide-react";

interface StatusIconProps {
  status: 'Planned' | 'In Progress' | 'Finished' | 'Already Due';
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

export const StatusIcon = ({ 
  status, 
  className = "w-4 h-4", 
  onClick,
  isClickable = false 
}: StatusIconProps) => {
  const baseClasses = isClickable ? `${className} cursor-pointer hover:opacity-70 transition-opacity` : className;
  
  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  switch (status) {
    case 'Finished':
      return <CheckCircle className={`${baseClasses} text-green-500`} onClick={handleClick} />;
    case 'In Progress':
      return <Cog className={`${baseClasses} text-blue-500`} onClick={handleClick} />;
    case 'Already Due':
      return <AlertCircle className={`${baseClasses} text-red-500`} onClick={handleClick} />;
    case 'Planned':
      return <Clock className={`${baseClasses} text-gray-500`} onClick={handleClick} />;
    default:
      return <Clock className={`${baseClasses} text-gray-500`} onClick={handleClick} />;
  }
};
