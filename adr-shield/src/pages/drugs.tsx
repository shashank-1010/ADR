import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pill, Building } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";

export const DRUGS_DB = [
  { id: "1", name: "Lisinopril", genericName: "Lisinopril", category: "ACE Inhibitor", manufacturer: "AstraZeneca", description: "Used to treat high blood pressure and heart failure." },
  { id: "2", name: "Metformin", genericName: "Metformin Hydrochloride", category: "Biguanide", manufacturer: "Merck", description: "First-line medication for type 2 diabetes." },
  { id: "3", name: "Atorvastatin", genericName: "Atorvastatin Calcium", category: "Statin", manufacturer: "Pfizer", description: "Lowers cholesterol and triglycerides." },
  { id: "4", name: "Amlodipine", genericName: "Amlodipine Besylate", category: "Calcium Channel Blocker", manufacturer: "Pfizer", description: "Treats hypertension and angina." },
  { id: "5", name: "Levothyroxine", genericName: "Levothyroxine Sodium", category: "Thyroid Hormone", manufacturer: "AbbVie", description: "Treats hypothyroidism." },
  { id: "6", name: "Omeprazole", genericName: "Omeprazole", category: "Proton Pump Inhibitor", manufacturer: "AstraZeneca", description: "Reduces stomach acid for GERD and ulcers." },
  { id: "7", name: "Losartan", genericName: "Losartan Potassium", category: "ARB", manufacturer: "Merck", description: "Treats high blood pressure and diabetic kidney disease." },
  { id: "8", name: "Albuterol", genericName: "Albuterol Sulfate", category: "Bronchodilator", manufacturer: "GSK", description: "Relieves bronchospasm in asthma and COPD." },
  { id: "9", name: "Gabapentin", genericName: "Gabapentin", category: "Anticonvulsant", manufacturer: "Pfizer", description: "Treats neuropathic pain and seizures." },
  { id: "10", name: "Hydrochlorothiazide", genericName: "HCTZ", category: "Thiazide Diuretic", manufacturer: "Novartis", description: "Treats high blood pressure and edema." },
  { id: "11", name: "Sertraline", genericName: "Sertraline HCl", category: "SSRI", manufacturer: "Pfizer", description: "Treats depression, anxiety, and OCD." },
  { id: "12", name: "Warfarin", genericName: "Warfarin Sodium", category: "Anticoagulant", manufacturer: "Bristol-Myers", description: "Prevents blood clots and strokes." },
  { id: "13", name: "Simvastatin", genericName: "Simvastatin", category: "Statin", manufacturer: "Merck", description: "Lowers LDL cholesterol." },
  { id: "14", name: "Prednisone", genericName: "Prednisone", category: "Corticosteroid", manufacturer: "Various", description: "Anti-inflammatory and immunosuppressant." },
  { id: "15", name: "Escitalopram", genericName: "Escitalopram Oxalate", category: "SSRI", manufacturer: "Lundbeck", description: "Treats depression and generalized anxiety." },
  { id: "16", name: "Metoprolol", genericName: "Metoprolol Tartrate", category: "Beta Blocker", manufacturer: "AstraZeneca", description: "Treats hypertension, angina, and heart failure." },
  { id: "17", name: "Carvedilol", genericName: "Carvedilol", category: "Beta Blocker", manufacturer: "GSK", description: "Treats heart failure and hypertension." },
  { id: "18", name: "Furosemide", genericName: "Furosemide", category: "Loop Diuretic", manufacturer: "Sanofi", description: "Treats edema and hypertension." },
  { id: "19", name: "Spironolactone", genericName: "Spironolactone", category: "Potassium Sparing Diuretic", manufacturer: "Pfizer", description: "Treats heart failure and hyperaldosteronism." },
  { id: "20", name: "Clopidogrel", genericName: "Clopidogrel Bisulfate", category: "Antiplatelet", manufacturer: "Sanofi", description: "Prevents strokes and heart attacks." },
  { id: "21", name: "Apixaban", genericName: "Apixaban", category: "DOAC", manufacturer: "BMS", description: "Prevents stroke in atrial fibrillation." },
  { id: "22", name: "Rivaroxaban", genericName: "Rivaroxaban", category: "DOAC", manufacturer: "Bayer", description: "Treats and prevents DVT and PE." },
  { id: "23", name: "Dabigatran", genericName: "Dabigatran Etexilate", category: "Direct Thrombin Inhibitor", manufacturer: "Boehringer", description: "Prevents stroke in atrial fibrillation." },
  { id: "24", name: "Digoxin", genericName: "Digoxin", category: "Cardiac Glycoside", manufacturer: "GSK", description: "Treats heart failure and atrial fibrillation." },
  { id: "25", name: "Nitroglycerin", genericName: "Nitroglycerin", category: "Nitrate", manufacturer: "Pfizer", description: "Treats angina pectoris." },
  { id: "26", name: "Insulin Glargine", genericName: "Insulin Glargine", category: "Long Acting Insulin", manufacturer: "Sanofi", description: "Controls blood sugar in diabetes." },
  { id: "27", name: "Empagliflozin", genericName: "Empagliflozin", category: "SGLT2 Inhibitor", manufacturer: "Boehringer", description: "Treats type 2 diabetes and heart failure." },
  { id: "28", name: "Dapagliflozin", genericName: "Dapagliflozin", category: "SGLT2 Inhibitor", manufacturer: "AstraZeneca", description: "Treats type 2 diabetes and kidney disease." },
  { id: "29", name: "Liraglutide", genericName: "Liraglutide", category: "GLP-1 Agonist", manufacturer: "Novo Nordisk", description: "Treats type 2 diabetes and obesity." },
  { id: "30", name: "Semaglutide", genericName: "Semaglutide", category: "GLP-1 Agonist", manufacturer: "Novo Nordisk", description: "Treats type 2 diabetes and weight management." },
  { id: "31", name: "Azithromycin", genericName: "Azithromycin", category: "Macrolide Antibiotic", manufacturer: "Pfizer", description: "Treats bacterial infections." },
  { id: "32", name: "Amoxicillin", genericName: "Amoxicillin", category: "Penicillin", manufacturer: "GSK", description: "Treats bacterial infections." },
  { id: "33", name: "Ciprofloxacin", genericName: "Ciprofloxacin", category: "Fluoroquinolone", manufacturer: "Bayer", description: "Treats bacterial infections." },
  { id: "34", name: "Doxycycline", genericName: "Doxycycline", category: "Tetracycline", manufacturer: "Pfizer", description: "Treats bacterial infections and acne." },
  { id: "35", name: "Fluconazole", genericName: "Fluconazole", category: "Antifungal", manufacturer: "Pfizer", description: "Treats fungal infections." },
  { id: "36", name: "Ibuprofen", genericName: "Ibuprofen", category: "NSAID", manufacturer: "Various", description: "Treats pain, fever, and inflammation." },
  { id: "37", name: "Naproxen", genericName: "Naproxen Sodium", category: "NSAID", manufacturer: "Bayer", description: "Treats pain and inflammation." },
  { id: "38", name: "Celecoxib", genericName: "Celecoxib", category: "COX-2 Inhibitor", manufacturer: "Pfizer", description: "Treats arthritis pain." },
  { id: "39", name: "Tramadol", genericName: "Tramadol HCl", category: "Opioid", manufacturer: "Various", description: "Treats moderate to severe pain." },
  { id: "40", name: "Oxycodone", genericName: "Oxycodone HCl", category: "Opioid", manufacturer: "Purdue", description: "Treats severe pain." },
  { id: "41", name: "Morphine", genericName: "Morphine Sulfate", category: "Opioid", manufacturer: "Various", description: "Treats severe pain." },
  { id: "42", name: "Diazepam", genericName: "Diazepam", category: "Benzodiazepine", manufacturer: "Roche", description: "Treats anxiety and seizures." },
  { id: "43", name: "Lorazepam", genericName: "Lorazepam", category: "Benzodiazepine", manufacturer: "Pfizer", description: "Treats anxiety and sedation." },
  { id: "44", name: "Alprazolam", genericName: "Alprazolam", category: "Benzodiazepine", manufacturer: "Pfizer", description: "Treats anxiety and panic disorder." },
  { id: "45", name: "Zolpidem", genericName: "Zolpidem Tartrate", category: "Sedative", manufacturer: "Sanofi", description: "Treats insomnia." },
  { id: "46", name: "Methylphenidate", genericName: "Methylphenidate HCl", category: "Stimulant", manufacturer: "Novartis", description: "Treats ADHD." },
  { id: "47", name: "Modafinil", genericName: "Modafinil", category: "Wakefulness Agent", manufacturer: "Cephalon", description: "Treats narcolepsy and shift work disorder." },
  { id: "48", name: "Donepezil", genericName: "Donepezil HCl", category: "Cholinesterase Inhibitor", manufacturer: "Eisai", description: "Treats Alzheimer's disease." },
  { id: "49", name: "Memantine", genericName: "Memantine HCl", category: "NMDA Antagonist", manufacturer: "Forest", description: "Treats moderate to severe Alzheimer's." },
  { id: "50", name: "Risperidone", genericName: "Risperidone", category: "Atypical Antipsychotic", manufacturer: "Janssen", description: "Treats schizophrenia and bipolar disorder." },
  { id: "51", name: "Quetiapine", genericName: "Quetiapine Fumarate", category: "Atypical Antipsychotic", manufacturer: "AstraZeneca", description: "Treats schizophrenia, bipolar, and depression." },
  { id: "52", name: "Olanzapine", genericName: "Olanzapine", category: "Atypical Antipsychotic", manufacturer: "Lilly", description: "Treats schizophrenia and bipolar disorder." },
];

export default function DrugsList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredDrugs = DRUGS_DB.filter(drug => 
    drug.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight text-gray-900">Drug Database</h1><p className="text-gray-500 mt-1">52 FDA-approved medications with complete profiles.</p></div>
      <MedicalDisclaimer />
      <div className="relative max-w-xl"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search by drug name or generic name..." className="pl-10 h-12 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrugs.map((drug) => (
          <Card key={drug.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader><CardTitle className="flex justify-between"><span className="text-lg text-gray-900">{drug.name}</span><Pill className="h-5 w-5 text-blue-600" /></CardTitle><CardDescription>{drug.genericName}</CardDescription></CardHeader>
            <CardContent><div className="text-sm text-gray-600"><span className="font-semibold">Category:</span> {drug.category}</div><div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2"><Building className="h-3 w-3" />{drug.manufacturer}</div><Link href={`/drugs/${drug.id}`} className="w-full mt-3 block"><Button variant="outline" className="w-full">View Details</Button></Link></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}