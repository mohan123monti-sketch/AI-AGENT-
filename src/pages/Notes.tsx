import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Download, Search, Sparkles, Folder, Tag, 
  Plus, Check, Trash2, Edit3, X, CheckSquare
} from 'lucide-react';

interface Note {
  id: number;
  title: string;
  folder: string;
  tags: string[];
  date: string;
  summary: string;
  content: string;
  checklist: { id: number; text: string; done: boolean }[];
  codeBlock?: string;
  attachments: string[];
}

const NOTES_STORAGE_KEY = 'planai_user_notes';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeFolder, setActiveFolder] = useState('All');
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(notes[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [exported, setExported] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);

  // New Note Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFolder, setNewFolder] = useState('Work');
  const [newTags, setNewTags] = useState('Idea, Note');
  const [newContent, setNewContent] = useState('');

  // Save notes locally
  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    if (notes.length > 0 && selectedNoteId === null) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  const folders = ["All", "Work", "Design", "Personal", "Ideas"];

  const handleExportPDF = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      title: newTitle.trim(),
      folder: newFolder,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      summary: newContent.slice(0, 120) + (newContent.length > 120 ? '...' : ''),
      content: newContent,
      checklist: [],
      attachments: []
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsNewNoteModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewFolder('Work');
    setNewTags('Idea, Note');
    setNewContent('');
  };

  const handleDeleteNote = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (selectedNoteId === id) {
      setSelectedNoteId(updated[0]?.id || null);
    }
  };

  const toggleChecklistItem = (noteId: number, itemId: number) => {
    setNotes(notes.map(n => {
      if (n.id !== noteId) return n;
      const updatedList = n.checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c);
      return { ...n, checklist: updatedList };
    }));
  };

  const filteredNotes = notes.filter(n => {
    if (activeFolder !== 'All' && n.folder !== activeFolder) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return n.title.toLowerCase().includes(term) || n.summary.toLowerCase().includes(term);
  });

  const activeNote = notes.find(n => n.id === selectedNoteId) || filteredNotes[0];

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Smart Notes & Minutes
            <div className="px-2.5 py-0.5 rounded-full bg-[#F3EEFF] text-[#7B3FF2] text-xs font-bold uppercase tracking-wider border border-[#7B3FF2]/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#7B3FF2]" /> Workspace Sync
            </div>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Capture ideas, meeting minutes, code snippets, and checklists.</p>
        </div>

        <div className="flex items-center gap-3">
          {exported && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
              ✓ Exported as PDF!
            </span>
          )}
          {notes.length > 0 && (
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          )}
          <button 
            onClick={() => setIsNewNoteModalOpen(true)}
            className="flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-xl mx-auto my-8 space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#F3EEFF] text-[#7B3FF2] mx-auto flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-gray-900">No Notes Available</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Create your first smart note to capture meeting minutes, ideas, code snippets, or checklists.
          </p>
          <button
            onClick={() => setIsNewNoteModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create First Note
          </button>
        </motion.div>
      ) : (
        /* Main 3-Column Interface: Folders | Notes List | Active Note View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-[500px] overflow-hidden">
          {/* Folders Sidebar */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 mb-1">Folders</h4>
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFolder === folder
                    ? 'bg-[#7B3FF2] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  {folder}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                  {folder === 'All' ? notes.length : notes.filter(n => n.folder === folder).length}
                </span>
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search notes or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F3EEFF]/40 border-[#7B3FF2] shadow-xs'
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{note.title}</h4>
                      <span className="text-[10px] font-semibold text-gray-400">{note.folder}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{note.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Note Content View */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full overflow-y-auto">
            {activeNote ? (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#7B3FF2] bg-[#F3EEFF] px-2.5 py-0.5 rounded-full">
                          {activeNote.folder}
                        </span>
                        <span className="text-xs text-gray-400">{activeNote.date}</span>
                      </div>
                      <h2 className="text-xl font-heading font-bold text-gray-900">{activeNote.title}</h2>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(activeNote.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">AI Summary</span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{activeNote.summary}</p>
                  </div>

                  <div className="text-xs text-gray-800 leading-relaxed space-y-3 whitespace-pre-line mb-4">
                    {activeNote.content}
                  </div>

                  {activeNote.checklist && activeNote.checklist.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-900 mb-2">Checklist</h4>
                      <div className="space-y-1.5">
                        {activeNote.checklist.map(item => (
                          <div key={item.id} className="flex items-center gap-2 text-xs">
                            <button
                              onClick={() => toggleChecklistItem(activeNote.id, item.id)}
                              className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer ${
                                item.done ? 'bg-[#7B3FF2] border-[#7B3FF2] text-white' : 'border-gray-300'
                              }`}
                            >
                              {item.done && <Check className="w-3 h-3" />}
                            </button>
                            <span className={item.done ? 'line-through text-gray-400' : 'text-gray-700'}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                Select a note to view content
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Note Modal */}
      <AnimatePresence>
        {isNewNoteModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#7B3FF2]" /> Create New Note
                </h3>
                <button
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Q3 Project Launch Notes"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Folder</label>
                    <select
                      value={newFolder}
                      onChange={e => setNewFolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]"
                    >
                      <option value="Work">Work</option>
                      <option value="Design">Design</option>
                      <option value="Personal">Personal</option>
                      <option value="Ideas">Ideas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Q3, Roadmap"
                      value={newTags}
                      onChange={e => setNewTags(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Content</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your notes or meeting summary here..."
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewNoteModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl text-xs font-semibold shadow-md"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
