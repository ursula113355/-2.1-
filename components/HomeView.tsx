
import React, { useMemo } from 'react';
import { ReviewTask, WordList, TaskStatus, TaskType } from '../types';
import { getTodayString } from '../constants';
import { Card, ListHeader } from './iOSComponents';

interface HomeViewProps {
  tasks: ReviewTask[];
  wordLists: WordList[];
  onStartTask: (task: ReviewTask) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ tasks, wordLists, onStartTask }) => {
  const today = getTodayString();
  
  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.scheduledDate <= today && t.status === TaskStatus.PENDING);
  }, [tasks, today]);

  const stats = useMemo(() => {
    const studyCount = todayTasks.filter(t => t.type === TaskType.STUDY).length;
    const reviewCount = todayTasks.filter(t => t.type === TaskType.REVIEW).length;
    const completedToday = tasks.filter(t => t.scheduledDate === today && t.status === TaskStatus.COMPLETED).length;
    return { studyCount, reviewCount, completedToday };
  }, [todayTasks, tasks, today]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="px-5 pt-10 pb-4">
        <h3 className="text-[#8E8E93] font-semibold uppercase text-xs tracking-wider mb-1">Today</h3>
        <h1 className="text-4xl font-extrabold tracking-tight">Overview</h1>
      </div>

      <div className="px-5 grid grid-cols-2 gap-4 mb-8">
        <Card className="flex flex-col items-start bg-white border-l-4 border-[#007AFF]">
          <span className="text-2xl font-bold text-[#007AFF]">{stats.studyCount}</span>
          <span className="text-[#8E8E93] text-sm font-medium">To Study</span>
        </Card>
        <Card className="flex flex-col items-start bg-white border-l-4 border-[#34C759]">
          <span className="text-2xl font-bold text-[#34C759]">{stats.reviewCount}</span>
          <span className="text-[#8E8E93] text-sm font-medium">To Review</span>
        </Card>
      </div>

      <ListHeader title="Daily Missions" />
      <div className="px-5 space-y-3">
        {todayTasks.length > 0 ? (
          todayTasks.map(task => {
            const list = wordLists.find(l => l.id === task.listId);
            if (!list) return null;
            return (
              <Card 
                key={task.id} 
                onClick={() => onStartTask(task)}
                className="flex items-center justify-between py-5"
              >
                <div>
                  <h4 className="font-bold text-lg">{list.title}</h4>
                  <p className="text-[#8E8E93] text-sm">
                    {task.type === TaskType.STUDY ? '🔥 Initial Session' : `🔁 Stage ${task.stage} Review`}
                  </p>
                </div>
                <div className="bg-[#F2F2F7] rounded-full p-2">
                  <svg className="w-5 h-5 text-[#007AFF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 ios-shadow">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold">All caught up!</h3>
            <p className="text-[#8E8E93] max-w-[240px] mt-2">
              You've completed all tasks for today. Great job on maintaining the streak!
            </p>
          </div>
        )}
      </div>

      {stats.completedToday > 0 && (
        <div className="px-5 mt-10">
          <div className="bg-[#34C759]/10 p-4 rounded-[12px] flex items-center">
            <div className="w-8 h-8 bg-[#34C759] rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#34C759]">Mission Accomplished</p>
              <p className="text-[#34C759]/80 text-xs">You finished {stats.completedToday} task(s) today.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
