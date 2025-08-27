import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const terminalButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium font-terminal transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "terminal-border hover-glow hover:glow-border",
        primary: "glow-border text-primary-foreground hover:animate-glow-pulse",
        secondary: "glow-border-secondary text-secondary-foreground hover:glow-border-secondary",
        accent: "glow-border-accent text-accent-foreground hover:glow-border-accent",
        ghost: "hover:terminal-border hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline neon-text-cyan",
        neon: "border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TerminalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof terminalButtonVariants> {
  asChild?: boolean
}

const TerminalButton = React.forwardRef<HTMLButtonElement, TerminalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(terminalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
TerminalButton.displayName = "TerminalButton"

export { TerminalButton, terminalButtonVariants }