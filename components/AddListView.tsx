
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
  const [words, setWords] = useState<Partial<Word>[]>([{ word: '', definition: '', id: '1' }]);
  const [batchText, setBatchText] = useState('');
  const [isTranslating, setIsTranslating] = useState<string | null>(null);

  const autoTranslate = async (word: string, id: string) => {
    if (!word.trim()) return;
    setIsTranslating(id);
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-CN`);
      const data = await response.json();
      const translation = data.responseData.translatedText;
      handleWordChange(id, 'definition', translation);
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setIsTranslating(null);
    }
  };

  const handleAddWordInput = () => {
    setWords([...words, { word: '', definition: '', id: Date.now().toString() }]);
  };

  const handleWordChange = (id: string, field: 'word' | 'definition', val: string) => {
    setWords(words.map(w => w.id === id ? { ...w, [field]: val } : w));
  };

  const parseBatchText = (): Word[] => {
    return batchText.split('\n')
      .filter(line => line.trim())
      .map((line, i) => {
        // Simple regex to split by first space or tab
        const parts = line.split(/[\s\t]+/);
        const word = parts[0] || '';
        const definition = parts.slice(1).join(' ') || 'No definition';
        return {
          id: `batch-${Date.now()}-${i}`,
          word: word.trim(),
          definition: definition.trim()
        };
      })
      .filter(w => w.word);
  };

  const finalizeListCreation = () => {
    if (!title.trim()) {
      alert('Please enter a list title');
      return;
    }

    let finalWords: Word[] = [];
    if (mode === 'single') {
      finalWords = words
        .filter(w => w.word?.trim())
        .map((w, i) => ({
          id: w.id || i.toString(),
          word: w.word!.trim(),
          definition: w.definition?.trim() || 'No definition',
        }));
    } else {
      finalWords = parseBatchText();
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
        {/* Basic Info */}
        <section>
          <div className="bg-white rounded-xl overflow-hidden divide-y divide-[#C6C6C8]/30 ios-shadow">
            <input 
              type="text" 
              placeholder="List Title (e.g. TOEFL Essential)"
              className="w-full px-4 py-4 outline-none font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Description (Optional)"
              className="w-full px-4 py-3 outline-none text-sm text-[#8E8E93]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        {/* Mode Selector */}
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
            <label className="block text-xs font-bold text-[#8E8E93] uppercase ml-1">Words</label>
            {words.map((w, idx) => (
              <div key={w.id} className="bg-white rounded-xl p-4 ios-shadow animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded">#{idx + 1}</span>
                  <button 
                    onClick={() => setWords(words.filter(word => word.id !== w.id))}
                    className="text-[#FF3B30] text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Word"
                      className="w-full text-lg font-bold outline-none border-b border-[#F2F2F7] pb-1 pr-10"
                      value={w.word}
                      onChange={(e) => handleWordChange(w.id!, 'word', e.target.value)}
                      onBlur={() => autoTranslate(w.word || '', w.id!)}
                    />
                    {isTranslating === w.id && (
                      <div className="absolute right-0 top-1">
                        <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <textarea 
                    placeholder="Definition (Autofilled on blur...)"
                    className="w-full text-sm text-[#48484A] outline-none h-12 resize-none bg-[#F9F9F9] p-2 rounded-lg"
                    value={w.definition}
                    onChange={(e) => handleWordChange(w.id!, 'definition', e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <button 
              onClick={handleAddWordInput}
              className="w-full py-4 rounded-xl border-2 border-dashed border-[#C6C6C8] text-[#8E8E93] font-medium flex items-center justify-center gap-2 active:bg-white/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another word
            </button>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="bg-white rounded-xl p-4 ios-shadow">
              <label className="block text-xs font-bold text-[#8E8E93] uppercase mb-2">Paste Content</label>
              <p className="text-[10px] text-[#8E8E93] mb-3">Format: One word per line. Use space to separate word and definition.</p>
              <textarea 
                className="w-full h-64 outline-none text-sm font-mono leading-relaxed bg-[#F9F9F9] p-3 rounded-lg"
                placeholder={`Apple 苹果\nBanana 香蕉\nCat 猫`}
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
