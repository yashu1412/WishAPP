import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isGlowing?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  isGlowing = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-3xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:from-accent hover:via-secondary hover:to-primary shadow-lg hover:shadow-xl",
    secondary: "bg-surface text-white border-2 border-border hover:bg-white/10 hover:border-primary/30 transition-all",
    ghost: "text-text-secondary hover:text-white hover:bg-white/10 transition-all",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
  };

  const glowClasses = isGlowing
    ? "shadow-glow-purple hover:shadow-[0_0_40px_rgba(109,40,217,0.8)]"
    : "";

  return (
    <motion.button
      whileHover={!isLoading && !disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.97 } : {}}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glowClasses,
        (isLoading || disabled) && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isLoading || disabled}
      {...(props as any)}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};
