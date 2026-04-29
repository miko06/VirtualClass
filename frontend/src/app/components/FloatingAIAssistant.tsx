import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, X, Maximize2, Minimize2, Send, Paperclip, Image as ImageIcon, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClaudeChatInput, FileWithPreview, PastedContent, ModelOption } from './ui/claude-style-ai-input';
import { useAIChat } from '../contexts/AIChatContext';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const AI_CHAT_STREAM_URL = `${API_BASE_URL}/ai/chat/stream`;
const CHATS_STORAGE_KEY = 'virtualclass_ai_chats';

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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
}

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c: Chat) => ({
      ...c,
      messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveChats(chats: Chat[]) {
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch { /* ignore */ }
}

async function askAI(
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

  if (!response.ok) throw new Error(`AI_ERROR_${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('STREAM_UNAVAILABLE');

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  const applyLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parsed: { type?: string; chunk?: string; reply?: string; message?: string };
    try { parsed = JSON.parse(trimmed); } catch { return; }
    if (parsed.type === 'chunk' && typeof parsed.chunk === 'string') {
      fullText += parsed.chunk;
      onChunk(fullText);
    }
    if (parsed.type === 'done' && !fullText && typeof parsed.reply === 'string') {
      fullText = parsed.reply;
      onChunk(fullText);
    }
    if (parsed.type === 'error') throw new Error(parsed.message || 'STREAM_ERROR');
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

const MODELS: ModelOption[] = [
  { id: 'n8n-ai-agent', name: 'VirtualClass AI', description: 'n8n AI Agent', badge: 'Cloud' },
];

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedModel, setSelectedModel] = useState('n8n-ai-agent');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(() => loadChats());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const handleSendMessageRef = useRef<(text: string, files: FileWithPreview[], pastedContent: PastedContent[]) => void>((() => {}) as any);
  const { registerHandler, unregisterHandler } = useAIChat();

  useEffect(() => { saveChats(chats); }, [chats]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingText]);

  const persistMessages = useCallback((updatedMessages: Message[], chatId: string | null, firstMsg: string) => {
    const now = new Date().toISOString();
    setChats((prev) => {
      if (chatId) return prev.map((c) => c.id === chatId ? { ...c, messages: updatedMessages, updatedAt: now } : c);
      const newChat: Chat = {
        id: Date.now().toString(),
        title: firstMsg.slice(0, 45) + (firstMsg.length > 45 ? '…' : ''),
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
    pastedContent: PastedContent[],
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
      const finalText = await askAI(withUserForAI, (partial) => setStreamingText(partial), controller.signal);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: finalText, timestamp: new Date() };
      const finalMessages = [...withUser, aiMsg];
      setMessages(finalMessages);
      setStreamingText('');
      persistMessages(finalMessages, activeChatId, text || 'Файлы');
    } catch (err: unknown) {
      const raw = String(err instanceof Error ? err.message : '').toLowerCase();
      if (raw.includes('abort')) return;
      let errMsg = 'Произошла ошибка. Попробуйте ещё раз.';
      if (raw.includes('failed to fetch') || raw.includes('n8n') || raw.includes('5678')) {
        errMsg = 'Не удалось подключиться к ИИ-ассистенту. Проверьте соединение с сервером.';
      } else if (raw.includes('no models') || (raw.includes('model') && raw.includes('not found'))) {
        errMsg = 'ИИ-сервис временно недоступен. Попробуйте позже.';
      }
      const errorMsg: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: errMsg, timestamp: new Date() };
      persistMessages([...withUser, errorMsg], activeChatId, text || 'Файлы');
    } finally {
      setIsLoading(false);
    }
  }, [messages, activeChatId, isLoading, persistMessages]);

  handleSendMessageRef.current = handleSendMessage;

  useEffect(() => {
    const handler = (message: string) => {
      setIsOpen(true);
      handleSendMessageRef.current(message, [], []);
    };
    registerHandler(handler);
    return () => { unregisterHandler(); };
  }, [registerHandler, unregisterHandler]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMaximized(false);
  };

  const handleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleToggle}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all flex items-center justify-center"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Popup window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl flex flex-col overflow-hidden ${
              isMaximized
                ? 'inset-4'
                : 'bottom-24 right-6 w-[420px] h-[580px]'
            }`}
          >
            {/* macOS-style title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/80 border-b border-zinc-700/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
                >
                  <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={handleMaximize}
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
                >
                  {isMaximized ? (
                    <Minimize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Bot className="w-4 h-4 text-violet-400 mr-2" />
                <span className="text-sm font-medium text-zinc-300">AI Ассистент</span>
              </div>
              <div className="w-16" />
            </div>

            {/* Chat area */}
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700">
                  {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Bot className="w-10 h-10 text-zinc-600 mb-3" />
                      <h3 className="text-sm font-medium text-zinc-400">Чем могу помочь?</h3>
                      <p className="text-xs text-zinc-600 mt-1">Задайте вопрос или прикрепите файл</p>
                    </div>
                  )}

                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                          msg.type === 'ai' ? 'bg-violet-600 text-white' : 'bg-zinc-700 text-zinc-300'
                        }`}>
                          {msg.type === 'ai' ? <Bot className="w-3.5 h-3.5" /> : 'Вы'}
                        </div>
                        <div className={`flex-1 ${msg.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              {msg.attachments.map((att) => (
                                <div key={att.id} className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-[10px] text-zinc-400">
                                  {att.preview && <img src={att.preview} alt={att.name} className="h-4 w-4 object-cover rounded" />}
                                  <span className="truncate max-w-[100px]">{att.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className={`px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                            msg.type === 'ai'
                              ? 'text-zinc-200'
                              : 'bg-zinc-800 text-zinc-200 rounded-xl rounded-tr-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && streamingText && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="text-zinc-200 text-xs leading-relaxed">
                        {streamingText}<span className="animate-pulse">▋</span>
                      </div>
                    </motion.div>
                  )}

                  {isLoading && !streamingText && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Думаю...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-3 border-t border-zinc-700/50 bg-zinc-800/50 flex-shrink-0">
                  <ClaudeChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder="Напишите сообщение..."
                    models={MODELS}
                    defaultModel={selectedModel}
                    onModelChange={setSelectedModel}
                  />
                </div>
              </>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
