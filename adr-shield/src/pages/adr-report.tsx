import React, { useState } from "react";
import { useCreateAdrReport, type NewAdrReportInputSeverity } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdrReportForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createReport = useCreateAdrReport();

  const [formData, setFormData] = useState({
    drugName: "",
    reaction: "",
    severity: "moderate" as NewAdrReportInputSeverity,
    patientAge: "",
    description: "",
    outcome: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.drugName || !formData.reaction || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createReport.mutate({
      data: {
        ...formData,
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
      }
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({
          title: "Report Submitted",
          description: "Your ADR report has been successfully recorded.",
        });
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your report. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12 animate-in fade-in zoom-in duration-500">
        <Card className="text-center shadow-sm border-emerald-100">
          <CardContent className="pt-12 pb-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Report Successfully Submitted</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Thank you for contributing to pharmacovigilance. Your report has been securely recorded and will be analyzed by our medical safety team.
            </p>
            <div className="pt-6">
              <Button onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  drugName: "",
                  reaction: "",
                  severity: "moderate",
                  patientAge: "",
                  description: "",
                  outcome: ""
                });
              }}>
                Submit Another Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Report Adverse Reaction</h1>
        <p className="text-slate-500 mt-1">Submit an official report for an unexpected or dangerous reaction to a medication.</p>
      </div>

      <MedicalDisclaimer />

      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          If this is a medical emergency, please call your local emergency services immediately.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Reporting Form
            </CardTitle>
            <CardDescription>All information is kept strictly confidential.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="drugName">Suspected Drug <span className="text-red-500">*</span></Label>
                <Input 
                  id="drugName" 
                  placeholder="Name of the medication" 
                  value={formData.drugName}
                  onChange={e => setFormData({...formData, drugName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reaction">Primary Reaction <span className="text-red-500">*</span></Label>
                <Input 
                  id="reaction" 
                  placeholder="e.g. Severe Rash, Anaphylaxis" 
                  value={formData.reaction}
                  onChange={e => setFormData({...formData, reaction: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.severity} 
                  onValueChange={(v: NewAdrReportInputSeverity) => setFormData({...formData, severity: v})}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientAge">Patient Age</Label>
                <Input 
                  id="patientAge" 
                  type="number" 
                  placeholder="Age at time of reaction" 
                  value={formData.patientAge}
                  onChange={e => setFormData({...formData, patientAge: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Describe the reaction, when it started, and how it progressed..." 
                className="min-h-[120px]"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome Status</Label>
              <Input 
                id="outcome" 
                placeholder="e.g. Recovered, Recovering, Admitted to hospital" 
                value={formData.outcome}
                onChange={e => setFormData({...formData, outcome: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t flex justify-between px-6 py-4">
            <span className="text-xs text-slate-500">* Required fields</span>
            <Button type="submit" disabled={createReport.isPending}>
              {createReport.isPending ? "Submitting..." : "Submit Official Report"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
