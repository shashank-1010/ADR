import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { DRUGS_DB } from "./drugs";

// Drug Interaction Database - Each drug has interactions with multiple other drugs
export const INTERACTIONS_DB = [
  // Warfarin interactions
  { drug1: "Warfarin", drug2: "Amoxicillin", severity: "Major", description: "Amoxicillin can increase warfarin's anticoagulant effect, leading to increased bleeding risk.", recommendation: "Monitor INR more frequently; consider reducing warfarin dose.", mechanism: "Antibiotic alters gut flora affecting vitamin K synthesis." },
  { drug1: "Warfarin", drug2: "Simvastatin", severity: "Major", description: "Increased risk of bleeding and statin-induced myopathy.", recommendation: "Monitor INR and liver enzymes; avoid high-dose simvastatin.", mechanism: "CYP450 interaction and protein binding displacement." },
  { drug1: "Warfarin", drug2: "Amiodarone", severity: "Severe", description: "Amiodarone significantly potentiates warfarin's anticoagulant effect.", recommendation: "Reduce warfarin dose by 30-50% and monitor INR weekly.", mechanism: "Inhibits warfarin metabolism via CYP2C9." },
  { drug1: "Warfarin", drug2: "Omeprazole", severity: "Moderate", description: "PPI may slightly increase INR levels.", recommendation: "Monitor INR; no dose adjustment typically needed.", mechanism: "Inhibition of CYP2C19 metabolism." },
  
  // Lisinopril interactions
  { drug1: "Lisinopril", drug2: "Losartan", severity: "Contraindicated", description: "Dual RAAS blockade increases risk of hyperkalemia, hypotension, and renal failure.", recommendation: "Avoid combination; use single agent therapy.", mechanism: "Additive effect on renin-angiotensin system." },
  { drug1: "Lisinopril", drug2: "Spironolactone", severity: "Major", description: "Increased risk of severe hyperkalemia.", recommendation: "Monitor potassium levels closely; consider dose reduction.", mechanism: "Both drugs increase potassium retention." },
  { drug1: "Lisinopril", drug2: "Ibuprofen", severity: "Moderate", description: "NSAIDs reduce antihypertensive effect and increase nephrotoxicity risk.", recommendation: "Use alternative analgesic; monitor blood pressure and renal function.", mechanism: "Inhibition of prostaglandin synthesis." },
  
  // Metformin interactions
  { drug1: "Metformin", drug2: "Contrast Dye", severity: "Severe", description: "Increased risk of lactic acidosis, especially with renal impairment.", recommendation: "Hold metformin 48 hours before and after contrast procedure.", mechanism: "Contrast-induced nephropathy impairs metformin excretion." },
  { drug1: "Metformin", drug2: "Furosemide", severity: "Moderate", description: "Diuretic may increase risk of lactic acidosis.", recommendation: "Monitor renal function and serum lactate.", mechanism: "Diuretic can cause volume depletion and renal impairment." },
  
  // Atorvastatin interactions
  { drug1: "Atorvastatin", drug2: "Amiodarone", severity: "Severe", description: "Increased risk of myopathy and rhabdomyolysis.", recommendation: "Limit atorvastatin to 20mg/day; monitor CK levels.", mechanism: "Amiodarone inhibits statin metabolism via CYP3A4." },
  { drug1: "Atorvastatin", drug2: "Clopidogrel", severity: "Moderate", description: "Potential reduced antiplatelet effect of clopidogrel.", recommendation: "Consider alternative statin like pravastatin.", mechanism: "Competition for CYP3A4 metabolism." },
  { drug1: "Atorvastatin", drug2: "Gemfibrozil", severity: "Contraindicated", description: "Extremely high risk of rhabdomyolysis.", recommendation: "Avoid combination; use alternative fibrate if needed.", mechanism: "Gemfibrozil inhibits statin glucuronidation." },
  
  // Amlodipine interactions
  { drug1: "Amlodipine", drug2: "Simvastatin", severity: "Major", description: "Increased simvastatin levels, risk of myopathy.", recommendation: "Limit simvastatin to 20mg/day.", mechanism: "CYP3A4 inhibition." },
  { drug1: "Amlodipine", drug2: "Clarithromycin", severity: "Major", description: "Increased amlodipine levels, risk of hypotension and edema.", recommendation: "Monitor blood pressure; consider amlodipine dose reduction.", mechanism: "Macrolide inhibits CYP3A4 metabolism." },
  
  // Digoxin interactions
  { drug1: "Digoxin", drug2: "Amiodarone", severity: "Severe", description: "Digoxin levels can double, causing toxicity.", recommendation: "Reduce digoxin dose by 50% and monitor levels.", mechanism: "Amiodarone inhibits P-glycoprotein." },
  { drug1: "Digoxin", drug2: "Furosemide", severity: "Moderate", description: "Diuretic-induced hypokalemia increases digoxin toxicity risk.", recommendation: "Monitor potassium levels; consider potassium supplementation.", mechanism: "Hypokalemia sensitizes myocardium to digoxin." },
  
  // SSRIs (Sertraline) interactions
  { drug1: "Sertraline", drug2: "Warfarin", severity: "Major", description: "Increased bleeding risk due to platelet inhibition.", recommendation: "Monitor INR and signs of bleeding.", mechanism: "SSRI inhibits platelet serotonin reuptake." },
  { drug1: "Sertraline", drug2: "Tramadol", severity: "Severe", description: "Risk of serotonin syndrome.", recommendation: "Avoid combination; monitor for agitation, fever, rigidity.", mechanism: "Additive serotonin effects." },
  
  // Beta Blockers
  { drug1: "Metoprolol", drug2: "Verapamil", severity: "Contraindicated", description: "Severe bradycardia, heart block, and hypotension.", recommendation: "Avoid combination; use alternative CCB.", mechanism: "Additive negative chronotropic effects." },
  { drug1: "Carvedilol", drug2: "Digoxin", severity: "Moderate", description: "Increased digoxin levels and bradycardia risk.", recommendation: "Monitor digoxin levels and heart rate.", mechanism: "P-glycoprotein inhibition." },
  
  // Benzodiazepines
  { drug1: "Diazepam", drug2: "Omeprazole", severity: "Moderate", description: "Increased diazepam levels and sedation.", recommendation: "Monitor for excessive sedation; consider dose reduction.", mechanism: "Inhibition of CYP2C19 metabolism." },
  { drug1: "Alprazolam", drug2: "Fluconazole", severity: "Major", description: "Significantly increased alprazolam levels, risk of oversedation.", recommendation: "Reduce alprazolam dose by 50% or use alternative.", mechanism: "CYP3A4 inhibition." },
  
  // Opioids
  { drug1: "Oxycodone", drug2: "Fluconazole", severity: "Major", description: "Increased oxycodone levels and respiratory depression risk.", recommendation: "Monitor for excessive sedation; consider dose reduction.", mechanism: "CYP3A4 inhibition." },
  { drug1: "Tramadol", drug2: "Sertraline", severity: "Severe", description: "Increased risk of seizures and serotonin syndrome.", recommendation: "Avoid combination; use alternative analgesic.", mechanism: "Additive lowering of seizure threshold." },
  
  // Antibiotics
  { drug1: "Ciprofloxacin", drug2: "Warfarin", severity: "Major", description: "Increased INR and bleeding risk.", recommendation: "Monitor INR frequently; adjust warfarin dose.", mechanism: "Fluoroquinolone alters gut flora." },
  { drug1: "Azithromycin", drug2: "Simvastatin", severity: "Major", description: "Increased risk of statin myopathy.", recommendation: "Consider holding statin during short course.", mechanism: "CYP3A4 inhibition." },
  
  // Antiplatelets
  { drug1: "Clopidogrel", drug2: "Omeprazole", severity: "Major", description: "Reduced antiplatelet effect of clopidogrel.", recommendation: "Use pantoprazole or ranitidine instead.", mechanism: "CYP2C19 inhibition prevents clopidogrel activation." },
  { drug1: "Clopidogrel", drug2: "Rifampin", severity: "Major", description: "Reduced clopidogrel efficacy, increased thrombotic risk.", recommendation: "Consider alternative P2Y12 inhibitor like ticagrelor.", mechanism: "CYP3A4 and CYP2C19 induction." },
  
  // Antifungals
  { drug1: "Fluconazole", drug2: "Simvastatin", severity: "Severe", description: "Severe myopathy and rhabdomyolysis risk.", recommendation: "Hold statin during fluconazole treatment.", mechanism: "Potent CYP3A4 inhibition." },
  
  // Antidiabetics
  { drug1: "Empagliflozin", drug2: "Furosemide", severity: "Moderate", description: "Increased risk of volume depletion and hypotension.", recommendation: "Monitor blood pressure and renal function.", mechanism: "Additive diuretic effects." },
];

