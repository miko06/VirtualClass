import { useState } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, FileText, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
};

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
    { icon: BookOpen, label: 'Объяснить тему', query: 'Можешь объяснить последнюю тему из курса?', gradient: 'linear-gradient(135deg, #7c3aed, #6366f1)' },
    { icon: FileText, label: 'Помощь с заданием', query: 'Нужна помощь с домашним заданием', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
    { icon: Calculator, label: 'Решить задачу', query: 'Помоги решить задачу по алгоритмам', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
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
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl mb-1" style={{ color: '#e2e8f0' }}>ИИ Помощник</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Задайте любой вопрос по учебным материалам</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setInputValue(action.query)}
              className="p-4 rounded-xl text-left transition-all"
              style={cardStyle}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{ background: action.gradient }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{action.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 rounded-2xl flex flex-col overflow-hidden"
        style={cardStyle}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: message.type === 'ai'
                    ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  border: message.type === 'user' ? '1px solid rgba(255,255,255,0.1)' : undefined,
                  boxShadow: message.type === 'ai' ? '0 0 15px rgba(124,58,237,0.3)' : undefined,
                }}
              >
                {message.type === 'ai' ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                )}
              </div>
              <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                <div
                  className="inline-block px-4 py-3 rounded-2xl max-w-2xl"
                  style={
                    message.type === 'ai'
                      ? {
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                      : {
                          background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                          boxShadow: '0 0 15px rgba(124,58,237,0.3)',
                        }
                  }
                >
                  <p className="text-sm leading-relaxed" style={{ color: '#e2e8f0' }}>
                    {message.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Задайте вопрос..."
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="px-4 py-3 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                boxShadow: '0 0 15px rgba(124,58,237,0.3)',
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
