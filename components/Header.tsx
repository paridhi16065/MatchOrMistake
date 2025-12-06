import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <ShieldCheck className="w-4 h-4 text-white absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">VibeCheck</h1>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Your AI Wingman
        </div>
      </div>
    </header>
  );
};

export default Header;
