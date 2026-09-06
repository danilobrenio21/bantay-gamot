'use client';

import { useState } from 'react';
import { Search, MapPin, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  facility_name: string;
  city: string;
  barangay: string;
  phone: string;
  generic_name: string;
  dosage: string;
  units_available: number;
  is_free_subsidy: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const { data } = await supabase
      .from('facility_inventory')
      .select(`
        units_available,
        is_free_subsidy,
        medicines!inner(generic_name, dosage),
        facilities!inner(name, city, barangay, contact_phone, is_verified)
      `)
      .ilike('medicines.generic_name', `%${query}%`)
      .gt('units_available', 0)
      .limit(10);

    if (data) {
      setResults(
        data.map((row: any) => ({
          facility_name: row.facilities.name,
          city: row.facilities.city,
          barangay: row.facilities.barangay,
          phone: row.facilities.contact_phone,
          generic_name: row.medicines.generic_name,
          dosage: row.medicines.dosage,
          units_available: row.units_available,
          is_free_subsidy: row.is_free_subsidy,
        }))
      );
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 max-w-lg mx-auto font-sans">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Bantay-Gamot <span className="text-blue-600">PH</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Libreng gamot sa pampublikong ospital at health centers.
        </p>
      </header>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Rabies, Insulin, Paracetamol..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-24 text-sm font-medium focus:border-blue-600 focus:outline-none shadow-sm"
        />
        <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
        <button
          type="submit"
          className="absolute right-2 top-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          {loading ? '...' : 'Hanapin'}
        </button>
      </form>

      <div className="space-y-3">
        {results.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">{item.generic_name}</h2>
                <p className="text-xs text-slate-500">{item.dosage}</p>
              </div>
              {item.is_free_subsidy && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" /> Libre (Gov)
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>{item.facility_name}</span>
              </div>
              <p className="pl-5 text-slate-500">{item.barangay}, {item.city}</p>
              {item.phone && (
                <div className="flex items-center gap-1.5 pl-5 text-blue-600">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${item.phone}`}>{item.phone}</a>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500">Available Stock:</span>
              <span className="font-bold text-slate-800">{item.units_available} units</span>
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 p-6">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Walang nahanap na stock</p>
            <p className="text-xs text-slate-500 mt-1">
              Maaaring subukan ang ibang generic name o pumunta sa pinakamalapit na Malasakit Center.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
