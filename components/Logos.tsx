import type { ReactNode } from "react";

type IconProps = { className?: string };

function MarkStar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path d="M12 1l2.7 6.3L21 10l-6.3 2.7L12 19l-2.7-6.3L3 10l6.3-2.7L12 1z" fill="currentColor" />
    </svg>
  );
}

function XaiMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path d="M4 4h4.1L12 9.2 15.9 4H20l-5.6 7.5L20 20h-4.1L12 14.8 8.1 20H4l5.6-8.5L4 4z" fill="currentColor" />
    </svg>
  );
}

function OpenAIMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function AnthropicMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path d="M12 5l7 14H5L12 5z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GoogleMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <circle cx="16" cy="8" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="8" cy="16" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function MetaMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path
        d="M3 15c2.8-6 4.6-6 9 3 4.4-9 6.2-9 9-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VercelMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path d="M12 5l7 13H5L12 5z" fill="currentColor" />
    </svg>
  );
}

function GitHubMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
      <path d="M9 15c1.8 1 4.2 1 6 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MCPMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path d="M8 7v4H6v6h12v-6h-2V7h-2v4h-4V7H8z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export type LogoItem = {
  name: string;
  icon: ReactNode;
};

export const logoItems: LogoItem[] = [
  { name: "xAI", icon: <XaiMark /> },
  { name: "OpenAI", icon: <OpenAIMark /> },
  { name: "Anthropic", icon: <AnthropicMark /> },
  { name: "Google", icon: <GoogleMark /> },
  { name: "Meta", icon: <MetaMark /> },
  { name: "Vercel", icon: <VercelMark /> },
  { name: "GitHub", icon: <GitHubMark /> },
  { name: "MCP", icon: <MCPMark /> },
];

export { MarkStar };
