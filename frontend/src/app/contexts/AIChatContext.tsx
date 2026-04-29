import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AIChatContextType {
  sendMessageToAI: (message: string) => void;
  registerHandler: (handler: (message: string) => void) => void;
  unregisterHandler: () => void;
}

const AIChatContext = createContext<AIChatContextType | null>(null);

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = useRef<((message: string) => void) | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const registerHandler = useCallback((handler: (message: string) => void) => {
    handlerRef.current = handler;
    if (pendingMessage) {
      handler(pendingMessage);
      setPendingMessage(null);
    }
  }, [pendingMessage]);

  const unregisterHandler = useCallback(() => {
    handlerRef.current = null;
  }, []);

  const sendMessageToAI = useCallback((message: string) => {
    if (handlerRef.current) {
      handlerRef.current(message);
    } else {
      setPendingMessage(message);
    }
  }, []);

  return (
    <AIChatContext.Provider value={{ sendMessageToAI, registerHandler, unregisterHandler }}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error('useAIChat must be used within AIChatProvider');
  return ctx;
}