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
    service_categories: [],
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
    service_categories: [],
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
    service_categories: ["student_affairs"],
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
    service_categories: ["student_affairs"],
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
  required_documents: { zh: string; en: string }[];
  navigation_tip_zh?: string;
  navigation_tip_en?: string;
  steps: { zh: string; en: string }[];
  source_url: string;
  needs_manual_review: boolean;
}

export const tasks: Task[] = [
  // ============================================================
  // 1. 來台之前 / 剛到學校
  // ============================================================
  {
    id: "task_visa",
    task_name_zh: "申請學生簽證",
    task_name_en: "Apply for a Student Visa",
    scenario_zh: "你需要在入台前申請學生簽證（居留簽證）。",
    scenario_en: "You need to apply for a student visa (resident visa) before arriving in Taiwan.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [
      { zh: "入學許可函（學校寄發）", en: "Admission letter issued by CCU" },
      { zh: "有效護照", en: "Valid passport" },
      { zh: "健康檢查證明（特定國籍需要）", en: "Health certificate (required for certain nationalities)" },
      { zh: "財力證明", en: "Proof of financial support" },
      { zh: "2 吋照片 2 張", en: "2 passport-size photos" }
    ],
    navigation_tip_zh: "行政大樓 1F｜週一至週五 08:30–17:00",
    navigation_tip_en: "Administration Building, 1F｜Mon–Fri 08:30–17:00",
    steps: [
      { zh: "向台灣駐外館處或使館申請居留簽證", en: "Apply for a resident visa at the Taiwan embassy or representative office in your country" },
      { zh: "備妥入學許可函、護照、健康證明、財力證明、照片", en: "Prepare admission letter, passport, health certificate, financial proof, and photos" },
      { zh: "簽證核發後，憑簽證入台，入台後 15 天內辦理 ARC", en: "After visa approval, enter Taiwan and apply for ARC within 15 days of arrival" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3916.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_arc",
    task_name_zh: "辦理居留證（ARC）",
    task_name_en: "Apply for ARC (Alien Resident Certificate)",
    scenario_zh: "你剛到台灣，需要在 15 天內辦理居留證。",
    scenario_en: "You just arrived in Taiwan and need to apply for an ARC within 15 days.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [
      { zh: "有效護照與居留簽證", en: "Valid passport and resident visa" },
      { zh: "入學許可函", en: "Admission letter" },
      { zh: "在學證明（向國際處或教務處申請）", en: "Enrollment certificate (from OIA or Registration Division)" },
      { zh: "健康檢查報告（特定國籍需要）", en: "Health examination report (required for certain nationalities)" },
      { zh: "2 吋照片 2 張", en: "2 passport-size photos" },
      { zh: "規費（金額依規定）", en: "Application fee (amount as regulated)" }
    ],
    navigation_tip_zh: "行政大樓 1F｜先至國際處確認所需文件",
    navigation_tip_en: "Administration Building, 1F｜Visit OIA first to confirm required documents",
    steps: [
      { zh: "入台後先至國際處確認所需文件與辦理流程", en: "After arrival, visit OIA to confirm required documents and procedures" },
      { zh: "備妥所有文件", en: "Prepare all required documents" },
      { zh: "由國際處協助帶隊至嘉義縣移民署辦理", en: "OIA will arrange group visits to the Chiayi Immigration Office for ARC application" },
      { zh: "辦理完成後即獲得居留證（若需等待，會給收據）", en: "ARC will be issued upon completion (a receipt is given if processing time is needed)" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3916.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_airport_to_ccu",
    task_name_zh: "從機場到中正大學",
    task_name_en: "Get from the Airport to CCU",
    scenario_zh: "你剛抵達桃園或高雄機場，需要前往中正大學。",
    scenario_en: "You just arrived at Taoyuan or Kaohsiung Airport and need to get to CCU.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [],
    navigation_tip_zh: "國際處提供接機服務，請提前聯繫",
    navigation_tip_en: "OIA provides airport pickup service — contact them in advance",
    steps: [
      { zh: "提前聯繫國際處告知抵達時間（oia@ccu.edu.tw）", en: "Contact OIA in advance with your arrival time (oia@ccu.edu.tw)" },
      { zh: "桃園機場選項：高鐵到嘉義站（約 1.5hr）→ 計程車到中正大學（約 20 分鐘）", en: "From Taoyuan Airport: THSR to Chiayi Station (approx. 1.5 hrs) → Taxi to CCU (approx. 20 min)" },
      { zh: "或搭客運：國光客運至嘉義，再轉乘計程車", en: "Or take intercity bus to Chiayi, then taxi to CCU" },
      { zh: "抵達後前往宿舍辦理報到，再至國際處辦理入學手續", en: "Upon arrival, check in at the dormitory, then go to OIA for enrollment procedures" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/406-1008-67682,r1716.php?Lang=en",
    needs_manual_review: true
  },
  {
    id: "task_checkin",
    task_name_zh: "辦理入學報到手續",
    task_name_en: "Complete Enrollment / Check-in Procedures",
    scenario_zh: "你剛到學校，需要完成入學報到的全部流程。",
    scenario_en: "You just arrived at school and need to complete all enrollment check-in procedures.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support", "registration"],
    required_documents: [
      { zh: "護照", en: "Passport" },
      { zh: "入學許可函", en: "Admission letter" },
      { zh: "學費繳費證明（若已繳費）", en: "Tuition payment receipt (if already paid)" },
      { zh: "照片數張", en: "Passport-size photos" }
    ],
    navigation_tip_zh: "行政大樓 1F 國際處 → 東棟 1F 教務處，依序辦理",
    navigation_tip_en: "Administration Building 1F OIA → East Wing 1F Registration Division, in order",
    steps: [
      { zh: "至國際處領取入學相關資料與學生手冊", en: "Go to OIA to receive enrollment materials and student handbook" },
      { zh: "完成線上報到（CCU Portal）", en: "Complete online check-in on CCU Portal" },
      { zh: "至教務處註冊組完成學籍登記", en: "Go to the Registration Division to complete enrollment registration" },
      { zh: "至總務處出納組繳交學雜費", en: "Pay tuition at the Cashier Division" },
      { zh: "領取學生證", en: "Receive your student ID card" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-1424.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_nhi",
    task_name_zh: "申請健保卡",
    task_name_en: "Apply for National Health Insurance (NHI) Card",
    scenario_zh: "你需要辦理台灣全民健保，以便在台就醫。",
    scenario_en: "You need to enroll in Taiwan's National Health Insurance for medical care.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support", "health"],
    required_documents: [
      { zh: "居留證（ARC）", en: "ARC (Alien Resident Certificate)" },
      { zh: "護照", en: "Passport" },
      { zh: "在學證明", en: "Enrollment certificate" }
    ],
    navigation_tip_zh: "行政大樓 1F 國際處｜ARC 辦好後即可申請",
    navigation_tip_en: "Administration Building 1F OIA｜Apply after receiving your ARC",
    steps: [
      { zh: "先完成 ARC 辦理", en: "First complete your ARC application" },
      { zh: "至國際處詢問健保申請流程（學校會統一協助辦理）", en: "Visit OIA to inquire about NHI enrollment (the school will assist with group enrollment)" },
      { zh: "健保卡申辦完成後，即可持卡至健保特約診所就醫", en: "Once your NHI card is ready, you can use it at NHI-contracted clinics" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-1596.php?Lang=en",
    needs_manual_review: true
  },
  {
    id: "task_health_checkup",
    task_name_zh: "辦理新生健康檢查",
    task_name_en: "Complete New Student Health Examination",
    scenario_zh: "你是新生，需要完成學校規定的新生健康檢查。",
    scenario_en: "As a new student, you need to complete the required health examination.",
    target_unit_type: "office",
    target_unit_id: "health_center",
    recommended_service_categories: ["health"],
    required_documents: [
      { zh: "學生證或護照", en: "Student ID or passport" },
      { zh: "健康檢查通知單（學校發放）", en: "Health examination notice (issued by the school)" }
    ],
    navigation_tip_zh: "活動中心 2F｜衛生保健組",
    navigation_tip_en: "Activity Center, 2F｜Health Services Division",
    steps: [
      { zh: "收到學校通知後，依指定時間前往衛生保健組", en: "After receiving the school notice, visit the Health Services Division at the designated time" },
      { zh: "攜帶學生證或護照", en: "Bring your student ID or passport" },
      { zh: "完成基本身體測量與檢查項目", en: "Complete basic physical measurements and examination items" },
      { zh: "若有追蹤需求，衛生保健組會另行通知", en: "If follow-up is needed, the Health Services Division will notify you" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 2. 宿舍與生活
  // ============================================================
  {
    id: "task_dormitory",
    task_name_zh: "申請宿舍",
    task_name_en: "Apply for Dormitory",
    scenario_zh: "你需要申請學校宿舍。",
    scenario_en: "You need to apply for on-campus housing.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    required_documents: [
      { zh: "CCU Portal 帳號（線上申請）", en: "CCU Portal account (online application)" },
      { zh: "繳費證明（分配後繳費）", en: "Payment receipt (after room assignment)" }
    ],
    navigation_tip_zh: "學生活動中心 1F｜住宿服務組",
    navigation_tip_en: "Student Activity Center, 1F｜Housing Service Division",
    steps: [
      { zh: "登入 CCU Portal，點選「宿舍申請」", en: "Log in to CCU Portal and click 'Dormitory Application'" },
      { zh: "填寫志願序並送出申請", en: "Fill in preferences and submit the application" },
      { zh: "等待分配通知（約 2 週）", en: "Wait for room assignment notice (approx. 2 weeks)" },
      { zh: "依通知繳費，攜帶護照至住宿服務組辦理入住", en: "Pay the fee as instructed, then bring your passport to the Housing Service Division to check in" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_dorm_maintenance",
    task_name_zh: "宿舍設備報修",
    task_name_en: "Submit a Dormitory Maintenance Request",
    scenario_zh: "你的宿舍設備壞了，需要申請維修。",
    scenario_en: "Your dormitory equipment is broken and you need to request a repair.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    required_documents: [],
    navigation_tip_zh: "學生活動中心 1F 或線上申請",
    navigation_tip_en: "Student Activity Center, 1F or apply online",
    steps: [
      { zh: "透過 CCU Portal 或至住宿服務組填寫報修單", en: "Submit a maintenance request through CCU Portal or in person at the Housing Service Division" },
      { zh: "說明損壞設備與地點（棟別、房號）", en: "Describe the broken equipment and location (building name, room number)" },
      { zh: "等待工務人員來訪修繕", en: "Wait for maintenance staff to visit and repair" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_dormnet",
    task_name_zh: "申請宿舍網路（DormNet）",
    task_name_en: "Apply for Dormitory Internet (DormNet)",
    scenario_zh: "你住在宿舍，需要申請校園網路。",
    scenario_en: "You live in the dormitory and need to apply for campus internet access.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["dormitory", "it_support"],
    required_documents: [
      { zh: "學生證或宿舍入住證明", en: "Student ID or dormitory check-in confirmation" }
    ],
    navigation_tip_zh: "圖書資訊大樓｜資訊處，或線上申請",
    navigation_tip_en: "Information and Library Building｜IT Office, or apply online",
    steps: [
      { zh: "至資訊處網站或 CCU Portal 申請 DormNet 帳號", en: "Apply for a DormNet account through the IT Office website or CCU Portal" },
      { zh: "設定網路設備（依說明操作）", en: "Configure your network device (follow the instructions provided)" },
      { zh: "若遇問題，至資訊處或撥打技術支援電話", en: "If you encounter issues, visit the IT Office or call technical support" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_see_doctor",
    task_name_zh: "就醫看病",
    task_name_en: "See a Doctor / Get Medical Care",
    scenario_zh: "你身體不舒服，需要就醫。",
    scenario_en: "You feel unwell and need to see a doctor.",
    target_unit_type: "office",
    target_unit_id: "health_center",
    recommended_service_categories: ["health"],
    required_documents: [
      { zh: "健保卡", en: "NHI card" },
      { zh: "學生證（就醫時備用）", en: "Student ID (as backup)" }
    ],
    navigation_tip_zh: "活動中心 2F 衛生保健組（基本處理）/ 校外特約醫院（進一步診療）",
    navigation_tip_en: "Activity Center 2F Health Division (basic care) / Partner hospitals (further treatment)",
    steps: [
      { zh: "輕微症狀：至活動中心二樓衛生保健組就診", en: "For minor symptoms: visit the Health Services Division on the 2nd floor of the Activity Center" },
      { zh: "需進一步診療：衛生保健組提供特約醫院轉介", en: "For further treatment: the Health Services Division provides referrals to partner hospitals" },
      { zh: "就醫時攜帶健保卡（掛號費約 NT$150–300）", en: "Bring your NHI card to the clinic (registration fee approx. NT$150–300)" },
      { zh: "緊急情況：撥打 119 或請宿舍管理員協助", en: "For emergencies: call 119 or ask the dormitory manager for help" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_off_campus_housing",
    task_name_zh: "尋找校外租屋",
    task_name_en: "Find Off-Campus Housing",
    scenario_zh: "你沒有申請到宿舍或想住在校外，需要尋找租屋資訊。",
    scenario_en: "You didn't get a dorm room or prefer to live off-campus and need rental information.",
    target_unit_type: "office",
    target_unit_id: "osa_life",
    recommended_service_categories: ["dormitory", "student_affairs"],
    required_documents: [],
    navigation_tip_zh: "行政大樓西棟 2F｜生活事務組可提供校外租屋資訊",
    navigation_tip_en: "West Wing, Administration Building 2F｜Student Life Office provides off-campus rental info",
    steps: [
      { zh: "至學務處生活事務組詢問校外租屋資訊", en: "Visit the Student Life Office for off-campus rental information" },
      { zh: "也可參考 591 租屋網（https://www.591.com.tw）", en: "You can also check 591 Rental (https://www.591.com.tw)" },
      { zh: "簽約前確認合約內容，如需協助可向國際處詢問", en: "Review the rental contract carefully before signing; contact OIA for assistance if needed" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 3. 課程與學術
  // ============================================================
  {
    id: "task_sso",
    task_name_zh: "使用 SSO 單一入口登入",
    task_name_en: "Use the SSO Login System",
    scenario_zh: "你需要登入學校系統（選課、成績、email 等），但不知道如何使用 SSO。",
    scenario_en: "You need to log in to school systems (course selection, grades, email, etc.) but don't know how to use SSO.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support", "academic_affairs"],
    required_documents: [
      { zh: "學號（入學後由學校提供）", en: "Student ID number (provided by the school after enrollment)" },
      { zh: "初始密碼（入學通知信件內）", en: "Initial password (found in the enrollment notification email)" }
    ],
    navigation_tip_zh: "portal.ccu.edu.tw｜帳號問題請至資訊處",
    navigation_tip_en: "portal.ccu.edu.tw｜For account issues, visit the IT Office",
    steps: [
      { zh: "前往 https://portal.ccu.edu.tw", en: "Go to https://portal.ccu.edu.tw" },
      { zh: "使用學號與初始密碼登入，首次登入需修改密碼", en: "Log in with your student ID and initial password; change your password on first login" },
      { zh: "登入後可存取選課系統、成績查詢、eCourse2、Email 等", en: "After login, you can access course selection, grades, eCourse2, email, and more" },
      { zh: "帳號問題：至圖書資訊大樓資訊處或撥打技術支援", en: "For account issues: visit the IT Office in the Information and Library Building or call technical support" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_ecourse",
    task_name_zh: "使用 eCourse2 線上學習平台",
    task_name_en: "Use eCourse2 Learning Platform",
    scenario_zh: "你需要查看課程資料、繳交作業或觀看線上課程影片。",
    scenario_en: "You need to access course materials, submit assignments, or watch online course videos.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "ecourse2.ccu.edu.tw｜使用 SSO 帳號登入",
    navigation_tip_en: "ecourse2.ccu.edu.tw｜Log in with your SSO account",
    steps: [
      { zh: "前往 https://ecourse2.ccu.edu.tw", en: "Go to https://ecourse2.ccu.edu.tw" },
      { zh: "使用 SSO 帳號（學號 + 密碼）登入", en: "Log in with your SSO account (student ID + password)" },
      { zh: "課程加入：等老師開放，或輸入選課碼加入", en: "Join courses: wait for the instructor to open enrollment, or enter the course code" },
      { zh: "技術問題：至資訊處或發送 email 至 it@ccu.edu.tw", en: "Technical issues: visit the IT Office or email it@ccu.edu.tw" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_course_selection",
    task_name_zh: "使用選課系統選課",
    task_name_en: "Register for Courses via the Course Selection System",
    scenario_zh: "你需要完成每學期的課程選課，但不知道如何操作系統。",
    scenario_en: "You need to complete course registration each semester but don't know how to use the system.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "行政大樓東棟 2F｜課務組（系統問題請洽資訊處）",
    navigation_tip_en: "East Wing, Administration Building 2F｜Curriculum Division (system issues: contact IT Office)",
    steps: [
      { zh: "登入 SSO 後，進入選課系統（學期開始前 2 週開放）", en: "Log in to SSO, then access the course selection system (opens 2 weeks before the semester)" },
      { zh: "依課表瀏覽並加選課程（注意必修、選修分類）", en: "Browse the course schedule and add courses (note required vs. elective categories)" },
      { zh: "若課程額滿，可等加退選期間再嘗試", en: "If a course is full, try again during the add/drop period" },
      { zh: "系統操作問題：至教務處課務組詢問", en: "For system issues: visit the Curriculum Division of Academic Affairs" },
      { zh: "英文介面提示：系統主要為中文，如有困難請聯繫國際處", en: "Interface note: system is mainly in Chinese; contact OIA if you need assistance" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_add_drop",
    task_name_zh: "加退選課程",
    task_name_en: "Add or Drop a Course",
    scenario_zh: "你想加選某門課，或想退掉已選的課。",
    scenario_en: "You want to add a course or drop a course you've already selected.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues"],
    required_documents: [
      { zh: "加選需要老師同意者：老師簽名的加選單", en: "For courses requiring instructor approval: add-course form signed by the instructor" }
    ],
    navigation_tip_zh: "行政大樓東棟 2F｜課務組，或透過選課系統操作",
    navigation_tip_en: "East Wing, Administration Building 2F｜Curriculum Division, or via the course selection system",
    steps: [
      { zh: "加退選期間（約學期開始後第 1–2 週）登入選課系統操作", en: "During the add/drop period (approx. 1st–2nd week of semester), log in and make changes" },
      { zh: "加選額滿課程：需取得老師同意，填寫加選申請單至課務組辦理", en: "For full courses: get instructor approval, fill out the add-course form, and submit to the Curriculum Division" },
      { zh: "退選確認：退選後請確認系統已更新", en: "Confirm drop: after dropping, verify the change in the system" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_credit_waiver",
    task_name_zh: "申請學分抵免",
    task_name_en: "Apply for Credit Waiver / Transfer",
    scenario_zh: "你在其他學校修過的課程，想申請抵免中正大學的學分。",
    scenario_en: "You have taken courses at another school and want to transfer those credits to CCU.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "academic_affairs"],
    required_documents: [
      { zh: "原校成績單（英文版）", en: "Transcript from previous school (English version)" },
      { zh: "課程大綱（Syllabus）", en: "Course syllabus" },
      { zh: "抵免申請表（向系辦或教務處取得）", en: "Credit transfer application form (from department office or Academic Affairs)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜先至系辦，再送教務處審核",
    navigation_tip_en: "East Wing, Administration Building 1F｜Start at your department office, then submit to Academic Affairs",
    steps: [
      { zh: "向系辦取得抵免申請表", en: "Get the credit transfer form from your department office" },
      { zh: "備妥原校英文成績單與課程大綱", en: "Prepare your English transcript and course syllabi from your previous school" },
      { zh: "至系辦提交申請，由系上審查", en: "Submit the application to your department office for review" },
      { zh: "系所審查後送交教務處核定，約 2–4 週公告結果", en: "After departmental review, the application is sent to Academic Affairs for final approval (results announced in 2–4 weeks)" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_course_withdrawal",
    task_name_zh: "申請課程撤選",
    task_name_en: "Apply for Course Withdrawal",
    scenario_zh: "加退選期間已過，你想要撤選某門課程。",
    scenario_en: "The add/drop period has passed and you want to withdraw from a course.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues", "academic_affairs"],
    required_documents: [
      { zh: "撤選申請表（向課務組索取）", en: "Course withdrawal form (available at the Curriculum Division)" },
      { zh: "導師或系主任簽名（視規定）", en: "Advisor or department head signature (as required)" }
    ],
    navigation_tip_zh: "行政大樓東棟 2F｜課務組（學期中段前申請）",
    navigation_tip_en: "East Wing, Administration Building 2F｜Curriculum Division (apply before mid-semester)",
    steps: [
      { zh: "至教務處課務組取得撤選申請表", en: "Get the course withdrawal form from the Curriculum Division" },
      { zh: "填妥後請導師或系主任簽名（視規定）", en: "Complete the form and obtain required signatures (advisor or department head)" },
      { zh: "在規定期限內送回課務組", en: "Submit the form to the Curriculum Division before the deadline" },
      { zh: "撤選後成績單不會出現此課程", en: "After withdrawal, this course will not appear on your transcript" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 4. 行政手續
  // ============================================================
  {
    id: "task_student_id",
    task_name_zh: "補辦學生證",
    task_name_en: "Replace a Lost or Damaged Student ID Card",
    scenario_zh: "你的學生證遺失或損壞，需要補辦。",
    scenario_en: "Your student ID card is lost or damaged and needs to be replaced.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["student_id", "registration"],
    required_documents: [
      { zh: "護照或其他有效身分證件", en: "Passport or other valid ID" },
      { zh: "補辦費用（金額請至窗口確認）", en: "Replacement fee (confirm amount at the counter)" },
      { zh: "1 吋或 2 吋照片（部分情形需要）", en: "1 or 2 inch photo (required in some cases)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜教務處註冊組",
    navigation_tip_en: "East Wing, Administration Building 1F｜Registration Division",
    steps: [
      { zh: "前往行政大樓東棟一樓教務處註冊組", en: "Go to the Registration Division on the 1st floor of the East Wing, Administration Building" },
      { zh: "告知工作人員需補辦學生證並提供身分證件", en: "Inform the staff you need a replacement student ID and provide your ID document" },
      { zh: "繳交補辦費用", en: "Pay the replacement fee" },
      { zh: "等待製作（若需等候時間，工作人員會告知取件日）", en: "Wait for the card to be made (staff will inform you of the pickup date if processing time is needed)" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_transcript",
    task_name_zh: "申請成績單",
    task_name_en: "Apply for a Transcript",
    scenario_zh: "你需要申請中文或英文成績單。",
    scenario_en: "You need to apply for a Chinese or English transcript.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "academic_affairs"],
    required_documents: [
      { zh: "學生證或護照", en: "Student ID or passport" },
      { zh: "工本費（每份金額請確認）", en: "Processing fee (confirm amount per copy)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜教務處註冊組",
    navigation_tip_en: "East Wing, Administration Building 1F｜Registration Division",
    steps: [
      { zh: "前往行政大樓東棟一樓教務處註冊組", en: "Go to the Registration Division on the 1st floor of the East Wing, Administration Building" },
      { zh: "說明需要中文版或英文版成績單，以及份數", en: "Specify whether you need Chinese or English transcripts and how many copies" },
      { zh: "繳交工本費，當場或隔日取件（視是否即時列印）", en: "Pay the fee and pick up on the spot or the next day (depends on printing availability)" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_registration",
    task_name_zh: "辦理各學期註冊",
    task_name_en: "Complete Semester Registration",
    scenario_zh: "每學期開始時需要完成正式註冊手續（繳費＋線上報到）。",
    scenario_en: "At the start of each semester, you need to complete formal registration (payment + online check-in).",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "tuition"],
    required_documents: [
      { zh: "學費繳費通知單（Portal 或 Email 通知）", en: "Tuition payment notice (via Portal or email)" }
    ],
    navigation_tip_zh: "線上完成 Portal，繳費至西棟 1F 出納組或網路繳款",
    navigation_tip_en: "Complete online via Portal; pay at West Wing 1F Cashier or online",
    steps: [
      { zh: "依學校通知於期限內繳交學雜費", en: "Pay tuition and fees by the deadline as notified by the school" },
      { zh: "完成繳費後，於 CCU Portal 完成線上報到", en: "After payment, complete online check-in on CCU Portal" },
      { zh: "如有減免資格，需提前至生活事務組申請", en: "If eligible for fee reduction, apply at the Student Life Office in advance" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_leave_of_absence",
    task_name_zh: "申請休學",
    task_name_en: "Apply for Leave of Absence",
    scenario_zh: "你因個人、健康或其他原因需要申請暫時停學。",
    scenario_en: "You need to apply for a temporary leave of absence due to personal, health, or other reasons.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "academic_affairs"],
    required_documents: [
      { zh: "休學申請表（向教務處或系辦索取）", en: "Leave of absence application form (from Academic Affairs or department office)" },
      { zh: "醫療證明（健康因素者）", en: "Medical certificate (for health-related reasons)" },
      { zh: "指導教授或系主任同意書（視規定）", en: "Advisor or department head approval (as required)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜教務處註冊組，需於期限前提出",
    navigation_tip_en: "East Wing, Administration Building 1F｜Registration Division, apply before the deadline",
    steps: [
      { zh: "至教務處或系辦取得休學申請表", en: "Get the leave of absence form from Academic Affairs or your department office" },
      { zh: "填妥後取得必要簽名（視規定）", en: "Complete the form and obtain required signatures" },
      { zh: "送至教務處註冊組辦理，注意申請期限", en: "Submit to the Registration Division; note the application deadline" },
      { zh: "國際生注意：休學期間居留證效力需另行確認（洽國際處）", en: "International students: confirm the impact on your ARC/visa status during leave (contact OIA)" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_scholarship",
    task_name_zh: "申請獎學金",
    task_name_en: "Apply for Scholarship",
    scenario_zh: "你想了解並申請學校或校外提供的各項獎學金。",
    scenario_en: "You want to learn about and apply for scholarships offered by CCU or external organizations.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support", "student_affairs"],
    required_documents: [
      { zh: "成績單（視獎學金要求）", en: "Transcript (depending on scholarship requirements)" },
      { zh: "推薦函（部分獎學金需要）", en: "Recommendation letter (required for some scholarships)" },
      { zh: "財力證明（部分獎學金需要）", en: "Proof of financial need (required for some scholarships)" },
      { zh: "護照或居留證影本", en: "Copy of passport or ARC" }
    ],
    navigation_tip_zh: "行政大樓 1F 國際處（國際生獎學金）/ 西棟 2F 生活事務組（助學金）",
    navigation_tip_en: "Administration Building 1F OIA (international scholarships) / West Wing 2F Student Life Office (financial aid)",
    steps: [
      { zh: "至國際處或學務處網站查看目前開放的獎學金項目", en: "Check OIA or Student Affairs websites for currently available scholarships" },
      { zh: "確認申請資格與截止日期", en: "Confirm eligibility requirements and application deadlines" },
      { zh: "備妥所需文件並於期限內提交", en: "Prepare required documents and submit before the deadline" },
      { zh: "等待審核結果通知", en: "Wait for review result notification" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3967.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_tuition",
    task_name_zh: "繳交學雜費",
    task_name_en: "Pay Tuition and Fees",
    scenario_zh: "你需要繳交每學期的學雜費。",
    scenario_en: "You need to pay tuition and fees each semester.",
    target_unit_type: "office",
    target_unit_id: "cashier",
    recommended_service_categories: ["tuition"],
    required_documents: [
      { zh: "繳費通知單（Portal 或 Email）", en: "Payment notice (from Portal or email)" },
      { zh: "現金或銀行轉帳（依繳費方式）", en: "Cash or bank transfer (depending on payment method)" }
    ],
    navigation_tip_zh: "行政大樓西棟 1F｜出納組，或網路繳款",
    navigation_tip_en: "West Wing, Administration Building 1F｜Cashier Division, or pay online",
    steps: [
      { zh: "收到學校繳費通知後，確認金額與期限", en: "After receiving the payment notice, confirm the amount and deadline" },
      { zh: "選擇繳費方式：ATM 轉帳、便利商店繳費或至出納組現金繳費", en: "Choose payment method: ATM transfer, convenience store payment, or cash at the Cashier Division" },
      { zh: "繳費後保留收據，並確認 Portal 上的繳費狀態", en: "Keep your receipt after payment and confirm payment status on Portal" }
    ],
    source_url: "https://oga.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_work_permit",
    task_name_zh: "申請工作許可",
    task_name_en: "Apply for a Work Permit",
    scenario_zh: "你是國際學生，想要在學期間兼職打工，需要申請工作許可。",
    scenario_en: "As an international student, you want to work part-time and need to apply for a work permit.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [
      { zh: "居留證（ARC）", en: "ARC" },
      { zh: "在學證明", en: "Enrollment certificate" },
      { zh: "護照", en: "Passport" },
      { zh: "工作許可申請表（向國際處索取）", en: "Work permit application form (from OIA)" }
    ],
    navigation_tip_zh: "行政大樓 1F｜國際處｜取得許可後才能開始工作",
    navigation_tip_en: "Administration Building 1F｜OIA｜You must have the permit before starting work",
    steps: [
      { zh: "至國際處取得工作許可申請資料", en: "Go to OIA for work permit application materials" },
      { zh: "填妥申請表，備齊護照、ARC、在學證明", en: "Complete the application form and prepare passport, ARC, and enrollment certificate" },
      { zh: "申請核准後即可依核准範圍打工（每週不超過規定時數）", en: "After approval, you may work within the permitted scope (not exceeding the regulated weekly hours)" },
      { zh: "每學期需更新申請，且不可超過規定工時", en: "The permit must be renewed each semester and you cannot exceed the regulated working hours" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3371.php?Lang=en",
    needs_manual_review: false
  },

  // ============================================================
  // 5. 校園導覽與服務
  // ============================================================
  {
    id: "task_oia",
    task_name_zh: "找國際處",
    task_name_en: "Go to the International Office (OIA)",
    scenario_zh: "你有簽證、居留證、獎學金或任何國際學生相關問題需要協助。",
    scenario_en: "You need help with visa, ARC, scholarships, or any international student-related issues.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [],
    navigation_tip_zh: "行政大樓 1F｜週一至週五 08:30–17:00",
    navigation_tip_en: "Administration Building, 1F｜Mon–Fri 08:30–17:00",
    steps: [
      { zh: "前往行政大樓正門進入", en: "Enter through the main entrance of the Administration Building" },
      { zh: "國際處位於一樓，循指示牌可找到", en: "OIA is on the 1st floor — follow the signs" },
      { zh: "向櫃台工作人員說明你的需求", en: "Tell the counter staff what you need" }
    ],
    source_url: "https://oia.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_find_dept",
    task_name_zh: "找我的系辦公室",
    task_name_en: "Find My Department Office",
    scenario_zh: "你需要找到自己系所的辦公室，例如詢問選課、找導師、領取文件等。",
    scenario_en: "You need to find your department office for course advising, meeting your advisor, or picking up documents.",
    target_unit_type: "department",
    target_unit_id: "",
    recommended_service_categories: ["department_offices"],
    required_documents: [],
    navigation_tip_zh: "依學院不同，位置各異，請查詢地圖頁",
    navigation_tip_en: "Location varies by college — check the Map page",
    steps: [
      { zh: "確認你的系所名稱與所屬學院", en: "Confirm your department name and college" },
      { zh: "在「地圖」頁搜尋你的系所，查看所在大樓與樓層", en: "Search for your department on the Map page to find the building and floor" },
      { zh: "前往該學院大樓，搭電梯或走樓梯到指定樓層", en: "Go to the college building and take the elevator or stairs to the designated floor" },
      { zh: "找到系辦公室門牌，向系辦人員說明需求", en: "Find the department office sign and tell the staff what you need" }
    ],
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "task_library",
    task_name_zh: "使用圖書館服務",
    task_name_en: "Use Library Services",
    scenario_zh: "你想借書、查論文、預約討論室或使用電子資料庫。",
    scenario_en: "You want to borrow books, search for thesis, reserve discussion rooms, or use electronic databases.",
    target_unit_type: "office",
    target_unit_id: "library",
    recommended_service_categories: ["library"],
    required_documents: [
      { zh: "學生證（感應入館用）", en: "Student ID card (required to enter the library)" }
    ],
    navigation_tip_zh: "圖書資訊大樓｜服務台在 1F 入口處",
    navigation_tip_en: "Information and Library Building｜Service desk at the 1F entrance",
    steps: [
      { zh: "前往圖書資訊大樓，持學生證感應入館", en: "Go to the Information and Library Building and tap your student ID to enter" },
      { zh: "服務台在一樓入口，可詢問任何圖書館相關問題", en: "The service desk is at the 1st floor entrance — ask about any library services" },
      { zh: "電子資料庫：登入 SSO 後可在圖書館網站存取", en: "Electronic databases: log in with SSO to access on the library website" },
      { zh: "討論室預約：至服務台或透過圖書館網站預約", en: "Discussion room reservation: at the service desk or through the library website" }
    ],
    source_url: "https://lib.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_health",
    task_name_zh: "前往衛生保健組",
    task_name_en: "Visit the Health Services Division",
    scenario_zh: "你身體不舒服、受傷，或需要健康諮詢與體檢。",
    scenario_en: "You feel unwell, are injured, or need health consultation or checkup.",
    target_unit_type: "office",
    target_unit_id: "health_center",
    recommended_service_categories: ["health"],
    required_documents: [
      { zh: "健保卡（若有）", en: "NHI card (if available)" },
      { zh: "學生證", en: "Student ID" }
    ],
    navigation_tip_zh: "活動中心 2F｜週一至週五 08:30–17:00",
    navigation_tip_en: "Activity Center, 2F｜Mon–Fri 08:30–17:00",
    steps: [
      { zh: "前往活動中心，搭電梯或走樓梯到二樓", en: "Go to the Activity Center and take the elevator or stairs to the 2nd floor" },
      { zh: "找到衛生保健組，向護理人員說明症狀", en: "Find the Health Services Division and describe your symptoms to the nursing staff" },
      { zh: "若需進一步診療，衛生保健組提供特約醫院轉介", en: "For further treatment, the Health Services Division can provide referrals to partner hospitals" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_counseling",
    task_name_zh: "前往諮商中心",
    task_name_en: "Visit the Counseling Center",
    scenario_zh: "你感到心理壓力、情緒困擾、思鄉或適應不良，想尋求支持。",
    scenario_en: "You're experiencing stress, emotional difficulties, homesickness, or adjustment issues and want support.",
    target_unit_type: "office",
    target_unit_id: "counseling",
    recommended_service_categories: ["counseling", "health"],
    required_documents: [],
    navigation_tip_zh: "活動中心 3F｜提供英語諮商，完全保密，免費",
    navigation_tip_en: "Activity Center, 3F｜English counseling available, fully confidential, free of charge",
    steps: [
      { zh: "前往活動中心，搭電梯或走樓梯到三樓", en: "Go to the Activity Center and take the elevator or stairs to the 3rd floor" },
      { zh: "找到諮商中心，向接待人員預約或直接進行初次諮詢", en: "Find the Counseling Center and make an appointment or walk in for an initial consultation" },
      { zh: "所有諮商內容嚴格保密，請放心尋求協助", en: "All counseling sessions are strictly confidential — please feel free to seek help" }
    ],
    source_url: "https://advising.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_career",
    task_name_zh: "前往職涯發展中心",
    task_name_en: "Visit the Career Development Center",
    scenario_zh: "你需要求職資訊、履歷指導、了解實習機會，或參加校園徵才活動。",
    scenario_en: "You need job search info, resume guidance, internship opportunities, or want to join recruitment events.",
    target_unit_type: "office",
    target_unit_id: "career_center",
    recommended_service_categories: ["career"],
    required_documents: [],
    navigation_tip_zh: "共同教室大樓 5F 502 室",
    navigation_tip_en: "Room 502, 5th Floor, Center for General Education",
    steps: [
      { zh: "前往共同教室大樓，搭電梯到五樓", en: "Go to the Center for General Education building and take the elevator to the 5th floor" },
      { zh: "找到 502 室職涯發展中心", en: "Find Room 502, Career Development Center" },
      { zh: "向工作人員說明需求（求職、實習、履歷），或預約個別諮詢", en: "Tell the staff your needs (job search, internship, resume) or make an individual consultation appointment" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_it",
    task_name_zh: "處理帳號或網路問題",
    task_name_en: "Handle Account or Network Issues",
    scenario_zh: "你的學校帳號無法登入，校園網路、eCourse2 或其他系統出現問題。",
    scenario_en: "Your school account login fails, or you have issues with campus network, eCourse2, or other systems.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support"],
    required_documents: [
      { zh: "學生證（身份驗證用）", en: "Student ID (for identity verification)" }
    ],
    navigation_tip_zh: "圖書資訊大樓｜資訊處",
    navigation_tip_en: "Information and Library Building｜IT Office",
    steps: [
      { zh: "前往圖書資訊大樓，找到資訊處", en: "Go to the Information and Library Building and find the IT Office" },
      { zh: "攜帶學生證，向工作人員說明問題", en: "Bring your student ID and describe the issue to the staff" },
      { zh: "緊急問題也可 email：it@ccu.edu.tw", en: "For urgent issues, you can also email: it@ccu.edu.tw" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 6. 健康、心理與安全
  // ============================================================
  {
    id: "task_insurance_claim",
    task_name_zh: "申請學生保險理賠",
    task_name_en: "Apply for Student Insurance Claim",
    scenario_zh: "你在校內或校外受傷或生病，想申請學生團體保險理賠。",
    scenario_en: "You were injured or ill on or off campus and want to file a student group insurance claim.",
    target_unit_type: "office",
    target_unit_id: "health_center",
    recommended_service_categories: ["health", "student_affairs"],
    required_documents: [
      { zh: "醫療收據與診斷書", en: "Medical receipts and diagnosis certificate" },
      { zh: "保險理賠申請表（向衛生保健組索取）", en: "Insurance claim form (from Health Services Division)" },
      { zh: "學生證影本", en: "Copy of student ID" }
    ],
    navigation_tip_zh: "活動中心 2F｜衛生保健組，或學務處生活事務組",
    navigation_tip_en: "Activity Center 2F｜Health Services Division, or Student Life Office",
    steps: [
      { zh: "就醫後保留所有收據與診斷書", en: "Keep all receipts and diagnosis certificates after medical treatment" },
      { zh: "至衛生保健組或生活事務組取得理賠申請表", en: "Get the insurance claim form from the Health Services Division or Student Life Office" },
      { zh: "填妥後附上所有文件送件審查", en: "Complete the form and submit with all documents for review" },
      { zh: "審查通過後，理賠金額匯入指定帳戶", en: "After approval, the claim amount will be transferred to your designated account" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_emergency",
    task_name_zh: "緊急事件通報與處理",
    task_name_en: "Report and Handle Emergency Incidents",
    scenario_zh: "你或身邊的人遇到緊急安全事故（受傷、危險、突發事件）。",
    scenario_en: "You or someone around you has encountered an emergency safety incident (injury, danger, sudden event).",
    target_unit_type: "office",
    target_unit_id: "osa_safety",
    recommended_service_categories: ["student_affairs", "health"],
    required_documents: [],
    navigation_tip_zh: "緊急：119（救護）/ 110（警察）/ 校安中心 24 小時",
    navigation_tip_en: "Emergency: 119 (ambulance) / 110 (police) / Campus Safety Center 24 hrs",
    steps: [
      { zh: "立即撥打 119（救護）或 110（警察）處理緊急狀況", en: "Immediately call 119 (ambulance) or 110 (police) for emergencies" },
      { zh: "聯繫校安中心（24 小時）：05-2720411 ext.19110", en: "Contact the Campus Safety Center (24 hours): 05-2720411 ext.19110" },
      { zh: "事後至學務處學生安全組填寫事故通報單", en: "Afterward, go to the Division of Student Safety to fill out an incident report form" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 7. 畢業與職涯
  // ============================================================
  {
    id: "task_graduation",
    task_name_zh: "確認畢業資格",
    task_name_en: "Confirm Graduation Requirements",
    scenario_zh: "你即將畢業，想確認自己是否符合畢業資格及所需完成的手續。",
    scenario_en: "You are nearing graduation and want to confirm eligibility and required procedures.",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["academic_affairs", "registration"],
    required_documents: [
      { zh: "歷年成績單（系辦或教務處取得）", en: "Transcript of all academic years (from department office or Academic Affairs)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜教務處註冊組，先至系辦確認",
    navigation_tip_en: "East Wing, Administration Building 1F｜Registration Division; confirm with department office first",
    steps: [
      { zh: "至系辦確認畢業必修學分是否修畢", en: "Go to your department office to confirm all required graduation credits are completed" },
      { zh: "在 CCU Portal 查看畢業審查狀態", en: "Check your graduation review status on CCU Portal" },
      { zh: "若有缺少學分，儘速與指導教授或系辦討論補救方式", en: "If you are missing credits, discuss remediation options with your advisor or department office immediately" },
      { zh: "辦理離校手續：歸還圖書館借書、清繳相關費用", en: "Complete school-leaving procedures: return library books, clear outstanding fees" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_internship",
    task_name_zh: "申請校外實習",
    task_name_en: "Apply for Off-Campus Internship",
    scenario_zh: "你想申請課程認可的校外實習機會。",
    scenario_en: "You want to apply for a course-credited off-campus internship.",
    target_unit_type: "office",
    target_unit_id: "career_center",
    recommended_service_categories: ["career", "student_affairs"],
    required_documents: [
      { zh: "實習申請表（向職涯發展中心索取）", en: "Internship application form (from Career Development Center)" },
      { zh: "工作許可（國際生需要）", en: "Work permit (required for international students)" },
      { zh: "指導教授或系主任同意書", en: "Approval from advisor or department head" }
    ],
    navigation_tip_zh: "共同教室大樓 5F 502 室｜職涯發展中心",
    navigation_tip_en: "Room 502, 5th Floor｜Career Development Center",
    steps: [
      { zh: "至職涯發展中心了解合作實習機構與申請流程", en: "Visit the Career Development Center to learn about partner internship organizations and application process" },
      { zh: "國際生須先確認工作許可（可至國際處詢問）", en: "International students must first confirm work permit eligibility (contact OIA)" },
      { zh: "取得指導教授或系主任同意後提交申請", en: "Obtain approval from your advisor or department head, then submit the application" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_gown",
    task_name_zh: "借用畢業學位服",
    task_name_en: "Rent a Graduation Gown",
    scenario_zh: "你即將參加畢業典禮，需要借用學位服。",
    scenario_en: "You are about to attend the graduation ceremony and need to rent a graduation gown.",
    target_unit_type: "office",
    target_unit_id: "oga_property",
    recommended_service_categories: ["campus_life", "student_affairs"],
    required_documents: [
      { zh: "學生證", en: "Student ID" },
      { zh: "借用押金（視規定）", en: "Deposit (as required)" }
    ],
    navigation_tip_zh: "行政大樓西棟 B1｜總務處保管組",
    navigation_tip_en: "Basement 1, West Wing, Administration Building｜Property Management Division",
    steps: [
      { zh: "依學校公告時間，至行政大樓西棟地下一樓保管組辦理", en: "During the announced period, go to the Property Management Division in Basement 1 of the West Wing" },
      { zh: "出示學生證並繳交押金", en: "Show your student ID and pay the deposit" },
      { zh: "典禮後依規定時間歸還，退回押金", en: "Return the gown by the specified time after the ceremony to receive your deposit back" }
    ],
    source_url: "https://oga.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 8. 課外活動與社群
  // ============================================================
  {
    id: "task_club",
    task_name_zh: "加入社團或參加校園活動",
    task_name_en: "Join a Club or Participate in Campus Activities",
    scenario_zh: "你想加入學生社團，或了解校園活動的報名方式。",
    scenario_en: "You want to join a student club or learn how to sign up for campus activities.",
    target_unit_type: "office",
    target_unit_id: "osa_extracurricular",
    recommended_service_categories: ["student_affairs"],
    required_documents: [],
    navigation_tip_zh: "活動中心 2F｜課外活動組，或社博會時直接向社團報名",
    navigation_tip_en: "Activity Center, 2F｜Extra-Curricular Division, or sign up directly at the Club Expo",
    steps: [
      { zh: "注意每學期初（通常第 1–2 週）舉辦的社團博覽會，現場報名", en: "Look out for the Club Expo held at the start of each semester (usually weeks 1–2) to sign up in person" },
      { zh: "查詢社團資訊：至課外活動組詢問或查看學校公佈欄", en: "Find club information: ask at the Extra-Curricular Division or check school bulletin boards" },
      { zh: "也可透過社團 Instagram 或 LINE 等社群聯繫社團幹部加入", en: "You can also contact club officers through their Instagram or LINE accounts to join" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_language_support",
    task_name_zh: "取得語言學習與中文課程支援",
    task_name_en: "Get Language Learning and Mandarin Course Support",
    scenario_zh: "你是國際生，需要補強中文能力或尋找語言學習資源。",
    scenario_en: "As an international student, you want to improve your Mandarin or find language learning resources.",
    target_unit_type: "office",
    target_unit_id: "language_center",
    recommended_service_categories: ["international_support", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "圖書資訊大樓｜語言中心",
    navigation_tip_en: "Information and Library Building｜Language Center",
    steps: [
      { zh: "至語言中心詢問國際學生華語課程開課資訊", en: "Visit the Language Center to inquire about Mandarin courses for international students" },
      { zh: "語言中心也提供同儕語言輔導，可預約語言夥伴", en: "The Language Center also offers peer language tutoring — you can book a language partner" },
      { zh: "查詢語言測驗（TOEIC、GEPT）相關資訊也可洽語言中心", en: "For language proficiency test info (TOEIC, GEPT), contact the Language Center" }
    ],
    source_url: "https://cls.ccu.edu.tw/",
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
