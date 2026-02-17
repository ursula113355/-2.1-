
import React from 'react';
import { WordList } from '../types';
import { Header, Button } from './iOSComponents';

interface ListDetailViewProps {
  list: WordList;
  onBack: () => void;
  onStartStudy: () => void;
}

const ListDetailView: React.FC<ListDetailViewProps> = ({ list, onBack, onStartStudy }) => {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <Header 
        title={list.title} 
        leftAction={(
          <button onClick={onBack} className="flex items-center text-[#007AFF]">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      />

      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl p-6 ios-shadow mb-8">
          <h2 className="text-2xl font-bold mb-2">{list.title}</h2>
          <p className="text-[#8E8E93] text-sm mb-6">{list.description || 'No description provided for this collection.'}</p>
          <div className="flex items-center justify-between py-4 border-t border-[#F2F2F7]">
            <span className="text-[#8E8E93] font-medium text-sm">Total Words</span>
            <span className="font-bold text-lg">{list.words.length}</span>
          </div>
          <Button onClick={onStartStudy} className="mt-2">Review Now</Button>
        </div>

        <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest ml-1 mb-4">Vocabulary List</h3>
        <div className="bg-white rounded-2xl overflow-hidden ios-shadow divide-y divide-[#F2F2F7]">
          {list.words.map((word) => (
            <div key={word.id} className="p-4 active:bg-[#F2F2F7] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-lg">{word.word}</h4>
                <svg className="w-4 h-4 text-[#C6C6C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-[#8E8E93] line-clamp-2 leading-relaxed">{word.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListDetailView;
