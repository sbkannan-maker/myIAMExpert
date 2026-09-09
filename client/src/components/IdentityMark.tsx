type IdentityMarkProps = {
  className?: string;
  size?: number;
};

export default function IdentityMark({ className = "", size = 32 }: IdentityMarkProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 11.5 16 7l8 4.5v9L16 25l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.25" opacity=".7" />
      <path d="M8 11.5 16 16l8-4.5M16 16v9" stroke="currentColor" strokeWidth="1.25" opacity=".55" />
      <circle cx="16" cy="7" r="2.5" fill="currentColor" />
      <circle cx="8" cy="11.5" r="2.5" fill="currentColor" opacity=".85" />
      <circle cx="24" cy="11.5" r="2.5" fill="currentColor" opacity=".85" />
      <circle cx="16" cy="25" r="2.5" fill="currentColor" opacity=".7" />
      <circle cx="16" cy="16" r="2.7" fill="currentColor" />
    </svg>
  );
}
