import React, { useState, useEffect } from 'react'
import ModList from './components/ModList'
import SearchBar from './components/SearchBar'
import Statistics from './components/Statistics'
import './App.css'

interface ModInfo {
  id: string;
  title: string;
  description: string;
  creator: string;
  previewUrl: string;
  subscriptions: number;
  rating: number;
  tags: string[];
  timeCreated: string;
  timeUpdated: string;
  language?: string;
}

export type SortOption = 'updated' | 'rating' | 'subscriptions' | 'title';
export type SortDirection = 'asc' | 'desc';

function App() {
  const [mods, setMods] = useState<ModInfo[]>([]);
  const [filteredMods, setFilteredMods] = useState<ModInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMods();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [mods, searchTerm, sortBy, sortDirection, selectedLanguages, selectedTags, minRating]);

  const applyFiltersAndSort = () => {
    let filtered = [...mods];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(mod =>
        mod.title.toLowerCase().includes(term) ||
        mod.description.toLowerCase().includes(term) ||
        mod.creator.toLowerCase().includes(term)
      );
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(mod =>
        selectedLanguages.includes(mod.language || 'en')
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(mod =>
        selectedTags.some(tag => mod.tags.includes(tag))
      );
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter(mod => mod.rating >= minRating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'updated':
          comparison = new Date(a.timeUpdated).getTime() - new Date(b.timeUpdated).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'subscriptions':
          comparison = a.subscriptions - b.subscriptions;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredMods(filtered);
  };

  const fetchMods = async (search?: string) => {
    setLoading(true);
    try {
      const url = search 
        ? `/api/mods/search?q=${encodeURIComponent(search)}&limit=1000`
        : '/api/mods?limit=1000';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMods(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch mods:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/mods/stats/overview');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedLanguages([]);
    setSelectedTags([]);
    setMinRating(0);
    setSearchTerm('');
  };

  const getUniqueLanguages = () => {
    const languages = new Set(mods.map(mod => mod.language || 'en'));
    return Array.from(languages).sort();
  };

  const getUniqueTags = () => {
    const tags = new Set(mods.flatMap(mod => mod.tags));
    return Array.from(tags).sort();
  };

  const syncMods = async (fileIds: string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/mods/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileIds }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchMods();
        await fetchStats();
        alert(`Successfully synced ${data.synced} mods`);
      }
    } catch (error) {
      console.error('Failed to sync mods:', error);
      alert('Failed to sync mods');
    } finally {
      setLoading(false);
    }
  };

  const scanWorkshopFolder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mods/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchMods();
        await fetchStats();
        alert(`Scan complete: ${data.data.scanned} mods found, ${data.data.synced} synced successfully`);
      } else {
        alert('Failed to scan workshop folder');
      }
    } catch (error) {
      console.error('Failed to scan workshop folder:', error);
      alert('Failed to scan workshop folder. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🦆 Duckov Mod Manager</h1>
        <p>Manage your Escape from Duckov mods with automatic translation</p>
      </header>

      <main className="app-main">
        <div className="top-controls">
          <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
          <div className="actions">
            <button 
              onClick={scanWorkshopFolder}
              disabled={loading}
              className="btn btn-primary"
              title="Scan local workshop folder and sync with Steam Workshop"
            >
              <span className="btn-icon">📁</span>
              <span className="btn-text">Scan Workshop</span>
            </button>
            <button 
              onClick={() => fetchMods()}
              disabled={loading}
              className="btn btn-secondary"
            >
              <span className="btn-icon">🔄</span>
              <span className="btn-text">Refresh</span>
            </button>
          </div>
        </div>

        {stats && <Statistics stats={stats} />}

        <div className="filter-sort-controls">
          <button 
            className="btn btn-filter"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="btn-icon">🔍</span>
            Filters
            {(selectedLanguages.length > 0 || selectedTags.length > 0 || minRating > 0) && (
              <span className="filter-badge">
                {selectedLanguages.length + selectedTags.length + (minRating > 0 ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="sort-controls">
            <span className="sort-label">Sort by:</span>
            <button
              className={`btn-sort ${sortBy === 'updated' ? 'active' : ''}`}
              onClick={() => toggleSort('updated')}
            >
              Updated {sortBy === 'updated' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`btn-sort ${sortBy === 'rating' ? 'active' : ''}`}
              onClick={() => toggleSort('rating')}
            >
              Rating {sortBy === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`btn-sort ${sortBy === 'subscriptions' ? 'active' : ''}`}
              onClick={() => toggleSort('subscriptions')}
            >
              Subscribers {sortBy === 'subscriptions' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`btn-sort ${sortBy === 'title' ? 'active' : ''}`}
              onClick={() => toggleSort('title')}
            >
              Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          <div className="results-count">
            {filteredMods.length} of {mods.length} mods
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-section">
              <h3>Language</h3>
              <div className="filter-options">
                {getUniqueLanguages().map(lang => (
                  <label key={lang} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                    />
                    <span>{lang.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Minimum Rating</h3>
              <div className="rating-filter">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                />
                <span>{minRating > 0 ? `${minRating}+ ★` : 'Any'}</span>
              </div>
            </div>

            <div className="filter-section">
              <h3>Tags</h3>
              <div className="filter-options tag-filter">
                {getUniqueTags().slice(0, 20).map(tag => (
                  <label key={tag} className="filter-checkbox tag-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-actions">
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        )}
        
        <ModList 
          mods={filteredMods} 
          loading={loading} 
          onSync={syncMods}
        />
      </main>

      <footer className="app-footer">
        <p>Duckov Mod Manager - Built with Steam Workshop API & DeepL Translation</p>
      </footer>
    </div>
  )
}

export default App
