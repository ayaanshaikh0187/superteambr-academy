"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  BookOpen,
  Award,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Code2,
  Shield,
  Wallet,
  Trophy,
  GraduationCap,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";

/* ── Data ────────────────────────────────────────────────────────────────── */

const STATS = [
  { id: "activeLearners", labelKey: "stats.activeLearners", value: "500+", icon: GraduationCap },
  { id: "lessonsCompleted", labelKey: "stats.lessonsCompleted", value: "10K+", icon: BookOpen },
  { id: "xpMinted", labelKey: "stats.xpMinted", value: "1M+", icon: Zap },
  { id: "credentialsIssued", labelKey: "stats.credentialsIssued", value: "200+", icon: Award },
];

const FEATURES = [
  {
    id: "earnXp",
    icon: Zap,
    titleKey: "features.earnXp.title",
    descriptionKey: "features.earnXp.description",
    accent: "var(--solana-purple)",
    accentBg: "rgba(153,69,255,0.08)",
  },
  {
    id: "credentials",
    icon: Award,
    titleKey: "features.credentials.title",
    descriptionKey: "features.credentials.description",
    accent: "var(--solana-green)",
    accentBg: "rgba(25,251,155,0.08)",
  },
  {
    id: "progress",
    icon: TrendingUp,
    titleKey: "features.progress.title",
    descriptionKey: "features.progress.description",
    accent: "#5497d5",
    accentBg: "rgba(84,151,213,0.08)",
  },
  {
    id: "developerContent",
    icon: BookOpen,
    titleKey: "features.developerContent.title",
    descriptionKey: "features.developerContent.description",
    accent: "#43b4ca",
    accentBg: "rgba(67,180,202,0.08)",
  },
];

const LEARNING_PATHS = [
  {
    id: "fundamentals",
    titleKey: "paths.fundamentals.title",
    descriptionKey: "paths.fundamentals.description",
    lessons: 12,
    xp: 1200,
    difficultyKey: "paths.fundamentals.difficulty",
    diffColor: "var(--solana-green)",
  },
  {
    id: "anchor",
    titleKey: "paths.anchor.title",
    descriptionKey: "paths.anchor.description",
    lessons: 15,
    xp: 1500,
    difficultyKey: "paths.anchor.difficulty",
    diffColor: "#facc15",
  },
  {
    id: "defi",
    titleKey: "paths.defi.title",
    descriptionKey: "paths.defi.description",
    lessons: 10,
    xp: 2000,
    difficultyKey: "paths.defi.difficulty",
    diffColor: "#f87171",
  },
];

const TESTIMONIALS = [
  {
    id: "ana",
    nameKey: "testimonials.ana.name",
    roleKey: "testimonials.ana.role",
    quoteKey: "testimonials.ana.quote",
    avatar: "AS",
    color: "var(--solana-purple)",
  },
  {
    id: "carlos",
    nameKey: "testimonials.carlos.name",
    roleKey: "testimonials.carlos.role",
    quoteKey: "testimonials.carlos.quote",
    avatar: "CM",
    color: "var(--solana-green)",
  },
  {
    id: "beatriz",
    nameKey: "testimonials.beatriz.name",
    roleKey: "testimonials.beatriz.role",
    quoteKey: "testimonials.beatriz.quote",
    avatar: "BL",
    color: "var(--solana-cyan)",
  },
];

const NEWSLETTER_STORAGE_KEY = "academy_newsletter";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeNewsletterEmail(raw: string): string | null {
  const normalized = raw.trim().toLowerCase();
  if (!normalized || !EMAIL_PATTERN.test(normalized)) return null;
  return normalized;
}

function parseNewsletterEntries(raw: string | null): Array<{ email: string; ts: number }> {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { email: string; ts: number } =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as { email?: unknown }).email === "string" &&
            typeof (item as { ts?: unknown }).ts === "number",
        ),
    );
  } catch {
    return [];
  }
}

const TECH_BADGES = [
  { id: "token2022", labelKey: "techBadges.token2022", icon: Shield },
  { id: "metaplexCore", labelKey: "techBadges.metaplexCore", icon: Award },
  { id: "anchor", labelKey: "techBadges.anchor", icon: Code2 },
  { id: "devnetReady", labelKey: "techBadges.devnetReady", icon: Wallet },
];

