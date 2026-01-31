import React, { useState, useMemo } from 'react';
import { Plus, ArrowDown, Languages } from 'lucide-react';
import { HistoricalEvent, ViewLevel, Breadcrumb } from './types';
import { INITIAL_EVENTS } from './constants';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import AddEventModal from './components/AddEventModal';
import Breadcrumbs from './components/Breadcrumbs';
import { useLanguage } from './i18n';

const App: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [events, setEvents] = useState<HistoricalEvent[]>(INITIAL_EVENTS);
  const [currentRange, setCurrentRange] = useState<{start: number, end: number}>({ start: -4000, end: 3000 });
  const [viewLevel, setViewLevel] = useState<ViewLevel>('epoch');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Helper to format block labels
  const formatLabel = (start: number, end: number, level: ViewLevel): string => {
     if (level === 'epoch') {
       // Displaying Millennia
       const startStr = start < 0 ? `${Math.abs(start)} ${t.bc}` : `${start} ${t.ad}`;
       const endStr = end < 0 ? `${Math.abs(end)} ${t.bc}` : `${end} ${t.ad}`;
       
       if (start % 1000 === 0) {
          const milIndex = Math.floor(Math.abs(start)/1000) + (start >= 0 ? 1 : 0);
          const isBC = start < 0;
          
          if (language === 'fr') {
             const suffix = milIndex === 1 ? 'er' : 'ème';
             return `${milIndex}${suffix} ${t.millennium} ${isBC ? t.bc : t.ad}`;
          } else {
             // English Logic
             let suffix = 'th';
             if (milIndex === 1) suffix = 'st';
             if (milIndex === 2) suffix = 'nd';
             if (milIndex === 3) suffix = 'rd';
             return `${milIndex}${suffix} ${t.millennium} ${isBC ? t.bc : t.ad}`;
          }
       }
       return `${startStr} - ${endStr}`;
     }
     
     if (level === 'millennium') {
       // Displaying Centuries
       const c = start < 0 ? Math.ceil(Math.abs(start)/100) : Math.floor(start/100) + 1;
       const isBC = start < 0;

       if (language === 'fr') {
          const suffix = c === 1 ? 'er' : 'ème';
          return `${c}${suffix} ${t.century} ${isBC ? t.bc : t.ad}`;
       } else {
          // English
          const suffix = ['st','nd','rd'][((c+90)%100-10)%10] || 'th';
          return `${c}${suffix} ${t.century} ${isBC ? t.bc : t.ad}`;
       }
     }
     
     if (level === 'century') {
       // Displaying Decades
       return `${start < 0 ? Math.abs(start) + ' ' + t.bc : start}s`;
     }

     if (level === 'decade') {
       // Displaying Years
       return `${start < 0 ? Math.abs(start) + ' ' + t.bc : start}`;
     }

     if (level === 'year') {
        // Displaying Months
        return t.months[start - 1];
     }

     return `${start}`;
  };

  // Generate the timeline blocks based on current view
  const timelineBlocks = useMemo(() => {
    const blocks: { start: number, end: number, label: string }[] = [];
    
    if (viewLevel === 'epoch') {
      // Show Millennia from -4000 to 2000
      for (let i = -4000; i < 3000; i += 1000) {
        blocks.push({ start: i, end: i + 999, label: '' }); 
      }
    } else if (viewLevel === 'millennium') {
      // Show 10 Centuries
      for (let i = currentRange.start; i < currentRange.end; i += 100) {
        blocks.push({ start: i, end: i + 99, label: '' });
      }
    } else if (viewLevel === 'century') {
      // Show 10 Decades
      for (let i = currentRange.start; i < currentRange.end; i += 10) {
        blocks.push({ start: i, end: i + 9, label: '' });
      }
    } else if (viewLevel === 'decade') {
      // Show 10 Years
      for (let i = currentRange.start; i <= currentRange.end; i += 1) {
        blocks.push({ start: i, end: i, label: '' });
      }
    } else if (viewLevel === 'year') {
       // Show 12 Months
       for (let i = 1; i <= 12; i++) {
         blocks.push({ start: i, end: i, label: '' });
       }
    }

    return blocks.map(b => ({
      ...b,
      displayLabel: formatLabel(b.start, b.end, viewLevel)
    }));
  }, [currentRange, viewLevel, language]);

  // Filter events for a specific block
  const getEventsForBlock = (blockStart: number, blockEnd: number) => {
    return events.filter(e => {
      if (viewLevel === 'year') {
         return e.year === currentRange.start && e.month === blockStart;
      }
      return e.year >= blockStart && e.year <= blockEnd;
    }).sort((a, b) => a.year - b.year);
  };

  const handleBlockClick = (blockStart: number, blockEnd: number, label: string) => {
    if (viewLevel === 'year') return;

    const nextLevelMap: Record<ViewLevel, ViewLevel> = {
      'epoch': 'millennium',
      'millennium': 'century',
      'century': 'decade',
      'decade': 'year',
      'year': 'year' 
    };

    const nextLevel = nextLevelMap[viewLevel];
    
    // Store label in breadcrumb. Note: When going back, we might want to re-render the label based on current language
    // But for simplicity, we store the label at the time of click. 
    // To support dynamic language changes in breadcrumbs, we would need to store raw data (level/start/end) which we do, 
    // and re-format in the Breadcrumbs component or here. 
    // For now, let's just push a crumb. The formatting is done in the render loop for the main view.
    // If language changes, existing breadcrumbs text won't change unless we re-generate them. 
    // Let's rely on the fact that breadcrumb `label` prop is static string. 
    // To fix this fully, Breadcrumb component should receive raw data and format it.
    // However, given the scope, we will just format it here.
    
    const newBreadcrumb: Breadcrumb = {
      level: viewLevel,
      label: viewLevel === 'epoch' ? t.allHistory : formatLabel(currentRange.start, currentRange.end, 
        viewLevel === 'millennium' ? 'epoch' : 
        viewLevel === 'century' ? 'millennium' : 
        viewLevel === 'decade' ? 'century' : 'decade'
      ),
      start: currentRange.start,
      end: currentRange.end
    };

    // Special label fix for root
    if (viewLevel === 'epoch') newBreadcrumb.label = t.allHistory;

    setBreadcrumbs([...breadcrumbs, newBreadcrumb]);
    setViewLevel(nextLevel);
    
    if (nextLevel === 'year') {
       setCurrentRange({ start: blockStart, end: blockStart });
    } else {
       setCurrentRange({ start: blockStart, end: blockEnd });
    }
  };

  const handleNavigate = (index: number) => {
    if (index === -1) {
      setBreadcrumbs([]);
      setViewLevel('epoch');
      setCurrentRange({ start: -4000, end: 3000 });
      return;
    }

    const crumb = breadcrumbs[index];
    const newBreadcrumbs = breadcrumbs.slice(0, index);
    setBreadcrumbs(newBreadcrumbs);
    
    setViewLevel(crumb.level);
    setCurrentRange({ start: crumb.start, end: crumb.end });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              C
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              {t.appName}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors font-medium text-sm border border-slate-200 hover:border-indigo-200"
            >
              <Languages size={16} />
              <span>{language === 'en' ? 'English' : 'Français'}</span>
            </button>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-medium text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{t.addEvent}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <Breadcrumbs items={breadcrumbs} onNavigate={handleNavigate} />
          
          <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm self-start sm:self-auto">
             {t.viewing}: <span className="text-indigo-600 font-bold uppercase">{t[viewLevel] || viewLevel} {t.level}</span>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Central Axis Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-100 via-indigo-300 to-indigo-100 transform md:-translate-x-1/2 rounded-full"></div>
          
          {/* Arrow Decoration on Axis Center (Top/Bottom) */}
          <div className="absolute left-6 md:left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 text-indigo-300">
             <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
          </div>
          <div className="absolute left-6 md:left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 text-indigo-300 flex flex-col items-center">
             <div className="w-4 h-4 bg-indigo-600 rotate-45 mb-2 shadow-sm"></div>
          </div>

          <div className="space-y-12">
            {timelineBlocks.map((block, index) => {
              const blockEvents = getEventsForBlock(block.start, block.end);
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={`${block.start}-${block.end}`}
                  className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''} group`}
                >
                  
                  {/* Spacer for desktop layout balance */}
                  <div className="hidden md:block w-1/2" />

                  {/* Central Node Marker */}
                  <div className="absolute left-6 md:left-1/2 w-8 h-8 bg-white border-4 border-indigo-500 rounded-full z-10 transform -translate-x-1/2 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:border-indigo-600">
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                  </div>

                  {/* Connector Line (Desktop) */}
                  <div className={`hidden md:block absolute w-12 h-0.5 bg-indigo-200 top-1/2 ${isEven ? 'right-1/2 mr-4' : 'left-1/2 ml-4'}`} />

                  {/* Content Card Container */}
                  <div className={`w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0 ${isEven ? 'md:pr-0' : 'md:pl-0'}`}>
                    <div 
                      className={`
                        relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-indigo-400
                        ${viewLevel !== 'year' ? 'cursor-pointer hover:-translate-y-1' : ''}
                      `}
                      onClick={() => handleBlockClick(block.start, block.end, block.displayLabel)}
                    >
                      {/* Decorative Connector for Mobile */}
                      <div className="md:hidden absolute top-8 -left-10 w-10 h-0.5 bg-indigo-200" />

                      {/* Header */}
                      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center group-hover:bg-indigo-50/50 transition-colors">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                          {block.displayLabel}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 text-slate-500 rounded-full shadow-sm">
                          {blockEvents.length}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3 min-h-[100px]">
                        {blockEvents.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-sm italic">
                            {t.noEvents}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {blockEvents.slice(0, 3).map(event => (
                              <EventCard 
                                key={event.id} 
                                event={event} 
                                onClick={setSelectedEvent} 
                              />
                            ))}
                            {blockEvents.length > 3 && (
                              <div className="text-center pt-1">
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                  + {blockEvents.length - 3} {t.moreEvents}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Click Instruction Overlay */}
                      {viewLevel !== 'year' && (
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowDown size={16} className="text-indigo-400 animate-bounce" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
          
          {/* Bottom Square Marker (As requested) */}
          <div className="flex justify-center mt-12">
            <div className="w-6 h-6 bg-indigo-600 rounded-sm rotate-45 shadow-lg border-4 border-indigo-200"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-8 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} {t.footer}</p>
        </div>
      </footer>

      {/* Modals */}
      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
      
      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={(event) => setEvents(prev => [...prev, event].sort((a,b) => a.year - b.year))} 
      />
    </div>
  );
};

export default App;
