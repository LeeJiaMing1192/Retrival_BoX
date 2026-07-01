import type { Subject, Card } from "./types";

export const INITIAL_SUBJECTS: Record<string, Subject> = {
  chemistry: {
    id: "chemistry",
    name: "Hóa Học 12",
    icon: "🧪",
    chapters: [
      { id: "c1", name: "Chương 1: Este - Lipit", description: "Cấu tạo, tính chất vật lý, tính chất hóa học và ứng dụng của Este & Lipit.", prerequisites: [] },
      { id: "c2", name: "Chương 2: Cacbohidrat", description: "Glucozơ, Saccarozơ, Tinh bột & Xenlulozơ - Cấu trúc và sự chuyển hóa.", prerequisites: ["c1"] },
      { id: "c3", name: "Chương 3: Amin, Amino Axit & Protein", description: "Các hợp chất chứa nitơ, cấu trúc peptit và chuỗi sinh học.", prerequisites: ["c2"] },
      { id: "c4", name: "Chương 4: Polime & Vật liệu Polime", description: "Phản ứng trùng hợp, trùng ngưng và tính chất vật liệu polymer.", prerequisites: ["c1", "c3"] }
    ]
  },
  physics: {
    id: "physics",
    name: "Vật Lý 12",
    icon: "⚡",
    chapters: [
      { id: "p1", name: "Chương 1: Dao động cơ", description: "Dao động điều hòa, con lắc lò xo, con lắc đơn và các loại dao động.", prerequisites: [] },
      { id: "p2", name: "Chương 2: Sóng cơ & Sóng âm", description: "Sự truyền sóng, giao thoa sóng, sóng dừng và đặc trưng vật lý sóng âm.", prerequisites: ["p1"] },
      { id: "p3", name: "Chương 3: Dòng điện xoay chiều", description: "Mạch RLC nối tiếp, công suất tiêu thụ và máy biến áp.", prerequisites: ["p1"] }
    ]
  }
};

