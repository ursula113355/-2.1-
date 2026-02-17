
import React, { useState, useMemo } from 'react';
import { ReviewTask, WordList, TaskStatus, TaskType } from '../types';
import { getTodayString } from '../constants';

interface CalendarViewProps {
  tasks: ReviewTask[];
  wordLists: WordList[];
  onStartTask: (task: ReviewTask) => void;
  onAddList: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, wordLists, onStartTask, onAddList }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayStr = getTodayString();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    // Padding for previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const date = new Date(year, month - 1, d);
      days.push({ date: date.toISOString().split('T')[0], day: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date: date.toISOString().split('T')[0], day: i, isCurrentMonth: true });
    }

    // Padding for next month to reach 42 cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date: date.toISOString().split('T')[0], day: i, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const getDayStats = (dateStr: string) => {
    const dayTasks = tasks.filter(t => t.scheduledDate === dateStr);
    const isOverdue = tasks.some(t => t.scheduledDate < todayStr && t.status === TaskStatus.PENDING && dateStr === todayStr);
    
    return {
      pendingReview: dayTasks.filter(t => t.status === TaskStatus.PENDING && t.type === TaskType.REVIEW).length + (dateStr === todayStr ? tasks.filter(t => t.scheduledDate < todayStr && t.status === TaskStatus.PENDING).length : 0),
      newStudy: dayTasks.filter(t => t.status === TaskStatus.PENDING && t.type === TaskType.STUDY).length,
      completed: dayTasks.filter(t => t.status === TaskStatus.COMPLETED).length
    };
  };

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const handleGoToday = () => setViewDate(new Date());

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return [];
    // Include overdue tasks only if today is selected
    const isToday = selectedDay === todayStr;
    return tasks.filter(t => t.scheduledDate === selectedDay || (isToday && t.scheduledDate < todayStr && t.status === TaskStatus.PENDING));
  }, [selectedDay, tasks, todayStr]);

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] animate-in fade-in duration-300">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 bg-[#F2F2F7] sticky top-0 z-40 border-b border-[#C6C6C8]/30">
        <div className="flex items-center justify-between">
          <button onClick={handlePrevMonth} className="p-2 -ml-2 text-[#007AFF]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <button onClick={handleGoToday} className="flex flex-col items-center">
            <span className="text-lg font-bold text-black">{year}年{month + 1}月</span>
            {year === new Date().getFullYear() && month === new Date().getMonth() ? null : (
              <span className="text-[10px] text-[#007AFF] font-bold uppercase tracking-widest">Back to Today</span>
            )}
          </button>

          <div className="flex items-center">
            <button onClick={handleNextMonth} className="p-2 text-[#007AFF]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
            <button onClick={onAddList} className="ml-2 p-2 text-[#007AFF]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Weekdays */}
      <div className="grid grid-cols-7 px-2 mt-4 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <span key={d} className="text-[10px] font-bold text-[#8E8E93] uppercase mb-2">{d}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#C6C6C8]/30 border-t border-b border-[#C6C6C8]/30 mx-2 rounded-xl overflow-hidden ios-shadow bg-white">
        {calendarDays.map((item, idx) => {
          const stats = getDayStats(item.date);
          const isToday = item.date === todayStr;
          
          return (
            <div 
              key={idx}
              onClick={() => setSelectedDay(item.date)}
              className={`aspect-square relative p-1 flex flex-col items-center justify-start transition-colors active:bg-[#F2F2F7] ${item.isCurrentMonth ? 'bg-white' : 'bg-[#F9F9F9]'}`}
            >
              <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full mt-1 ${isToday ? 'bg-[#007AFF] text-white font-bold' : item.isCurrentMonth ? 'text-black' : 'text-[#C6C6C8]'}`}>
                {item.day}
              </span>
              
              <div className="mt-auto mb-1 w-full flex flex-col items-center gap-0.5">
                {stats.pendingReview > 0 && (
                  <div className="flex items-center text-[8px] font-bold text-[#FF3B30] leading-tight">
                    <div className="w-1 h-1 rounded-full bg-[#FF3B30] mr-0.5" />
                    {stats.pendingReview}
                  </div>
                )}
                {stats.newStudy > 0 && (
                  <div className="flex items-center text-[8px] font-bold text-[#007AFF] leading-tight">
                    <div className="w-1 h-1 rounded-full bg-[#007AFF] mr-0.5" />
                    {stats.newStudy}
                  </div>
                )}
                {stats.completed > 0 && (
                  <div className="flex items-center text-[8px] font-bold text-[#34C759] leading-tight">
                    <svg className="w-2 h-2 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {stats.completed}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 flex justify-between">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF3B30]" /><span className="text-[10px] text-[#8E8E93] font-bold uppercase">Review</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#007AFF]" /><span className="text-[10px] text-[#8E8E93] font-bold uppercase">Study</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#34C759]" /><span className="text-[10px] text-[#8E8E93] font-bold uppercase">Done</span></div>
      </div>

      {/* Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/30 animate-in fade-in duration-300" onClick={() => setSelectedDay(null)} />
          <div className="relative w-full bg-[#F2F2F7] rounded-t-[20px] ios-shadow slide-up safe-area-bottom max-h-[70vh] flex flex-col">
            <div className="w-10 h-1.5 bg-[#C6C6C8] rounded-full mx-auto mt-3 mb-2" />
            <div className="px-5 py-2 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedDay === todayStr ? 'Today\'s' : selectedDay} Tasks</h2>
              <button onClick={() => setSelectedDay(null)} className="text-[#007AFF] font-medium text-sm">Close</button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-10">
              {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map(task => {
                  const list = wordLists.find(l => l.id === task.listId);
                  return (
                    <div key={task.id} className="bg-white rounded-xl p-4 flex items-center justify-between ios-shadow">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${task.status === TaskStatus.COMPLETED ? 'bg-[#34C759]/10 text-[#34C759]' : task.type === TaskType.STUDY ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-[#FF3B30]/10 text-[#FF3B30]'}`}>
                            {task.status === TaskStatus.COMPLETED ? 'Completed' : task.type === TaskType.STUDY ? 'New Study' : 'Review'}
                          </span>
                          {task.scheduledDate < todayStr && task.status === TaskStatus.PENDING && (
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">Overdue</span>
                          )}
                        </div>
                        <h4 className="font-bold text-lg">{list?.title || 'Unknown List'}</h4>
                        <p className="text-xs text-[#8E8E93]">Stage {task.stage} • {list?.words.length} Words</p>
                      </div>
                      
                      {task.status === TaskStatus.PENDING && (
                        <button 
                          onClick={() => { setSelectedDay(null); onStartTask(task); }}
                          className="bg-[#007AFF] text-white px-4 py-2 rounded-full text-sm font-bold active:opacity-70 transition-opacity"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 opacity-50">
                  <p className="text-sm font-medium">No tasks for this day.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
