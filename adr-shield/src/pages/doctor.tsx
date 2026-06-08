import React, { useState } from "react";
import { usePredictDisease, useCheckInteractions } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Activity, FileText, CheckCircle2, ShieldAlert, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";

export default function DoctorMode() {
  const [patientData, setPatientData] = useState({
    id: "PT-8842-A",
    age: "62",
    sex: "Male",
    weight: "84kg",
    medicalHistory: "Hypertension, Type 2 Diabetes, Mild Osteoarthritis",
    currentMeds: "Lisinopril, Metformin",
    newSymptoms: "Dizziness upon standing, mild nausea, muscle weakness",
    proposedTreatment: "Amlodipine"
  });

  const predictDisease = usePredictDisease();
  const checkInteractions = useCheckInteractions();
  
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const runComprehensiveAnalysis = () => {
    // Fire both APIs in parallel
    const symptoms = patientData.newSymptoms.split(',').map(s => s.trim());
    const meds = patientData.currentMeds.split(',').map(s => s.trim());
    const allMeds = [...meds, patientData.proposedTreatment].filter(Boolean);

    predictDisease.mutate({
      data: {
        symptoms,
        currentMedications: meds,
        patientAge: parseInt(patientData.age)
      }
    });

    if (allMeds.length >= 2) {
      checkInteractions.mutate({
        data: {
          drugs: allMeds,
          patientAge: parseInt(patientData.age),
          conditions: patientData.medicalHistory.split(',').map(s => s.trim())
        }
      });
    }

    setAnalysisComplete(true);
  };

  const isAnalyzing = predictDisease.isPending || checkInteractions.isPending;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinical Workstation</h1>
          <p className="text-slate-500 mt-1">Advanced diagnostic and prescribing support system.</p>
        </div>
      </div>

      <MedicalDisclaimer />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <CardTitle className="text-base flex items-center justify-between">
                Patient Profile
                <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded border">ID: {patientData.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Age</Label>
                  <Input value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} className="h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Sex</Label>
                  <Input value={patientData.sex} onChange={e => setPatientData({...patientData, sex: e.target.value})} className="h-8" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Medical History</Label>
                <Textarea 
                  value={patientData.medicalHistory} 
                  onChange={e => setPatientData({...patientData, medicalHistory: e.target.value})} 
                  className="min-h-[60px] text-sm" 
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Current Medications (Comma separated)</Label>
                <Textarea 
                  value={patientData.currentMeds} 
                  onChange={e => setPatientData({...patientData, currentMeds: e.target.value})} 
                  className="min-h-[60px] text-sm" 
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Presenting Symptoms</Label>
                <Textarea 
                  value={patientData.newSymptoms} 
                  onChange={e => setPatientData({...patientData, newSymptoms: e.target.value})} 
                  className="min-h-[60px] text-sm border-amber-200 bg-amber-50/30" 
                />
              </div>

              <div className="space-y-1 pt-2 border-t">
                <Label className="text-xs font-bold text-primary">Proposed Addition/Change</Label>
                <Input 
                  value={patientData.proposedTreatment} 
                  onChange={e => setPatientData({...patientData, proposedTreatment: e.target.value})} 
                  className="border-primary/30 bg-primary/5" 
                />
              </div>

              <Button onClick={runComprehensiveAnalysis} className="w-full mt-4" disabled={isAnalyzing}>
                {isAnalyzing ? "Processing Data..." : "Run Comprehensive Safety Check"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {analysisComplete ? (
            <Tabs defaultValue="interactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="interactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Prescription Safety (Interactions)
                </TabsTrigger>
                <TabsTrigger value="diagnosis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Differential & Risk Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interactions" className="space-y-4">
                {checkInteractions.isPending ? (
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                ) : checkInteractions.data ? (
                  <Card className="shadow-sm">
                    <CardHeader className="border-b bg-slate-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Regimen Safety Profile</CardTitle>
                          <CardDescription>Analysis of proposed combination: {patientData.currentMeds} + {patientData.proposedTreatment}</CardDescription>
                        </div>
                        <SeverityBadge severity={checkInteractions.data.overallSeverity} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {checkInteractions.data.interactions.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="font-medium text-slate-900 border-b pb-2">Identified Conflicts</h3>
                          {checkInteractions.data.interactions.map((interaction, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                              <div className="shrink-0 mt-1">
                                {interaction.severity === 'dangerous' ? 
                                  <ShieldAlert className="h-5 w-5 text-red-500" /> : 
                                  <AlertCircle className="h-5 w-5 text-amber-500" />
                                }
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{interaction.drug1}</span>
                                  <span className="text-slate-400 text-xs">AND</span>
                                  <span className="font-semibold">{interaction.drug2}</span>
                                  <SeverityBadge severity={interaction.severity} />
                                </div>
                                <p className="text-sm text-slate-700">{interaction.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <p className="font-medium">No significant interactions detected in proposed regimen.</p>
                        </div>
                      )}

                      {checkInteractions.data.warnings.length > 0 && (
                        <div>
                          <h3 className="font-medium text-slate-900 border-b pb-2 mb-3">Clinical Considerations</h3>
                          <ul className="space-y-2">
                            {checkInteractions.data.warnings.map((w, i) => (
                              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card><CardContent className="p-8 text-center text-slate-500">Interaction data unavailable.</CardContent></Card>
                )}
              </TabsContent>

              <TabsContent value="diagnosis" className="space-y-4">
                {predictDisease.isPending ? (
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                ) : predictDisease.data ? (
                  <div className="space-y-4">
                    {predictDisease.data.predictions.map((p, i) => (
                      <Card key={i} className="shadow-sm border-l-4" style={{borderLeftColor: p.urgencyLevel === 'high' || p.urgencyLevel === 'emergency' ? 'var(--color-destructive)' : 'var(--color-primary)'}}>
                        <CardHeader className="py-3 bg-slate-50/50 border-b">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{p.disease}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-500">Confidence: {(p.confidence * 100).toFixed(0)}%</span>
                              <SeverityBadge severity={p.urgencyLevel} />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-4 space-y-3">
                          <p className="text-sm text-slate-700">{p.description}</p>
                          <div className="bg-primary/5 border border-primary/10 rounded p-3">
                            <span className="text-xs font-semibold text-primary uppercase block mb-1">Clinical Protocol</span>
                            <span className="text-sm">{p.recommendedAction}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                   <Card><CardContent className="p-8 text-center text-slate-500">Diagnostic data unavailable.</CardContent></Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full min-h-[500px] border-dashed bg-slate-50 flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Ready for Analysis</h3>
              <p className="text-slate-500 max-w-md">
                Enter patient data in the workstation panel and run the safety check to receive AI-assisted interaction profiles and differential diagnoses.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
