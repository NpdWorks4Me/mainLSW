import { cn } from '@/lib/utils';
import React from 'react';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if(props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if(props.onBlur) props.onBlur(e);
  };
	return (
		<input
			type={type}
			className={cn(
				'flex h-12 w-full rounded-xl border-2 border-input bg-transparent px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out',
        isFocused ? 'border-pink-400 shadow-md shadow-pink-400/20' : 'border-white/20',
				className,
			)}
			ref={ref}
      onFocus={handleFocus}
      onBlur={handleBlur}
			{...props}
		/>
	);
});
Input.displayName = 'Input';

export { Input };