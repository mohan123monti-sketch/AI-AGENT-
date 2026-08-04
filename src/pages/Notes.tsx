import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Mic, Share, Download, Search, Sparkles, Folder, Tag, 
  CheckSquare, Image as ImageIcon, Paperclip, Code, Plus, Check, Trash2, Edit3
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

export default function Notes() {
  const [activeFolder, setActiveFolder] = useState('All');
  const [selectedNoteId, setSelectedNoteId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [exported, setExported] = useState(false);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Q3 Roadmap & Architecture Sync",
      folder: "Work",
      tags: ["Roadmap", "Architecture", "Q3"],
      date: "Aug 1, 2026, 10:00 AM",
      summary: "Discussed the upcoming features for Q3 and finalized the technical architecture for the Enterprise tier.",
      content: `The team reviewed progress for Q2 and aligned on primary objectives for Q3. Core focus will be expanding enterprise features, specifically single sign-on (SSO) and advanced analytics. Marketing budget was approved at $50k.`,
      checklist: [
        { id: 1, text: "Draft Enterprise tier announcement blog post", done: true },
        { id: 2, text: "Finalize technical requirements for SSO integration", done: false },
        { id: 3, text: "Prepare Q3 budget allocation spreadsheet", done: false }
      ],
      codeBlock: `// Example SSO Auth Config
const ssoConfig = {
  provider: 'Okta',
  entityId: 'https://auth.planai.com/saml',
  callbackUrl: 'https://app.planai.com/auth/callback'
};`,
      attachments: ["Q3_Architecture_Diagram.png", "SSO_Spec_v2.pdf"]
    },
    {
      id: 2,
      title: "Design System Guidelines",
      folder: "Design",
      tags: ["UI", "Theme", "Tokens"],
      date: "Jul 28, 2026, 2:30 PM",
      summary: "Standardized color tokens, typography scales, and component radii for the PlanAI design system.",
      content: "Maintained primary purple (#7B3FF2) and orange (#FF7A00) accents. All cards should use rounded-2xl (16px) with subtle 1px border and soft drop shadows.",
      checklist: [
        { id: 1, text: "Export Tailwind color config", done: true },
        { id: 2, text: "Update component library storybook", done: false }
      ],
      codeBlock: `/* Design Tokens */
:root {
  --primary-purple: #7B3FF2;
  --accent-orange: #FF7A00;
  --dark-bg: #0D0D12;
}`,
      attachments: ["Design_System_Figma.png"]
    },
    {
      id: 3,
      title: "Personal Productivity & Book Notes",
      folder: "Personal",
      tags: ["Ideas", "Habits"],
      date: "Jul 25, 2026, 8:00 PM",
      summary: "Key takeaways from 'Atomic Habits' regarding daily focus blocks and environment design.",
      content: "Focus on small 1% daily improvements. Structure the work environment so deep focus is friction-free.",
      checklist: [
        { id: 1, text: "Set morning phone-free focus routine", done: true }
      ],
      attachments: []
    }
  ]);

  const folders = ["All", "Work", "Design", "Personal", "Ideas"];

  const handleExportPDF = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
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
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Smart Notes & Minutes
            <div className="px-2.5 py-0.5 rounded-full bg-[#F3EEFF] text-[#7B3FF2] text-xs font-bold uppercase tracking-wider border border-[#7B3FF2]/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#7B3FF2]" /> AI Summary Enabled
            </div>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Rich text, checklists, code snippets, attachments, and PDF export.</p>
        </div>

        <div className="flex items-center gap-3">
          {exported && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
              ✓ Exported as PDF!
            </span>
          )}
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Main 3-Column Interface: Folders | Notes List | Active Note View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Folders Sidebar (3 cols) */}
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

        {/* Notes List (4 cols) */}
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

        {/* Active Note Detail View (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full overflow-y-auto">
          {activeNote ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase text-[#7B3FF2] bg-[#F3EEFF] px-2.5 py-0.5 rounded-full">
                    {activeNote.folder}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{activeNote.date}</span>
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-900">{activeNote.title}</h2>
              </div>

              {/* AI Summary Box */}
              <div className="bg-gradient-to-r from-[#F3EEFF] to-[#FFF3E8] p-4 rounded-xl border border-[#7B3FF2]/20">
                <div className="flex items-center gap-2 mb-1.5 text-[#7B3FF2] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> AI Key Takeaways Summary
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {activeNote.summary}
                </p>
              </div>

              {/* Main Content */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes & Content</h4>
                <p className="text-xs text-gray-700 leading-relaxed font-sans bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                  {activeNote.content}
                </p>
              </div>

              {/* Checklist Section */}
              {activeNote.checklist.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-[#7B3FF2]" /> Interactive Checklist
                  </h4>
                  <div className="space-y-1.5">
                    {activeNote.checklist.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-medium cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleChecklistItem(activeNote.id, item.id)}
                          className="w-4 h-4 rounded text-[#7B3FF2] focus:ring-[#7B3FF2]"
                        />
                        <span className={item.done ? 'line-through text-gray-400' : 'text-gray-800'}>{item.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Blocks Section */}
              {activeNote.codeBlock && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-[#FF7A00]" /> Code Block
                  </h4>
                  <pre className="p-4 bg-[#111111] text-gray-200 rounded-xl text-xs font-mono overflow-x-auto">
                    <code>{activeNote.codeBlock}</code>
                  </pre>
                </div>
              )}

              {/* Attachments Section */}
              {activeNote.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-gray-500" /> File Attachments ({activeNote.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeNote.attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700">
                        <Paperclip className="w-3.5 h-3.5 text-[#7B3FF2]" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 text-sm">
              Select a note to view content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
