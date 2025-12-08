"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "./utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:shadow-primary/40",
      secondary: "bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20",
      ghost: "hover:bg-white/5 text-foreground/80 hover:text-foreground",
      glass: "glass-panel hover:bg-white/10 text-white",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children as React.ReactNode}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
