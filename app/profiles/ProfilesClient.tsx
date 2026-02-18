"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, User, Baby, Sparkles, Shield } from "lucide-react";

const PROFILES = [
  { id: "main", name: "Main", icon: User, color: "bg-netflix", isKids: false },
  { id: "partner", name: "Partner", icon: Sparkles, color: "bg-blue-600", isKids: false },
  { id: "kids", name: "Kids", icon: Baby, color: "bg-emerald-600", isKids: true },
];

export default function ProfilesClient() {
  const router = useRouter();

  const handleSelect = (profileId: string) => {
    try {
      localStorage.setItem("mflix_active_profile", profileId);
    } catch {
      /* ignore */
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pitch px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-fluid-3xl font-bold text-white">Who&apos;s watching?</h1>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {PROFILES.map((profile, idx) => {
            const Icon = profile.icon;
            return (
              <motion.button
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                onClick={() => handleSelect(profile.id)}
                className="group flex w-[120px] flex-col items-center gap-3 sm:w-[140px]"
              >
                <div
                  className={`flex h-[120px] w-[120px] items-center justify-center rounded-lg ${profile.color} ring-2 ring-transparent transition group-hover:ring-white sm:h-[140px] sm:w-[140px]`}
                >
                  <Icon className="h-12 w-12 text-white sm:h-14 sm:w-14" />
                </div>
                <span className="text-sm text-zinc-400 transition group-hover:text-white">
                  {profile.name}
                </span>
                {profile.isKids && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] text-emerald-400">
                    <Shield className="h-3 w-3" />
                    Kids
                  </span>
                )}
              </motion.button>
            );
          })}

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="group flex w-[120px] flex-col items-center gap-3 sm:w-[140px]"
          >
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-lg bg-zinc-800 ring-2 ring-transparent transition group-hover:ring-white sm:h-[140px] sm:w-[140px]">
              <Plus className="h-12 w-12 text-zinc-500 transition group-hover:text-white sm:h-14 sm:w-14" />
            </div>
            <span className="text-sm text-zinc-400 transition group-hover:text-white">
              Add Profile
            </span>
          </motion.button>
        </div>

        <button className="mt-12 rounded-md border border-zinc-600 px-6 py-2 text-sm text-zinc-400 transition hover:border-white hover:text-white">
          Manage Profiles
        </button>
      </motion.div>
    </div>
  );
}
