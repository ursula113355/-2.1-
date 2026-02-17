
import React from 'react';

interface TabBarProps {
  activeTab: 'home' | 'library';
  onTabChange: (tab: 'home' | 'library') => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-blur border-t border-[#C6C6C8] safe-area-bottom h-16 flex items-center justify-around z-50">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'home' ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
        </svg>
        <span className="text-[10px] mt-1 font-medium text-center">Dashboard</span>
      </button>
      <button 
        onClick={() => onTabChange('library')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'library' ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
        </svg>
        <span className="text-[10px] mt-1 font-medium text-center">Library</span>
      </button>
    </nav>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[12px] p-4 ios-shadow active:scale-[0.98] transition-transform ${className}`}
  >
    {children}
  </div>
);

export const Header: React.FC<{ title: string; rightAction?: React.ReactNode; leftAction?: React.ReactNode }> = ({ title, rightAction, leftAction }) => (
  <header className="px-5 py-4 bg-[#F2F2F7] sticky top-0 z-40">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8">{leftAction}</div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="w-8">{rightAction}</div>
    </div>
    <div className="h-[1px] bg-[#C6C6C8] opacity-50 absolute bottom-0 left-5 right-5" />
  </header>
);

export const ListHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-5 mt-8 mb-3">
    <h2 className="text-[22px] font-bold tracking-tight">{title}</h2>
  </div>
);

export const Button: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger'; onClick?: () => void; className?: string }> = ({ children, variant = 'primary', onClick, className = '' }) => {
  const styles = {
    primary: 'bg-[#007AFF] text-white',
    secondary: 'bg-white text-[#007AFF] border border-[#007AFF]',
    danger: 'bg-[#FF3B30] text-white'
  };
  
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 rounded-[12px] font-semibold text-center w-full transition-opacity active:opacity-70 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
