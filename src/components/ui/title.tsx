import React from "react";
import { cn } from "@/lib/utils";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "gradient" | "outline" | "shadow" | "primary";
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
}

export function Title({
  children,
  size = "md",
  variant = "default",
  align = "left",
  weight = "bold",
  className,
  ...props
}: TitleProps) {
  const sizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };

  const variantClasses = {
    default: "text-foreground",
    gradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary",
    outline:
      "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary [text-shadow:_-1px_-1px_0_theme(colors.primary),_1px_-1px_0_theme(colors.primary),_-1px_1px_0_theme(colors.primary),_1px_1px_0_theme(colors.primary)]",
    primary:
      "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary [text-shadow:_-1px_-1px_0_theme(colors.primary),_1px_-1px_0_theme(colors.primary),_-1px_1px_0_theme(colors.primary),_1px_1px_0_theme(colors.primary)] from-green-400 to-blue-500 font-bold",
    shadow: "text-foreground drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  return (
    <h1
      className={cn(
        "tracking-tight leading-tight mb-4",
        sizeClasses[size],
        variantClasses[variant],
        alignClasses[align],
        weightClasses[weight],
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
