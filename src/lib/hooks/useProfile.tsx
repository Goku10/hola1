"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StudentProfile } from "@/lib/types";
import { DEFAULT_PROFILE, SAMPLE_SCENARIOS } from "@/lib/data";

const STORAGE_KEY = "utdanningssti-profile-v1";

type ProfileContextValue = {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  loadScenario: (id: keyof typeof SAMPLE_SCENARIOS) => void;
  toggleGoal: (careerId: string) => void;
  ready: boolean;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfileState(JSON.parse(raw) as StudentProfile);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setProfile = useCallback((p: StudentProfile) => {
    setProfileState(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, []);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const loadScenario = useCallback(
    (id: keyof typeof SAMPLE_SCENARIOS) => {
      setProfile(SAMPLE_SCENARIOS[id]);
    },
    [setProfile]
  );

  const toggleGoal = useCallback((careerId: string) => {
    setProfileState((prev) => {
      const has = prev.goalIds.includes(careerId);
      const goalIds = has
        ? prev.goalIds.filter((g) => g !== careerId)
        : [...prev.goalIds, careerId];
      const next = { ...prev, goalIds };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      updateProfile,
      loadScenario,
      toggleGoal,
      ready,
    }),
    [profile, setProfile, updateProfile, loadScenario, toggleGoal, ready]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile outside provider");
  return ctx;
}
