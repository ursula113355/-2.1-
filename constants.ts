
export const EBBINGHAUS_INTERVALS = [0, 1, 2, 4, 7, 15, 30]; // Days from first study: Today, 1d, 2d, 4d, 7d, 15d, 30d

export const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const STORAGE_KEY = 'daily_words_app_data';

export const INITIAL_DATA = {
  wordLists: [
    {
      id: 'default-1',
      title: 'Common Phrases',
      description: 'Essential everyday English phrases.',
      createdAt: Date.now(),
      words: [
        { id: 'w1', word: 'Serendipity', definition: 'The occurrence of events by chance in a happy or beneficial way.', example: 'Meeting my old friend was pure serendipity.' },
        { id: 'w2', word: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'The beauty of sunset is ephemeral.' }
      ]
    }
  ],
  reviewTasks: []
};
