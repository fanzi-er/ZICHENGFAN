import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Upload, Volume2, X } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setIsPlaying(true);
      if(audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => alert("请先点击页面进行互动！"));
    }
    setIsPlaying(!isPlaying);
  };

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (audioSrc) URL.revokeObjectURL(audioSrc);
    };
  }, [audioSrc]);

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-40 bg-white p-3 rounded-full shadow-lg border-2 border-pink-200 animate-spin-slow hover:scale-110 transition-transform"
        title="打开播放器"
      >
        <Music className="text-pink-500" size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-64 glass-card rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-3 flex justify-between items-center">
        <div className="flex items-center text-white">
          <Volume2 size={18} className="mr-2" />
          <span className="font-bold text-sm">恋爱播放器 🎵</span>
        </div>
        <button onClick={() => setIsMinimized(true)} className="text-white/80 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col items-center">
        {/* Visualizer Simulation */}
        <div className="flex items-end justify-center h-12 space-x-1 mb-4 w-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-2 bg-pink-400 rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '4px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        <audio ref={audioRef} loop onEnded={() => setIsPlaying(false)} className="hidden" />

        <div className="flex items-center justify-between w-full">
          <label className="cursor-pointer p-2 rounded-full hover:bg-pink-50 transition-colors">
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            <Upload className="text-gray-500" size={20} />
          </label>

          <button 
            onClick={togglePlay}
            className={`p-4 rounded-full shadow-lg transform transition-transform ${audioSrc ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-110' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!audioSrc}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <div className="w-8" /> {/* Spacer for centering */}
        </div>
        
        {!audioSrc && (
          <p className="text-xs text-gray-400 mt-2 text-center">上传一首甜甜的歌</p>
        )}
      </div>
    </div>
  );
};