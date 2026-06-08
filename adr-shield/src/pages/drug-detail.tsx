import React from "react";
import { useGetDrug, getGetDrugQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function DrugDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data: drug, isLoading, error } = useGetDrug(id, {
    query: { enabled: !!id, queryKey: getGetDrugQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-6 w-full max-w-md" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (error || !drug) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-600">Drug not found or error loading details.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/drugs">Back to Database</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href="/drugs"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {drug.name} <Badge variant="secondary" className="text-xs bg-slate-100">{drug.category}</Badge>
          </h1>
          <p className="text-slate-500 mt-1">{drug.genericName}</p>
        </div>
      </div>

      <MedicalDisclaimer />

      <Card className="shadow-sm bg-white">
        <CardContent className="p-6">
          <p className="text-slate-700 leading-relaxed">{drug.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-slate-700 flex items-center">Active Ingredients:</span>
            {drug.activeIngredients.map((ingredient, i) => (
              <Badge key={i} variant="outline" className="bg-slate-50 text-slate-700">{ingredient}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Indications
            </CardTitle>
            <CardDescription>Approved uses for this medication</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {drug.indications.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Contraindications
            </CardTitle>
            <CardDescription>Situations where drug should not be used</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {drug.contraindications.map((contra, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>{contra}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-amber-500 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Side Effects
            </CardTitle>
            <CardDescription>Known adverse reactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {drug.sideEffects.map((effect, i) => (
                <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                  {effect}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
