"use client";

import { I18nProvider } from "@/lib/i18n";
import { ProfileProvider } from "@/lib/hooks/useProfile";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </I18nProvider>
  );
}
