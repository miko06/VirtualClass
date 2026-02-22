import { useState } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, FileText, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Привет! Я ваш ИИ-помощник. Могу помочь с домашними заданиями, объяснить материал или ответить на вопросы по курсу. Чем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickActions = [
    { icon: BookOpen, label: 'Объяснить тему', query: 'Можешь объяснить последнюю тему из курса?', gradient: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' },
    { icon: FileText, label: 'Помощь с заданием', query: 'Нужна помощь с домашним заданием', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
    { icon: Calculator, label: 'Решить задачу', query: 'Помоги решить задачу по алгоритмам', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { icon: Sparkles, label: 'Подготовка к экзамену', query: 'Как лучше подготовиться к экзамену?', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  ];

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('задан') || lowerQuery.includes('домаш')) {
      return 'Конечно, помогу с заданием! Пожалуйста, опишите подробнее, какое задание вам нужно выполнить, и я предоставлю пошаговую инструкцию или объяснение концепций, которые помогут вам самостоятельно решить его.';
    } else if (lowerQuery.includes('экзамен') || lowerQuery.includes('подготов')) {
      return 'Для эффективной подготовки к экзамену рекомендую: 1) Просмотреть все лекционные материалы, 2) Решить практические задания, 3) Составить конспекты ключевых тем, 4) Использовать технику интервальных повторений. Хотите, чтобы я помог с какой-то конкретной темой?';
    } else if (lowerQuery.includes('объясн') || lowerQuery.includes('тем')) {
      return 'С удовольствием объясню! Укажите, пожалуйста, какую именно тему или концепцию вы хотите разобрать, и я предоставлю подробное объяснение с примерами.';
    } else if (lowerQuery.includes('алгоритм') || lowerQuery.includes('задач')) {
      return 'Для решения задач по алгоритмам важно: 1) Понять условие задачи, 2) Определить входные и выходные данные, 3) Выбрать подходящую структуру данных, 4) Написать псевдокод, 5) Оценить сложность. Какую конкретно задачу вы хотите разобрать?';
    } else {
      return 'Спасибо за ваш вопрос! Я готов помочь с учебными материалами, объяснить сложные концепции или направить к нужным ресурсам. Не стесняйтесь задавать любые вопросы по вашим курсам!';
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setTimeout(() => {
      const aiMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: getAIResponse(inputValue), timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <div className="p-8 h-full flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ИИ Помощник</h2>
        </div>
        <p className="text-slate-500 font-medium text-sm ml-13 pl-1">
          Задайте любой вопрос по учебным материалам
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
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
              onClick={() => setInputValue(action.query)}
              className="p-5 rounded-2xl text-left transition-all bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 hover:ring-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-shadow"
                style={{ background: action.gradient }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
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
        className="flex-1 rounded-3xl flex flex-col bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 relative z-10 overflow-hidden"
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${message.type === 'ai'
                    ? 'shadow-indigo-500/20'
                    : 'bg-slate-100 border border-slate-200'
                  }`}
                style={{
                  background: message.type === 'ai'
                    ? 'linear-gradient(135deg, #4f46e5, #0ea5e9)'
                    : undefined
                }}
              >
                {message.type === 'ai' ? (
                  <Bot className="w-5 h-5 text-white drop-shadow-sm" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                <div
                  className={`inline-block px-5 py-4 max-w-2xl text-sm leading-relaxed ${message.type === 'ai'
                      ? 'bg-slate-50 text-slate-700 rounded-3xl rounded-tl-xl border border-slate-100 shadow-sm'
                      : 'text-white rounded-3xl rounded-tr-xl shadow-md'
                    }`}
                  style={
                    message.type === 'user'
                      ? { background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }
                      : {}
                  }
                >
                  <p>{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-slate-100">
          <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-inner">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Задайте вопрос помощнику..."
              className="flex-1 px-4 py-3 bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 font-medium"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3.5 rounded-xl text-white transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
              style={
                inputValue.trim()
                  ? { background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }
                  : { background: '#cbd5e1' }
              }
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
