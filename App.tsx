import React, { useState, useEffect } from 'react';
import { scenarios } from './data';
import { analyzeMessage, analyzeScreenshot } from './services/geminiService';
import { Scenario, AnalysisResponse, Achievement } from './types';
import ChatBubble from './components/ChatBubble';
import AnalysisCard from './components/AnalysisCard';
import { Flame, RefreshCw, Send, ShieldAlert, Sparkles, ChevronLeft, Heart, Share2, MoreHorizontal, Mic, PlusCircle, Smile, X, User } from 'lucide-react';

enum AppMode {
  HOME,
  GENDER_SELECT,
  GAME,
  CUSTOM,
  RESULT
}

const ACHIEVEMENTS: Achievement[] = [
    { id: '1', title: '绝世恋爱脑', description: '虽然你很单纯，但在这个游戏里活不下去。建议挖野菜。', minScore: 0, prompt_visual: "", image: "/achievements/achievement_1.png" },
    { id: '2', title: '鉴渣实习生', description: '刚入门，还得练练火眼金睛，别太轻易相信人。', minScore: 5, prompt_visual: "", image: "/achievements/achievement_2.png" },
    { id: '3', title: '鉴渣达人', description: '一般的套路已经骗不到你了，你已经看透了红尘。', minScore: 10, prompt_visual: "", image: "/achievements/achievement_3.png" },
    { id: '4', title: '人间清醒', description: '不仅自己不被骗，还能普度众生。你是众生仰望的神。', minScore: 15, prompt_visual: "", image: "/achievements/achievement_4.png" },
];

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  
  // User Config
  const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);

  // Game State
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [roundAnalysis, setRoundAnalysis] = useState<AnalysisResponse | null>(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [shuffling, setShuffling] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | undefined>(undefined);
  const [usedScenarioIds, setUsedScenarioIds] = useState<Set<number>>(new Set());
  
  // Result State
  // (已禁用AI生成，改用本地图片)

  // Custom Mode State
  const [customInput, setCustomInput] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null); // Base64 图片
  const [customAnalysis, setCustomAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];

  // Logic
  const handleStartFlow = () => {
    setMode(AppMode.GENDER_SELECT);
  };

  const startGame = (gender: 'male' | 'female') => {
      setUserGender(gender);
      setMode(AppMode.GAME);
      setScore(0);
      setHearts(3);
      setUsedScenarioIds(new Set());
      // Need to defer nextRound until state updates, or pass gender explicitly
      nextRound(true, gender);
  };

  const nextRound = (isFirst = false, genderOverride?: 'male' | 'female') => {
    const gender = genderOverride || userGender;
    setRoundAnalysis(null);
    setShuffling(true);

    // Filter scenarios: 
    // If I am Male, I want scenarios where target_user_gender is 'male' (messages from women)
    // If I am Female, I want scenarios where target_user_gender is 'female' (messages from men)
    // Fallback to 'female' target if undefined for compatibility with old data
    let available = scenarios.filter(s => {
        const target = s.target_user_gender || 'female';
        return target === gender && !usedScenarioIds.has(s.id);
    });
    
    // If we run out, reset used
    if (available.length === 0) {
        available = scenarios.filter(s => (s.target_user_gender || 'female') === gender);
        setUsedScenarioIds(new Set());
    }

    if (available.length === 0) {
        // Fallback safety if no data exists
        setMode(AppMode.HOME);
        alert("暂无适合该性别的题库");
        return;
    }

    const next = available[Math.floor(Math.random() * available.length)];
    setUsedScenarioIds(prev => new Set(prev).add(next.id));

    setTimeout(() => {
        setCurrentScenarioIndex(scenarios.indexOf(next));
        setShuffling(false);
    }, isFirst ? 0 : 500);
  };

  const handleGuess = (guessIsRedFlag: boolean) => {
    const isActuallyRedFlag = currentScenario.is_safe === false; 
    const isCorrect = (isActuallyRedFlag && guessIsRedFlag) || (!isActuallyRedFlag && !guessIsRedFlag);

    if (isCorrect) {
        setScore(prev => prev + 1);
        setLastCorrect(true);
    } else {
        setHearts(prev => prev - 1);
        setLastCorrect(false);
    }

    setRoundAnalysis({
        red_flag_score: currentScenario.red_flag_score,
        roast_analysis: currentScenario.roast_analysis,
        tags: currentScenario.tags || []
    });
  };

  const handleNextCard = () => {
      if (hearts <= 0) {
          setMode(AppMode.RESULT);
      } else {
          nextRound();
      }
  };

  const getAchievement = () => {
      return ACHIEVEMENTS.slice().reverse().find(a => score >= a.minScore) || ACHIEVEMENTS[0];
  };

  // Custom Logic - 图片上传处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    
    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCustomImage(base64);
      console.log('[Upload] 图片已加载，大小:', Math.round(base64.length / 1024), 'KB');
    };
    reader.readAsDataURL(file);
  };

  const handleCustomAnalyze = async () => {
    // 必须有图片或文本
    if (!customImage && !customInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      let result;
      if (customImage) {
        // 优先分析图片
        console.log('[Analyze] 开始分析截图...');
        result = await analyzeScreenshot(customImage);
      } else {
        // 回退到文本分析
        result = await analyzeMessage(customInput);
      }
      setCustomAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCustom = () => {
    setCustomAnalysis(null);
    setCustomInput("");
    setCustomImage(null);
  };

  const removeImage = () => {
    setCustomImage(null);
  };

  // --- RENDERS ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12 text-center max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

      <div className="mb-12 relative z-10">
        <div className="relative inline-block">
             <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur opacity-30"></div>
             <div className="relative w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 mx-auto transform rotate-3 border border-red-50">
                <Flame className="w-14 h-14 text-red-500" />
             </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">AI 鉴渣师</h1>
        <p className="text-gray-500 font-medium tracking-wide">The Red Flag Scanner</p>
      </div>

      <div className="space-y-4 w-full z-10">
        <button 
          onClick={handleStartFlow}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 ring-4 ring-transparent hover:ring-gray-200"
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
          开始挑战 (Start)
        </button>
        <button 
          onClick={() => setMode(AppMode.CUSTOM)}
          className="w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <ShieldAlert className="w-5 h-5 text-red-500" />
          我被渣了吗? (Analyze)
        </button>
      </div>
    </div>
  );

  const renderGenderSelect = () => (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 max-w-md mx-auto relative">
         <button onClick={() => setMode(AppMode.HOME)} className="absolute top-8 left-6 p-2 bg-white rounded-full shadow-sm">
             <ChevronLeft className="w-6 h-6" />
         </button>
         
         <h2 className="text-3xl font-black mb-8 text-gray-900">请选择你的身份</h2>
         
         <div className="grid grid-cols-2 gap-4 w-full">
             <button 
                onClick={() => startGame('female')}
                className="flex flex-col items-center justify-center aspect-[3/4] bg-white rounded-3xl shadow-xl border-2 border-transparent hover:border-pink-500 active:scale-95 transition-all group"
             >
                 <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                    <User className="w-10 h-10 text-pink-600" />
                 </div>
                 <span className="text-xl font-bold text-gray-800">我是女生</span>
                 <span className="text-xs text-gray-400 mt-2">鉴定渣男</span>
             </button>

             <button 
                onClick={() => startGame('male')}
                className="flex flex-col items-center justify-center aspect-[3/4] bg-white rounded-3xl shadow-xl border-2 border-transparent hover:border-blue-500 active:scale-95 transition-all group"
             >
                 <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <User className="w-10 h-10 text-blue-600" />
                 </div>
                 <span className="text-xl font-bold text-gray-800">我是男生</span>
                 <span className="text-xs text-gray-400 mt-2">鉴定渣女</span>
             </button>
         </div>
      </div>
  );

  const renderGame = () => (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F2F2F2] relative overflow-hidden md:h-[85vh] md:my-8 md:rounded-[30px] md:border-[8px] md:border-gray-900 md:shadow-2xl transition-all">
      <div className="bg-[#EDEDED] px-4 pt-safe-top pb-3 flex items-center justify-between border-b border-gray-300 z-20 h-[60px] md:rounded-t-[22px] flex-shrink-0">
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setMode(AppMode.HOME)}>
            <ChevronLeft className="w-6 h-6 text-black" />
            <span className="text-black text-base font-medium">微信</span>
        </div>
        <span className="font-semibold text-black text-base">
            {userGender === 'male' ? '女神' : '男神'} ({hearts}❤️)
        </span>
        <button className="p-1 hover:bg-gray-200 rounded-full">
             <MoreHorizontal className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="flex-1 px-4 pt-4 overflow-y-auto flex flex-col relative bg-[#F2F2F2]" onClick={() => {}}>
        <div className="w-full flex justify-center mb-6 mt-2">
            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-sm">晚上 22:42</span>
        </div>
        <div className={`transition-all duration-300 transform ${shuffling ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <ChatBubble text={currentScenario.message} />
        </div>
      </div>

      <div className="bg-[#F7F7F7] border-t border-[#DCDCDC] p-4 pb-8 z-20 md:rounded-b-[22px]">
        {!roundAnalysis ? (
            <div className="flex gap-4 items-center">
                 <button 
                    onClick={() => handleGuess(false)}
                    className="flex-1 h-14 bg-white border border-gray-200 rounded-2xl text-gray-800 font-bold text-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                 >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Smile className="w-5 h-5 text-green-600" />
                    </div>
                    正常 (Safe)
                 </button>
                 <button 
                    onClick={() => handleGuess(true)}
                    className="flex-1 h-14 bg-red-500 border border-red-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    <ShieldAlert className="w-5 h-5 text-white" />
                    有诈 (Red Flag)
                 </button>
            </div>
        ) : (
             <div className="flex items-center justify-between opacity-50 pointer-events-none h-14">
                <Mic className="w-7 h-7 text-gray-600" />
                <div className="flex-1 mx-3 h-10 bg-white border border-gray-300 rounded px-2 flex items-center">
                    <span className="text-gray-400 text-sm">Type a message...</span>
                </div>
                <PlusCircle className="w-7 h-7 text-gray-600" />
             </div>
        )}
      </div>

      {roundAnalysis && (
        <AnalysisCard 
            analysis={roundAnalysis}
            onNext={handleNextCard}
            isCorrect={lastCorrect}
        />
      )}
    </div>
  );

  const renderResult = () => {
      const achievement = getAchievement();
      return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative shadow-2xl md:h-[85vh] md:my-8 md:rounded-[30px] md:border-[8px] md:border-gray-900 text-gray-900 overflow-hidden">
             <div className="flex-1 flex flex-col items-center justify-center p-4 text-center relative">
                
                <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Game Over</h2>
                
                {/* Achievement Card - 缩小尺寸 */}
                <div className="w-48 aspect-[3/4] bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden mb-4 border-2 border-gray-800">
                    <img 
                      src={achievement.image} 
                      alt={achievement.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        console.log('[Image] 加载失败:', achievement.image);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-3 text-left">
                        <p className="text-yellow-400 font-bold text-[10px] tracking-widest mb-0.5">ACHIEVEMENT UNLOCKED</p>
                        <h3 className="text-white font-black text-lg">{achievement.title}</h3>
                    </div>
                </div>

                <div className="text-4xl font-black text-gray-900 mb-1">{score} <span className="text-sm text-gray-400 font-bold">pts</span></div>
                <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xs mx-auto mb-4">{achievement.description}</p>

                <button 
                    onClick={handleStartFlow}
                    className="w-full max-w-xs bg-gray-900 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    再玩一次
                </button>
             </div>
        </div>
      );
  };

  const renderCustom = () => (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white relative shadow-2xl md:h-[85vh] md:my-8 md:rounded-[30px] md:border-[8px] md:border-gray-900">
       <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 md:rounded-t-[22px]">
        <button onClick={() => setMode(AppMode.HOME)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-900" />
        </button>
        <span className="font-bold text-lg text-gray-900">AI 情感分析室</span>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        {/* 图片上传区域 */}
        {!customAnalysis && (
          <div className="mb-6">
            {!customImage ? (
              <label className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-red-300 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传聊天截图</span></p>
                  <p className="text-xs text-gray-400">支持 PNG, JPG, WEBP（最大 10MB）</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isAnalyzing}
                />
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={customImage} 
                  alt="上传的截图" 
                  className="w-full max-h-64 object-contain rounded-2xl border border-gray-200"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 文本输入区域（可选） */}
        {!customImage && !customAnalysis && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <textarea
                className="w-full h-32 bg-transparent focus:outline-none resize-none text-gray-800 text-lg placeholder-gray-300 leading-relaxed"
                placeholder="或者粘贴对方发来的消息..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={isAnalyzing}
            />
          </div>
        )}
        
        {/* 已上传图片展示（分析结果页） */}
        {customImage && customAnalysis && (
          <div className="mb-4">
            <img 
              src={customImage} 
              alt="分析的截图" 
              className="w-full max-h-48 object-contain rounded-2xl border border-gray-200"
            />
          </div>
        )}

        {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-red-100 border-t-red-500 rounded-full animate-spin mb-4"></div>
                <span className="text-gray-500 text-sm font-medium animate-pulse">正在扫描红旗...</span>
            </div>
        )}

        {customAnalysis && (
             <div className="animate-[slideUp_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-900 text-lg">分析报告</span>
                    <span className={`px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-sm ${customAnalysis.red_flag_score > 60 ? 'bg-red-500' : 'bg-green-500'}`}>
                        含渣量: {customAnalysis.red_flag_score}%
                    </span>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                    <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                        {customAnalysis.roast_analysis}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {customAnalysis.tags?.map((t, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium">#{t}</span>
                        ))}
                    </div>
                </div>
             </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 md:rounded-b-[22px]">
        {!customAnalysis ? (
            <button 
                onClick={handleCustomAnalyze}
                disabled={(!customInput.trim() && !customImage) || isAnalyzing}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                    ${(!customInput.trim() && !customImage) || isAnalyzing 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                        : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                    }`}
            >
                {customImage ? '开始鉴渣' : '开始分析'}
            </button>
        ) : (
            <button 
                onClick={resetCustom}
                className="w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
                再测一条
            </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 md:py-8 font-sans">
      {mode === AppMode.HOME && renderHome()}
      {mode === AppMode.GENDER_SELECT && renderGenderSelect()}
      {mode === AppMode.GAME && renderGame()}
      {mode === AppMode.CUSTOM && renderCustom()}
      {mode === AppMode.RESULT && renderResult()}
    </div>
  );
};

export default App;
