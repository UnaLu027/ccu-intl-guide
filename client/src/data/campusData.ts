/**
 * CCU International Student Friendly Campus Guide — Data Layer
 * Design: Wayfinding Signage System
 *
 * ============================================================
 * CHANGE LOG（相較於 GitHub 原版）
 * ============================================================
 * [新增] Office interface：floor_plan_image?, entrance_image?
 * [新增] Department interface：floor_plan_image?, entrance_image?, is_college_office?
 * [新增] Task interface：required_documents[], navigation_tip_zh?, navigation_tip_en?
 * [修正] category 值統一：offices → "office", departments → "department"
 * [修正] 移除 campus_life serviceCategory 及 campusResources（由另一組負責）
 * [新增] serviceCategories：career, it_support, counseling
 * [新增] offices：教學發展中心、資訊處、語言中心、課外活動組、學生安全組、
 *         生活事務組、職涯發展中心、招生組、總務處事務組、總務處保管組、
 *         駐警處車輛管控中心、人事室、秘書室
 * [修正] 衛生保健組地點更正為活動中心 2F
 * [修正] 諮商中心地點更正為活動中心 3F
 * [新增] departments：全部院辦（7間）、台灣文學與創意應用研究所、語言學研究所、
 *         生物醫學科學系、運動競技學系（教育學院）
 * [新增] tasks：共 50 筆，含居留證（3種）、宿舍費、包裹、YouBike、轉系等
 * ============================================================
 * HOW TO UPDATE
 * ============================================================
 * ▶ 新增行政處室：在 offices 陣列加入，category 填 "office"
 * ▶ 新增系所：在 departments 陣列加入，category 填 "department"
 * ▶ 新增 Task：在 tasks 陣列加入，含 required_documents 與 navigation_tip
 * ▶ 新增圖片：
 *   1. 圖片放入 client/public/images/offices/[id]/ 或 departments/[id]/
 *   2. 填入 floor_plan_image / entrance_image 欄位路徑
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
    keywords: ["dormitory", "dorm", "housing", "room", "accommodation", "宿舍", "住宿", "房間", "parcel", "package", "laundry", "包裹", "洗衣"]
  },
  {
    id: "health",
    name_en: "Health",
    name_zh: "健康醫療",
    icon: "Heart",
    description_en: "Health center, medical services, and health checkups",
    description_zh: "健康中心、醫療服務與健康檢查",
    keywords: ["health", "medical", "doctor", "clinic", "hospital", "sick", "injury", "insurance", "健康", "醫療", "看病", "受傷", "保險"]
  },
  {
    id: "library",
    name_en: "Library",
    name_zh: "圖書館",
    icon: "BookOpen",
    description_en: "Book borrowing, study spaces, and academic resources",
    description_zh: "圖書借閱、自習空間與學術資源",
    keywords: ["library", "book", "study", "research", "database", "print", "圖書館", "借書", "自習", "研究", "列印"]
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
    keywords: ["academic", "curriculum", "grade", "transcript", "graduation", "credit", "transfer", "教務", "成績", "成績單", "畢業", "學分", "轉系"]
  },
  {
    id: "course_issues",
    name_en: "Course Issues",
    name_zh: "選課相關",
    icon: "FileText",
    description_en: "Course add/drop, schedule conflicts, and course-related problems",
    description_zh: "加退選、衝堂與選課相關問題",
    keywords: ["course", "add", "drop", "schedule", "class", "syllabus", "professor", "email", "選課", "加選", "退選", "衝堂", "課程", "課綱", "教授"]
  },
  {
    id: "tuition",
    name_en: "Tuition & Fees",
    name_zh: "學費繳納",
    icon: "Wallet",
    description_en: "Tuition payment, fee reduction, and financial matters",
    description_zh: "學費繳納、減免與財務相關事項",
    keywords: ["tuition", "fee", "payment", "financial", "money", "scholarship", "學費", "繳費", "減免", "財務", "獎學金"]
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
    keywords: ["wifi", "network", "account", "software", "ecourse", "sso", "email", "password", "microsoft", "google", "網路", "帳號", "軟體", "資訊", "密碼"]
  },
  {
    id: "counseling",
    name_en: "Counseling",
    name_zh: "心理諮商",
    icon: "HeartHandshake",
    description_en: "Psychological counseling, mental health support, and student wellness",
    description_zh: "心理諮商、心理健康支持與學生身心健康",
    keywords: ["counseling", "mental health", "stress", "anxiety", "depression", "wellbeing", "諮商", "心理", "壓力", "情緒", "輔導"]
  }
];

// ============================================================
// Offices (Administrative Units)
// ============================================================
export interface Office {
  id: string;
  name_zh: string;
  name_en: string;
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
  floor_plan_image?: string;
  entrance_image?: string;
}

export const offices: Office[] = [
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
    indoor_location_note_en: "1st floor, Administration Building",
    function_desc_zh: "負責國際學生入學、簽證居留、獎學金、交換計畫、宿舍費繳納、國際活動與生活輔導等事務。",
    function_desc_en: "Handles international student admissions, visa/ARC, scholarships, exchange programs, dormitory fee payment, international events, and life support.",
    service_scope_zh: "入學諮詢、簽證與居留證辦理、獎學金申請、宿舍費繳費單領取、國際交流活動、國際學生生活輔導。",
    service_scope_en: "Admission inquiry, Visa & ARC application, Scholarship application, Dormitory fee payment sheet collection, International exchange events, Life counseling for international students.",
    common_scenarios_zh: "居留證問題、獎學金申請、入學手續、宿舍費繳納、國際活動報名、工作許可申請。",
    common_scenarios_en: "ARC issues, Scholarship application, Enrollment procedures, Dormitory fee payment, International event registration, Work permit application.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411 ext. 17619",
    email: "oia@ccu.edu.tw",
    official_url: "https://oia.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oia.ccu.edu.tw/p/404-1008-51159.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "oaa",
    name_zh: "教務處",
    name_en: "Office of Academic Affairs",
    category: "office",
    service_categories: ["academic_affairs", "registration", "course_issues"],
    building_name_zh: "行政大樓東棟",
    building_name_en: "East Wing, Administration Building",
    floor: "1F–2F",
    indoor_location_note_zh: "行政大樓東棟一至二樓",
    indoor_location_note_en: "1st–2nd Floor, East Wing, Administration Building",
    function_desc_zh: "統籌全校教務事項，包括課程規劃、選課、成績管理、學籍與畢業審查。",
    function_desc_en: "Oversees academic affairs including curriculum planning, course selection, grade management, enrollment status, and graduation review.",
    service_scope_zh: "課程規劃、選課系統、成績查詢、學籍管理、畢業審查、轉系申請。",
    service_scope_en: "Curriculum planning, Course selection system, Grade inquiry, Enrollment management, Graduation review, Department transfer application.",
    common_scenarios_zh: "選課問題、成績疑義、畢業資格確認、轉系。",
    common_scenarios_en: "Course selection issues, Grade disputes, Graduation eligibility, Department transfer.",
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
    common_scenarios_zh: "補辦學生證、申請成績單、辦理休學、學分抵免。",
    common_scenarios_en: "Replace student ID, Apply for transcript, Process leave of absence, Credit transfer.",
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
    service_scope_zh: "課程時間表、教室借用、選課加退選、課程撤選、考試安排。",
    service_scope_en: "Course timetable, Classroom booking, Course add/drop, Course withdrawal, Exam scheduling.",
    common_scenarios_zh: "選課衝堂、加退選問題、課程撤選、教室查詢。",
    common_scenarios_en: "Course schedule conflicts, Add/drop issues, Course withdrawal, Classroom inquiry.",
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
    building_name_zh: "學士班宿舍 C 棟一樓（學士生）/ 研究生宿舍 B 棟（研究生）",
    building_name_en: "Undergraduate Dorm Block C, 1F (undergrad) / Graduate Dorm Block B (grad)",
    floor: "1F",
    indoor_location_note_zh: "學士班宿舍 C 棟一樓櫃台 / 研究生宿舍 B 棟",
    indoor_location_note_en: "Undergraduate Dorm Block C, 1F counter / Graduate Dorm Block B",
    function_desc_zh: "管理學生宿舍申請、床位分配、維修報修、退宿、包裹代收及相關住宿服務。",
    function_desc_en: "Manages dormitory applications, bed allocation, maintenance requests, move-out procedures, parcel collection, and related housing services.",
    service_scope_zh: "宿舍申請與分配、修繕報修、冷氣卡儲值、退宿手續、包裹代收委託、宿舍規範。",
    service_scope_en: "Dormitory application & allocation, Maintenance requests, AC card recharge, Move-out procedures, Parcel proxy collection, Dormitory regulations.",
    common_scenarios_zh: "宿舍申請、門禁問題、設備報修、包裹代收委託、洗衣機故障。",
    common_scenarios_en: "Dormitory application, Access issues, Equipment repair, Parcel proxy, Washing machine malfunction.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2721422 ext. 73399 (學士) / ext. 82121 (研究生)",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學學生宿舍",
    latitude: 23.5605,
    longitude: 120.4730,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
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
    service_scope_zh: "獎助學金申請；就學貸款；學雜費減免；弱勢學生補助；學生團體保險；失物招領；校安值勤。",
    service_scope_en: "Scholarship/bursary applications; Student loans; Tuition reduction; Financial aid; Student group insurance; Lost and Found; Campus security duty.",
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
    service_scope_zh: "社團成立申請；社團活動與大型活動規劃；活動中心場地借用；社團活動經費申請；學生會行政支援。",
    service_scope_en: "Club establishment; Activity planning and major campus events; Activity Center venue booking; Funding applications; Student Association support.",
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
    office_hours: "24 hours (security center) / Mon–Fri 08:30–17:00 (office)",
    phone: "05-2720411 ext. 19110 (24H)",
    email: "",
    official_url: "https://studaffairs.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "health_center",
    name_zh: "衛生保健組",
    name_en: "Health Services Division",
    category: "office",
    service_categories: ["health", "student_affairs"],
    building_name_zh: "活動中心",
    building_name_en: "Activity Center",
    floor: "2F",
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
    function_desc_zh: "提供圖書借閱、電子資料庫、自習空間、研究小間、多媒體服務及論文上傳。",
    function_desc_en: "Provides book borrowing, electronic databases, study spaces, research carrels, multimedia services, and thesis upload.",
    service_scope_zh: "圖書借還與續借；電子資源與資料庫；空間申請（討論室、自習室）；館際合作；論文上傳。線上入口：https://portal.ccu.edu.tw/sso_index.php",
    service_scope_en: "Book borrowing, renewal, reservation; Electronic databases and e-resources; Space reservations (discussion rooms, self-study); Interlibrary loan; Thesis upload. Online portal: https://portal.ccu.edu.tw/sso_index.php",
    common_scenarios_zh: "借書還書、查論文、預約討論室、使用資料庫、列印。",
    common_scenarios_en: "Borrow/return books, Search for thesis, Reserve discussion rooms, Use databases, Printing.",
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
  {
    id: "it_office",
    name_zh: "資訊處",
    name_en: "Information Technology Office",
    category: "office",
    service_categories: ["it_support", "academic_affairs"],
    building_name_zh: "圖書資訊大樓",
    building_name_en: "Information and Library Building",
    floor: "",
    indoor_location_note_zh: "圖書資訊大樓（圖書館大門左手邊）",
    indoor_location_note_en: "Information and Library Building (left of the Library main entrance)",
    function_desc_zh: "負責校園 SSO、網路、無線網路、數位學習系統及軟體授權等資訊服務。",
    function_desc_en: "Responsible for campus SSO, network, Wi-Fi, digital learning systems, and software licensing.",
    service_scope_zh: "SSO 單一入口、Web Mail、Microsoft 365、Google Workspace 帳號問題；校園網路與無線網路；eCourse2 與雲端教室技術支援；軟體下載（https://software.ccu.edu.tw）；列印服務。",
    service_scope_en: "SSO, Web Mail, Microsoft 365, Google Workspace account issues; Campus network and Wi-Fi; eCourse2 and cloud classroom support; Software downloads (https://software.ccu.edu.tw); Printing services.",
    common_scenarios_zh: "帳號無法登入、密碼重設、網路異常、eCourse2 問題、軟體申請、沒有 e-Course 帳號。",
    common_scenarios_en: "Account login issues, Password reset, Network problems, eCourse2 issues, Software applications, No e-Course account.",
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
    service_scope_zh: "通識英文與應用外語學程；國際學生華語課程；語言學習輔導與同儕輔導；英檢、TOEIC、TOEFL、GEPT 等考試資訊。",
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
  {
    id: "general_affairs",
    name_zh: "總務處",
    name_en: "Office of General Affairs",
    category: "office",
    service_categories: ["student_affairs"],
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
  {
    id: "oga_general_services",
    name_zh: "總務處－事務組",
    name_en: "General Services Division, Office of General Affairs",
    category: "office",
    service_categories: ["student_affairs"],
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
    service_scope_zh: "畢業學位服借用與歸還；畢業生離校手續；校內鑰匙管理與借用；活動器材借用；校內紀念品管理。",
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
    service_scope_zh: "車輛通行證辦理；違規收費與申訴；教職員生離校審核；行動不便者臨時通行證申請。",
    service_scope_en: "Vehicle permit issuance; Parking violation fees and appeals; Departure reviews; Temporary disability passes.",
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
  },
  {
    id: "personnel",
    name_zh: "人事室",
    name_en: "Personnel Office",
    category: "office",
    service_categories: ["student_affairs"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "4F",
    indoor_location_note_zh: "行政大樓西棟四樓",
    indoor_location_note_en: "4th Floor, West Wing, Administration Building",
    function_desc_zh: "處理人事相關事務，包括申訴案件。",
    function_desc_en: "Handles personnel-related matters including appeals.",
    service_scope_zh: "申訴案件處理。",
    service_scope_en: "Appeal case handling.",
    common_scenarios_zh: "申訴。",
    common_scenarios_en: "Appeals.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://person.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://person.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "secretariat",
    name_zh: "秘書室",
    name_en: "Office of the Secretariat",
    category: "office",
    service_categories: ["student_affairs"],
    building_name_zh: "行政大樓西棟",
    building_name_en: "West Wing, Administration Building",
    floor: "5F",
    indoor_location_note_zh: "行政大樓西棟五樓",
    indoor_location_note_en: "5th Floor, West Wing, Administration Building",
    function_desc_zh: "處理學校行政文書、工讀生管理等秘書室業務。",
    function_desc_en: "Handles school administrative documents, work-study student management, and secretariat affairs.",
    service_scope_zh: "秘書室辦公室工讀生指導、工讀金管理與核銷。",
    service_scope_en: "Guidance for work-study students, management and reimbursement of work-study allowances.",
    common_scenarios_zh: "行政文書、工讀相關。",
    common_scenarios_en: "Administrative documents, work-study related.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "secretar@ccu.edu.tw",
    official_url: "https://secretar.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://secretar.ccu.edu.tw/",
    needs_manual_review: true
  }
];


// ============================================================
// Departments (Academic Units)
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
  is_college_office?: boolean;
  floor_plan_image?: string;
  entrance_image?: string;
}

export const departments: Department[] = [
  // ============================================================
  // 院辦 College Administrative Offices (is_college_office: true)
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
    name_zh: "數學系含應用數學碩士班、博士班及統計科學碩士班",
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
    name_zh: "生物醫學科學系含分子生物碩士班、博士班及生物醫學碩士班",
    name_en: "Department of Biomedical Sciences",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院大樓",
    building_name_en: "College of Science Building",
    floor: "",
    indoor_location_note_zh: "理學院大樓",
    indoor_location_note_en: "College of Science Building",
    function_desc_zh: "提供生物醫學科學教學與研究。",
    function_desc_en: "Offers teaching and research in biomedical sciences.",
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
  {
    id: "stemphd",
    name_zh: "跨領域科學國際博士學位學程",
    name_en: "International PhD Program in Interdisciplinary Science",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院大樓",
    building_name_en: "College of Science Building",
    floor: "",
    indoor_location_note_zh: "理學院大樓",
    indoor_location_note_en: "College of Science Building",
    function_desc_zh: "提供跨領域科學國際博士教學與研究。",
    function_desc_en: "Offers international doctoral teaching and research in interdisciplinary sciences.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://stemphd.ccu.edu.tw",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://stemphd.ccu.edu.tw",
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
    indoor_location_note_zh: "社科院二館七樓",
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
    name_zh: "傳播學系含電訊傳播碩士班",
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
    {
    id: "isia",
    name_zh: "戰略暨國際事務研究所",
    name_en: "Graduate Institute of Strategic and International Affairs",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "",
    indoor_location_note_zh: "社會科學院大樓",
    indoor_location_note_en: "College of Social Sciences Building",
    function_desc_zh: "提供戰略與國際事務教學與研究。",
    function_desc_en: "Offers teaching and research in strategic and international affairs.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://isia.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://isia.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "cogsci",
    name_zh: "認知科學博士學位學程",
    name_en: "Doctoral Program in Cognitive Science",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "",
    indoor_location_note_zh: "社會科學院大樓",
    indoor_location_note_en: "College of Social Sciences Building",
    function_desc_zh: "提供認知科學跨領域博士教學與研究。",
    function_desc_en: "Offers interdisciplinary doctoral teaching and research in cognitive science.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://cogsci.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://cogsci.ccu.edu.tw/",
    needs_manual_review: true
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
  {
    id: "aimhi",
    name_zh: "前瞻製造系統碩士學位學程",
    name_en: "Master's Program in Advanced Intelligent Manufacturing and Human-Robot Interaction",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工學院大樓",
    building_name_en: "College of Engineering Building",
    floor: "",
    indoor_location_note_zh: "工學院大樓",
    indoor_location_note_en: "College of Engineering Building",
    function_desc_zh: "提供前瞻製造系統研究生教學與研究。",
    function_desc_en: "Offers graduate teaching and research in advanced manufacturing systems.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://aimhi.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://aimhi.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "ccitelearning",
    name_zh: "雲端計算與物聯網數位學習碩士在職專班",
    name_en: "Master's Program in Cloud Computing and IoT (e-Learning, In-Service)",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工學院大樓",
    building_name_en: "College of Engineering Building",
    floor: "",
    indoor_location_note_zh: "工學院大樓",
    indoor_location_note_en: "College of Engineering Building",
    function_desc_zh: "提供雲端計算與物聯網在職進修碩士課程。",
    function_desc_en: "Offers in-service master's program in cloud computing and IoT.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://ccitelearning.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://ccitelearning.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "ibpme",
    name_zh: "機械工程國際學士學位學程",
    name_en: "International Bachelor's Program in Mechanical Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工二館機械館",
    building_name_en: "Mechanical Engineering Building",
    floor: "",
    indoor_location_note_zh: "機械館",
    indoor_location_note_en: "Mechanical Engineering Building",
    function_desc_zh: "提供機械工程英語授課國際學士學位課程。",
    function_desc_en: "Offers an English-taught international bachelor's degree program in mechanical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs", "international_support"],
    official_url: "https://ibpme.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://ibpme.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ============================================================
  // 管理學院 College of Management
  // ============================================================
  {
    id: "economics",
    name_zh: "經濟學系含國際經濟學碩士班、在職專班、博士班",
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
    name_zh: "企業管理學系暨研究所含行銷管理碩士班",
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
    name_zh: "資訊管理學系暨研究所含醫療資訊管理碩士班",
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
    {
    id: "emba",
    name_zh: "高階主管管理碩士在職專班",
    name_en: "Executive Master of Business Administration (EMBA)",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "",
    indoor_location_note_zh: "管理學院大樓",
    indoor_location_note_en: "College of Management Building",
    function_desc_zh: "提供高階主管在職進修管理碩士課程。",
    function_desc_en: "Offers an executive MBA program for in-service senior managers.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://emba.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://emba.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "imf",
    name_zh: "國際財務金融管理碩士學位學程",
    name_en: "International Master's Program in Finance",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "",
    indoor_location_note_zh: "管理學院大樓",
    indoor_location_note_en: "College of Management Building",
    function_desc_zh: "提供英語授課國際財務金融管理碩士課程。",
    function_desc_en: "Offers an English-taught international master's program in finance.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs", "international_support"],
    official_url: "https://imf.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://imf.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "mft",
    name_zh: "金融科技碩士學位學程",
    name_en: "Master's Program in FinTech",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "",
    indoor_location_note_zh: "管理學院大樓",
    indoor_location_note_en: "College of Management Building",
    function_desc_zh: "提供金融科技碩士教學與研究。",
    function_desc_en: "Offers master's teaching and research in financial technology (FinTech).",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://mft.ccu.edu.tw",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://mft.ccu.edu.tw",
    needs_manual_review: true
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
    name_zh: "成人及繼續教育學系暨研究所含高齡者教育碩士班",
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
  },
  {
    id: "sports",
    name_zh: "運動競技學系暨運動與休閒教育碩士班",
    name_en: "Department of Sports and Athletics",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "體育館",
    building_name_en: "Gymnasium",
    floor: "",
    indoor_location_note_zh: "體育館",
    indoor_location_note_en: "Gymnasium",
    function_desc_zh: "提供運動競技、運動教育與休閒教育教學與研究。",
    function_desc_en: "Offers teaching and research in sports, athletics, and leisure education.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://das-sle.ccu.edu.tw/",
    google_maps_query: "國立中正大學體育館",
    latitude: 23.5610,
    longitude: 120.4740,
    source_url: "https://das-sle.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "eduresearch",
    name_zh: "教育學研究所",
    name_en: "Graduate Institute of Education",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院大樓",
    building_name_en: "College of Education Building",
    floor: "",
    indoor_location_note_zh: "教育學院大樓",
    indoor_location_note_en: "College of Education Building",
    function_desc_zh: "提供教育學研究所教學與研究。",
    function_desc_en: "Offers graduate teaching and research in education.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptedu.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://deptedu.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "teacher_edu",
    name_zh: "師資培育中心",
    name_en: "Center for Teacher Education",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院大樓",
    building_name_en: "College of Education Building",
    floor: "",
    indoor_location_note_zh: "教育學院大樓",
    indoor_location_note_en: "College of Education Building",
    function_desc_zh: "負責全校師資培育課程規劃與教師資格考試輔導。",
    function_desc_en: "Responsible for teacher education programs and teacher certification exam preparation.",
    service_scope_zh: "師資培育課程、教師資格考試諮詢。",
    service_scope_en: "Teacher education programs, teacher certification consultation.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://resttc.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://resttc.ccu.edu.tw/",
    needs_manual_review: true
  },
  // ============================================================
  // 中心單位
  // ============================================================
  {
    id: "general_edu_center",
    name_zh: "通識教育中心",
    name_en: "Center for General Education",
    college_zh: "中心單位",
    college_en: "Center Units",
    building_name_zh: "共同教室大樓",
    building_name_en: "Center for General Education Building",
    floor: "",
    indoor_location_note_zh: "共同教室大樓",
    indoor_location_note_en: "Center for General Education Building",
    function_desc_zh: "負責全校通識教育課程規劃與推動。",
    function_desc_en: "Responsible for planning and promoting general education courses university-wide.",
    service_scope_zh: "通識課程諮詢、通識學分確認。",
    service_scope_en: "General education course consultation, general credit confirmation.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptcge.ccu.edu.tw",
    google_maps_query: "國立中正大學共同教室大樓",
    latitude: 23.5645,
    longitude: 120.4700,
    source_url: "https://deptcge.ccu.edu.tw",
    needs_manual_review: true
  },
  {
    id: "ids",
    name_zh: "紫荊不分系學士學位學程",
    name_en: "Interdisciplinary Bachelor's Degree Program (Zi-Jing Program)",
    college_zh: "中心單位",
    college_en: "Center Units",
    building_name_zh: "共同教室大樓",
    building_name_en: "Center for General Education Building",
    floor: "",
    indoor_location_note_zh: "共同教室大樓",
    indoor_location_note_en: "Center for General Education Building",
    function_desc_zh: "提供跨領域彈性修課的不分系學士學位課程。",
    function_desc_en: "Offers a flexible, interdisciplinary bachelor's degree program without a fixed major.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptids.ccu.edu.tw/",
    google_maps_query: "國立中正大學共同教室大樓",
    latitude: 23.5645,
    longitude: 120.4700,
    source_url: "https://deptids.ccu.edu.tw/",
    needs_manual_review: true
  }
];


// ============================================================
// Common Tasks — 50 筆，含 required_documents, navigation_tip
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
  // ── 來台前 / 抵台手續 ──────────────────────────────────────
  {
    id: "task_arc_resident_visa",
    task_name_zh: "以居留簽證辦理居留證（ARC）",
    task_name_en: "Apply for ARC with a Resident Visa",
    scenario_zh: "你剛到台灣，需要在入境或取得居留簽證後 30 日內申請居留證。",
    scenario_en: "You just arrived in Taiwan and must apply for ARC within 30 days of entry or obtaining a resident visa.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [
      { zh: "有效護照與居留簽證", en: "Valid passport and resident visa" },
      { zh: "2 吋大頭照", en: "Two-inch passport photo" },
      { zh: "居住證明（國際處提供）", en: "Proof of accommodation (provided by OIA)" },
      { zh: "在學或入學許可證明", en: "Admission permit or enrollment certificate" },
      { zh: "規費 NT$1,000/年", en: "Fee: NT$1,000/year" }
    ],
    navigation_tip_zh: "行政大樓 1F｜國際處｜先至 OIA 確認文件再辦",
    navigation_tip_en: "Administration Building, 1F｜OIA｜Confirm documents at OIA first",
    steps: [
      { zh: "使用線上申辦系統：https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=zh", en: "Use the online application system: https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en" },
      { zh: "進入網站註冊帳號", en: "Create and activate an account" },
      { zh: "填寫資料並上傳所需文件", en: "Fill out the application form and upload required documents" },
      { zh: "資料核准後繳費 NT$1,000/年", en: "Pay NT$1,000/year after approval" },
      { zh: "攜帶繳費收據至移民署領取居留證", en: "Bring your payment receipt and collect your ARC at NIA service centers" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3916.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_arc_visitor_visa",
    task_name_zh: "以停留簽證辦理居留證（ARC）",
    task_name_en: "Apply for ARC with a Visitor Visa",
    scenario_zh: "你持有停留簽證但想在台灣待超過六個月，應在簽證到期前 15 日申請（學期交換生非強制）。",
    scenario_en: "You have a visitor visa but want to stay in Taiwan for more than six months; apply 15 days before visa expires (not mandatory for semester exchange students).",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [
      { zh: "有效護照與停留簽證", en: "Valid passport and visitor visa" },
      { zh: "2 吋大頭照", en: "Two-inch passport photo" },
      { zh: "居住證明（國際處提供）", en: "Proof of accommodation (from OIA)" },
      { zh: "在學或入學許可證明", en: "Admission permit or enrollment certificate" },
      { zh: "健康檢查合格證明", en: "Health certificate" },
      { zh: "規費 NT$1,000/年 + NT$2,200", en: "Fee: NT$1,000/year + NT$2,200" }
    ],
    navigation_tip_zh: "行政大樓 1F｜國際處｜簽證到期前 15 日辦理",
    navigation_tip_en: "Administration Building, 1F｜OIA｜Apply 15 days before visa expiry",
    steps: [
      { zh: "使用線上申辦系統：https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=zh", en: "Use the online application system: https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en" },
      { zh: "填寫資料並上傳所需文件（含健康檢查報告）", en: "Fill out the form and upload required documents (including health certificate)" },
      { zh: "資料核准後繳費 NT$1,000/年 + NT$2,200", en: "Pay NT$1,000/year + NT$2,200 after approval" },
      { zh: "攜帶繳費收據至移民署領取居留證", en: "Bring your payment receipt and collect your ARC at NIA service centers" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3916.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_arc_extend",
    task_name_zh: "申請延期居留證",
    task_name_en: "Extend Your ARC",
    scenario_zh: "你需要延長在台灣的居留期限（在居留期限到期前 3 個月內辦理）。",
    scenario_en: "You need to extend your residency in Taiwan (apply within 3 months before ARC expiration).",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [
      { zh: "有效護照", en: "Valid passport" },
      { zh: "現有居留證", en: "Current ARC" },
      { zh: "2 吋大頭照", en: "Two-inch passport photo" },
      { zh: "在學或註冊證明", en: "Proof of enrollment" },
      { zh: "規費 NT$1,000/年", en: "Fee: NT$1,000/year" }
    ],
    navigation_tip_zh: "行政大樓 1F｜國際處｜到期前 3 個月內辦理",
    navigation_tip_en: "Administration Building, 1F｜OIA｜Apply within 3 months before expiry",
    steps: [
      { zh: "使用線上申辦系統：https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=zh", en: "Use the online application system: https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en" },
      { zh: "填寫資料並上傳：護照、居留證、在學證明、照片", en: "Fill out the form and upload: passport, ARC, enrollment proof, photo" },
      { zh: "資料核准後繳費 NT$1,000/年", en: "Pay NT$1,000/year after approval" },
      { zh: "攜帶繳費收據與舊居留證至移民署領取新居留證", en: "Bring your receipt and old ARC to collect your new ARC at NIA" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3916.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_go_nia",
    task_name_zh: "前往移民署",
    task_name_en: "Go to the National Immigration Agency (NIA)",
    scenario_zh: "你需要從學校前往嘉義市移民署服務站辦理相關手續。",
    scenario_en: "You need to travel from CCU to the Chiayi NIA Service Station.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [],
    navigation_tip_zh: "嘉義市東區吳鳳北路184號2樓｜週一至週五 08:00–17:00",
    navigation_tip_en: "2F, No. 184, Wufeng N. Rd., East District, Chiayi City｜Mon–Fri 08:00–17:00",
    steps: [
      { zh: "嘉義市移民署服務站地址：嘉義市東區吳鳳北路184號2樓", en: "NIA Chiayi Service Station: 2F, No. 184, Wufeng N. Rd., East District, Chiayi City" },
      { zh: "服務時間：週一至週五 08:00–17:00", en: "Service hours: Mon–Fri 08:00–17:00" },
      { zh: "電話：(05) 216-6100", en: "Phone: (05) 216-6100" },
      { zh: "可搭計程車從學校出發（約 20 分鐘），或依 Google Maps 指示：https://reurl.cc/M2M8GW", en: "Take a taxi from CCU (approx. 20 min) or follow Google Maps: https://reurl.cc/M2M8GW" }
    ],
    source_url: "https://oia.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_nhi",
    task_name_zh: "申請全民健保（NHI）",
    task_name_en: "Apply for National Health Insurance (NHI)",
    scenario_zh: "你需要辦理台灣全民健保，以便在台就醫。",
    scenario_en: "You need to enroll in Taiwan's National Health Insurance for medical care.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support", "health"],
    required_documents: [
      { zh: "居留證（ARC）", en: "ARC" },
      { zh: "護照", en: "Passport" },
      { zh: "在學證明", en: "Enrollment certificate" }
    ],
    navigation_tip_zh: "行政大樓 1F｜國際處｜ARC 辦好後即可申請",
    navigation_tip_en: "Administration Building, 1F｜OIA｜Apply after receiving your ARC",
    steps: [
      { zh: "先完成 ARC 辦理", en: "Complete your ARC application first" },
      { zh: "至國際處詢問健保申請流程（學校會統一協助辦理）", en: "Visit OIA to inquire about NHI enrollment (the school assists with group enrollment)" },
      { zh: "健保卡申辦完成後，持卡至健保特約診所就醫", en: "Once your NHI card is ready, use it at NHI-contracted clinics" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-1596.php?Lang=en",
    needs_manual_review: true
  },
  {
    id: "task_dorm_fee",
    task_name_zh: "繳交宿舍費用",
    task_name_en: "Pay Dormitory Fees",
    scenario_zh: "你需要繳交宿舍費、住宿押金與電費。",
    scenario_en: "You need to pay dormitory fees, residence deposit, and electricity fee.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["dormitory", "international_support"],
    required_documents: [
      { zh: "繳費單（至國際處領取）", en: "Payment sheet (collect from OIA)" },
      { zh: "現金或付款工具", en: "Cash or payment method" }
    ],
    navigation_tip_zh: "行政大樓 1F 國際處領取繳費單｜可至便利商店、郵局或行政大樓地下室 ATM 繳費",
    navigation_tip_en: "Get payment sheet from OIA (Admin Building 1F)｜Pay at convenience stores, post office, or ATM in Admin Building basement",
    steps: [
      { zh: "至國際處（行政大樓一樓）領取繳費單", en: "Go to OIA (Administration Building 1F) to collect the payment sheet" },
      { zh: "在期限前繳費：可至便利商店、郵局或行政大樓地下室 ATM", en: "Pay before the deadline: convenience stores, post office, or ATM in Administration Building basement" },
      { zh: "若金額超過 NT$50,000，需至銀行繳納", en: "If the amount exceeds NT$50,000, payment must be made at a bank" },
      { zh: "住校外者，費用直接繳給房東", en: "For off-campus housing, pay fees directly to the landlord" }
    ],
    source_url: "https://oia.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_checkin",
    task_name_zh: "辦理入學報到手續",
    task_name_en: "Complete Enrollment / Check-in Procedures",
    scenario_zh: "你剛到學校，需要完成入學報到的全部流程。",
    scenario_en: "You just arrived at CCU and need to complete all enrollment check-in procedures.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support", "registration"],
    required_documents: [
      { zh: "護照", en: "Passport" },
      { zh: "入學許可函", en: "Admission letter" },
      { zh: "學費繳費證明（若已繳費）", en: "Tuition payment receipt (if already paid)" }
    ],
    navigation_tip_zh: "行政大樓 1F 國際處 → 東棟 1F 教務處，依序辦理",
    navigation_tip_en: "Administration Building 1F OIA → East Wing 1F Registration Division",
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
    id: "task_airport_to_ccu",
    task_name_zh: "從機場到中正大學",
    task_name_en: "Get from the Airport to CCU",
    scenario_zh: "你剛抵達桃園或高雄機場，需要前往中正大學。",
    scenario_en: "You just arrived at Taoyuan or Kaohsiung Airport and need to get to CCU.",
    target_unit_type: "office",
    target_unit_id: "oia",
    recommended_service_categories: ["international_support"],
    required_documents: [],
    navigation_tip_zh: "可提前聯繫國際處詢問接機服務：oia@ccu.edu.tw",
    navigation_tip_en: "Contact OIA in advance for airport pickup: oia@ccu.edu.tw",
    steps: [
      { zh: "提前聯繫國際處告知抵達時間（oia@ccu.edu.tw）", en: "Contact OIA in advance with your arrival time (oia@ccu.edu.tw)" },
      { zh: "桃園機場：高鐵到嘉義站（約 1.5hr）→ 計程車到中正大學（約 20 分鐘）", en: "From Taoyuan Airport: THSR to Chiayi Station (approx. 1.5 hrs) → Taxi to CCU (approx. 20 min)" },
      { zh: "若計程車司機不懂英文：可先在手機上以中文寫「嘉義縣民雄鄉大學路一段168號 國立中正大學」給司機看", en: "If the taxi driver doesn't speak English: show them on your phone: '嘉義縣民雄鄉大學路一段168號 國立中正大學'" },
      { zh: "或搭客運：國光客運至嘉義，再轉乘計程車", en: "Or take intercity bus to Chiayi, then taxi to CCU" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/406-1008-67682,r1716.php?Lang=en",
    needs_manual_review: true
  },

  // ── 宿舍相關 ──────────────────────────────────────────────
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
    navigation_tip_zh: "學士宿舍 C 棟 1F｜住宿服務中心",
    navigation_tip_en: "Undergrad Dorm Block C, 1F｜Housing Service Center",
    steps: [
      { zh: "登入 CCU Portal，點選「宿舍申請」", en: "Log in to CCU Portal and click 'Dormitory Application'" },
      { zh: "填寫志願序並送出申請", en: "Fill in preferences and submit the application" },
      { zh: "等待分配通知（約 2 週）", en: "Wait for room assignment notice (approx. 2 weeks)" },
      { zh: "依通知繳費，攜帶護照至住宿服務組辦理入住", en: "Pay the fee as instructed, then bring your passport to check in at the Housing Service Division" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_dorm_checkin",
    task_name_zh: "住宿報到程序",
    task_name_en: "Dormitory Check-in Procedure",
    scenario_zh: "你已分配到宿舍，需要了解報到入住的流程。",
    scenario_en: "You have been assigned a dormitory room and need to complete the check-in procedure.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    required_documents: [
      { zh: "護照或居留證", en: "Passport or ARC" },
      { zh: "繳費收據", en: "Payment receipt" },
      { zh: "分配通知單", en: "Room assignment notice" }
    ],
    navigation_tip_zh: "學士宿舍 C 棟 1F｜或研究生宿舍 B 棟",
    navigation_tip_en: "Undergrad Dorm Block C, 1F｜or Graduate Dorm Block B",
    steps: [
      { zh: "攜帶護照/居留證與繳費收據至住宿服務組辦理報到", en: "Bring your passport/ARC and payment receipt to the Housing Service Division to check in" },
      { zh: "領取房間鑰匙與宿舍規定說明", en: "Receive your room key and dormitory regulations" },
      { zh: "確認宿舍設備是否完好，有問題立即回報", en: "Check that all dormitory equipment is working; report any issues immediately" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_dorm_parcel",
    task_name_zh: "宿舍包裹服務",
    task_name_en: "Dormitory Parcel / Package Service",
    scenario_zh: "你收到包裹，或需要委託宿舍服務中心代收包裹。",
    scenario_en: "You received a parcel or need to arrange proxy collection at the dormitory service center.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    required_documents: [
      { zh: "學生證（領取時出示）", en: "Student ID (show when collecting)" }
    ],
    navigation_tip_zh: "學士宿舍 C 棟 1F 櫃台 / 研究生宿舍 B 棟",
    navigation_tip_en: "Undergrad Dorm Block C, 1F counter / Graduate Dorm Block B",
    steps: [
      { zh: "寄件地址（學士班）：嘉義縣民雄鄉三興村 161/162/163/164/165 號，學士班宿舍 A/B/C/D/E 棟（房號）室（姓名）收", en: "Delivery address (undergrad): No.161–165, Sanxing Village, Minxiong, Chiayi. Undergraduate Dorm Block A/B/C/D/E, Room [no.], [Name]" },
      { zh: "寄件地址（研究生）：嘉義縣民雄鄉大學路 168 號，研究生宿舍碩士/博士（房號）室（姓名）收", en: "Delivery address (graduate): No.168, University Rd., Minxiong, Chiayi. Graduate Dorm, Master's/PhD, Room [no.], [Name]" },
      { zh: "若無法親自收件，至宿舍服務中心填寫「代收委託單」（恕不代收冷凍、冷藏及須付費物品）", en: "If unable to receive in person, fill out a proxy collection form at the Housing Service Center (frozen/chilled items and paid deliveries excluded)" },
      { zh: "持學生證至服務中心領取包裹", en: "Show your student ID at the service center to collect your parcel" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_dorm_maintenance",
    task_name_zh: "宿舍設備報修",
    task_name_en: "Submit a Dormitory Maintenance Request",
    scenario_zh: "你的宿舍設備壞了（包含洗衣機故障），需要申請維修。",
    scenario_en: "Your dormitory equipment is broken (including washing machine malfunction) and you need to request a repair.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    required_documents: [],
    navigation_tip_zh: "學士宿舍 C 棟 1F 或 CCU Portal 線上申請",
    navigation_tip_en: "Dorm Block C, 1F or apply online via CCU Portal",
    steps: [
      { zh: "透過 CCU Portal 或至住宿服務組填寫報修單", en: "Submit a maintenance request through CCU Portal or in person at the Housing Service Division" },
      { zh: "說明損壞設備與地點（棟別、房號）", en: "Describe the broken equipment and location (building name, room number)" },
      { zh: "等待工務人員來訪修繕", en: "Wait for maintenance staff to visit and repair" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_dorm_select_room",
    task_name_zh: "選擇下學年宿舍寢室",
    task_name_en: "Select Your Dormitory Room for Next Year",
    scenario_zh: "你想了解如何選擇下學年的宿舍房間。",
    scenario_en: "You want to know how to select your dormitory room for the next academic year.",
    target_unit_type: "office",
    target_unit_id: "osa_dorm",
    recommended_service_categories: ["dormitory"],
    required_documents: [],
    navigation_tip_zh: "學士宿舍 C 棟 1F 住宿服務組，或 CCU Portal 線上申請",
    navigation_tip_en: "Housing Service Division, Dorm Block C 1F, or CCU Portal online",
    steps: [
      { zh: "依學校公告的宿舍選宿時間，登入 CCU Portal 進行選宿", en: "During the announced room selection period, log in to CCU Portal to select your room" },
      { zh: "按照指示選擇棟別、樓層與房號", en: "Follow the instructions to select building, floor, and room number" },
      { zh: "若有問題，至住宿服務組詢問", en: "If you have questions, visit the Housing Service Division" }
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
      { zh: "若遇問題，至資訊處詢問或致電技術支援", en: "If you encounter issues, visit the IT Office or call technical support" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ── 課程與學術 ─────────────────────────────────────────────
  {
    id: "task_sso",
    task_name_zh: "使用 SSO 單一入口登入",
    task_name_en: "Log in with SSO (Single Sign-On)",
    scenario_zh: "你需要登入學校系統（選課、成績、email 等），或不知道預設密碼。",
    scenario_en: "You need to log in to school systems (course selection, grades, email) or don't know the default password.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support", "academic_affairs"],
    required_documents: [
      { zh: "學號（入學後由學校提供）", en: "Student ID number (provided after enrollment)" },
      { zh: "初始密碼（入學通知信件內）", en: "Initial password (in enrollment notification email)" }
    ],
    navigation_tip_zh: "portal.ccu.edu.tw｜帳號問題請至圖書資訊大樓資訊處",
    navigation_tip_en: "portal.ccu.edu.tw｜Account issues: visit IT Office in Information and Library Building",
    steps: [
      { zh: "前往 https://portal.ccu.edu.tw", en: "Go to https://portal.ccu.edu.tw" },
      { zh: "使用學號與初始密碼登入，首次登入需修改密碼", en: "Log in with your student ID and initial password; change your password on first login" },
      { zh: "登入後可存取選課系統、成績查詢、eCourse2、Email 等", en: "After login, access course selection, grades, eCourse2, email, and more" },
      { zh: "忘記密碼或帳號問題：至資訊處（圖書資訊大樓）處理", en: "Forgot password or account issues: visit the IT Office (Information and Library Building)" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_ecourse",
    task_name_zh: "使用 eCourse2 線上學習平台",
    task_name_en: "Use eCourse2 Learning Platform",
    scenario_zh: "你需要查看課程資料、繳交作業，或交換生剛開學時沒有 eCourse 帳號。",
    scenario_en: "You need to access course materials, submit assignments, or you're an exchange student without an eCourse account at the start of semester.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "ecourse2.ccu.edu.tw｜使用 SSO 帳號登入",
    navigation_tip_en: "ecourse2.ccu.edu.tw｜Log in with SSO account",
    steps: [
      { zh: "前往 https://ecourse2.ccu.edu.tw", en: "Go to https://ecourse2.ccu.edu.tw" },
      { zh: "使用 SSO 帳號（學號 + 密碼）登入", en: "Log in with your SSO account (student ID + password)" },
      { zh: "交換生若開學時無帳號，請至資訊處申請或聯繫課程教師", en: "Exchange students without an account at semester start: contact the IT Office or course instructor" },
      { zh: "課程加入：等老師開放，或輸入選課碼加入", en: "Join courses: wait for the instructor to open enrollment, or enter the course code" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_course_selection",
    task_name_zh: "使用選課系統選課",
    task_name_en: "Register for Courses via the Course Selection System",
    scenario_zh: "你需要完成每學期的課程選課，或交換生需在開學時才能選課。",
    scenario_en: "You need to complete course registration each semester, or you're an exchange student who can only select courses at the start of semester.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "行政大樓東棟 2F｜課務組（系統問題請洽資訊處）",
    navigation_tip_en: "East Wing, Administration Building 2F｜Curriculum Division (system issues: contact IT Office)",
    steps: [
      { zh: "登入 SSO 後，進入選課系統（學期開始前 2 週開放）", en: "Log in to SSO, then access the course selection system (opens 2 weeks before the semester)" },
      { zh: "交換生注意：通常在開學後才開放選課，請先與國際處確認", en: "Exchange students note: course selection usually opens after semester starts; confirm with OIA first" },
      { zh: "瀏覽課表並加選課程（注意必修、選修分類）", en: "Browse the course schedule and add courses (note required vs. elective categories)" },
      { zh: "系統主要為中文，如有困難請聯繫國際處協助", en: "System is mainly in Chinese; contact OIA if you need assistance" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_add_drop",
    task_name_zh: "加退選課程",
    task_name_en: "Add or Drop a Course",
    scenario_zh: "你想加選某門課，或想退掉已選的課，或必修課人數已滿需要加簽。",
    scenario_en: "You want to add or drop a course, or need to get instructor approval to join a full required course.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues"],
    required_documents: [
      { zh: "加選需要老師同意者：老師簽名的加選單", en: "For courses requiring instructor approval: add-course form signed by the instructor" }
    ],
    navigation_tip_zh: "行政大樓東棟 2F｜課務組，或透過選課系統操作",
    navigation_tip_en: "East Wing, Administration Building 2F｜Curriculum Division, or via the course selection system",
    steps: [
      { zh: "加退選期間（約學期開始後第 1–2 週）登入選課系統操作", en: "During the add/drop period (approx. 1st–2nd week of semester), make changes in the course selection system" },
      { zh: "必修課已滿（加簽）：直接聯繫授課教授，說明情況並請求同意", en: "For full required courses (overload): contact the instructor directly, explain your situation, and request approval" },
      { zh: "教授同意後：填寫加選申請單至課務組辦理", en: "After instructor approval: fill out the add-course form and submit to the Curriculum Division" },
      { zh: "已選課程但教授不收國際生：請立即聯繫系辦或國際處協助處理", en: "If enrolled but instructor doesn't accept international students: contact your department office or OIA immediately" }
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
      { zh: "抵免申請表（向系辦或教務處取得）", en: "Credit transfer form (from department office or Academic Affairs)" }
    ],
    navigation_tip_zh: "先至系辦，再送行政大樓東棟 1F 教務處審核",
    navigation_tip_en: "Start at your department office, then submit to Registration Division (East Wing 1F)",
    steps: [
      { zh: "向系辦取得抵免申請表", en: "Get the credit transfer form from your department office" },
      { zh: "備妥原校英文成績單與課程大綱", en: "Prepare your English transcript and course syllabi from your previous school" },
      { zh: "至系辦提交申請，由系上審查", en: "Submit the application to your department office for review" },
      { zh: "系所審查後送交教務處核定，約 2–4 週公告結果", en: "After departmental review, sent to Academic Affairs for final approval (results in 2–4 weeks)" }
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
    navigation_tip_zh: "行政大樓東棟 2F｜課務組，學期中段前申請",
    navigation_tip_en: "East Wing, Administration Building 2F｜Curriculum Division, before mid-semester",
    steps: [
      { zh: "至教務處課務組取得撤選申請表", en: "Get the course withdrawal form from the Curriculum Division" },
      { zh: "填妥後請導師或系主任簽名（視規定）", en: "Complete the form and obtain required signatures (advisor or department head)" },
      { zh: "在規定期限內送回課務組", en: "Submit the form to the Curriculum Division before the deadline" },
      { zh: "撤選後成績單不會出現此課程", en: "After withdrawal, this course will not appear on your transcript" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_dept_transfer",
    task_name_zh: "申請轉系",
    task_name_en: "Apply for Department Transfer",
    scenario_zh: "你想申請轉至其他系所就讀。",
    scenario_en: "You want to apply to transfer to another department.",
    target_unit_type: "office",
    target_unit_id: "oaa",
    recommended_service_categories: ["academic_affairs", "registration"],
    required_documents: [
      { zh: "歷年成績單（含班級排名）", en: "Transcript with class ranking" },
      { zh: "轉系理由書（各系要求不同）", en: "Transfer motivation statement (requirements vary by department)" },
      { zh: "未來修課規劃（部分學系要求）", en: "Future study plan (required by some departments)" },
      { zh: "其他有利審查資料（如英文能力證明等）", en: "Other supporting materials (e.g., English proficiency certificate)" }
    ],
    navigation_tip_zh: "先至目標系所確認轉系標準，再至教務處辦理",
    navigation_tip_en: "First confirm transfer standards with target department, then apply at Academic Affairs",
    steps: [
      { zh: "查詢目標學系的轉系審查標準（教務處網站：https://oaa.ccu.edu.tw/p/404-1004-6159.php）", en: "Check the target department's transfer criteria (Academic Affairs website: https://oaa.ccu.edu.tw/p/404-1004-6159.php)" },
      { zh: "確認是否符合成績與先修科目要求（各系不同）", en: "Confirm you meet GPA and prerequisite requirements (varies by department)" },
      { zh: "依各系規定備妥申請資料（轉系理由書、成績單等）", en: "Prepare required materials as specified by the target department" },
      { zh: "依規定時間提交申請，並參加書面審查及口試（視系規定）", en: "Submit application during the designated period; participate in written and oral review (as required)" },
      { zh: "注意：轉系後均須轉入二年級就讀，名額有限", en: "Note: All transfer students enter as second-year students; spaces are limited" }
    ],
    source_url: "https://oaa.ccu.edu.tw/p/404-1004-6159.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "task_course_syllabus",
    task_name_zh: "查詢課程大綱",
    task_name_en: "Find Course Syllabus",
    scenario_zh: "你需要找到某門課程的課綱，以了解課程內容或申請學分抵免。",
    scenario_en: "You need to find a course syllabus to understand the course content or apply for credit transfer.",
    target_unit_type: "office",
    target_unit_id: "oaa_curriculum",
    recommended_service_categories: ["course_issues", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "透過 CCU Portal 或課程系統查詢",
    navigation_tip_en: "Check via CCU Portal or the course system",
    steps: [
      { zh: "登入 CCU Portal，進入選課系統查看課程大綱", en: "Log in to CCU Portal and access the course selection system to view syllabi" },
      { zh: "若系統上找不到，直接聯繫授課教授詢問", en: "If not found on the system, contact the instructor directly" },
      { zh: "也可至課務組詢問如何取得歷年課程大綱", en: "You can also ask the Curriculum Division how to obtain syllabi from previous years" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_email_professor",
    task_name_zh: "如何寫電子郵件給教授",
    task_name_en: "How to Email a Professor",
    scenario_zh: "你需要聯繫教授，但不確定正確的寫法或禮儀。",
    scenario_en: "You need to contact a professor but are unsure about the proper format or etiquette.",
    target_unit_type: "office",
    target_unit_id: "oaa",
    recommended_service_categories: ["course_issues", "academic_affairs"],
    required_documents: [],
    navigation_tip_zh: "透過 CCU Email 系統（portal.ccu.edu.tw）發送",
    navigation_tip_en: "Send via CCU Email system (portal.ccu.edu.tw)",
    steps: [
      { zh: "稱謂：使用「Dear Prof. [姓] / Professor [姓]」，不建議使用名字或「Hi」", en: "Salutation: Use 'Dear Prof. [Last Name]' or 'Professor [Last Name]'; avoid first names or 'Hi'" },
      { zh: "自我介紹：說明你的姓名、學號、課程名稱（如適用）", en: "Introduce yourself: state your name, student ID, and course name (if applicable)" },
      { zh: "簡潔說明問題或請求，語氣禮貌正式", en: "Clearly and concisely describe your question or request in a polite, formal tone" },
      { zh: "結尾：使用「Best regards / Sincerely, [你的名字]」", en: "Closing: Use 'Best regards / Sincerely, [Your Name]'" },
      { zh: "如需要請假，需說明請假日期、原因及補課計畫", en: "For absence requests: state the date, reason, and your plan for making up the missed work" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_software",
    task_name_zh: "下載校園授權軟體",
    task_name_en: "Download Campus Licensed Software",
    scenario_zh: "你想下載學校授權的 Office、防毒軟體或其他正版軟體。",
    scenario_en: "You want to download officially licensed software such as Office, antivirus, or other programs.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support"],
    required_documents: [],
    navigation_tip_zh: "software.ccu.edu.tw｜使用 SSO 帳號登入",
    navigation_tip_en: "software.ccu.edu.tw｜Log in with SSO account",
    steps: [
      { zh: "連接校內網路（若在校外可使用 VPN，參考：https://it.ccu.edu.tw/p/426100930.php）", en: "Connect to campus network (off-campus: use VPN, reference: https://it.ccu.edu.tw/p/426100930.php)" },
      { zh: "前往 https://software.ccu.edu.tw/ 並以 SSO 帳號登入", en: "Go to https://software.ccu.edu.tw/ and log in with SSO" },
      { zh: "選擇需要的軟體類別：Office、OS、統計、MATLAB、防毒等", en: "Select the software category: Office, OS, Statistics, MATLAB, AntiVirus, etc." },
      { zh: "點擊下載連結，依指示安裝並認證軟體", en: "Click the download link, install, and activate the software as instructed" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: false
  },

  // ── 行政手續 ──────────────────────────────────────────────
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
      { zh: "補辦費用（金額請至窗口確認）", en: "Replacement fee (confirm amount at the counter)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜教務處註冊組",
    navigation_tip_en: "East Wing, Administration Building 1F｜Registration Division",
    steps: [
      { zh: "前往行政大樓東棟一樓教務處註冊組", en: "Go to the Registration Division on the 1st floor of the East Wing, Administration Building" },
      { zh: "告知工作人員需補辦學生證並提供身分證件", en: "Inform the staff you need a replacement student ID and provide your ID document" },
      { zh: "繳交補辦費用", en: "Pay the replacement fee" },
      { zh: "等待製作（工作人員會告知取件日）", en: "Wait for the card to be made (staff will inform you of the pickup date)" }
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
      { zh: "說明需要中文版或英文版成績單，以及份數", en: "Specify Chinese or English transcripts and how many copies you need" },
      { zh: "繳交工本費，當場或隔日取件", en: "Pay the fee and pick up on the spot or the next day" }
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
      { zh: "休學申請表（向教務處或系辦索取）", en: "Leave of absence form (from Academic Affairs or department office)" },
      { zh: "醫療證明（健康因素者）", en: "Medical certificate (for health-related reasons)" },
      { zh: "指導教授或系主任同意書（視規定）", en: "Advisor or department head approval (as required)" }
    ],
    navigation_tip_zh: "行政大樓東棟 1F｜教務處註冊組，注意申請期限",
    navigation_tip_en: "East Wing, Administration Building 1F｜Registration Division, note the deadline",
    steps: [
      { zh: "至教務處或系辦取得休學申請表", en: "Get the leave of absence form from Academic Affairs or your department office" },
      { zh: "填妥後取得必要簽名（視規定）", en: "Complete the form and obtain required signatures" },
      { zh: "送至教務處註冊組辦理，注意申請期限", en: "Submit to the Registration Division; note the application deadline" },
      { zh: "國際生注意：休學期間居留證效力請洽國際處確認", en: "International students: confirm the impact on your ARC/visa status during leave (contact OIA)" }
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
    recommended_service_categories: ["international_support", "student_affairs", "tuition"],
    required_documents: [
      { zh: "成績單（視獎學金要求）", en: "Transcript (depending on scholarship requirements)" },
      { zh: "推薦函（部分獎學金需要）", en: "Recommendation letter (required for some scholarships)" },
      { zh: "護照或居留證影本", en: "Copy of passport or ARC" }
    ],
    navigation_tip_zh: "行政大樓 1F 國際處（國際生獎學金）/ 西棟 2F 生活事務組（助學金）",
    navigation_tip_en: "Administration Building 1F OIA (international scholarships) / West Wing 2F Student Life Office (financial aid)",
    steps: [
      { zh: "至國際處或學務處網站查看目前開放的獎學金項目", en: "Check OIA or Student Affairs websites for currently available scholarships" },
      { zh: "確認申請資格與截止日期", en: "Confirm eligibility requirements and application deadlines" },
      { zh: "備妥所需文件並於期限內提交", en: "Prepare required documents and submit before the deadline" }
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
      { zh: "繳費通知單（Portal 或 Email）", en: "Payment notice (from Portal or email)" }
    ],
    navigation_tip_zh: "行政大樓西棟 1F｜出納組，或 ATM / 便利商店繳款",
    navigation_tip_en: "West Wing, Administration Building 1F｜Cashier, or ATM / convenience store",
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
    navigation_tip_en: "Administration Building 1F｜OIA｜Must have permit before starting work",
    steps: [
      { zh: "至國際處取得工作許可申請資料", en: "Go to OIA for work permit application materials" },
      { zh: "填妥申請表，備齊護照、ARC、在學證明", en: "Complete the application form and prepare passport, ARC, and enrollment certificate" },
      { zh: "申請核准後方可打工（每週不超過規定時數）", en: "After approval, you may work within the permitted scope (not exceeding the regulated weekly hours)" },
      { zh: "每學期需更新申請", en: "The permit must be renewed each semester" }
    ],
    source_url: "https://oia.ccu.edu.tw/p/412-1008-3371.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "task_register_ccu_email",
    task_name_zh: "申請 / 設定 CCU 電子信箱",
    task_name_en: "Register / Set Up CCU Email Account",
    scenario_zh: "你需要申請或設定中正大學的 email 帳號（@gm.ccu.edu.tw）。",
    scenario_en: "You need to register or set up your CCU email account (@gm.ccu.edu.tw).",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support"],
    required_documents: [
      { zh: "學號與 SSO 密碼", en: "Student ID and SSO password" }
    ],
    navigation_tip_zh: "透過 SSO Portal 設定｜問題請至圖書資訊大樓資訊處",
    navigation_tip_en: "Set up via SSO Portal｜Issues: visit IT Office in Information and Library Building",
    steps: [
      { zh: "登入 CCU Portal（https://portal.ccu.edu.tw）", en: "Log in to CCU Portal (https://portal.ccu.edu.tw)" },
      { zh: "找到「Web Mail / 電子信箱」圖示並點擊設定", en: "Find the 'Web Mail' icon and click to set up" },
      { zh: "你的 CCU email 格式為：學號@gm.ccu.edu.tw", en: "Your CCU email format is: studentID@gm.ccu.edu.tw" },
      { zh: "設定後可選擇轉寄至個人信箱，方便接收通知", en: "After setup, you can forward to your personal email for easy notification management" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },

  // ── 校園服務 ──────────────────────────────────────────────
  {
    id: "task_oia",
    task_name_zh: "前往國際處",
    task_name_en: "Go to the Office of International Affairs (OIA)",
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
    navigation_tip_zh: "各學院大樓不同，請在地圖頁搜尋你的系所",
    navigation_tip_en: "Location varies by college — search your department on the Map page",
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
      { zh: "線上入口：https://portal.ccu.edu.tw/sso_index.php → 選擇「My圖書館 / 圖書館資源探索 / 自學空間」", en: "Online portal: https://portal.ccu.edu.tw/sso_index.php → Select 'Library / AlmaPrimo / Self-Study'" },
      { zh: "臨櫃服務：持學生證感應入館，服務台在一樓", en: "In person: tap your student ID to enter; service desk is at the 1st floor entrance" },
      { zh: "討論室預約：至服務台或透過圖書館網站預約", en: "Discussion room reservation: at the service desk or through the library website" }
    ],
    source_url: "https://lib.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_print",
    task_name_zh: "在哪裡可以列印東西",
    task_name_en: "Where to Print Documents",
    scenario_zh: "你需要在校內或附近找地方列印文件。",
    scenario_en: "You need to find a place on or near campus to print documents.",
    target_unit_type: "office",
    target_unit_id: "library",
    recommended_service_categories: ["library", "it_support"],
    required_documents: [],
    navigation_tip_zh: "圖書館 1F（借影印卡）/ 電算中心（圖書館大門左側）/ 全家便利商店",
    navigation_tip_en: "Library 1F (borrow copy card) / IT Office (left of library entrance) / FamilyMart",
    steps: [
      { zh: "圖書館：至服務台押學生證借影印卡 → 印文件 → 還卡，可用現金或悠遊卡付費", en: "Library: Leave your student ID as deposit to borrow a copy card → print → return card; pay with cash or EasyCard" },
      { zh: "電算中心（圖書館大門左側）：可直接使用列印設備", en: "IT Office (left of the Library main entrance): printers available for direct use" },
      { zh: "全家便利商店（校內活中全家）：使用雲端列印服務（https://nevent.family.com.tw/cloudprintSTORELIST/）", en: "FamilyMart (Activity Center branch): use cloud print service (https://nevent.family.com.tw/cloudprintSTORELIST/)" },
      { zh: "校外影印店：鴻昇數位輸出影印中心（嘉義縣民雄鄉神農路143號）", en: "Off-campus copy shop: Hongsheng Digital Output Center (No.143, Shennong Rd., Minxiong, Chiayi)" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },
  {
    id: "task_health",
    task_name_zh: "前往衛生保健組 / 就醫",
    task_name_en: "Visit the Health Center / See a Doctor",
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
      { zh: "前往活動中心二樓衛生保健組（輕微症狀）", en: "For minor symptoms: visit the Health Services Division on the 2nd floor of the Activity Center" },
      { zh: "若需進一步診療：衛生保健組可協助轉介至特約醫院", en: "For further treatment: the Health Services Division can refer you to a partner hospital" },
      { zh: "就醫時攜帶健保卡（掛號費約 NT$150–300）", en: "Bring your NHI card to the clinic (registration fee approx. NT$150–300)" },
      { zh: "緊急情況：撥打 119 或聯繫 24 小時校安中心：05-2720411 ext.19110", en: "Emergencies: call 119 or contact the 24-hour Campus Safety Center: 05-2720411 ext.19110" }
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
    navigation_tip_en: "Activity Center, 3F｜English counseling available, fully confidential, free",
    steps: [
      { zh: "前往活動中心三樓諮商中心", en: "Go to the Counseling Center on the 3rd floor of the Activity Center" },
      { zh: "向接待人員預約或直接進行初次諮詢", en: "Make an appointment or walk in for an initial consultation" },
      { zh: "所有諮商內容嚴格保密，可放心尋求協助", en: "All counseling sessions are strictly confidential — please feel free to seek help" }
    ],
    source_url: "https://advising.ccu.edu.tw/",
    needs_manual_review: false
  },
  {
    id: "task_registration",
    task_name_zh: "辦理各學期註冊",
    task_name_en: "Complete Semester Registration",
    scenario_zh: "每學期開始時需要完成正式註冊手續（繳費＋線上報到）。",
    scenario_en: "At the start of each semester, complete formal registration (payment + online check-in).",
    target_unit_type: "office",
    target_unit_id: "oaa_reg",
    recommended_service_categories: ["registration", "tuition"],
    required_documents: [
      { zh: "學費繳費通知單（Portal 或 Email 通知）", en: "Tuition payment notice (via Portal or email)" }
    ],
    navigation_tip_zh: "線上完成 Portal 報到，繳費至西棟 1F 出納組或網路繳款",
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
    id: "task_it",
    task_name_zh: "處理帳號或網路問題",
    task_name_en: "Handle Account or Network Issues",
    scenario_zh: "你的學校帳號無法登入、選課密碼顯示錯誤，或校園網路、eCourse2 出現問題。",
    scenario_en: "Your school account login fails, course selection password shows an error, or you have network or eCourse2 issues.",
    target_unit_type: "office",
    target_unit_id: "it_office",
    recommended_service_categories: ["it_support"],
    required_documents: [
      { zh: "學生證（身份驗證用）", en: "Student ID (for identity verification)" }
    ],
    navigation_tip_zh: "圖書資訊大樓｜資訊處（圖書館大門左側）",
    navigation_tip_en: "Information and Library Building｜IT Office (left of library entrance)",
    steps: [
      { zh: "確認帳號與密碼是否正確（學號 + 密碼）", en: "Confirm your account and password are correct (student ID + password)" },
      { zh: "若選課密碼錯誤：可能因帳號設定問題，請至資訊處協助重設", en: "If course selection password shows an error: likely an account issue; visit IT Office to reset" },
      { zh: "至圖書資訊大樓資訊處，攜帶學生證向工作人員說明問題", en: "Visit the IT Office in the Information and Library Building with your student ID and explain the issue" },
      { zh: "緊急問題也可 email：it@ccu.edu.tw", en: "For urgent issues, email: it@ccu.edu.tw" }
    ],
    source_url: "https://it.ccu.edu.tw/",
    needs_manual_review: true
  },
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
      { zh: "至衛生保健組取得理賠申請表", en: "Get the insurance claim form from the Health Services Division" },
      { zh: "填妥後附上所有文件送件審查", en: "Complete the form and submit with all documents for review" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
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
    navigation_tip_zh: "活動中心 2F｜課外活動組，社博會時可直接報名",
    navigation_tip_en: "Activity Center, 2F｜Extra-Curricular Division, or sign up at the Club Expo",
    steps: [
      { zh: "注意每學期初（通常第 1–2 週）舉辦的社團博覽會，現場報名", en: "Look out for the Club Expo held at the start of each semester (usually weeks 1–2) to sign up in person" },
      { zh: "查詢社團資訊：至課外活動組詢問或查看學校公佈欄", en: "Find club information: ask at the Extra-Curricular Division or check bulletin boards" },
      { zh: "也可透過社團社群媒體（Instagram / LINE）聯繫幹部加入", en: "You can also contact club officers through their social media (Instagram/LINE) to join" }
    ],
    source_url: "https://studaffairs.ccu.edu.tw/",
    needs_manual_review: true
  },
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
      { zh: "歷年成績單（系辦或教務處取得）", en: "Transcript of all academic years" }
    ],
    navigation_tip_zh: "先至系辦確認，再至行政大樓東棟 1F 教務處",
    navigation_tip_en: "Confirm with department office first, then East Wing 1F Registration Division",
    steps: [
      { zh: "至系辦確認畢業必修學分是否修畢", en: "Go to your department office to confirm all required graduation credits are completed" },
      { zh: "在 CCU Portal 查看畢業審查狀態", en: "Check your graduation review status on CCU Portal" },
      { zh: "辦理離校手續：歸還圖書館借書、清繳相關費用", en: "Complete school-leaving procedures: return library books, clear outstanding fees" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  }
];

// ============================================================
// Search Engine (unchanged from original)
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
