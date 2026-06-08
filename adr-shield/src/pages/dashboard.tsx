import React from "react";
import { useGetDashboardStats, useGetRecentReports } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, FileText, Pill } from "lucide-react";
import { SeverityBadge } from "@/components/severity-badge";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: reports, isLoading: reportsLoading } = useGetRecentReports();

  return (
    <div className="space-y-6 p-6 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">
          System overview and recent pharmacovigilance reports.
        </p>
      </div>

      <MedicalDisclaimer />

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Drugs"
          value={stats?.totalDrugs}
          icon={Pill}
          loading={statsLoading}
        />
        <StatCard
          title="Total ADR Reports"
          value={stats?.totalReports}
          icon={FileText}
          loading={statsLoading}
        />
        <StatCard
          title="Severe Reports"
          value={stats?.severeReports}
          icon={AlertTriangle}
          loading={statsLoading}
          danger={!!stats?.severeReports && stats.severeReports > 0}
        />
        <StatCard
          title="Interactions Checked"
          value={stats?.dangerousInteractionsChecked}
          icon={Activity}
          loading={statsLoading}
        />
      </div>

      {/* Bottom Panels */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Recent Reports */}
        <Card className="border border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-slate-800">
              Recent ADR Reports
            </CardTitle>
            <CardDescription className="text-slate-500">
              Latest adverse drug reactions submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-white hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium text-sm text-slate-800 truncate">
                        {report.drugName}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {report.reaction}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 ml-3">
                      <SeverityBadge severity={report.severity} />
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                        {format(new Date(report.reportedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-slate-400">No recent reports found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Severity Breakdown */}
        <Card className="border border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-slate-800">
              Severity Breakdown
            </CardTitle>
            <CardDescription className="text-slate-500">
              Distribution of reported reaction severities
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center min-h-[280px]">
            {statsLoading ? (
              <Skeleton className="h-40 w-full rounded-lg" />
            ) : stats?.severityBreakdown ? (
              <div className="space-y-7">
                <SeverityBar
                  label="Mild"
                  count={stats.severityBreakdown.mild}
                  total={stats.totalReports}
                  colorClass="bg-blue-500"
                  textClass="text-blue-700"
                />
                <SeverityBar
                  label="Moderate"
                  count={stats.severityBreakdown.moderate}
                  total={stats.totalReports}
                  colorClass="bg-amber-500"
                  textClass="text-amber-700"
                />
                <SeverityBar
                  label="Severe"
                  count={stats.severityBreakdown.severe}
                  total={stats.totalReports}
                  colorClass="bg-rose-500"
                  textClass="text-rose-700"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for severity progress bars
function SeverityBar({
  label,
  count,
  total,
  colorClass,
  textClass,
}: {
  label: string;
  count: number;
  total: number;
  colorClass: string;
  textClass: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className={`text-sm font-medium ${textClass}`}>{label}</span>
        <span className="text-sm font-semibold text-slate-700">{count}</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 text-right">
        {percentage.toFixed(1)}% of total
      </p>
    </div>
  );
}

// Enhanced StatCard with professional styling
function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  danger = false,
}: {
  title: string;
  value?: number;
  icon: any;
  loading: boolean;
  danger?: boolean;
}) {
  return (
    <Card className="border border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 tracking-wide">
          {title}
        </CardTitle>
        <div
          className={`p-1.5 rounded-md ${
            danger
              ? "bg-rose-50 text-rose-600"
              : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16 rounded-md" />
        ) : (
          <div
            className={`text-3xl font-semibold tracking-tight ${
              danger ? "text-rose-600" : "text-slate-800"
            }`}
          >
            {value?.toLocaleString() ?? "0"}
          </div>
        )}
        <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
      </CardContent>
    </Card>
  );
}