const HOW_IT_WORKS = [
  {
    id: "connectWallet",
    step: "01",
    titleKey: "howItWorks.connectWallet.title",
    descKey: "howItWorks.connectWallet.desc",
    icon: Wallet,
  },
  {
    id: "enrollLearn",
    step: "02",
    titleKey: "howItWorks.enrollLearn.title",
    descKey: "howItWorks.enrollLearn.desc",
    icon: Code2,
  },
  {
    id: "earnOnchain",
    step: "03",
    titleKey: "howItWorks.earnOnchain.title",
    descKey: "howItWorks.earnOnchain.desc",
    icon: Trophy,
  },
];

const ECOSYSTEM_PARTNERS = [
  { id: "solana", nameKey: "ecosystem.solana", emoji: "S", color: "#9945FF" },
  { id: "metaplex", nameKey: "ecosystem.metaplex", emoji: "M", color: "#19FB9B" },
  { id: "anchor", nameKey: "ecosystem.anchor", emoji: "A", color: "#5497d5" },
  { id: "helius", nameKey: "ecosystem.helius", emoji: "H", color: "#facc15" },
  { id: "superteam", nameKey: "ecosystem.superteam", emoji: "ST", color: "#008c4c" },
  { id: "token2022", nameKey: "ecosystem.token2022", emoji: "T", color: "#43b4ca" },
];

/* ── Floating particles on the hero (purely decorative) ──────────────── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="floating-orb"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + i * 1.5}s`,
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            background:
              i % 2 === 0
                ? "radial-gradient(circle, rgba(153,69,255,0.12) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(25,251,155,0.08) 0%, transparent 70%)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated counter ──────────────────────────────────────────────────── */
function AnimatedStat({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div className="flex justify-center mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(153,69,255,0.1)" }}
        >
          <Icon size={18} style={{ color: "var(--solana-purple)" }} />
        </div>
      </div>
      <dd className="text-2xl sm:text-3xl font-bold gradient-solana-text">{value}</dd>
      <dt
        className="text-xs font-semibold uppercase tracking-wider mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </dt>
    </div>
  );
}

/* ── Fade-in on scroll wrapper ─────────────────────────────────────────── */
function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}


