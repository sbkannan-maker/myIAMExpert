type KBrandMarkProps = {
  size?: number;
  className?: string;
};

export default function KBrandMark({ size = 36, className = "" }: KBrandMarkProps) {
  return <img src="/manus-storage/kannan-k-logo_a0cf9df4.png" alt="Kannan identity security mark" width={size} height={size} className={`object-contain ${className}`} />;
}
