import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MedicalDisclaimer() {
  return (
    <Alert className="mb-6 bg-slate-50 border-slate-200 text-slate-800 shadow-sm">
      <AlertCircle className="h-4 w-4 text-slate-600" />
      <AlertTitle className="text-sm font-semibold tracking-tight uppercase text-slate-700">Advisory Notice</AlertTitle>
      <AlertDescription className="text-sm text-slate-600 mt-1">
        This system is for advisory purposes only. Always consult a qualified healthcare professional before making medical decisions or changing medications.
      </AlertDescription>
    </Alert>
  );
}
