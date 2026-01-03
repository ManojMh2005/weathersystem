import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GeoLocation } from '@/types/weather';
import { searchLocations } from '@/lib/weather-api';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onLocationSelect: (location: GeoLocation) => void;
  onUseMyLocation: () => void;
  isLoadingLocation?: boolean;
}

export function SearchBar({ onLocationSelect, onUseMyLocation, isLoadingLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const locations = await searchLocations(query);
        setResults(locations);
        setShowResults(true);
        setIsSearching(false);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: GeoLocation) => {
    setQuery(location.name);
    setShowResults(false);
    onLocationSelect(location);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="pl-10 glass-card border-glass-border bg-glass"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onUseMyLocation}
          disabled={isLoadingLocation}
          className="glass-card border-glass-border bg-glass hover:bg-primary/10"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden z-50">
          {results.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              onClick={() => handleSelect(location)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-3",
                index !== results.length - 1 && "border-b border-glass-border"
              )}
            >
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">{location.name}</p>
                <p className="text-sm text-muted-foreground">{location.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
