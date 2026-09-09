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
import { useI18n } from "@/lib/i18n";

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

const tabIds: Tab[] = [
  "careers",
  "codes",
  "subjects",
  "prereqs",
  "schools",
  "institutions",
  "cutoffs",
  "sources",
  "versions",
];

export default function AdminPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("careers");
  const [locked] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone="amber">{t.admin.demoBadge}</Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-navy-900">
            {t.admin.title}
          </h1>
          <p className="text-sm text-slate-500">{t.admin.subtitle}</p>
        </div>
        <Button variant="outline" disabled>
          {locked ? `🔒 ${t.admin.locked}` : t.admin.edit}
        </Button>
      </div>
      <DemoNotice />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold",
              tab === id ? "bg-navy-900 text-white" : "bg-white shadow-sm"
            )}
          >
            {t.admin.tabs[id]}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        {tab === "careers" && (
          <Table
            headers={["ID", "Name", "Field", "Code", "Competition"]}
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
            headers={["Code", "Name", "Rule version", "Sources"]}
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
            headers={["ID", "Code", "Name", "Category", "Years"]}
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
            headers={["Subject", "Requires"]}
            rows={prerequisites.map((p) => [
              p.subjectId,
              p.requires.join(", "),
            ])}
          />
        )}
        {tab === "schools" && (
          <Table
            headers={["School", "County", "Subjects offered"]}
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
            headers={["Short", "Name", "City", "Type"]}
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
            headers={["Career", "Institution", "Year", "Quota", "Points", "Historical"]}
            rows={cutoffs.map((c) => [
              c.careerId,
              c.institutionId,
              String(c.year),
              c.quota,
              c.points == null ? "—" : String(c.points),
              "yes",
            ])}
          />
        )}
        {tab === "sources" && (
          <Table
            headers={["Name", "Category", "URL", "Last reviewed"]}
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
            headers={["ID", "Label", "Last reviewed", "Note"]}
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
