import React from 'react';
import { Trash2, Clock, AlertTriangle, CheckCircle, HelpCircle, History } from 'lucide-react';
import { HistoryItem, VerdictType } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete, onClearAll }) => {
  if (history.length === 0) return null;

  const getVerdictIcon = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.RED_FLAG: return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case VerdictType.GREEN_FLAG: return <CheckCircle className="w-4 h-4 text-green-500" />;
      case VerdictType.BEIGE_FLAG: return <HelpCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getVerdictColor = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.RED_FLAG: return 'bg-red-50 hover:bg-red-100 border-red-100';
      case VerdictType.GREEN_FLAG: return 'bg-green-50 hover:bg-green-100 border-green-100';
      case VerdictType.BEIGE_FLAG: return 'bg-amber-50 hover:bg-amber-100 border-amber-100';
      default: return 'bg-gray-50';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="w-full max-w-2xl mt-12 animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <History className="w-5 h-5" />
          <h3>Recent Analyses</h3>
        </div>
        <button 
          onClick={onClearAll}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              relative group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
              ${getVerdictColor(item.result.verdict)}
            `}
          >
            <div className="mt-1 shrink-0 bg-white p-2 rounded-full shadow-sm">
              {getVerdictIcon(item.result.verdict)}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-gray-900 text-sm truncate">
                  {item.result.verdict}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {formatDate(item.timestamp)}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.result.summary}
              </p>
            </div>

            <button
              onClick={(e) => onDelete(item.id, e)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white rounded-full"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
