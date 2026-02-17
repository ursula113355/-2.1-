
import React, { useState } from 'react';
import { WordList, Word } from '../types';
import { Header, Button } from './iOSComponents';

interface AddListViewProps {
  onAdd: (list: WordList) => void;
  onCancel: () => void;
}

const AddListView: React.FC<AddListViewProps> = ({ onAdd, onCancel }) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Single mode: list of words already committed to this temporary collection
  const [tempWords, setTempWords] = useState<Word[]>([]);
  
  // Single mode: current entry form state
  const [currentWord, setCurrentWord] = useState('');
  const [currentDef, setCurrentDef] = useState('');
  
  const [batchText, setBatchText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const autoTranslate = async (word: string) => {
    if (!word.trim() || currentDef.trim()) return;
    setIsTranslating(true);
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-CN`);
      const data = await response.json();
      const translation = data.responseData.translatedText;
      setCurrentDef(translation);
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddSingleWord = () => {
    if (!currentWord.trim()) return;
    const newWord: Word = {
      id: `word-${Date.now()}`,
      word: currentWord.trim(),
      definition: currentDef.trim() || 'No definition'
    };
    setTempWords([...tempWords, newWord]);
    
    // PM Requirement: Clear only word and definition, absolutely keep the title
    setCurrentWord('');
    setCurrentDef('');
  };

  const removeWord = (id: string) => {
    setTempWords(tempWords.filter(w => w.id !== id));
  };

  const finalizeListCreation = () => {
    if (!title.trim()) {
      alert('Please enter a list title');
      return;
    }

    let finalWords: Word[] = [];
    if (mode === 'single') {
      finalWords = [...tempWords];
      // If user has typed something in the form but didn't click "Add", include it automatically
      if (currentWord.trim()) {
        finalWords.push({
          id: `word-last-${Date.now()}`,
          word: currentWord.trim(),
          definition: currentDef.trim() || 'No definition'
        });
      }
    } else {
      finalWords = batchText.split('\n')
        .filter(line => line.trim())
        .map((line, i) => {
          const parts = line.split(/[\s\t]+/);
          return {
            id: `batch-${Date.now()}-${i}`,
            word: parts[0] || '',
            definition: parts.slice(1).join(' ') || 'No definition'
          };
        })
        .filter(w => w.word);
    }

    if (finalWords.length === 0) {
      alert('Please add at least one word');
      return;
    }

    onAdd({
      id: `list-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      words: finalWords,
      createdAt: Date.now()
    });
  };

  return (
    <div className="slide-up bg-[#F2F2F7] min-h-screen pb-32">
      <Header 
        title="Create Vocabulary" 
        leftAction={<button onClick={onCancel} className="text-[#007AFF]">Cancel</button>}
        rightAction={<button onClick={finalizeListCreation} className="text-[#007AFF] font-bold">Save</button>}
      />

      <div className="px-5 mt-6 space-y-6">
        <section>
          <div className="bg-white rounded-xl overflow-hidden divide-y divide-[#C6C6C8]/30 ios-shadow">
            <input 
              id="new-list-title"
              type="text" 
              placeholder="List Title (e.g. TOEFL Essential)"
              className="w-full px-4 py-4 outline-none font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input 
              id="new-list-desc"
              type="text" 
              placeholder="Description (Optional)"
              className="w-full px-4 py-3 outline-none text-sm text-[#8E8E93]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        <div className="flex bg-[#E5E5EA] p-1 rounded-lg">
          <button 
            onClick={() => setMode('single')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'single' ? 'bg-white ios-shadow text-black' : 'text-[#8E8E93]'}`}
          >
            Single Entry
          </button>
          <button 
            onClick={() => setMode('batch')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'batch' ? 'bg-white ios-shadow text-black' : 'text-[#8E8E93]'}`}
          >
            Batch Import
          </button>
        </div>

        {mode === 'single' ? (
          <section className="space-y-4">
            <div id="wordsContainer" className="space-y-3">
              {tempWords.map((w) => (
                <div key={w.id} className="bg-white rounded-xl p-4 ios-shadow flex justify-between items-center animate-in slide-in-from-bottom-2">
                  <div>
                    <div className="text-lg font-bold">{w.word}</div>
                    <div className="text-sm text-[#8E8E93]">{w.definition}</div>
                  </div>
                  <button onClick={() => removeWord(w.id)} className="text-[#FF3B30] text-xs font-bold">Remove</button>
                </div>
              ))}

              <div className="bg-white rounded-xl p-5 ios-shadow space-y-4 border-2 border-[#007AFF]/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest">Entry Form</span>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Word"
                    className="w-full text-lg font-bold outline-none border-b border-[#F2F2F7] pb-1 pr-10"
                    value={currentWord}
                    onChange={(e) => setCurrentWord(e.target.value)}
                    onBlur={() => autoTranslate(currentWord)}
                  />
                  {isTranslating && (
                    <div className="absolute right-0 top-1">
                      <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <textarea 
                  placeholder="Definition (Autofills on blur...)"
                  className="w-full text-sm text-[#48484A] outline-none h-16 resize-none bg-[#F9F9F9] p-3 rounded-xl"
                  value={currentDef}
                  onChange={(e) => setCurrentDef(e.target.value)}
                />
                <button 
                  onClick={handleAddSingleWord}
                  className="w-full py-4 bg-[#007AFF]/10 text-[#007AFF] rounded-xl font-bold text-sm active:bg-[#007AFF]/20 transition-colors"
                >
                  + Add to Collection
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="bg-white rounded-xl p-4 ios-shadow">
              <label className="block text-xs font-bold text-[#8E8E93] uppercase mb-2">Paste Content</label>
              <textarea 
                className="w-full h-64 outline-none text-sm font-mono leading-relaxed bg-[#F9F9F9] p-3 rounded-lg"
                placeholder={`Apple 苹果\nBanana 香蕉`}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
              />
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#F2F2F7] via-[#F2F2F7] to-transparent safe-area-bottom">
        <Button onClick={finalizeListCreation}>Confirm & Create</Button>
      </div>
    </div>
  );
};

export default AddListView;
