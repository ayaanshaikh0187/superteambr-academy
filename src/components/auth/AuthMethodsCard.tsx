"use client";

import { WalletButton } from "@/components/WalletButton";

type ProviderState = {
  google: boolean;
  github: boolean;
};

export function AuthMethodsCard({
  title,
  subtitle,
  providers,
  onGoogle,
  onGithub,
  walletLabel,
  googleLabel,
  githubLabel,
  googleUnavailable,
  githubUnavailable,
}: {
  title: string;
  subtitle: string;
  providers: ProviderState;
  onGoogle: () => void;
  onGithub: () => void;
  walletLabel: string;
  googleLabel: string;
  githubLabel: string;
  googleUnavailable: string;
  githubUnavailable: string;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <p className="text-sm mt-1 mb-5" style={{ color: "var(--text-secondary)" }}>
        {subtitle}
      </p>

      <div className="space-y-3">
        <button
          onClick={onGoogle}
          disabled={!providers.google}
          className="w-full min-h-[44px] rounded-xl px-4 text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
          title={!providers.google ? googleUnavailable : undefined}
        >
          {providers.google ? googleLabel : googleUnavailable}
        </button>

        <button
          onClick={onGithub}
          disabled={!providers.github}
          className="w-full min-h-[44px] rounded-xl px-4 text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
          title={!providers.github ? githubUnavailable : undefined}
        >
          {providers.github ? githubLabel : githubUnavailable}
        </button>

        <div className="pt-2">
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            {walletLabel}
          </p>
          <WalletButton />
        </div>
      </div>
    </div>
  );
}

