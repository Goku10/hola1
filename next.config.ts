import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid auto-writing AGENTS.md / CLAUDE.md into the repo during `next dev`
  // @ts-expect-error agentRules is supported in recent Next versions
  agentRules: false,
};

export default nextConfig;
