import { ReactNode } from 'react';

type AlertVariant = 'default' | 'destructive';

export function Alert({
  children,
  variant = 'default',
  className = '',
}: {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}) {
  const variantStyles: Record<AlertVariant, string> = {
    default: 'bg-blue-50 border-blue-400 text-blue-800',
    destructive: 'bg-red-50 border-red-400 text-red-800',
  };

  return (
    <div className={`p-4 border rounded-md ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}
