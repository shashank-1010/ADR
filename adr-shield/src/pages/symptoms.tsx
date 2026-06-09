import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, Brain, Info, AlertTriangle } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";

// Disease prediction based on symptoms only
const DISEASE_DB = [
  { disease: "Hypertension", symptoms: ["headache", "dizziness", "blurred vision", "chest pain"], confidence: 0.85, urgency: "medium", description: "Persistently elevated blood pressure readings.", action: "Monitor blood pressure; lifestyle modifications; consider antihypertensive medication." },
  { disease: "Type 2 Diabetes", symptoms: ["increased thirst", "frequent urination", "fatigue", "blurred vision"], confidence: 0.82, urgency: "medium", description: "Insulin resistance with elevated blood glucose.", action: "Check HbA1c and fasting glucose; metformin; dietary counseling." },
  { disease: "Acute Coronary Syndrome", symptoms: ["chest pain", "shortness of breath", "nausea", "sweating", "arm pain"], confidence: 0.78, urgency: "high", description: "Reduced blood flow to the heart muscle.", action: "Immediate ECG and cardiac enzymes; cardiology consult; possible PCI." },
  { disease: "Pneumonia", symptoms: ["cough", "fever", "shortness of breath", "chest pain", "fatigue"], confidence: 0.75, urgency: "high", description: "Lung infection causing inflammation.", action: "Chest X-ray; antibiotics; oxygen if hypoxic." },
  { disease: "Migraine", symptoms: ["headache", "nausea", "sensitivity to light", "aura", "vomiting"], confidence: 0.80, urgency: "low", description: "Severe headache with neurological symptoms.", action: "Triptans; NSAIDs; rest in dark room." },
  { disease: "Gastroenteritis", symptoms: ["nausea", "vomiting", "diarrhea", "abdominal pain", "fever"], confidence: 0.72, urgency: "low", description: "Inflammation of stomach and intestines.", action: "Oral rehydration; antiemetics; supportive care." },
  { disease: "Urinary Tract Infection", symptoms: ["frequent urination", "burning sensation", "lower abdominal pain", "fever"], confidence: 0.70, urgency: "low", description: "Bacterial infection of urinary tract.", action: "Urinalysis and culture; antibiotics; increased fluid intake." },
  { disease: "Appendicitis", symptoms: ["right lower abdominal pain", "nausea", "vomiting", "fever", "loss of appetite"], confidence: 0.68, urgency: "high", description: "Inflammation of the appendix.", action: "Immediate surgical consult; CT scan; appendectomy." },
  { disease: "Pulmonary Embolism", symptoms: ["sudden shortness of breath", "chest pain", "coughing blood", "rapid heart rate"], confidence: 0.65, urgency: "emergency", description: "Blood clot in pulmonary artery.", action: "Immediate CT angiography; anticoagulation; possible thrombolytics." },
  { disease: "Stroke", symptoms: ["facial drooping", "arm weakness", "speech difficulty", "confusion", "vision changes"], confidence: 0.88, urgency: "emergency", description: "Brain damage due to interrupted blood supply.", action: "Immediate CT/MRI; thrombolytics if ischemic; blood pressure management." },
];

export default function SymptomsPredictor() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [predicted, setPredicted] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addSymptom = () => { if (input.trim() && !symptoms.includes(input.trim().toLowerCase())) { setSymptoms([...symptoms, input.trim().toLowerCase()]); setInput(""); } };
  const removeSymptom = (s: string) => { setSymptoms(symptoms.filter(sym => sym !== s)); };
  
  const analyze = () => {
    const matches = DISEASE_DB.map(disease => {
      const matchCount = disease.symptoms.filter(s => symptoms.includes(s)).length;
      const confidence = matchCount / disease.symptoms.length;
      return { ...disease, confidence: Math.min(confidence + 0.3, 0.95), matchCount };
    }).filter(d => d.matchCount > 0).sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    setResults(matches);
    setPredicted(true);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight text-gray-900">Symptom Predictor</h1><p className="text-gray-500 mt-1">AI-assisted differential diagnosis based on reported clinical symptoms.</p></div>
      <MedicalDisclaimer />
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 shadow-sm"><CardHeader><CardTitle>Clinical Presentation</CardTitle><CardDescription>Enter patient symptoms for differential diagnosis.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="space-y-3"><Label>Presenting Symptoms</Label><div className="flex gap-2"><Input placeholder="e.g. headache, fever, nausea..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSymptom()} /><Button variant="secondary" onClick={addSymptom}>Add</Button></div><p className="text-xs text-gray-500">Enter symptoms one by one</p></div>{symptoms.length > 0 && (<div className="flex flex-wrap gap-2">{symptoms.map((s, i) => (<div key={i} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm"><span>{s}</span><button onClick={() => removeSymptom(s)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5"><X className="h-3 w-3" /></button></div>))}</div>)}</CardContent><CardFooter><Button className="w-full" onClick={analyze} disabled={symptoms.length === 0}>Generate Differential Diagnosis</Button></CardFooter></Card>
        <div className="md:col-span-7 space-y-6">{predicted && results.length > 0 ? (<div className="space-y-4"><h2 className="text-xl font-bold text-gray-900">Differential Diagnosis</h2><div className="space-y-3">{results.map((pred, idx) => (<Card key={idx} className={`shadow-sm overflow-hidden border-l-4 ${pred.urgency === 'emergency' ? 'border-l-red-600' : pred.urgency === 'high' ? 'border-l-orange-500' : pred.urgency === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'}`}><CardHeader className="pb-3 bg-gray-50 border-b"><div className="flex justify-between"><div><CardTitle className="text-lg">{pred.disease}</CardTitle></div><div className="flex flex-col items-end gap-1"><SeverityBadge severity={pred.urgency} /><span className="text-xs font-semibold text-gray-500">{(pred.confidence * 100).toFixed(0)}% match</span></div></div><div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${pred.confidence * 100}%` }} /></div></CardHeader><CardContent className="pt-4 space-y-3"><p className="text-sm text-gray-700">{pred.description}</p><div className="bg-blue-50 rounded-md p-3 border border-blue-100"><h4 className="text-xs font-semibold uppercase text-blue-700 mb-1">Recommended Action</h4><p className="text-sm font-medium text-gray-800">{pred.action}</p></div><div className="text-xs text-gray-500"><span className="font-semibold">Matching symptoms:</span> {pred.symptoms.filter((s: string) => symptoms.includes(s)).join(", ")}</div></CardContent></Card>))}</div></div>) : predicted ? (<Card><CardContent className="p-8 text-center"><p className="text-gray-500">No matching conditions found. Please add more symptoms.</p></CardContent></Card>) : (<div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-dashed rounded-lg"><Brain className="h-12 w-12 mb-4 text-gray-300" /><p className="text-lg font-medium text-gray-600">Awaiting Symptoms</p><p className="text-sm text-center">Add patient symptoms to generate differential diagnosis.</p></div>)}</div>
      </div>
    </div>
  );
}