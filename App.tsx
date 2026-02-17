
import React, { useState, useEffect, useCallback } from 'react';
import { WordList, ReviewTask, TaskStatus, TaskType, View, AppState } from './types';
import { STORAGE_KEY, INITIAL_DATA, getTodayString, addDays, EBBINGHAUS_INTERVALS } from './constants';
import CalendarView from './components/CalendarView';
import LibraryView from './components/LibraryView';
import ListDetailView from './components/ListDetailView';
import StudyView from './components/StudyView';
import AddListView from './components/AddListView';
import { TabBar } from './components/iOSComponents';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const saveData = useCallback((newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const handleAddList = (newList: WordList) => {
    const updatedLists = [...state.wordLists, newList];
    const today = getTodayString();
    
    // Generate all 7 Ebbinghaus tasks immediately
    const scheduledTasks: ReviewTask[] = EBBINGHAUS_INTERVALS.map((interval, index) => ({
      id: `task-${Date.now()}-${index}`,
      listId: newList.id,
      scheduledDate: addDays(today, interval),
      status: TaskStatus.PENDING,
      type: index === 0 ? TaskType.STUDY : TaskType.REVIEW,
      stage: index
    }));

    saveData({ 
      wordLists: updatedLists, 
      reviewTasks: [...state.reviewTasks, ...scheduledTasks] 
    });
    setCurrentView('home');
  };

  const completeTask = (taskId: string) => {
    const taskIndex = state.reviewTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const newTasks = [...state.reviewTasks];
    newTasks[taskIndex] = { ...newTasks[taskIndex], status: TaskStatus.COMPLETED };

    saveData({ reviewTasks: newTasks });
    setCurrentView('home');
  };

  const startTask = (task: ReviewTask) => {
    setActiveTaskId(task.id);
    setSelectedListId(task.listId);
    setCurrentView('study');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <CalendarView 
                  tasks={state.reviewTasks} 
                  wordLists={state.wordLists} 
                  onStartTask={startTask}
                  onAddList={() => setCurrentView('add-list')}
               />;
      case 'library':
        return <LibraryView 
                  wordLists={state.wordLists} 
                  onAddClick={() => setCurrentView('add-list')}
                  onListClick={(id) => { setSelectedListId(id); setCurrentView('list-detail'); }}
                />;
      case 'list-detail':
        const list = state.wordLists.find(l => l.id === selectedListId);
        return list ? (
          <ListDetailView 
            list={list} 
            onBack={() => setCurrentView('library')} 
            onStartStudy={() => {
              // Find the first pending task for this list
              const pendingTask = state.reviewTasks.find(t => t.listId === list.id && t.status === TaskStatus.PENDING);
              if (pendingTask) startTask(pendingTask);
              else setCurrentView('study');
            }}
          />
        ) : null;
      case 'study':
        const studyList = state.wordLists.find(l => l.id === selectedListId);
        return studyList ? (
          <StudyView 
            list={studyList} 
            taskId={activeTaskId}
            onComplete={(tid) => tid ? completeTask(tid) : setCurrentView('home')}
            onCancel={() => setCurrentView('home')} 
          />
        ) : null;
      case 'add-list':
        return <AddListView onAdd={handleAddList} onCancel={() => setCurrentView('library')} />;
      default:
        return <CalendarView tasks={state.reviewTasks} wordLists={state.wordLists} onStartTask={startTask} onAddList={() => setCurrentView('add-list')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7]">
      <main className="flex-1 overflow-y-auto pb-24 safe-area-top">
        {renderView()}
      </main>
      
      {currentView !== 'study' && (
        <TabBar 
          activeTab={currentView === 'home' ? 'home' : 'library'} 
          onTabChange={(tab) => setCurrentView(tab)}
        />
      )}
    </div>
  );
};

export default App;
