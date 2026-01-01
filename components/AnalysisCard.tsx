import React from 'react';
import { AnalysisResponse } from '../types';
import { Quote } from 'lucide-react';

interface AnalysisCardProps {
  analysis: AnalysisResponse;
  onNext: () => void;
  isCustom?: boolean;
  isCorrect?: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onNext, isCustom, isCorrect }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className={`w-full bg-white rounded-t-[30px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden border-t border-gray-100 pb-safe`}>
        
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Header Result */}
        <div className="px-6 pb-4 flex items-center justify-between">
            <div>
                {isCorrect !== undefined && (
                    <h3 className={`text-2xl font-black mb-1 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {isCorrect ? '✅ 鉴别成功' : '❌ 鉴别失败'}
                    </h3>
                )}
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Toxic Score
                </span>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg transform rotate-3 ${analysis.red_flag_score > 60 ? 'bg-red-500' : 'bg-green-500'}`}>
                {analysis.red_flag_score}
            </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {analysis.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          {/* Roast */}
          <div className="bg-gray-50 p-5 rounded-2xl relative mb-6 border border-gray-100">
            <Quote className="absolute top-4 left-4 w-6 h-6 text-gray-300 transform -scale-x-100 opacity-50" />
            <p className="text-gray-800 font-medium text-lg leading-relaxed pl-6 pt-2">
              {analysis.roast_analysis}
            </p>
          </div>

          {/* Action */}
          <button
            onClick={onNext}
            className="w-full py-4 bg-gray-900 hover:bg-black active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isCustom ? "继续分析" : "下一位"}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
};

export default AnalysisCard;
