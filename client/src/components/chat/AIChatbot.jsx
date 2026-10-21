import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { aiService } from '../../services';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Use a constant session ID for this session
  const [sessionId] = useState(`session_${Date.now()}`);

  const suggestions = [
    "How can I improve my React skills?",
    "Why is my ATS score low?",
    "Suggest projects for my level"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await aiService.chat(sessionId, text);
      if (res.success) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: res.data.response,
          timestamp: new Date().toISOString()
        }]);
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 z-50 group"
          >
            <Bot size={24} className="group-hover:animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-48px)] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">FutureForge AI</h3>
                  <p className="text-[10px] text-purple-200">Career Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={() => setMessages([])} className="p-1.5 hover:bg-white/20 rounded-lg text-xs transition">
                    Clear
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center mb-2">
                    <Bot size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">How can I help you?</h4>
                    <p className="text-sm text-gray-500 mt-1">Ask me anything about your career, resume, or skills.</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full mt-4">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(s)}
                        className="text-left px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-100 dark:border-gray-800 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-purple-600'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white rounded-tr-sm' 
                        : msg.isError 
                          ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-tl-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-purple-600 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shrink-0">
              <div className="relative flex items-end gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask FutureForge AI..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-0 resize-none outline-none max-h-32"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg disabled:opacity-50 transition"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
