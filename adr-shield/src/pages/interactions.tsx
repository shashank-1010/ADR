import React, { useState } from "react";
import { useListDrugs, useCheckInteractions } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Interactions() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<{id: string, name: string}[]>([]);
  const [patientAge, setPatientAge] = useState<string>("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: searchResults } = useListDrugs(
    { search: debouncedSearch, limit: 5 },
    { query: { enabled: debouncedSearch.length > 1, queryKey: ["/api/drugs", { search: debouncedSearch, limit: 5 }] } }
  );

  const checkInteractions = useCheckInteractions();

  const handleAddDrug = (drug: {id: string, name: string}) => {
    if (!selectedDrugs.find(d => d.id === drug.id)) {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
    setSearch("");
  };

  const handleRemoveDrug = (id: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== id));
  };

  const handleCheck = () => {
    if (selectedDrugs.length < 2) return;
    
    checkInteractions.mutate({
      data: {
        drugs: selectedDrugs.map(d => d.name),
        patientAge: patientAge ? parseInt(patientAge) : undefined
      }
    });
  };

  const result = checkInteractions.data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interaction Checker</h1>
        <p className="text-slate-500 mt-1">Analyze potential adverse interactions between multiple medications.</p>
      </div>

      <MedicalDisclaimer />

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Select Medications</CardTitle>
            <CardDescription>Add 2 or more drugs to check for interactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Patient Age (Optional)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 65" 
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Add Drug</Label>
              <div className="relative">
                <Input 
                  placeholder="Search for a drug..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {debouncedSearch.length > 1 && searchResults && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md border shadow-lg max-h-[300px] overflow-auto">
                    {searchResults.length > 0 ? (
                      <ul className="py-1">
                        {searchResults.map((drug) => (
                          <li key={drug.id}>
                            <button
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center justify-between"
                              onClick={() => handleAddDrug({ id: drug.id, name: drug.name })}
                            >
                              <span>
                                <span className="font-medium text-slate-900">{drug.name}</span>
                                <span className="text-slate-500 ml-2 text-xs">{drug.genericName}</span>
                              </span>
                              <Plus className="h-4 w-4 text-slate-400" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-sm text-slate-500 text-center">No drugs found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedDrugs.length > 0 && (
              <div className="space-y-2 pt-2">
                <Label>Selected Drugs ({selectedDrugs.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedDrugs.map(drug => (
                    <div key={drug.id} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm font-medium border border-primary/20">
                      {drug.name}
                      <button 
                        onClick={() => handleRemoveDrug(drug.id)}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
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
              onClick={handleCheck} 
              disabled={selectedDrugs.length < 2 || checkInteractions.isPending}
            >
              {checkInteractions.isPending ? "Analyzing..." : "Check Interactions"}
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-7 space-y-6">
          {checkInteractions.isPending ? (
            <Card className="shadow-sm border-dashed border-2 animate-pulse bg-slate-50/50">
              <CardContent className="py-12 text-center space-y-4">
                <Activity className="h-12 w-12 text-primary/40 mx-auto animate-spin-slow" />
                <p className="text-slate-500 font-medium">Analyzing pharmacological profiles...</p>
              </CardContent>
            </Card>
          ) : result ? (
            <>
              <Card className="shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Analysis Result</CardTitle>
                      <CardDescription>Overall interaction severity for selected regimen</CardDescription>
                    </div>
                    <SeverityBadge severity={result.overallSeverity} />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {result.interactions.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Identified Interactions</h3>
                      {result.interactions.map((interaction, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${
                          interaction.severity === 'dangerous' ? 'bg-red-50 border-red-200' :
                          interaction.severity === 'moderate' ? 'bg-amber-50 border-amber-200' :
                          'bg-emerald-50 border-emerald-200'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-slate-900">
                              {interaction.drug1} <span className="text-slate-400 mx-2">↔</span> {interaction.drug2}
                            </div>
                            <SeverityBadge severity={interaction.severity} />
                          </div>
                          <p className="text-sm text-slate-700">{interaction.explanation}</p>
                          
                          {interaction.alternatives && interaction.alternatives.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200/50">
                              <span className="text-xs font-semibold text-slate-600 block mb-1">Suggested Alternatives:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {interaction.alternatives.map((alt, i) => (
                                  <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertTitle>No Known Interactions</AlertTitle>
                      <AlertDescription>
                        No significant interactions were found between these medications in our database.
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.warnings.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Clinical Warnings
                      </h3>
                      <ul className="space-y-2">
                        {result.warnings.map((warning, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-dashed rounded-lg">
              <Activity className="h-12 w-12 mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-600">No Analysis Yet</p>
              <p className="text-sm mt-1 max-w-sm text-center">Select at least two medications from the panel and click check to see potential interactions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
