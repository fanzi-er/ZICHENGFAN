import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Heart, Minimize2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  onTriggerEffect: (effectType: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'init-1', text: "亲爱的！💖 我一直都在。", sender: 'ai', timestamp: Date.now() }
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onTriggerEffect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('love_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('love_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const originalInput = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    // AI Logic
    setTimeout(() => {
      let responseText = "你是我的全世界！🌎❤️";
      
      // Keywords (Chinese & English support)
      if (originalInput.includes("想你") || originalInput.includes("miss")) {
        responseText = "我一直都在呀 ❤️ 抱抱你～别累到了。";
        onTriggerEffect('HEART_RAIN');
      } else if (originalInput.includes("累了") || originalInput.includes("困了") || originalInput.includes("tired")) {
        responseText = "来，让我抱抱你～ 宝宝辛苦啦，快休息一下吧！ 🫂💤";
      } else if (originalInput.includes("爱你") || originalInput.includes("love you")) {
        responseText = "和你聊天是我最喜欢的事。我也超级爱你！🌙✨";
        onTriggerEffect('HEART_RAIN');
      } else if (originalInput.includes("生气") || originalInput.includes("angry")) {
        responseText = "别生气嘛... 看看我可爱的脸？🥺 我们和好吧？";
        onTriggerEffect('SHAKE');
      } else if (originalInput.includes("开心") || originalInput.includes("happy")) {
        responseText = "看到你开心，我也最开心啦！🎉🥰";
      } else if (originalInput.includes("在干嘛") || originalInput.includes("doing")) {
        responseText = "在等你发消息呀... 顺便想你！😉";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 rounded-full shadow-2xl animate-bounce hover:scale-110 transition-transform"
        >
          <MessageCircle size={28} fill="currentColor" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-4 md:right-8 z-50 w-80 md:w-96 h-[500px] glass-card rounded-3xl flex flex-col shadow-2xl overflow-hidden border-2 border-pink-100 animate-float-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Heart size={18} fill="currentColor" className="animate-pulse" />
              </div>
              <span className="font-bold">小心心聊天机 🤖</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                <Minimize2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${
                    msg.sender === 'user'
                      ? 'bg-white text-gray-800 rounded-br-none'
                      : 'bg-gradient-to-br from-pink-400 to-rose-400 text-white rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-pink-100 text-pink-500 px-4 py-2 rounded-full rounded-bl-none text-xs flex gap-1 items-center">
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white/80 border-t border-pink-100 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="说点甜甜的话..."
              className="flex-1 bg-pink-50 border-transparent focus:border-pink-300 focus:bg-white focus:ring-0 rounded-xl px-4 py-2 text-sm transition-all outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-pink-500 hover:bg-pink-600 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-pink-200"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};