import React, { useState } from "react";
import { usePredictDisease } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, Brain, Info } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { Progress } from "@/components/ui/progress";

export default function SymptomsPredictor() {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [patientAge, setPatientAge] = useState<string>("");

  const predictDisease = usePredictDisease();

  const handleAddSymptom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && symptomInput.trim()) {
      e.preventDefault();
      if (!symptoms.includes(symptomInput.trim())) {
        setSymptoms([...symptoms, symptomInput.trim()]);
      }
      setSymptomInput("");
    }
  };

  const handleAddBtn = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput("");
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handlePredict = () => {
    if (symptoms.length === 0) return;
    
    predictDisease.mutate({
      data: {
        symptoms,
        patientAge: patientAge ? parseInt(patientAge) : undefined
      }
    });
  };

  const result = predictDisease.data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Symptom Predictor</h1>
        <p className="text-slate-500 mt-1">AI-assisted differential diagnosis based on reported clinical symptoms.</p>
      </div>

      <MedicalDisclaimer />

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Clinical Presentation</CardTitle>
            <CardDescription>Enter patient symptoms and context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Patient Age (Optional)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 45" 
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Presenting Symptoms</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. chronic headache, nausea..." 
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={handleAddSymptom}
                />
                <Button variant="secondary" onClick={handleAddBtn} type="button">Add</Button>
              </div>
              <p className="text-xs text-slate-500">Press enter to add multiple symptoms.</p>
            </div>

            {symptoms.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md text-sm font-medium border border-slate-200">
                      {symptom}
                      <button 
                        onClick={() => handleRemoveSymptom(symptom)}
                        className="ml-1 hover:bg-slate-200 rounded-full p-0.5 text-slate-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handlePredict} 
              disabled={symptoms.length === 0 || predictDisease.isPending}
            >
              {predictDisease.isPending ? "Generating Differential..." : "Analyze Symptoms"}
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-7 space-y-6">
          {predictDisease.isPending ? (
            <Card className="shadow-sm border-dashed border-2 animate-pulse bg-slate-50/50">
              <CardContent className="py-16 text-center space-y-4">
                <Brain className="h-12 w-12 text-primary/40 mx-auto animate-pulse" />
                <p className="text-slate-500 font-medium">Running diagnostic model...</p>
              </CardContent>
            </Card>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Differential Diagnosis</h2>
                <span className="text-sm text-slate-500">{result.predictions.length} matches found</span>
              </div>
              
              {result.predictions.map((prediction, idx) => (
                <Card key={idx} className={`shadow-sm overflow-hidden border-l-4 ${
                  prediction.urgencyLevel === 'emergency' || prediction.urgencyLevel === 'high' 
                    ? 'border-l-red-500' 
                    : prediction.urgencyLevel === 'medium' 
                      ? 'border-l-amber-500' 
                      : 'border-l-primary'
                }`}>
                  <CardHeader className="pb-3 bg-slate-50/50 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{prediction.disease}</CardTitle>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <SeverityBadge severity={prediction.urgencyLevel} />
                        <span className="text-xs font-semibold text-slate-500">{(prediction.confidence * 100).toFixed(1)}% match</span>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          prediction.confidence > 0.8 ? 'bg-primary' : 
                          prediction.confidence > 0.5 ? 'bg-primary/70' : 'bg-primary/40'
                        }`} 
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-slate-700">{prediction.description}</p>
                    
                    <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Recommended Action</h4>
                      <p className="text-sm font-medium text-slate-800">{prediction.recommendedAction}</p>
                    </div>

                    {prediction.medicationConflicts && prediction.medicationConflicts.length > 0 && (
                      <div className="flex items-start gap-2 text-sm bg-red-50 text-red-800 p-3 rounded-md border border-red-100">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block mb-1">Contraindicated Medications:</span>
                          <span className="opacity-90">{prediction.medicationConflicts.join(", ")}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {result.analysisNotes && (
                <Card className="bg-slate-50 border-slate-200 shadow-none">
                  <CardContent className="p-4 flex gap-3">
                    <Info className="h-5 w-5 text-slate-400 shrink-0" />
                    <p className="text-sm text-slate-600">{result.analysisNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-dashed rounded-lg">
              <Brain className="h-12 w-12 mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-600">Awaiting Symptoms</p>
              <p className="text-sm mt-1 max-w-sm text-center">Add patient symptoms to generate a differential diagnosis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
