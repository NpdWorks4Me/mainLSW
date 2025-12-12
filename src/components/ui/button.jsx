"use client";
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg text-base font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[48px] min-w-[48px] p-3 font-sans active:scale-95',
	{
		variants: {
			variant: {
				default:
          'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold btn-glow',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
          'border border-purple-500/50 bg-transparent text-purple-300 hover:bg-purple-500/20 hover:text-white',
        secondary:
          'bg-purple-500/30 text-white hover:bg-purple-500/50',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-pink-500 underline-offset-4 hover:underline hover:text-blue-400',
        cta: 'pushable',
        shop: 'btn-y2k rounded-full text-white uppercase tracking-wider font-extrabold', 
			},
			size: {
				default: 'h-12 px-6',
				sm: 'h-10 rounded-lg px-4',
				lg: 'h-14 rounded-xl px-8 text-lg',
				icon: 'h-12 w-12',
        cta: 'h-11 px-4 text-sm'
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';

  const handleClick = (event) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    if (props.onClick) {
      props.onClick(event);
    }
  };

  if (variant === 'cta') {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }), 'p-0 border-none bg-transparent')}
          ref={ref}
          {...props}
          onClick={handleClick}
        >
          {React.cloneElement(children, {
            children: (
              <>
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front">
                  {children.props.children}
                </span>
              </>
            )
          })}
        </Slot>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), 'p-0 border-none bg-transparent')}
        ref={ref}
        {...props}
        onClick={handleClick}
      >
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front">
          {children}
        </span>
      </button>
    );
  }

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }), 'interactive-star-effect button-ripple')}
			ref={ref}
			{...props}
      onClick={handleClick}
		>
      {children}
    </Comp>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };