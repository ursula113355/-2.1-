
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { WordList, Word } from '../types';

interface StudyViewProps {
  list: WordList;
  taskId: string | null;
  onComplete: (taskId: string | null) => void;
  onCancel: () => void;
}

const StudyView: React.FC<StudyViewProps> = ({ list, taskId, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flyDirection, setFlyDirection] = useState<'left' | 'right' | null>(null);
  const [showWordFirst, setShowWordFirst] = useState(true);
  const [autoTTS, setAutoTTS] = useState(true);

  const currentWord = useMemo(() => list.words[currentIndex], [list, currentIndex]);
  const progress = ((currentIndex + 1) / list.words.length) * 100;

  // TTS Helper
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Handle TTS trigger on word change
  useEffect(() => {
    if (autoTTS && currentWord && !isFlipped && showWordFirst) {
      speak(currentWord.word);
    }
  }, [currentIndex, autoTTS, showWordFirst, currentWord, speak]);

  const handleAction = (known: boolean) => {
    if (flyDirection) return; // Prevent double clicks during animation

    setFlyDirection(known ? 'right' : 'left');

    setTimeout(() => {
      if (currentIndex < list.words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setFlyDirection(null);
      } else {
        onComplete(taskId);
      }
    }, 400); // Wait for fly-out animation
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    // If we flipped to show the word, pronounce it
    if (!isFlipped === !showWordFirst && autoTTS) {
      speak(currentWord.word);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col safe-area-top safe-area-bottom overflow-hidden">
      {/* Top Navbar */}
      <div className="px-5 py-3 flex items-center justify-between ios-blur border-b border-[#C6C6C8]/20">
        <button onClick={onCancel} className="text-[#007AFF] font-medium text-lg">Exit</button>
        <div className="flex-1 px-8">
          <div className="h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#34C759] transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-bold text-[#8E8E93] tabular-nums">
          {currentIndex + 1}/{list.words.length}
        </span>
      </div>

      {/* Settings Row */}
      <div className="px-5 py-2 flex items-center justify-center gap-4 bg-white/50">
        <button 
          onClick={() => setAutoTTS(!autoTTS)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${autoTTS ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-[#C6C6C8]/20 text-[#8E8E93]'}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Auto Voice
        </button>
        <button 
          onClick={() => setShowWordFirst(!showWordFirst)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5E5EA] text-[#48484A] text-[10px] font-bold uppercase tracking-wider"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {showWordFirst ? 'Word First' : 'Def First'}
        </button>
      </div>

      {/* 3D Card Area */}
      <div className="flex-1 flex items-center justify-center p-6 perspective-1000">
        <div 
          className={`relative w-full max-w-[360px] aspect-[4/5] preserve-3d transition-all duration-500 ease-in-out
            ${isFlipped ? 'rotate-y-180' : ''}
            ${flyDirection === 'right' ? 'translate-x-[150%] rotate-12 opacity-0' : flyDirection === 'left' ? '-translate-x-[150%] -rotate-12 opacity-0' : 'translate-x-0 rotate-0 opacity-100'}
          `}
          onClick={toggleFlip}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-white rounded-[32px] ios-shadow flex flex-col items-center justify-center p-10 text-center backface-hidden border border-[#C6C6C8]/20">
            <div className="mb-4 text-[#C6C6C8] font-black tracking-widest text-[10px] uppercase">
              {showWordFirst ? 'Vocabulary' : 'Definition'}
            </div>
            <h2 className={`font-extrabold tracking-tight leading-tight ${showWordFirst ? 'text-4xl' : 'text-xl'}`}>
              {showWordFirst ? currentWord.word : currentWord.definition}
            </h2>
            <div className="mt-12 animate-bounce">
              <svg className="w-6 h-6 text-[#C6C6C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-[10px] text-[#8E8E93] font-bold mt-4 uppercase tracking-widest">Tap to flip</p>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 bg-white rounded-[32px] ios-shadow flex flex-col items-center justify-center p-10 text-center backface-hidden border border-[#C6C6C8]/20 rotate-y-180">
            <div className="mb-4 text-[#C6C6C8] font-black tracking-widest text-[10px] uppercase">
              {showWordFirst ? 'Definition' : 'Vocabulary'}
            </div>
            <h2 className={`font-extrabold tracking-tight leading-tight mb-6 ${showWordFirst ? 'text-xl' : 'text-4xl'}`}>
              {showWordFirst ? currentWord.definition : currentWord.word}
            </h2>
            {!showWordFirst && autoTTS && (
              <button 
                onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}
                className="w-10 h-10 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center mb-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              </button>
            )}
            {currentWord.example && (
              <div className="mt-4 p-4 bg-[#F2F2F7] rounded-2xl w-full">
                <p className="text-sm italic text-[#48484A]">"{currentWord.example}"</p>
              </div>
            )}
            <p className="text-[10px] text-[#8E8E93] font-bold mt-8 uppercase tracking-widest">Keep learning</p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-8 pb-12 pt-6 safe-area-bottom flex items-center justify-around gap-8">
        <button 
          onClick={() => handleAction(false)}
          className="w-20 h-20 rounded-full bg-white ios-shadow flex items-center justify-center text-[#FF3B30] active:scale-90 active:bg-red-50 transition-all border-4 border-[#FF3B30]/10"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button 
          onClick={() => handleAction(true)}
          className="w-24 h-24 rounded-full bg-[#34C759] ios-shadow flex items-center justify-center text-white active:scale-90 active:brightness-90 transition-all shadow-[0_10px_20px_rgba(52,199,89,0.3)]"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StudyView;
