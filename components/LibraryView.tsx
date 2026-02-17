
import React from 'react';
import { WordList } from '../types';
import { Card, ListHeader } from './iOSComponents';

interface LibraryViewProps {
  wordLists: WordList[];
  onAddClick: () => void;
  onListClick: (id: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ wordLists, onAddClick, onListClick }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[#8E8E93] font-semibold uppercase text-xs tracking-wider mb-1">Vault</h3>
          <h1 className="text-4xl font-extrabold tracking-tight">Library</h1>
        </div>
        <button 
          onClick={onAddClick}
          className="w-10 h-10 bg-[#007AFF] text-white rounded-full flex items-center justify-center ios-shadow active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <ListHeader title="Your Collections" />
      <div className="px-5 space-y-4">
        {wordLists.length > 0 ? (
          wordLists.map(list => (
            <Card key={list.id} onClick={() => onListClick(list.id)} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-1">{list.title}</h4>
              <p className="text-[#8E8E93] text-sm line-clamp-1 mb-3">{list.description || 'No description'}</p>
              <div className="flex items-center">
                <span className="bg-[#F2F2F7] text-[#8E8E93] px-2 py-1 rounded text-[10px] font-bold uppercase mr-2">
                  {list.words.length} Words
                </span>
                <span className="text-[#8E8E93] text-[10px] font-medium">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-[#8E8E93]">No word lists yet.</p>
            <button onClick={onAddClick} className="text-[#007AFF] font-bold mt-2">Create your first list</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
