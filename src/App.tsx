import React, { useState, useEffect, useRef } from "react";
import { INITIAL_SUBJECTS, INITIAL_CARDS } from "./db";
import type { Card, Mood, AppSettings, CheckpointQuestion, LearningRoadmap } from "./types";

// Checkpoint questions data
const CHECKPOINT_QUESTIONS: Record<string, CheckpointQuestion[]> = {
  chemistry: [
    {
      question: "Phản ứng xà phòng hóa chất béo (trieste của glixerol) với NaOH thu được sản phẩm gồm những gì?",
      options: [
        "Xà phòng và ancol etylic",
        "Axit béo và glixerol",
        "Muối natri của axit béo (xà phòng) và glixerol",
        "Este đơn chức và nước"
      ],
      correct: 2,
      explanation: "Xà phòng hóa là phản ứng thủy phân chất béo trong môi trường kiềm (NaOH/KOH), tạo ra muối của axit béo (chính là xà phòng) và glixerol."
    },
    {
      question: "Cacbohidrat nào sau đây KHÔNG tham gia phản ứng thủy phân?",
      options: [
        "Saccarozơ",
        "Glucozơ",
        "Tinh bột",
        "Xenlulozơ"
      ],
      correct: 1,
      explanation: "Glucozơ là monosaccarit (đường đơn giản nhất), không thể bị thủy phân thành đường nhỏ hơn. Saccarozơ (đisaccarit), tinh bột và xenlulozơ (polysaccarit) đều thủy phân được."
    }
  ],
  physics: [
    {
      question: "Một vật dao động điều hòa với phương trình x = A*cos(omega*t + phi). Vận tốc của vật đạt giá trị cực đại khi vật đi qua vị trí nào?",
      options: [
        "Vị trí biên dương",
        "Vị trí cân bằng theo chiều dương",
        "Vị trí biên âm",
        "Vị trí cân bằng theo chiều âm"
      ],
      correct: 1,
      explanation: "Vận tốc cực đại v_max = omega*A đạt được khi vật đi qua vị trí cân bằng theo chiều dương (phần dương trục ox). Đi qua VTCB theo chiều âm thì v = -omega*A (tốc độ đạt cực đại, nhưng vận tốc có giá trị cực tiểu)."
    }
  ]
};


// Dynamic learning roadmaps presets for offline fallback
const ROADMAP_PRESETS: Record<string, LearningRoadmap> = {
  "chemistry-este": {
    id: "rm-chem-este",
    topicName: "Chuyên đề Este - Lipit nâng cao (PDF)",
    difficulty: "Trung bình",
    milestones: [
      {
        id: "chem-ms1",
        title: "Danh pháp & Cấu tạo liên kết Este",
        description: "Làm quen với cấu trúc liên kết este, cách gọi tên este từ gốc ancol và axit cacboxylic.",
        timeEstimate: "15 phút",
        status: "active",
        cards: [
          {
            id: "chem-ms1-c1",
            subjectId: "chemistry",
            chapterId: "c1",
            type: "green",
            question: "Este nào sau đây được điều chế trực tiếp từ axit axetic và ancol etylic?",
            options: [
              "Metyl axetat",
              "Etyl axetat (CH3COOC2H5)",
              "Vinyl axetat",
              "Benzyl axetat"
            ],
            correctOption: 1,
            modelAnswer: "CH3COOH + C2H5OH <-> CH3COOC2H5 + H2O (xt H2SO4 đặc, t°). Sản phẩm thu được là Etyl axetat.",
            reference: "Đề cương Este - Hóa 12",
            box: 1,
            lastReviewed: null,
            nextReviewDate: null,
            history: []
          }
        ]
      },
      {
        id: "chem-ms2",
        title: "Tính chất hóa học & Thủy phân kiềm",
        description: "Vận dụng viết phản ứng xà phòng hóa, cô cạn dung dịch muối natri và tính toán khối lượng.",
        timeEstimate: "25 phút",
        status: "locked",
        cards: [
          {
            id: "chem-ms2-c1",
            subjectId: "chemistry",
            chapterId: "c1",
            type: "yellow",
            question: "Viết phương trình phản ứng xà phòng hóa metyl axetat bằng dung dịch NaOH. So sánh tính chất thuận nghịch giữa thủy phân este trong môi trường axit và môi trường kiềm.",
            options: null,
            correctOption: null,
            modelAnswer: "1. Phương trình: CH3COOCH3 + NaOH -(t°)-> CH3COONa + CH3OH.\n2. So sánh:\n- Thủy phân axit: Là phản ứng thuận nghịch (2 chiều), cần xúc tác H2SO4 loãng, t°.\n- Thủy phân kiềm (xà phòng hóa): Là phản ứng một chiều (hoàn toàn), cần t°.",
            reference: "Đề cương Este - Hóa 12",
            box: 1,
            lastReviewed: null,
            nextReviewDate: null,
            history: []
          }
        ]
      },
      {
        id: "chem-ms3",
        title: "Biện luận Este đa chức liên chương",
        description: "Phân tích mối quan hệ giữa Este, Carbohydrate và Polymer để giải các sơ đồ phản ứng tổng hợp hữu cơ.",
        timeEstimate: "35 phút",
        status: "locked",
        cards: [
          {
            id: "chem-ms3-c1",
            subjectId: "chemistry",
            chapterId: "c1",
            type: "red",
            question: "Thiết lập chuỗi phản ứng liên chương từ Xenlulozơ (Chương 2) điều chế ra Etyl axetat (Chương 1) và giải thích điều kiện thực tế của từng bước.",
            options: null,
            correctOption: null,
            modelAnswer: "Chuỗi phản ứng:\nXenlulozơ -(1. Thủy phân H+, t°)-> Glucozơ -(2. Lên men rượu, 30-35°)-> Ancol etylic -(3. Lên men giấm)-> Axit axetic -(4. Este hóa H2SO4 đặc, t°)-> Etyl axetat.\n\nCác phản ứng cụ thể:\n1. (C6H10O5)n + nH2O -> nC6H12O6\n2. C6H12O6 -> 2C2H5OH + 2CO2\n3. C2H5OH + O2 -> CH3COOH + H2O\n4. CH3COOH + C2H5OH <-> CH3COOC2H5 + H2O",
            reference: "Đề cương Este - Hóa 12",
            box: 1,
            lastReviewed: null,
            nextReviewDate: null,
            history: []
          }
        ]
      }
    ]
  },
  "physics-wave": {
    id: "rm-phys-wave",
    topicName: "Sóng cơ học & Sóng âm chuyên sâu (DOCX)",
    difficulty: "Khó",
    milestones: [
      {
        id: "phys-ms1",
        title: "Đặc trưng vật lý của Sóng cơ",
        description: "Nhận diện sóng ngang, sóng dọc và công thức tính toán tốc độ truyền sóng, bước sóng cơ học.",
        timeEstimate: "15 phút",
        status: "active",
        cards: [
          {
            id: "phys-ms1-c1",
            subjectId: "physics",
            chapterId: "p2",
            type: "green",
            question: "Sóng dọc có phương dao động của các phần tử môi trường trùng với phương truyền sóng hay vuông góc với phương truyền sóng?",
            options: [
              "Trùng với phương truyền sóng",
              "Vuông góc với phương truyền sóng",
              "Song song và xiên góc 45 độ",
              "Không phụ thuộc phương truyền sóng"
            ],
            correctOption: 0,
            modelAnswer: "Sóng dọc là sóng trong đó các phần tử của môi trường dao động theo phương trùng với phương truyền sóng.",
            reference: "Sách giáo khoa Vật lý 12 - Bài 7",
            box: 1,
            lastReviewed: null,
            nextReviewDate: null,
            history: []
          }
        ]
      },
      {
        id: "phys-ms2",
        title: "Phương trình truyền sóng & Độ lệch pha",
        description: "Áp dụng phương trình sóng u = A*cos(omega*t - 2*pi*x/lambda) để tìm bước sóng, vận tốc truyền.",
        timeEstimate: "25 phút",
        status: "locked",
        cards: [
          {
            id: "phys-ms2-c1",
            subjectId: "physics",
            chapterId: "p2",
            type: "yellow",
            question: "Một sóng cơ có phương trình u = 4*cos(20*pi*t - 0.2*pi*x) (mm, s). Tính tần số f và vận tốc truyền sóng v (coi x tính bằng cm).",
            options: null,
            correctOption: null,
            modelAnswer: "1. Tần số f = omega / (2*pi) = 20*pi / (2*pi) = 10 Hz.\n2. Ta có 2*pi*x / lambda = 0.2*pi*x -> lambda = 10 cm.\n3. Vận tốc v = lambda * f = 10 cm * 10 Hz = 100 cm/s = 1 m/s.",
            reference: "Vật lý 12 - Bài tập Sóng cơ học",
            box: 1,
            lastReviewed: null,
            nextReviewDate: null,
            history: []
          }
        ]
      },
      {
        id: "phys-ms3",
        title: "Sóng dừng & Cộng hưởng ống nhạc cụ",
        description: "Giải thích các họa âm của sáo, đàn và hiện tượng cộng hưởng cột không khí khi thổi nhạc cụ.",
        timeEstimate: "35 phút",
        status: "locked",
        cards: [
          {
            id: "phys-ms3-c1",
            subjectId: "physics",
            chapterId: "p2",
            type: "red",
            question: "Phân tích cơ chế cộng hưởng âm thanh trong cột khí của ống sáo khi thổi hơi và nêu cách để duy trì sóng dừng họa âm ổn định.",
            options: null,
            correctOption: null,
            modelAnswer: "1. Ống sáo là hệ dao động có các tần số riêng phụ thuộc vào chiều dài L. Thổi hơi qua miệng sáo tạo luồng khí xoáy cưỡng bức.\n2. Khi tần số luồng hơi trùng với tần số riêng, cộng hưởng xảy ra hình thành sóng dừng họa âm ổn định.\n3. Duy trì hơi thổi liên tục giúp bù đắp năng lượng tiêu tán do ma sát khí và âm phát ra.",
            reference: "Vật lý 12 - Chuyên đề Sóng âm",
            box: 1,
            lastReviewed: null,
            nextReviewDate: null,
            history: []
          }
        ]
      }
    ]
  }
};

