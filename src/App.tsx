import React, { useState, useEffect, useRef } from "react";
import { INITIAL_SUBJECTS } from "./db";
import type { Card, Mood, AppSettings, CheckpointQuestion, LearningRoadmap } from "./types";
import StarterQuest from "./StarterQuest";

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
export const ROADMAP_PRESETS: Record<string, LearningRoadmap> = {
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
  const [activePracticeRoadmapId, setActivePracticeRoadmapId] = useState<string | null>(null);
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
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [ocrPreviewSrc, setOcrPreviewSrc] = useState<string>("https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=500&q=80");
  
  // OCR Input Type, Verification Modal, Praise Modal & Hint state additions
  const [ocrInputType, setOcrInputType] = useState<'file' | 'text'>('text');
  const [ocrTextContent, setOcrTextContent] = useState<string>("");
  const [documentTags, setDocumentTags] = useState<string[]>(["Hóa học", "Ôn thi"]);
  const [customSubject, setCustomSubject] = useState<string>("");
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [selectedDocumentSubject, setSelectedDocumentSubject] = useState<string>("Hóa học");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [verificationCards, setVerificationCards] = useState<Card[]>([]);
  const [verificationRoadmapTitle, setVerificationRoadmapTitle] = useState<string>("");
  const [verificationSubjectId, setVerificationSubjectId] = useState<string>("chemistry");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showPraiseModal, setShowPraiseModal] = useState<boolean>(false);
  const [praiseTimeSpent, setPraiseTimeSpent] = useState<number>(0);
  const [savedRoadmaps, setSavedRoadmaps] = useState<LearningRoadmap[]>([]);

  // Map state
  const [selectedMapNodeId, setSelectedMapNodeId] = useState<string | null>(null);
  const [activeMapId, setActiveMapId] = useState<string>("");
  const [newlyCreatedMapId, setNewlyCreatedMapId] = useState<string>("");

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
  const [checkpointLoading, setCheckpointLoading] = useState<boolean>(false);
  const [checkpointSelectedIdx, setCheckpointSelectedIdx] = useState<number | null>(null);
  const [checkpointFeedback, setCheckpointFeedback] = useState<{ status: 'success' | 'fail' | null, text: string }>({
    status: null,
    text: ""
  });

  // --- LOCAL STORAGE LIFE CYCLE ---
  useEffect(() => {
    // This release intentionally starts from a clean learning library: old demo cards/maps
    // must never be mistaken for a learner's newly generated course.
    const cleanDeployVersion = "clean-learning-library-v1";
    if (localStorage.getItem("learning_library_version") !== cleanDeployVersion) {
      localStorage.removeItem("retrieval_cards");
      localStorage.removeItem("saved_roadmaps");
      localStorage.removeItem("learning_progress");
      localStorage.setItem("learning_library_version", cleanDeployVersion);
    }
    // 1. Load cards (blank slate by default)
    const savedCards = localStorage.getItem("retrieval_cards");
    let loadedCards: Card[] = [];
    if (savedCards) {
      loadedCards = JSON.parse(savedCards);
    } else {
      loadedCards = []; // Start blank!
      localStorage.setItem("retrieval_cards", JSON.stringify(loadedCards));
    }
    setCards(loadedCards);

    // Load saved roadmaps
    const savedRoadmapsStr = localStorage.getItem("saved_roadmaps");
    if (savedRoadmapsStr) {
      setSavedRoadmaps(JSON.parse(savedRoadmapsStr));
    } else {
      setSavedRoadmaps([]);
    }

    const savedCustomSubjects = localStorage.getItem("custom_subject_folders");
    if (savedCustomSubjects) setCustomSubjects(JSON.parse(savedCustomSubjects));

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

  const saveRoadmapsState = (newRoadmaps: LearningRoadmap[]) => {
    setSavedRoadmaps(newRoadmaps);
    localStorage.setItem("saved_roadmaps", JSON.stringify(newRoadmaps));
  };

  const syncRoadmapLearningProgress = (updatedCards: Card[]) => {
    setSavedRoadmaps(previousRoadmaps => {
      const nextRoadmaps = previousRoadmaps.map(roadmap => {
        let previousMilestonesReviewed = true;
        const milestones = roadmap.milestones.map(milestone => {
          const reviewed = milestone.cards.length > 0 && milestone.cards.every(card =>
            updatedCards.some(deckCard => deckCard.id === card.id && deckCard.history.length > 0)
          );
          const status = reviewed ? "completed" as const : previousMilestonesReviewed ? "active" as const : "locked" as const;
          previousMilestonesReviewed = previousMilestonesReviewed && reviewed;
          return { ...milestone, status };
        });
        return { ...roadmap, milestones };
      });
      localStorage.setItem("saved_roadmaps", JSON.stringify(nextRoadmaps));
      const refreshedActive = nextRoadmaps.find(roadmap => roadmap.id === activeRoadmap?.id);
      if (refreshedActive) setActiveRoadmap(refreshedActive);
      return nextRoadmaps;
    });
  };

  const recordLearningEvent = (event: string, detail: Record<string, unknown> = {}) => {
    const key = "learning_progress";
    const history = JSON.parse(localStorage.getItem(key) || "[]") as Array<Record<string, unknown>>;
    localStorage.setItem(key, JSON.stringify([...history, { event, at: new Date().toISOString(), ...detail }].slice(-500)));
  };

  const recordStudyDay = () => {
    const today = new Date().toISOString().slice(0, 10);
    const lastStudyDay = localStorage.getItem("lastStudyDay");
    if (lastStudyDay === today) return;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setStreak(previous => {
      const next = lastStudyDay === yesterday ? previous + 1 : 1;
      localStorage.setItem("userStreak", String(next));
      return next;
    });
    localStorage.setItem("lastStudyDay", today);
  };

  const openNewRoadmap = (roadmap: LearningRoadmap) => {
    setActiveRoadmap(roadmap);
    setActiveMapId(roadmap.id);
    setNewlyCreatedMapId(roadmap.id);
    setSelectedMapNodeId(null);
    setActiveTab("knowledge-map");
    recordLearningEvent("roadmap_created", { roadmapId: roadmap.id, topicName: roadmap.topicName });
    window.setTimeout(() => setNewlyCreatedMapId(""), 5000);
  };

  const openVerification = (roadmap: LearningRoadmap) => {
    setVerificationRoadmapTitle(roadmap.topicName);
    setVerificationSubjectId(roadmap.milestones.flatMap(milestone => milestone.cards)[0]?.subjectId || "chemistry");
    setVerificationCards(JSON.parse(JSON.stringify(roadmap.milestones.flatMap(milestone => milestone.cards))));
    setIsVerificationModalOpen(true);
  };

  const scopeRoadmapCards = (roadmap: LearningRoadmap, assignment?: { subjectId: string; chapterId: string }): LearningRoadmap => ({
    ...roadmap,
    milestones: roadmap.milestones.map((milestone, milestoneIndex) => ({
      ...milestone,
      cards: milestone.cards.map((card, cardIndex) => ({
        ...card,
        id: `${roadmap.id}-${milestone.id || milestoneIndex}-${cardIndex + 1}`,
        roadmapId: roadmap.id,
        milestoneId: milestone.id,
        subjectId: assignment?.subjectId || card.subjectId,
        chapterId: assignment?.chapterId || card.chapterId
      }))
    }))
  });

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

  useEffect(() => {
    setShowHint(false);
  }, [activeCard, flipped]);

  useEffect(() => {
    if (savedRoadmaps.length > 0 && !activeMapId) {
      setActiveMapId(savedRoadmaps[0].id);
    }
  }, [savedRoadmaps, activeMapId]);

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
    // A roadmap practice session owns its queue until the learner finishes it.
    // Do not replace it with the global subject queue after every answer.
    if (activePracticeRoadmapId && forcePracticeAll) return;
    rebuildStudyQueue();
  }, [cards, activeSubject, activePracticeRoadmapId, filterChapter, filterBloom, filterBox, forcePracticeAll, mood, triggerBurnout, isCompressed]);

  const rebuildStudyQueue = () => {
    let list = cards.filter(card => {
      if (activePracticeRoadmapId && card.roadmapId !== activePracticeRoadmapId) return false;
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
  const callGemini = async (prompt: string, sysPrompt: string = "", maxTokens: number = 900) => {
    if (!geminiApiKey) throw new Error("API Key chưa được thiết lập.");
    const url = "/api/nvidia";
    const body: any = { model: "nvidia/nemotron-3-super-120b-a12b", temperature: 0.2, max_tokens: maxTokens, messages: [{ role: "system", content: sysPrompt || "Bạn là gia sư học tập hữu ích." }, { role: "user", content: prompt }] };

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
    return data.choices?.[0]?.message?.content || "";
  };

  const streamRoadmapGeneration = async (prompt: string, onContent: (content: string) => void) => {
    const response = await fetch("/api/nvidia", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b",
        temperature: 0.2,
        max_tokens: 10000,
        stream: true,
        chat_template_kwargs: { enable_thinking: false },
        messages: [
          { role: "system", content: "Bạn là chuyên gia thiết kế sơ đồ học liệu AI THPT. Trả về JSON hợp lệ duy nhất, thật ngắn gọn và luôn hoàn tất toàn bộ JSON trước khi dừng." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok || !response.body) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = "";
    let content = "";

    const consume = (line: string) => {
      if (!line.startsWith("data:")) return;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") return;
      try {
        const event = JSON.parse(payload);
        const delta = event.choices?.[0]?.delta?.content || "";
        if (delta) {
          content += delta;
          onContent(content);
        }
      } catch {
        // Ignore non-JSON keepalive frames from the streaming endpoint.
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      pending += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() || "";
      lines.forEach(consume);
      if (done) break;
    }
    if (pending) consume(pending);
    return content;
  };

  const callGeminiMultimodal = async (prompt: string, base64: string, mime: string, sysPrompt: string = "") => {
    if (!geminiApiKey) throw new Error("API Key chưa được thiết lập.");
    const url = "/api/nvidia";
    
    const body: any = {
      model: "meta/llama-3.2-11b-vision-instruct",
      temperature: 0.2,
      max_tokens: 6000,
      messages: [
        ...(sysPrompt ? [{ role: "system", content: sysPrompt }] : []),
        { role: "user", content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } }
        ] }
      ]
    };

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
    return data.choices?.[0]?.message?.content || "";
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

      // Praise popup trigger for quick correct recall
      if (isCorrect && secondsElapsed < 15) {
        setPraiseTimeSpent(secondsElapsed);
        setShowPraiseModal(true);
        setPoints(prev => {
          const added = prev + 10;
          localStorage.setItem("userPoints", added.toString());
          return added;
        });
      }
    } else {
      if (!essayAnswer.trim()) {
        alert("Hãy nhập bài giải/câu trả lời tự luận trước khi lật thẻ!");
        return;
      }
      setFlipped(true);
      fetchTutorGradingFeedback(essayAnswer, true);

      // Praise popup trigger for quick analysis (if delay is bypassed or not applicable)
      if (secondsElapsed < 15) {
        setPraiseTimeSpent(secondsElapsed);
        setShowPraiseModal(true);
        setPoints(prev => {
          const added = prev + 10;
          localStorage.setItem("userPoints", added.toString());
          return added;
        });
      }
    }
  };

  const fetchTutorGradingFeedback = (ans: string, greenCorrect: boolean) => {
    setTutorCardFeedback("");
    
    if (geminiApiKey) {
      const prompt = `Câu hỏi ôn tập: "${activeCard.question}"
Đáp án chuẩn mẫu: "${activeCard.modelAnswer}"
Câu trả lời của học sinh: "${ans}"

Nhiệm vụ của bạn là hãy đóng vai trò là một Gia sư AI chấm bài và nhận xét trực tiếp bài tập cho học sinh lớp 12.
Hãy phân tích và viết một phản hồi ngắn gọn (khoảng 3-4 câu) bằng tiếng Việt cho học sinh.
Đánh giá độ chính xác (ví dụ đúng khoảng bao nhiêu phần trăm, có ghi được các ý/công thức cốt lõi hay không), chỉ ra lỗi sai kiến thức hoặc hiểu lầm (nếu có), và cung cấp 1 mẹo học tập hoặc định hướng nhanh để cải thiện trí nhớ. Hãy trả lời cực kỳ súc tích, thân thiện và động viên học sinh.`;

      callGemini(prompt, "Bạn là Gia sư AI chấm bài cho học sinh. Chỉ trả về phản hồi chấm bài ngắn gọn bằng tiếng Việt, không thêm lời dẫn kỹ thuật.")
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
    setFilteredQueue(queue => queue.map(card => updated.find(nextCard => nextCard.id === card.id) || card));
    syncRoadmapLearningProgress(updated);
    recordLearningEvent("card_reviewed", { cardId: activeCard.id, grade, box: newBox, timeTaken: secondsElapsed });
    recordStudyDay();

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
    const fallback = list[Math.floor(Math.random() * list.length)];
    const recentCards = cards
      .filter(card => card.subjectId === activeSubject)
      .filter(card => sessionReviewedCards.some(item => item.cardId === card.id) || card.id === activeCard?.id || card.history.length > 0)
      .sort((a, b) => new Date(b.lastReviewed || 0).getTime() - new Date(a.lastReviewed || 0).getTime())
      .slice(0, 5);

    setCheckpointModalOpen(true);
    setCheckpointLoading(true);
    setCheckpointQuestion(null);
    setCheckpointSelectedIdx(null);
    setCheckpointFeedback({ status: null, text: "" });

    if (recentCards.length === 0) {
      setCheckpointQuestion(fallback);
      setCheckpointLoading(false);
      return;
    }

    const learnedContext = recentCards.map((card, index) =>
      `${index + 1}. Câu đã học: ${card.question}\nÝ chính/đáp án: ${card.modelAnswer}`
    ).join("\n\n");
    const prompt = `Từ các thẻ học sinh VỪA học dưới đây, tạo đúng MỘT câu hỏi trắc nghiệm checkpoint để kiểm tra hiểu thật sự. Câu phải bám sát kiến thức trong các thẻ này, không dùng chủ đề ngoài. Trả về JSON duy nhất theo dạng {"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."}. correct là chỉ số 0-3.\n\n${learnedContext}`;

    callGemini(prompt, "Bạn là giáo viên tạo một checkpoint chống tự mãn. Câu hỏi rõ ràng, 4 lựa chọn ngắn, có duy nhất một đáp án đúng.", 800)
      .then(response => {
        const cleaned = response.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        const generated = JSON.parse(cleaned) as CheckpointQuestion;
        if (!generated.question || !Array.isArray(generated.options) || generated.options.length !== 4 || generated.correct < 0 || generated.correct > 3) throw new Error("Invalid checkpoint JSON");
        setCheckpointQuestion(generated);
      })
      .catch(error => {
        console.warn("Dynamic checkpoint fallback", error);
        setCheckpointQuestion(fallback);
      })
      .finally(() => setCheckpointLoading(false));
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

  const triggerOCRScan = () => {
    setOcrStatus("scanning");
    setOcrStep(1);
    setGenerationProgress(8);
    const isTextSource = ocrInputType === "text" || activeOCRMimeType === "text/plain";
    const currentSource = (isTextSource ? (ocrInputType === "text" ? ocrTextContent : activeOCRBase64) : activeOCRBase64).trim();
    const selectedSubject = selectedDocumentSubject || "Môn học chưa xác định";
    const customSubjectSlug = selectedSubject.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const subjectId = selectedSubject === "Vật lý" ? "physics" : selectedSubject === "Hóa học" ? "chemistry" : `custom-${customSubjectSlug || "subject"}`;
    const chapterId = subjectId === "physics" ? "p1" : subjectId === "chemistry" ? "c1" : "general";

    if (!currentSource) {
      setOcrStatus("idle");
      alert("Hãy nhập hoặc tải tài liệu trước khi tạo lộ trình.");
      return;
    }

    const createLocalDraft = () => {
      setTimeout(() => setOcrStep(2), 1200);
      setTimeout(() => setOcrStep(3), 2400);
      setTimeout(() => {
        setOcrStatus("done");
        setGenerationProgress(100);
        const firstDocumentLine = ocrTextContent.split("\n").map(line => line.trim()).find(Boolean);
        const clonedRoadmap = scopeRoadmapCards({
          id: `rm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          topicName: firstDocumentLine ? firstDocumentLine.replace(/^#+\s*/, "").slice(0, 72) : "Lộ trình học mới",
          difficulty: "Trung bình",
          milestones: [
            { id: "foundation", title: "Nền tảng", description: "Xác định khái niệm trọng tâm từ tài liệu.", timeEstimate: "15 phút", status: "active", cards: [] },
            { id: "practice", title: "Luyện tập", description: "Áp dụng kiến thức vào bài tập ngắn.", timeEstimate: "20 phút", status: "locked", cards: [] },
            { id: "review", title: "Tổng hợp", description: "Kết nối các ý chính và tự kiểm tra.", timeEstimate: "20 phút", status: "locked", cards: [] }
          ]
        });
        openNewRoadmap(clonedRoadmap);
        if (clonedRoadmap.milestones.length > 0) {
          setSelectedMilestoneId(clonedRoadmap.milestones[0].id);
        }
        
        // Save to savedRoadmaps list
        setSavedRoadmaps(prev => {
          const updated = [...prev, clonedRoadmap];
          localStorage.setItem("saved_roadmaps", JSON.stringify(updated));
          return updated;
        });

        // Extract cards and open verification layer popup
        openVerification(clonedRoadmap);
      }, 3600);
    };

    if (geminiApiKey) {
      let prompt = `Bạn nhận được đúng MỘT tài liệu học tập của học sinh. Môn học do học sinh chọn: ${selectedSubject}. Tags/mục tiêu: ${documentTags.join(", ") || "không có"}.`;
      if (isTextSource) {
        prompt += `\n\nNỘI DUNG DUY NHẤT ĐƯỢC PHÉP DÙNG:\n---\n${currentSource.slice(0, 4000)}\n---\nKhông được dùng kiến thức, câu hỏi, hay tên bài từ các tài liệu trước, đặc biệt không tự thêm Este–Lipit, Sóng cơ, Hóa học hoặc Vật lý nếu chúng không xuất hiện trong nội dung trên.`;
      } else {
        prompt += `\n\nHãy chỉ dùng nội dung nhìn thấy trong tệp đính kèm. Không sử dụng ví dụ, lộ trình hoặc tài liệu mẫu cũ.`;
      }

      prompt += `\n\nNhiệm vụ của bạn là hãy phân tích tài liệu này và thiết lập một Lộ trình học tập cá nhân hóa (Learning Roadmap) gồm đúng 3 chặng học tập (Milestones) sắp xếp theo mức độ nhận thức tăng dần của Bloom's Taxonomy.
Tạo đúng 3 câu hỏi kiểm tra cho mỗi chặng (tổng 9 thẻ), chỉ dựa vào tài liệu trên:
- Chặng 1 gồm 3 Thẻ Xanh (Recall - trắc nghiệm 4 lựa chọn, một đáp án đúng rõ ràng).
- Chặng 2 gồm 3 Thẻ Vàng (Apply - tự luận ngắn).
- Chặng 3 gồm 3 Thẻ Đỏ (Synthesize - tự luận tổng hợp).
- Mỗi title/description tối đa 12 từ. Mỗi câu hỏi/đáp án mẫu tối đa 22 từ. Mỗi lựa chọn trắc nghiệm tối đa 10 từ. Không lặp ý và không dùng câu hỏi từ bất kỳ chủ đề nào khác.

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
          "subjectId": "${subjectId}",
          "chapterId": "${chapterId}",
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
          "subjectId": "${subjectId}",
          "chapterId": "${chapterId}",
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
          "subjectId": "${subjectId}",
          "chapterId": "${chapterId}",
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

      setOcrStep(2);
      let apiCall;
      if (activeOCRBase64 && activeOCRMimeType !== "text/plain") {
        apiCall = callGeminiMultimodal(prompt, activeOCRBase64, activeOCRMimeType, "Bạn là chuyên gia thiết kế sơ đồ học liệu AI THPT.");
      } else {
        setGenerationProgress(20);
        apiCall = streamRoadmapGeneration(prompt, (content) => {
          setOcrStep(3);
          // This advances only when real streamed model content arrives.
          setGenerationProgress(Math.min(95, 20 + Math.floor(content.length / 28)));
        });
      }

      apiCall.then(res => {
          try {
            let clean = res.trim();
            if (clean.startsWith("```json")) clean = clean.substring(7);
            if (clean.endsWith("```")) clean = clean.substring(0, clean.length - 3);
            clean = clean.trim();
            
            // Replace literal newlines and control characters inside double-quoted JSON strings to avoid JSON.parse errors
            let sanitized = clean;
            
            // Replace literal newlines inside JSON string properties with actual escaped \\n characters
            sanitized = sanitized.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_match: string, stringVal: string) => {
              const cleanedVal = stringVal.replace(/\r?\n/g, '\\n');
              return `"${cleanedVal}"`;
            });
            
            const parsed = JSON.parse(sanitized);
            if (!parsed.id) {
              parsed.id = `rm-${Date.now()}`;
            }
            const scopedRoadmap = scopeRoadmapCards(parsed, { subjectId, chapterId });
            openNewRoadmap(scopedRoadmap);
            if (scopedRoadmap.milestones && scopedRoadmap.milestones.length > 0) {
              setSelectedMilestoneId(scopedRoadmap.milestones[0].id);
            }
            setOcrStatus("done");
            setGenerationProgress(100);
            setOcrStep(3);

            // Save to savedRoadmaps list
            setSavedRoadmaps(prev => {
              const updated = [...prev, scopedRoadmap];
              localStorage.setItem("saved_roadmaps", JSON.stringify(updated));
              return updated;
            });

            // Extract cards and open verification layer popup
            openVerification(scopedRoadmap);
          } catch(e) {
            console.error("Failed to parse NVIDIA Roadmap JSON response", e, res);
            createLocalDraft();
          }
        }).catch(err => {
          console.error(err);
          alert(`Lỗi API thực tế: ${err.message}. Đã lưu một khung lộ trình trống từ tài liệu của bạn; hãy thử tạo lại khi kết nối AI ổn định.`);
          createLocalDraft();
        });
    } else {
      createLocalDraft();
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
    const completedRoadmap = {
      ...activeRoadmap,
      milestones: completedMilestones
    };
    setActiveRoadmap(completedRoadmap);
    saveRoadmapsState(savedRoadmaps.map(roadmap => roadmap.id === completedRoadmap.id ? completedRoadmap : roadmap));
    recordLearningEvent("roadmap_activated", { roadmapId: completedRoadmap.id, cardsAdded: allCardsToAdd.length });

    setPoints(prev => {
      const added = prev + 100;
      localStorage.setItem("userPoints", added.toString());
      return added;
    });

    alert(`🎉 Kích hoạt toàn bộ lộ trình thành công! Đã thêm tất cả ${allCardsToAdd.length} thẻ truy hồi vào tủ thẻ Ngăn 1.`);
  };

  const handleDeleteRoadmap = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedRoadmaps.filter(r => r.id !== id);
    saveRoadmapsState(updated);
    const remainingCards = cards.filter(card => card.roadmapId !== id);
    saveCardsState(remainingCards);
    setFilteredQueue(queue => queue.filter(card => card.roadmapId !== id));
    if (activePracticeRoadmapId === id) {
      setActivePracticeRoadmapId(null);
      setCurrentQueueIndex(0);
    }
    recordLearningEvent("roadmap_deleted", { roadmapId: id });
    if (activeRoadmap?.id === id) {
      setActiveRoadmap(null);
      setOcrStatus("idle");
    }
  };

  const handleUpdateVerificationCard = (index: number, updatedFields: Partial<Card>) => {
    setVerificationCards(prev => prev.map((c, i) => i === index ? { ...c, ...updatedFields } : c));
  };

  const handleUpdateVerificationCardOption = (cardIndex: number, optionIndex: number, value: string) => {
    setVerificationCards(prev => prev.map((c, i) => {
      if (i === cardIndex) {
        const opts = [...(c.options || ["", "", "", ""])];
        opts[optionIndex] = value;
        return { ...c, options: opts };
      }
      return c;
    }));
  };

  const applyVerificationSubject = (subjectId: string) => {
    const chapterId = subjectId === "physics" ? "p1" : subjectId === "chemistry" ? "c1" : "general";
    setVerificationSubjectId(subjectId);
    setVerificationCards(prev => prev.map(card => ({ ...card, subjectId, chapterId })));
  };

  const handleConfirmVerification = (editedCards: Card[]) => {
    const cleanCardsToAdd = editedCards.map(c => ({
      ...c,
      id: c.id || `card-ms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      box: 1, // Start in Leitner Box 1
      lastReviewed: null,
      nextReviewDate: null,
      history: []
    }));

    // Filter duplicates based on question content
    const duplicatesRemoved = cleanCardsToAdd.filter(cAdd => !cards.some(c => c.id === cAdd.id));
    if (duplicatesRemoved.length === 0) {
      alert("Tất cả các thẻ này đã tồn tại trong Leitner!");
      setIsVerificationModalOpen(false);
      return;
    }

    const updated = [...cards, ...duplicatesRemoved];
    saveCardsState(updated);

    // Update activeRoadmap milestones to completed
    if (activeRoadmap) {
      const completedMilestones = activeRoadmap.milestones.map(m => ({ ...m, status: "completed" as const }));
      const cardById = new Map(cleanCardsToAdd.map(card => [card.id, card]));
      const completedRoadmap = {
        ...activeRoadmap,
        topicName: verificationRoadmapTitle.trim() || activeRoadmap.topicName,
        milestones: completedMilestones.map(milestone => ({
          ...milestone,
          cards: milestone.cards.map(card => cardById.get(card.id) || card)
        }))
      };
      setActiveRoadmap(completedRoadmap);
      saveRoadmapsState(savedRoadmaps.map(roadmap => roadmap.id === completedRoadmap.id ? completedRoadmap : roadmap));
      recordLearningEvent("roadmap_activated", { roadmapId: completedRoadmap.id, cardsAdded: duplicatesRemoved.length });
    }

    setPoints(prev => {
      const added = prev + 100;
      localStorage.setItem("userPoints", added.toString());
      return added;
    });

    setIsVerificationModalOpen(false);
    setActiveMapId(activeRoadmap?.id || activeMapId);
    setActiveTab("knowledge-map");
    alert(`🎉 Xác nhận thành công! Đã chuyển ${duplicatesRemoved.length} thẻ lý thuyết vào Kho lưu trữ Leitner chính thức.`);
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
  const handleStartRoadmapPractice = (roadmapId: string, preferredCardId?: string) => {
    setForcePracticeAll(true);
    setFilterChapter("all");
    setFilterBloom({ green: true, yellow: true, red: true });
    setFilterBox({ box1: true, box2: true, box3: true });

    const list = cards
      .filter(card => card.roadmapId === roadmapId)
      .sort((a, b) => {
        // New and overdue cards come first; then keep the roadmap's own stable sequence.
        const aPriority = a.history.length === 0 ? 0 : (!a.nextReviewDate || new Date(a.nextReviewDate).getTime() <= Date.now() ? 1 : 2);
        const bPriority = b.history.length === 0 ? 0 : (!b.nextReviewDate || new Date(b.nextReviewDate).getTime() <= Date.now() ? 1 : 2);
        return aPriority - bPriority;
      });

    if (list.length === 0) {
      alert("Lộ trình này chưa có thẻ đã lưu. Hãy xác nhận thẻ trong bước Kiểm duyệt trước.");
      return;
    }

    setActiveSubject(list[0].subjectId);
    setActivePracticeRoadmapId(roadmapId);
    setFilteredQueue(list);
    
    const cardIdx = preferredCardId ? list.findIndex(c => c.id === preferredCardId) : 0;
    if (cardIdx !== -1) {
      setCurrentQueueIndex(cardIdx);
    } else {
      setCurrentQueueIndex(0);
    }
    
    setFlipped(false);
    setEssayAnswer("");
    setSelectedGreenOption(null);
    setActiveTab("retrieval");
  };

  const handleStartCardPractice = (targetCard: Card) => {
    if (!targetCard.roadmapId) {
      alert("Thẻ này không thuộc một lộ trình đã lưu.");
      return;
    }
    handleStartRoadmapPractice(targetCard.roadmapId, targetCard.id);
  };

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
            <span>Tạo tài liệu học tập</span>
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
                {customSubjects.map(subject => {
                  const slug = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  return <option key={subject} value={`custom-${slug || "subject"}`}>📁 {subject}</option>;
                })}
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
            <div className="header-stat exam-countdown" style={{ cursor: "pointer" }} title="Bấm để đặt ngày thi" onClick={() => {
              const nextDate = window.prompt("Nhập ngày thi (YYYY-MM-DD):", examDate);
              if (nextDate && /^\d{4}-\d{2}-\d{2}$/.test(nextDate)) {
                setExamDate(nextDate);
                localStorage.setItem("examDate", nextDate);
              }
            }}>
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
              {cards.length === 0 ? (<><StarterQuest onStart={() => { setActiveTab("ocr"); setOcrInputType("text"); }} />
                <div className="legacy-starter glass-panel notebook-paper" style={{ padding: "2.5rem 2rem 2.5rem 3.5rem", position: "relative", minHeight: "450px" }}>
                  <div className="spiral-rings">
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                  </div>
                  <h2 style={{ fontSize: "2rem", color: "#1e3a8a", marginBottom: "1rem", fontWeight: 800 }}>
                    👋 Chào mừng bạn đến với AI Retrieval Box!
                  </h2>
                  <div style={{ fontSize: "1.15rem", lineHeight: "1.7", display: "flex", flexDirection: "column", gap: "1.2rem", color: "#2d3748" }}>
                    <p>Hộp lưu trữ thẻ học Leitner của bạn hiện tại đang trống. Hãy bắt đầu xây dựng kho tri thức cá nhân hóa theo các bước đơn giản sau:</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem 1.5rem", background: "rgba(254, 243, 199, 0.5)", border: "2px dashed #d97706", borderRadius: "12px" }}>
                      <span>1️⃣ Click vào nút <b>Khởi tạo Thẻ học AI ngay 🚀</b> ở dưới.</span>
                      <span>2️⃣ Tại tab <b>Số hóa & AI OCR</b>, chọn tab phụ <b>Nhập văn bản ✍️</b>.</span>
                      <span>3️⃣ Dán nội dung tài liệu ôn tập của bạn vào ô soạn thảo văn bản.</span>
                      <span>4️⃣ Nhấp <b>Khởi tạo Lộ trình học tập AI</b>. AI sẽ phân tích tài liệu và tự động tạo Lộ trình chặng Bloom kèm 3 thẻ học.</span>
                      <span>5️⃣ Kiểm duyệt lại nội dung thẻ qua <b>Verification Layer (Popup xác nhận)</b> và lưu trữ chúng vào hệ thống Leitner chính thức!</span>
                    </div>

                    <p style={{ fontStyle: "italic", color: "#4b5563", marginTop: "0.5rem" }}>
                      💡 Tip: Sau khi thêm thẻ, bạn có thể quay lại đây để theo dõi biểu đồ phân bố và ôn tập định kỳ chống đứt gãy kiến thức.
                    </p>

                    <div style={{ marginTop: "1rem" }}>
                      <button className="btn btn-primary" onClick={() => { setActiveTab("ocr"); setOcrInputType("text"); }} style={{ padding: "0.85rem 2.2rem", fontSize: "1.1rem" }}>
                        Khởi tạo Thẻ học AI ngay 🚀
                      </button>
                    </div>
                  </div>
                </div></>) : (
                <>
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

                  {/* Overall Mastery Tracker */}
                  {(() => {
                    const subjectCards = cards.filter(c => c.subjectId === activeSubject);
                    const totalCardsCount = subjectCards.length;
                    const masteredCardsCount = subjectCards.filter(c => c.box === 3).length;
                    const reviewedCardsCount = subjectCards.filter(c => c.history.length > 0).length;
                    const overallProgress = totalCardsCount > 0 ? Math.round(subjectCards.reduce((total, card) => {
                      if (card.history.length === 0) return total;
                      return total + (card.box === 3 ? 1 : card.box === 2 ? 0.67 : 0.34);
                    }, 0) / totalCardsCount * 100) : 0;
                    
                    return (
                      <div className="glass-panel notebook-paper" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem", border: "3px solid #2d3748", boxShadow: "4px 4px 0px #2d3748", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            ✨ Tiến trình làm chủ kiến thức hiện tại: {overallProgress}%
                          </span>
                          <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#475569" }}>
                            Đã học: {reviewedCardsCount}/{totalCardsCount} · Đã vững: {masteredCardsCount}
                          </span>
                        </div>
                        <div style={{ width: "100%", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "10px", overflow: "hidden", border: "2.5px solid #2d3748" }}>
                          <div className="progress-fill" style={{ height: "100%", width: `${overallProgress}%`, backgroundColor: "#10b981", transition: "width 0.8s ease-out" }}></div>
                        </div>
                        
                        {/* Motivational Speech bubble from AI Tutor avatar */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                          <div className="avatar animate-bounce" style={{ width: "32px", height: "32px", minWidth: "32px", fontSize: "0.9rem", backgroundColor: "#3b82f6" }}>🤖</div>
                          <div className="speech-bubble tutor-bubble" style={{ margin: 0, padding: "0.5rem 1rem", fontSize: "0.9rem", flex: 1 }}>
                            {overallProgress === 100 
                              ? "Xuất sắc! Bạn đã làm chủ 100% tài liệu ôn tập! Hãy tiếp tục duy trì để có phản xạ tốt nhất nhé!"
                              : overallProgress >= 50
                              ? `Tuyệt vời! Bạn đã vững hơn một nửa kiến thức rồi (${overallProgress}%). Tiếp tục phát huy nào!`
                              : totalCardsCount > 0
                              ? "Cố lên học viên! Mỗi ngày luyện 10-15 phút ôn tập ngẫu nhiên sẽ đẩy nhanh tốc độ chuyển nhớ dài hạn đấy!"
                              : "Hãy dán tài liệu của bạn vào mục OCR để bắt đầu tạo các chặng lộ trình kiến thức của riêng mình nhé!"
                            }
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Active Roadmaps Tracker Grid */}
                  {savedRoadmaps.filter(rm => rm.milestones.some(m => m.cards.some(card => card.subjectId === activeSubject))).length > 0 && (
                    <div className="glass-panel" style={{ padding: "1.25rem", marginBottom: "1.25rem", border: "3px solid #2d3748", boxShadow: "4px 4px 0px #2d3748", backgroundColor: "#fffbeb" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e3a8a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        🗺️ Các lộ trình đang học tập ({savedRoadmaps.length})
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                        {savedRoadmaps.filter(rm => rm.milestones.some(m => m.cards.some(card => card.subjectId === activeSubject))).map(rm => {
                          const roadmapCards = rm.milestones.flatMap(m => m.cards);
                          const masteredCount = roadmapCards.filter(card => cards.some(deckCard => deckCard.id === card.id && deckCard.box === 3)).length;
                          const progress = roadmapCards.length ? Math.round((masteredCount / roadmapCards.length) * 100) : 0;

                          return (
                            <div key={rm.id} className="notebook-preview-box" style={{ padding: "0.75rem 1rem", backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <div>
                                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", margin: "0 0 0.25rem 0", color: "#2d3748" }}>{rm.topicName}</h4>
                                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                                  Độ khó: <b>{rm.difficulty}</b> | Tiến độ chặng: <b>{masteredCount}/3 chặng</b>
                                </div>
                              </div>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                  <div style={{ flex: 1, height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden", border: "1px solid #2d3748" }}>
                                    <div className="progress-fill" style={{ height: "100%", width: `${progress}%`, backgroundColor: progress === 100 ? "#10b981" : "#f59e0b" }}></div>
                                  </div>
                                  <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>{progress}%</span>
                                </div>
                                <button className="btn btn-secondary btn-full btn-sm" style={{ padding: "4px" }} onClick={() => {
                                  setActiveMapId(rm.id);
                                  setActiveTab("knowledge-map");
                                  setSelectedMapNodeId(null);
                                }}>
                                  Vào bản đồ liên kết 🗺️
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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
                    {/* LEFT PANEL: Flow Status (Prioritized!) */}
                    <div className="dashboard-col glass-panel" style={{ flex: 1, border: "3px solid #3b82f6", boxShadow: "4px 4px 0px #2d3748" }}>
                      <div className="panel-header" style={{ borderBottom: "2px dashed #3b82f6", paddingBottom: "0.5rem" }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <i className="fa-solid fa-heart-pulse text-red animate-pulse"></i> 
                          Trạng thái điều hướng Flow 
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981" }} className="animate-pulse"></span>
                        </h3>
                      </div>
                      <div className="flow-card" style={{ marginTop: "1rem" }}>
                        <div className="flow-status" style={{ backgroundColor: "#f0fdf4", border: "2px solid #2d3748", borderRadius: "12px", padding: "0.75rem", display: "flex", gap: "0.75rem", marginBottom: "0.75rem", boxShadow: "2px 2px 0px #2d3748" }}>
                          <i className="fa-solid fa-route text-cyan flow-route-icon" style={{ fontSize: "1.5rem" }}></i>
                          <div>
                            <h4 style={{ margin: 0, fontWeight: 800, color: "#1e3a8a" }}>
                              {mood === "tired" || mood === "stressed" ? "Chế độ Thích ứng: Khởi động Nhẹ" : mood === "excited" || mood === "focused" ? "Chế độ Thích ứng: Đột phá Trí tuệ" : "Chế độ Thích ứng: Phân bổ Interleaving"}
                            </h4>
                            <p className="text-muted" style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", lineHeight: 1.4 }}>
                              {mood === "tired" || mood === "stressed" ? "AI ưu tiên đẩy thẻ xanh (lý thuyết nhẹ nhàng) lên trước giúp bạn thư thái học tập." : mood === "excited" || mood === "focused" ? "Hào hứng cao độ! AI đẩy các thẻ đỏ và vàng thử thách tư duy phân tích lên trước." : "Cảm xúc cân bằng, AI trộn đều các hộp thẻ theo lộ trình."}
                            </p>
                          </div>
                        </div>
                        {triggerBurnout && (
                          <div className="burnout-indicator alert-box" style={{ margin: "0.5rem 0" }}>
                            <i className="fa-solid fa-shield-halved text-orange animate-pulse"></i>
                            <span><b>Chống Burnout:</b> Số thẻ khó quá tải! Đã tự động dời các thẻ dễ sang ngày mai.</span>
                          </div>
                        )}
                        {diffDays <= 30 && settings.examMode && (
                          <div className="exam-mode-indicator alert-box border-cyan" style={{ margin: "0.5rem 0" }}>
                            <i className="fa-solid fa-gauge-high text-cyan"></i>
                            <span><b>Nén lộ trình kì thi:</b> Khoảng thời gian ôn tập được rút ngắn tối đa.</span>
                          </div>
                        )}
                        <div className="session-summary-box" style={{ marginTop: "1rem" }}>
                          <h4 style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.5rem" }}>Bài học kế tiếp đề xuất:</h4>
                          <div className={`suggested-deck-badge ${mood === "tired" || mood === "stressed" ? "border-green" : mood === "excited" || mood === "focused" ? "border-red" : "border-yellow"}`} style={{ display: "inline-block", width: "100%", padding: "0.5rem", borderRadius: "8px", border: "2px solid #2d3748", boxShadow: "2px 2px 0px #2d3748", marginBottom: "0.75rem", boxSizing: "border-box" }}>
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

                    {/* RIGHT PANEL: Leitner Box Status */}
                    <div className="dashboard-col glass-panel" style={{ flex: 1, border: "3px solid #2d3748", boxShadow: "4px 4px 0px #2d3748" }}>
                      <div className="panel-header" style={{ borderBottom: "2px dashed #2d3748", paddingBottom: "0.5rem" }}>
                        <h3><i className="fa-solid fa-box-open text-primary"></i> Trạng thái các hộp thẻ (Hộp Leitner)</h3>
                      </div>
                      <div className="boxes-status-container" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                        <div className="box-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="box-badge-num" style={{ width: "32px", height: "32px", minWidth: "32px" }}>1</div>
                            <div className="box-details">
                              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Ngăn 1: Ôn hàng ngày</h4>
                              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>Kiến thức mới nạp / Dễ quên</p>
                              <div className="progress-bar-container" style={{ marginTop: "0.25rem" }}>
                                <div className="progress-fill" style={{ width: `${stats.total ? (stats.box1 / stats.total) * 100 : 0}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="box-count-badge" style={{ padding: "4px 10px", fontSize: "0.95rem" }}>{stats.box1}</div>
                        </div>

                        <div className="box-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="box-badge-num bg-yellow" style={{ width: "32px", height: "32px", minWidth: "32px" }}>2</div>
                            <div className="box-details">
                              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Ngăn 2: Ôn 2-3 ngày/lần</h4>
                              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>Kiến thức tạm nhớ ổn định</p>
                              <div className="progress-bar-container" style={{ marginTop: "0.25rem" }}>
                                <div className="progress-fill bg-yellow" style={{ width: `${stats.total ? (stats.box2 / stats.total) * 100 : 0}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="box-count-badge" style={{ padding: "4px 10px", fontSize: "0.95rem" }}>{stats.box2}</div>
                        </div>

                        <div className="box-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="box-badge-num bg-green" style={{ width: "32px", height: "32px", minWidth: "32px" }}>3</div>
                            <div className="box-details">
                              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Ngăn 3: Ôn 7-10 ngày/lần</h4>
                              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>Kiến thức bền vững dài hạn</p>
                              <div className="progress-bar-container" style={{ marginTop: "0.25rem" }}>
                                <div className="progress-fill bg-green" style={{ width: `${stats.total ? (stats.box3 / stats.total) * 100 : 0}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="box-count-badge" style={{ padding: "4px 10px", fontSize: "0.95rem" }}>{stats.box3}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Study Guide Notebook Sticker */}
                  <div className="glass-panel" style={{ padding: "1.25rem", marginTop: "1.5rem", border: "3px dashed #10b981", borderRadius: "12px", backgroundColor: "#f0fdf4", boxShadow: "4px 4px 0px #2d3748" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#065f46", margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      📚 Hướng dẫn Số hóa tài liệu học bằng AI OCR
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontSize: "0.85rem", lineHeight: "1.5", color: "#047857" }}>
                      <div style={{ padding: "0.75rem", background: "#fff", border: "2px solid #2d3748", borderRadius: "8px", boxShadow: "2px 2px 0px #2d3748" }}>
                        <div style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>1️⃣ Vào Tab OCR 📂</div>
                        Nhấp chọn tab <b>Số hóa & AI OCR</b> trên thanh menu điều hướng bên trái.
                      </div>
                      <div style={{ padding: "0.75rem", background: "#fff", border: "2px solid #2d3748", borderRadius: "8px", boxShadow: "2px 2px 0px #2d3748" }}>
                        <div style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>2️⃣ Nhập Tài liệu ✍️</div>
                        Chọn <b>Nhập văn bản</b> (hoặc Kéo File) rồi dán nội dung bài học/câu hỏi muốn quét.
                      </div>
                      <div style={{ padding: "0.75rem", background: "#fff", border: "2px solid #2d3748", borderRadius: "8px", boxShadow: "2px 2px 0px #2d3748" }}>
                        <div style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>3️⃣ AI Sinh lộ trình 🤖</div>
                        Nhấn <b>Khởi tạo Lộ trình học tập</b>. AI sẽ tự động lập 3 chặng bài học và thẻ tương ứng.
                      </div>
                      <div style={{ padding: "0.75rem", background: "#fff", border: "2px solid #2d3748", borderRadius: "8px", boxShadow: "2px 2px 0px #2d3748" }}>
                        <div style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>4️⃣ Duyệt & Ôn tập 🚀</div>
                        Duyệt câu hỏi ở Verification Layer, lưu thẻ và mở tab **Bản đồ tri thức** để học!
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* TAB: RETRIEVAL STUDY PANEL */}
          {activeTab === "retrieval" && (
            <section className="tab-content active">
              <div className="study-layout" style={{ justifyContent: "center" }}>
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
                              {showHint && (
                                <div className="notebook-hint-box" style={{ marginBottom: "1rem" }}>
                                  <span>💡 Gợi ý lý thuyết:</span> {activeCard.modelAnswer.split(/[.!?]/)[0]}...
                                </div>
                              )}
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
                              {activeCard.type === 'green' ? (
                                <button className="btn btn-secondary btn-sm" onClick={handleFlipCard}>
                                  Xem đáp án & Gợi ý <i className="fa-solid fa-arrow-rotate-right"></i>
                                </button>
                              ) : false ? (
                                <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                                  ⏳ Suy nghĩ thêm... (Hiện gợi ý sau {30 - secondsElapsed}s)
                                </button>
                              ) : false ? (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  {!showHint && (
                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowHint(true)}>
                                      Gợi ý 💡
                                    </button>
                                  )}
                                  <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                                    ⏳ Xem Đáp án (sau {45 - secondsElapsed}s)
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  {!showHint && (
                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowHint(true)}>
                                      Gợi ý 💡
                                    </button>
                                  )}
                                  <button className="btn btn-secondary btn-sm" onClick={handleFlipCard}>
                                    Nộp câu trả lời <i className="fa-solid fa-paper-plane"></i>
                                  </button>
                                </div>
                              )}
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
                          <div className="grading-instruction">{activeCard.type === "green" && selectedGreenOption !== activeCard.correctOption ? "Bạn chọn chưa đúng — thẻ sẽ quay lại Hộp 1 để ôn lại." : "Bạn đánh giá mức độ nhớ của mình thế nào?"}</div>
                          <div className="grading-buttons">
                            {activeCard.type === "green" && selectedGreenOption !== activeCard.correctOption ? (
                              <button className="btn-grade btn-grade-hard" onClick={() => handleGradeSubmit("hard")}>
                                <span className="grade-icon">↩</span>
                                <span className="grade-title">Ôn lại thẻ này</span>
                                <span className="grade-time">Quay về Hộp 1</span>
                              </button>
                            ) : <>
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
                            </>}
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
                <div className="ocr-uploader notebook-paper">
                  <div className="spiral-rings">
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                  </div>
                  
                  <div className="notebook-tab-header">
                    <button className={`notebook-tab-btn ${ocrInputType === 'file' ? 'active' : ''}`} onClick={() => setOcrInputType('file')}>
                      📂 Tải tệp tin
                    </button>
                    <button className={`notebook-tab-btn ${ocrInputType === 'text' ? 'active' : ''}`} onClick={() => setOcrInputType('text')}>
                      ✍️ Nhập văn bản
                    </button>
                  </div>

                  {ocrInputType === 'file' && (
                    ocrStatus === "idle" ? (
                      <div className="drag-zone" onClick={() => document.getElementById("react-ocr-file")?.click()} style={{ border: "2px dashed #2d3748", backgroundColor: "transparent" }}>
                        <i className="fa-solid fa-folder-open cloud-icon" style={{ color: "#2d3748" }}></i>
                        <h4 style={{ color: "#2d3748" }}>Kéo & thả tài liệu hoặc chọn tệp tin</h4>
                        <p className="text-muted" style={{ color: "#4b5563" }}>Định dạng hỗ trợ: PDF, DOCX, TXT, PNG, JPG (Tối đa 10MB)</p>
                        <input type="file" id="react-ocr-file" className="hidden" accept="image/*,.pdf,.docx,.txt" onChange={handleSelectOCRFile} />
                      </div>
                    ) : (
                      <div className="uploaded-preview-container">
                        <div className="scanner-window" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", border: "2px dashed #2d3748", backgroundColor: "rgba(0,0,0,0.05)" }}>
                          {ocrPreviewSrc ? (
                            <img src={ocrPreviewSrc} alt="OCR Preview" style={{ width: "100%", height: "auto", maxHeight: "160px", objectFit: "contain", opacity: 0.8 }} />
                          ) : (
                            <div style={{ padding: "2rem", textAlign: "center" }}>
                              <i className="fa-solid fa-file-invoice text-cyan" style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "#1e3a8a" }}></i>
                              <p className="text-xs" style={{ color: "#2d3748" }}>{ocrFileName}</p>
                            </div>
                          )}
                          <div className={`scan-laser ${ocrStatus === "scanning" ? "scanning" : ""}`}></div>
                        </div>
                        <div className="upload-file-details" style={{ color: "#2d3748" }}>
                          <span>{ocrFileName}</span>
                          <span className="text-muted" style={{ color: "#6b7280" }}>{ocrFileSize}</span>
                        </div>
                        <button className="notebook-btn" onClick={triggerOCRScan} disabled={ocrStatus === "scanning"} style={{ width: "100%" }}>
                          <i className="fa-solid fa-wand-magic-sparkles"></i> Khởi tạo Lộ trình học tập AI
                        </button>
                      </div>
                    )
                  )}

                  {ocrInputType === 'text' && (
                    <div className="uploaded-preview-container">
                      <div className="document-maker-header">
                        <span className="document-maker-kicker">✦ XƯỞNG TẠO LỘ TRÌNH</span>
                        <h3>Tạo tài liệu học tập của bạn</h3>
                        <p>Chọn thẻ để AI hiểu mục tiêu, sau đó dán kiến thức hoặc ghi chú cần học.</p>
                        <div className="document-tag-groups">
                          <div><small>Môn học — chọn thư mục cho lộ trình</small>{["Hóa học","Vật lý","Toán học", ...customSubjects].map(tag => <button key={tag} className={`document-tag ${selectedDocumentSubject === tag ? "selected" : ""}`} onClick={() => { setSelectedDocumentSubject(tag); setDocumentTags(prev => [...prev.filter(t => !["Hóa học", "Vật lý", "Toán học", ...customSubjects].includes(t)), tag]); if (tag === "Hóa học") setActiveSubject("chemistry"); if (tag === "Vật lý") setActiveSubject("physics"); }}>{tag}</button>)}</div>
                          <div><small>Mục tiêu</small>{["Ôn thi","Hiểu bài","Luyện đề"].map(tag => <button key={tag} className={`document-tag ${documentTags.includes(tag) ? "selected" : ""}`} onClick={() => setDocumentTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}>{tag}</button>)}</div>
                        </div>
                        <div className="custom-subject-row"><input value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} placeholder="Ví dụ: Lập trình Python, Sinh học…" /><button onClick={() => { const subject = customSubject.trim(); if (!subject) return; const slug = subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); setCustomSubjects(prev => { const next = prev.includes(subject) ? prev : [...prev, subject]; localStorage.setItem("custom_subject_folders", JSON.stringify(next)); return next; }); setSelectedDocumentSubject(subject); setActiveSubject(`custom-${slug || "subject"}`); setDocumentTags(prev => [...prev.filter(t => !["Hóa học", "Vật lý", "Toán học", ...customSubjects].includes(t)), subject]); setCustomSubject(""); }}>+ Tạo thư mục môn học</button></div>
                      </div>
                      <textarea 
                        className="notebook-textarea"
                        value={ocrTextContent}
                        onChange={(e) => {
                          setOcrTextContent(e.target.value);
                          setActiveOCRBase64(e.target.value);
                          setActiveOCRMimeType("text/plain");
                          setOcrFileName("Văn bản tự nhập");
                          setOcrFileSize(`${(e.target.value.length / 1024).toFixed(1)} KB`);
                          setOcrPreviewSrc("");
                          if (ocrStatus === "done") {
                            setOcrStatus("idle");
                            setActiveRoadmap(null);
                          }
                        }}
                        placeholder="Hãy dán hoặc tự nhập tài liệu học tập của bạn vào đây (ví dụ: các định nghĩa, công thức hóa học, bài giảng vật lý...). AI sẽ phân tích và lập lộ trình chặng kèm thẻ Leitner cho bạn!"
                      />
                      <div className={`scan-laser ${ocrStatus === "scanning" ? "scanning" : ""}`} style={{ position: "relative", height: "4px", marginTop: "4px" }}></div>
                      <button className="notebook-btn notebook-btn-success" onClick={triggerOCRScan} disabled={ocrStatus === "scanning" || !ocrTextContent.trim()} style={{ width: "100%", marginTop: "0.5rem" }}>
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Khởi tạo Lộ trình học tập AI
                      </button>
                    </div>
                  )}

                </div>

                <div className="ocr-results notebook-paper" style={{ minHeight: "520px" }}>
                  <div className="spiral-rings">
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                  </div>
                  
                  <div className="panel-header" style={{ borderBottom: "2px dashed #2d3748" }}>
                    <h3 className="notebook-title" style={{ borderBottom: "none", margin: 0, padding: 0 }}><i className="fa-solid fa-road" style={{ color: "#1e3a8a" }}></i> Bản đồ Lộ trình học tập Cá nhân hóa</h3>
                    <span className={`notebook-badge ${ocrStatus === "done" ? "notebook-badge-green" : "notebook-badge-blue"}`}>
                      {ocrStatus === "idle" ? "Chờ phân tích" : ocrStatus === "scanning" ? "Đang tạo..." : "Hoàn thành"}
                    </span>
                  </div>

                  {ocrStatus === "idle" && (
                    <div className="ocr-results-empty" style={{ color: "#2d3748", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div>
                        <i className="fa-solid fa-route icon-large" style={{ color: "rgba(45, 55, 72, 0.4)", fontSize: "3rem", marginBottom: "0.5rem" }}></i>
                        <h4 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Kết quả lộ trình học tập</h4>
                        <p className="text-muted" style={{ color: "#4b5563", fontSize: "0.95rem" }}>Chọn tài liệu mẫu, dán văn bản bài học hoặc tải tệp tin ghi chú lên. AI sẽ xây dựng timeline học chặng thông minh cho bạn.</p>
                      </div>

                      {savedRoadmaps.length > 0 && (
                        <div style={{ width: "100%", textAlign: "left", marginTop: "1rem", borderTop: "2px dashed #2d3748", paddingTop: "1rem" }}>
                          <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#1e3a8a", marginBottom: "0.75rem", textTransform: "uppercase" }}>
                            📚 Lộ trình học tập đã lưu ({savedRoadmaps.length}):
                          </h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "250px", overflowY: "auto", paddingRight: "0.25rem" }}>
                            {savedRoadmaps.map((rm) => (
                              <div 
                                key={rm.id} 
                                className="notebook-btn"
                                onClick={() => {
                                  setActiveRoadmap(rm);
                                  if (rm.milestones.length > 0) {
                                    setSelectedMilestoneId(rm.milestones[0].id);
                                  }
                                  setOcrStatus("done");
                                }}
                                style={{ 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  alignItems: "center", 
                                  backgroundColor: "#fff", 
                                  padding: "0.6rem 0.85rem",
                                  fontSize: "0.95rem",
                                  cursor: "pointer",
                                  border: "2px solid #2d3748",
                                  borderRadius: "10px",
                                  boxShadow: "2px 2px 0px #2d3748",
                                  width: "100%",
                                  boxSizing: "border-box"
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <span>🗺️</span>
                                  <span style={{ fontWeight: 700 }}>{rm.topicName}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <span className="notebook-badge" style={{ fontSize: "0.75rem", padding: "0.2rem 0.4rem" }}>
                                    {rm.difficulty}
                                  </span>
                                  <button 
                                    onClick={(e) => handleDeleteRoadmap(e, rm.id)}
                                    style={{ 
                                      background: "none", 
                                      border: "none", 
                                      color: "#ef4444", 
                                      cursor: "pointer", 
                                      padding: "0.2rem",
                                      fontSize: "0.95rem"
                                    }}
                                    title="Xóa lộ trình"
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {ocrStatus === "scanning" && (
                    <div className="ocr-loading-view" style={{ color: "#2d3748" }}>
                      <div className="ai-processing-spinner" style={{ borderTopColor: "#1e3a8a", borderLeftColor: "#1e3a8a" }}></div>
                      <h4 style={{ fontWeight: 700 }}>AI đang thiết lập chặng lộ trình...</h4>
                      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", margin: "0.25rem 0 0.4rem" }}>
                        <span className="notebook-badge" style={{ background: "#e9d493", color: "#3f493d" }}>Môn: {selectedDocumentSubject}</span>
                        <span className="notebook-badge" style={{ background: "#dce9cf", color: "#3f493d" }}>NVIDIA Nemotron 120B</span>
                        <span className="notebook-badge" style={{ background: "#f2dfbb", color: "#3f493d" }}>3 chặng Bloom</span>
                      </div>
                      <div style={{ width: "100%", maxWidth: "430px", margin: "0.75rem auto 0", textAlign: "left" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          <span>{generationProgress < 60 ? "Đang đọc tài liệu" : generationProgress < 90 ? "Đang tạo roadmap và quiz" : "Đang hoàn tất JSON"}</span>
                          <span>{Math.round(generationProgress)}%</span>
                        </div>
                        <div style={{ height: "12px", border: "2px solid #2d3748", borderRadius: "999px", overflow: "hidden", background: "#f8ebc9" }}>
                          <div style={{ height: "100%", width: `${generationProgress}%`, background: "linear-gradient(90deg, #d49a42, #7e9d72)", transition: "width 1.1s ease" }} />
                        </div>
                        <p style={{ margin: "0.45rem 0 0", fontSize: "0.8rem", color: "#5b5849" }}>Tác vụ dài có thể mất vài phút; bạn có thể để trang này mở trong lúc AI xử lý.</p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.55rem", width: "100%", maxWidth: "500px", margin: "1rem auto 0", textAlign: "left" }}>
                        {[
                          { icon: "fa-book-open", label: "Đọc", active: generationProgress < 60 },
                          { icon: "fa-wand-magic-sparkles", label: "Thiết kế", active: generationProgress >= 60 && generationProgress < 90 },
                          { icon: "fa-circle-check", label: "Kiểm duyệt", active: generationProgress >= 90 }
                        ].map((stage, index) => (
                          <div key={stage.label} style={{ padding: "0.65rem", border: `2px solid ${generationProgress >= (index + 1) * 30 ? "#7e9d72" : "#b9aa7d"}`, borderRadius: "10px", background: stage.active ? "#fff1c8" : "rgba(255,255,255,.35)", boxShadow: stage.active ? "3px 3px 0 rgba(78, 94, 63, .22)" : "none", transition: "all .35s ease" }}>
                            <i className={`fa-solid ${stage.icon}`} style={{ color: stage.active ? "#a9664b" : "#8a876d", marginRight: "0.35rem" }}></i>
                            <b style={{ fontSize: "0.82rem" }}>{stage.label}</b>
                            <div style={{ fontSize: "0.72rem", marginTop: "0.25rem", color: "#676250" }}>{stage.active ? "Đang xử lý" : generationProgress >= (index + 1) * 30 ? "Hoàn tất" : "Chờ lượt"}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bloom-steps" style={{ marginTop: "1rem", color: "#2d3748" }}>
                        <div className={`step-line ${ocrStep >= 1 ? (ocrStep > 1 ? "completed" : "active") : ""}`} style={{ color: ocrStep > 1 ? "#10b981" : ocrStep === 1 ? "#3b82f6" : "#6b7280" }}>
                          <i className={`fa-solid ${ocrStep > 1 ? "fa-check-circle" : "fa-spinner fa-spin"}`}></i> 📂 Trích xuất dữ liệu tài liệu...
                        </div>
                        <div className={`step-line ${ocrStep >= 2 ? (ocrStep > 2 ? "completed" : "active") : ""}`} style={{ color: ocrStep > 2 ? "#10b981" : ocrStep === 2 ? "#3b82f6" : "#6b7280" }}>
                          <i className="fa-solid fa-spinner fa-spin"></i> 🗺️ Tạo chặng & Thẻ Leitner Bloom...
                        </div>
                        <div className={`step-line ${ocrStep >= 3 ? "completed" : ""}`} style={{ color: ocrStep >= 3 ? "#10b981" : "#6b7280" }}>
                          <i className={`fa-solid ${ocrStep >= 3 ? "fa-check-circle" : "fa-clock"}`}></i> 🧩 Kiểm tra quiz và lưu vào thư viện cá nhân...
                        </div>
                      </div>
                    </div>
                  )}

                  {ocrStatus === "done" && activeRoadmap && (
                    <div className="ocr-proposal-view active" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", color: "#2d3748" }}>
                      <div style={{ borderBottom: "2px dashed #2d3748", paddingBottom: "0.75rem" }}>
                        <span className="notebook-badge notebook-badge-blue" style={{ marginBottom: "0.5rem", display: "inline-block" }}>Chuyên đề: {activeRoadmap.topicName}</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.95rem" }}>
                          <span>Độ khó: <b>{activeRoadmap.difficulty}</b></span>
                          <span>Số chặng tích hợp: <b>{activeRoadmap.milestones.length} chặng</b></span>
                        </div>
                      </div>

                      {/* Interactive Visual Timeline Road */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", padding: "1rem 0", margin: "0 1rem" }}>
                        <div style={{ position: "absolute", left: 0, right: 0, height: "4px", backgroundColor: "#2d3748", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}></div>
                        {activeRoadmap.milestones.map((m, mIdx) => {
                          const isSelected = selectedMilestoneId === m.id;
                          let dotClass = "notebook-timeline-dot";
                          if (m.status === "completed") {
                            dotClass += " completed";
                          } else if (isSelected) {
                            dotClass += " active";
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
                                transform: isSelected ? "scale(1.1)" : "scale(1)", 
                                transition: "all 0.2s ease" 
                              }}
                            >
                              <div className={dotClass}>
                                {m.status === "completed" ? "✓" : mIdx + 1}
                              </div>
                              <span style={{ fontSize: "0.85rem", marginTop: "0.35rem", fontWeight: isSelected ? "700" : "500", color: isSelected ? "#3b82f6" : "#2d3748" }}>
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
                          <div className="proposed-card-item notebook-preview-box" style={{ borderLeft: "4px solid #2d3748" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                              <h4 style={{ fontWeight: "700", fontSize: "1.1rem", color: "#1e3a8a" }}>{m.title}</h4>
                              <span className={`notebook-badge ${m.status === "completed" ? "notebook-badge-green" : m.status === "active" ? "notebook-badge-blue" : ""}`}>
                                {m.status === "completed" ? "Đã học" : m.status === "active" ? "Sẵn sàng" : "🔒 Đang khóa"}
                              </span>
                            </div>
                            <p style={{ lineHeight: "1.4", fontSize: "0.95rem", marginBottom: "0.75rem" }}>{m.description}</p>
                            
                            <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#4b5563", marginBottom: "1rem" }}>
                              <span><i className="fa-regular fa-clock"></i> Thời gian: <b>{m.timeEstimate}</b></span>
                              <span><i className="fa-solid fa-clone"></i> Thẻ liên kết: <b>{m.cards.length} thẻ</b></span>
                            </div>

                            {/* Card Previews */}
                            <div style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "2px dashed #2d3748", borderRadius: "10px", padding: "0.75rem" }}>
                              <span className={`notebook-badge ${m.cards[0]?.type === "green" ? "notebook-badge-green" : m.cards[0]?.type === "yellow" ? "" : "notebook-badge-red"}`} style={{ fontSize: "0.75rem", padding: "2px 6px" }}>
                                {m.cards[0]?.type === "green" ? "Recall" : m.cards[0]?.type === "yellow" ? "Apply" : "Synthesize"}
                              </span>
                              <p style={{ margin: "0.5rem 0", fontWeight: 700, lineHeight: "1.4", fontSize: "1rem" }}>{m.cards[0]?.question}</p>
                              <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#4b5563" }}>Nguồn: {m.cards[0]?.reference}</p>
                            </div>

                            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                              {m.status === "locked" ? (
                                <button className="notebook-btn" disabled style={{ width: "100%" }}>
                                  <i className="fa-solid fa-lock"></i> Hoàn thành chặng trước để mở khóa
                                </button>
                              ) : m.status === "active" ? (
                                <button className="notebook-btn" onClick={() => handleApproveMilestone(m.id)} style={{ width: "100%" }}>
                                  <i className="fa-solid fa-bolt"></i> Kích hoạt chặng này (+30 XP)
                                </button>
                              ) : (
                                <button className="notebook-btn notebook-btn-secondary" onClick={() => handleStartRoadmapPractice(activeRoadmap.id, m.cards[0]?.id)} style={{ width: "100%" }}>
                                  <i className="fa-solid fa-play"></i> Bắt đầu ôn tập trong Leitner
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                        <button className="notebook-btn" onClick={() => activeRoadmap && openVerification(activeRoadmap)} style={{ width: "100%", backgroundColor: "#fbbf24", color: "#2d3748" }}>
                          <i className="fa-solid fa-check-double"></i> 🔍 Duyệt & Xác nhận Thẻ (Verification Layer)
                        </button>
                        <button className="notebook-btn notebook-btn-success" onClick={handleApproveOCR} style={{ width: "100%" }}>
                          <i className="fa-solid fa-circle-check"></i> Kích hoạt toàn bộ lộ trình (+100 XP)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TAB: KNOWLEDGE MAP */}
          {activeTab === "knowledge-map" && (
            <section className="tab-content active">
              {savedRoadmaps.filter(rm => rm.milestones.some(m => m.cards.some(card => card.subjectId === activeSubject))).length === 0 ? (
                <div className="glass-panel notebook-paper" style={{ padding: "2.5rem 2rem 2.5rem 3.5rem", position: "relative", minHeight: "450px" }}>
                  <div className="spiral-rings">
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                    <div className="spiral-ring"></div>
                  </div>
                  <h2 style={{ fontSize: "2rem", color: "#1e3a8a", marginBottom: "1rem", fontWeight: 800 }}>
                    🗺️ Bản đồ tri thức chưa khai phá!
                  </h2>
                  <div style={{ fontSize: "1.15rem", lineHeight: "1.7", display: "flex", flexDirection: "column", gap: "1.2rem", color: "#2d3748" }}>
                    <p>Hiện tại, bạn chưa tạo bất kỳ lộ trình học tập cá nhân hóa nào bằng AI OCR, nên Bản đồ liên kết tri thức đang tạm thời ẩn giấu.</p>
                    <p>Hãy dán tài liệu học hoặc chép văn bản vào tab <b>Số hóa & AI OCR</b> để AI thiết lập các chặng lộ trình. Sơ đồ tư duy liên kết chặng học của riêng bạn sẽ được vẽ tự động tại đây!</p>
                    <div style={{ marginTop: "1rem" }}>
                      <button className="btn btn-primary" onClick={() => { setActiveTab("ocr"); setOcrInputType("text"); }} style={{ padding: "0.85rem 2.2rem", fontSize: "1.1rem" }}>
                        Khởi tạo Lộ trình học tập AI 🚀
                      </button>
                    </div>
                  </div>
                </div>
              ) : (() => {
                const visibleRoadmaps = savedRoadmaps.filter(rm => rm.milestones.some(m => m.cards.some(card => card.subjectId === activeSubject)));
                const activeMap = visibleRoadmaps.find(r => r.id === activeMapId) || visibleRoadmaps[0];
                if (!activeMap) return null;

                const getRoadmapProgress = (rm: LearningRoadmap) => {
                  const roadmapCards = rm.milestones.flatMap(m => m.cards);
                  const masteredCount = roadmapCards.filter(card => cards.some(deckCard => deckCard.id === card.id && deckCard.box === 3)).length;
                  return roadmapCards.length ? Math.round((masteredCount / roadmapCards.length) * 100) : 0;
                };

                const getCustomMapNodesCoords = () => {
                  return [
                    { id: "ms1", x: 120, y: 290 },
                    { id: "ms2", x: 380, y: 180 },
                    { id: "ms3", x: 640, y: 390 }
                  ];
                };

                return (
                  <div className="knowledge-map-layout">
                    {/* Left Sidebar Menu */}
                    <div className="map-sidebar-pane">
                      <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1e3a8a", borderBottom: "2px dashed #2d3748", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                        📋 Danh sách lộ trình
                      </h3>
                      <div className="saved-roadmaps-list-scroll" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: "500px" }}>
                        {visibleRoadmaps.map((rm) => {
                          const isSelected = activeMap.id === rm.id;
                          const progress = getRoadmapProgress(rm);
                          return (
                            <div 
                              key={rm.id} 
                              onClick={() => {
                                setActiveMapId(rm.id);
                                setSelectedMapNodeId(null);
                              }}
                              className={`notebook-preview-box ${isSelected ? "active" : ""}`}
                              style={{ 
                                cursor: "pointer", 
                                border: "2px solid #2d3748",
                                borderColor: isSelected ? "#3b82f6" : "#2d3748",
                                transform: isSelected ? "scale(1.02)" : "scale(1)",
                                transition: "all 0.15s ease",
                                backgroundColor: isSelected ? "#eff6ff" : "#fff",
                                position: "relative",
                                boxShadow: newlyCreatedMapId === rm.id ? "0 0 0 4px #f59e0b, 0 0 24px rgba(245, 158, 11, .58)" : undefined
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", margin: 0, color: isSelected ? "#1e3a8a" : "#2d3748" }}>{rm.topicName}</h4>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRoadmap(e, rm.id);
                                    if (activeMapId === rm.id) {
                                      setActiveMapId("");
                                    }
                                  }}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.95rem", padding: "2px" }}
                                  title="Xóa lộ trình"
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                              <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                                Độ khó: <b>{rm.difficulty}</b>
                              </div>
                              {/* Progress bar */}
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <div style={{ flex: 1, height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden", border: "1px solid #2d3748" }}>
                                  <div style={{ height: "100%", width: `${progress}%`, backgroundColor: progress === 100 ? "#10b981" : "#f59e0b" }}></div>
                                </div>
                                <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>{progress}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Main Pane */}
                    <div className="map-main-pane">
                      <div className="panel-header" style={{ padding: "0.5rem 1rem", border: "2px solid #2d3748", borderRadius: "12px", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ fontWeight: 800, color: "#1e3a8a", margin: 0 }}>Sơ đồ liên kết: {activeMap.topicName}</h4>
                        <div className="map-legend" style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", alignItems: "center" }}>
                          <button className="notebook-btn notebook-btn-success" onClick={() => handleStartRoadmapPractice(activeMap.id)} style={{ padding: "0.4rem 0.7rem", fontSize: "0.8rem" }}>
                            <i className="fa-solid fa-play"></i> Học lộ trình này
                          </button>
                          <span className="legend-item"><span className="legend-dot bg-gray"></span> Chưa mở</span>
                          <span className="legend-item"><span className="legend-dot bg-orange"></span> Đang học</span>
                          <span className="legend-item"><span className="legend-dot bg-green"></span> Đã vững</span>
                        </div>
                      </div>

                      <div className="map-container" style={{ position: "relative", overflow: "visible" }}>
                        <svg id="knowledge-map-svg" width="100%" height="580" style={{ overflow: "visible" }}>
                          <defs>
                            <filter id="crayon-sketch" x="-10%" y="-10%" width="120%" height="120%">
                              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                          </defs>

                          {/* Draw Links between ms1 -> ms2 and ms2 -> ms3 */}
                          {(() => {
                            const linkCoords = [
                              { from: "ms1", to: "ms2" },
                              { from: "ms2", to: "ms3" }
                            ];
                            return linkCoords.map(link => {
                              const fromCoord = getCustomMapNodesCoords().find(c => c.id === link.from);
                              const toCoord = getCustomMapNodesCoords().find(c => c.id === link.to);
                              if (!fromCoord || !toCoord) return null;

                              // Check states to see if path is active
                              const fromMilestone = activeMap.milestones[0]; // ms1
                              const toMilestone = activeMap.milestones[1]; // ms2
                              const currentLinkFrom = link.from === "ms1" ? fromMilestone : toMilestone;
                              
                              const fromCard = cards.find(c => currentLinkFrom?.cards.some(mc => mc.id === c.id));
                              const activePath = fromCard && fromCard.box === 3;

                              return (
                                <line 
                                  key={`${link.from}-${link.to}`}
                                  x1={fromCoord.x} 
                                  y1={fromCoord.y} 
                                  x2={toCoord.x} 
                                  y2={toCoord.y} 
                                  className={`map-link ${activePath ? "active-path" : ""}`}
                                  filter="url(#crayon-sketch)"
                                />
                              );
                            });
                          })()}

                          {/* Draw Nodes */}
                          {activeMap.milestones.map((m, idx) => {
                            const pos = getCustomMapNodesCoords()[idx];
                            if (!pos) return null;

                            const currentCard = cards.find(c => m.cards.some(mc => mc.id === c.id));
                            
                            let state: "locked" | "active" | "mastered" | "red-ready" = "locked";
                            
                            let prereqMastered = true;
                            if (idx > 0) {
                              const prevMilestone = activeMap.milestones[idx - 1];
                              const prevCard = cards.find(c => prevMilestone?.cards.some(mc => mc.id === c.id));
                              prereqMastered = prevCard !== undefined && prevCard.box === 3;
                            }

                            if (!prereqMastered) {
                              state = "locked";
                            } else if (!currentCard) {
                              state = "active";
                            } else if (currentCard.box === 3) {
                              state = "mastered";
                            } else {
                              state = "active";
                            }

                            const isSelected = selectedMapNodeId === m.id;
                            let nodeClass = "map-node";
                            if (state === "locked") nodeClass += " node-locked";
                            else if (state === "active") nodeClass += " node-active";
                            else if (state === "mastered") nodeClass += " node-mastered";

                            const romanNumerals = ["I", "II", "III", "IV"];

                            return (
                              <g 
                                key={m.id} 
                                className={nodeClass} 
                                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                                onClick={() => setSelectedMapNodeId(m.id)}
                              >
                                <circle cx={pos.x} cy={pos.y} r={isSelected ? 48 : 40} className="node-circle" filter="url(#crayon-sketch)" />
                                <text x={pos.x} y={pos.y} className="node-text">
                                  {romanNumerals[idx]}
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
                                  {m.title}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Node detail panel */}
                        {selectedMapNodeId && (() => {
                          const m = activeMap.milestones.find(x => x.id === selectedMapNodeId);
                          if (!m) return null;

                          const currentCard = cards.find(c => m.cards.some(mc => mc.id === c.id));

                          return (
                            <div className="node-detail-sidebar" style={{ top: "10px", right: "10px", height: "calc(100% - 20px)" }}>
                              <button className="close-sidebar-btn" onClick={() => setSelectedMapNodeId(null)}>
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                              <div className="node-title-header">
                                <span className="subject-tag" style={{ backgroundColor: "#ffd1d7", color: "#2d3748" }}>{activeMap.topicName}</span>
                                <h3>{m.title}</h3>
                              </div>
                              <p id="map-node-desc" className="text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>{m.description}</p>
                              
                              <div className="node-prereq-list" style={{ fontSize: "0.9rem" }}>
                                <strong>Thời gian ước tính:</strong>{" "}
                                <span>{m.timeEstimate || "15 phút"}</span>
                              </div>

                              <div className="chapter-card-stats" style={{ display: "block", marginTop: "1rem" }}>
                                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1e3a8a" }}>
                                  Thẻ Leitner liên kết:
                                </h4>
                                {currentCard ? (
                                  <div className="notebook-preview-box" style={{ padding: "0.75rem", borderLeft: "4px solid #10b981", backgroundColor: "#f0fdf4" }}>
                                    <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: 0, color: "#1e3a8a" }}>Ngăn tủ: Ngăn {currentCard.box}</p>
                                    <p style={{ fontSize: "0.85rem", color: "#4b5563", marginTop: "0.25rem", whiteSpace: "normal" }}>
                                      <b>Câu hỏi:</b> {currentCard.question}
                                    </p>
                                    <span className="notebook-badge notebook-badge-green" style={{ marginTop: "0.5rem", display: "inline-block" }}>
                                      {currentCard.type.toUpperCase()}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="notebook-preview-box" style={{ padding: "0.75rem", borderLeft: "4px solid #f59e0b", backgroundColor: "#fffbeb" }}>
                                    <p style={{ fontSize: "0.85rem", color: "#b45309", margin: 0, lineHeight: 1.4 }}>
                                      ⚠️ Thẻ này chưa kích hoạt. Vui lòng kích hoạt lộ trình này từ kết quả AI OCR.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {currentCard && (
                                <button className="btn btn-primary btn-full" style={{ marginTop: "1.25rem" }} onClick={() => {
                                  handleStartCardPractice(currentCard);
                                  setSelectedMapNodeId(null);
                                }}>
                                  <i className="fa-solid fa-play"></i> Bắt đầu ôn tập Thẻ này
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
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
      {checkpointModalOpen && (
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
              {checkpointLoading || !checkpointQuestion ? (
                <div style={{ minHeight: "220px", display: "grid", placeItems: "center", textAlign: "center", gap: "0.75rem", padding: "1.5rem" }}>
                  <div className="avatar animate-bounce" style={{ width: "58px", height: "58px", fontSize: "1.65rem", backgroundColor: "#f59e0b", border: "3px solid #78350f" }}>🤖</div>
                  <div>
                    <h3 style={{ margin: "0 0 .35rem", color: "#7c2d12" }}>AI đang soạn câu hỏi kiểm tra…</h3>
                    <p className="text-sm text-muted" style={{ margin: 0 }}>Đang dựa trên các thẻ bạn vừa học để tạo một câu hỏi đúng trọng tâm.</p>
                  </div>
                  <div style={{ width: "min(280px, 100%)", height: "8px", borderRadius: "999px", overflow: "hidden", background: "#fde68a", border: "1px solid #d97706" }}>
                    <div className="progress-fill" style={{ width: "68%", height: "100%", background: "#f59e0b" }} />
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
            <div className="modal-footer">
              <span className="text-xs text-muted">Trả lời sai sẽ đưa toàn bộ thẻ dễ vừa ôn về Ngăn 1 để chống rỗng kiến thức.</span>
            </div>
          </div>
        </div>
      )}

      {/* Generation journey: opens immediately after the learner starts AI roadmap creation. */}
      {ocrStatus === "scanning" && (
        <div className="verification-modal-overlay" style={{ zIndex: 1400, backdropFilter: "blur(7px)", background: "rgba(47, 58, 47, .54)" }}>
          <div className="verification-modal-content" style={{ maxWidth: "650px", textAlign: "center", overflow: "hidden", background: "#f8ebc9" }}>
            <div style={{ padding: "1.75rem 1.5rem", background: "linear-gradient(135deg, #d7c27b, #e9d493)", borderBottom: "3px solid #718a68" }}>
              <span style={{ display: "inline-flex", width: "56px", height: "56px", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#f8efcf", border: "3px solid #526a50", color: "#a9664b", fontSize: "1.4rem", boxShadow: "4px 4px 0 rgba(60,78,55,.22)" }}><i className="fa-solid fa-wand-magic-sparkles"></i></span>
              <h2 style={{ margin: "0.8rem 0 0.3rem", color: "#37453c", fontSize: "1.5rem" }}>AI đang xây lộ trình của bạn</h2>
              <p style={{ margin: 0, color: "#53604c" }}>Thư mục đang chọn: <b>{selectedDocumentSubject}</b></p>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", margin: "0 auto 1.2rem", maxWidth: "440px" }}>
                {["Tài liệu", "Lộ trình", "Quiz"].map((label, index) => {
                  const completed = generationProgress >= [30, 65, 95][index];
                  const active = !completed && generationProgress >= [0, 30, 65][index];
                  return <React.Fragment key={label}><div style={{ display: "grid", placeItems: "center", gap: "0.25rem", minWidth: "76px", color: completed || active ? "#3f5b45" : "#8c896e" }}><span style={{ display: "grid", placeItems: "center", width: "32px", height: "32px", borderRadius: "50%", border: "2px solid currentColor", background: active ? "#f8d77e" : completed ? "#cfe0b7" : "#f3e6bf" }}>{completed ? <i className="fa-solid fa-check"></i> : index + 1}</span><b style={{ fontSize: "0.77rem" }}>{label}</b></div>{index < 2 && <div style={{ flex: 1, height: "3px", background: completed ? "#789a6d" : "#c9bb8c" }} />}</React.Fragment>;
                })}
              </div>
              <div style={{ border: "2px solid #718a68", borderRadius: "12px", padding: "0.8rem", background: "#fff4d7", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#37453c", marginBottom: "0.45rem" }}><span>{generationProgress < 60 ? "Đang đọc nội dung và mục tiêu" : generationProgress < 90 ? "Đang tạo chặng học và câu hỏi" : "Đang kiểm tra lộ trình"}</span><span>{Math.round(generationProgress)}%</span></div>
                <div style={{ height: "14px", background: "#e1d2a6", borderRadius: "999px", overflow: "hidden" }}><div style={{ width: `${generationProgress}%`, height: "100%", background: "linear-gradient(90deg,#b97558,#d49a42,#7e9d72)", transition: "width 1s ease" }} /></div>
              </div>
              <p style={{ margin: "1rem 0 0", fontSize: "0.85rem", color: "#625f4c" }}>Đừng đóng trang này. Khi hoàn tất, bạn sẽ được mở popup để đặt tên, chọn môn và duyệt thẻ.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Verification Layer (Retagging & Edit Popup) */}
      {isVerificationModalOpen && verificationCards.length > 0 && (
        <div className="verification-modal-overlay">
          <div className="verification-modal-content">
            <div className="verification-header">
              <h2>✍️ Kiểm duyệt & Phân loại Kiến thức (Verification Layer)</h2>
              <button className="notebook-btn notebook-btn-secondary" onClick={() => setIsVerificationModalOpen(false)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.95rem" }}>
                Đóng
              </button>
            </div>
            <div className="verification-body">
              <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "1.5" }}>
                AI đã trích xuất <b>{verificationCards.length} thẻ lý thuyết/bài tập</b>. Bạn hãy kiểm tra lại nội dung, phân loại môn học, chương mục (retagging) trước khi lưu trữ chính thức vào hệ thống Leitner.
              </p>
              
              <div className="verification-grid-2" style={{ padding: "1rem", border: "2px dashed #c99439", borderRadius: "12px", background: "rgba(255, 244, 205, .7)" }}>
                <div className="verification-field-group">
                  <label>Tên / chủ đề lộ trình:</label>
                  <input className="verification-input" value={verificationRoadmapTitle} onChange={(e) => setVerificationRoadmapTitle(e.target.value)} placeholder="Ví dụ: Hàm số bậc hai" />
                </div>
                <div className="verification-field-group">
                  <label>Áp dụng môn học cho tất cả thẻ:</label>
                  <select className="verification-input" value={verificationSubjectId} onChange={(e) => applyVerificationSubject(e.target.value)}>
                    <option value="chemistry">Hóa học</option>
                    <option value="physics">Vật lý</option>
                    {verificationSubjectId.startsWith("custom-") && <option value={verificationSubjectId}>{selectedDocumentSubject}</option>}
                  </select>
                </div>
              </div>

              {verificationCards.map((card, cIdx) => {
                return (
                  <div key={cIdx} className="verification-card-edit">
                    <div className="verification-card-edit-content">
                      <div className="verification-card-header">
                        <h3>
                          <span className={`notebook-badge ${card.type === 'green' ? 'notebook-badge-green' : card.type === 'yellow' ? '' : 'notebook-badge-red'}`}>
                            Thẻ {cIdx + 1}: {card.type === 'green' ? 'Trắc nghiệm (Recall)' : card.type === 'yellow' ? 'Tự luận ngắn (Apply)' : 'Tự luận sâu (Synthesize)'}
                          </span>
                        </h3>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <span className="notebook-badge" style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>Ngăn Leitner: 1</span>
                        </div>
                      </div>

                      {/* Content: Question */}
                      <div className="verification-field-group">
                        <label>Câu hỏi:</label>
                        <textarea 
                          className="verification-input" 
                          style={{ minHeight: "60px", resize: "vertical" }}
                          value={card.question}
                          onChange={(e) => handleUpdateVerificationCard(cIdx, { question: e.target.value })}
                        />
                      </div>

                      {/* Options (Green card only) */}
                      {card.type === 'green' && (
                        <div className="verification-field-group">
                          <label>Các phương án lựa chọn (Chọn nút tròn để chỉ định đáp án đúng):</label>
                          <div className="verification-options-inputs">
                            {(card.options || ["", "", "", ""]).map((opt, oIdx) => (
                              <div key={oIdx} className="verification-option-row">
                                <input 
                                  type="radio" 
                                  name={`correct-opt-${cIdx}`}
                                  className="verification-radio"
                                  checked={card.correctOption === oIdx}
                                  onChange={() => handleUpdateVerificationCard(cIdx, { correctOption: oIdx })}
                                />
                                <span style={{ fontWeight: "700", width: "20px" }}>{String.fromCharCode(65 + oIdx)}.</span>
                                <input 
                                  type="text" 
                                  className="verification-input"
                                  value={opt}
                                  onChange={(e) => handleUpdateVerificationCardOption(cIdx, oIdx, e.target.value)}
                                  placeholder={`Phương án ${String.fromCharCode(65 + oIdx)}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content: Model Answer */}
                      <div className="verification-field-group">
                        <label>{card.type === 'green' ? 'Lời giải chi tiết:' : 'Đáp án chuẩn / Hướng dẫn giải:'}</label>
                        <textarea 
                          className="verification-input" 
                          style={{ minHeight: "80px", resize: "vertical" }}
                          value={card.modelAnswer}
                          onChange={(e) => handleUpdateVerificationCard(cIdx, { modelAnswer: e.target.value })}
                        />
                      </div>

                      {/* Content: Reference */}
                      <div className="verification-field-group" style={{ marginBottom: 0 }}>
                        <label>Nguồn tham khảo / Tài liệu trích dẫn:</label>
                        <input 
                          type="text" 
                          className="verification-input"
                          value={card.reference}
                          onChange={(e) => handleUpdateVerificationCard(cIdx, { reference: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="verification-footer">
              <button className="notebook-btn notebook-btn-secondary" onClick={() => setIsVerificationModalOpen(false)}>
                Hủy bỏ
              </button>
              <button 
                className="notebook-btn notebook-btn-success" 
                onClick={() => handleConfirmVerification(verificationCards)}
                style={{ padding: "0.6rem 1.8rem" }}
              >
                <i className="fa-solid fa-cloud-arrow-up"></i> Xác nhận & Lưu trữ Leitner (+100 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Praise Modal (Speedy Response) */}
      {showPraiseModal && (
        <div className="praise-modal-overlay">
          <div className="praise-modal-content">
            <div className="praise-stars">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <span className="praise-character">⚡</span>
            <h2 className="praise-title">PHẢN XẠ THẦN TỐC!</h2>
            <div className="praise-description">
              <p>Bạn đã hoàn thành việc ôn tập thẻ này cực nhanh trong vòng <b>{praiseTimeSpent} giây</b>!</p>
              <p style={{ marginTop: "0.5rem", color: "#10b981", fontWeight: "700" }}>Thưởng nóng phản xạ: <b>+10 XP Bonus</b>! 🏆</p>
            </div>
            <button className="notebook-btn" onClick={() => setShowPraiseModal(false)} style={{ width: "100%" }}>
              Tiếp tục học tập 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
