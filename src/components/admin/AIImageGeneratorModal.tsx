import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  CheckCircle2,
  Camera,
  Layers,
  Image as ImageIcon,
  Check,
  RefreshCw,
} from 'lucide-react';
import { AI_GARMENT_PRESETS, generateAIProductImage, AIImageOption } from '../../services/aiImageService';

interface AIImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  category: string;
  title: string;
  fabric: string;
  color?: string;
}

export const AIImageGeneratorModal: React.FC<AIImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  category,
  title,
  fabric,
  color = 'Red',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<AIImageOption | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    promptUsed: string;
    styleName: string;
  } | null>(null);

  if (!isOpen) return null;

  // Filter presets related to this category first, then others
  const categoryPresets = AI_GARMENT_PRESETS.filter((p) => p.category === category);
  const otherPresets = AI_GARMENT_PRESETS.filter((p) => p.category !== category);
  const displayPresets = [...categoryPresets, ...otherPresets];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAIProductImage({
        category,
        title,
        fabric,
        color,
      });
      setGeneratedResult(res);
      setSelectedPreset({
        id: 'generated-now',
        url: res.imageUrl,
        title: title || 'AI Generated Commercial Garment Photo',
        category,
        fabric,
        color,
        style: res.styleName,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    const finalUrl = generatedResult?.imageUrl || selectedPreset?.url;
    if (finalUrl) {
      onSelectImage(finalUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 space-y-4 p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>AI Garment Studio & Photography Engine</span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Studio 4K
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Generate and attach professional Indian apparel commercial photography in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Details & Trigger */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Category</span>
              <span className="font-bold text-slate-800 capitalize">{category}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Fabric</span>
              <span className="font-bold text-slate-800">{fabric || 'Banarasi Silk'}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Color Shade</span>
              <span className="font-bold text-slate-800">{color || 'Festive'}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Studio Lens</span>
              <span className="font-bold text-slate-800">85mm Commercial</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between pt-1">
            <p className="text-xs text-slate-600">
              Target: <strong className="text-slate-900 font-bold">{title || 'Traditional Garment'}</strong>
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto bg-gradient-to-r from-red-700 via-red-800 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Studio Lighting & Drape...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  <span>Generate Photo with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Result Spotlight if available */}
        {generatedResult && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>AI Photo Generated Successfully</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                {generatedResult.styleName}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <img
                src={generatedResult.imageUrl}
                alt="AI Result"
                className="w-20 h-24 object-cover rounded-lg border-2 border-emerald-600 shadow-md"
              />
              <div className="text-[11px] text-slate-600 space-y-1 flex-1">
                <p className="font-mono text-[10px] bg-white p-2 rounded border border-emerald-200 text-slate-700 line-clamp-2">
                  {generatedResult.promptUsed}
                </p>
                <p className="text-emerald-800 font-bold text-[10px]">
                  ✓ High-Resolution 4K commercial drape ready for catalog.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Curated AI Catalog Presets (by category) */}
        <div>
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
            Or Choose from AI Studio Commercial Library ({displayPresets.length} Styles)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {displayPresets.map((preset) => {
              const isSelected = selectedPreset?.url === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`rounded-xl border overflow-hidden cursor-pointer transition-all flex flex-col justify-between group relative ${
                    isSelected
                      ? 'border-red-600 ring-2 ring-red-400 bg-red-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded backdrop-blur-xs">
                      {preset.category}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-[11px] text-slate-800 line-clamp-1">{preset.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{preset.style}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!selectedPreset && !generatedResult}
            className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-extrabold rounded-xl text-xs shadow-md disabled:opacity-50 cursor-pointer"
          >
            Apply Photo to Product
          </button>
        </div>
      </div>
    </div>
  );
};
