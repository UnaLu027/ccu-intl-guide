/**
 * CCU International Student Friendly Campus Guide — Data Layer
 * Design: Wayfinding Signage System
 * All data sourced from official CCU websites.
 */

// ============================================================
// Service Categories
// ============================================================
export interface ServiceCategory {
  id: string;
  name_en: string;
  name_zh: string;
  icon: string; // lucide icon name
  description_en: string;
  description_zh: string;
  keywords: string[]; // for search matching
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
}

export const offices: Office[] = [
  {
    id: "oia",
    name_zh: "國際事務處",
    name_en: "Office of International Affairs (OIA)",
    category: "Administrative",
    service_categories: ["international_support", "registration", "student_affairs"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓一樓",
    indoor_location_note_en: "1st floor of the Administration Building",
    function_desc_zh: "負責國際學生入學、簽證居留、獎學金、交換計畫、國際活動與生活輔導等事務。",
    function_desc_en: "Handles international student admissions, visa/ARC, scholarships, exchange programs, international events, and life support.",
    service_scope_zh: "入學諮詢、簽證與居留證辦理、獎學金申請、國際交流活動、外籍生生活輔導。",
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
    source_url: "https://oia.ccu.edu.tw/p/404-1008-51159.php?Lang=en",
    needs_manual_review: false
  },
  {
    id: "oaa",
    name_zh: "教務處",
    name_en: "Office of Academic Affairs",
    category: "Administrative",
    service_categories: ["academic_affairs", "registration", "course_issues"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓二樓",
    indoor_location_note_en: "2nd floor of the Administration Building",
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
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "oaa_reg",
    name_zh: "教務處註冊組",
    name_en: "Division of Registration, Office of Academic Affairs",
    category: "Administrative",
    service_categories: ["registration", "student_id", "academic_affairs", "tuition"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓一樓",
    indoor_location_note_en: "1st floor of the Administration Building",
    function_desc_zh: "處理學生註冊、學籍異動、成績單核發、學生證補發、休退學等事務。",
    function_desc_en: "Handles student registration, enrollment changes, transcript issuance, student ID replacement, leave of absence, and withdrawal.",
    service_scope_zh: "註冊手續、成績單申請、學生證補發、休學與退學辦理、學籍證明。",
    service_scope_en: "Registration procedures, Transcript application, Student ID replacement, Leave of absence & withdrawal, Enrollment certificates.",
    common_scenarios_zh: "補辦學生證、申請成績單、辦理休學、註冊問題。",
    common_scenarios_en: "Replace student ID, Apply for transcript, Process leave of absence, Registration issues.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411 ext. 16102",
    email: "",
    official_url: "https://oaa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://oaa.ccu.edu.tw/p/404-1004-13362.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "oaa_curriculum",
    name_zh: "教務處課務組",
    name_en: "Division of Curriculum, Office of Academic Affairs",
    category: "Administrative",
    service_categories: ["course_issues", "academic_affairs"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "2F",
    indoor_location_note_zh: "行政大樓二樓",
    indoor_location_note_en: "2nd floor of the Administration Building",
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
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "osa",
    name_zh: "學生事務處",
    name_en: "Office of Student Affairs",
    category: "Administrative",
    service_categories: ["student_affairs", "dormitory", "health"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "3F",
    indoor_location_note_zh: "行政大樓三樓",
    indoor_location_note_en: "3rd floor of the Administration Building",
    function_desc_zh: "統籌學生生活事務，包括宿舍、社團、獎助學金、學生輔導與校園安全。",
    function_desc_en: "Oversees student life affairs including dormitory, clubs, financial aid, student counseling, and campus safety.",
    service_scope_zh: "宿舍管理、社團輔導、獎助學金、學生保險、校安通報。",
    service_scope_en: "Dormitory management, Club guidance, Financial aid, Student insurance, Campus safety reporting.",
    common_scenarios_zh: "宿舍問題、社團活動、獎助學金申請、校園安全。",
    common_scenarios_en: "Dormitory issues, Club activities, Financial aid application, Campus safety.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://osa.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "osa_dorm",
    name_zh: "學務處住宿服務組",
    name_en: "Housing Service Division, Office of Student Affairs",
    category: "Administrative",
    service_categories: ["dormitory", "student_affairs"],
    building_name_zh: "學生活動中心",
    building_name_en: "Student Activity Center",
    floor: "1F",
    indoor_location_note_zh: "學生活動中心一樓",
    indoor_location_note_en: "1st floor of the Student Activity Center",
    function_desc_zh: "管理學生宿舍申請、床位分配、維修報修、退宿及相關住宿服務。",
    function_desc_en: "Manages dormitory applications, bed allocation, maintenance requests, move-out procedures, and related housing services.",
    service_scope_zh: "宿舍申請與分配、修繕報修、冷氣卡儲值、退宿手續、宿舍規範。",
    service_scope_en: "Dormitory application & allocation, Maintenance requests, AC card recharge, Move-out procedures, Dormitory regulations.",
    common_scenarios_zh: "宿舍申請、門禁問題、設備報修、冷氣卡。",
    common_scenarios_en: "Dormitory application, Access issues, Equipment repair, AC card.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411 ext. 17551",
    email: "",
    official_url: "https://osa.ccu.edu.tw/",
    google_maps_query: "國立中正大學學生活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "library",
    name_zh: "圖書館",
    name_en: "Library",
    category: "Administrative",
    service_categories: ["library", "academic_affairs"],
    building_name_zh: "圖書館",
    building_name_en: "Library Building",
    floor: "B1–6F",
    indoor_location_note_zh: "圖書館大樓，服務台在一樓",
    indoor_location_note_en: "Library Building, service desk on 1st floor",
    function_desc_zh: "提供圖書借閱、電子資料庫、自習空間、研究小間與多媒體服務。",
    function_desc_en: "Provides book borrowing, electronic databases, study spaces, research carrels, and multimedia services.",
    service_scope_zh: "圖書借還、電子資料庫查詢、研究小間預約、多媒體視聽、館際合作。",
    service_scope_en: "Book circulation, Electronic database access, Study room reservation, Multimedia services, Interlibrary loan.",
    common_scenarios_zh: "借書還書、查論文、預約討論室、使用資料庫。",
    common_scenarios_en: "Borrow/return books, Search for thesis, Reserve discussion rooms, Use databases.",
    office_hours: "Mon–Fri 08:20–21:30, Sat–Sun 09:00–17:00 (varies by semester)",
    phone: "05-2720411 ext. 15101",
    email: "",
    official_url: "https://library.ccu.edu.tw/",
    google_maps_query: "國立中正大學圖書館",
    latitude: 23.5633,
    longitude: 120.4695,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: false
  },
  {
    id: "health_center",
    name_zh: "衛生保健組（健康中心）",
    name_en: "Health Center",
    category: "Administrative",
    service_categories: ["health", "student_affairs"],
    building_name_zh: "活動中心",
    building_name_en: "Activity Center",
    floor: "1F",
    indoor_location_note_zh: "活動中心一樓",
    indoor_location_note_en: "1st floor of the Activity Center",
    function_desc_zh: "提供基本醫療服務、健康諮詢、新生體檢與校園衛生管理。",
    function_desc_en: "Provides basic medical services, health consultation, new student health checkups, and campus hygiene management.",
    service_scope_zh: "簡易外傷處理、醫師門診、健康檢查、藥品領取、衛教宣導。",
    service_scope_en: "Simple wound treatment, Doctor consultation, Health checkups, Medicine dispensing, Health education.",
    common_scenarios_zh: "身體不適、受傷、新生體檢、領取藥品。",
    common_scenarios_en: "Feeling unwell, Injury, New student health checkup, Picking up medicine.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411 ext. 17551",
    email: "",
    official_url: "https://osa.ccu.edu.tw/",
    google_maps_query: "國立中正大學活動中心",
    latitude: 23.5618,
    longitude: 120.4728,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "counseling",
    name_zh: "諮商中心",
    name_en: "Counseling Center",
    category: "Administrative",
    service_categories: ["health", "student_affairs"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓一樓",
    indoor_location_note_en: "1st floor of the Administration Building",
    function_desc_zh: "提供心理諮商、心理測驗、危機處理與心理健康推廣服務。",
    function_desc_en: "Provides psychological counseling, psychological testing, crisis intervention, and mental health promotion.",
    service_scope_zh: "個別諮商、團體諮商、心理測驗、危機處理、心理健康講座。",
    service_scope_en: "Individual counseling, Group counseling, Psychological testing, Crisis intervention, Mental health workshops.",
    common_scenarios_zh: "心理壓力、適應困難、情緒問題、人際關係。",
    common_scenarios_en: "Stress, Adjustment difficulties, Emotional issues, Interpersonal relationships.",
    office_hours: "Mon–Fri 08:30–17:00",
    phone: "05-2720411 ext. 17551",
    email: "",
    official_url: "https://counseling.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "general_affairs",
    name_zh: "總務處",
    name_en: "Office of General Affairs",
    category: "Administrative",
    service_categories: ["campus_life"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓一樓",
    indoor_location_note_en: "1st floor of the Administration Building",
    function_desc_zh: "負責校園設施維護、財產管理、採購與校園環境管理。",
    function_desc_en: "Responsible for campus facility maintenance, property management, procurement, and campus environment management.",
    service_scope_zh: "校園設施報修、財產借用、停車管理、郵件收發。",
    service_scope_en: "Campus facility repair, Property borrowing, Parking management, Mail services.",
    common_scenarios_zh: "校園設施故障、停車問題、郵件領取。",
    common_scenarios_en: "Campus facility malfunction, Parking issues, Mail collection.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oga.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "cashier",
    name_zh: "出納組",
    name_en: "Cashier Division",
    category: "Administrative",
    service_categories: ["tuition", "academic_affairs"],
    building_name_zh: "行政大樓",
    building_name_en: "Administration Building",
    floor: "1F",
    indoor_location_note_zh: "行政大樓一樓",
    indoor_location_note_en: "1st floor of the Administration Building",
    function_desc_zh: "處理學雜費繳納、退費、各項費用收取與財務出納事務。",
    function_desc_en: "Handles tuition payment, refunds, fee collection, and financial cashier affairs.",
    service_scope_zh: "學費繳納、退費申請、各項費用收取。",
    service_scope_en: "Tuition payment, Refund application, Fee collection.",
    common_scenarios_zh: "繳學費、申請退費、費用問題。",
    common_scenarios_en: "Pay tuition, Apply for refund, Fee inquiries.",
    office_hours: "Mon–Fri 08:30–12:30, 13:30–17:00",
    phone: "05-2720411",
    email: "",
    official_url: "https://oga.ccu.edu.tw/",
    google_maps_query: "國立中正大學行政大樓",
    latitude: 23.5640,
    longitude: 120.4714,
    source_url: "https://www.ccu.edu.tw/p/412-1000-1563.php?Lang=zh-tw",
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
}

export const departments: Department[] = [
  // ---- College of Liberal Arts 文學院 ----
  {
    id: "chinese_lit",
    name_zh: "中國文學系暨研究所",
    name_en: "Department of Chinese Literature",
    college_zh: "文學院",
    college_en: "College of Liberal Arts",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Liberal Arts Building",
    floor: "2F",
    indoor_location_note_zh: "205辦公室",
    indoor_location_note_en: "Room 205, 2nd floor, College of Liberal Arts Building",
    function_desc_zh: "提供中國文學、古典文獻、現代文學等教學與研究。",
    function_desc_en: "Offers teaching and research in Chinese literature, classical texts, and modern literature.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://chinlit.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "foreign_lang",
    name_zh: "外國語文學系暨研究所",
    name_en: "Department of Foreign Languages and Literature",
    college_zh: "文學院",
    college_en: "College of Liberal Arts",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Liberal Arts Building",
    floor: "(Floor TBC)",
    indoor_location_note_zh: "文學院大樓（確切樓層待確認）",
    indoor_location_note_en: "College of Liberal Arts Building (exact floor to be confirmed)",
    function_desc_zh: "提供英語文學、語言學、翻譯等教學與研究。",
    function_desc_en: "Offers teaching and research in English literature, linguistics, and translation.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://dfll.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "history",
    name_zh: "歷史學系暨研究所",
    name_en: "Department of History",
    college_zh: "文學院",
    college_en: "College of Liberal Arts",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Liberal Arts Building",
    floor: "(Floor TBC)",
    indoor_location_note_zh: "文學院大樓（確切樓層待確認）",
    indoor_location_note_en: "College of Liberal Arts Building (exact floor to be confirmed)",
    function_desc_zh: "提供歷史學教學與研究。",
    function_desc_en: "Offers teaching and research in history.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://depthis.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "philosophy",
    name_zh: "哲學系暨研究所",
    name_en: "Department of Philosophy",
    college_zh: "文學院",
    college_en: "College of Liberal Arts",
    building_name_zh: "文學院大樓",
    building_name_en: "College of Liberal Arts Building",
    floor: "4F",
    indoor_location_note_zh: "文學院大樓 4 樓",
    indoor_location_note_en: "4th floor, College of Liberal Arts Building",
    function_desc_zh: "提供哲學教學與研究。",
    function_desc_en: "Offers teaching and research in philosophy.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptphi.ccu.edu.tw/",
    google_maps_query: "國立中正大學文學院",
    latitude: 23.5648,
    longitude: 120.4682,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  // ---- College of Science 理學院 ----
  {
    id: "math",
    name_zh: "數學系",
    name_en: "Department of Mathematics",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院一館／數學系館",
    building_name_en: "College of Science Building / Mathematics Building",
    floor: "",
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供數學、應用數學、統計科學等教學與研究。",
    function_desc_en: "Offers teaching and research in mathematics, applied mathematics, and statistics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://math.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
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
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供地球科學、環境科學、地震學等教學與研究。",
    function_desc_en: "Offers teaching and research in earth science, environmental science, and seismology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptgeo.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
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
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供物理學教學與研究。",
    function_desc_en: "Offers teaching and research in physics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://phy.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "chem_biochem",
    name_zh: "化學暨生物化學系",
    name_en: "Department of Chemistry and Biochemistry",
    college_zh: "理學院",
    college_en: "College of Science",
    building_name_zh: "理學院二館",
    building_name_en: "College of Science Building",
    floor: "",
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供化學與生物化學教學與研究。",
    function_desc_en: "Offers teaching and research in chemistry and biochemistry.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://che.ccu.edu.tw/",
    google_maps_query: "國立中正大學理學院",
    latitude: 23.5655,
    longitude: 120.4700,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  // ---- College of Social Sciences 社會科學院 ----
  {
    id: "social_welfare",
    name_zh: "社會福利學系暨研究所",
    name_en: "Department of Social Welfare",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院大樓",
    building_name_en: "College of Social Sciences Building",
    floor: "",
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供社會福利政策、社會工作等教學與研究。",
    function_desc_en: "Offers teaching and research in social welfare policy and social work.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://dswel.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
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
    indoor_location_note_en: "4th floor, College of Social Sciences Building",
    function_desc_zh: "提供心理學教學與研究。",
    function_desc_en: "Offers teaching and research in psychology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://psy.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "political_science",
    name_zh: "政治學系暨研究所",
    name_en: "Department of Political Science",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院二館（法學院）",
    building_name_en: "College of Social Sciences Building II (College of Law)",
    floor: "7F",
    indoor_location_note_zh: "社科院二館（法學院）七樓",
    indoor_location_note_en: "7th floor, College of Social Sciences Building II (College of Law)",
    function_desc_zh: "提供政治學教學與研究。",
    function_desc_en: "Offers teaching and research in political science.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://polsci.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "communication",
    name_zh: "傳播學系",
    name_en: "Department of Communication",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院一館",
    building_name_en: "College of Social Sciences Building I",
    floor: "2F",
    indoor_location_note_zh: "R212",
    indoor_location_note_en: "Room R212, 2nd floor",
    function_desc_zh: "提供傳播學、電訊傳播等教學與研究。",
    function_desc_en: "Offers teaching and research in communication and telecommunications.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://comm.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "labor_relations",
    name_zh: "勞工關係學系暨研究所",
    name_en: "Department of Labor Relations",
    college_zh: "社會科學院",
    college_en: "College of Social Sciences",
    building_name_zh: "社會科學院一館",
    building_name_en: "College of Social Sciences Building I",
    floor: "5F",
    indoor_location_note_zh: "528辦公室",
    indoor_location_note_en: "Room 528, 5th floor",
    function_desc_zh: "提供勞工關係教學與研究。",
    function_desc_en: "Offers teaching and research in labor relations.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://labor.ccu.edu.tw/",
    google_maps_query: "國立中正大學社會科學院一館",
    latitude: 23.5630,
    longitude: 120.4690,
    source_url: "https://labor.ccu.edu.tw/",
    needs_manual_review: false
  },
  // ---- College of Engineering 工學院 ----
  {
    id: "cs",
    name_zh: "資訊工程學系暨研究所",
    name_en: "Department of Computer Science and Information Engineering",
    college_zh: "工學院",
    college_en: "College of Engineering",
    building_name_zh: "工學院一館／資工館",
    building_name_en: "College of Engineering Building I / CS Building",
    floor: "1F",
    indoor_location_note_zh: "107／資工館一樓",
    indoor_location_note_en: "Room 107, 1st floor, CS Building",
    function_desc_zh: "提供資訊工程教學與研究。",
    function_desc_en: "Offers teaching and research in computer science and information engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://cs.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供電機工程教學與研究。",
    function_desc_en: "Offers teaching and research in electrical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://ee.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
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
    indoor_location_note_zh: "R314",
    indoor_location_note_en: "Room R314, 3rd floor",
    function_desc_zh: "提供機械工程教學與研究。",
    function_desc_en: "Offers teaching and research in mechanical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://me.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_zh: "322室",
    indoor_location_note_en: "Room 322, 3rd floor",
    function_desc_zh: "提供化學工程教學與研究。",
    function_desc_en: "Offers teaching and research in chemical engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://dche.ccu.edu.tw/",
    google_maps_query: "國立中正大學工學院",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_zh: "429室",
    indoor_location_note_en: "Room 429, 4th floor",
    function_desc_zh: "提供通訊工程教學與研究。",
    function_desc_en: "Offers teaching and research in communications engineering.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://comm_eng.ccu.edu.tw/",
    google_maps_query: "國立中正大學創新大樓",
    latitude: 23.5660,
    longitude: 120.4720,
    source_url: "https://comm_eng.ccu.edu.tw/",
    needs_manual_review: false
  },
  // ---- College of Management 管理學院 ----
  {
    id: "economics",
    name_zh: "經濟學系",
    name_en: "Department of Economics",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "管理學院大樓",
    building_name_en: "College of Management Building",
    floor: "2F",
    indoor_location_note_zh: "206辦公室",
    indoor_location_note_en: "Room 206, 2nd floor",
    function_desc_zh: "提供經濟學教學與研究。",
    function_desc_en: "Offers teaching and research in economics.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://econ.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_zh: "203辦公室",
    indoor_location_note_en: "Room 203, 2nd floor",
    function_desc_zh: "提供財務金融教學與研究。",
    function_desc_en: "Offers teaching and research in finance.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://fin.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_zh: "216辦公室",
    indoor_location_note_en: "Room 216, 2nd floor",
    function_desc_zh: "提供企業管理教學與研究。",
    function_desc_en: "Offers teaching and research in business administration.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://ba.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "acct",
    name_zh: "會計與資訊科技學系暨研究所",
    name_en: "Department of Accounting and Information Technology",
    college_zh: "管理學院",
    college_en: "College of Management",
    building_name_zh: "創新大樓／管理學院二館",
    building_name_en: "Innovation Building / College of Management Building II",
    floor: "2F",
    indoor_location_note_zh: "267辦公室",
    indoor_location_note_en: "Room 267, 2nd floor",
    function_desc_zh: "提供會計學與資訊科技教學與研究。",
    function_desc_en: "Offers teaching and research in accounting and information technology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://acct.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_en: "2nd floor, College of Management Building",
    function_desc_zh: "提供資訊管理教學與研究。",
    function_desc_en: "Offers teaching and research in information management.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://mis.ccu.edu.tw/",
    google_maps_query: "國立中正大學管理學院",
    latitude: 23.5625,
    longitude: 120.4710,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  // ---- College of Law 法學院 ----
  {
    id: "law",
    name_zh: "法律學系暨研究所",
    name_en: "Department of Law",
    college_zh: "法學院",
    college_en: "College of Law",
    building_name_zh: "法學院大樓",
    building_name_en: "College of Law Building",
    floor: "3F",
    indoor_location_note_zh: "309室",
    indoor_location_note_en: "Room 309, 3rd floor",
    function_desc_zh: "提供法律學教學與研究。",
    function_desc_en: "Offers teaching and research in law.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://law.ccu.edu.tw/",
    google_maps_query: "國立中正大學法學院",
    latitude: 23.5635,
    longitude: 120.4705,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
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
    indoor_location_note_zh: "411室",
    indoor_location_note_en: "Room 411, 4th floor",
    function_desc_zh: "提供財經法律教學與研究。",
    function_desc_en: "Offers teaching and research in financial and economic law.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://finlaw.ccu.edu.tw/",
    google_maps_query: "國立中正大學法學院",
    latitude: 23.5635,
    longitude: 120.4705,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  // ---- College of Education 教育學院 ----
  {
    id: "adult_edu",
    name_zh: "成人及繼續教育學系暨研究所",
    name_en: "Department of Adult and Continuing Education",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院大樓",
    building_name_en: "College of Education Building",
    floor: "",
    indoor_location_note_zh: "",
    indoor_location_note_en: "",
    function_desc_zh: "提供成人教育與繼續教育教學與研究。",
    function_desc_en: "Offers teaching and research in adult and continuing education.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://aduce.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
  {
    id: "criminology",
    name_zh: "犯罪防治學系暨研究所",
    name_en: "Department of Criminology",
    college_zh: "教育學院",
    college_en: "College of Education",
    building_name_zh: "教育學院一館",
    building_name_en: "College of Education Building I",
    floor: "6F",
    indoor_location_note_zh: "609辦公室",
    indoor_location_note_en: "Room 609, 6th floor",
    function_desc_zh: "提供犯罪防治教學與研究。",
    function_desc_en: "Offers teaching and research in criminology.",
    service_scope_zh: "系辦公室提供選課諮詢、學籍證明、導師聯繫等服務。",
    service_scope_en: "Department office provides course advising, enrollment certificates, and advisor contact services.",
    service_categories: ["department_offices", "academic_affairs"],
    official_url: "https://deptcrime.ccu.edu.tw/",
    google_maps_query: "國立中正大學教育學院",
    latitude: 23.5620,
    longitude: 120.4698,
    source_url: "https://www.ccu.edu.tw/p/412-1000-792.php?Lang=zh-tw",
    needs_manual_review: true
  },
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
      { zh: "前往行政大樓", en: "Go to the Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "註冊組位於一樓", en: "Registration Division is on the 1st floor" },
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
      { zh: "前往行政大樓", en: "Go to the Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "註冊組位於一樓", en: "Registration Division is on the 1st floor" },
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
    source_url: "https://osa.ccu.edu.tw/",
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
      { zh: "前往圖書館大樓", en: "Go to the Library Building" },
      { zh: "從一樓正門進入", en: "Enter through the 1st floor main entrance" },
      { zh: "服務台在一樓入口處", en: "Service desk is at the 1st floor entrance" },
      { zh: "出示學生證感應入館", en: "Tap your student ID to enter" },
      { zh: "向服務台詢問你需要的服務", en: "Ask the service desk for what you need" }
    ],
    source_url: "https://library.ccu.edu.tw/",
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
      { zh: "健康中心位於一樓", en: "Health Center is on the 1st floor" },
      { zh: "找到衛生保健組", en: "Find the Health Service Section" },
      { zh: "向護理人員說明你的症狀", en: "Tell the nurse about your symptoms" }
    ],
    source_url: "https://osa.ccu.edu.tw/",
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
      { zh: "前往行政大樓", en: "Go to the Administration Building" },
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
      { zh: "前往行政大樓", en: "Go to the Administration Building" },
      { zh: "從正門進入", en: "Enter through the main entrance" },
      { zh: "註冊組位於一樓", en: "Registration Division is on the 1st floor" },
      { zh: "向註冊組申請成績單", en: "Apply for transcript at the Registration Division" },
      { zh: "攜帶學生證，可能需要繳交工本費", en: "Bring your student ID; a processing fee may be required" }
    ],
    source_url: "https://oaa.ccu.edu.tw/",
    needs_manual_review: false
  }
];

// ============================================================
// Campus Life Resources
// ============================================================
export interface CampusResource {
  id: string;
  name_zh: string;
  name_en: string;
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
// Search Engine
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
    // Also match against service category keywords
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

// Get unique colleges for department grouping
export function getColleges() {
  const colleges = new Map<string, { zh: string; en: string }>();
  departments.forEach(d => {
    if (!colleges.has(d.college_en)) {
      colleges.set(d.college_en, { zh: d.college_zh, en: d.college_en });
    }
  });
  return Array.from(colleges.values());
}
