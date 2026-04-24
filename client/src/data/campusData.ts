/**
 * CCU International Student Friendly Campus Guide — Data Layer
 *
 * ============================================================
 * 【變更說明 CHANGE LOG】
 * ============================================================
 * 1. [新增] Office / Department interface 加入圖片欄位：
 *    - floor_plan_image?: string  樓層平面圖路徑
 *    - entrance_image?: string    處室門口照片路徑
 *    圖片放在 client/public/images/offices/ 或 client/public/images/departments/
 *
 * 2. [修正] category 值統一：
 *    - 行政處室 → "office"
 *    - 系所及學院 → "department"
 *    - 校園生活 → "campus_life"
 *    （地圖分類依此值篩選）
 *
 * 3. [新增] 以下行政處室（來源：組員 PDF 資料）：
 *    - 教學發展中心、資訊處、語言中心
 *    - 課外活動組、學生安全組、生活事務組
 *    - 職涯發展中心、招生組
 *    - 總務處事務組、總務處出納組、總務處保管組
 *    - 駐警處車輛管控中心
 *
 * 4. [更新] 衛生保健組地點修正為活動中心二樓
 *
 * 5. [新增] 院辦（7 個學院）加入 departments 陣列，
 *    以 is_college_office: true 標記
 *
 * 6. [新增] 文學院系所補齊：
 *    台灣文學與創意應用研究所、語言學研究所
 *    各系辦室號更新為正確資訊
 *
 * ============================================================
 * 【未來更新指南 HOW TO UPDATE】
 * ============================================================
 * ▶ 新增/修改行政處室：
 *   找到 `export const offices: Office[] = [` 陣列，
 *   複製一筆現有資料，修改欄位後加入。
 *   category 固定填 "office"。
 *
 * ▶ 新增/修改系所：
 *   找到 `export const departments: Department[] = [` 陣列，
 *   按學院分區新增。
 *   category 固定填 "department"。
 *
 * ▶ 更新院辦：
 *   搜尋 `is_college_office: true` 即可找到所有院辦資料。
 *
 * ▶ 新增圖片：
 *   1. 把圖片放進 client/public/images/offices/[office_id]/ 資料夾
 *   2. 在對應的資料項目填入：
 *      floor_plan_image: "/images/offices/oia/floor_plan.jpg"
 *      entrance_image: "/images/offices/oia/entrance.jpg"
 *
 * ▶ 修改服務分類關鍵字（影響搜尋）：
 *   找到 `export const serviceCategories` 修改 keywords 陣列。
 * ============================================================
 */

// ============================================================
// Service Categories
// ============================================================
export interface ServiceCategory {
  id: string;
  name_en: string;
  name_zh: string;
  icon: string;
  description_en: string;
  description_zh: string;
  keywords: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "registration",
    name_en: "Registration",
    name_zh: "註冊",
    icon: "ClipboardCheck",
    description_en: "Course registration, enrollment status, and academic records",
    description_zh: "選課註冊、學籍與學業紀錄",
    keywords: ["registration", "enroll", "enrollment", "register", "course selection", "選課", "註冊", "學籍"]
  },
  {
    id: "student_id",
    name_en: "Student ID",
    name_zh: "學生證",
    icon: "CreditCard",
    description_en: "Student ID card issuance, replacement, and related services",
    description_zh: "學生證核發、補辦與相關服務",
    keywords: ["student id", "student card", "id card", "replacement", "學生證", "補辦", "卡片"]
  },
  {
    id: "international_support",
    name_en: "International Support",
    name_zh: "國際學生支援",
    icon: "Globe",
    description_en: "Visa, ARC, scholarships, and international student life support",
    description_zh: "簽證、居留證、獎學金與國際學生生活輔導",
    keywords: ["international", "visa", "arc", "alien resident", "scholarship", "foreign", "exchange", "國際", "簽證", "居留證", "獎學金"]
  },
  {
    id: "department_offices",
    name_en: "Department Offices",
    name_zh: "系辦公室",
    icon: "Building2",
    description_en: "Academic department offices for course and program inquiries",
    description_zh: "各系所辦公室，提供課程與學程諮詢",
    keywords: ["department", "department office", "faculty", "professor", "advisor", "系辦", "系所", "教授", "導師"]
  },
  {
    id: "dormitory",
    name_en: "Dormitory",
    name_zh: "宿舍",
    icon: "Home",
    description_en: "Dormitory application, maintenance, and housing services",
    description_zh: "宿舍申請、維修與住宿服務",
    keywords: ["dormitory", "dorm", "housing", "room", "accommodation", "宿舍", "住宿", "房間"]
  },
  {
    id: "health",
    name_en: "Health",
    name_zh: "健康醫療",
    icon: "Heart",
    description_en: "Health center, medical services, and health checkups",
    description_zh: "健康中心、醫療服務與健康檢查",
    keywords: ["health", "medical", "doctor", "clinic", "hospital", "sick", "injury", "健康", "醫療", "看病", "受傷"]
  },
  {
    id: "library",
    name_en: "Library",
    name_zh: "圖書館",
    icon: "BookOpen",
    description_en: "Book borrowing, study spaces, and academic resources",
    description_zh: "圖書借閱、自習空間與學術資源",
    keywords: ["library", "book", "study", "research", "database", "圖書館", "借書", "自習", "研究"]
  },
  {
    id: "student_affairs",
    name_en: "Student Affairs",
    name_zh: "學生事務",
    icon: "Users",
    description_en: "Student life, clubs, counseling, and general student services",
    description_zh: "學生生活、社團、諮商與一般學生服務",
    keywords: ["student affairs", "club", "counseling", "activity", "student life", "學務", "社團", "諮商", "活動"]
  },
  {
    id: "academic_affairs",
    name_en: "Academic Affairs",
    name_zh: "教務",
    icon: "GraduationCap",
    description_en: "Curriculum, grades, transcripts, and academic policies",
    description_zh: "課程、成績、成績單與學術政策",
    keywords: ["academic", "curriculum", "grade", "transcript", "graduation", "credit", "教務", "成績", "成績單", "畢業", "學分"]
  },
  {
    id: "campus_life",
    name_en: "Campus Life",
    name_zh: "校園生活",
    icon: "Coffee",
    description_en: "Dining, convenience stores, ATMs, and daily campus services",
    description_zh: "餐廳、便利商店、ATM 與日常校園服務",
    keywords: ["food", "restaurant", "cafeteria", "atm", "convenience store", "shop", "餐廳", "便利商店", "ATM", "商店"]
  },
  {
    id: "course_issues",
    name_en: "Course Issues",
    name_zh: "選課相關",
    icon: "FileText",
    description_en: "Course add/drop, schedule conflicts, and course-related problems",
    description_zh: "加退選、衝堂與選課相關問題",
    keywords: ["course", "add", "drop", "schedule", "class", "選課", "加選", "退選", "衝堂", "課程"]
  },
  {
    id: "tuition",
    name_en: "Tuition & Fees",
    name_zh: "學費繳納",
    icon: "Wallet",
    description_en: "Tuition payment, fee reduction, and financial matters",
    description_zh: "學費繳納、減免與財務相關事項",
    keywords: ["tuition", "fee", "payment", "financial", "money", "學費", "繳費", "減免", "財務"]
  },
  {
    id: "career",
    name_en: "Career Development",
    name_zh: "職涯發展",
    icon: "Briefcase",
    description_en: "Job hunting, internships, career counseling, and recruitment events",
    description_zh: "求職、實習、職涯諮詢與校園徵才",
    keywords: ["career", "job", "internship", "resume", "recruitment", "職涯", "求職", "實習", "履歷", "徵才"]
  },
  {
    id: "it_support",
    name_en: "IT Support",
    name_zh: "資訊服務",
    icon: "Monitor",
    description_en: "Campus network, accounts, software, and digital learning systems",
    description_zh: "校園網路、帳號、軟體與數位學習系統",
    keywords: ["wifi", "network", "account", "software", "ecourse", "microsoft", "google", "網路", "帳號", "軟體", "資訊"]
  },
  {
    id: "counseling",
    name_en: "Counseling",
    name_zh: "心理諮商",
    icon: "HeartHandshake",
    description_en: "Psychological counseling, mental health support, and student wellness",
    description_zh: "心理諮商、心理健康支持與學生身心健康",
    keywords: ["counseling", "mental health", "stress", "anxiety", "depression", "諮商", "心理", "壓力", "情緒"]
  }
];