/* ── Main Landing Page ─────────────────────────────────────────────────── */
export default function LandingPage() {
  const { connected } = useWallet();
  const t = useTranslations("Landing");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = normalizeNewsletterEmail(email);
    if (!normalizedEmail) return;
    if (typeof window !== "undefined") {
      const existing = parseNewsletterEntries(
        localStorage.getItem(NEWSLETTER_STORAGE_KEY),
      );
      const withoutDuplicates = existing.filter(
        (entry) => entry.email !== normalizedEmail,
      );
      localStorage.setItem(
        NEWSLETTER_STORAGE_KEY,
        JSON.stringify([
          ...withoutDuplicates,
          { email: normalizedEmail, ts: Date.now() },
        ]),
      );
    }
    setEmail(normalizedEmail);
    setSubscribed(true);
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Layered gradient backgrounds */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(153,69,255,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(25,251,155,0.06) 0%, transparent 70%)",
          }}
        />

        <FloatingParticles />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-28 pb-24 sm:pb-32 relative">
          {/* Built on Solana badge */}
          <FadeInSection className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                background: "rgba(153,69,255,0.1)",
                border: "1px solid rgba(153,69,255,0.25)",
                color: "var(--text-purple)",
              }}
            >
              <Image
                src="/brand/solana-logomark-color.svg"
                alt=""
                width={14}
                height={12}
                aria-hidden="true"
              />
              {t("badges.builtOn")}
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--solana-green)" }}
              />
            </div>
          </FadeInSection>

          {/* Headline */}
          <FadeInSection delay={0.1} className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span style={{ color: "var(--text-primary)" }}>{t("heroTitle1")}</span>
              <br />
              <span className="gradient-solana-text">{t("heroTitle2")}</span>
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("heroSubtitle")}
            </p>
          </FadeInSection>

          {/* CTAs */}
          <FadeInSection delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/courses"
              prefetch={false}
              className="group min-h-[48px] inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg"
              style={{
                background: "var(--solana-purple)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(153,69,255,0.3)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--solana-purple-dim)";
                el.style.transform = "translateY(-1px)";
                el.style.boxShadow = "0 8px 32px rgba(153,69,255,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--solana-purple)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 24px rgba(153,69,255,0.3)";
              }}
            >
              {t("exploreCourses")}
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            {!connected && (
              <Link
                href="/courses"
                prefetch={false}
                className="min-h-[48px] inline-flex items-center px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-purple)";
                  el.style.color = "var(--text-primary)";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-default)";
                  el.style.color = "var(--text-secondary)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {t("hero.secondaryCta")}
              </Link>
            )}
            {connected && (
              <Link
                href="/dashboard"
                prefetch={false}
                className="min-h-[48px] inline-flex items-center px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)",
                }}
              >
                {t("hero.connectedCta")}
              </Link>
            )}
          </FadeInSection>

          {/* Tech badges */}
          <FadeInSection delay={0.3} className="flex flex-wrap justify-center gap-3">
            {TECH_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                <badge.icon size={12} aria-hidden="true" />
                {t(badge.labelKey)}
              </div>
            ))}
          </FadeInSection>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <section
        className="border-y"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <AnimatedStat
                key={stat.id}
                value={stat.value}
                label={t(stat.labelKey)}
                icon={stat.icon}
              />
            ))}
          </dl>
        </div>
      </section>

      {/* ── Learning Paths ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <FadeInSection>
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("sections.learningPaths.title")}
            </h2>
            <p className="text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
              {t("sections.learningPaths.subtitle")}
            </p>
          </div>
        </FadeInSection>

        <div className="grid gap-5 sm:grid-cols-3">
          {LEARNING_PATHS.map((path, i) => (
            <FadeInSection key={path.id} delay={i * 0.1}>
              <Link
                href="/courses"
                prefetch={false}
                className="rounded-2xl p-6 transition-all duration-200 block group h-full"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-card)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-purple)";
                  el.style.boxShadow = "var(--shadow-card-hover)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-subtle)";
                  el.style.boxShadow = "var(--shadow-card)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      color: path.diffColor,
                      background: `${path.diffColor}15`,
                      border: `1px solid ${path.diffColor}40`,
                    }}
                  >
                    {t(path.difficultyKey)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      color: "var(--text-purple)",
                      background: "rgba(153,69,255,0.08)",
                      border: "1px solid rgba(153,69,255,0.2)",
                    }}
                  >
                    {t("common.demo")}
                  </span>
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t(path.titleKey)}
                </h3>
                <p
                  className="text-sm mb-5 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t(path.descriptionKey)}
                </p>
                <div
                  className="flex items-center gap-3 text-xs pt-4"
                  style={{
                    color: "var(--text-muted)",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <span>{t("paths.meta.lessons", { count: path.lessons })}</span>
                  <span>·</span>
                  <span style={{ color: "var(--text-purple)" }}>
                    {path.xp.toLocaleString("en-US")} XP
                  </span>
                  <ArrowRight
                    size={14}
                    className="ml-auto transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  />
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {t("sections.features.title")}
              </h2>
              <p className="text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                {t("sections.features.subtitle")}
              </p>
            </div>
          </FadeInSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <FadeInSection key={f.id} delay={i * 0.08}>
                <div
                  className="rounded-2xl p-6 transition-all duration-200 h-full group"
                  style={{
                    background: f.accentBg,
                    border: `1px solid ${f.accent}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = `${f.accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = `${f.accent}20`;
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `${f.accent}18` }}
                  >
                    <f.icon
                      size={20}
                      aria-hidden="true"
                      style={{ color: f.accent }}
                    />
                  </div>
                  <h3
                    className="font-semibold text-sm mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t(f.titleKey)}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t(f.descriptionKey)}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <FadeInSection>
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("sections.howItWorks.title")}
            </h2>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              {t("sections.howItWorks.subtitle")}
            </p>
          </div>
        </FadeInSection>

        <div className="grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px"
            style={{ background: "var(--border-subtle)" }}
            aria-hidden="true"
          />

          {HOW_IT_WORKS.map((item, i) => (
            <FadeInSection
              key={item.id}
              delay={i * 0.15}
              className="flex flex-col items-center text-center gap-3 relative"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold relative z-10 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--solana-purple), var(--solana-green))",
                  color: "#fff",
                  boxShadow: "0 4px 24px rgba(153,69,255,0.25)",
                }}
              >
                <item.icon size={24} />
              </div>
              <h3
                className="font-semibold text-base mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t(item.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {t(item.descKey)}
              </p>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {t("sections.testimonials.title")}
              </h2>
              <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                {t("sections.testimonials.subtitle")}
              </p>
            </div>
          </FadeInSection>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((item, i) => (
              <FadeInSection key={item.id} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 h-full flex flex-col"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed flex-1 mb-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    &ldquo;{t(item.quoteKey)}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: `${item.color}20`, color: item.color }}
                    >
                      {item.avatar}
                    </div>
                    <div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t(item.nameKey)}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {t(item.roleKey)}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner / Ecosystem Logos ─────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <FadeInSection>
            <p
              className="text-center text-xs font-semibold uppercase tracking-widest mb-8"
              style={{ color: "var(--text-muted)" }}
            >
              {t("sections.ecosystem.title")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {ECOSYSTEM_PARTNERS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span style={{ color: p.color, fontSize: "1rem" }}>{p.emoji}</span>
                  {t(p.nameKey)}
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Superteam Brasil spotlight ────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <FadeInSection>
          <div
            className="rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-12"
            style={{
              background: "linear-gradient(135deg, rgba(0,140,76,0.08) 0%, rgba(47,107,63,0.06) 100%)",
              border: "1px solid rgba(0,140,76,0.2)",
            }}
          >
            <div className="shrink-0">
              <Image
                src="/brand/superteam/ST-EMERALD-GREEN-HORIZONTAL.svg"
                alt={t("superteam.logoAlt")}
                width={200}
                height={46}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p
                className="text-base sm:text-lg leading-relaxed mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("superteam.body")}
              </p>
              <a
                href="https://superteam.fun/brasil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: "#008c4c" }}
              >
                {t("superteam.link")}
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14 text-center">
          <FadeInSection>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(153,69,255,0.1)", border: "1px solid rgba(153,69,255,0.25)" }}
            >
              <Mail size={20} style={{ color: "var(--solana-purple)" }} aria-hidden="true" />
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("newsletter.title")}
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              {t("newsletter.subtitle")}
            </p>
            {subscribed ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(25,251,155,0.1)",
                  border: "1px solid rgba(25,251,155,0.25)",
                  color: "var(--solana-green)",
                }}
              >
                <CheckCircle size={16} aria-hidden="true" />
                {t("newsletter.subscribed")}
              </div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.emailPlaceholder")}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  aria-label={t("newsletter.emailAria")}
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(153,69,255,0.5)"; }}
                  onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border-default)"; }}
                />
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "var(--solana-purple)",
                    color: "#fff",
                    boxShadow: "0 2px 12px rgba(153,69,255,0.25)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "none"; }}
                >
                  {t("newsletter.subscribe")}
                </button>
              </form>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <FadeInSection>
          <div
            className="rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(153,69,255,0.15) 0%, rgba(25,251,155,0.08) 100%)",
              border: "1px solid rgba(153,69,255,0.25)",
            }}
          >
            {/* Decorative orbs */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle, rgba(153,69,255,0.2) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle, rgba(25,251,155,0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(25,251,155,0.15)",
                    border: "1px solid rgba(25,251,155,0.3)",
                  }}
                >
                  <CheckCircle
                    size={28}
                    style={{ color: "var(--solana-green)" }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h2
                className="text-2xl sm:text-4xl font-bold tracking-tight mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {t("finalCta.title")}
              </h2>
              <p
                className="text-base sm:text-lg mb-8 max-w-md mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("finalCta.subtitle")}
              </p>
              <Link
                href="/courses"
                prefetch={false}
                className="group inline-flex items-center gap-2 min-h-[48px] px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg"
                style={{
                  background: "var(--solana-purple)",
                  color: "#fff",
                  boxShadow: "0 4px 24px rgba(153,69,255,0.3)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--solana-purple-dim)";
                  el.style.transform = "translateY(-1px)";
                  el.style.boxShadow = "0 8px 32px rgba(153,69,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--solana-purple)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 4px 24px rgba(153,69,255,0.3)";
                }}
              >
                {t("finalCta.cta")}
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      <Footer />
    </div>
  );
}
