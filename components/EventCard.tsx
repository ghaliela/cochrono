import React from 'react';
import { HistoricalEvent } from '../types';
import { BookOpen, Sword, FlaskConical, Palette, Scale, Landmark } from 'lucide-react';
import { useLanguage } from '../i18n';

interface EventCardProps {
  event: HistoricalEvent;
  onClick: (event: HistoricalEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { t } = useLanguage();

  const getIcon = (cat: string | undefined) => {
    switch (cat) {
      case 'war': return <Sword size={14} className="text-red-500" />;
      case 'science': return <FlaskConical size={14} className="text-blue-500" />;
      case 'art': return <Palette size={14} className="text-purple-500" />;
      case 'politics': return <Scale size={14} className="text-yellow-600" />;
      case 'religion': return <Landmark size={14} className="text-orange-500" />;
      default: return <BookOpen size={14} className="text-slate-500" />;
    }
  };

  const formatYear = (y: number) => {
    return y < 0 ? `${Math.abs(y)} ${t.bc}` : `${y}`;
  };

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      className="group bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 hover:scale-[1.02] transition-all cursor-pointer flex flex-col gap-1 w-full"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <span>{formatYear(event.year)}</span>
        {getIcon(event.category)}
      </div>
      <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-700 text-sm line-clamp-2">
        {event.title}
      </h4>
      <p className="text-xs text-slate-600 line-clamp-2">
        {event.description}
      </p>
    </div>
  );
};

export default EventCard;
