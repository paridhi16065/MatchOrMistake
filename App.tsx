import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import { AnalysisResult, AnalysisState, HistoryItem } from './types';
import { analyzeProfile, fileToBase64 } from './services/geminiService';
import { getHistory, saveToHistory, deleteHistoryItem, clearAllHistory } from './services/historyService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imagePreview: null,
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (state.imagePreview) {
        URL.revokeObjectURL(state.imagePreview);
      }
    };
  }, [state.imagePreview]);

  const handleImageSelect = useCallback(async (file: File) => {
    // Revoke previous URL if it exists
    setState(prev => {
      if (prev.imagePreview) URL.revokeObjectURL(prev.imagePreview);
      return { ...prev, isLoading: true, error: null, result: null };
    });
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setState(prev => ({ ...prev, imagePreview: objectUrl }));

    try {
      const base64 = await fileToBase64(file);
      const result = await analyzeProfile(base64, file.type);
      
      // Save to history
      const updatedHistory = saveToHistory(result);
      setHistory(updatedHistory);

      setState(prev => ({
        ...prev,
        isLoading: false,
        result: result
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Oops! I couldn't read that profile clearly. Try a clearer screenshot.",
        imagePreview: null 
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setState(prev => {
      if (prev.imagePreview) URL.revokeObjectURL(prev.imagePreview);
      return {
        isLoading: false,
        error: null,
        result: null,
        imagePreview: null,
      };
    });
  }, []);

  const handleHistorySelect = (item: HistoryItem) => {
    // When selecting history, we lose the image preview because we don't store it
    // But we have the full text result
    setState(prev => {
      if (prev.imagePreview) URL.revokeObjectURL(prev.imagePreview);
      return {
        isLoading: false,
        error: null,
        result: item.result,
        imagePreview: null // History items don't have images stored for privacy/storage reasons
      };
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistoryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire history?")) {
      clearAllHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8 max-w-4xl mx-auto w-full">
        
        {/* Intro Text - Only show if no result is displayed */}
        {!state.result && !state.isLoading && (
          <div className="text-center mb-10 mt-6 max-w-xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Is it a match or a mistake?
            </h2>
            <p className="text-gray-600 text-lg">
              Upload a screenshot of a dating profile and I'll tell you the honest truth about their vibes.
            </p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 mb-6 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Analysis Failed</p>
              <p className="text-sm opacity-90">{state.error}</p>
              <button 
                onClick={handleReset}
                className="text-sm underline mt-2 hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            {state.imagePreview && (
                 <div className="relative mb-8 w-48 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                    <img src={state.imagePreview} alt="Analyzing" className="w-full h-full object-cover blur-sm" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                         <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </div>
                 </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Vibes...</h3>
            <p className="text-gray-500 animate-pulse">Reading between the lines...</p>
          </div>
        )}

        {/* Initial Upload State */}
        {!state.result && !state.isLoading && (
          <>
            <ImageUpload onImageSelect={handleImageSelect} isLoading={state.isLoading} />
            
            <HistoryList 
              history={history} 
              onSelect={handleHistorySelect} 
              onDelete={handleHistoryDelete}
              onClearAll={handleClearAllHistory}
            />
          </>
        )}

        {/* Result State */}
        {state.result && (
          <ResultCard 
            result={state.result} 
            imagePreview={state.imagePreview}
            onReset={handleReset} 
          />
        )}

      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} VibeCheck. AI can make mistakes. Trust your gut.</p>
      </footer>
    </div>
  );
};

export default App;
