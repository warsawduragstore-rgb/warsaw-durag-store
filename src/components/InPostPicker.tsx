'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Check, X, Loader2, ExternalLink } from 'lucide-react';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced live search
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

  // Open official InPost Geowidget modal
  const openGeowidgetModal = () => {
    setIsMapModalOpen(true);
    // Dynamically inject Geowidget SDK script if not yet present
    if (!document.getElementById('inpost-geowidget-sdk')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://geowidget.easypack24.net/css/easypack.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.id = 'inpost-geowidget-sdk';
      script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  return (
    <div className="space-y-2.5 text-left" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-[#262624] font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FFD100] border border-[#0D0D0B]/30 inline-block" />
          Wskaż Paczkomat InPost
          {required && <span className="text-[#B53838]">*</span>}
        </label>
        <button
          type="button"
          onClick={openGeowidgetModal}
          className="text-[11px] text-[#734C1D] hover:text-[#0D0D0B] font-medium underline flex items-center gap-1 transition-colors"
        >
          <MapPin className="w-3 h-3" />
          Mapa Paczkomatów
        </button>
      </div>

      {/* Selected Point View */}
      {selectedPoint ? (
        <div className="p-3 bg-[#F7F5F2] border border-[#734C1D]/40 rounded-sm relative flex items-start justify-between group transition-all">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded bg-[#0D0D0B] text-[#FFD100] flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0D0D0B] tracking-wider">
                  {selectedPoint.name}
                </span>
                {selectedPoint.is24_7 && (
                  <span className="text-[10px] bg-[#2E7D32]/10 text-[#2E7D32] px-1.5 py-0.5 rounded font-medium">
                    24/7
                  </span>
                )}
              </div>
              <p className="text-xs text-[#0D0D0B] font-medium mt-0.5">
                {selectedPoint.street} {selectedPoint.buildingNumber}, {selectedPoint.postCode} {selectedPoint.city}
              </p>
              {selectedPoint.locationDescription && (
                <p className="text-[11px] text-[#5A5B60] italic mt-0.5">
                  {selectedPoint.locationDescription}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-[#5A5B60] hover:text-[#B53838] p-1 text-xs font-semibold underline transition-colors"
            title="Zmień paczkomat"
          >
            Zmień
          </button>
        </div>
      ) : (
        /* Search Input */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8C8D94] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Wpisz miasto, ulicę lub kod (np. Marszałkowska Warszawa, WAW01M)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => results.length > 0 && setIsOpen(true)}
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-[#CFCFCF] outline-none focus:border-[#734C1D] transition-colors placeholder:text-[#8C8D94]"
            />
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-[#734C1D] animate-spin absolute right-3" />
            ) : searchTerm ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setResults([]);
                }}
                className="absolute right-3 text-[#8C8D94] hover:text-[#0D0D0B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-[#CFCFCF] shadow-xl rounded-sm divide-y divide-gray-100">
              {results.map((point) => (
                <button
                  key={point.name}
                  type="button"
                  onClick={() => handleSelect(point)}
                  className="w-full px-3 py-2.5 text-left hover:bg-[#F7F5F2] transition-colors flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#0D0D0B] bg-[#F7F5F2] group-hover:bg-[#EAE6DF] px-1.5 py-0.5 rounded">
                        {point.name}
                      </span>
                      <span className="text-xs font-semibold text-[#0D0D0B]">
                        {point.city}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3B3C40] mt-0.5">
                      {point.street} {point.buildingNumber}, {point.postCode}
                    </p>
                    {point.locationDescription && (
                      <p className="text-[10px] text-[#734C1D] line-clamp-1 mt-0.5">
                        {point.locationDescription}
                      </p>
                    )}
                  </div>
                  <Check className="w-4 h-4 text-[#734C1D] opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {isOpen && !isLoading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 p-3 text-center bg-white border border-[#CFCFCF] shadow-lg text-xs text-[#5A5B60]">
              Nie znaleziono Paczkomatu dla &ldquo;{searchTerm}&rdquo;. Spróbuj podać samą ulicę lub kod maszyny.
            </div>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-[#B53838]">{errorMsg}</p>}

      {/* Geowidget Fullscreen Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D0D0B] text-white w-full max-w-2xl rounded-sm border border-[#3B3C40] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2B2B28] bg-[#161614]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD100]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#EAE6DF]">
                  Wybór Paczkomatu InPost
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="text-[#A1A1A8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#1A1A18] text-center border-b border-[#2B2B28]">
              <p className="text-xs text-[#EAE6DF] mb-2">
                Wyszukaj swój Paczkomat w wyszukiwarce lub kliknij poniżej, aby otworzyć oficjalną mapę InPost:
              </p>
              <a
                href="https://inpost.pl/znajdz-paczkomat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD100] text-[#0D0D0B] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#FFE04D] transition-colors"
              >
                <span>Otwórz mapę InPost w nowej karcie</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 bg-[#161614] space-y-3">
              <p className="text-[11px] text-[#A1A1A8] leading-relaxed">
                Po znalezieniu kodu swojego Paczkomatu (np. <strong className="text-white">WAW198M</strong>) wpisz go w wyszukiwarce w koszyku.
              </p>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="w-full py-2.5 bg-white text-[#0D0D0B] text-xs uppercase tracking-widest font-semibold hover:bg-[#EAE6DF] transition-colors"
              >
                Wróć do koszyka i wpisz kod
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
