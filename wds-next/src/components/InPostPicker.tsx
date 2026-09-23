'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Check, X, Loader2, RefreshCw } from 'lucide-react';

// Extend JSX for inpost-geowidget Web Component
declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'inpost-geowidget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        token?: string;
        language?: string;
        config?: string;
        onpoint?: string;
      };
    }
  }
}

export interface InPostPoint {
  name: string; // e.g. WAW198M
  city: string;
  street: string;
  buildingNumber: string;
  postCode: string;
  locationDescription: string;
  is24_7?: boolean;
}

interface InPostPickerProps {
  selectedPoint: InPostPoint | null;
  onSelectPoint: (point: InPostPoint | null) => void;
  required?: boolean;
}

export default function InPostPicker({
  selectedPoint,
  onSelectPoint,
  required = false,
}: InPostPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<InPostPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isGeowidgetLoaded, setIsGeowidgetLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced live search fallback
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(
          `/api/inpost/points?query=${encodeURIComponent(searchTerm.trim())}&limit=12`
        );
        const data = await res.json();
        if (data.points && Array.isArray(data.points)) {
          setResults(data.points);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        setErrorMsg('Błąd podczas pobierania paczkomatów');
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen to InPost Geowidget callback & custom events
  useEffect(() => {
    const handlePointSelect = (rawPoint: any) => {
      if (!rawPoint) return;
      const p = rawPoint.detail || rawPoint;
      if (!p || (!p.name && !p.id)) return;

      const line1 = p.address_details?.street 
        ? `${p.address_details.street} ${p.address_details.building_number || ''}`.trim()
        : p.address?.line1 || p.address?.street || '';

      const line2City = p.address_details?.city 
        || p.address?.city 
        || (p.address?.line2 ? p.address.line2.replace(/^\d{2}-\d{3}\s*/, '') : 'Warszawa');

      const line2PostCode = p.address_details?.post_code 
        || p.address?.post_code 
        || (p.address?.line2 ? p.address.line2.slice(0, 6) : '');

      const normalized: InPostPoint = {
        name: (p.name || p.id).toUpperCase(),
        city: line2City,
        street: line1 || 'Adres Paczkomatu',
        buildingNumber: p.address_details?.building_number || '',
        postCode: line2PostCode || '00-000',
        locationDescription: p.location_description || p.description || '',
        is24_7: p.operating_hours === '24/7' || true,
      };

      onSelectPoint(normalized);
      setIsMapModalOpen(false);
    };

    // Global function referenced by onpoint="onInPostPointSelected"
    (window as any).onInPostPointSelected = handlePointSelect;
    document.addEventListener('onpointselect', handlePointSelect as EventListener);
    document.addEventListener('point:selected', handlePointSelect as EventListener);

    return () => {
      try {
        delete (window as any).onInPostPointSelected;
      } catch (e) {}
      document.removeEventListener('onpointselect', handlePointSelect as EventListener);
      document.removeEventListener('point:selected', handlePointSelect as EventListener);
    };
  }, [onSelectPoint]);

  // Load InPost Geowidget v5 scripts dynamically on demand
  const openGeowidgetModal = () => {
    setIsMapModalOpen(true);

    if (!document.getElementById('inpost-geowidget-css')) {
      const link = document.createElement('link');
      link.id = 'inpost-geowidget-css';
      link.rel = 'stylesheet';
      link.href = 'https://geowidget.inpost.pl/inpost-geowidget.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('inpost-geowidget-js')) {
      const script = document.createElement('script');
      script.id = 'inpost-geowidget-js';
      script.src = 'https://geowidget.inpost.pl/inpost-geowidget.js';
      script.async = true;
      script.onload = () => {
        setIsGeowidgetLoaded(true);
      };
      script.onerror = () => {
        console.warn('Nie udało się załadować oficjalnego skryptu InPost Geowidget.');
      };
      document.body.appendChild(script);
    } else {
      setIsGeowidgetLoaded(true);
    }
  };

  const handleSelect = (point: InPostPoint) => {
    onSelectPoint(point);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onSelectPoint(null);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="space-y-2.5 text-left" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-[#D9A87E] font-semibold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD100] inline-block shadow-[0_0_8px_rgba(255,209,0,0.5)]" />
          Paczkomat InPost 24/7
          {required && <span className="text-[#B53838]">*</span>}
        </label>
        <button
          type="button"
          onClick={openGeowidgetModal}
          className="text-xs text-[#FFD100] hover:text-[#FFE04D] font-mono font-bold flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD100]/10 border border-[#FFD100]/30 rounded-lg transition-all hover:bg-[#FFD100]/20"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Wybierz na mapie</span>
        </button>
      </div>

      {/* Selected Point View */}
      {selectedPoint ? (
        <div className="p-4 bg-[#141412] border border-[#2B2B28] rounded-xl relative flex items-start justify-between group transition-all shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFD100] text-black flex items-center justify-center font-mono text-sm font-bold shrink-0 mt-0.5 shadow-sm">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-[#FFD100] tracking-wider">
                  {selectedPoint.name}
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  DOSTĘPNY 24/7
                </span>
              </div>
              <p className="text-xs text-white font-medium mt-1">
                {selectedPoint.street} {selectedPoint.buildingNumber}, {selectedPoint.postCode} {selectedPoint.city}
              </p>
              {selectedPoint.locationDescription && (
                <p className="text-[11px] text-gray-400 italic mt-0.5 line-clamp-1">
                  {selectedPoint.locationDescription}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-white hover:border-gray-500 px-2.5 py-1 text-xs font-mono border border-white/10 rounded transition-colors flex items-center gap-1"
            title="Zmień paczkomat"
          >
            <RefreshCw className="w-3 h-3" /> Zmień
          </button>
        </div>
      ) : (
        /* Search Input */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Wpisz kod Paczkomatu (np. WAW01A) lub ulicę / miasto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => results.length > 0 && setIsOpen(true)}
              className="w-full pl-10 pr-9 py-3 text-xs bg-[#0D0D0B] border border-[#2B2B28] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A87E] transition-colors"
            />
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-[#D9A87E] animate-spin absolute right-3" />
            ) : searchTerm ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setResults([]);
                }}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-[#171715] border border-[#333330] rounded-xl shadow-2xl divide-y divide-white/5">
              {results.map((point) => (
                <button
                  key={point.name}
                  type="button"
                  onClick={() => handleSelect(point)}
                  className="w-full px-4 py-3 text-left hover:bg-[#20201D] transition-colors flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#FFD100] bg-[#FFD100]/10 px-2 py-0.5 rounded border border-[#FFD100]/20">
                        {point.name}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {point.city}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-1">
                      {point.street} {point.buildingNumber}, {point.postCode}
                    </p>
                    {point.locationDescription && (
                      <p className="text-[10px] text-gray-500 italic line-clamp-1 mt-0.5">
                        {point.locationDescription}
                      </p>
                    )}
                  </div>
                  <Check className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {isOpen && !isLoading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="absolute z-50 left-0 right-0 mt-2 p-4 text-center bg-[#171715] border border-[#333330] rounded-xl text-xs text-gray-400 shadow-xl">
              Nie znaleziono Paczkomatu dla &ldquo;{searchTerm}&rdquo;. Sprawdź kod lub{' '}
              <button
                type="button"
                onClick={openGeowidgetModal}
                className="text-[#FFD100] underline font-semibold"
              >
                wybierz na mapie InPost
              </button>.
            </div>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-[#B53838]">{errorMsg}</p>}

      {/* Official InPost Geowidget v5 Interactive Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#141412] text-white w-full max-w-4xl rounded-2xl border border-[#2B2B28] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2B2B28] bg-[#1A1A18]">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#FFD100] shadow-[0_0_8px_rgba(255,209,0,0.6)]" />
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                    Wybierz Paczkomat InPost na mapie
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Kliknij punkt odbioru na mapie, aby zatwierdzić Paczkomat do wysyłki
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Zamknij mapę"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* InPost Geowidget Canvas */}
            <div className="relative w-full h-[540px] sm:h-[620px] bg-[#0D0D0B] overflow-hidden flex flex-col">
              {!isGeowidgetLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141412] text-gray-300 gap-3 z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FFD100]" />
                  <span className="text-xs font-mono">Inicjalizacja InPost Geowidget v5...</span>
                </div>
              )}

              {/* Embedded InPost Geowidget Custom Element */}
              <div className="w-full h-full flex-grow">
                <inpost-geowidget
                  token={process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN || ''}
                  language="pl"
                  config="parcelcollect"
                  onpoint="onInPostPointSelected"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#1A1A18] border-t border-[#2B2B28] flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFD100]" />
                Ponad 22 000 Paczkomatów w całej Polsce
              </span>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="text-xs text-gray-300 hover:text-white underline font-mono"
              >
                Zamknij mapę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
