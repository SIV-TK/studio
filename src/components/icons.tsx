import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h16v16H4z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M9 12h6" stroke="hsl(var(--primary-foreground))" />
      <path d="M12 9v6" stroke="hsl(var(--primary-foreground))" />
      <path d="M12 4v2" stroke="hsl(var(--foreground))" />
      <path d="M12 18v2" stroke="hsl(var(--foreground))" />
      <path d="M4 12h2" stroke="hsl(var(--foreground))" />
      <path d="M18 12h2" stroke="hsl(var(--foreground))" />
    </svg>
  );
}
