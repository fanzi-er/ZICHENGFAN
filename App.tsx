import React, { useState } from 'react';
import { ViewState, GameType } from './types';
import { CherryBlossoms, FloatingHearts } from './components/Effects';
import { MusicPlayer } from './components/MusicPlayer';
import { ChatWidget } from './components/ChatWidget';
import { GameManager } from './components/Games';
import { 
  TimelineSection, 
  GallerySection, 
  VideoSection, 
  AnniversarySection, 
  MessageWall 
} from './components/SectionViews';
import { Heart, Home, Image, Film, Gamepad2, Mail, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('WELCOME');
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [specialEffect, setSpecialEffect] = useState<string | null>(null);

  const NavButton = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(target)}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
        view === target ? 'text-pink-600 bg-pink-50 scale-110' : 'text-gray-400 hover:text-pink-400'
      }`}
    >
      <Icon size={24} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (view) {
      case 'WELCOME':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-handwriting text-pink-600 mb-6 drop-shadow-sm">
              欢迎来到我们的专属小世界 ❤️
            </h1>
            <p className="text-lg text-gray-600 max-w-md mb-12">
              这是属于我们的小角落，记录我们的点点滴滴、回忆和未来。
            </p>
            <button
              onClick={() => {
                setView('TIMELINE');
                setSpecialEffect('HEART_EXPLOSION');
              }}
              className="bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl animate-heartbeat hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              进入爱的小窝
            </button>
          </div>
        );
      case 'TIMELINE':
        return <TimelineSection />;
      case 'GALLERY':
        return <GallerySection />;
      case 'VIDEO':
        return <VideoSection />;
      case 'ANNIVERSARY':
        return <AnniversarySection />;
      case 'MESSAGES':
        return <MessageWall />;
      case 'GAMES':
        return (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
             <div onClick={() => setActiveGame(GameType.QUIZ)} className="glass-card p-6 rounded-2xl text-center cursor-pointer hover:bg-pink-50 transition border-2 border-transparent hover:border-pink-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❓</div>
                <h3 className="font-bold text-xl text-gray-700">恋爱问答</h3>
                <p className="text-gray-500 text-sm mt-2">你有多了解我？</p>
             </div>
             <div onClick={() => setActiveGame(GameType.CATCH)} className="glass-card p-6 rounded-2xl text-center cursor-pointer hover:bg-pink-50 transition border-2 border-transparent hover:border-pink-300">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💖</div>
                <h3 className="font-bold text-xl text-gray-700">抓住小心心</h3>
                <p className="text-gray-500 text-sm mt-2">别让爱心跑掉啦！</p>
             </div>
             <div onClick={() => setActiveGame(GameType.PUZZLE)} className="glass-card p-6 rounded-2xl text-center cursor-pointer hover:bg-pink-50 transition border-2 border-transparent hover:border-pink-300">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🧩</div>
                <h3 className="font-bold text-xl text-gray-700">恋爱拼图</h3>
                <p className="text-gray-500 text-sm mt-2">拼凑我们的回忆。</p>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 relative pb-24 md:pb-0">
      <CherryBlossoms />
      <FloatingHearts active={!!specialEffect} onComplete={() => setSpecialEffect(null)} />

      {/* Main Content Area */}
      <main className="relative z-10 pt-6 md:pt-24 min-h-screen">
        {renderContent()}
      </main>

      {/* Desktop Top Nav */}
      <div className="hidden md:flex fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-8 py-3 justify-between items-center shadow-sm">
        <div className="font-handwriting text-2xl text-pink-600">我们的爱巢</div>
        <div className="flex gap-8">
           <button onClick={() => setView('WELCOME')} className={`font-bold hover:text-pink-500 transition ${view === 'WELCOME' ? 'text-pink-600' : 'text-gray-500'}`}>首页</button>
           <button onClick={() => setView('TIMELINE')} className={`font-bold hover:text-pink-500 transition ${view === 'TIMELINE' ? 'text-pink-600' : 'text-gray-500'}`}>故事</button>
           <button onClick={() => setView('GALLERY')} className={`font-bold hover:text-pink-500 transition ${view === 'GALLERY' ? 'text-pink-600' : 'text-gray-500'}`}>相册</button>
           <button onClick={() => setView('GAMES')} className={`font-bold hover:text-pink-500 transition ${view === 'GAMES' ? 'text-pink-600' : 'text-gray-500'}`}>游戏</button>
           <button onClick={() => setView('MESSAGES')} className={`font-bold hover:text-pink-500 transition ${view === 'MESSAGES' ? 'text-pink-600' : 'text-gray-500'}`}>留言墙</button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-lg border-t border-pink-100 px-6 py-2 flex justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavButton target="TIMELINE" icon={Home} label="故事" />
        <NavButton target="GALLERY" icon={Image} label="相册" />
        <NavButton target="ANNIVERSARY" icon={Heart} label="纪念日" />
        <NavButton target="GAMES" icon={Gamepad2} label="游戏" />
        <NavButton target="MESSAGES" icon={Mail} label="留言墙" />
      </div>

      <MusicPlayer />
      <ChatWidget onTriggerEffect={setSpecialEffect} />
      <GameManager activeGame={activeGame} onClose={() => setActiveGame(null)} />
    </div>
  );
};

export default App;