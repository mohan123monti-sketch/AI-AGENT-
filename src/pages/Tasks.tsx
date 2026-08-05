import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, Clock, CheckSquare, Hourglass, 
  Search, Filter, Plus, MoreHorizontal, MoreVertical, X, Check, 
  Trash2, Edit2, Sparkles, Tag, ChevronDown, User
} from 'lucide-react';
import { tasksApi } from '../lib/api';

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string; // e.g. "May 24, 2025"
  priority: TaskPriority;
  status: TaskStatus;
  isCarriedForward?: boolean;
  isToday?: boolean;
  notes?: string;
  subtasks?: Subtask[];
  assigneeAvatar?: string;
}

const TASKS_STORAGE_KEY = 'planai_user_tasks';

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<string>('today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Persist tasks locally
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Load tasks from the workflow on mount if available
  useEffect(() => {
    const loadTasks = async () => {
      const res = await tasksApi.fetchTasks();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setTasks(res.data as TaskItem[]);
      }
    };
    loadTasks();
  }, []);

  // Modals
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<TaskItem>>({
    title: '',
    description: '',
    category: 'Marketing',
    dueDate: 'May 24, 2025',
    priority: 'High',
    status: 'To Do'
  });

  // Calculate Metrics
  const totalTasks = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'To Do').length;

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

    if (activeTab === 'today') return matchesSearch && matchesCategory && (t.isToday || t.dueDate.toLowerCase().includes('today') || (!t.isCarriedForward && t.status !== 'Completed'));
    if (activeTab === 'carry') return matchesSearch && matchesCategory && t.isCarriedForward;
    if (activeTab === 'upcoming') return matchesSearch && matchesCategory && !t.isToday && !t.isCarriedForward && t.status !== 'Completed';
    if (activeTab === 'completed') return matchesSearch && matchesCategory && t.status === 'Completed';

    return matchesSearch && matchesCategory;
  });

  // Toggle Task Completion
  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: TaskStatus = t.status === 'Completed' ? 'To Do' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Open Add Task Modal
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      category: 'Marketing',
      dueDate: 'May 24, 2025',
      priority: 'High',
      status: 'To Do'
    });
    setIsNewTaskModalOpen(true);
  };

  // Open Edit Task Modal
  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setFormData({ ...task });
    setActiveMenuTaskId(null);
    setIsNewTaskModalOpen(true);
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id)); // optimistic
    setActiveMenuTaskId(null);
    await tasksApi.deleteTask(id); // best-effort sync
  };

  // Save Task
  const handleSaveTask = async () => {
    if (!formData.title?.trim()) return;

    let taskToSave: TaskItem;
    if (editingTask) {
      taskToSave = { ...editingTask, ...formData } as TaskItem;
      setTasks(prev => prev.map(t => t.id === editingTask.id ? taskToSave : t));
    } else {
      taskToSave = {
        id: `task-${Date.now()}`,
        title: formData.title || 'Untitled Task',
        description: formData.description || '',
        category: formData.category || 'Marketing',
        dueDate: formData.dueDate || 'May 24, 2025',
        priority: formData.priority || 'Medium',
        status: formData.status || 'To Do',
        assigneeAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${Date.now()}`
      };
      setTasks(prev => [taskToSave, ...prev]);
    }
    setIsNewTaskModalOpen(false);
    // Best-effort sync to backend
    await tasksApi.upsertTask(taskToSave as unknown as Record<string, unknown>);
  };

  // Color helper for priorities
  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Low':
      default:
        return 'bg-purple-50 text-purple-600 border-purple-100';
    }
  };

  // Color helper for category pills
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Finance':
        return 'bg-purple-50 text-purple-700';
      case 'Marketing':
        return 'bg-indigo-50 text-indigo-700';
      case 'Sales':
        return 'bg-[#FFF3E8] text-[#FF7A00]';
      case 'Business':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 select-none">
      {/* 1. Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Tasks
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Stay organized and manage your tasks efficiently
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E56E00] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* 2. Top Metric Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EEFF] text-[#7B3FF2] flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Total Tasks</span>
              <span className="text-2xl font-bold text-gray-900 leading-tight block mt-0.5">{totalTasks}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">All tasks created</span>
            </div>
          </div>
          <button className="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">In Progress</span>
              <span className="text-2xl font-bold text-gray-900 leading-tight block mt-0.5">{inProgressCount}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">Tasks in progress</span>
            </div>
          </div>
          <button className="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Completed</span>
              <span className="text-2xl font-bold text-gray-900 leading-tight block mt-0.5">{completedCount}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">Tasks completed</span>
            </div>
          </div>
          <button className="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between relative group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
              <Hourglass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Pending</span>
              <span className="text-2xl font-bold text-gray-900 leading-tight block mt-0.5">{pendingCount}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">Tasks pending</span>
            </div>
          </div>
          <button className="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Navigation Tabs & Search/Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Left Tabs Bar */}
        <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'today', label: "Today's Tasks" },
            { id: 'carry', label: 'Carry Forward' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-medium transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === tab.id
                  ? 'text-[#7B3FF2] font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTaskTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B3FF2] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right Search & Filter */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#7B3FF2] shadow-xs"
            />
          </div>

          {/* Filter Button Icon */}
          <div className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 shadow-xs">
            <Filter className="w-4 h-4" />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-gray-700 shadow-xs focus:outline-none focus:border-[#7B3FF2] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Main Tasks Grid View */}
      <div className="bg-[#F8F9FC]/60 p-6 rounded-3xl border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
          <h3 className="font-bold text-sm text-gray-900 capitalize flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#7B3FF2]" />
            {activeTab === 'all' ? 'All Tasks' : activeTab === 'today' ? "Today's Tasks" : activeTab === 'carry' ? 'Carried Forward Tasks' : `${activeTab} Tasks`}
            <span className="bg-[#7B3FF2]/10 text-[#7B3FF2] text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredTasks.length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition-all relative group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    task.status === 'Completed' ? 'bg-[#7B3FF2] border-[#7B3FF2] text-white' : 'border-gray-300 hover:border-[#7B3FF2]'
                  }`}
                >
                  {task.status === 'Completed' && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm leading-snug ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.description}</p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getCategoryBadgeStyle(task.category)}`}>
                      {task.category}
                    </span>

                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityBadgeStyle(task.priority)}`}>
                      {task.priority} Priority
                    </span>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 font-medium text-gray-400 text-[11px]">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {task.dueDate}
                </span>

                <div className="flex items-center gap-2">
                  <img 
                    src={task.assigneeAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
                    alt="assignee" 
                    className="w-5 h-5 rounded-full border border-gray-200" 
                  />
                  <button 
                    onClick={() => handleOpenEditModal(task)}
                    className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="col-span-full text-center py-12 text-xs text-gray-400">
              No tasks found for this view.
            </div>
          )}
        </div>
      </div>

      {/* 5. UPCOMING DEADLINES SECTION (Matching bottom screenshot card) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#7B3FF2]" />
          Upcoming Deadlines
        </h3>

        <div className="space-y-3">
          {[
            { date: 'May 22', title: 'Finalize Q3 Marketing Deck', priority: 'High', status: 'In Progress', statusColor: 'text-orange-500' },
            { date: 'May 24', title: 'Approve Budget Request', priority: 'High', status: 'To Do', statusColor: 'text-[#7B3FF2]' },
            { date: 'May 25', title: 'Research New CRM Tools', priority: 'Low', status: 'In Progress', statusColor: 'text-orange-500' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-medium w-16">{item.date}</span>
                <span className="text-gray-300">•</span>
                <span className="font-bold text-gray-900">{item.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  item.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                }`}>
                  {item.priority} Priority
                </span>
              </div>

              <span className={`font-semibold ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CREATE / EDIT TASK MODAL */}
      <AnimatePresence>
        {isNewTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7B3FF2]" />
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button onClick={() => setIsNewTaskModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Finalize Q3 Marketing Deck"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Task details and action items..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category || 'Marketing'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                      <option value="Business">Business</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority || 'High'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Due Date</label>
                    <input
                      type="text"
                      placeholder="e.g. May 24, 2025"
                      value={formData.dueDate || 'May 24, 2025'}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'To Do'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(editingTask.id)}
                    className="text-red-600 hover:text-red-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsNewTaskModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTask}
                    className="px-4 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
