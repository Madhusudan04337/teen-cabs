interface BrandLogoMarkProps {
  className?: string;
  size?: number;
}

export function BrandLogoMark({ className = '', size = 32 }: BrandLogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Lower-left rounded chevron */}
      <path
        d="M14 27 H33 V46"
        stroke="#DFBA78"
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="miter"
      />
      {/* Upper-right rounded chevron */}
      <path
        d="M27 14 H47 V34"
        stroke="#DFBA78"
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
