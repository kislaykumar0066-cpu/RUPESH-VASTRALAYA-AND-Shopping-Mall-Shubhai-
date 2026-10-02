import React from 'react';
import {
  Sparkles,
  Flame,
  Shirt,
  User,
  Layers,
  Tag,
  Scissors,
  Smile,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../lib/constants';

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Flame,
  Shirt,
  User,
  Layers,
  Tag,
  Scissors,
  Smile,
  Package,
};

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory, language } = useStore();

  return (
    <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon ? ICON_MAP[cat.icon] || Package : Package;

            let label = cat.name;
            if (language === 'hi' && cat.hi) label = cat.hi;
            if (language === 'hinglish' && cat.hinglish) label = cat.hinglish;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-sm ring-2 ring-red-400/50'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.id !== 'all' && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
