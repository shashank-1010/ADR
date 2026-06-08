import React, { useState } from "react";
import { useListDrugs } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pill, Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function DrugsList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: drugs, isLoading } = useListDrugs(
    { search: debouncedSearch || undefined, limit: 50 },
    { query: { queryKey: ["/api/drugs", { search: debouncedSearch, limit: 50 }] } }
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Drug Database</h1>
        <p className="text-slate-500 mt-1">Search and review detailed pharmacological information.</p>
      </div>

      <MedicalDisclaimer />

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search by drug name or active ingredient..." 
          className="pl-10 h-12 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))
        ) : drugs && drugs.length > 0 ? (
          drugs.map((drug) => (
            <Card key={drug.id} className="shadow-sm flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-4">
                  <span className="text-lg text-slate-900 line-clamp-1">{drug.name}</span>
                  <Pill className="h-5 w-5 text-primary shrink-0" />
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">{drug.genericName}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-slate-600 line-clamp-2">
                    <span className="font-semibold text-slate-700">Category: </span>
                    {drug.category}
                  </div>
                  {drug.manufacturer && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building className="h-3 w-3" />
                      <span className="line-clamp-1">{drug.manufacturer}</span>
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link href={`/drugs/${drug.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            <Pill className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-700">No drugs found</p>
            <p className="text-sm">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