export default function App() {
  // --- STATE HOOKS ---
  const [activeSubject, setActiveSubject] = useState<string>("chemistry");
  const [cards, setCards] = useState<Card[]>([]);
  const [streak, setStreak] = useState<number>(3);
  const [points, setPoints] = useState<number>(350);
  const [mood, setMood] = useState<Mood>("normal");
  const [examDate, setExamDate] = useState<string>("");
  const geminiApiKey = "AQ.Ab8RN6L1qmZ_EouHWtC4e2ThxVf6P2gDH4LovnkmpD_O5acTwA";

  // Roadmap States
  const [activeRoadmap, setActiveRoadmap] = useState<LearningRoadmap | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    examMode: true,
    antiBurnout: true,
    popupCheckpoint: true,
    adaptivePenalty: true
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Filter study state
  const [filterChapter, setFilterChapter] = useState<string>("all");
  const [filterBloom, setFilterBloom] = useState({ green: true, yellow: true, red: true });
  const [filterBox, setFilterBox] = useState({ box1: true, box2: true, box3: true });
  const [forcePracticeAll, setForcePracticeAll] = useState<boolean>(false);
  const [filteredQueue, setFilteredQueue] = useState<Card[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  
  // Flashcard Play states
  const [flipped, setFlipped] = useState<boolean>(false);
  const [selectedGreenOption, setSelectedGreenOption] = useState<number | null>(null);
  const [essayAnswer, setEssayAnswer] = useState<string>("");
  const [tutorCardFeedback, setTutorCardFeedback] = useState<string>("");
  
  // Timer count states
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Smart scheduling session states
  const [consecutiveEasyCount, setConsecutiveEasyCount] = useState<number>(0);
  const [sessionReviewedCards, setSessionReviewedCards] = useState<{ cardId: string, oldBox: number }[]>([]);

  // OCR state
  const [activeOCRBase64, setActiveOCRBase64] = useState<string>("");
  const [activeOCRMimeType, setActiveOCRMimeType] = useState<string>("");
  const [ocrFileName, setOcrFileName] = useState<string>("vo_ghi_hoa_este.png");
  const [ocrFileSize, setOcrFileSize] = useState<string>("840 KB");
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [ocrStep, setOcrStep] = useState<number>(0);
  const [ocrPresetsSel, setOcrPresetsSel] = useState<string>("chemistry-este");
  const [ocrPreviewSrc, setOcrPreviewSrc] = useState<string>("https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=500&q=80");
  

  // Map state
  const [selectedMapNodeId, setSelectedMapNodeId] = useState<string | null>(null);

  // Chat Tutor state
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ sender: 'tutor' | 'user', text: string }[]>([
    {
      sender: "tutor",
      text: "Chào bạn! Mình là Gia sư AI Retrieval Box. Mình ở đây để phân tích các câu trả lời, giải đáp các lỗi sai lý thuyết hoặc hướng dẫn phương pháp giải bài tập. Bạn muốn thảo luận về phần kiến thức nào hôm nay?"
    }
  ]);
  const [chatThinking, setChatThinking] = useState<boolean>(false);

  // Modals state
  const [moodModalOpen, setMoodModalOpen] = useState<boolean>(false);
  const [checkpointModalOpen, setCheckpointModalOpen] = useState<boolean>(false);
  const [checkpointQuestion, setCheckpointQuestion] = useState<CheckpointQuestion | null>(null);
  const [checkpointSelectedIdx, setCheckpointSelectedIdx] = useState<number | null>(null);
  const [checkpointFeedback, setCheckpointFeedback] = useState<{ status: 'success' | 'fail' | null, text: string }>({
    status: null,
    text: ""
  });

  // --- LOCAL STORAGE LIFE CYCLE ---
  useEffect(() => {
    // 1. Load cards
    const savedCards = localStorage.getItem("retrieval_cards");
    let loadedCards: Card[] = [];
    if (savedCards) {
      loadedCards = JSON.parse(savedCards);
    } else {
      loadedCards = [...INITIAL_CARDS];
      localStorage.setItem("retrieval_cards", JSON.stringify(loadedCards));
    }
    setCards(loadedCards);

    // 2. Load streak, points, mood, examDate, api key, settings
    const savedStreak = localStorage.getItem("userStreak");
    if (savedStreak) setStreak(parseInt(savedStreak));

    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) setPoints(parseInt(savedPoints));

    const savedMood = localStorage.getItem("userMood") as Mood;
    if (savedMood) {
      setMood(savedMood);
    } else {
      setMoodModalOpen(true);
    }

    const savedDate = localStorage.getItem("examDate");
    if (savedDate) {
      setExamDate(savedDate);
    } else {
      const def = new Date();
      def.setDate(def.getDate() + 45);
      const str = def.toISOString().split("T")[0];
      setExamDate(str);
      localStorage.setItem("examDate", str);
    }

    // API key is preconfigured directly in the system.

    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save changes state helper
  const saveCardsState = (newCards: Card[]) => {
    setCards(newCards);
    localStorage.setItem("retrieval_cards", JSON.stringify(newCards));
  };

  // --- TIMER EFFECT ---
  const activeCard = filteredQueue[currentQueueIndex];
  
  useEffect(() => {
    if (activeTab === "retrieval" && activeCard && !flipped) {
      // Start Timer
      setSecondsElapsed(0);
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000) as unknown as number;
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [activeTab, activeCard, flipped]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- RECALCULATE DUE QUEUE & DISTRIBUTION ---
  const now = new Date().getTime();
  
  // Calculate stats for active subject
  const getSubjectStats = () => {
    const stats = {
      green: { total: 0, s1: 0, s2: 0, s3: 0, mastered: 0 },
      yellow: { total: 0, s1: 0, s2: 0, s3: 0, mastered: 0 },
      red: { total: 0, s1: 0, s2: 0, s3: 0, mastered: 0 },
      box1: 0,
      box2: 0,
      box3: 0,
      due: 0,
      total: 0
    };

    let isCompressed = false;
    if (examDate && settings.examMode) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const diff = Math.ceil((new Date(examDate).getTime() - today.getTime()) / (1000*60*60*24));
      if (diff > 0 && diff <= 30) isCompressed = true;
    }

    // Burnout alert trigger count
    let box1Total = 0;
    cards.forEach(c => {
      if (c.subjectId === activeSubject && c.box === 1) box1Total++;
    });
    const triggerBurnout = settings.antiBurnout && box1Total > 5;

    cards.forEach(card => {
      if (card.subjectId !== activeSubject) return;

      stats.total++;
      const type = card.type;
      stats[type].total++;

      if (card.box === 1) {
        stats[type].s1++;
        stats.box1++;
      } else if (card.box === 2) {
        stats[type].s2++;
        stats.box2++;
      } else {
        stats[type].s3++;
        stats[type].mastered++;
        stats.box3++;
      }

      // due date check
      let isDue = false;
      if (!card.nextReviewDate) {
        isDue = true;
      } else {
        const reviewTime = new Date(card.nextReviewDate).getTime();
        let intervalReduction = 1;
        if (isCompressed) {
          if (card.box === 2) intervalReduction = 0.4;
          if (card.box === 3) intervalReduction = 0.3;
        }

        const adjustedNextReview = card.lastReviewed ?
          new Date(card.lastReviewed).getTime() + (reviewTime - new Date(card.lastReviewed).getTime()) * intervalReduction :
          reviewTime;

        if (adjustedNextReview <= now) isDue = true;
      }

      if (isDue) {
        if (triggerBurnout && card.box > 1) {
          // postponed easy card
        } else {
          stats.due++;
        }
      }
    });

    return { stats, triggerBurnout, isCompressed };
  };

  const { stats, triggerBurnout, isCompressed } = getSubjectStats();

  // --- RECALCULATE DETAILED QUEUE IN STUDY VIEWS ---
  useEffect(() => {
    rebuildStudyQueue();
  }, [cards, activeSubject, filterChapter, filterBloom, filterBox, forcePracticeAll, mood, triggerBurnout, isCompressed]);

  const rebuildStudyQueue = () => {
    let list = cards.filter(card => {
      if (card.subjectId !== activeSubject) return false;
      if (filterChapter !== "all" && card.chapterId !== filterChapter) return false;
      
      // Bloom types
      if (card.type === "green" && !filterBloom.green) return false;
      if (card.type === "yellow" && !filterBloom.yellow) return false;
      if (card.type === "red" && !filterBloom.red) return false;

      // Boxes filter
      if (card.box === 1 && !filterBox.box1) return false;
      if (card.box === 2 && !filterBox.box2) return false;
      if (card.box === 3 && !filterBox.box3) return false;

      if (forcePracticeAll) return true;

      // Due check
      let isDue = false;
      if (!card.nextReviewDate) {
        isDue = true;
      } else {
        const reviewTime = new Date(card.nextReviewDate).getTime();
        let intervalReduction = 1;
        if (isCompressed) {
          if (card.box === 2) intervalReduction = 0.4;
          if (card.box === 3) intervalReduction = 0.3;
        }

        const adjustedNextReview = card.lastReviewed ?
          new Date(card.lastReviewed).getTime() + (reviewTime - new Date(card.lastReviewed).getTime()) * intervalReduction :
          reviewTime;

        if (adjustedNextReview <= now) isDue = true;
      }

      if (isDue && triggerBurnout && card.box > 1) return false;

      return isDue;
    });

    // Flow difficulty sort
    if (mood === "tired" || mood === "stressed") {
      list.sort((a, b) => {
        const priority = { green: 1, yellow: 2, red: 3 };
        return priority[a.type] - priority[b.type];
      });
    } else if (mood === "excited" || mood === "focused") {
      list.sort((a, b) => {
        const priority = { red: 1, yellow: 2, green: 3 };
        return priority[a.type] - priority[b.type];
      });
    } else {
      // Normal: Shuffle slightly or keep default order
    }

    setFilteredQueue(list);
  };

  // --- EXAMS COUNTDOWN DAYS ---
  const getExamDaysLeft = () => {
    if (!examDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diff = exam.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const diffDays = getExamDaysLeft();

  // --- SUBJECT CHAPTER CODES ---
  const getChapterName = (chId: string) => {
    const ch = INITIAL_SUBJECTS[activeSubject]?.chapters.find(c => c.id === chId);
    return ch ? ch.name : "Khác";
  };

  // --- GEMINI API INTEGRATIONS ---
  const callGemini = async (prompt: string, sysPrompt: string = "") => {
    if (!geminiApiKey) throw new Error("API Key chưa được thiết lập.");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const body: any = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (sysPrompt) {
      body.systemInstruction = {
        parts: [{ text: sysPrompt }]
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const callGeminiMultimodal = async (prompt: string, base64: string, mime: string, sysPrompt: string = "") => {
    if (!geminiApiKey) throw new Error("API Key chưa được thiết lập.");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const body: any = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mime, data: base64 } }
        ]
      }]
    };
    if (sysPrompt) {
      body.systemInstruction = {
        parts: [{ text: sysPrompt }]
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  // --- CARD GRADE CLICK HANDLERS ---
  const handleFlipCard = () => {
    if (!activeCard) return;

    if (activeCard.type === "green") {
      if (selectedGreenOption === null) {
        alert("Vui lòng lựa chọn phương án trước!");
        return;
      }
      const isCorrect = selectedGreenOption === activeCard.correctOption;
      setFlipped(true);
      fetchTutorGradingFeedback(activeCard.options?.[selectedGreenOption] || "", isCorrect);
    } else {
      if (!essayAnswer.trim()) {
        alert("Hãy nhập bài giải/câu trả lời tự luận trước khi lật thẻ!");
        return;
      }
      setFlipped(true);
      fetchTutorGradingFeedback(essayAnswer, true);
    }
  };

  const fetchTutorGradingFeedback = (ans: string, greenCorrect: boolean) => {
    setTutorCardFeedback("Đang kết nối Gia sư AI chấm điểm...");
    
    if (geminiApiKey) {
      const prompt = `Câu hỏi ôn tập: "${activeCard.question}"
Đáp án chuẩn mẫu: "${activeCard.modelAnswer}"
Câu trả lời của học sinh: "${ans}"

Nhiệm vụ của bạn là hãy đóng vai trò là một Gia sư AI chấm bài và nhận xét trực tiếp bài tập cho học sinh lớp 12.
Hãy phân tích và viết một phản hồi ngắn gọn (khoảng 3-4 câu) bằng tiếng Việt cho học sinh.
Đánh giá độ chính xác (ví dụ đúng khoảng bao nhiêu phần trăm, có ghi được các ý/công thức cốt lõi hay không), chỉ ra lỗi sai kiến thức hoặc hiểu lầm (nếu có), và cung cấp 1 mẹo học tập hoặc định hướng nhanh để cải thiện trí nhớ. Hãy trả lời cực kỳ súc tích, thân thiện và động viên học sinh.`;

      callGemini(prompt, "Bạn là Gia sư AI chấm bài cho học sinh THPT Hóa học 12 và Vật lý 12.")
        .then(res => {
          setTutorCardFeedback(res);
        })
        .catch(err => {
          console.error(err);
          setTutorCardFeedback(`[Lỗi AI thực tế: ${err.message}]. Khuyến nghị xem đáp án chi tiết phía trên để so sánh bài làm.`);
        });
    } else {
      // Mock grading
      setTimeout(() => {
        let feedback = "";
        if (activeCard.type === "green") {
          if (greenCorrect) {
            feedback = `Chính xác! Bạn nhớ rất tốt công thức lý thuyết này. Điểm mấu chốt là: ${activeCard.modelAnswer.split('.')[0]}. Bạn đã sẵn sàng luyện các thẻ Vàng/Đỏ liên chương liên quan.`;
          } else {
            feedback = `Sai rồi! Đừng lo lắng, đây là hiện tượng đứt gãy trí nhớ ngắn hạn. Hãy nhớ rằng: ${activeCard.modelAnswer}. Gợi ý bạn ghi chú lại công thức này vào vở nháp và thử lại ở hộp tiếp theo.`;
          }
        } else {
          const length = ans.length;
          const keywords = activeSubject === "chemistry" ? ["phản ứng", "este", "axit"] : ["dao động", "ma sát", "tần số"];
          const matches = keywords.filter(k => ans.toLowerCase().includes(k));
          
          if (length < 15) {
            feedback = `Bài làm của bạn hơi ngắn. Để tránh ảo tưởng năng lực, bạn nên viết chi tiết các bước lập luận lý thuyết. Hãy so sánh kỹ với đáp án chuẩn bên trên để bổ sung mảnh kiến thức thiếu nhé.`;
          } else if (matches.length < 1) {
            feedback = `Lập luận của bạn đã đi đúng hướng nhưng thiếu các thuật ngữ cốt lõi (như: ${keywords.join(', ')}). Vui lòng so sánh kỹ với đáp án mẫu.`;
          } else {
            feedback = `Phân tích rất tốt! Bạn đã sử dụng chính xác thuật ngữ cốt lõi để lập luận. Giải thích của bạn khớp khoảng 80% với đáp án chuẩn. Đừng quên ôn tập để củng cố nhé.`;
          }
        }
        setTutorCardFeedback(feedback);
      }, 400);
    }
  };

  const handleGradeSubmit = (grade: 'vhard' | 'hard' | 'easy' | 'veasy') => {
    let penaltyTriggered = false;
    let newBox = activeCard.box;
    let newNextReview = "";

    // Save session logs
    const sessionLogs = [...sessionReviewedCards, { cardId: activeCard.id, oldBox: activeCard.box }];
    setSessionReviewedCards(sessionLogs);

    // Time penalty
    if (secondsElapsed > 30 && (grade === "easy" || grade === "veasy") && settings.adaptivePenalty) {
      penaltyTriggered = true;
      newBox = activeCard.box === 3 ? 2 : 1;
      setConsecutiveEasyCount(0);
      alert(`⚠️ HỆ THỐNG ADAPTIVE: Bạn mất ${secondsElapsed}s để giải một thẻ Dễ. AI đánh giá phản xạ kiến thức chưa vững vàng nên đã hạ bậc để thẻ xuất hiện thường xuyên hơn!`);
    }

    if (!penaltyTriggered) {
      if (grade === "vhard") {
        newBox = 1;
        newNextReview = new Date(new Date().getTime() + 10 * 60 * 1000).toISOString();
        setConsecutiveEasyCount(0);
      } else if (grade === "hard") {
        newBox = 1;
        newNextReview = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(); // 1 day
        setConsecutiveEasyCount(0);
      } else if (grade === "easy") {
        newBox = Math.min(3, activeCard.box + 1);
        const days = newBox === 2 ? 3 : 7;
        newNextReview = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toISOString();
        setConsecutiveEasyCount(prev => prev + 1);
      } else if (grade === "veasy") {
        newBox = 3;
        newNextReview = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
        setConsecutiveEasyCount(prev => prev + 1);
      }
    }

    const updated = cards.map(c => {
      if (c.id === activeCard.id) {
        return {
          ...c,
          box: newBox,
          lastReviewed: new Date().toISOString(),
          nextReviewDate: newNextReview || null,
          history: [...c.history, { date: new Date().toISOString(), grade, timeTaken: secondsElapsed, penalty: penaltyTriggered }]
        };
      }
      return c;
    });

    saveCardsState(updated);

    // Points addition
    const pts = { vhard: 5, hard: 10, easy: 20, veasy: 30 };
    setPoints(prev => {
      const added = prev + (pts[grade] || 10);
      localStorage.setItem("userPoints", added.toString());
      return added;
    });

    // Reset card UI states
    setSelectedGreenOption(null);
    setEssayAnswer("");
    setFlipped(false);

    // Check pop-up trigger
    const easyStreak = (grade === "easy" || grade === "veasy") && !penaltyTriggered ? consecutiveEasyCount + 1 : 0;
    
    if (easyStreak >= 4 && settings.popupCheckpoint) {
      setConsecutiveEasyCount(0);
      triggerCheckpoint();
    } else {
      setCurrentQueueIndex(prev => prev + 1);
    }
  };

  // --- POPUP CHECKPOINT ---
  const triggerCheckpoint = () => {
    const list = CHECKPOINT_QUESTIONS[activeSubject] || CHECKPOINT_QUESTIONS.chemistry;
    const q = list[Math.floor(Math.random() * list.length)];
    setCheckpointQuestion(q);
    setCheckpointSelectedIdx(null);
    setCheckpointFeedback({ status: null, text: "" });
    setCheckpointModalOpen(true);
  };

  const handleCheckpointSelect = (idx: number) => {
    if (!checkpointQuestion) return;
    setCheckpointSelectedIdx(idx);

    const isCorrect = idx === checkpointQuestion.correct;
    if (isCorrect) {
      setCheckpointFeedback({
        status: "success",
        text: `Chính xác! ${checkpointQuestion.explanation} \n\nNhấp Bắt đầu lại hoặc cửa sổ sẽ đóng sau 3 giây...`
      });
      setPoints(prev => {
        const added = prev + 50;
        localStorage.setItem("userPoints", added.toString());
        return added;
      });

      setTimeout(() => {
        setCheckpointModalOpen(false);
        setCurrentQueueIndex(prev => prev + 1);
      }, 3500);

    } else {
      setCheckpointFeedback({
        status: "fail",
        text: `Sai rồi! Bạn đã bị phát hiện "ẢO TƯỞNG NHẬN THỨC". \nGiải thích: ${checkpointQuestion.explanation}\n\nToàn bộ ${sessionReviewedCards.length + 1} thẻ bạn vừa bấm Dễ trong phiên này đã bị phạt trả ngược về Ngăn 1!`
      });

      // Downgrade all cards reviewed in current session
      const updated = cards.map(c => {
        const isReviewed = sessionReviewedCards.some(item => item.cardId === c.id) || c.id === activeCard.id;
        if (isReviewed) {
          return {
            ...c,
            box: 1,
            nextReviewDate: new Date().toISOString() // review immediately
          };
        }
        return c;
      });

      saveCardsState(updated);
      setSessionReviewedCards([]);

      setTimeout(() => {
        setCheckpointModalOpen(false);
        // reload queue
        setCurrentQueueIndex(0);
      }, 6000);
    }
  };

  // --- DYNAMIC AI ROADMAP & FILE SCANNING ---
  const handleSelectOCRFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOcrFileName(file.name);
      setOcrFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      setOcrStatus("idle");
      setActiveRoadmap(null);

      const extension = file.name.split('.').pop()?.toLowerCase();
      const reader = new FileReader();

      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
        reader.onload = (evt) => {
          if (evt.target?.result) {
            setOcrPreviewSrc(evt.target.result as string);
            setActiveOCRBase64((evt.target.result as string).split(",")[1]);
            setActiveOCRMimeType(file.type);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // PDF, DOCX, TXT
        reader.onload = (evt) => {
          if (evt.target?.result) {
            const raw = evt.target.result as string;
            // Clean binary tags to keep readable text strings
            const cleaned = raw.replace(/[^\x20-\x7E\u00C0-\u1EF9\s]/g, ' ').substring(0, 12000);
            setActiveOCRBase64(cleaned);
            setActiveOCRMimeType("text/plain");
            setOcrPreviewSrc(""); // Clear image preview for text docs
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handlePresetSelect = (preset: string) => {
    setOcrPresetsSel(preset);
    setOcrStatus("idle");
    setActiveRoadmap(null);
    setActiveOCRBase64(""); // Reset custom raw content

    if (preset === "chemistry-este") {
      setOcrPreviewSrc("https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=500&q=80");
      setOcrFileName("chuyen_de_este_nang_cao.pdf");
      setOcrFileSize("1.2 MB");
    } else {
      setOcrPreviewSrc("https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=500&q=80");
      setOcrFileName("song_co_va_song_am.docx");
      setOcrFileSize("890 KB");
    }
  };

  const triggerOCRScan = () => {
    setOcrStatus("scanning");
    setOcrStep(1);

    const runOfflineMock = () => {
      setTimeout(() => setOcrStep(2), 1200);
      setTimeout(() => setOcrStep(3), 2400);
      setTimeout(() => {
        setOcrStatus("done");
        const presetData = ROADMAP_PRESETS[ocrPresetsSel] || ROADMAP_PRESETS["chemistry-este"];
        setActiveRoadmap(presetData);
        if (presetData.milestones.length > 0) {
          setSelectedMilestoneId(presetData.milestones[0].id);
        }
      }, 3600);
    };

    if (geminiApiKey) {
      const presetSubject = ocrPresetsSel.includes("chemistry") ? "Hóa học 12" : "Vật lý 12";
      let prompt = `Bạn nhận được nội dung tài liệu học tập của học sinh. Môn học: ${presetSubject}.`;
      if (activeOCRBase64 && activeOCRMimeType === "text/plain") {
        prompt += `\nNội dung văn bản trích xuất thô từ tài liệu:\n"${activeOCRBase64}"`;
      } else if (!activeOCRBase64) {
        const desc = ocrPresetsSel === "chemistry-este" ? 
          "Đề cương Chuyên đề Este - Lipit (khái niệm este, phản ứng este hóa, vinyl axetat, xà phòng hóa lipid, glixerol, este hữu cơ phức tạp)" : 
          "Bài giảng Sóng cơ học và Sóng âm (khái niệm sóng cơ, sóng dọc, sóng ngang, chu kỳ dao động, tốc độ truyền sóng, bước sóng, giao thoa sóng, cộng hưởng sáo trúc)";
        prompt += `\nNội dung tài liệu ôn tập: "${desc}"`;
      }

      prompt += `\n\nNhiệm vụ của bạn là hãy phân tích tài liệu này và thiết lập một Lộ trình học tập cá nhân hóa (Learning Roadmap) gồm đúng 3 chặng học tập (Milestones) sắp xếp theo mức độ nhận thức tăng dần của Bloom's Taxonomy.
Tạo ra 1 câu hỏi kiểm tra (Retrieval Card) ứng với mỗi chặng:
- Chặng 1: Thẻ Xanh (Recall - trắc nghiệm 4 lựa chọn).
- Chặng 2: Thẻ Vàng (Apply - câu hỏi tự luận vận dụng ngắn).
- Chặng 3: Thẻ Đỏ (Synthesize - câu hỏi tự luận tổng hợp sâu/liên chương).

Đầu ra phải là một chuỗi JSON hợp lệ theo đúng cấu trúc sau (không bao bọc trong khối code markdown, không thừa ký tự ngoài JSON):
{
  "id": "rm-${Date.now()}",
  "topicName": "Tên chuyên đề tổng quát rút ra từ tài liệu",
  "difficulty": "Dễ" | "Trung bình" | "Khó",
  "milestones": [
    {
      "id": "ms1",
      "title": "Tên Chặng 1",
      "description": "Mô tả mục tiêu chặng này",
      "timeEstimate": "15 phút",
      "status": "active",
      "cards": [
        {
          "id": "card-ms1-${Date.now()}",
          "subjectId": "${ocrPresetsSel.includes("chemistry") ? "chemistry" : "physics"}",
          "chapterId": "${ocrPresetsSel.includes("chemistry") ? "c1" : "p2"}",
          "type": "green",
          "question": "Câu hỏi trắc nghiệm chặng 1",
          "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
          "correctOption": 1,
          "modelAnswer": "Giải thích chi tiết...",
          "reference": "Trích nguồn tài liệu"
        }
      ]
    },
    {
      "id": "ms2",
      "title": "Tên Chặng 2",
      "description": "Mô tả mục tiêu chặng này",
      "timeEstimate": "25 phút",
      "status": "locked",
      "cards": [
        {
          "id": "card-ms2-${Date.now()}",
          "subjectId": "${ocrPresetsSel.includes("chemistry") ? "chemistry" : "physics"}",
          "chapterId": "${ocrPresetsSel.includes("chemistry") ? "c1" : "p2"}",
          "type": "yellow",
          "question": "Câu hỏi tự luận vận dụng ngắn chặng 2",
          "options": null,
          "correctOption": null,
          "modelAnswer": "Bài giải chi tiết...",
          "reference": "Trích nguồn tài liệu"
        }
      ]
    },
    {
      "id": "ms3",
      "title": "Tên Chặng 3",
      "description": "Mô tả mục tiêu chặng này",
      "timeEstimate": "35 phút",
      "status": "locked",
      "cards": [
        {
          "id": "card-ms3-${Date.now()}",
          "subjectId": "${ocrPresetsSel.includes("chemistry") ? "chemistry" : "physics"}",
          "chapterId": "${ocrPresetsSel.includes("chemistry") ? "c1" : "p2"}",
          "type": "red",
          "question": "Câu hỏi tự luận tổng hợp liên chương chặng 3",
          "options": null,
          "correctOption": null,
          "modelAnswer": "Bài giải chi tiết...",
          "reference": "Trích nguồn tài liệu"
        }
      ]
    }
  ]
}`;

      setTimeout(() => {
        setOcrStep(2);
      }, 1000);

      setTimeout(() => {
        setOcrStep(3);
        
        let apiCall;
        if (activeOCRBase64 && activeOCRMimeType !== "text/plain") {
          apiCall = callGeminiMultimodal(prompt, activeOCRBase64, activeOCRMimeType, "Bạn là chuyên gia thiết kế sơ đồ học liệu AI THPT.");
        } else {
          apiCall = callGemini(prompt, "Bạn là chuyên gia thiết kế sơ đồ học liệu AI THPT.");
        }

        apiCall.then(res => {
          try {
            let clean = res.trim();
            if (clean.startsWith("```json")) clean = clean.substring(7);
            if (clean.endsWith("```")) clean = clean.substring(0, clean.length - 3);
            clean = clean.trim();
            
            const parsed = JSON.parse(clean);
            setActiveRoadmap(parsed);
            if (parsed.milestones && parsed.milestones.length > 0) {
              setSelectedMilestoneId(parsed.milestones[0].id);
            }
            setOcrStatus("done");
          } catch(e) {
            console.error("Failed to parse Gemini Roadmap JSON response", e, res);
            runOfflineMock();
          }
        }).catch(err => {
          console.error(err);
          alert(`Lỗi API thực tế: ${err.message}. Hệ thống chuyển đổi sang mô phỏng Lộ trình mẫu.`);
          runOfflineMock();
        });
      }, 2000);
    } else {
      runOfflineMock();
    }
  };

  const handleApproveMilestone = (milestoneId: string) => {
    if (!activeRoadmap) return;
    const ms = activeRoadmap.milestones.find(m => m.id === milestoneId);
    if (!ms) return;

    // Filter duplicates
    const cleanCardsToAdd = ms.cards.filter(cAdd => !cards.some(c => c.question === cAdd.question));
    if (cleanCardsToAdd.length === 0) {
      alert("Chặng này đã được kích hoạt từ trước!");
      return;
    }

    const updated = [...cards, ...cleanCardsToAdd];
    saveCardsState(updated);

    // Update statuses
    const updatedMilestones = activeRoadmap.milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, status: "completed" as const };
      }
      // Unlock next
      const currentIdx = activeRoadmap.milestones.findIndex(x => x.id === milestoneId);
      const nextIdx = activeRoadmap.milestones.findIndex(x => x.id === m.id);
      if (nextIdx === currentIdx + 1 && m.status === "locked") {
        return { ...m, status: "active" as const };
      }
      return m;
    });

    setActiveRoadmap({
      ...activeRoadmap,
      milestones: updatedMilestones
    });

    setPoints(prev => {
      const added = prev + 30;
      localStorage.setItem("userPoints", added.toString());
      return added;
    });

    alert(`🎉 Kích hoạt thành công Chặng: "${ms.title}". ${cleanCardsToAdd.length} thẻ truy hồi đã được đưa vào tủ Leitner!`);
  };

  const handleApproveOCR = () => {
    if (!activeRoadmap) return;

    let allCardsToAdd: Card[] = [];
    activeRoadmap.milestones.forEach(ms => {
      const cleanCards = ms.cards.filter(cAdd => !cards.some(c => c.question === cAdd.question));
      allCardsToAdd = [...allCardsToAdd, ...cleanCards];
    });

    if (allCardsToAdd.length === 0) {
      alert("Lộ trình này đã được kích hoạt hoàn toàn!");
      return;
    }

    const updated = [...cards, ...allCardsToAdd];
    saveCardsState(updated);

    const completedMilestones = activeRoadmap.milestones.map(m => ({ ...m, status: "completed" as const }));
    setActiveRoadmap({
      ...activeRoadmap,
      milestones: completedMilestones
    });

    setPoints(prev => {
      const added = prev + 100;
      localStorage.setItem("userPoints", added.toString());
      return added;
    });

    alert(`🎉 Kích hoạt toàn bộ lộ trình thành công! Đã thêm tất cả ${allCardsToAdd.length} thẻ truy hồi vào tủ thẻ Ngăn 1.`);
  };

  // --- AI TUTOR LIVE CHAT ---
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const query = chatInput;
    setChatInput("");

    const newHistory = [...chatHistory, { sender: "user" as const, text: query }];
    setChatHistory(newHistory);

    setChatThinking(true);

    if (geminiApiKey) {
      const sysInstruction = "Bạn là Gia sư AI Retrieval Box, một gia sư thân thiện, chuyên môn cao hỗ trợ học sinh THPT học tốt Hóa học 12 và Vật lý 12 chương trình giáo dục Việt Nam. Hãy trả lời các câu hỏi, giải thích cặn kẽ công thức, bài tập tự luận, và cung cấp mẹo ghi nhớ (spaced repetition) hoặc mẹo làm bài nhanh bằng định dạng Markdown đẹp mắt.";
      
      callGemini(query, sysInstruction)
        .then(res => {
          setChatHistory([...newHistory, { sender: "tutor", text: res }]);
          setChatThinking(false);
        })
        .catch(err => {
          console.error(err);
          setChatHistory([...newHistory, { sender: "tutor", text: `[Lỗi kết nối Gemini API: ${err.message}]. Gợi ý: Hãy kiểm tra mạng hoặc API Key của bạn.` }]);
          setChatThinking(false);
        });
    } else {
      setTimeout(() => {
        let reply = "";
        const lower = query.toLowerCase();
        if (lower.includes("este") || lower.includes("chất béo") || lower.includes("xà phòng")) {
          reply = `### Phân tích Phản ứng Xà phòng hóa (Chương 1)\n\nPhản ứng xà phòng hóa là phản ứng thủy phân este/lipid trong môi trường kiềm (NaOH, KOH) nóng. Đây là phản ứng một chiều.\n\n**Phương trình tổng quát:**\n(RCOO)3C3H5 (chất béo) + 3NaOH -t°-> 3RCOONa (xà phòng) + C3H5(OH)3 (glixerol)\n\n**Mẹo ôn tập:**\n- Axit oleic (C17H33COOH) và Axit linoleic (C17H31COOH) là axit béo không no (lỏng ở t° thường).\n- Axit panmitic (C15H31COOH) và Axit stearic (C17H35COOH) là axit béo no (rắn ở t° thường).`;
        } else if (lower.includes("sóng") || lower.includes("dao động") || lower.includes("con lắc")) {
          reply = `### Phân tích Năng lượng Dao động & Sóng cơ (Vật lý 12)\n\nCon lắc đơn và con lắc lò xo khi dao động trong thực tế luôn có lực cản (ma sát) sinh công âm làm cơ năng hao hụt dần dưới dạng nhiệt lượng. Đó là **dao động tắt dần**.\n\n**Công thức đặc trưng:**\n- Cơ năng giảm tỷ lệ thuận với số chu kỳ dao động thực hiện: ΔE = F_ms * S (S là tổng quãng đường).\n- Khi sóng truyền qua các môi trường, tần số f không đổi, tốc độ và bước sóng thay đổi: $v_{rắn} > v_{lỏng} > v_{khí}$.`;
        } else {
          reply = `Chào bạn! Mình đã nhận câu hỏi của bạn. Gợi ý bạn hãy quay lại học các thẻ xanh/vàng trước để nắm vững lý thuyết, hoặc nhập công thức để mình giải thích từng bước nhé!`;
        }
        setChatHistory([...newHistory, { sender: "tutor", text: reply }]);
        setChatThinking(false);
      }, 1000);
    }
  };

  // --- KNOWLEDGE MAP CONFIGS ---
  const handleMapNodeClick = (chId: string) => {
    // Check locked state: prerequisite chapters must be mastered (all cards in box 3)
    const ch = INITIAL_SUBJECTS[activeSubject]?.chapters.find(c => c.id === chId);
    if (!ch) return;

    const locked = ch.prerequisites.some(preId => {
      const preCards = cards.filter(c => c.subjectId === activeSubject && c.chapterId === preId);
      if (preCards.length === 0) return false;
      const b3Count = preCards.filter(c => c.box === 3).length;
      return b3Count < preCards.length; // locked if prerequisite cards not fully mastered
    });

    if (locked) {
      alert("🔒 Chương này đang bị khóa! Bạn cần hoàn thành tất cả thẻ ở các chương tiên quyết trước để tránh đứt gãy nhận thức.");
      return;
    }

    setSelectedMapNodeId(chId);
  };

  const getNodeState = (chId: string, prerequisites: string[]) => {
    const chapterCards = cards.filter(c => c.subjectId === activeSubject && c.chapterId === chId);
    if (chapterCards.length === 0) return "mastered";

    const b3Count = chapterCards.filter(c => c.box === 3).length;
    const greenYellowB3Count = chapterCards.filter(c => c.box === 3 && (c.type === "green" || c.type === "yellow")).length;
    const greenYellowTotal = chapterCards.filter(c => c.type === "green" || c.type === "yellow").length;

    // Prereq check
    const locked = prerequisites.some(preId => {
      const preCards = cards.filter(c => c.subjectId === activeSubject && c.chapterId === preId);
      if (preCards.length === 0) return false;
      return preCards.filter(c => c.box === 3).length < preCards.length;
    });

    if (locked) return "locked";
    if (b3Count === chapterCards.length) return "mastered";
    if (greenYellowTotal > 0 && greenYellowB3Count === greenYellowTotal) return "red-ready";
    return "active";
  };

  // SVG parameters based on subject
  const getMapNodesCoords = () => {
    if (activeSubject === "chemistry") {
      return [
        { id: "c1", x: 120, y: 220 },
        { id: "c2", x: 340, y: 140 },
        { id: "c3", x: 560, y: 220 },
        { id: "c4", x: 780, y: 320 }
      ];
    } else {
      return [
        { id: "p1", x: 150, y: 220 },
        { id: "p2", x: 450, y: 150 },
        { id: "p3", x: 750, y: 280 }
      ];
    }
  };

  const coords = getMapNodesCoords();

  return (
    <div className="app-container">
      {/* Sidebar Menu */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-glow"></div>
          <i className="fa-solid fa-box-archive logo-icon"></i>
          <div className="brand-text">
            <span className="title-main">Retrieval</span>
            <span className="title-sub">Box AI</span>
          </div>
        </div>

        <nav className="nav-menu">
          <a onClick={() => setActiveTab("dashboard")} className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Bảng điều khiển</span>
          </a>
          <a onClick={() => { setActiveTab("retrieval"); setForcePracticeAll(false); }} className={`nav-item ${activeTab === "retrieval" ? "active" : ""}`}>
            <i className="fa-solid fa-clone"></i>
            <span>Thẻ truy hồi</span>
            {stats.due > 0 && <span className="badge">{stats.due}</span>}
          </a>
          <a onClick={() => setActiveTab("ocr")} className={`nav-item ${activeTab === "ocr" ? "active" : ""}`}>
            <i className="fa-solid fa-expand"></i>
            <span>Số hóa & AI OCR</span>
          </a>
          <a onClick={() => setActiveTab("knowledge-map")} className={`nav-item ${activeTab === "knowledge-map" ? "active" : ""}`}>
            <i className="fa-solid fa-network-wired"></i>
            <span>Bản đồ tri thức</span>
          </a>
          <a onClick={() => setActiveTab("tutor")} className={`nav-item ${activeTab === "tutor" ? "active" : ""}`}>
            <i className="fa-solid fa-graduation-cap"></i>
            <span>Gia sư AI</span>
          </a>
          <a onClick={() => setActiveTab("settings")} className={`nav-item ${activeTab === "settings" ? "active" : ""}`}>
            <i className="fa-solid fa-sliders"></i>
            <span>Cấu hình học tập</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar-ring">
              <div className="avatar">HS</div>
            </div>
            <div className="user-info">
              <span className="user-name">Học sinh THPT</span>
              <span className="user-role">Lớp 12 - Hóa/Lý</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <div className="subject-selector-wrapper">
              <i className="fa-solid fa-book-bookmark text-primary"></i>
              <select 
                id="subject-selector" 
                className="subject-select" 
                value={activeSubject}
                onChange={(e) => {
                  setActiveSubject(e.target.value);
                  setSelectedMapNodeId(null);
                }}
              >
                <option value="chemistry">🧪 Hóa Học 12</option>
                <option value="physics">⚡ Vật Lý 12</option>
              </select>
            </div>
          </div>

          <div className="header-right">
            {/* Mood pill */}
            <div className="header-stat mood-pill" onClick={() => setMoodModalOpen(true)} title="Cập nhật cảm xúc học tập">
              <span className="stat-icon">
                {mood === "excited" ? "🔥" : mood === "focused" ? "🎯" : mood === "tired" ? "🥱" : mood === "stressed" ? "🤯" : "😐"}
              </span>
              <div className="stat-text">
                <span className="stat-label">Cảm xúc</span>
                <span className="stat-value">
                  {mood === "excited" ? "Hào hứng" : mood === "focused" ? "Tập trung" : mood === "tired" ? "Mệt mỏi" : mood === "stressed" ? "Căng thẳng" : "Bình thường"}
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="header-stat streak-pill">
              <i className="fa-solid fa-fire stat-icon text-orange"></i>
              <div className="stat-text">
                <span className="stat-label">Streak</span>
                <span className="stat-value">{streak} ngày</span>
              </div>
            </div>

            {/* Points */}
            <div className="header-stat points-pill">
              <i className="fa-solid fa-star stat-icon text-yellow"></i>
              <div className="stat-text">
                <span className="stat-label">Trí năng</span>
                <span className="stat-value">{points} XP</span>
              </div>
            </div>

            {/* Exam countdown */}
            <div className="header-stat exam-countdown">
              <i className="fa-solid fa-hourglass-half stat-icon text-cyan"></i>
              <div className="stat-text">
                <span className="stat-label">Thi THPT QG</span>
                <span className={`stat-value ${diffDays <= 30 && settings.examMode ? "text-red" : "text-cyan"}`}>
                  {diffDays < 0 ? "Đã thi xong" : `Còn ${diffDays} ngày`}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="content-body">
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <section className="tab-content active">
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h1>Chào mừng quay trở lại ôn tập! 👋</h1>
                  <p>Mỗi ngày dành ra 30 phút rèn luyện để xây dựng cấu trúc não bộ bền vững, chống đứt gãy nhận thức.</p>
                  <div className="banner-cta">
                    <button className="btn btn-primary btn-glow" onClick={() => setActiveTab("retrieval")}>
                      <i className="fa-solid fa-bolt"></i> Ôn tập nhanh theo cảm xúc
                    </button>
                  </div>
                </div>
                <div className="welcome-graphics">
                  <div className="retrieval-box-visual">
                    <div className="box-layer layer-red" title="Synthesize"></div>
                    <div className="box-layer layer-yellow" title="Apply"></div>
                    <div className="box-layer layer-green" title="Recall"></div>
                  </div>
                </div>
              </div>

              {/* Quick stats distribution grids */}
              <div className="stats-grid">
                {/* Green card recall */}
                <div className="stat-card card-glow-green">
                  <div className="stat-header">
                    <span className="badge badge-green">Recall</span>
                    <i className="fa-solid fa-circle-check text-green"></i>
                  </div>
                  <div className="stat-body">
                    <h3>Thẻ Xanh</h3>
                    <p className="stat-desc">Định nghĩa & Công thức</p>
                    <div className="box-distribution">
                      <div className="dist-bar">
                        <span className="bar-s1" title="Ngăn 1" style={{ width: `${stats.green.total ? (stats.green.s1 / stats.green.total) * 100 : 0}%`, backgroundColor: "var(--color-green)" }}></span>
                        <span className="bar-s2" title="Ngăn 2" style={{ width: `${stats.green.total ? (stats.green.s2 / stats.green.total) * 100 : 0}%`, backgroundColor: "var(--color-green)" }}></span>
                        <span className="bar-s3" title="Ngăn 3" style={{ width: `${stats.green.total ? (stats.green.s3 / stats.green.total) * 100 : 0}%`, backgroundColor: "var(--color-green)" }}></span>
                      </div>
                    </div>
                    <div className="stat-info-line">
                      <span>Tổng: <b>{stats.green.total}</b> thẻ</span>
                      <span>Đã vững: <b>{stats.green.mastered}</b></span>
                    </div>
                  </div>
                </div>

                {/* Yellow card apply */}
                <div className="stat-card card-glow-yellow">
                  <div className="stat-header">
                    <span className="badge badge-yellow">Apply</span>
                    <i className="fa-solid fa-chart-simple text-yellow"></i>
                  </div>
                  <div className="stat-body">
                    <h3>Thẻ Vàng</h3>
                    <p className="stat-desc">Vận dụng đơn lẻ</p>
                    <div className="box-distribution">
                      <div className="dist-bar">
                        <span className="bar-s1" title="Ngăn 1" style={{ width: `${stats.yellow.total ? (stats.yellow.s1 / stats.yellow.total) * 100 : 0}%`, backgroundColor: "var(--color-yellow)" }}></span>
                        <span className="bar-s2" title="Ngăn 2" style={{ width: `${stats.yellow.total ? (stats.yellow.s2 / stats.yellow.total) * 100 : 0}%`, backgroundColor: "var(--color-yellow)" }}></span>
                        <span className="bar-s3" title="Ngăn 3" style={{ width: `${stats.yellow.total ? (stats.yellow.s3 / stats.yellow.total) * 100 : 0}%`, backgroundColor: "var(--color-yellow)" }}></span>
                      </div>
                    </div>
                    <div className="stat-info-line">
                      <span>Tổng: <b>{stats.yellow.total}</b> thẻ</span>
                      <span>Đã vững: <b>{stats.yellow.mastered}</b></span>
                    </div>
                  </div>
                </div>

                {/* Red card synthesize */}
                <div className="stat-card card-glow-red">
                  <div className="stat-header">
                    <span className="badge badge-red">Synthesize</span>
                    <i className="fa-solid fa-circle-nodes text-red"></i>
                  </div>
                  <div className="stat-body">
                    <h3>Thẻ Đỏ</h3>
                    <p className="stat-desc">Tổng hợp liên chương</p>
                    <div className="box-distribution">
                      <div className="dist-bar">
                        <span className="bar-s1" title="Ngăn 1" style={{ width: `${stats.red.total ? (stats.red.s1 / stats.red.total) * 100 : 0}%`, backgroundColor: "var(--color-red)" }}></span>
                        <span className="bar-s2" title="Ngăn 2" style={{ width: `${stats.red.total ? (stats.red.s2 / stats.red.total) * 100 : 0}%`, backgroundColor: "var(--color-red)" }}></span>
                        <span className="bar-s3" title="Ngăn 3" style={{ width: `${stats.red.total ? (stats.red.s3 / stats.red.total) * 100 : 0}%`, backgroundColor: "var(--color-red)" }}></span>
                      </div>
                    </div>
                    <div className="stat-info-line">
                      <span>Tổng: <b>{stats.red.total}</b> thẻ</span>
                      <span>Đã vững: <b>{stats.red.mastered}</b></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box status row */}
              <div className="dashboard-row">
                <div className="dashboard-col col-60 glass-panel">
                  <div className="panel-header">
                    <h3><i className="fa-solid fa-box-open text-primary"></i> Trạng thái các hộp thẻ (Hộp Leitner)</h3>
                    <span className="panel-header-action text-muted">Lịch giãn cách ôn tập</span>
                  </div>
                  <div className="boxes-status-container">
                    <div className="box-item">
                      <div className="box-badge-num">1</div>
                      <div className="box-details">
                        <h4>Ngăn 1: Ôn hàng ngày</h4>
                        <p className="text-muted">Kiến thức mới nạp / Dễ quên</p>
                        <div className="progress-bar-container">
                          <div className="progress-fill" style={{ width: `${stats.total ? (stats.box1 / stats.total) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                      <div className="box-count-badge">{stats.box1}</div>
                    </div>

                    <div className="box-item">
                      <div className="box-badge-num bg-yellow">2</div>
                      <div className="box-details">
                        <h4>Ngăn 2: Ôn 2-3 ngày/lần</h4>
                        <p className="text-muted">Kiến thức tạm nhớ ổn định</p>
                        <div className="progress-bar-container">
                          <div className="progress-fill bg-yellow" style={{ width: `${stats.total ? (stats.box2 / stats.total) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                      <div className="box-count-badge">{stats.box2}</div>
                    </div>

                    <div className="box-item">
                      <div className="box-badge-num bg-green">3</div>
                      <div className="box-details">
                        <h4>Ngăn 3: Ôn 7-10 ngày/lần</h4>
                        <p className="text-muted">Kiến thức bền vững dài hạn</p>
                        <div className="progress-bar-container">
                          <div className="progress-fill bg-green" style={{ width: `${stats.total ? (stats.box3 / stats.total) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                      <div className="box-count-badge">{stats.box3}</div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-col col-40 glass-panel">
                  <div className="panel-header">
                    <h3><i className="fa-solid fa-heart-pulse text-red"></i> Trạng thái điều hướng Flow</h3>
                  </div>
                  <div className="flow-card">
                    <div className="flow-status">
                      <i className="fa-solid fa-route text-cyan flow-route-icon"></i>
                      <div>
                        <h4>
                          {mood === "tired" || mood === "stressed" ? "Chế độ Thích ứng: Khởi động Nhẹ" : mood === "excited" || mood === "focused" ? "Chế độ Thích ứng: Đột phá Trí tuệ" : "Chế độ Thích ứng: Phân bổ Interleaving"}
                        </h4>
                        <p className="text-muted">
                          {mood === "tired" || mood === "stressed" ? "AI ưu tiên đẩy thẻ xanh (lý thuyết nhẹ nhàng) lên trước giúp bạn thư thái học tập." : mood === "excited" || mood === "focused" ? "Hào hứng cao độ! AI đẩy các thẻ đỏ và vàng thử thách tư duy phân tích lên trước." : "Cảm xúc cân bằng, AI trộn đều các hộp thẻ theo lộ trình."}
                        </p>
                      </div>
                    </div>
                    {triggerBurnout && (
                      <div className="burnout-indicator alert-box">
                        <i className="fa-solid fa-shield-halved text-orange animate-pulse"></i>
                        <span><b>Chống Burnout:</b> Số thẻ khó quá tải! Đã tự động dời các thẻ dễ sang ngày mai.</span>
                      </div>
                    )}
                    {diffDays <= 30 && settings.examMode && (
                      <div className="exam-mode-indicator alert-box border-cyan">
                        <i className="fa-solid fa-gauge-high text-cyan"></i>
                        <span><b>Nén lộ trình kì thi:</b> Khoảng thời gian ôn tập được rút ngắn tối đa.</span>
                      </div>
                    )}
                    <div className="session-summary-box">
                      <h4>Bài học kế tiếp đề xuất:</h4>
                      <div className={`suggested-deck-badge ${mood === "tired" || mood === "stressed" ? "border-green" : mood === "excited" || mood === "focused" ? "border-red" : "border-yellow"}`}>
                        {mood === "tired" || mood === "stressed" ? (
                          <span><span className="badge badge-green">Thẻ xanh</span> Thuyết lý thuyết & Công thức cốt lõi.</span>
                        ) : mood === "excited" || mood === "focused" ? (
                          <span><span className="badge badge-red">Thẻ đỏ</span> Tổng hợp mở rộng kiến thức liên chương.</span>
                        ) : (
                          <span><span className="badge badge-yellow">Thẻ vàng</span> Bài tập vận dụng đơn lẻ Chương 1.</span>
                        )}
                      </div>
                      <button className="btn btn-secondary btn-full btn-sm" onClick={() => setMoodModalOpen(true)}>
                        <i className="fa-solid fa-face-smile"></i> Cập nhật cảm xúc học tập
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB: RETRIEVAL STUDY PANEL */}
          {activeTab === "retrieval" && (
            <section className="tab-content active">
              <div className="study-layout">
                <div className="study-controls-panel glass-panel">
                  <h3>Bộ lọc ôn tập</h3>
                  <div className="control-group">
                    <label htmlFor="filter-chapter">Chương học:</label>
                    <select 
                      id="filter-chapter" 
                      className="btn-select"
                      value={filterChapter}
                      onChange={(e) => setFilterChapter(e.target.value)}
                    >
                      <option value="all">-- Tất cả chương --</option>
                      {INITIAL_SUBJECTS[activeSubject]?.chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="control-group">
                    <label>Phân loại thẻ (Bloom):</label>
                    <div className="difficulty-checkboxes">
                      <label className="diff-chk-label text-green">
                        <input type="checkbox" checked={filterBloom.green} onChange={(e) => setFilterBloom({...filterBloom, green: e.target.checked})} />
                        <span>Recall (Xanh)</span>
                      </label>
                      <label className="diff-chk-label text-yellow">
                        <input type="checkbox" checked={filterBloom.yellow} onChange={(e) => setFilterBloom({...filterBloom, yellow: e.target.checked})} />
                        <span>Apply (Vàng)</span>
                      </label>
                      <label className="diff-chk-label text-red">
                        <input type="checkbox" checked={filterBloom.red} onChange={(e) => setFilterBloom({...filterBloom, red: e.target.checked})} />
                        <span>Synthesize (Đỏ)</span>
                      </label>
                    </div>
                  </div>
                  <div className="control-group">
                    <label>Ngăn tủ (Leitner):</label>
                    <div className="box-checkboxes">
                      <label>
                        <input type="checkbox" checked={filterBox.box1} onChange={(e) => setFilterBox({...filterBox, box1: e.target.checked})} />
                        <span>Ngăn 1</span>
                      </label>
                      <label>
                        <input type="checkbox" checked={filterBox.box2} onChange={(e) => setFilterBox({...filterBox, box2: e.target.checked})} />
                        <span>Ngăn 2</span>
                      </label>
                      <label>
                        <input type="checkbox" checked={filterBox.box3} onChange={(e) => setFilterBox({...filterBox, box3: e.target.checked})} />
                        <span>Ngăn 3</span>
                      </label>
                    </div>
                  </div>

                  <div className="deck-stats">
                    <div className="deck-stat-item">
                      <span className="lbl">Hôm nay cần ôn:</span>
                      <span className="val text-primary">{stats.due}</span>
                    </div>
                    <div className="deck-stat-item">
                      <span className="lbl">Tổng trong bộ lọc:</span>
                      <span className="val">{filteredQueue.length}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-full" onClick={() => { setForcePracticeAll(false); rebuildStudyQueue(); }}>
                    <i className="fa-solid fa-filter"></i> Áp dụng bộ lọc
                  </button>
                </div>

                <div className="study-arena">
                  {filteredQueue.length === 0 ? (
                    <div className="empty-arena glass-panel" id="empty-arena-view">
                      <i className="fa-solid fa-champagne-glasses text-cyan icon-large"></i>
                      <h2>Tuyệt vời! Đã hoàn thành mục tiêu!</h2>
                      <p>Bạn không có thẻ nào cần ôn tập hôm nay trong bộ lọc này.</p>
                      <button className="btn btn-secondary" onClick={() => {
                        setFilterBox({ box1: true, box2: true, box3: true });
                        setForcePracticeAll(true);
                      }}>Học tất cả thẻ trong kho</button>
                    </div>
                  ) : currentQueueIndex >= filteredQueue.length ? (
                    <div className="empty-arena glass-panel">
                      <i className="fa-solid fa-circle-check text-green icon-large"></i>
                      <h2>Chúc mừng! Đã hoàn tất phiên ôn tập này!</h2>
                      <p>Tất cả thẻ trong bộ lọc đã được đánh giá xếp lịch.</p>
                      <button className="btn btn-primary" onClick={() => {
                        setForcePracticeAll(false);
                        setCurrentQueueIndex(0);
                      }}>Kiểm tra lại lịch ôn tập</button>
                    </div>
                  ) : (
                    <div className="card-display-container" id="card-arena-view">
                      {/* progress */}
                      <div className="deck-progress">
                        <div className="deck-progress-text">
                          Đang học: <span>{currentQueueIndex + 1}</span> / <span>{filteredQueue.length}</span>
                        </div>
                        <div className="deck-progress-bar">
                          <div className="deck-progress-fill" style={{ width: `${((currentQueueIndex + 1) / filteredQueue.length) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* flippable card */}
                      <div className="flashcard-wrapper">
                        <div className={`flashcard type-${activeCard.type} ${flipped ? "flipped" : ""}`}>
                          {/* front */}
                          <div className="card-face card-front">
                            <div className="card-type-header">
                              <span className="card-tag-badge">
                                {activeCard.type === "green" ? "Recall" : activeCard.type === "yellow" ? "Apply" : "Synthesize"}
                              </span>
                              <span className="card-chapter-name">{getChapterName(activeCard.chapterId)}</span>
                              <div className={`card-timer-display ${secondsElapsed > 30 ? "timer-warn" : ""}`}>
                                <i className="fa-regular fa-clock"></i> <span>{secondsElapsed < 10 ? `0${secondsElapsed}` : secondsElapsed}</span>s
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="card-question-text">{activeCard.question}</div>
                              <div className="card-input-container">
                                {activeCard.type === "green" ? (
                                  <div className="quiz-options-grid">
                                    {activeCard.options?.map((opt, idx) => {
                                      let optClass = "quiz-option-btn";
                                      if (selectedGreenOption === idx) optClass += " selected";
                                      return (
                                        <button 
                                          key={idx} 
                                          className={optClass} 
                                          onClick={() => setSelectedGreenOption(idx)}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="essay-input-wrapper">
                                    <textarea 
                                      className="essay-textarea" 
                                      value={essayAnswer}
                                      onChange={(e) => setEssayAnswer(e.target.value)}
                                      placeholder={activeCard.type === "yellow" ? "Nhập bài giải tự luận ngắn..." : "Nhập câu trả lời phân tích tổng hợp..."}
                                    />
                                    <span className="char-limit"><span>{essayAnswer.length}</span> ký tự</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="card-footer">
                              <span className="ref-link">{activeCard.reference}</span>
                              <button className="btn btn-secondary btn-sm" onClick={handleFlipCard}>
                                Xem đáp án & Gợi ý <i className="fa-solid fa-arrow-rotate-right"></i>
                              </button>
                            </div>
                          </div>

                          {/* back */}
                          <div className="card-face card-back">
                            <div className="card-type-header">
                              <span className="card-tag-badge">
                                {activeCard.type === "green" ? "Recall" : activeCard.type === "yellow" ? "Apply" : "Synthesize"}
                              </span>
                              <span className="card-chapter-name">{getChapterName(activeCard.chapterId)}</span>
                            </div>
                            <div className="card-body">
                              <div className="card-answer-heading">ĐÁP ÁN CHUẨN:</div>
                              <div className="card-answer-text">{activeCard.modelAnswer}</div>

                              {activeCard.type !== "green" && (
                                <div className="user-comparison-section">
                                  <hr className="card-divider" />
                                  <div className="card-answer-heading">BÀI LÀM CỦA BẠN:</div>
                                  <p className="user-provided-answer">{essayAnswer}</p>
                                </div>
                              )}

                              <div className="card-tutor-bubble">
                                <div className="tutor-bubble-header">
                                  <i className="fa-solid fa-robot text-cyan"></i>
                                  <span><b>Gia sư AI nhận xét:</b></span>
                                </div>
                                <p className="card-tutor-feedback-text">
                                  {tutorCardFeedback}
                                </p>
                              </div>
                            </div>
                            <div className="card-footer">
                              <span className="ref-link">{activeCard.reference}</span>
                              <button className="btn btn-secondary btn-sm" onClick={() => setFlipped(false)}>
                                <i className="fa-solid fa-arrow-left"></i> Xem lại câu hỏi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* grading */}
                      {flipped && (
                        <div className="grading-panel">
                          <div className="grading-instruction">Bạn đánh giá mức độ nhớ của mình thế nào?</div>
                          <div className="grading-buttons">
                            <button className="btn-grade btn-grade-vhard" onClick={() => handleGradeSubmit("vhard")}>
                              <span className="grade-icon">😭</span>
                              <span className="grade-title">Rất khó</span>
                              <span className="grade-time">Gặp lại sau 10p</span>
                            </button>
                            <button className="btn-grade btn-grade-hard" onClick={() => handleGradeSubmit("hard")}>
                              <span className="grade-icon">😟</span>
                              <span className="grade-title">Khó</span>
                              <span className="grade-time">Về Hộp 1</span>
                            </button>
                            <button className="btn-grade btn-grade-easy" onClick={() => handleGradeSubmit("easy")}>
                              <span className="grade-icon">🙂</span>
                              <span className="grade-title">Dễ</span>
                              <span className="grade-time">Lên Hộp tiếp</span>
                            </button>
                            <button className="btn-grade btn-grade-veasy" onClick={() => handleGradeSubmit("veasy")}>
                              <span className="grade-icon">😎</span>
                              <span className="grade-title">Rất dễ</span>
                              <span className="grade-time">Lên Hộp 3</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TAB: OCR GENERATOR */}
          {activeTab === "ocr" && (
            <section className="tab-content active">
              <div className="ocr-layout">
                <div className="ocr-uploader glass-panel">
                  <div className="panel-header">
                    <h3><i className="fa-solid fa-expand text-primary"></i> Sơ đồ hóa Lộ trình học tập & Số hóa</h3>
                  </div>
                  {ocrStatus === "idle" ? (
                    <div className="drag-zone" onClick={() => document.getElementById("react-ocr-file")?.click()}>
                      <i className="fa-solid fa-folder-open cloud-icon"></i>
                      <h4>Kéo & thả tài liệu hoặc chọn tệp tin</h4>
                      <p className="text-muted">Định dạng hỗ trợ: PDF, DOCX, TXT, PNG, JPG (Tối đa 10MB)</p>
                      <input type="file" id="react-ocr-file" className="hidden" accept="image/*,.pdf,.docx,.txt" onChange={handleSelectOCRFile} />
                    </div>
                  ) : (
                    <div className="uploaded-preview-container">
                      <div className="scanner-window" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                        {ocrPreviewSrc ? (
                          <img src={ocrPreviewSrc} alt="OCR Preview" style={{ width: "100%", height: "auto", maxHeight: "160px", objectFit: "contain" }} />
                        ) : (
                          <div style={{ padding: "2rem", textAlign: "center" }}>
                            <i className="fa-solid fa-file-invoice text-cyan" style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}></i>
                            <p className="text-xs">{ocrFileName}</p>
                          </div>
                        )}
                        <div className={`scan-laser ${ocrStatus === "scanning" ? "scanning" : ""}`}></div>
                      </div>
                      <div className="upload-file-details">
                        <span>{ocrFileName}</span>
                        <span className="text-muted">{ocrFileSize}</span>
                      </div>
                      <button className="btn btn-primary btn-full btn-glow" onClick={triggerOCRScan} disabled={ocrStatus === "scanning"}>
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Khởi tạo Lộ trình học tập AI
                      </button>
                    </div>
                  )}

                  <div className="ocr-simulator-presets">
                    <label>Tài liệu mẫu chuẩn hóa:</label>
                    <div className="preset-buttons">
                      <button className={`btn btn-secondary btn-xs ${ocrPresetsSel === "chemistry-este" ? "active" : ""}`} onClick={() => handlePresetSelect("chemistry-este")}>
                        📝 Đề cương Este - Lipit (PDF)
                      </button>
                      <button className={`btn btn-secondary btn-xs ${ocrPresetsSel === "physics-wave" ? "active" : ""}`} onClick={() => handlePresetSelect("physics-wave")}>
                        📝 Chuyên đề Sóng cơ học (DOCX)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ocr-results glass-panel">
                  <div className="panel-header">
                    <h3><i className="fa-solid fa-road text-cyan"></i> Bản đồ Lộ trình học tập Cá nhân hóa</h3>
                    <span className={`badge ${ocrStatus === "done" ? "badge-green" : "badge-purple"}`}>
                      {ocrStatus === "idle" ? "Đang chờ quét" : ocrStatus === "scanning" ? "Đang lập lộ trình..." : "Đã thiết lập"}
                    </span>
                  </div>

                  {ocrStatus === "idle" && (
                    <div className="ocr-results-empty">
                      <i className="fa-solid fa-route text-muted icon-large"></i>
                      <h4>Kết quả phân tích lộ trình sẽ xuất hiện tại đây</h4>
                      <p className="text-muted">Chọn tài liệu mẫu hoặc tải lên đề cương học tập cá nhân của bạn, AI sẽ bóc tách các khái niệm và xây dựng timeline học chặng thích ứng.</p>
                    </div>
                  )}

                  {ocrStatus === "scanning" && (
                    <div className="ocr-loading-view">
                      <div className="ai-processing-spinner"></div>
                      <h4>AI đang lập sơ đồ chặng thích ứng...</h4>
                      <div className="bloom-steps">
                        <div className={`step-line ${ocrStep >= 1 ? (ocrStep > 1 ? "completed" : "active") : ""}`}>
                          <i className={`fa-solid ${ocrStep > 1 ? "fa-check-circle text-green" : "fa-spinner fa-spin"}`}></i> 📂 Đọc tệp tin và trích xuất siêu dữ liệu...
                        </div>
                        <div className={`step-line ${ocrStep >= 2 ? (ocrStep > 2 ? "completed" : "active") : ""}`}>
                          <i className="fa-solid fa-spinner fa-spin"></i> 🗺️ Tạo chặng học tập & Thẻ truy hồi tương thích...
                        </div>
                      </div>
                    </div>
                  )}

                  {ocrStatus === "done" && activeRoadmap && (
                    <div className="ocr-proposal-view active" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
                        <span className="badge badge-purple" style={{ marginBottom: "0.5rem" }}>Chuyên đề: {activeRoadmap.topicName}</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          <span>Độ khó lộ trình: <b>{activeRoadmap.difficulty}</b></span>
                          <span>Số chặng tích hợp: <b>{activeRoadmap.milestones.length} chặng</b></span>
                        </div>
                      </div>

                      {/* Interactive Visual Timeline Road */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", padding: "1rem 0", margin: "0 1rem" }}>
                        <div style={{ position: "absolute", left: 0, right: 0, height: "4px", backgroundColor: "rgba(255,255,255,0.06)", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}></div>
                        {activeRoadmap.milestones.map((m, mIdx) => {
                          const isSelected = selectedMilestoneId === m.id;
                          let dotBg = "rgba(107, 114, 128, 0.4)";
                          let borderCol = "var(--border-color)";
                          if (m.status === "completed") {
                            dotBg = "var(--color-green)";
                            borderCol = "var(--color-green)";
                          } else if (m.status === "active") {
                            dotBg = "var(--primary)";
                            borderCol = "var(--primary)";
                          }

                          return (
                            <div 
                              key={m.id} 
                              onClick={() => setSelectedMilestoneId(m.id)}
                              style={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                zIndex: 2, 
                                cursor: "pointer", 
                                transform: isSelected ? "scale(1.15)" : "scale(1)", 
                                transition: "all 0.25s ease" 
                              }}
                            >
                              <div style={{ 
                                width: "32px", 
                                height: "32px", 
                                borderRadius: "50%", 
                                backgroundColor: isSelected ? "var(--bg-app)" : dotBg, 
                                border: `2px solid ${isSelected ? "var(--primary)" : borderCol}`,
                                color: isSelected ? "var(--primary)" : "#fff",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                fontWeight: "700", 
                                fontSize: "0.85rem",
                                boxShadow: isSelected ? "0 0 10px var(--primary-glow)" : "none"
                              }}>
                                {m.status === "completed" ? "✓" : mIdx + 1}
                              </div>
                              <span style={{ fontSize: "0.7rem", marginTop: "0.35rem", fontWeight: isSelected ? "700" : "500", color: isSelected ? "var(--primary)" : "var(--text-secondary)" }}>
                                Chặng {mIdx + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Milestone Detail Pane */}
                      {selectedMilestoneId && (() => {
                        const m = activeRoadmap.milestones.find(x => x.id === selectedMilestoneId);
                        if (!m) return null;

                        return (
                          <div className="proposed-card-item" style={{ borderLeftColor: m.status === "completed" ? "var(--color-green)" : m.status === "active" ? "var(--primary)" : "var(--text-muted)", padding: "1.25rem", backgroundColor: "rgba(255,255,255,0.01)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                              <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: "700", fontSize: "1rem" }}>{m.title}</h4>
                              <span className="badge" style={{
                                backgroundColor: m.status === "completed" ? "rgba(16, 185, 129, 0.15)" : m.status === "active" ? "rgba(0, 242, 254, 0.15)" : "rgba(107, 114, 128, 0.15)",
                                color: m.status === "completed" ? "var(--color-green)" : m.status === "active" ? "var(--primary)" : "var(--text-muted)"
                              }}>
                                {m.status === "completed" ? "Đã học" : m.status === "active" ? "Sẵn sàng học" : "🔒 Đang khóa"}
                              </span>
                            </div>
                            <p className="text-muted text-xs mb-4" style={{ lineHeight: "1.4" }}>{m.description}</p>
                            
                            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                              <span><i className="fa-regular fa-clock"></i> Thời gian: <b>{m.timeEstimate}</b></span>
                              <span><i className="fa-solid fa-clone"></i> Thẻ liên kết: <b>{m.cards.length} thẻ</b></span>
                            </div>

                            {/* Card Previews */}
                            <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem", border: "1px solid var(--border-color)" }}>
                              <span className="badge badge-green" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                                {m.cards[0]?.type === "green" ? "Recall" : m.cards[0]?.type === "yellow" ? "Apply" : "Synthesize"}
                              </span>
                              <p className="text-sm font-semibold" style={{ margin: "0.5rem 0", color: "#fff", lineHeight: "1.4" }}>{m.cards[0]?.question}</p>
                              <p className="text-xs text-muted" style={{ fontStyle: "italic" }}>Nguồn: {m.cards[0]?.reference}</p>
                            </div>

                            <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                              {m.status === "locked" ? (
                                <button className="btn btn-secondary btn-full btn-sm" disabled style={{ opacity: 0.5 }}>
                                  <i className="fa-solid fa-lock"></i> Hoàn thành chặng trước để mở khóa
                                </button>
                              ) : m.status === "active" ? (
                                <button className="btn btn-primary btn-full btn-sm" onClick={() => handleApproveMilestone(m.id)}>
                                  <i className="fa-solid fa-bolt"></i> Kích hoạt chặng này (+30 XP)
                                </button>
                              ) : (
                                <button className="btn btn-secondary btn-full btn-sm" onClick={() => {
                                  setActiveTab("retrieval");
                                  setFilterChapter(m.cards[0]?.chapterId || "all");
                                  setForcePracticeAll(true);
                                }}>
                                  <i className="fa-solid fa-play"></i> Bắt đầu ôn tập trong Leitner
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      <button className="btn btn-primary btn-full" onClick={handleApproveOCR} style={{ marginTop: "1rem" }}>
                        <i className="fa-solid fa-circle-check"></i> Kích hoạt toàn bộ lộ trình (+100 XP)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TAB: KNOWLEDGE MAP */}
          {activeTab === "knowledge-map" && (
            <section className="tab-content active">
              <div className="knowledge-map-layout glass-panel">
                <div className="panel-header">
                  <h3><i className="fa-solid fa-network-wired text-primary"></i> Bản đồ liên kết tri thức (Knowledge Map)</h3>
                  <div className="map-legend">
                    <span className="legend-item"><span className="legend-dot bg-gray"></span> Chưa mở</span>
                    <span className="legend-item"><span className="legend-dot bg-orange"></span> Đang học</span>
                    <span className="legend-item"><span className="legend-dot bg-green"></span> Đã vững</span>
                    <span className="legend-item"><span className="legend-dot bg-red-glow"></span> Thẻ Đỏ sẵn sàng</span>
                  </div>
                </div>

                <div className="map-container">
                  <svg id="knowledge-map-svg" width="100%" height="450">
                    {/* Draw Links */}
                    {INITIAL_SUBJECTS[activeSubject]?.chapters.map((ch) => {
                      return ch.prerequisites.map(preId => {
                        const fromCoord = coords.find(c => c.id === preId);
                        const toCoord = coords.find(c => c.id === ch.id);
                        if (!fromCoord || !toCoord) return null;

                        const preState = getNodeState(preId, []);
                        const chState = getNodeState(ch.id, ch.prerequisites);
                        const activePath = preState === "mastered" && chState !== "locked";

                        return (
                          <line 
                            key={`${preId}-${ch.id}`}
                            x1={fromCoord.x} 
                            y1={fromCoord.y} 
                            x2={toCoord.x} 
                            y2={toCoord.y} 
                            className={`map-link ${activePath ? "active-path" : ""}`}
                          />
                        );
                      });
                    })}

                    {/* Draw Nodes */}
                    {INITIAL_SUBJECTS[activeSubject]?.chapters.map((ch, idx) => {
                      const pos = coords.find(c => c.id === ch.id);
                      if (!pos) return null;

                      const state = getNodeState(ch.id, ch.prerequisites);
                      const isSelected = selectedMapNodeId === ch.id;

                      let nodeClass = "map-node";
                      if (state === "locked") nodeClass += " node-locked";
                      else if (state === "active") nodeClass += " node-active";
                      else if (state === "mastered") nodeClass += " node-mastered";
                      else if (state === "red-ready") nodeClass += " node-red-ready";

                      const romanNumerals = ["I", "II", "III", "IV"];

                      return (
                        <g 
                          key={ch.id} 
                          className={nodeClass} 
                          style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                          onClick={() => handleMapNodeClick(ch.id)}
                        >
                          <circle cx={pos.x} cy={pos.y} r={isSelected ? 48 : 40} className="node-circle" />
                          <text x={pos.x} y={pos.y + 6} className="node-text">
                            {state === "locked" ? "🔒" : romanNumerals[idx]}
                          </text>
                          <text 
                            x={pos.x} 
                            y={pos.y + 60} 
                            fill={isSelected ? "var(--primary)" : "var(--text-primary)"}
                            fontFamily="var(--font-heading)"
                            fontWeight={isSelected ? "700" : "600"}
                            fontSize="12px"
                            textAnchor="middle"
                          >
                            {ch.name.split(":")[1] || ch.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Node detail panel */}
                  {selectedMapNodeId && (() => {
                    const ch = INITIAL_SUBJECTS[activeSubject]?.chapters.find(c => c.id === selectedMapNodeId);
                    if (!ch) return null;

                    const chapterCards = cards.filter(c => c.subjectId === activeSubject && c.chapterId === selectedMapNodeId);
                    const green = chapterCards.filter(c => c.type === "green");
                    const yellow = chapterCards.filter(c => c.type === "yellow");
                    const red = chapterCards.filter(c => c.type === "red");

                    const greenB3 = green.filter(c => c.box === 3).length;
                    const yellowB3 = yellow.filter(c => c.box === 3).length;
                    const redB3 = red.filter(c => c.box === 3).length;

                    // lock check alert
                    const greenYellowB3Count = chapterCards.filter(c => c.box === 3 && (c.type === "green" || c.type === "yellow")).length;
                    const greenYellowTotal = chapterCards.filter(c => c.type === "green" || c.type === "yellow").length;
                    const showRedLockAlert = greenYellowTotal > 0 && greenYellowB3Count < greenYellowTotal && red.length > 0;

                    return (
                      <div className="node-detail-sidebar">
                        <button className="close-sidebar-btn" onClick={() => setSelectedMapNodeId(null)}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="node-title-header">
                          <span className="subject-tag">{activeSubject === "chemistry" ? "Hóa học 12" : "Vật lý 12"}</span>
                          <h3>{ch.name}</h3>
                        </div>
                        <p id="map-node-desc" className="text-muted">{ch.description}</p>
                        
                        <div className="node-prereq-list">
                          <strong>Điều kiện tiên quyết:</strong>{" "}
                          <span>
                            {ch.prerequisites.map(preId => {
                              const pre = INITIAL_SUBJECTS[activeSubject]?.chapters.find(c => c.id === preId);
                              return pre ? pre.name.split(":")[0] : preId;
                            }).join(", ") || "Không có"}
                          </span>
                        </div>

                        <div className="chapter-card-stats">
                          <div className="c-stat-box">
                            <span className="c-stat-lbl">Thẻ Xanh</span>
                            <span className="c-stat-val text-green">{greenB3}/{green.length}</span>
                          </div>
                          <div className="c-stat-box">
                            <span className="c-stat-lbl">Thẻ Vàng</span>
                            <span className="c-stat-val text-yellow">{yellowB3}/{yellow.length}</span>
                          </div>
                          <div className="c-stat-box">
                            <span className="c-stat-lbl">Thẻ Đỏ</span>
                            <span className="c-stat-val text-red">{redB3}/{red.length}</span>
                          </div>
                        </div>

                        {showRedLockAlert && (
                          <div className="chapter-lock-indicator alert-box">
                            <i className="fa-solid fa-lock text-orange"></i>
                            <span>Bạn chưa hoàn thành các thẻ Xanh/Vàng của chương tiên quyết để mở khóa Thẻ Đỏ chương này.</span>
                          </div>
                        )}

                        <button className="btn btn-primary btn-full" onClick={() => {
                          setActiveTab("retrieval");
                          setFilterChapter(selectedMapNodeId);
                          setFilterBloom({ green: true, yellow: true, red: true });
                          setFilterBox({ box1: true, box2: true, box3: true });
                          setForcePracticeAll(true);
                          setSelectedMapNodeId(null);
                        }}>
                          <i className="fa-solid fa-play"></i> Ôn tập riêng chương này
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </section>
          )}

          {/* TAB: AI TUTOR CHAT */}
          {activeTab === "tutor" && (
            <section className="tab-content active">
              <div className="tutor-chat-layout glass-panel">
                <div className="tutor-sidebar">
                  <h3>Bản thảo Thảo luận</h3>
                  <p className="text-muted">Đặt câu hỏi cho Gia sư AI về kiến thức bất kỳ.</p>
                  
                  <div className="tutor-suggested-topics">
                    <h4>Chủ đề gợi ý học tập:</h4>
                    <div className="topic-item" onClick={() => setChatInput("Giải thích cơ chế phản ứng xà phòng hóa chất béo?")}>
                      <i className="fa-regular fa-comment-dots text-primary"></i>
                      <span>Phản ứng xà phòng hóa lipid</span>
                    </div>
                    <div className="topic-item" onClick={() => setChatInput("Tại sao dao động của con lắc đơn giảm dần khi có ma sát? Tính cơ năng hao hụt thế nào?")}>
                      <i className="fa-regular fa-comment-dots text-primary"></i>
                      <span>Năng lượng dao động tắt dần</span>
                    </div>
                    <div className="topic-item" onClick={() => setChatInput("Phân biệt Glucozơ, Fructozơ và Saccarozơ nhanh nhất?")}>
                      <i className="fa-regular fa-comment-dots text-primary"></i>
                      <span>Nhận biết các loại đường Cacbohidrat</span>
                    </div>
                  </div>
                </div>

                <div className="tutor-chat-panel">
                  <div className="chat-header">
                    <div className="chat-tutor-avatar">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                    <div className="chat-tutor-title">
                      <h4>Gia sư Trí tuệ Nhân tạo (AI Tutor)</h4>
                      <span className="online-indicator"><span className="dot"></span> Đang trực tuyến</span>
                    </div>
                  </div>

                  <div className="chat-messages">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`msg-bubble ${msg.sender}-msg`}>
                        <div className="msg-avatar">
                          {msg.sender === "tutor" ? <i className="fa-solid fa-robot"></i> : "HS"}
                        </div>
                        <div className="msg-content">
                          <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                          <span className="msg-time">Vừa xong</span>
                        </div>
                      </div>
                    ))}
                    {chatThinking && (
                      <div className="msg-bubble tutor-msg">
                        <div className="msg-avatar"><i className="fa-solid fa-robot"></i></div>
                        <div className="msg-content">
                          <p>Đang suy nghĩ...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="chat-input-bar">
                    <input 
                      type="text" 
                      id="chat-input-field" 
                      placeholder="Nhập câu hỏi hoặc yêu cầu giải thích công thức..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                      autoComplete="off"
                    />
                    <button className="btn btn-primary" onClick={handleSendMessage}>
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <section className="tab-content active">
              <div className="settings-grid">
                <div className="settings-card glass-panel">
                  <h3><i className="fa-solid fa-calendar-days text-primary"></i> Cấu hình kỳ thi</h3>
                  <p className="text-muted mb-4">Điều chỉnh khoảng cách ôn tập tự động dựa trên thời gian thực tế.</p>
                  
                  <div className="settings-form-group">
                    <label htmlFor="exam-date-input">Ngày thi dự kiến (THPT Quốc Gia):</label>
                    <input 
                      type="date" 
                      id="exam-date-input" 
                      className="btn-select"
                      value={examDate}
                      onChange={(e) => {
                        setExamDate(e.target.value);
                        localStorage.setItem("examDate", e.target.value);
                      }}
                    />
                  </div>

                  <div className="settings-form-group flex-row">
                    <div>
                      <label className="toggle-label" htmlFor="toggle-exam-mode">Chế độ nén lộ trình (Exam Mode)</label>
                      <p className="text-muted text-xs">Tự động nén thời gian các hộp Leitner khi thi còn dưới 30 ngày (Ví dụ: 7 ngày &rarr; 3 ngày).</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        id="toggle-exam-mode" 
                        checked={settings.examMode}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSettings({...settings, examMode: val});
                          localStorage.setItem("appSettings", JSON.stringify({...settings, examMode: val}));
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-card glass-panel">
                  <h3><i className="fa-solid fa-circle-nodes text-yellow"></i> Thuật toán Spaced Repetition</h3>
                  <p className="text-muted mb-4">Các tính năng kiểm soát chống lười và chống quá tải.</p>

                  <div className="settings-form-group flex-row">
                    <div>
                      <label className="toggle-label" htmlFor="toggle-burnout">Chống kiệt sức (Anti-Burnout)</label>
                      <p className="text-muted text-xs">Nếu ngày học có quá 5 thẻ khó, hệ thống tự động lùi các thẻ dễ sang hôm sau.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        id="toggle-burnout" 
                        checked={settings.antiBurnout}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSettings({...settings, antiBurnout: val});
                          localStorage.setItem("appSettings", JSON.stringify({...settings, antiBurnout: val}));
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-form-group flex-row">
                    <div>
                      <label className="toggle-label" htmlFor="toggle-popup-checkpoint">Kiểm tra Pop-up bất ngờ (Anti-Cheating Checkpoint)</label>
                      <p className="text-muted text-xs">Ngăn học sinh nhấn "Dễ" liên tiếp vô ý thức bằng cách hiển thị câu hỏi đột xuất.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        id="toggle-popup-checkpoint" 
                        checked={settings.popupCheckpoint}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSettings({...settings, popupCheckpoint: val});
                          localStorage.setItem("appSettings", JSON.stringify({...settings, popupCheckpoint: val}));
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="settings-form-group flex-row">
                    <div>
                      <label className="toggle-label" htmlFor="toggle-adaptive">Phạt thời gian adaptive (&gt;30 giây)</label>
                      <p className="text-muted text-xs">Nếu mất quá 30 giây để trả lời một thẻ dễ, hệ thống sẽ coi là thẻ khó và giảm thời gian gặp lại.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        id="toggle-adaptive" 
                        checked={settings.adaptivePenalty}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSettings({...settings, adaptivePenalty: val});
                          localStorage.setItem("appSettings", JSON.stringify({...settings, adaptivePenalty: val}));
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

                {/* Gemini config card */}
                <div className="settings-card glass-panel" style={{ gridColumn: "1 / -1" }}>
                  <h3><i className="fa-solid fa-robot text-cyan"></i> Trí tuệ Nhân tạo Gemini AI</h3>
                  <p className="text-muted mb-4">Ứng dụng đã được tích hợp mô hình AI thế hệ mới để hỗ trợ tự động tạo thẻ, giải bài tập và chấm điểm thời gian thực.</p>
                  
                  <div className="settings-form-group" style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.2)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                      <i className="fa-solid fa-shield-halved text-cyan" style={{ fontSize: "1.5rem" }}></i>
                      <div>
                        <h4 className="text-sm font-semibold" style={{ color: "#fff" }}>Kênh AI Bảo mật & Tự động</h4>
                        <p className="text-xs text-muted" style={{ marginTop: "2px" }}>Hệ thống đang hoạt động trực tiếp qua cổng API của đề tài Nghiên cứu Khoa học. Trạng thái: <b>Hoạt động (Gemini 2.5 Flash)</b></p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="legend-dot bg-green"></span>
                    <span>Đã kết nối AI thực tế: Đang hoạt động</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* MODALS */}
      {/* 1. Mood Check-in */}
      {moodModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel card-glow-primary">
            <div className="modal-header">
              <h2>Hôm nay tâm trạng bạn thế nào?</h2>
              <p className="text-muted text-center">AI sẽ tự động điều chỉnh độ khó và thứ tự học của bộ thẻ truy hồi hôm nay dựa trên năng lượng của bạn.</p>
            </div>
            <div className="mood-cards-container">
              <div className={`mood-option-card ${mood === "excited" ? "active" : ""}`} onClick={() => setMood("excited")}>
                <span className="mood-emoji">🔥</span>
                <h4>Hào hứng</h4>
                <p className="text-xs">Sẵn sàng chinh phục bài khó (Thẻ Đỏ)</p>
              </div>
              <div className={`mood-option-card ${mood === "focused" ? "active" : ""}`} onClick={() => setMood("focused")}>
                <span className="mood-emoji">🎯</span>
                <h4>Tập trung</h4>
                <p className="text-xs">Tiếp thu tốt kiến thức & áp dụng (Thẻ Vàng)</p>
              </div>
              <div className={`mood-option-card ${mood === "normal" ? "active" : ""}`} onClick={() => setMood("normal")}>
                <span className="mood-emoji">😐</span>
                <h4>Bình thường</h4>
                <p className="text-xs">Ôn tập phân bổ cân bằng các dạng bài</p>
              </div>
              <div className={`mood-option-card ${mood === "tired" ? "active" : ""}`} onClick={() => setMood("tired")}>
                <span className="mood-emoji">🥱</span>
                <h4>Mệt mỏi</h4>
                <p className="text-xs">Học nhẹ nhàng lý thuyết dễ thương (Thẻ Xanh)</p>
              </div>
              <div className={`mood-option-card ${mood === "stressed" ? "active" : ""}`} onClick={() => setMood("stressed")}>
                <span className="mood-emoji">🤯</span>
                <h4>Căng thẳng</h4>
                <p className="text-xs">Bắt đầu lý thuyết dễ để tìm lại flow học tập</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => {
                localStorage.setItem("userMood", mood);
                setMoodModalOpen(false);
              }}>Bắt đầu học ngay</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Checkpoint Warning Modal */}
      {checkpointModalOpen && checkpointQuestion && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel card-glow-red checkpoint-width">
            <div className="checkpoint-warning-icon">
              <i className="fa-solid fa-triangle-exclamation text-red animate-pulse"></i>
            </div>
            <div className="modal-header">
              <h2>⚠️ PHÁT HIỆN HÀNH VI TỰ MÃN!</h2>
              <p className="text-orange text-center text-sm font-semibold">Bạn đã nhấp &quot;Dễ&quot; 4 lần liên tiếp. Hãy trả lời câu hỏi checkpoint đột xuất dưới đây để chứng minh bạn thực sự hiểu bài!</p>
            </div>
            <div className="checkpoint-body">
              <div className="checkpoint-question">{checkpointQuestion.question}</div>
              <div className="checkpoint-options">
                {checkpointQuestion.options.map((opt, idx) => {
                  let optClass = "checkpoint-option-btn";
                  if (checkpointSelectedIdx === idx) {
                    optClass += idx === checkpointQuestion.correct ? " correct" : " wrong";
                  } else if (checkpointSelectedIdx !== null && idx === checkpointQuestion.correct) {
                    optClass += " correct";
                  }
                  return (
                    <button 
                      key={idx} 
                      className={optClass} 
                      onClick={() => handleCheckpointSelect(idx)}
                      disabled={checkpointSelectedIdx !== null}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              
              {checkpointFeedback.status && (
                <div className={`checkpoint-feedback ${checkpointFeedback.status}`}>
                  <p style={{ whiteSpace: "pre-line" }}>{checkpointFeedback.text}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <span className="text-xs text-muted">Trả lời sai sẽ đưa toàn bộ thẻ dễ vừa ôn về Ngăn 1 để chống rỗng kiến thức.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
