import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, FileText, Calculator, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeSquaresBackground } from './ThemeSquaresBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const AI_CHAT_STREAM_URL = `${API_BASE_URL}/ai/chat/stream`;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

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
  if (!reader) {
    throw new Error('AI_STREAM_UNAVAILABLE');
  }

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

    for (const line of lines) {
      applyLine(line);
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    applyLine(buffer);
  }

  const normalized = fullText.trim();
  return normalized || 'Не удалось получить ответ.';
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Привет! Я ИИ-помощник VirtualClass. У меня есть доступ к файлам проекта сайта, поэтому могу помогать по коду, заданиям и материалам. Чем помочь?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const quickActions = [
    { icon: BookOpen, label: 'Объяснить тему', query: 'Можешь объяснить последнюю тему из курса по информационной безопасности?', gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' },
    { icon: FileText, label: 'Помощь с заданием', query: 'Нужна помощь с домашним заданием по программированию', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
    { icon: Calculator, label: 'Решить задачу', query: 'Помоги решить задачу по алгоритмам', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { icon: Sparkles, label: 'Подготовка к экзамену', query: 'Как лучше подготовиться к экзамену по серверной инфраструктуре?', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  ];

  const handleSendMessage = async (overrideText?: string) => {
    const text = overrideText || inputValue;
    if (!text.trim() || isLoading) return;

    // Abort previous request if any
    abortRef.current?.abort();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setStreamingText('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const finalText = await askAssistant(
        newMessages,
        (partial) => setStreamingText(partial),
        controller.signal,
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: finalText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setStreamingText('');
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      console.error('AI error:', error);
      const rawMessage = String(error?.message ?? '');
      const normalized = rawMessage.toLowerCase();

      let errMsg = 'Произошла ошибка при обработке запроса. Попробуйте ещё раз.';
      if (
        normalized.includes('failed to fetch') ||
        normalized.includes('networkerror') ||
        normalized.includes('ai_backend_503') ||
        normalized.includes('ollama') ||
        normalized.includes('11434')
      ) {
        errMsg = 'Не удалось подключиться к Ollama. Запустите Ollama (`ollama serve`) и backend.';
      } else if (
        normalized.includes('нет загруженных моделей') ||
        normalized.includes('no models') ||
        (normalized.includes('model') && normalized.includes('not found'))
      ) {
        errMsg = 'В Ollama нет доступной модели. Установите модель, например: `ollama pull llama3.2:3b`.';
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: errMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="legacy-theme-screen p-6 md:p-8 h-full flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#0f1115] transition-colors duration-200">
      <ThemeSquaresBackground />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 relative z-10">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSendMessage(action.query)}
              disabled={isLoading}
              className="p-4 rounded-2xl text-left transition-all bg-white dark:bg-[#1a1d24] shadow-lg shadow-slate-200/50 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-indigo-200 dark:hover:ring-indigo-500/30 hover:shadow-xl group disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md" style={{ background: action.gradient }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 rounded-3xl flex flex-col bg-white dark:bg-[#1a1d24] shadow-2xl shadow-slate-200/50 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-slate-800 relative z-10 overflow-hidden"
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${message.type === 'ai'
                      ? 'shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
                  style={message.type === 'ai' ? { background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' } : undefined}
                >
                  {message.type === 'ai' ? (
                    <Bot className="w-5 h-5 text-white drop-shadow-sm" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                  <div
                    className={`inline-block px-5 py-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line ${message.type === 'ai'
                        ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 rounded-3xl rounded-tl-xl border border-slate-100 dark:border-slate-700/50 shadow-sm'
                        : 'text-white rounded-3xl rounded-tr-xl shadow-md'
                      }`}
                    style={message.type === 'user' ? { background: 'linear-gradient(135deg, #4f46e5, #6366f1)' } : {}}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming response */}
          {isLoading && streamingText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}
              >
                <Bot className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              <div className="inline-block px-5 py-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 rounded-3xl rounded-tl-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <p>{streamingText}<span className="animate-pulse ml-1">▋</span></p>
              </div>
            </motion.div>
          )}

          {/* Loading indicator (before streaming starts) */}
          {isLoading && !streamingText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/20"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}
              >
                <Bot className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-3xl rounded-tl-xl border border-slate-100 dark:border-slate-700/50 shadow-sm text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Думаю...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#1a1d24] border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-500/20 focus-within:border-indigo-300 dark:focus-within:border-indigo-500/50 transition-all shadow-inner">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Задайте вопрос помощнику..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400 font-medium disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="p-3.5 rounded-xl text-white transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
              style={
                inputValue.trim() && !isLoading
                  ? { background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }
                  : { background: '#94a3b8' }
              }
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
