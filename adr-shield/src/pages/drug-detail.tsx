import React from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalDisclaimer } from "@/components/disclaimer";

const DRUG_DETAILS: Record<string, any> = {
  "1": { id: "1", name: "Lisinopril", genericName: "Lisinopril", category: "Antihypertensive", description: "Lisinopril is an ACE inhibitor used to treat high blood pressure, heart failure, and to improve survival after heart attacks.", activeIngredients: ["Lisinopril"], indications: ["Hypertension", "Heart Failure", "Post-Myocardial Infarction"], contraindications: ["Pregnancy", "History of angioedema", "Bilateral renal artery stenosis"], sideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue", "Hyperkalemia"] },
  "2": { id: "2", name: "Metformin", genericName: "Metformin HCl", category: "Antidiabetic", description: "Metformin is a biguanide antidiabetic medication that lowers blood glucose by decreasing hepatic glucose production.", activeIngredients: ["Metformin"], indications: ["Type 2 Diabetes Mellitus"], contraindications: ["Renal impairment", "Metabolic acidosis", "Hypersensitivity"], sideEffects: ["GI upset", "Nausea", "Diarrhea", "Vitamin B12 deficiency"] },
  "3": { id: "3", name: "Atorvastatin", genericName: "Atorvastatin Calcium", category: "Lipid-lowering", description: "Atorvastatin is a statin medication used to lower cholesterol and prevent cardiovascular disease.", activeIngredients: ["Atorvastatin"], indications: ["Hypercholesterolemia", "Primary prevention of CVD", "Secondary prevention"], contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"], sideEffects: ["Myalgia", "Elevated liver enzymes", "Fatigue", "Arthralgia"] },
};

export default function DrugDetail() {
  const params = useParams();
  const id = params.id as string;
  const drug = DRUG_DETAILS[id];

  if (!drug) {
    return (<div className="py-12 text-center"><p className="text-lg text-gray-600">Drug not found or error loading details.</p><Link href="/drugs"><Button variant="outline" className="mt-4">Back to Database</Button></Link></div>);
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4"><Link href="/drugs"><Button variant="outline" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link><div><h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">{drug.name} <Badge variant="secondary" className="text-xs bg-gray-100">{drug.category}</Badge></h1><p className="text-gray-500 mt-1">{drug.genericName}</p></div></div>
      <MedicalDisclaimer />
      <Card className="shadow-sm bg-white"><CardContent className="p-6"><p className="text-gray-700 leading-relaxed">{drug.description}</p><div className="mt-4 flex flex-wrap gap-2"><span className="text-sm font-semibold text-gray-700">Active Ingredients:</span>{drug.activeIngredients.map((ingredient: string, i: number) => (<Badge key={i} variant="outline" className="bg-gray-50 text-gray-700">{ingredient}</Badge>))}</div></CardContent></Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-green-500"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-lg"><CheckCircle2 className="h-5 w-5 text-green-500" />Indications</CardTitle><CardDescription>Approved uses for this medication</CardDescription></CardHeader><CardContent><ul className="space-y-2">{drug.indications.map((ind: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" /><span>{ind}</span></li>))}</ul></CardContent></Card>
        <Card className="shadow-sm border-l-4 border-l-red-500"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-lg"><ShieldAlert className="h-5 w-5 text-red-500" />Contraindications</CardTitle><CardDescription>Situations where drug should not be used</CardDescription></CardHeader><CardContent><ul className="space-y-2">{drug.contraindications.map((contra: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" /><span>{contra}</span></li>))}</ul></CardContent></Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500 md:col-span-2 lg:col-span-1"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-lg"><AlertTriangle className="h-5 w-5 text-amber-500" />Side Effects</CardTitle><CardDescription>Known adverse reactions</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{drug.sideEffects.map((effect: string, i: number) => (<Badge key={i} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">{effect}</Badge>))}</div></CardContent></Card>
      </div>
    </div>
  );
}