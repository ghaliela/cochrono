import React from 'react';
import { HistoricalEvent } from '../types';
import { X, ExternalLink, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n';

interface EventModalProps {
  event: HistoricalEvent | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { t, language } = useLanguage();

  if (!event) return null;

  const formatFullDate = (e: HistoricalEvent) => {
    const y = e.year < 0 ? `${Math.abs(e.year)} ${t.bc}` : `${e.year} ${t.ad}`;
    const m = e.month ? t.months[e.month - 1] : '';
    const d = e.day ? e.day : '';
    // French date format day first
    if (language === 'fr') {
        return `${d} ${m} ${y}`.trim();
    }
    return `${m} ${d} ${y}`.trim();
  };

  const getEraLabel = (year: number) => {
    if (year < 500) return t.modal.ancientEra;
    if (year < 1500) return t.modal.medievalPeriod;
    return t.modal.modernEra;
  };

  const getCategoryLabel = (cat: string | undefined) => {
      // @ts-ignore
      return t.addModal.categories[cat] || cat || 'General';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Header Image Placeholder */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-1">
               <Calendar size={16} />
               {formatFullDate(event)}
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{event.title}</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              {event.description}
            </p>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
               <strong>{t.modal.historicalContext}:</strong> {t.modal.contextText(getEraLabel(event.year), getCategoryLabel(event.category))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium transition-colors"
            >
              {t.modal.close}
            </button>
            {event.link && (
              <a 
                href={event.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors shadow-sm"
              >
                {t.modal.readArticle} <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
