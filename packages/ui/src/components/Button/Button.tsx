import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "tec-button tec-button--primary",
  secondary: "tec-button tec-button--secondary",
  ghost: "tec-button tec-button--ghost",
};

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps): ReactNode {
  const classes = [variantClasses[variant], className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
