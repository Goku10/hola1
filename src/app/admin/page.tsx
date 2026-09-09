"use client";

import { useState } from "react";
import {
  careers,
  admissionCodes,
  subjects,
  prerequisites,
  schools,
  schoolOfferings,
  institutions,
  cutoffs,
  sources,
  ruleVersions,
} from "@/lib/data";
import { Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/layout/SiteHeader";
import { cn } from "@/lib/utils";

type Tab =
  | "careers"
  | "codes"
  | "subjects"
  | "prereqs"
  | "schools"
  | "institutions"
  | "cutoffs"
  | "sources"
  | "versions";

const tabs: { id: Tab; label: string }[] = [
  { id: "careers", label: "Karrierer" },
  { id: "codes", label: "Opptakskoder" },
  { id: "subjects", label: "Fag" },
  { id: "prereqs", label: "Forkrav" },
  { id: "schools", label: "Skoler" },
  { id: "institutions", label: "Studiesteder" },
  { id: "cutoffs", label: "Poeng" },
  { id: "sources", label: "Kilder" },
  { id: "versions", label: "Versjoner" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("careers");
  const [locked] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone="amber">Demo — ingen ekte innlogging</Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-navy-900">
            Datastyring
          </h1>
          <p className="text-sm text-slate-500">
            Klar for senere Supabase-integrasjon
          </p>
        </div>
        <Button variant="outline" disabled>
          {locked ? "🔒 Låst (MVP)" : "Rediger"}
        </Button>
      </div>
      <DemoNotice />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold",
              tab === t.id ? "bg-navy-900 text-white" : "bg-white shadow-sm"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        {tab === "careers" && (
          <Table
            headers={["ID", "Navn", "Felt", "Kode", "Konkurranse"]}
            rows={careers.map((c) => [
              c.id,
              c.name.nb,
              c.field,
              c.admissionCodeIds.join(","),
              c.competitiveness,
            ])}
          />
        )}
        {tab === "codes" && (
          <Table
            headers={["Kode", "Navn", "Regelversjon", "Kilder"]}
            rows={admissionCodes.map((a) => [
              a.code,
              a.name.nb,
              a.ruleVersionId,
              a.sourceIds.join(", "),
            ])}
          />
        )}
        {tab === "subjects" && (
          <Table
            headers={["ID", "Kode", "Navn", "Kategori", "År"]}
            rows={subjects.map((s) => [
              s.id,
              s.code,
              s.name.nb,
              s.category,
              s.years.join("/"),
            ])}
          />
        )}
        {tab === "prereqs" && (
          <Table
            headers={["Fag", "Krever"]}
            rows={prerequisites.map((p) => [
              p.subjectId,
              p.requires.join(", "),
            ])}
          />
        )}
        {tab === "schools" && (
          <Table
            headers={["Skole", "Fylke", "Fag tilbudt"]}
            rows={schools.map((s) => {
              const off = schoolOfferings.find((o) => o.schoolId === s.id);
              return [
                s.name,
                s.countyId,
                String(off?.availableSubjectIds.length ?? 0),
              ];
            })}
          />
        )}
        {tab === "institutions" && (
          <Table
            headers={["Kort", "Navn", "By", "Type"]}
            rows={institutions.map((i) => [
              i.shortName,
              i.name,
              i.city,
              i.type,
            ])}
          />
        )}
        {tab === "cutoffs" && (
          <Table
            headers={["Karriere", "Sted", "År", "Kvote", "Poeng", "Historisk"]}
            rows={cutoffs.map((c) => [
              c.careerId,
              c.institutionId,
              String(c.year),
              c.quota,
              c.points == null ? "—" : String(c.points),
              "ja",
            ])}
          />
        )}
        {tab === "sources" && (
          <Table
            headers={["Navn", "Kategori", "URL", "Sist gjennomgått"]}
            rows={sources.map((s) => [
              s.name,
              s.category,
              s.url,
              s.lastReviewed,
            ])}
          />
        )}
        {tab === "versions" && (
          <Table
            headers={["ID", "Label", "Sist gjennomgått", "Notat"]}
            rows={ruleVersions.map((r) => [
              r.id,
              r.label,
              r.lastReviewed,
              r.notes ?? "",
            ])}
          />
        )}
      </Card>
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
          {headers.map((h) => (
            <th key={h} className="px-2 py-2 font-bold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-slate-50 hover:bg-sky-soft/40">
            {row.map((cell, j) => (
              <td key={j} className="px-2 py-2 font-medium text-navy-800">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
