import { clsx } from "clsx";

type ButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  readonly variant?: "primary" | "secondary" | "danger";
  readonly loading?: boolean;
};

export default function Button({
  variant = "primary",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary:
      "border border-blue-300 text-blue-500 hover:bg-blue-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
}
