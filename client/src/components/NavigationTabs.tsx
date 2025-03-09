import { CloudSun, AlertTriangle, LineChart, Info } from 'lucide-react';

export type TabType = 'weather' | 'hazards' | 'trends' | 'references';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md text-white pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <nav className="flex space-x-1 sm:space-x-2">
          <button 
            className={`flex-1 py-3 px-1 sm:px-4 rounded-t-lg font-medium transition-colors flex flex-col sm:flex-row items-center justify-center
              ${activeTab === 'weather' 
                ? 'bg-white text-primary font-semibold' 
                : 'hover:bg-white/10'}`}
            onClick={() => onTabChange('weather')}
          >
            <CloudSun className="h-5 w-5 sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-xs sm:text-base">Weather</span>
          </button>
          
          <button 
            className={`flex-1 py-3 px-1 sm:px-4 rounded-t-lg font-medium transition-colors flex flex-col sm:flex-row items-center justify-center
              ${activeTab === 'hazards' 
                ? 'bg-white text-primary font-semibold' 
                : 'hover:bg-white/10'}`}
            onClick={() => onTabChange('hazards')}
          >
            <AlertTriangle className="h-5 w-5 sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-xs sm:text-base">Hazards</span>
          </button>
          
          <button 
            className={`flex-1 py-3 px-1 sm:px-4 rounded-t-lg font-medium transition-colors flex flex-col sm:flex-row items-center justify-center
              ${activeTab === 'trends' 
                ? 'bg-white text-primary font-semibold' 
                : 'hover:bg-white/10'}`}
            onClick={() => onTabChange('trends')}
          >
            <LineChart className="h-5 w-5 sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-xs sm:text-base">Trends</span>
          </button>
          
          <button 
            className={`flex-1 py-3 px-1 sm:px-4 rounded-t-lg font-medium transition-colors flex flex-col sm:flex-row items-center justify-center
              ${activeTab === 'references' 
                ? 'bg-white text-primary font-semibold' 
                : 'hover:bg-white/10'}`}
            onClick={() => onTabChange('references')}
          >
            <Info className="h-5 w-5 sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-xs sm:text-base">References</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default NavigationTabs;
