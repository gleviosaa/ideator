'use client'

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Describe your app idea or enter comma-separated tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-4 py-6 text-base"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full mt-4"
        size="lg"
        disabled={loading || !query.trim()}
      >
        {loading ? 'Searching...' : 'Search for Ideas'}
      </Button>
    </form>
  );
}
