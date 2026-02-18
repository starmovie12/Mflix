"use client";

import { useState, useEffect } from "react";
import { User, Globe, Play, Subtitles, Moon, Bell, Shield, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";

interface Preferences {
  language: string;
  autoplay: boolean;
  autoplayPreviews: boolean;
  subtitleLanguage: string;
  maturityLevel: string;
  reducedMotion: boolean;
}

const STORAGE_KEY = "mflix_preferences";

function loadPreferences(): Preferences {
  const defaults: Preferences = {
    language: "en",
    autoplay: true,
    autoplayPreviews: true,
    subtitleLanguage: "off",
    maturityLevel: "all",
    reducedMotion: false,
  };

  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

function savePreferences(prefs: Preferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export default function AccountClient() {
  const [prefs, setPrefs] = useState<Preferences>(loadPreferences);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(loadPreferences());
    setHydrated(true);
  }, []);

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    savePreferences(next);
  };

  return (
    <PageShell>
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-3xl px-4 pb-16 md:px-12">
          <h1 className="text-fluid-3xl font-bold">Account & Settings</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage your preferences and account settings.</p>

          {hydrated && (
            <div className="mt-8 space-y-6">
              <SettingsSection title="Profile" icon={<User className="h-5 w-5" />}>
                <SettingRow label="Display Name" value="MFLIX User" />
                <SettingRow label="Email" value="user@mflix.demo" />
                <SettingRow label="Plan" value="Premium" badge="Active" />
              </SettingsSection>

              <SettingsSection title="Playback" icon={<Play className="h-5 w-5" />}>
                <ToggleRow
                  label="Autoplay next episode"
                  checked={prefs.autoplay}
                  onChange={(v) => update("autoplay", v)}
                />
                <ToggleRow
                  label="Autoplay previews on browse"
                  checked={prefs.autoplayPreviews}
                  onChange={(v) => update("autoplayPreviews", v)}
                />
              </SettingsSection>

              <SettingsSection title="Language" icon={<Globe className="h-5 w-5" />}>
                <SelectRow
                  label="Display Language"
                  value={prefs.language}
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Español" },
                    { value: "fr", label: "Français" },
                    { value: "de", label: "Deutsch" },
                    { value: "ja", label: "日本語" },
                    { value: "hi", label: "हिन्दी" },
                  ]}
                  onChange={(v) => update("language", v)}
                />
              </SettingsSection>

              <SettingsSection title="Subtitles" icon={<Subtitles className="h-5 w-5" />}>
                <SelectRow
                  label="Subtitle Language"
                  value={prefs.subtitleLanguage}
                  options={[
                    { value: "off", label: "Off" },
                    { value: "en", label: "English" },
                    { value: "es", label: "Español" },
                    { value: "fr", label: "Français" },
                  ]}
                  onChange={(v) => update("subtitleLanguage", v)}
                />
              </SettingsSection>

              <SettingsSection title="Maturity" icon={<Shield className="h-5 w-5" />}>
                <SelectRow
                  label="Maturity Rating"
                  value={prefs.maturityLevel}
                  options={[
                    { value: "all", label: "All Maturity Ratings" },
                    { value: "pg13", label: "PG-13 and below" },
                    { value: "pg", label: "PG and below" },
                    { value: "g", label: "G only" },
                  ]}
                  onChange={(v) => update("maturityLevel", v)}
                />
              </SettingsSection>

              <SettingsSection title="Accessibility" icon={<Moon className="h-5 w-5" />}>
                <ToggleRow
                  label="Reduce motion and animations"
                  checked={prefs.reducedMotion}
                  onChange={(v) => update("reducedMotion", v)}
                />
              </SettingsSection>
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
}

function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-surface">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
        <span className="text-zinc-400">{icon}</span>
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <div className="divide-y divide-zinc-800/50">{children}</div>
    </section>
  );
}

function SettingRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-sm text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-white">{value}</span>
        {badge && (
          <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            {badge}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-zinc-600" />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-sm text-zinc-300">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-netflix" : "bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-sm text-zinc-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none transition focus:border-zinc-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
