import React, { useState, useEffect } from 'react';
import { X, Aperture, Wand2, Loader2, MapPin } from 'lucide-react';
import { Photo, AnalysisResult } from '../types';
import { analyzePhoto } from '../services/geminiService';

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset state when a new photo is opened
    setAnalysis(null);
    setIsLoading(false);
  }, [photo]);

  if (!photo) return null;

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzePhoto(photo.url);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-200/90 dark:bg-black/90 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col md:flex-row bg-white dark:bg-[#111] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl animate-fade-in-up transition-colors duration-300">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/3 h-1/2 md:h-full bg-gray-100 dark:bg-black flex items-center justify-center p-4 md:p-12 relative group transition-colors duration-300">
          <img 
            src={photo.url} 
            alt={photo.title} 
            className="max-w-full max-h-full object-contain shadow-2xl"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto p-8 border-l border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{analysis ? analysis.title : photo.title}</h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                <MapPin size={14} className="mr-1" />
                {photo.location}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:block p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 flex-grow">
            {/* AI Analysis Section */}
            {!analysis && !isLoading && (
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors duration-300">
                  Unlock detailed insights about this composition using Gemini Vision AI.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-80 transition-all group"
                >
                  <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                  Analyze with AI
                </button>
              </div>
            )}

            {isLoading && (
              <div className="p-8 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <Loader2 size={32} className="animate-spin mb-3 text-[#1F6B91]" />
                <span className="text-sm font-mono animate-pulse">Analyzing pixel data...</span>
              </div>
            )}

            {analysis && (
              <div className="animate-fade-in space-y-6">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border-l-2 border-[#70B786] transition-colors duration-300">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#70B786] mb-2">Artistic Insight</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic transition-colors duration-300">
                    "{analysis.artisticDescription}"
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border-l-2 border-[#1F6B91] transition-colors duration-300">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1F6B91] mb-2">Tech Specs (Est.)</h3>
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    <Aperture size={20} className="mt-1 flex-shrink-0" />
                    <p className="font-mono text-sm">{analysis.technicalSpecs}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 transition-colors duration-300">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Dimensions</h3>
               <p className="text-gray-900 dark:text-white font-mono transition-colors duration-300">{photo.width} × {photo.height}px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;