// ============================================================
// Offices (Administrative Units)
// ============================================================
export interface Office {
  id: string;
  name_zh: string;
  name_en: string;
  // [修正] category 值：統一使用 "office"，地圖依此分類
  category: string;
  service_categories: string[];
  building_name_zh: string;
  building_name_en: string;
  floor: string;
  indoor_location_note_zh: string;
  indoor_location_note_en: string;
  function_desc_zh: string;
  function_desc_en: string;
  service_scope_zh: string;
  service_scope_en: string;
  common_scenarios_zh: string;
  common_scenarios_en: string;
  office_hours: string;
  phone: string;
  email: string;
  official_url: string;
  google_maps_query: string;
  latitude: number;
  longitude: number;
  source_url: string;
  needs_manual_review: boolean;
  // [新增] 圖片欄位
  floor_plan_image?: string;  // 樓層平面圖，放在 client/public/images/offices/[id]/
  entrance_image?: string;    // 處室門口照片
}

export const offices: Office[] = [
  // ---- 教務處相關 ----
  {
    id: "oaa",
    name_zh: "教務處",
    name_en: "Office of Academic Affairs",
    category: "office",
    service_categories: ["academic_affairs", "registration", "course_issues"],
    building_name_zh: "行政大樓東棟",
    building_name_en: "East Wing, Administration Building",
    floor: "1F–2F",
    indoor_location_note_zh: "行政大樓東棟一樓至二樓",
    indoor_location_note_en: "1st–2nd Floor, East Wing, Administration Building",
    function_desc_zh: "統籌全校教務事項，包括課程規劃、選課、成績管理、學籍與畢業審查。",
    function_desc_en: "Oversees academic affairs including curriculum planning, course selection, grade management, enrollment status, and graduation review.",
    service_scope_zh: "課程規劃、選課系統、成績查詢、學籍管理、畢業審查。",
    service_scope_en: "Curriculum planning, Course selection system, Grade inquiry, Enrollment management, Graduation review.",
    common_scenarios_zh: "選課問題、成績疑義、畢業資格確認。",
    common_scenarios_en: "Course selection issues, Grade disputes, Graduation eligibility confirmation.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oaa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "oaa_reg",
    name_zh: "教務處－註冊組",
    name_en: "Division of Registration, Office of Academic Affairs",
    category: "office",
    service_categories: ["registration", "student_id", "academic_affairs", "tuition"],
    building_name_zh: "行政大樓東棟",
    building_name_en: "East Wing, Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓東棟一樓",
    indoor_location_note_en: "1st Floor, East Wing, Administration Building",
    function_desc_zh: "處理學生註冊、學籍異動、成績單核發、學生證補發、休退學等事務。",
    function_desc_en: "Handles student registration, enrollment changes, transcript issuance, student ID replacement, leave of absence, and withdrawal.",
    service_scope_zh: "舊生註冊、復學、休學、退學；成績單申請；學生證補發；學分抵免；畢業資格審查。",
    service_scope_en: "Registration, reinstatement, leave of absence, withdrawal; Transcript applications; Student ID replacement; Credit transfer; Graduation review.",
    common_scenarios_zh: "補辦學生證、申請成績單、辦理休學、註冊問題。",
    common_scenarios_en: "Replace student ID, Apply for transcript, Process leave of absence, Registration issues.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411 ext. 16102",
    email: "",
    official_url: "https://oaa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "oaa_admissions",
    name_zh: "教務處－招生組",
    name_en: "Division of Admissions, Office of Academic Affairs",
    category: "office",
    service_categories: ["registration", "academic_affairs"],
    building_name_zh: "行政大樓東棟",
    building_name_en: "East Wing, Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓東棟二樓",
    indoor_location_note_en: "2nd Floor, East Wing, Administration Building",
    function_desc_zh: "負責各類招生試務辦理，包含申請、考試及陳情申訴等事務。",
    function_desc_en: "Responsible for all aspects of student admissions including applications, examinations, petitions, and appeals.",
    service_scope_zh: "各類招生試務辦理；考生陳情、申訴與退費；公文與郵件管理。",
    service_scope_en: "Various enrollment and examination affairs; Candidate petitions, appeals, and refunds; Document management.",
    common_scenarios_zh: "入學申請、考試相關問題、申訴退費。",
    common_scenarios_en: "Admission applications, Exam-related issues, Appeals and refunds.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oaa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "oaa_curriculum",
    name_zh: "教務處－課務組",
    name_en: "Division of Curriculum, Office of Academic Affairs",
    category: "office",
    service_categories: ["course_issues", "academic_affairs"],
    building_name_zh: "行政大樓東棟",
    building_name_en: "East Wing, Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓東棟二樓",
    indoor_location_note_en: "2nd Floor, East Wing, Administration Building",
    function_desc_zh: "負責課程安排、教室調配、選課系統管理與考試事務。",
    function_desc_en: "Responsible for course scheduling, classroom allocation, course selection system management, and examination affairs.",
    service_scope_zh: "課程時間表、教室借用、選課加退選、考試安排。",
    service_scope_en: "Course timetable, Classroom booking, Course add/drop, Exam scheduling.",
    common_scenarios_zh: "選課衝堂、加退選問題、教室查詢。",
    common_scenarios_en: "Course schedule conflicts, Add/drop issues, Classroom inquiry.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oaa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  // [新增] 教學發展中心
  {
    id: "ctld",
    name_zh: "教學發展中心",
    name_en: "Center for Teaching and Learning Development",
    category: "office",
    service_categories: ["academic_affairs"],
    building_name_zh: "行政大樓東棟",
    building_name_en: "East Wing, Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓東棟二樓",
    indoor_location_note_en: "2nd Floor, East Wing, Administration Building",
    function_desc_zh: "辦理教學意見調查、提供教學與學習支持資源、推動教學品質提升。",
    function_desc_en: "Administers course evaluation surveys, provides teaching and learning support resources, and promotes instructional quality.",
    service_scope_zh: "教學意見調查與統計；教學助理（TA）認證培訓；教師教學輔導與評鑑。",
    service_scope_en: "Course evaluation surveys; TA training and certification; Teaching improvement support and evaluation.",
    common_scenarios_zh: "教學助理申請、教學相關諮詢。",
    common_scenarios_en: "TA application, Teaching-related consultation.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oaa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  // ---- 國際處 ----
  {
    id: "oia",
    name_zh: "國際事務處",
    name_en: "Office of International Affairs (OIA)",
    category: "office",
    service_categories: ["international_support", "registration", "student_affairs"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓一樓",
    indoor_location_note_en: "1st Floor, Administration Building",
    function_desc_zh: "負責國際學生入學、簽證居留、獎學金、交換計畫、國際活動與生活輔導等事務。",
    function_desc_en: "Handles international student admissions, visa/ARC, scholarships, exchange programs, international events, and life support.",
    service_scope_zh: "入學諮詢、簽證與居留證辦理、獎學金申請、國際交流活動、國際學生生活輔導。",
    service_scope_en: "Admission inquiry, Visa & ARC application, Scholarship application, International exchange events, Life counseling for international students.",
    common_scenarios_zh: "居留證問題、獎學金申請、入學手續、國際活動報名、生活疑難。",
    common_scenarios_en: "ARC issues, Scholarship application, Enrollment procedures, International event registration, General life problems.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411 ext. 17619",
    email: "oia@ccu.edu.tw",
    official_url: "https://oia.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oia.ccu.edu.tw/",
    needs_manual_review: false
  },
  // ---- 學務處相關 ----
  {
    id: "osa",
    name_zh: "學生事務處",
    name_en: "Office of Student Affairs",
    category: "office",
    service_categories: ["student_affairs", "dormitory", "health"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓西棟二樓",
    indoor_location_note_en: "2nd Floor, West Wing, Administration Building",
    function_desc_zh: "統籌學生生活事務，包括宿舍、社團、獎助學金、學生輔導與校園安全。",
    function_desc_en: "Oversees student life affairs including dormitory, clubs, financial aid, student counseling, and campus safety.",
    service_scope_zh: "宿舍管理、社團輔導、獎助學金、學生保險、校安通報。",
    service_scope_en: "Dormitory management, Club guidance, Financial aid, Student insurance, Campus safety reporting.",
    common_scenarios_zh: "宿舍問題、社團活動、獎助學金申請、校園安全。",
    common_scenarios_en: "Dormitory issues, Club activities, Financial aid application, Campus safety.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "osa_dorm",
    name_zh: "學務處－住宿服務組",
    name_en: "Housing Service Division, Office of Student Affairs",
    category: "office",
    service_categories: ["dormitory", "student_affairs"],
    building_name_zh: "學生活動中心",
    building_name_en: "Student Activity Center",
    floor: "1F",
    indoor_location_note_zh: "學生活動中心一樓",
    indoor_location_note_en: "1st Floor, Student Activity Center",
    function_desc_zh: "管理學生宿舍申請、床位分配、維修報修、退宿及相關住宿服務。",
    function_desc_en: "Manages dormitory applications, bed allocation, maintenance requests, move-out procedures, and related housing services.",
    service_scope_zh: "宿舍申請與分配、修繕報修、冷氣卡儲值、退宿手續、校外賃居業務。",
    service_scope_en: "Dormitory application & allocation, Maintenance requests, AC card recharge, Move-out procedures, Off-campus rental housing.",
    common_scenarios_zh: "宿舍申請、門禁問題、設備報修、冷氣卡。",
    common_scenarios_en: "Dormitory application, Access issues, Equipment repair, AC card.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411 ext. 17551",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學學生活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  // [新增] 生活事務組
  {
    id: "osa_life",
    name_zh: "學務處－生活事務組",
    name_en: "Student Life and Activities Office, Office of Student Affairs",
    category: "office",
    service_categories: ["student_affairs", "dormitory", "tuition"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓西棟二樓",
    indoor_location_note_en: "2nd Floor, West Wing, Administration Building",
    function_desc_zh: "辦理獎助學金、就學貸款、學雜費減免、弱勢助學、學生保險及失物招領等事務。",
    function_desc_en: "Handles scholarships, student loans, tuition reduction, financial aid for disadvantaged students, student insurance, and lost & found.",
    service_scope_zh: "獎助學金申請；就學貸款；學雜費減免；弱勢學生補助；學生團體保險；失物招領。",
    service_scope_en: "Scholarship/bursary applications; Student loans; Tuition reduction; Financial aid; Student group insurance; Lost and Found.",
    common_scenarios_zh: "申請獎學金、就學貸款、學費減免、失物招領。",
    common_scenarios_en: "Apply for scholarship, student loan, tuition reduction, Lost and Found.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  // [新增] 課外活動組
  {
    id: "osa_extracurricular",
    name_zh: "學務處－課外活動組",
    name_en: "Division of Extra-Curricular Activities",
    category: "office",
    service_categories: ["student_affairs"],
    building_name_zh: "活動中心",
    building_name_en: "Activity Center",
    floor: "2F",
    indoor_location_note_zh: "活動中心二樓",
    indoor_location_note_en: "2nd Floor, Activity Center",
    function_desc_zh: "辦理社團成立、幹部交接、活動規劃、場地借用及學生會相關行政支援。",
    function_desc_en: "Handles club establishment, officer handover, activity planning, venue booking, and student association administrative support.",
    service_scope_zh: "社團成立申請；社團活動與大型活動規劃；活動中心場地（討論室、琴房、演藝廳）借用；社團活動經費申請。",
    service_scope_en: "Club establishment; Activity planning and major campus events; Activity Center venue booking (discussion rooms, practice rooms, performance halls); Funding applications.",
    common_scenarios_zh: "社團成立、場地借用、活動申請、經費補助。",
    common_scenarios_en: "Club establishment, Venue booking, Activity applications, Funding applications.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  // [新增] 學生安全組
  {
    id: "osa_safety",
    name_zh: "學務處－學生安全組",
    name_en: "Division of Student Safety",
    category: "office",
    service_categories: ["student_affairs", "health"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "B1",
    indoor_location_note_zh: "行政大樓西棟地下一樓",
    indoor_location_note_en: "Basement 1, West Wing, Administration Building",
    function_desc_zh: "負責學生安全事件通報、校園安全資訊、學生生活輔導及兵役諮詢。",
    function_desc_en: "Handles student safety incident reporting, campus safety information, student life support, and military service consultation.",
    service_scope_zh: "意外通報、24小時校安中心；校園安全資訊；學生生活關懷；性別事件處理；兵役申請與諮詢。",
    service_scope_en: "Incident reporting, 24-hour security support; Campus safety info; Student care services; Gender incident support; Military service consultation.",
    common_scenarios_zh: "緊急事件通報、兵役緩徵申請、安全諮詢。",
    common_scenarios_en: "Emergency incident reporting, Military service deferment, Safety consultation.",
    office_hours: "24 hours (security), Mon–Fri 08:30–17:00 (office)",
    phone: "05-2720411",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  // ---- 健康與諮商 ----
  // [更新] 衛生保健組地點修正為活動中心二樓
  {
    id: "health_center",
    name_zh: "衛生保健組",
    name_en: "Health Services Division",
    category: "office",
    service_categories: ["health", "student_affairs"],
    building_name_zh: "活動中心",
    building_name_en: "Activity Center",
    floor: "2F",  // [更新] 原為 1F，依 PDF 修正為 2F
    indoor_location_note_zh: "活動中心二樓",
    indoor_location_note_en: "2nd Floor, Activity Center",
    function_desc_zh: "提供基本醫療服務、健康諮詢、新生體檢、傳染病防治與學生保險理賠。",
    function_desc_en: "Provides basic medical services, health consultation, new student checkups, infectious disease prevention, and student insurance claims.",
    service_scope_zh: "新生健康檢查；基本醫療與轉介；傳染病防治；學生團體保險理賠；健康測量與器材借用。",
    service_scope_en: "New student health examinations; Basic first aid and referral; Infectious disease prevention; Student insurance claims; Health measurement equipment.",
    common_scenarios_zh: "身體不適、受傷、新生體檢、保險理賠。",
    common_scenarios_en: "Feeling unwell, Injury, New student health checkup, Insurance claims.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "counseling",
    name_zh: "諮商中心",
    name_en: "Counseling Center",
    category: "office",
    service_categories: ["counseling", "health", "student_affairs"],
    building_name_zh: "活動中心",
    building_name_en: "Activity Center",
    floor: "3F",
    indoor_location_note_zh: "活動中心三樓",
    indoor_location_note_en: "3rd Floor, Activity Center",
    function_desc_zh: "提供心理諮商、心理測驗、學習適應、生涯輔導及身心障礙學生支持服務。",
    function_desc_en: "Provides psychological counseling, psychological testing, academic adaptation, career counseling, and support for students with disabilities.",
    service_scope_zh: "個別與團體諮商；心理測驗評估；學習適應與生涯輔導；新生心理健康篩檢；自殺防治；身心障礙學生支持。",
    service_scope_en: "Individual and group counseling; Psychological assessments; Academic adaptation and career counseling; New student mental health screening; Suicide prevention; Disability support.",
    common_scenarios_zh: "心理壓力、適應困難、情緒問題、人際關係、生涯迷惘。",
    common_scenarios_en: "Stress, Adjustment difficulties, Emotional issues, Interpersonal relationships, Career uncertainty.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://advising.ccu.edu.tw/",
    google_maps_query: "國立中正大學活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://advising.ccu.edu.tw/",
    needs_manual_review: false
  },
  // ---- 圖書館與資訊 ----
  {
    id: "library",
    name_zh: "圖書館",
    name_en: "Library",
    category: "office",
    service_categories: ["library", "academic_affairs"],
    building_name_zh: "圖書資訊大樓",
    building_name_en: "Information and Library Building",
    floor: "B1–6F",
    indoor_location_note_zh: "圖書資訊大樓，服務台在一樓",
    indoor_location_note_en: "Information and Library Building, service desk on 1st floor",
    function_desc_zh: "提供圖書借閱、電子資料庫、自習空間、研究小間與多媒體服務。",
    function_desc_en: "Provides book borrowing, electronic databases, study spaces, research carrels, and multimedia services.",
    service_scope_zh: "圖書借還與續借；電子資源與資料庫；空間申請（討論室、自習室）；館際合作；論文上傳。",
    service_scope_en: "Book borrowing, renewal, reservation; Electronic databases and e-resources; Space reservations; Interlibrary loan; Thesis upload.",
    common_scenarios_zh: "借書還書、查論文、預約討論室、使用資料庫。",
    common_scenarios_en: "Borrow/return books, Search for thesis, Reserve discussion rooms, Use databases.",
    office_hours: "Mon–Fri 08:20–21:30, Sat–Sun 09:00–17:00 (varies by semester)",
    phone: "05-2720411 ext. 15101",
    email: "",
    official_url: "https://lib.ccu.edu.tw/",
    google_maps_query: "國立中正大學圖書館",
    latitude: 23.5633,
    longitude: 120.4695,
    source_url: "https://lib.ccu.edu.tw/",
    needs_manual_review: false
  },
  // [新增] 資訊處
  {
    id: "it_office",
    name_zh: "資訊處",
    name_en: "Information Technology Office",
    category: "office",
    service_categories: ["it_support", "academic_affairs"],
    building_name_zh: "圖書資訊大樓",
    building_name_en: "Information and Library Building",
    floor: "",
    indoor_location_note_zh: "圖書資訊大樓",
    indoor_location_note_en: "Information and Library Building",
    function_desc_zh: "負責校園 SSO、網路、無線網路、數位學習系統及軟體授權等資訊服務。",
    function_desc_en: "Responsible for campus SSO, network, Wi-Fi, digital learning systems, and software licensing.",
    service_scope_zh: "SSO 單一入口、Web Mail、Microsoft 365、Google Workspace 帳號問題；校園網路與無線網路；eCourse2 與雲端教室技術支援；軟體下載。",
    service_scope_en: "SSO, Web Mail, Microsoft 365, Google Workspace account issues; Campus network and Wi-Fi; eCourse2 and cloud classroom support; Software downloads.",
    common_scenarios_zh: "帳號無法登入、網路異常、eCourse2 問題、軟體申請。",
    common_scenarios_en: "Account login issues, Network problems, eCourse2 issues, Software applications.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://it.ccu.edu.tw/",
    google_maps_query: "國立中正大學圖書資訊大樓",
    latitude: 23.5633,
    longitude: 120.4695,
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },
  // [新增] 語言中心
  {
    id: "language_center",
    name_zh: "語言中心",
    name_en: "Language Center",
    category: "office",
    service_categories: ["international_support", "academic_affairs"],
    building_name_zh: "圖書資訊大樓",
    building_name_en: "Information and Library Building",
    floor: "",
    indoor_location_note_zh: "圖書資訊大樓",
    indoor_location_note_en: "Information and Library Building",
    function_desc_zh: "提供英語、外語課程、國際學生華語課程，以及語言測驗資訊與語言學習輔導。",
    function_desc_en: "Offers English and foreign language courses, Mandarin courses for international students, and language proficiency test information.",
    service_scope_zh: "通識英文與應用外語學程；國際學生華語課程；語言學習輔導與同儕輔導；英檢、TOEIC、TOEFL 等考試資訊。",
    service_scope_en: "General English and applied foreign language courses; Mandarin courses for international students; Language tutoring and peer support; TOEIC, TOEFL, GEPT information.",
    common_scenarios_zh: "華語課程諮詢、英語檢定資訊、語言學習輔導。",
    common_scenarios_en: "Mandarin course inquiry, English proficiency test info, Language tutoring.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://cls.ccu.edu.tw/",
    google_maps_query: "國立中正大學圖書資訊大樓",
    latitude: 23.5633,
    longitude: 120.4695,
    source_url: "https://cls.ccu.edu.tw/",
    needs_manual_review: true
  },
  // ---- 總務處相關 ----
  {
    id: "general_affairs",
    name_zh: "總務處",
    name_en: "Office of General Affairs",
    category: "office",
    service_categories: ["campus_life"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓西棟一樓",
    indoor_location_note_en: "1st Floor, West Wing, Administration Building",
    function_desc_zh: "負責校園設施維護、財產管理、採購與校園環境管理。",
    function_desc_en: "Responsible for campus facility maintenance, property management, procurement, and campus environment management.",
    service_scope_zh: "校園設施報修、停車管理、郵件收發、宿舍水電費。",
    service_scope_en: "Campus facility repair, Parking management, Mail services, Dormitory utilities.",
    common_scenarios_zh: "校園設施故障、停車問題、郵件領取。",
    common_scenarios_en: "Campus facility malfunction, Parking issues, Mail collection.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oga.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oga.ccu.edu.tw/",
    needs_manual_review: false
  },
  // [新增] 總務處事務組
  {
    id: "oga_general_services",
    name_zh: "總務處－事務組",
    name_en: "General Services Division, Office of General Affairs",
    category: "office",
    service_categories: ["campus_life"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓西棟一樓",
    indoor_location_note_en: "1st Floor, West Wing, Administration Building",
    function_desc_zh: "負責校園環境維護、宿舍水電費業務、招待所與住宿管理及行政大樓門禁管理。",
    function_desc_en: "Responsible for campus environment maintenance, dormitory utilities billing, guesthouse management, and administration building access control.",
    service_scope_zh: "公共意外責任險申請；宿舍水電費；校園環境維護；行政大樓門禁管理；簡易維修。",
    service_scope_en: "Public accident liability insurance; Dormitory water and electricity billing; Campus maintenance; Administration building access control; Simple repairs.",
    common_scenarios_zh: "宿舍水電費問題、校園環境維修。",
    common_scenarios_en: "Dormitory utility billing issues, Campus maintenance requests.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oga.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oga.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "cashier",
    name_zh: "總務處－出納組",
    name_en: "Cashier Division, Office of General Affairs",
    category: "office",
    service_categories: ["tuition", "academic_affairs"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓西棟一樓",
    indoor_location_note_en: "1st Floor, West Wing, Administration Building",
    function_desc_zh: "處理學雜費繳納、退費、各項費用收取與財務出納事務。",
    function_desc_en: "Handles tuition payment, refunds, fee collection, and financial cashier affairs.",
    service_scope_zh: "學費繳納、退費申請、各項費用收取；學生註冊與就學相關業務。",
    service_scope_en: "Tuition payment, Refund application, Fee collection; Student registration-related financial services.",
    common_scenarios_zh: "繳學費、申請退費、費用問題。",
    common_scenarios_en: "Pay tuition, Apply for refund, Fee inquiries.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oga.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oga.ccu.edu.tw/",
    needs_manual_review: false
  },
  // [新增] 總務處保管組
  {
    id: "oga_property",
    name_zh: "總務處－保管組",
    name_en: "Property Management Division, Office of General Affairs",
    category: "office",
    service_categories: ["campus_life", "student_affairs"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "B1",
    indoor_location_note_zh: "行政大樓西棟地下一樓",
    indoor_location_note_en: "Basement 1, West Wing, Administration Building",
    function_desc_zh: "辦理畢業學位服借用、畢業生離校手續、校內鑰匙及活動器材借用管理。",
    function_desc_en: "Handles graduation gown rental, school-leaving procedures for graduates, campus key management, and equipment borrowing.",
    service_scope_zh: "畢業學位服借用與歸還；畢業生離校手續；校內鑰匙管理與借用；活動器材與公物借用；校內紀念品管理。",
    service_scope_en: "Graduation gown rental and return; School-leaving procedures; Campus key management; Equipment borrowing; University souvenir management.",
    common_scenarios_zh: "畢業袍借用、畢業離校、器材借用。",
    common_scenarios_en: "Graduation gown rental, School-leaving procedures, Equipment borrowing.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oga.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oga.ccu.edu.tw/",
    needs_manual_review: true
  },
  // ---- 職涯與發展 ----
  // [新增] 職涯發展中心
  {
    id: "career_center",
    name_zh: "職涯發展中心",
    name_en: "Career Development Center",
    category: "office",
    service_categories: ["career", "student_affairs"],
    building_name_zh: "共同教室大樓",
    building_name_en: "Center for General Education",
    floor: "5F",
    indoor_location_note_zh: "共同教室大樓五樓 502 室",
    indoor_location_note_en: "Room 502, 5th Floor, Center for General Education",
    function_desc_zh: "提供職涯探索、就業資訊、履歷指導、校園徵才活動及實習輔導服務。",
    function_desc_en: "Provides career exploration, employment information, resume guidance, campus recruitment events, and internship support.",
    service_scope_zh: "企業招募資訊與履歷投遞；校園徵才活動；職涯探索與測評；職涯講座與工作坊；個別職涯諮詢；校外實習申請。",
    service_scope_en: "Employer listings and job applications; Campus recruitment events; Career exploration and assessments; Career workshops and seminars; One-on-one career counseling; Off-campus internship applications.",
    common_scenarios_zh: "求職諮詢、履歷指導、實習申請、參加校園徵才。",
    common_scenarios_en: "Job search consultation, Resume guidance, Internship applications, Campus recruitment.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學共同教室大樓",
    latitude: 23.5645,
    longitude: 120.4700,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  // ---- 駐警處 ----
  // [新增] 駐警處車輛管控中心
  {
    id: "security_vehicle",
    name_zh: "駐警處－車輛管控中心",
    name_en: "Vehicle Control Center, Campus Security",
    category: "office",
    service_categories: ["campus_life", "student_affairs"],
    building_name_zh: "活動中心",
    building_name_en: "Activity Center",
    floor: "2F",
    indoor_location_note_zh: "活動中心二樓",
    indoor_location_note_en: "2nd Floor, Activity Center",
    function_desc_zh: "負責校園車輛通行證辦理、違規收費、教職員生離校審核及障礙者臨時通行證申請。",
    function_desc_en: "Handles campus vehicle permits, parking violation fees, faculty/staff/student departure reviews, and temporary disability vehicle passes.",
    service_scope_zh: "車輛通行證辦理；違規收費與申訴；教職員生離校審核；行動不便者臨時通行證申請；疑似廢棄車輛處理。",
    service_scope_en: "Vehicle permit issuance; Parking violation fees and appeals; Departure reviews; Temporary disability passes; Abandoned vehicle disposal.",
    common_scenarios_zh: "申請車證、停車違規申訴、離校審核。",
    common_scenarios_en: "Apply for vehicle permit, Parking violation appeal, Departure review.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://www.ccu.edu.tw/",
    google_maps_query: "國立中正大學活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://www.ccu.edu.tw/",
    needs_manual_review: true
  }
];


// ============================================================
// Departments (Academic Units)
// [修正] category 統一使用 "department"
// [新增] is_college_office?: boolean 標記院辦
// [新增] 圖片欄位
// ============================================================
export interface Department {
  id: string;
  name_zh: string;
  name_en: string;
  college_zh: string;
  college_en: string;
  building_name_zh: string;
  building_name_en: string;
  floor: string;
  indoor_location_note_zh: string;
  indoor_location_note_en: string;
  function_desc_zh: string;
  function_desc_en: string;
  service_scope_zh: string;
  service_scope_en: string;
  service_categories: string[];
  official_url: string;
  google_maps_query: string;
  latitude: number;
  longitude: number;
  source_url: string;
  needs_manual_review: boolean;
  // [新增] 標記院辦
  is_college_office?: boolean;
  // [新增] 圖片欄位
  floor_plan_image?: string;
  entrance_image?: string;
}

export const departments: Department[] = [
  // ============================================================
  // 院辦 College Administrative Offices
  // [新增] 7 個學院院辦，is_college_office: true
  // ============================================================
  {
    id: "college_humanities_office",
    name_zh: "文學院院辦",
    name_en: "College of Humanities Office",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "5F",
    indoor_location_note_zh: "文學院大樓五樓 501 室",
    indoor_location_note_en: "Room 501, 5th Floor, College of Humanities Building",
    function_desc_zh: "文學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Humanities.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://colliber.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://colliber.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },
  {
    id: "college_law_office",
    name_zh: "法學院院辦",
    name_en: "College of Law Office",
    college_zh: "法學院",
    college_en: "College of Law",
    building_name_zh: "法學院大樓",
    building_name_en: "College of Law Building",
    floor: "5F",
    indoor_location_note_zh: "法學院大樓五樓 511 室",
    indoor_location_note_en: "Room 511, 5th Floor, College of Law Building",
    function_desc_zh: "法學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Law.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptclaw.ccu.edu.tw/",
    google_maps_query: "國立中正大學法學院大樓",
    latitude: 23.5635,
    longitude: 120.4705,
    source_url: "https://deptclaw.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },
  {
    id: "college_social_sciences_office",
    name_zh: "社會科學院院辦",
    name_en: "College of Social Sciences Office",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓西棟",
    building_name_en: "West Wing, College of Social Sciences Building",
    floor: "5F",
    indoor_location_note_zh: "社會科學院大樓西棟五樓 513 室",
    indoor_location_note_en: "Room 513, 5th Floor, West Wing, College of Social Sciences Building",
    function_desc_zh: "社會科學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Social Sciences.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://colsoc.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院大樓",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://colsoc.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },
  {
    id: "college_engineering_office",
    name_zh: "工學院院辦",
    name_en: "College of Engineering Administrative Offices",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "創新大樓",
    building_name_en: "Innovation Building",
    floor: "1F",
    indoor_location_note_zh: "創新大樓一樓 111 室",
    indoor_location_note_en: "Room 111, 1st Floor, Innovation Building",
    function_desc_zh: "工學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Engineering.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://coe.ccu.edu.tw/",
    google_maps_query: "國立中正大學創新大樓",
    latitude: 23.5655,
    longitude: 120.4720,
    source_url: "https://coe.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },
  {
    id: "college_management_office",
    name_zh: "管理學院院辦",
    name_en: "College of Management Office",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "管理學院大樓二樓 211 室",
    indoor_location_note_en: "Room 211, 2nd Floor, College of Management Building",
    function_desc_zh: "管理學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Management.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://colmgt.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院大樓",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://colmgt.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },
  {
    id: "college_science_office",
    name_zh: "理學院院辦",
    name_en: "College of Science Office",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院大樓數學館",
    building_name_en: "Mathematics Building, College of Science",
    floor: "3F",
    indoor_location_note_zh: "理學院大樓數學館三樓 302 室",
    indoor_location_note_en: "Room 302, 3rd Floor, Mathematics Building, College of Science",
    function_desc_zh: "理學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Science.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://science.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://science.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },
  {
    id: "college_education_office",
    name_zh: "教育學院院辦",
    name_en: "College of Education Office",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院大樓",
    building_name_en: "College of Education Building",
    floor: "3F",
    indoor_location_note_zh: "教育學院大樓三樓 303 室",
    indoor_location_note_en: "Room 303, 3rd Floor, College of Education Building",
    function_desc_zh: "教育學院行政中心，處理學院層級行政事務。",
    function_desc_en: "Administrative center for the College of Education.",
    service_scope_zh: "學院行政、各系所協調事務。",
    service_scope_en: "College administration and inter-department coordination.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://coledu.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院大樓",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://coledu.ccu.edu.tw/",
    needs_manual_review: false,
    is_college_office: true
  },

  // ============================================================
  // 文學院 College of Humanities
  // ============================================================
  // [新增] 台灣文學與創意應用研究所
  {
    id: "taiwan_lit",
    name_zh: "台灣文學與創意應用研究所",
    name_en: "Graduate Institute of Taiwan Literature and Innovation",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "1F",
    indoor_location_note_zh: "文學院大樓一樓 107-1 室",
    indoor_location_note_en: "Room 107-1, 1st Floor, College of Humanities Building",
    function_desc_zh: "提供台灣文學、創意應用等教學與研究。",
    function_desc_en: "Offers teaching and research in Taiwan literature and creative applications.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://gitlci.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://gitlci.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "chinese_lit",
    name_zh: "中國文學系暨研究所",
    name_en: "Department of Chinese Literature",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "2F",
    indoor_location_note_zh: "文學院大樓二樓 205 室",
    indoor_location_note_en: "Room 205, 2nd Floor, College of Humanities Building",
    function_desc_zh: "提供中國文學、古典文獻、現代文學等教學與研究。",
    function_desc_en: "Offers teaching and research in Chinese literature, classical texts, and modern literature.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://litera.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://litera.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "foreign_lang",
    name_zh: "外國語文學系暨研究所",
    name_en: "Department of Foreign Languages and Literature",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "2F",
    indoor_location_note_zh: "文學院大樓二樓 286 室",
    indoor_location_note_en: "Room 286, 2nd Floor, College of Humanities Building",
    function_desc_zh: "提供英語文學、語言學、翻譯等教學與研究。",
    function_desc_en: "Offers teaching and research in English literature, linguistics, and translation.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://fllcccu.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://fllcccu.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "history",
    name_zh: "歷史學系暨研究所",
    name_en: "Department of History",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "2F",
    indoor_location_note_zh: "文學院大樓二樓 208 室",
    indoor_location_note_en: "Room 208, 2nd Floor, College of Humanities Building",
    function_desc_zh: "提供歷史學教學與研究。",
    function_desc_en: "Offers teaching and research in history.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://depthis.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://depthis.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "philosophy",
    name_zh: "哲學系暨研究所",
    name_en: "Department of Philosophy",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "4F",
    indoor_location_note_zh: "文學院大樓四樓 405 室",
    indoor_location_note_en: "Room 405, 4th Floor, College of Humanities Building",
    function_desc_zh: "提供哲學教學與研究。",
    function_desc_en: "Offers teaching and research in philosophy.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptphi.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://deptphi.ccu.edu.tw/",
    needs_manual_review: false
  },
  // [新增] 語言學研究所
  {
    id: "linguistics",
    name_zh: "語言學研究所",
    name_en: "Graduate Institute of Linguistics",
    college_zh: "文學院",
    college_en: "College of Humanities",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Humanities Building",
    floor: "4F",
    indoor_location_note_zh: "文學院大樓四樓 410 室",
    indoor_location_note_en: "Room 410, 4th Floor, College of Humanities Building",
    function_desc_zh: "提供語言學教學與研究。",
    function_desc_en: "Offers teaching and research in linguistics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "http://linguist.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院大樓",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "http://linguist.ccu.edu.tw/",
    needs_manual_review: false
  },

  // ============================================================
  // 理學院 College of Science
  // ============================================================
  {
    id: "math",
    name_zh: "數學系",
    name_en: "Department of Mathematics",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院大樓數學館",
    building_name_en: "Mathematics Building, College of Science",
    floor: "",
    indoor_location_note_zh: "理學院數學館",
    indoor_location_note_en: "Mathematics Building, College of Science",
    function_desc_zh: "提供數學、應用數學、統計科學等教學與研究。",
    function_desc_en: "Offers teaching and research in mathematics, applied mathematics, and statistics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://math.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://math.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "earth_env",
    name_zh: "地球與環境科學系",
    name_en: "Department of Earth and Environmental Sciences",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "地震館",
    building_name_en: "Earthquake Building",
    floor: "",
    indoor_location_note_zh: "地震館",
    indoor_location_note_en: "Earthquake Building",
    function_desc_zh: "提供地球科學、環境科學、地震學等教學與研究。",
    function_desc_en: "Offers teaching and research in earth science, environmental science, and seismology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://eq.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://eq.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "physics",
    name_zh: "物理學系暨研究所",
    name_en: "Department of Physics",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "物理館",
    building_name_en: "Physics Building",
    floor: "",
    indoor_location_note_zh: "物理館",
    indoor_location_note_en: "Physics Building",
    function_desc_zh: "提供物理學教學與研究。",
    function_desc_en: "Offers teaching and research in physics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://physics.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://physics.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "chem_biochem",
    name_zh: "化學暨生物化學系",
    name_en: "Department of Chemistry and Biochemistry",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院大樓",
    building_name_en: "College of Science Building",
    floor: "",
    indoor_location_note_zh: "理學院大樓",
    indoor_location_note_en: "College of Science Building",
    function_desc_zh: "提供化學與生物化學教學與研究。",
    function_desc_en: "Offers teaching and research in chemistry and biochemistry.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptche.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://deptche.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "biomed",
    name_zh: "生物醫學科學系",
    name_en: "Department of Biomedical Sciences",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院大樓",
    building_name_en: "College of Science Building",
    floor: "",
    indoor_location_note_zh: "理學院大樓",
    indoor_location_note_en: "College of Science Building",
    function_desc_zh: "提供生物醫學科學教學與研究，含分子生物與生物醫學碩博士班。",
    function_desc_en: "Offers teaching and research in biomedical sciences, including molecular biology and biomedical graduate programs.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://admbio.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://admbio.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 社會科學院 College of Social Sciences
  // ============================================================
  {
    id: "social_welfare",
    name_zh: "社會福利學系暨研究所",
    name_en: "Department of Social Welfare",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "",
    indoor_location_note_zh: "社會科學院大樓",
    indoor_location_note_en: "College of Social Sciences Building",
    function_desc_zh: "提供社會福利政策、社會工作等教學與研究。",
    function_desc_en: "Offers teaching and research in social welfare policy and social work.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://dsw.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://dsw.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "psychology",
    name_zh: "心理學系暨研究所",
    name_en: "Department of Psychology",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "4F",
    indoor_location_note_zh: "社會科學院大樓四樓",
    indoor_location_note_en: "4th Floor, College of Social Sciences Building",
    function_desc_zh: "提供心理學教學與研究。",
    function_desc_en: "Offers teaching and research in psychology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://psy.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://psy.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "political_science",
    name_zh: "政治學系暨研究所",
    name_en: "Department of Political Science",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓（法學院館）",
    building_name_en: "College of Social Sciences Building (College of Law Wing)",
    floor: "7F",
    indoor_location_note_zh: "社科院二館（法學院館）七樓",
    indoor_location_note_en: "7th Floor, College of Social Sciences Building II",
    function_desc_zh: "提供政治學教學與研究。",
    function_desc_en: "Offers teaching and research in political science.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://polsci.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://polsci.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "communication",
    name_zh: "傳播學系",
    name_en: "Department of Communication",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "2F",
    indoor_location_note_zh: "社會科學院大樓二樓 R212 室",
    indoor_location_note_en: "Room R212, 2nd Floor, College of Social Sciences Building",
    function_desc_zh: "提供傳播學、電訊傳播等教學與研究。",
    function_desc_en: "Offers teaching and research in communication and telecommunications.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://telecom.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://telecom.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "labor_relations",
    name_zh: "勞工關係學系暨研究所",
    name_en: "Department of Labor Relations",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "5F",
    indoor_location_note_zh: "社會科學院大樓五樓 528 室",
    indoor_location_note_en: "Room 528, 5th Floor, College of Social Sciences Building",
    function_desc_zh: "提供勞工關係教學與研究。",
    function_desc_en: "Offers teaching and research in labor relations.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://labor.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://labor.ccu.edu.tw/",
    needs_manual_review: false
  },

  // ============================================================
  // 工學院 College of Engineering
  // ============================================================
  {
    id: "cs",
    name_zh: "資訊工程學系暨研究所",
    name_en: "Department of Computer Science and Information Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工學院大樓（資工館）",
    building_name_en: "College of Engineering Building (CS Building)",
    floor: "1F",
    indoor_location_note_zh: "資工館一樓 107 室",
    indoor_location_note_en: "Room 107, 1st Floor, CS Building",
    function_desc_zh: "提供資訊工程教學與研究。",
    function_desc_en: "Offers teaching and research in computer science and information engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://cs.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://cs.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "ee",
    name_zh: "電機工程學系暨研究所",
    name_en: "Department of Electrical Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工學院大樓",
    building_name_en: "College of Engineering Building",
    floor: "",
    indoor_location_note_zh: "工學院大樓",
    indoor_location_note_en: "College of Engineering Building",
    function_desc_zh: "提供電機工程教學與研究。",
    function_desc_en: "Offers teaching and research in electrical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://ee.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://ee.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "me",
    name_zh: "機械工程學系暨研究所",
    name_en: "Department of Mechanical Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工二館機械館",
    building_name_en: "Mechanical Engineering Building",
    floor: "3F",
    indoor_location_note_zh: "機械館三樓 R314 室",
    indoor_location_note_en: "Room R314, 3rd Floor, Mechanical Engineering Building",
    function_desc_zh: "提供機械工程教學與研究。",
    function_desc_en: "Offers teaching and research in mechanical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptime.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://deptime.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "che",
    name_zh: "化學工程學系暨研究所",
    name_en: "Department of Chemical Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工二館",
    building_name_en: "Engineering Building II",
    floor: "3F",
    indoor_location_note_zh: "工二館三樓 322 室",
    indoor_location_note_en: "Room 322, 3rd Floor, Engineering Building II",
    function_desc_zh: "提供化學工程教學與研究。",
    function_desc_en: "Offers teaching and research in chemical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://che.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://che.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "comm_eng",
    name_zh: "通訊工程學系暨研究所",
    name_en: "Department of Communications Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "創新大樓",
    building_name_en: "Innovation Building",
    floor: "4F",
    indoor_location_note_zh: "創新大樓四樓 429 室",
    indoor_location_note_en: "Room 429, 4th Floor, Innovation Building",
    function_desc_zh: "提供通訊工程教學與研究。",
    function_desc_en: "Offers teaching and research in communications engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://comm.ccu.edu.tw/",
    google_maps_query: "國立中正大學創新大樓",
    latitude: 23.5655,
    longitude: 120.4720,
    source_url: "https://comm.ccu.edu.tw/",
    needs_manual_review: false
  },

  // ============================================================
  // 管理學院 College of Management
  // ============================================================
  {
    id: "economics",
    name_zh: "經濟學系",
    name_en: "Department of Economics",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "管理學院大樓二樓 206 室",
    indoor_location_note_en: "Room 206, 2nd Floor, College of Management Building",
    function_desc_zh: "提供經濟學教學與研究。",
    function_desc_en: "Offers teaching and research in economics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://econ.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://econ.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "finance",
    name_zh: "財務金融學系暨研究所",
    name_en: "Department of Finance",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "管理學院大樓二樓 203 室",
    indoor_location_note_en: "Room 203, 2nd Floor, College of Management Building",
    function_desc_zh: "提供財務金融教學與研究。",
    function_desc_en: "Offers teaching and research in finance.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "http://deptfin.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "http://deptfin.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "ba",
    name_zh: "企業管理學系暨研究所",
    name_en: "Department of Business Administration",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "管理學院大樓二樓 216 室",
    indoor_location_note_en: "Room 216, 2nd Floor, College of Management Building",
    function_desc_zh: "提供企業管理教學與研究。",
    function_desc_en: "Offers teaching and research in business administration.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "http://busadm.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "http://busadm.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "acct",
    name_zh: "會計與資訊科技學系暨研究所",
    name_en: "Department of Accounting and Information Technology",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "管理學院大樓二樓 267 室",
    indoor_location_note_en: "Room 267, 2nd Floor, College of Management Building",
    function_desc_zh: "提供會計學與資訊科技教學與研究。",
    function_desc_en: "Offers teaching and research in accounting and information technology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://ait.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://ait.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "mis",
    name_zh: "資訊管理學系暨研究所",
    name_en: "Department of Information Management",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "管理學院大樓二樓",
    indoor_location_note_en: "2nd Floor, College of Management Building",
    function_desc_zh: "提供資訊管理教學與研究。",
    function_desc_en: "Offers teaching and research in information management.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://mis.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://mis.ccu.edu.tw/",
    needs_manual_review: false
  },

  // ============================================================
  // 法學院 College of Law
  // ============================================================
  {
    id: "law",
    name_zh: "法律學系暨研究所",
    name_en: "Department of Law",
    college_zh: "法學院",
    college_en: "College of Law",
    building_name_zh: "法學院大樓",
    building_name_en: "College of Law Building",
    floor: "3F",
    indoor_location_note_zh: "法學院大樓三樓 309 室",
    indoor_location_note_en: "Room 309, 3rd Floor, College of Law Building",
    function_desc_zh: "提供法律學教學與研究。",
    function_desc_en: "Offers teaching and research in law.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptlaw.ccu.edu.tw/",
    google_maps_query: "國立中正大學法學院大樓",
    latitude: 23.5635,
    longitude: 120.4705,
    source_url: "https://deptlaw.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "finlaw",
    name_zh: "財經法律學系暨研究所",
    name_en: "Department of Financial and Economic Law",
    college_zh: "法學院",
    college_en: "College of Law",
    building_name_zh: "法學院大樓",
    building_name_en: "College of Law Building",
    floor: "4F",
    indoor_location_note_zh: "法學院大樓四樓 411 室",
    indoor_location_note_en: "Room 411, 4th Floor, College of Law Building",
    function_desc_zh: "提供財經法律教學與研究。",
    function_desc_en: "Offers teaching and research in financial and economic law.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptflaw.ccu.edu.tw/",
    google_maps_query: "國立中正大學法學院大樓",
    latitude: 23.5635,
    longitude: 120.4705,
    source_url: "https://deptflaw.ccu.edu.tw/",
    needs_manual_review: false
  },

  // ============================================================
  // 教育學院 College of Education
  // ============================================================
  {
    id: "adult_edu",
    name_zh: "成人及繼續教育學系暨研究所",
    name_en: "Department of Adult and Continuing Education",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院大樓",
    building_name_en: "College of Education Building",
    floor: "",
    indoor_location_note_zh: "教育學院大樓",
    indoor_location_note_en: "College of Education Building",
    function_desc_zh: "提供成人教育與繼續教育教學與研究。",
    function_desc_en: "Offers teaching and research in adult and continuing education.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://cyiaace.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://cyiaace.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "criminology",
    name_zh: "犯罪防治學系暨研究所",
    name_en: "Department of Criminology",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院大樓",
    building_name_en: "College of Education Building",
    floor: "6F",
    indoor_location_note_zh: "教育學院大樓六樓 609 室",
    indoor_location_note_en: "Room 609, 6th Floor, College of Education Building",
    function_desc_zh: "提供犯罪防治教學與研究。",
    function_desc_en: "Offers teaching and research in criminology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptcrm.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://deptcrm.ccu.edu.tw/",
    needs_manual_review: false
  }
];


// ============================================================
// Common Tasks
// ============================================================
export interface Task {
  id: string;
  task_name_zh: string;
  task_name_en: string;
  scenario_zh: string;
  scenario_en: string;
  target_unit_type: "office" | "department";
  target_unit_id: string;
  recommended_service_categories: string[];
  steps: { zh: string; en: string }[];
  source_url: string;
  needs_manual_review: boolean;
}

export const tasks: Task[] = [
  {
    id: "task_find_dept",
    task_name_zh: "找我的系辦公室",
    task_name_en: "Find my department office",
    scenario_zh: "你需要找到自己系所的辦公室，例如詢問選課、找導師、領取文件等。",
    scenario_en: "You need to find your department office for course advising, meeting your advisor, or picking up documents.",
    target_unit_type: "department",
    target_unit_id: "",
    recommended_service_categories: ["department_offices"],
    steps: [
      { zh: "確認你的系所名稱與所屬學院", en: "Confirm your department name and college" },
      { zh: "前往該學院大樓", en: "Go to the college building" },
      { zh: "進入大樓後搭電梯或走樓梯到指定樓層", en: "Take the elevator or stairs to the designated floor" },
      { zh: "找到系辦公室門牌", en: "Find the department office sign" },
      { zh: "向系辦人員說明你的需求", en: "Tell the office staff what you need" }
    ],
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "task_oia",
    task_name_zh: "找國際處",
    task_name_en: "Go to the International Office",
    scenario_zh: "你有簽證、居留證、獎學金或國際學生相關問題需要協助。",
    scenario_en: "You need help with visa, ARC, scholarships, or any international student-related issues.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    steps: [
      { zh: "前往行政大樓", en: "Go to the Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "國際處位於一樓", en: "OIA is on the 1st floor" },
      { zh: "找到國際事務處的辦公室", en: "Find the Office of International Affairs" },
      { zh: "向櫃台人員說明你的需求", en: "Tell the staff at the counter what you need" }
    ],
    source_url: "https://oia.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_registration",
    task_name_zh: "處理註冊問題",
    task_name_en: "Handle registration issues",
    scenario_zh: "你有註冊、學籍、休學、退學等問題需要處理。",
    scenario_en: "You need to handle registration, enrollment status, leave of absence, or withdrawal.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "academic_affairs"],
    steps: [
      { zh: "前往行政大樓東棟", en: "Go to the East Wing of Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "教務處－註冊組位於一樓", en: "Registration Division is on the 1st floor" },
      { zh: "找到教務處註冊組窗口", en: "Find the Registration Division counter" },
      { zh: "攜帶學生證與相關文件", en: "Bring your student ID and relevant documents" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_student_id",
    task_name_zh: "補辦學生證",
    task_name_en: "Replace my student ID",
    scenario_zh: "你的學生證遺失或損壞，需要補辦。",
    scenario_en: "Your student ID is lost or damaged and needs to be replaced.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["student_id", "registration"],
    steps: [
      { zh: "前往行政大樓東棟", en: "Go to the East Wing of Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "教務處－註冊組位於一樓", en: "Registration Division is on the 1st floor" },
      { zh: "向註冊組申請學生證補發", en: "Apply for student ID replacement at the Registration Division" },
      { zh: "攜帶身分證件與補辦費用", en: "Bring your ID document and replacement fee" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_dormitory",
    task_name_zh: "找宿舍服務中心",
    task_name_en: "Find dormitory service center",
    scenario_zh: "你有宿舍申請、維修、門禁或住宿相關問題。",
    scenario_en: "You have issues with dormitory application, maintenance, access, or housing.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    steps: [
      { zh: "前往學生活動中心", en: "Go to the Student Activity Center" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "住宿服務組位於一樓", en: "Housing Service Division is on the 1st floor" },
      { zh: "找到住宿服務組辦公室", en: "Find the Housing Service Division office" },
      { zh: "向工作人員說明你的宿舍問題", en: "Tell the staff about your dormitory issue" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_library",
    task_name_zh: "去圖書館",
    task_name_en: "Go to the library",
    scenario_zh: "你想借書、找論文、預約討論室或使用自習空間。",
    scenario_en: "You want to borrow books, find thesis, reserve discussion rooms, or use study spaces.",
    target_unit_type: "office",
    target_unit_id: "library",
    recommended_service_categories: ["library"],
    steps: [
      { zh: "前往圖書資訊大樓", en: "Go to the Information and Library Building" },
      { zh: "從一樓正門進入", en: "Enter through the 1st floor main entrance" },
      { zh: "服務台在一樓入口處", en: "Service desk is at the 1st floor entrance" },
      { zh: "出示學生證感應入館", en: "Tap your student ID to enter" },
      { zh: "向服務台詢問你需要的服務", en: "Ask the service desk for what you need" }
    ],
    source_url: "https://lib.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_health",
    task_name_zh: "找健康中心",
    task_name_en: "Go to the Health Center",
    scenario_zh: "你身體不適、受傷或需要健康檢查。",
    scenario_en: "You feel unwell, are injured, or need a health checkup.",
    target_unit_type: "office",
    target_unit_id: "health_center",
    recommended_service_categories: ["health"],
    steps: [
      { zh: "前往活動中心", en: "Go to the Activity Center" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "衛生保健組位於二樓", en: "Health Services Division is on the 2nd floor" },
      { zh: "找到衛生保健組辦公室", en: "Find the Health Services Division office" },
      { zh: "向護理人員說明你的症狀", en: "Tell the nurse about your symptoms" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_course",
    task_name_zh: "處理選課問題",
    task_name_en: "Handle course selection issues",
    scenario_zh: "你有加退選、衝堂或選課系統相關問題。",
    scenario_en: "You have issues with course add/drop, schedule conflicts, or the course selection system.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues", "academic_affairs"],
    steps: [
      { zh: "前往行政大樓東棟", en: "Go to the East Wing of Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "課務組位於二樓", en: "Curriculum Division is on the 2nd floor" },
      { zh: "搭電梯或走樓梯到二樓", en: "Take the elevator or stairs to the 2nd floor" },
      { zh: "找到教務處課務組", en: "Find the Curriculum Division of Academic Affairs" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_transcript",
    task_name_zh: "申請成績單",
    task_name_en: "Apply for a transcript",
    scenario_zh: "你需要申請中文或英文成績單。",
    scenario_en: "You need to apply for a Chinese or English transcript.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "academic_affairs"],
    steps: [
      { zh: "前往行政大樓東棟", en: "Go to the East Wing of Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "教務處－註冊組位於一樓", en: "Registration Division is on the 1st floor" },
      { zh: "向註冊組申請成績單", en: "Apply for transcript at the Registration Division" },
      { zh: "攜帶學生證，可能需要繳交工本費", en: "Bring your student ID; a processing fee may be required" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_counseling",
    task_name_zh: "找諮商中心",
    task_name_en: "Go to the Counseling Center",
    scenario_zh: "你感到心理壓力、情緒困擾或需要生涯輔導。",
    scenario_en: "You are experiencing stress, emotional difficulties, or need career counseling.",
    target_unit_type: "office",
    target_unit_id: "counseling",
    recommended_service_categories: ["counseling", "health"],
    steps: [
      { zh: "前往活動中心", en: "Go to the Activity Center" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "諮商中心位於三樓", en: "Counseling Center is on the 3rd floor" },
      { zh: "找到諮商中心辦公室", en: "Find the Counseling Center office" },
      { zh: "向工作人員預約或說明你的需求", en: "Make an appointment or explain your needs to the staff" }
    ],
    source_url: "https://advising.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_career",
    task_name_zh: "找職涯發展中心",
    task_name_en: "Visit the Career Development Center",
    scenario_zh: "你需要求職資訊、履歷指導或想了解實習機會。",
    scenario_en: "You need job search information, resume guidance, or want to learn about internship opportunities.",
    target_unit_type: "office",
    target_unit_id: "career_center",
    recommended_service_categories: ["career"],
    steps: [
      { zh: "前往共同教室大樓", en: "Go to the Center for General Education building" },
      { zh: "搭電梯到五樓", en: "Take the elevator to the 5th floor" },
      { zh: "找到 502 室職涯發展中心", en: "Find Room 502, Career Development Center" },
      { zh: "向工作人員說明你的需求或預約諮詢", en: "Tell the staff your needs or make a consultation appointment" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_it",
    task_name_zh: "處理帳號或網路問題",
    task_name_en: "Handle account or network issues",
    scenario_zh: "你的學校帳號無法登入，或遇到校園網路、eCourse2 等系統問題。",
    scenario_en: "Your school account cannot log in, or you are having issues with campus network, eCourse2, or other systems.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support"],
    steps: [
      { zh: "前往圖書資訊大樓", en: "Go to the Information and Library Building" },
      { zh: "找到資訊處辦公室", en: "Find the IT Office" },
      { zh: "向工作人員說明你的問題", en: "Explain your issue to the staff" },
      { zh: "攜帶學生證以供身份驗證", en: "Bring your student ID for identity verification" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  }
];

// ============================================================
// Campus Life Resources
// [修正] category 統一使用 "campus_life"
// ============================================================
export interface CampusResource {
  id: string;
  name_zh: string;
  name_en: string;
  // [修正] category 值：統一使用 "campus_life"
  category: string;
  building_name_zh: string;
  building_name_en: string;
  floor: string;
  indoor_location_note_en: string;
  latitude: number;
  longitude: number;
  needs_manual_review: boolean;
}

export const campusResources: CampusResource[] = [
  {
    id: "7eleven",
    name_zh: "7-ELEVEN 中正大學門市",
    name_en: "7-ELEVEN (CCU Branch)",
    category: "campus_life",
    building_name_zh: "學生活動中心",
    building_name_en: "Student Activity Center",
    floor: "1F",
    indoor_location_note_en: "1st floor, Student Activity Center",
    latitude: 23.5618,
    longitude: 120.4728,
    needs_manual_review: true
  },
  {
    id: "cafeteria",
    name_zh: "學生餐廳",
    name_en: "Student Cafeteria",
    category: "campus_life",
    building_name_zh: "學生活動中心",
    building_name_en: "Student Activity Center",
    floor: "B1–1F",
    indoor_location_note_en: "Basement and 1st floor, Student Activity Center",
    latitude: 23.5618,
    longitude: 120.4728,
    needs_manual_review: true
  },
  {
    id: "atm",
    name_zh: "ATM 提款機",
    name_en: "ATM",
    category: "campus_life",
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_en: "1st floor lobby, Administration Building",
    latitude: 23.5640,
    longitude: 120.4714,
    needs_manual_review: true
  },
  {
    id: "sports_center",
    name_zh: "體育館",
    name_en: "Sports Center / Gymnasium",
    category: "campus_life",
    building_name_zh: "體育館",
    building_name_en: "Gymnasium",
    floor: "1F–2F",
    indoor_location_note_en: "Gymnasium Building",
    latitude: 23.5610,
    longitude: 120.4740,
    needs_manual_review: true
  }
];

// ============================================================
// Search Engine (unchanged)
// ============================================================
export function searchByNeed(query: string, lang: "en" | "zh" = "en") {
  const q = query.toLowerCase().trim();
  if (!q) return { offices: [], departments: [], tasks: [] };

  const matchedOffices = offices.filter(o => {
    const searchFields = [
      o.name_en.toLowerCase(),
      o.name_zh,
      o.function_desc_en.toLowerCase(),
      o.function_desc_zh,
      o.service_scope_en.toLowerCase(),
      o.service_scope_zh,
      o.common_scenarios_en.toLowerCase(),
      o.common_scenarios_zh,
      ...o.service_categories
    ];
    const catKeywords = o.service_categories.flatMap(catId => {
      const cat = serviceCategories.find(c => c.id === catId);
      return cat ? cat.keywords : [];
    });
    return [...searchFields, ...catKeywords].some(f => f.includes(q));
  });

  const matchedDepts = departments.filter(d => {
    const searchFields = [
      d.name_en.toLowerCase(),
      d.name_zh,
      d.college_en.toLowerCase(),
      d.college_zh,
      d.function_desc_en.toLowerCase(),
      d.function_desc_zh,
      d.building_name_en.toLowerCase(),
      d.building_name_zh
    ];
    return searchFields.some(f => f.includes(q));
  });

  const matchedTasks = tasks.filter(t => {
    const searchFields = [
      t.task_name_en.toLowerCase(),
      t.task_name_zh,
      t.scenario_en.toLowerCase(),
      t.scenario_zh,
      ...t.recommended_service_categories
    ];
    const catKeywords = t.recommended_service_categories.flatMap(catId => {
      const cat = serviceCategories.find(c => c.id === catId);
      return cat ? cat.keywords : [];
    });
    return [...searchFields, ...catKeywords].some(f => f.includes(q));
  });

  return { offices: matchedOffices, departments: matchedDepts, tasks: matchedTasks };
}

export function filterByCategory(categoryId: string) {
  const matchedOffices = offices.filter(o => o.service_categories.includes(categoryId));
  const matchedDepts = departments.filter(d => d.service_categories.includes(categoryId));
  const matchedTasks = tasks.filter(t => t.recommended_service_categories.includes(categoryId));
  return { offices: matchedOffices, departments: matchedDepts, tasks: matchedTasks };
}

export function getColleges() {
  const colleges = new Map<string, { zh: string; en: string }>();
  departments.forEach(d => {
    if (!colleges.has(d.college_en)) {
      colleges.set(d.college_en, { zh: d.college_zh, en: d.college_en });
    }
  });
  return Array.from(colleges.values());
}
