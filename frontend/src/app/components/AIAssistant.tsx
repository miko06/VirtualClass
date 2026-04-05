import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Plus, PanelLeftClose, PanelLeftOpen, Pencil, Trash2, Copy, Check, Loader2,
  BookOpen, FileText, Calculator, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClaudeChatInput, FileWithPreview, PastedContent, ModelOption } from './ui/claude-style-ai-input';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const AI_CHAT_STREAM_URL = `${API_BASE_URL}/ai/chat/stream`;
const CHATS_STORAGE_KEY = 'virtualclass_ai_chats';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: AttachedFile[];
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  textContent?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function generateTitle(firstMessage: string): string {
  return firstMessage.slice(0, 45) + (firstMessage.length > 45 ? '…' : '');
}

// ─── Chat storage ─────────────────────────────────────────────────────────────

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) return [];
    const chats = JSON.parse(raw) as Chat[];
    return chats.map(chat => ({
      ...chat,
      messages: chat.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
    }));
  } catch {
    return [];
  }
}

function saveChats(chats: Chat[]) {
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch { /* quota exceeded – ignore */ }
}

// ─── AI stream ────────────────────────────────────────────────────────────────

async function askAssistant(
  messages: Message[],
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const payloadMessages = messages.slice(-20).map((msg) => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));

  const response = await fetch(AI_CHAT_STREAM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: payloadMessages }),
    signal,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`AI_BACKEND_${response.status}:${details}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('AI_STREAM_UNAVAILABLE');

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  const applyLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parsed: { type?: string; chunk?: string; reply?: string; message?: string };
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return;
    }
    if (parsed.type === 'chunk' && typeof parsed.chunk === 'string') {
      fullText += parsed.chunk;
      onChunk(fullText);
      return;
    }
    if (parsed.type === 'done') {
      if (!fullText && typeof parsed.reply === 'string') {
        fullText = parsed.reply;
        onChunk(fullText);
      }
      return;
    }
    if (parsed.type === 'error') {
      throw new Error(parsed.message || 'AI_STREAM_ERROR');
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) applyLine(line);
  }
  buffer += decoder.decode();
  if (buffer.trim()) applyLine(buffer);

  return fullText.trim() || 'Не удалось получить ответ.';
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const [isCopied, setIsCopied] = useState(false);
  const isAI = message.type === 'ai';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI ? 'bg-zinc-700' : 'bg-zinc-800'
        }`}
      >
        {isAI ? <Bot className="w-4 h-4 text-white" /> : <span className="text-xs text-zinc-300">You</span>}
      </div>

      <div className={`flex-1 ${isAI ? '' : 'flex flex-col items-end'}`}>
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300"
              >
                {att.preview && (
                  <img src={att.preview} alt={att.name} className="h-6 w-6 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium truncate max-w-[120px]">{att.name}</p>
                  <p className="text-zinc-500">{formatFileSize(att.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="relative group">
          <div
            className={`inline-block px-4 py-2.5 max-w-2xl text-sm leading-relaxed whitespace-pre-line ${
              isAI
                ? 'text-zinc-100'
                : 'bg-zinc-900 text-zinc-100 rounded-2xl rounded-tr-sm'
            }`}
          >
            {message.content}
          </div>
          {isAI && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-5 right-0 p-1 rounded text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  type: 'ai',
  content: 'Hello! I\'m your AI assistant. How can I help you today?',
  timestamp: new Date(),
};

const MODELS: ModelOption[] = [
  { id: 'claude-sonnet-4', name: 'Sonnet 4.6', description: 'Balanced model', badge: 'Latest' },
  { id: 'claude-opus-3.5', name: 'Opus 3.5', description: 'Highest intelligence' },
  { id: 'claude-haiku-3', name: 'Haiku 3', description: 'Fastest responses' },
];

const QUICK_ACTIONS = [
  { icon: Code2, label: 'Code', query: 'Help me with code' },
  { icon: PenTool, label: 'Write', query: 'Help me write something' },
  { icon: GraduationCap, label: 'Learn', query: 'Explain a topic' },
  { icon: Coffee, label: 'Life', query: 'Help with a question' },
];

export function AIAssistant() {
  const [chats, setChats] = useState<Chat[]>(() => loadChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('claude-sonnet-4');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { saveChats(chats); }, [chats]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingText]);

  const startNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([INITIAL_MESSAGE]);
  }, []);

  const openChat = useCallback((chat: Chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
  }, []);

  const deleteChat = useCallback((chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => {
      const newChats = prev.filter((c) => c.id !== chatId);
      saveChats(newChats);
      return newChats;
    });
    if (activeChatId === chatId) startNewChat();
  }, [activeChatId, startNewChat]);

  const persistMessages = useCallback((updatedMessages: Message[], chatId: string | null, firstUserMsg: string) => {
    const now = new Date().toISOString();
    setChats((prev) => {
      if (chatId) {
        return prev.map((c) => c.id === chatId ? { ...c, messages: updatedMessages, updatedAt: now } : c);
      }
      const newChat: Chat = {
        id: Date.now().toString(),
        title: generateTitle(firstUserMsg),
        messages: updatedMessages,
        createdAt: now,
        updatedAt: now,
      };
      setActiveChatId(newChat.id);
      return [newChat, ...prev];
    });
  }, []);

  const handleSendMessage = useCallback(async (
    text: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => {
    if ((!text.trim() && files.length === 0 && pastedContent.length === 0) || isLoading) return;
    abortRef.current?.abort();

    let aiContent = text;
    const attachments: AttachedFile[] = [];

    if (files.length > 0) {
      const fileDescs = files.map((f) => {
        attachments.push({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type, preview: f.preview });
        if (f.textContent) return `[Файл: ${f.file.name}]\n\`\`\`\n${f.textContent.slice(0, 3000)}\n\`\`\``;
        return `[Прикреплён файл: ${f.file.name}, ${formatFileSize(f.file.size)}]`;
      }).join('\n\n');
      aiContent = fileDescs + (text ? '\n\n' + text : '');
    }
    if (pastedContent.length > 0) {
      const pastedText = pastedContent.map((p) => `[Вставленный текст]\n${p.content}`).join('\n\n');
      aiContent = aiContent ? aiContent + '\n\n' + pastedText : pastedText;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text || `Прикреплено файлов: ${files.length}`,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    const withUser = [...messages, userMsg];
    const withUserForAI = [...messages, { ...userMsg, content: aiContent }];

    setMessages(withUser);
    setIsLoading(true);
    setStreamingText('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const finalText = await askAssistant(withUserForAI, (partial) => setStreamingText(partial), controller.signal);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: finalText, timestamp: new Date() };
      const finalMessages = [...withUser, aiMsg];
      setMessages(finalMessages);
      setStreamingText('');
      persistMessages(finalMessages, activeChatId, text || 'Файлы');
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      const raw = String(err?.message ?? '').toLowerCase();
      let errMsg = 'Произошла ошибка. Попробуйте ещё раз.';
      if (raw.includes('failed to fetch') || raw.includes('ollama') || raw.includes('11434')) {
        errMsg = 'Не удалось подключиться к Ollama. Запустите `ollama serve` и backend.';
      } else if (raw.includes('no models') || (raw.includes('model') && raw.includes('not found'))) {
        errMsg = 'Нет доступной модели. Установите: `ollama pull llama3.2:3b`.';
      }
      const errorMsg: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: errMsg, timestamp: new Date() };
      persistMessages([...withUser, errorMsg], activeChatId, text || 'Файлы');
    } finally {
      setIsLoading(false);
    }
  }, [messages, activeChatId, isLoading, persistMessages]);

  const groupedChats = (() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const week = new Date(today); week.setDate(week.getDate() - 7);
    const groups: { label: string; items: Chat[] }[] = [
      { label: 'Сегодня', items: [] },
      { label: 'Вчера', items: [] },
      { label: 'Последние 7 дней', items: [] },
      { label: 'Ранее', items: [] },
    ];
    for (const chat of chats) {
      const d = new Date(chat.updatedAt); d.setHours(0, 0, 0, 0);
      if (d >= today) groups[0].items.push(chat);
      else if (d >= yesterday) groups[1].items.push(chat);
      else if (d >= week) groups[2].items.push(chat);
      else groups[3].items.push(chat);
    }
    return groups.filter((g) => g.items.length > 0);
  })();

  return (
    <div className="h-full flex relative overflow-hidden bg-[#09090b]">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 h-full flex flex-col border-r border-zinc-800/50 bg-[#09090b]/95 backdrop-blur-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <span className="font-medium text-sm text-zinc-300">Chats</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800">
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
            <div className="px-3 py-2">
              <button onClick={startNewChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Plus className="w-4 h-4" /> New chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4 [&::-webkit-scrollbar]:hidden">
              {groupedChats.length === 0 ? (
                <p className="text-xs text-zinc-600 text-center mt-6 px-4">No saved chats</p>
              ) : (
                groupedChats.map((group) => (
                  <div key={group.label} className="mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 px-2 py-1.5">{group.label}</p>
                    {group.items.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => openChat(chat)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors group mb-0.5 ${
                          activeChatId === chat.id ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                        }`}
                      >
                        <span className="truncate">{chat.title}</span>
                        <span onClick={(e) => deleteChat(chat.id, e)} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-[#09090b]/95 backdrop-blur-sm relative z-10">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800">
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-zinc-300">VirtualClass AI</span>
          </div>
          <button onClick={startNewChat} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800" title="New chat">
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700">
          {messages.length <= 1 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-zinc-700 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-light text-zinc-100 mb-2">How can I help you today?</h2>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
          </AnimatePresence>

          {isLoading && streamingText && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="text-zinc-100 text-sm leading-relaxed">
                {streamingText}<span className="animate-pulse ml-1">▋</span>
              </div>
            </motion.div>
          )}

          {isLoading && !streamingText && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#09090b]/95 backdrop-blur-sm border-t border-zinc-800/50 relative z-10">
          <ClaudeChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="How can I help you today?"
            models={MODELS}
            defaultModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          <p className="text-center text-[10px] text-zinc-600 mt-3">
            Shift+Enter for new line · Supports file drag & drop
          </p>
        </div>
      </div>
    </div>
  );
}

// Quick action icons
function Code2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  );
}
function PenTool(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
  );
}
function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg>
  );
}
function Coffee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 2v2" /><path d="M14 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /><path d="M6 2v2" /></svg>
  );
}
