import React, { useState, useEffect, useRef } from 'react';
import { Heart, Trophy, RefreshCcw } from 'lucide-react';
import { GameType, QuizQuestion } from '../types';

// --- Shared Components ---
const GameCard: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-float">
      <div className="bg-pink-400 p-4 flex justify-between items-center text-white">
        <h3 className="font-bold text-lg flex items-center gap-2"><Trophy size={20} /> {title}</h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><RefreshCcw size={20} /></button>
      </div>
      <div className="p-6 bg-pink-50 min-h-[300px] flex flex-col justify-center items-center relative">
        {children}
      </div>
    </div>
  </div>
);

// --- Quiz Game ---
const QUESTIONS: QuizQuestion[] = [
  { question: "我们第一次约会是在哪里？", options: ["公园", "电影院", "咖啡馆", "西餐厅"], correctIndex: 2 },
  { question: "我最喜欢吃的食物是什么？", options: ["火锅", "寿司", "汉堡", "烧烤"], correctIndex: 0 },
  { question: "我们的纪念日是哪一天？", options: ["1月1日", "2月14日", "5月20日", "12月25日"], correctIndex: 2 },
  { question: "我生气的时候该怎么办？", options: ["不理我", "给我买包包", "抱抱我哄我", "和我讲道理"], correctIndex: 2 },
];

const QuizGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleAnswer = (index: number) => {
    if (index === QUESTIONS[currentQ].correctIndex) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    
    setTimeout(() => {
      setFeedback(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(q => q + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (finished) {
    return (
      <GameCard title="恋爱问答" onClose={onClose}>
        <div className="text-center">
          <Heart size={64} className="text-pink-500 mx-auto mb-4 animate-bounce" fill="currentColor" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">挑战完成！</h2>
          <p className="text-pink-600 text-lg">你的得分: {score} / {QUESTIONS.length}</p>
          <p className="mt-4 text-gray-600">{score === QUESTIONS.length ? "你太了解我了！ 🥰" : "我们需要多约会哦！ 😉"}</p>
        </div>
      </GameCard>
    );
  }

  return (
    <GameCard title={`第 ${currentQ + 1}/${QUESTIONS.length} 题`} onClose={onClose}>
      <h3 className="text-xl font-bold text-center mb-8 text-gray-700">{QUESTIONS[currentQ].question}</h3>
      <div className="grid grid-cols-1 gap-3 w-full">
        {QUESTIONS[currentQ].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={feedback !== null}
            className={`p-4 rounded-xl text-left font-semibold transition-all transform hover:scale-102
              ${feedback === null ? 'bg-white hover:bg-pink-100 text-gray-700 shadow-sm' : ''}
              ${feedback === 'correct' && i === QUESTIONS[currentQ].correctIndex ? 'bg-green-400 text-white' : ''}
              ${feedback === 'wrong' && i !== QUESTIONS[currentQ].correctIndex ? 'opacity-50' : ''}
              ${feedback === 'wrong' && i === indexOfClicked(i) ? 'bg-red-400 text-white' : ''}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </GameCard>
  );
  
  function indexOfClicked(i: number) { return i; } // Dummy, actual logic handled by checking state if needed
};

// --- Catch Heart Game ---
const CatchHeartGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  
  useEffect(() => {
    const moveHeart = () => {
      setPosition({
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10
      });
    };
    const interval = setInterval(moveHeart, 1000 - (score * 20)); // Gets faster
    return () => clearInterval(interval);
  }, [score]);

  const handleCatch = () => {
    setScore(s => s + 1);
    setPosition({
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10
    });
  };

  return (
    <GameCard title="抓住小心心" onClose={onClose}>
      <div className="absolute top-4 left-4 text-pink-600 font-bold">得分: {score}</div>
      {score >= 10 ? (
        <div className="text-center animate-pulse">
          <h2 className="text-2xl font-bold text-pink-600">你抓住了我的心！ 💖</h2>
          <p className="text-gray-600">我是你的了。</p>
        </div>
      ) : (
        <button
          onClick={handleCatch}
          style={{ top: `${position.top}%`, left: `${position.left}%` }}
          className="absolute transition-all duration-300 transform hover:scale-110 active:scale-90"
        >
          <Heart size={48} className="text-red-500 drop-shadow-lg" fill="currentColor" />
        </button>
      )}
    </GameCard>
  );
};

// --- Puzzle Game (Canvas) ---
const PuzzleGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSolved, setIsSolved] = useState(false);
  const GRID_SIZE = 3;
  const TILE_COUNT = GRID_SIZE * GRID_SIZE;
  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyTile, setEmptyTile] = useState(8);

  // Initialize shuffled tiles
  useEffect(() => {
    const solvedState = Array.from({ length: TILE_COUNT }, (_, i) => i);
    let shuffled = [...solvedState];
    // Simple shuffle
    for(let i = shuffled.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTiles(shuffled);
    setEmptyTile(shuffled.indexOf(8)); // 8 is empty slot
  }, []);

  const drawPuzzle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    const tileSize = size / GRID_SIZE;
    ctx.clearRect(0, 0, size, size);

    tiles.forEach((tileIndex, positionIndex) => {
      if (tileIndex === 8) return; // Empty tile

      const row = Math.floor(positionIndex / GRID_SIZE);
      const col = positionIndex % GRID_SIZE;
      const x = col * tileSize;
      const y = row * tileSize;

      // Draw tile background
      ctx.fillStyle = `hsl(${tileIndex * 40}, 70%, 80%)`;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
      
      // Draw number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((tileIndex + 1).toString(), x + tileSize / 2, y + tileSize / 2);
    });
  };

  useEffect(() => {
    drawPuzzle();
    // Check win condition
    const isWin = tiles.every((val, index) => val === index);
    if (isWin && tiles.length > 0) setIsSolved(true);
  }, [tiles]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSolved) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = 300 / GRID_SIZE;
    
    const col = Math.floor(x / size);
    const row = Math.floor(y / size);
    const index = row * GRID_SIZE + col;

    // Check adjacency
    const emptyRow = Math.floor(emptyTile / GRID_SIZE);
    const emptyCol = emptyTile % GRID_SIZE;

    const isAdjacent = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyTile]] = [newTiles[emptyTile], newTiles[index]];
      setTiles(newTiles);
      setEmptyTile(index);
    }
  };

  return (
    <GameCard title="恋爱拼图" onClose={onClose}>
      <div className="flex flex-col items-center">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          onClick={handleClick}
          className="bg-gray-200 rounded-lg cursor-pointer shadow-inner"
        />
        <p className="mt-4 text-sm text-gray-500">点击空白格旁边的方块来移动</p>
        {isSolved && <p className="mt-2 text-xl font-bold text-pink-600 animate-bounce">拼图完成！完美！ ❤️</p>}
      </div>
    </GameCard>
  );
};

// --- Main Manager ---
export const GameManager: React.FC<{ activeGame: GameType | null; onClose: () => void }> = ({ activeGame, onClose }) => {
  if (!activeGame) return null;
  if (activeGame === GameType.QUIZ) return <QuizGame onClose={onClose} />;
  if (activeGame === GameType.CATCH) return <CatchHeartGame onClose={onClose} />;
  if (activeGame === GameType.PUZZLE) return <PuzzleGame onClose={onClose} />;
  return null;
};