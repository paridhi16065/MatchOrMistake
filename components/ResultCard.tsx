import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, Flame, Snowflake, RefreshCw, ImageOff } from 'lucide-react';
import { AnalysisResult, VerdictType } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  imagePreview: string | null;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, imagePreview, onReset }) => {
  const getVerdictColor = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.RED_FLAG: return 'text-red-600 bg-red-50 border-red-200';
      case VerdictType.GREEN_FLAG: return 'text-green-600 bg-green-50 border-green-200';
      case VerdictType.BEIGE_FLAG: return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getVerdictIcon = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.RED_FLAG: return <AlertTriangle className="w-8 h-8" />;
      case VerdictType.GREEN_FLAG: return <CheckCircle className="w-8 h-8" />;
      case VerdictType.BEIGE_FLAG: return <HelpCircle className="w-8 h-8" />;
    }
  };

  const verdictStyles = getVerdictColor(result.verdict);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Main Verdict Card */}
      <div className={`rounded-3xl border-2 p-6 ${verdictStyles} relative overflow-hidden shadow-sm`}>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Final Verdict</div>
            <h2 className="text-3xl font-extrabold">{result.verdict}</h2>
          </div>
          <div className="p-3 bg-white bg-opacity-50 rounded-2xl backdrop-blur-sm">
            {getVerdictIcon(result.verdict)}
          </div>
        </div>
        
        <div className="mt-6 flex items-end gap-2">
          <span className="text-6xl font-black tracking-tighter">{result.score}</span>
          <span className="text-lg font-medium mb-3 opacity-70">/100</span>
        </div>
        
        <p className="mt-2 text-lg font-medium opacity-90 leading-snug">
          "{result.summary}"
        </p>

        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
           {getVerdictIcon(result.verdict)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Red Flags Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <Flame className="w-5 h-5" />
            <h3 className="font-bold">Red Flags</h3>
          </div>
          {result.redFlags.length > 0 ? (
            <ul className="space-y-3">
              {result.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-red-400 mt-0.5">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-gray-400 text-sm italic">No major red flags detected. Nice!</p>
          )}
        </div>

        {/* Green Flags Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <Snowflake className="w-5 h-5" />
            <h3 className="font-bold">Green Flags</h3>
          </div>
           {result.greenFlags.length > 0 ? (
            <ul className="space-y-3">
              {result.greenFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-green-400 mt-0.5">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">Nothing stood out positively.</p>
          )}
        </div>
      </div>

      {/* Wise Friend Analysis */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm relative">
        <div className="absolute top-0 left-6 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          Wise Friend Says
        </div>
        <p className="text-gray-800 leading-relaxed italic mt-2">
          {result.detailedAnalysis}
        </p>
      </div>

      {/* Image Preview Thumb */}
      <div className="flex justify-center">
        {imagePreview ? (
            <div className="relative group">
                <img 
                    src={imagePreview} 
                    alt="Analyzed Profile" 
                    className="h-24 w-auto rounded-lg border border-gray-200 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity"
                />
            </div>
        ) : (
            <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                <ImageOff className="w-4 h-4" />
                <span>Image not stored in history</span>
            </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all transform hover:-translate-y-0.5"
        >
          <RefreshCw className="w-4 h-4" />
          Check Another Profile
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
