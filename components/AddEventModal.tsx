import React, { useState } from 'react';
import { HistoricalEvent } from '../types';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: HistoricalEvent) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<string>('');
  const [isBC, setIsBC] = useState(false);
  const [month, setMonth] = useState<string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('general');
  const [link, setLink] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !year) return;

    const yearNum = parseInt(year);
    const finalYear = isBC ? -yearNum : yearNum;

    const newEvent: HistoricalEvent = {
      id: Date.now().toString(),
      title,
      year: finalYear,
      month: month ? parseInt(month) : undefined,
      description,
      category: category as any,
      link: link || undefined
    };

    onAdd(newEvent);
    
    // Reset form
    setTitle('');
    setYear('');
    setIsBC(false);
    setMonth('');
    setDescription('');
    setCategory('general');
    setLink('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{t.addModal.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.addModal.eventTitle}</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder={t.addModal.placeholders.title}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.addModal.year}</label>
               <div className="flex">
                 <input 
                    required
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-r-0 border-slate-300 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder={t.addModal.placeholders.year}
                 />
                 <button
                    type="button"
                    onClick={() => setIsBC(!isBC)}
                    className={`px-3 py-2 border border-l-0 border-slate-300 rounded-r-md text-sm font-medium transition-colors ${isBC ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                 >
                    {isBC ? t.addModal.bcBtn : t.addModal.adBtn}
                 </button>
               </div>
            </div>
            <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.addModal.month}</label>
               <select 
                  value={month} 
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
               >
                 <option value="">{t.addModal.none}</option>
                 {t.months.map((m, i) => (
                   <option key={i+1} value={i+1}>{m}</option>
                 ))}
               </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.addModal.category}</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="general">{t.addModal.categories.general}</option>
              <option value="war">{t.addModal.categories.war}</option>
              <option value="politics">{t.addModal.categories.politics}</option>
              <option value="science">{t.addModal.categories.science}</option>
              <option value="art">{t.addModal.categories.art}</option>
              <option value="religion">{t.addModal.categories.religion}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.addModal.description}</label>
            <textarea 
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder={t.addModal.placeholders.desc}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t.addModal.referenceLink}</label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder={t.addModal.placeholders.link}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {t.addModal.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
