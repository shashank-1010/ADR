import React from "react";
import { Badge } from "@/components/ui/badge";

type SeverityType = "safe" | "moderate" | "dangerous" | "mild" | "severe" | "low" | "high" | "emergency";

export function SeverityBadge({ severity }: { severity: string }) {
  const normalized = severity.toLowerCase() as SeverityType;

  if (["safe", "low", "mild"].includes(normalized)) {
    return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">{severity}</Badge>;
  }
  
  if (["moderate", "medium"].includes(normalized)) {
    return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">{severity}</Badge>;
  }

  if (["dangerous", "severe", "high", "emergency"].includes(normalized)) {
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">{severity}</Badge>;
  }

  return <Badge variant="outline" className="font-medium">{severity}</Badge>;
}
