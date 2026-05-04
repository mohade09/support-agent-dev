import { Link } from "@tanstack/react-router";

interface LogoProps {
  to?: string;
  className?: string;
  showText?: boolean;
  subtitle?: string;
}

export function Logo({
  to = "/",
  className = "",
  showText = true,
  subtitle,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.svg" alt="Databricks" className="h-7 w-7" />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-[15px] tracking-tight">
            Databricks
          </span>
          {subtitle && (
            <span className="text-[11px] text-muted-foreground tracking-wide">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