export const INITIAL_CARDS: Card[] = [
  // Chemistry - Chapter 1: Este - Lipit
  {
    id: "chem-c1-g1",
    subjectId: "chemistry",
    chapterId: "c1",
    type: "green", // Recall
    question: "Phản ứng este hóa giữa axit axetic (CH3COOH) và ancol etylic (C2H5OH) tạo ra este nào sau đây?",
    options: [
      "Etyl axetat (CH3COOC2H5)",
      "Metyl axetat (CH3COOCH3)",
      "Propyl axetat (CH3COOC3H7)",
      "Etyl fomat (HCOOC2H5)"
    ],
    correctOption: 0,
    modelAnswer: "Phản ứng este hóa: CH3COOH + C2H5OH <-> CH3COOC2H5 + H2O (xúc tác H2SO4 đặc, t°). Sản phẩm este thu được là Etyl axetat.",
    reference: "Sách giáo khoa Hóa học 12 - Trang 6",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },
  {
    id: "chem-c1-y1",
    subjectId: "chemistry",
    chapterId: "c1",
    type: "yellow", // Apply
    question: "So sánh nhiệt độ sôi của etyl axetat (este), axit axetic (axit) và ancol etylic (ancol). Giải thích nguyên nhân sự khác biệt này.",
    options: null,
    correctOption: null,
    modelAnswer: "Nhiệt độ sôi xếp theo thứ tự giảm dần: Axit axetic > Ancol etylic > Etyl axetat.\n\nGiải thích:\n- Axit axetic có liên kết hydro liên phân tử bền vững nhất.\n- Ancol etylic cũng có liên kết hydro nhưng yếu hơn axit.\n- Etyl axetat không tạo được liên kết hydro liên phân tử giữa các phân tử este với nhau, lực hút giữa các phân tử chỉ là lực Van der Waals yếu nên dễ bay hơi và có nhiệt độ sôi thấp nhất.",
    reference: "Sách giáo khoa Hóa học 12 - Trang 5",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },
  {
    id: "chem-c1-r1",
    subjectId: "chemistry",
    chapterId: "c1",
    type: "red", // Synthesize
    question: "Một chất béo X (triglixerit) chứa các gốc axit béo oleic và panmitic. Đốt cháy hoàn toàn m gam X thu được CO2 và H2O. Nếu xà phòng hóa hoàn toàn m gam X cần vừa đủ dung dịch NaOH, cô cạn thu được hỗn hợp chứa muối của axit béo oleic và panmitic theo tỉ lệ mol tương ứng là 2:1. Hãy biện luận cấu trúc của X và viết phương trình hóa học biểu diễn các phản ứng xảy ra.",
    options: null,
    correctOption: null,
    modelAnswer: "1. Biện luận cấu trúc:\nVì phản ứng xà phòng hóa thu được muối của axit oleic (C17H33COOH - có 1 liên kết đôi C=C) và axit panmitic (C15H31COOH - axit béo no) theo tỉ lệ mol 2:1, cấu trúc của triglixerit X phải chứa hai gốc oleat và một gốc panmitat liên kết với glixerol.\nCông thức cấu tạo có thể có là:\n- (C17H33COO)2(C15H31COO)C3H5 (hai dạng đồng phân vị trí: gốc panmitat ở carbon số 1 hoặc số 2 của glixerol).\n\n2. Phương trình xà phòng hóa:\n(C17H33COO)2(C15H31COO)C3H5 + 3NaOH -> 2C17H33COONa + C15H31COONa + C3H5(OH)3",
    reference: "Hóa học 12 Nâng cao - Bài tập Lipid tổng hợp",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },

  // Chemistry - Chapter 2: Cacbohidrat
  {
    id: "chem-c2-g1",
    subjectId: "chemistry",
    chapterId: "c2",
    type: "green",
    question: "Cacbohidrat nào sau đây thuộc loại đisaccarit và có nhiều trong cây mía, củ cải đường?",
    options: [
      "Glucozơ",
      "Fructozơ",
      "Saccarozơ",
      "Xenlulozơ"
    ],
    correctOption: 2,
    modelAnswer: "Saccarozơ (C12H22O11) là một đisaccarit, cấu tạo từ một gốc alpha-glucozơ và một gốc beta-fructozơ, có nhiều trong cây mía, củ cải đường và hoa thốt nốt.",
    reference: "Sách giáo khoa Hóa học 12 - Trang 22",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },
  {
    id: "chem-c2-y1",
    subjectId: "chemistry",
    chapterId: "c2",
    type: "yellow",
    question: "Tại sao glucozơ tham gia phản ứng tráng bạc và làm mất màu dung dịch brom, trong khi saccarozơ không có các tính chất này dù đều là cacbohidrat?",
    options: null,
    correctOption: null,
    modelAnswer: "1. Glucozơ có cấu tạo mạch hở chứa nhóm chức andehit (-CHO). Nhóm chức này dễ dàng bị oxi hóa bởi phức bạc-amoniac [Ag(NH3)2]OH tạo thành bạc kim loại (tráng bạc) và làm mất màu dung dịch brom.\n2. Saccarozơ được cấu tạo bởi gốc glucozơ liên kết với gốc fructozơ qua nguyên tử oxy giữa C1 của glucozơ và C2 của fructozơ. Liên kết này đã khóa các nhóm hemiacetal/hemiketal mạch vòng, khiến saccarozơ không thể mở vòng tạo nhóm chức -CHO hở. Do đó, saccarozơ không có tính khử, không tráng bạc và không làm mất màu dung dịch brom ở điều kiện thường.",
    reference: "Sách giáo khoa Hóa học 12 - Trang 23",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },
  {
    id: "chem-c2-r1",
    subjectId: "chemistry",
    chapterId: "c2",
    type: "red",
    question: "Thiết lập chuỗi chuyển hóa sinh học và hóa học từ Xenlulozơ sang Etyl axetat. Viết phương trình phản ứng kèm điều kiện để chứng minh mối liên kết kiến thức giữa Chương 2 (Cacbohidrat) và Chương 1 (Este).",
    options: null,
    correctOption: null,
    modelAnswer: "Chuỗi chuyển hóa liên chương:\nXenlulozơ -> Glucozơ -> Ancol etylic -> Axit axetic -> Etyl axetat\n\nCác phương trình phản ứng:\n1. Thủy phân Xenlulozơ trong môi trường axit:\n(C6H10O5)n + nH2O -(t°, H+)-> nC6H12O6 (Glucozơ)\n\n2. Lên men rượu Glucozơ:\nC6H12O6 -(men rượu, 30-35°C)-> 2C2H5OH + 2CO2\n\n3. Lên men giấm Ancol etylic:\nC2H5OH + O2 -(men giấm)-> CH3COOH + H2O\n\n4. Phản ứng este hóa (liên kết về Chương 1):\nCH3COOH + C2H5OH <-> CH3COOC2H5 (Etyl axetat) + H2O (xúc tác H2SO4 đặc, t°)",
    reference: "Tổng hợp kiến thức hữu cơ Hóa 12 - Chương 1 & 2",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },

  // Chemistry - Chapter 3: Amin, Amino Axit
  {
    id: "chem-c3-g1",
    subjectId: "chemistry",
    chapterId: "c3",
    type: "green",
    question: "Hợp chất nào sau đây thuộc loại amino axit và có tên bán hệ thống là axit alpha-aminoglutaric (được ứng dụng làm bột ngọt)?",
    options: [
      "Alanin",
      "Lysin",
      "Axit glutamic",
      "Valin"
    ],
    correctOption: 2,
    modelAnswer: "Axit glutamic (HOOC-CH2-CH2-CH(NH2)-COOH) có tên bán hệ thống là axit alpha-aminoglutaric, chứa 2 nhóm -COOH và 1 nhóm -NH2, muối mononatri của nó được dùng làm mì chính (bột ngọt).",
    reference: "Sách giáo khoa Hóa học 12 - Trang 44",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },

  // Physics - Chapter 1: Dao động cơ
  {
    id: "phys-c1-g1",
    subjectId: "physics",
    chapterId: "p1",
    type: "green",
    question: "Một con lắc lò xo gồm vật nhỏ khối lượng m và lò xo nhẹ có độ cứng k. Chu kỳ dao động điều hòa của con lắc lò xo được tính bằng công thức nào?",
    options: [
      "T = 2*pi*sqrt(m/k)",
      "T = 2*pi*sqrt(k/m)",
      "T = 1/(2*pi)*sqrt(k/m)",
      "T = 2*pi*sqrt(g/l)"
    ],
    correctOption: 0,
    modelAnswer: "Chu kỳ dao động điều hòa của con lắc lò xo là T = 2*pi*sqrt(m/k), phụ thuộc vào đặc tính riêng của hệ con lắc gồm khối lượng m và độ cứng k.",
    reference: "Sách giáo khoa Vật lý 12 - Trang 9",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },
  {
    id: "phys-c1-y1",
    subjectId: "physics",
    chapterId: "p1",
    type: "yellow",
    question: "Một con lắc đơn dao động điều hòa tại một nơi có gia tốc trọng trường g. Khi chiều dài dây treo giảm đi 4 lần và khối lượng vật nặng tăng lên 2 lần thì chu kỳ dao động của con lắc đơn thay đổi như thế nào? Giải thích chi tiết.",
    options: null,
    correctOption: null,
    modelAnswer: "Chu kỳ dao động điều hòa của con lắc đơn giảm đi 2 lần.\n\nGiải thích:\n- Công thức chu kỳ con lắc đơn là: T = 2*pi*sqrt(l/g).\n- Nhìn vào công thức, chu kỳ T tỉ lệ thuận với căn bậc hai của chiều dài l và hoàn toàn KHÔNG phụ thuộc vào khối lượng m của vật nặng.\n- Khi chiều dài dây treo l giảm 4 lần, căn bậc hai của l giảm sqrt(4) = 2 lần.\n- Việc khối lượng m tăng lên 2 lần không làm ảnh hưởng tới T.\n- Do đó, chu kỳ mới T' = T/2, tức là giảm 2 lần.",
    reference: "Sách giáo khoa Vật lý 12 - Trang 14",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  },
  {
    id: "phys-c1-r1",
    subjectId: "physics",
    chapterId: "p1",
    type: "red",
    question: "Một hệ dao động gồm vật m = 200g gắn vào lò xo có k = 80 N/m, đặt trên mặt phẳng nằm ngang có hệ số ma sát trượt mu = 0.1. Kéo vật ra khỏi vị trí cân bằng một đoạn 10 cm rồi thả nhẹ để vật dao động tắt dần. Tính quãng đường tổng cộng vật đi được kể từ lúc thả đến khi dừng lại hẳn và số dao động toàn phần mà vật thực hiện được.",
    options: null,
    correctOption: null,
    modelAnswer: "1. Tính số dao động toàn phần N cho đến khi dừng:\n- Độ giảm biên độ sau mỗi chu kỳ dao động là: Delta A = (4 * mu * m * g) / k\nDelta A = (4 * 0.1 * 0.2 * 10) / 80 = 0.01 m = 1 cm.\n- Số dao động thực hiện được: N = A_0 / Delta A = 10 cm / 1 cm = 10 dao động toàn phần.\n\n2. Tính quãng đường tổng cộng S:\n- Dùng định luật bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa hoàn toàn thành công của lực ma sát.\n- E_ban_dau = 0.5 * k * A_0^2 = 0.5 * 80 * (0.1)^2 = 0.4 J.\n- Công của lực ma sát: A_ms = F_ms * S = mu * m * g * S\n- F_ms = 0.1 * 0.2 * 10 = 0.2 N.\n- Ta có: E_ban_dau = F_ms * S => S = E_ban_dau / F_ms = 0.4 / 0.2 = 2 mét.\n\nĐáp số: Quãng đường đi được là 2m; thực hiện được 10 dao động toàn phần.",
    reference: "Vật lý 12 Nâng cao - Chuyên đề Dao động tắt dần",
    box: 1,
    lastReviewed: null,
    nextReviewDate: null,
    history: []
  }
];
