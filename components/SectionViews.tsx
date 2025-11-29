import React, { useState, useEffect, useRef } from 'react';
import { Camera, Calendar, PlayCircle, Plus, Trash2, Upload, FolderPlus, Grid, Film, X, Tag } from 'lucide-react';
import { StoryEvent, WallMessage, GalleryItem, VideoItem } from '../types';

// --- Anniversary Component ---
export const AnniversarySection: React.FC = () => {
  const [daysTogether, setDaysTogether] = useState(0);
  const startDate = new Date('2023-05-20'); // Example Date

  useEffect(() => {
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, []);

  return (
    <div className="w-full p-4 mb-8">
      <div className="glass-card rounded-3xl p-8 text-center animate-float transform hover:scale-105 transition-transform duration-500">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">我们已经相爱了</h2>
        <div className="text-6xl font-handwriting text-pink-500 drop-shadow-sm mb-2">
          {daysTogether} <span className="text-3xl">天</span>
        </div>
        <div className="flex justify-center gap-4 mt-6">
           <div className="bg-pink-100 p-4 rounded-2xl w-32">
             <div className="text-2xl font-bold text-pink-600">35</div>
             <div className="text-xs text-gray-500">天后是生日</div>
           </div>
           <div className="bg-pink-100 p-4 rounded-2xl w-32">
             <div className="text-2xl font-bold text-pink-600">Forever</div>
             <div className="text-xs text-gray-500">直到永远</div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Timeline Component ---
const STORIES: StoryEvent[] = [
  { id: 1, date: '2023-05-20', title: '初次相遇', description: '我们在转角的咖啡店第一次见面，你穿着白衬衫。', image: 'https://picsum.photos/seed/love1/400/300' },
  { id: 2, date: '2023-06-15', title: '第一次旅行', description: '海边的周末，我们一起看了最美的日出。', image: 'https://picsum.photos/seed/love2/400/300' },
  { id: 3, date: '2023-08-01', title: '同居生活', description: '开始我们的二人世界，一起逛超市，做饭。', image: 'https://picsum.photos/seed/love3/400/300' },
  { id: 4, date: '2023-12-25', title: '第一个圣诞节', description: '温馨的夜晚，热可可，还有你送的礼物。', image: 'https://picsum.photos/seed/love4/400/300' },
  { id: 5, date: '2024-02-14', title: '情人节快乐', description: '和你在一起的每一天都是情人节。', image: 'https://picsum.photos/seed/love5/400/300' },
];

export const TimelineSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-handwriting text-center text-pink-600 mb-12">我们的故事</h2>
      <div className="relative border-l-4 border-pink-200 ml-3 md:ml-auto md:mr-auto pl-8 md:pl-0">
        {STORIES.map((story, index) => (
          <div key={story.id} className={`mb-12 relative md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8 md:text-right'}`}>
            <div className={`absolute top-0 w-6 h-6 bg-pink-400 rounded-full border-4 border-white shadow-md ${index % 2 === 0 ? '-left-[14px] md:-left-[14px]' : '-left-[14px] md:auto md:-right-[14px]'}`} />
            
            <div className="glass-card p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <img src={story.image} alt={story.title} className="w-full h-48 object-cover rounded-lg mb-4 opacity-90 hover:opacity-100 transition-opacity" />
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-bold mb-2">{story.date}</span>
              <h3 className="text-xl font-bold text-gray-800">{story.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Gallery Component with Upload & Organization ---
const INITIAL_IMAGES: GalleryItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `init-${i}`,
  url: `https://picsum.photos/seed/romance${i}/600/600`,
  category: i % 2 === 0 ? '旅行' : '日常'
}));

export const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>(INITIAL_IMAGES);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['全部', '旅行', '日常', '纪念日']);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('日常');

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: GalleryItem[] = Array.from(files).map((file, index) => ({
        id: `user-${Date.now()}-${index}`,
        url: URL.createObjectURL(file as Blob),
        category: uploadCategory,
        isUserUploaded: true
      }));
      setImages(prev => [...newImages, ...prev]);
      setIsUploadMode(false);
    }
  };

  const deleteImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这张照片吗？')) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const filteredImages = activeCategory === '全部' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-handwriting text-pink-600">甜蜜相册</h2>
        
        <div className="flex gap-2 bg-white/50 p-1 rounded-xl backdrop-blur-sm overflow-x-auto max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-gray-500 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsUploadMode(!isUploadMode)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          {isUploadMode ? <X size={18} /> : <Upload size={18} />}
          <span>上传照片</span>
        </button>
      </div>

      {/* Upload Panel */}
      {isUploadMode && (
        <div className="mb-8 p-6 glass-card rounded-2xl animate-fade-in-down">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FolderPlus className="text-pink-500" /> 添加新回忆
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-600 mb-2">选择分类</label>
              <select 
                value={uploadCategory} 
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-pink-50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {categories.filter(c => c !== '全部').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-600 mb-2">选择照片 (支持多选)</label>
              <label className="flex items-center justify-center w-full p-3 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100 cursor-pointer transition-colors text-pink-500 font-bold">
                <Upload size={20} className="mr-2" /> 点击选择文件
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Camera size={48} className="mx-auto mb-4 opacity-50" />
          <p>这个分类下还没有照片哦，快去上传吧！</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredImages.map((img) => (
            <div key={img.id} className="break-inside-avoid relative group" onClick={() => setSelectedImg(img.url)}>
               <img 
                 src={img.url} 
                 alt="Memory" 
                 className="w-full rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-4 border-white cursor-pointer" 
               />
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md">{img.category}</span>
                 {img.isUserUploaded && (
                   <button 
                     onClick={(e) => deleteImage(img.id, e)}
                     className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                   >
                     <Trash2 size={12} />
                   </button>
                 )}
               </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImg(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <X size={32} />
          </button>
          <img src={selectedImg} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-scale-in" />
        </div>
      )}
    </div>
  );
};

// --- Video Section with Upload ---
const INITIAL_VIDEOS: VideoItem[] = [
  { id: 'v1', url: 'https://picsum.photos/seed/video_thumb/1200/600', title: '我们的旅行 Vlog 🎥', thumbnail: 'https://picsum.photos/seed/video_thumb/1200/600' }
];

export const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(INITIAL_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideo: VideoItem = {
        id: `vid-${Date.now()}`,
        url: url,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        isUserUploaded: true
      };
      setVideos(prev => [newVideo, ...prev]);
      setCurrentVideo(newVideo);
      setIsPlaying(true);
    }
  };

  const handlePlay = (vid: VideoItem) => {
    setCurrentVideo(vid);
    setIsPlaying(true);
    // Note: Auto-play might be blocked by browsers until user interaction
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-handwriting text-pink-600">幸福剧场</h2>
        <label className="flex items-center gap-2 bg-white text-pink-500 border border-pink-200 px-4 py-2 rounded-full cursor-pointer hover:bg-pink-50 transition shadow-sm">
          <Upload size={18} />
          <span className="text-sm font-bold">上传视频</span>
          <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
        </label>
      </div>

      {/* Main Player */}
      <div className="bg-pink-50 p-1 rounded-[2rem] shadow-[0_0_20px_rgba(236,72,153,0.3)] mb-8">
        <div className="bg-black rounded-[1.8rem] overflow-hidden relative aspect-video group w-full">
           {currentVideo.isUserUploaded ? (
             <video 
                ref={videoRef}
                src={currentVideo.url} 
                controls 
                autoPlay={isPlaying}
                className="w-full h-full object-contain"
             />
           ) : (
             // Placeholder for demo initial video (since it's an image in this demo data)
             <div className="relative w-full h-full">
                <img src={currentVideo.thumbnail || currentVideo.url} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <PlayCircle size={64} className="text-white drop-shadow-lg animate-pulse" />
                    <p className="absolute mt-24 text-white font-bold text-lg">演示视频 (请上传真实视频)</p>
                </div>
             </div>
           )}
           
           {!currentVideo.isUserUploaded && (
              <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md z-10">
                {currentVideo.title}
              </div>
           )}
        </div>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((vid) => (
           <div 
             key={vid.id} 
             onClick={() => handlePlay(vid)}
             className={`cursor-pointer rounded-xl overflow-hidden relative aspect-video border-2 transition-all ${currentVideo.id === vid.id ? 'border-pink-500 shadow-lg scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'}`}
           >
              {vid.isUserUploaded ? (
                  <video src={vid.url} className="w-full h-full object-cover bg-black" />
              ) : (
                  <img src={vid.thumbnail || vid.url} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <PlayCircle className="text-white" size={32} />
              </div>
              <div className="absolute bottom-2 left-2 right-2 truncate text-white text-xs font-bold drop-shadow-md">
                {vid.title}
              </div>
           </div>
        ))}
        
        {/* Empty State / Add Button styled as card */}
        <label className="cursor-pointer border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center bg-pink-50/50 hover:bg-pink-50 aspect-video text-pink-400 hover:text-pink-600 transition">
          <Plus size={32} className="mb-2" />
          <span className="text-xs font-bold">添加新视频</span>
          <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
};

// --- Message Wall ---
export const MessageWall: React.FC = () => {
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('love_wall_msgs');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const addMessage = () => {
    if(!newMsg.trim()) return;
    const colors = ['bg-yellow-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100'];
    const msg: WallMessage = {
      id: Date.now().toString(),
      text: newMsg,
      date: new Date().toLocaleDateString(),
      style: {
        rotation: Math.random() * 10 - 5,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    };
    const updated = [msg, ...messages];
    setMessages(updated);
    localStorage.setItem('love_wall_msgs', JSON.stringify(updated));
    setNewMsg('');
  };

  const deleteMessage = (id: string) => {
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      localStorage.setItem('love_wall_msgs', JSON.stringify(updated));
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-handwriting text-center text-pink-600 mb-8">留言墙</h2>
      
      <div className="max-w-md mx-auto flex gap-2 mb-8">
        <input 
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="写下一句甜甜的话..."
          className="flex-1 p-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 outline-none"
        />
        <button onClick={addMessage} className="bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 transition"><Plus /></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`${msg.style.color} p-4 h-40 shadow-lg relative group transition-transform hover:z-10 hover:scale-105`}
            style={{ 
              transform: `rotate(${msg.style.rotation}deg)`,
              fontFamily: '"Nanum Pen Script", cursive' // Simulating handwriting style fallback
            }}
          >
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-200 shadow-inner border border-gray-300 z-20"></div> {/* Pin */}
             <p className="mt-2 text-gray-800 font-medium leading-tight h-24 overflow-hidden">{msg.text}</p>
             <span className="absolute bottom-2 right-2 text-xs text-gray-500">{msg.date}</span>
             <button onClick={() => deleteMessage(msg.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition">
               <Trash2 size={16} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};