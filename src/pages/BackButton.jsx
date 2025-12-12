import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BackButton = ({ className, label = "Back", onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-1.5 text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all duration-300 rounded-lg px-3.5 py-1.5 text-sm border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-sm min-h-0 h-auto min-w-0",
        className
      )}
    >
      <div className="p-0.5 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:animate-[spin_1.5s_linear_infinite] group-active:animate-[spin_1.5s_linear_infinite]" />
      </div>
      <span className="font-medium tracking-wide text-xs sm:text-sm">{label}</span>
    </Button>
  );
};

export default BackButton;