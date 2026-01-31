import React from 'react';
import { Breadcrumb } from '../types';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../i18n';

interface BreadcrumbsProps {
  items: Breadcrumb[];
  onNavigate: (index: number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 w-fit">
      <button 
        onClick={() => onNavigate(-1)}
        className="hover:text-indigo-600 transition-colors flex items-center"
        aria-label={t.allHistory}
      >
        <Home size={16} />
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-slate-400" />
          <button 
            onClick={() => onNavigate(index)}
            className={`transition-colors font-medium hover:text-indigo-600 ${
              index === items.length - 1 ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
