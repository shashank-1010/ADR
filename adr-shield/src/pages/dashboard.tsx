import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, FileText, Pill } from "lucide-react";
import { SeverityBadge } from "@/components/severity-badge";
import { MedicalDisclaimer } from "@/components/disclaimer";

// Mock data
const stats = {
  totalDrugs: 52,
  totalReports: 347,
  severeReports: 28,
  dangerousInteractionsChecked: 1256,
  severityBreakdown: {
    mild: 156,
    moderate: 163,
    severe: 28
  }
};

const recentReports = [
  { id: '1', drugName: 'Lisinopril', reaction: 'Persistent cough', severity: 'moderate', reportedAt: new Date().toISOString() },
  { id: '2', drugName: 'Metformin', reaction: 'Gastrointestinal distress', severity: 'mild', reportedAt: new Date().toISOString() },
  { id: '3', drugName: 'Warfarin', reaction: 'Excessive bleeding', severity: 'severe', reportedAt: new Date().toISOString() },
  { id: '4', drugName: 'Simvastatin', reaction: 'Muscle pain', severity: 'moderate', reportedAt: new Date().toISOString() },
  { id: '5', drugName: 'Amiodarone', reaction: 'Pulmonary toxicity', severity: 'severe', reportedAt: new Date().toISOString() },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">System overview and recent pharmacovigilance reports.</p>
      </div>

      <MedicalDisclaimer />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Drugs" value={stats.totalDrugs} icon={Pill} />
        <StatCard title="Total ADR Reports" value={stats.totalReports} icon={FileText} />
        <StatCard title="Severe Reports" value={stats.severeReports} icon={AlertTriangle} danger />
        <StatCard title="Interactions Checked" value={stats.dangerousInteractionsChecked} icon={Activity} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-gray-800">Recent ADR Reports</CardTitle>
            <CardDescription className="text-gray-500">Latest adverse drug reactions submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-800 truncate">{report.drugName}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{report.reaction}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 ml-3">
                    <SeverityBadge severity={report.severity} />
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-gray-800">Severity Breakdown</CardTitle>
            <CardDescription className="text-gray-500">Distribution of reported reaction severities</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center min-h-[280px]">
            <div className="space-y-7">
              <SeverityBar label="Mild" count={stats.severityBreakdown.mild} total={stats.totalReports} colorClass="bg-blue-500" textClass="text-blue-700" />
              <SeverityBar label="Moderate" count={stats.severityBreakdown.moderate} total={stats.totalReports} colorClass="bg-amber-500" textClass="text-amber-700" />
              <SeverityBar label="Severe" count={stats.severityBreakdown.severe} total={stats.totalReports} colorClass="bg-red-500" textClass="text-red-700" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SeverityBar({ label, count, total, colorClass, textClass }: { label: string; count: number; total: number; colorClass: string; textClass: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className={`text-sm font-medium ${textClass}`}>{label}</span>
        <span className="text-sm font-semibold text-gray-700">{count}</span>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-gray-400 text-right">{percentage.toFixed(1)}% of total</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, danger = false }: { title: string; value?: number; icon: any; danger?: boolean }) {
  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">{title}</CardTitle>
        <div className={`p-1.5 rounded-md ${danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-semibold tracking-tight ${danger ? "text-red-600" : "text-gray-800"}`}>
          {value?.toLocaleString() ?? "0"}
        </div>
        <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
      </CardContent>
    </Card>
  );
}