export default function Interactions() {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);

  const filteredDrugs = DRUGS_DB.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !selectedDrugs.includes(d.name)
  ).slice(0, 10);

  const addDrug = (drug: string) => { setSelectedDrugs([...selectedDrugs, drug]); setSearchTerm(""); setChecked(false); };
  const removeDrug = (drug: string) => { setSelectedDrugs(selectedDrugs.filter(d => d !== drug)); setChecked(false); };
  
  const checkInteractions = () => {
    const found = INTERACTIONS_DB.filter(i => 
      selectedDrugs.includes(i.drug1) && selectedDrugs.includes(i.drug2)
    );
    setResults(found);
    setChecked(true);
  };

  const getOverallSeverity = () => {
    if (results.length === 0) return "none";
    if (results.some(r => r.severity === "Contraindicated")) return "contraindicated";
    if (results.some(r => r.severity === "Severe")) return "severe";
    if (results.some(r => r.severity === "Major")) return "major";
    return "moderate";
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight text-gray-900">Drug Interaction Checker</h1><p className="text-gray-500 mt-1">Analyze potential interactions between 50+ medications.</p></div>
      <MedicalDisclaimer />
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 shadow-sm">
          <CardHeader><CardTitle>Select Medications</CardTitle><CardDescription>Add 2 or more drugs to check for interactions (50+ drugs available).</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3"><Label>Add Drug</Label><div className="relative"><Input placeholder="Search for a drug..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />{searchTerm && filteredDrugs.length > 0 && (<div className="absolute z-10 w-full mt-1 bg-white rounded-md border shadow-lg max-h-64 overflow-auto"><ul className="py-1">{filteredDrugs.map((drug) => (<li key={drug.id}><button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center" onClick={() => addDrug(drug.name)}><span><span className="font-medium">{drug.name}</span><span className="text-gray-400 ml-2 text-xs">{drug.category}</span></span><Plus className="h-4 w-4 text-gray-400" /></button></li>))}</ul></div>)}</div></div>
            {selectedDrugs.length > 0 && (<div className="space-y-2"><Label>Selected Drugs ({selectedDrugs.length})</Label><div className="flex flex-wrap gap-2">{selectedDrugs.map(drug => (<div key={drug} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium border border-blue-200">{drug}<button onClick={() => removeDrug(drug)} className="ml-1 hover:bg-blue-100 rounded-full p-0.5"><X className="h-3 w-3" /></button></div>))}</div></div>)}
          </CardContent>
          <CardFooter><Button className="w-full" onClick={checkInteractions} disabled={selectedDrugs.length < 2}>Check Interactions</Button></CardFooter>
        </Card>
        <div className="md:col-span-7 space-y-6">
          {checked && results.length > 0 ? (
            <Card><CardHeader className="pb-4 border-b"><div className="flex justify-between"><div><CardTitle>Interaction Analysis Results</CardTitle><CardDescription>Found {results.length} interaction(s)</CardDescription></div><SeverityBadge severity={getOverallSeverity()} /></div></CardHeader><CardContent className="pt-6 space-y-4">{results.map((interaction, idx) => (<div key={idx} className={`p-4 rounded-lg border ${interaction.severity === "Contraindicated" ? "bg-red-50 border-red-200" : interaction.severity === "Severe" ? "bg-orange-50 border-orange-200" : "bg-amber-50 border-amber-200"}`}><div className="flex justify-between items-start mb-2"><div className="font-semibold text-gray-900">{interaction.drug1} <span className="text-gray-400">+</span> {interaction.drug2}</div><SeverityBadge severity={interaction.severity.toLowerCase()} /></div><p className="text-sm text-gray-700 mb-2">{interaction.description}</p><div className="text-xs text-gray-600 mb-2"><span className="font-semibold">Mechanism:</span> {interaction.mechanism}</div><div className="mt-2 pt-2 border-t"><p className="text-xs font-semibold text-gray-600">Clinical Recommendation:</p><p className="text-sm text-gray-700">{interaction.recommendation}</p></div></div>))}</CardContent></Card>
          ) : checked ? (
            <Card><CardContent className="p-8 text-center"><CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" /><p className="text-gray-700 font-medium">No interactions found</p><p className="text-sm text-gray-500">These medications appear safe to use together based on our database.</p></CardContent></Card>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-dashed rounded-lg"><Activity className="h-12 w-12 mb-4 text-gray-300" /><p className="text-lg font-medium text-gray-600">No Analysis Yet</p><p className="text-sm text-center">Select 2+ medications to check for interactions.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}