/**
 * CCU International Student Friendly Campus Guide — Data Layer
 * Updated from 更新資訊.docx
 *
 * This version adds floor and room information for offices, departments, and college offices.
 * It also exposes room_zh / room_en so CampusMap can show:
 *   College of Management Building · 2F Room 206
 * instead of repeating the full indoor location on a second line.
 */

export interface ServiceCategory {
  id: string;
  name_en: string;
  name_zh: string;
  icon: string;
  description_en: string;
  description_zh: string;
  keywords: string[];
}

export interface Office {
  id: string;
  name_zh: string;
  name_en: string;
  category: "office";
  service_categories: string[];
  building_name_zh: string;
  building_name_en: string;
  floor: string;
  room_zh?: string;
  room_en?: string;
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
  use_manual_coordinates?: boolean;
  source_url: string;
  needs_manual_review: boolean;
  floor_plan_image?: string;
  entrance_image?: string;
}

export interface Department {
  id: string;
  name_zh: string;
  name_en: string;
  category: "department";
  college_zh: string;
  college_en: string;
  building_name_zh: string;
  building_name_en: string;
  floor: string;
  room_zh?: string;
  room_en?: string;
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
  use_manual_coordinates?: boolean;
  source_url: string;
  needs_manual_review: boolean;
  is_college_office?: boolean;
  floor_plan_image?: string;
  entrance_image?: string;
  building_entrance_image?: string;
}

export interface TaskStep {
  zh: string;
  en: string;
}

export interface Task {
  id: string;
  task_name_zh: string;
  task_name_en: string;
  scenario_zh: string;
  scenario_en: string;
  target_unit_type: "office" | "department";
  target_unit_id: string;
  category_id: string;
  required_documents_zh: string[];
  required_documents_en: string[];
  steps: TaskStep[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    "id": "registration",
    "name_en": "Registration",
    "name_zh": "註冊",
    "icon": "ClipboardCheck",
    "description_en": "Course registration, enrollment status, and academic records",
    "description_zh": "選課註冊、學籍與學業紀錄",
    "keywords": [
      "registration",
      "enroll",
      "student ID",
      "transcript",
      "註冊",
      "學籍",
      "學生證",
      "成績單"
    ]
  },
  {
    "id": "student_id",
    "name_en": "Student ID",
    "name_zh": "學生證",
    "icon": "CreditCard",
    "description_en": "Student ID card issuance, replacement, and related services",
    "description_zh": "學生證核發、補辦與相關服務",
    "keywords": [
      "student id",
      "student card",
      "replacement",
      "學生證",
      "補辦"
    ]
  },
  {
    "id": "international_support",
    "name_en": "International Support",
    "name_zh": "國際學生支援",
    "icon": "Globe",
    "description_en": "Visa, ARC, scholarships, work permit, and international student support",
    "description_zh": "簽證、居留證、獎學金、工作許可與國際學生支援",
    "keywords": [
      "international",
      "visa",
      "ARC",
      "OIA",
      "scholarship",
      "work permit",
      "exchange",
      "國際處",
      "簽證",
      "居留證",
      "獎學金",
      "工作許可",
      "交換生"
    ]
  },
  {
    "id": "department_offices",
    "name_en": "Department Offices",
    "name_zh": "系所辦公室",
    "icon": "Building2",
    "description_en": "Academic department and college offices",
    "description_zh": "各系所與學院辦公室",
    "keywords": [
      "department",
      "college",
      "advisor",
      "office",
      "系辦",
      "院辦",
      "學院",
      "教授"
    ]
  },
  {
    "id": "dormitory",
    "name_en": "Dormitory",
    "name_zh": "宿舍",
    "icon": "Home",
    "description_en": "Dormitory application, check-in, fees, parcels, and maintenance",
    "description_zh": "宿舍申請、報到、繳費、包裹與維修",
    "keywords": [
      "dormitory",
      "dorm",
      "housing",
      "laundry",
      "parcel",
      "mattress",
      "宿舍",
      "住宿",
      "包裹",
      "洗衣",
      "床墊"
    ]
  },
  {
    "id": "health",
    "name_en": "Health",
    "name_zh": "健康醫療",
    "icon": "HeartPulse",
    "description_en": "Health checkups, medical services, insurance, and emergency care",
    "description_zh": "健康檢查、醫療服務、保險與緊急處理",
    "keywords": [
      "health",
      "medical",
      "doctor",
      "NHI",
      "insurance",
      "sick",
      "健康",
      "醫療",
      "健保",
      "保險",
      "看病"
    ]
  },
  {
    "id": "library",
    "name_en": "Library",
    "name_zh": "圖書館",
    "icon": "BookOpen",
    "description_en": "Library services, study spaces, databases, and printing",
    "description_zh": "圖書館服務、自習空間、資料庫與列印",
    "keywords": [
      "library",
      "book",
      "database",
      "study room",
      "print",
      "圖書館",
      "借書",
      "自習",
      "列印"
    ]
  },
  {
    "id": "student_affairs",
    "name_en": "Student Affairs",
    "name_zh": "學生事務",
    "icon": "Users",
    "description_en": "Student life, clubs, safety, counseling, and campus support",
    "description_zh": "學生生活、社團、安全、諮商與校園支援",
    "keywords": [
      "student affairs",
      "club",
      "activity",
      "safety",
      "leave",
      "學務",
      "社團",
      "活動",
      "校安",
      "請假"
    ]
  },
  {
    "id": "academic_affairs",
    "name_en": "Academic Affairs",
    "name_zh": "教務",
    "icon": "GraduationCap",
    "description_en": "Curriculum, grades, transcripts, academic records, and graduation",
    "description_zh": "課程、成績、成績單、學籍與畢業",
    "keywords": [
      "academic",
      "course",
      "grade",
      "transcript",
      "graduation",
      "transfer",
      "教務",
      "課程",
      "成績",
      "畢業",
      "轉系"
    ]
  },
  {
    "id": "course_issues",
    "name_en": "Course Issues",
    "name_zh": "選課相關",
    "icon": "FileText",
    "description_en": "Course selection, add/drop, syllabi, eCourse, and professor communication",
    "description_zh": "選課、加退選、課綱、eCourse 與教授溝通",
    "keywords": [
      "course",
      "add drop",
      "syllabus",
      "professor",
      "eCourse",
      "選課",
      "加簽",
      "課綱",
      "教授",
      "請假"
    ]
  },
  {
    "id": "tuition",
    "name_en": "Tuition & Fees",
    "name_zh": "學費繳納",
    "icon": "Wallet",
    "description_en": "Tuition, dormitory fees, cashier services, and payments",
    "description_zh": "學費、宿舍費、出納與繳費",
    "keywords": [
      "tuition",
      "fee",
      "payment",
      "cashier",
      "學費",
      "宿舍費",
      "繳費",
      "出納"
    ]
  },
  {
    "id": "career",
    "name_en": "Career Development",
    "name_zh": "職涯發展",
    "icon": "Briefcase",
    "description_en": "Career counseling, recruitment, internships, and job resources",
    "description_zh": "職涯諮詢、徵才、實習與求職資源",
    "keywords": [
      "career",
      "job",
      "internship",
      "resume",
      "work",
      "職涯",
      "求職",
      "實習",
      "履歷",
      "打工"
    ]
  },
  {
    "id": "it_support",
    "name_en": "IT Support",
    "name_zh": "資訊服務",
    "icon": "Monitor",
    "description_en": "SSO, campus email, Wi-Fi, software, and eCourse support",
    "description_zh": "單一入口、校園信箱、Wi-Fi、軟體與 eCourse 支援",
    "keywords": [
      "SSO",
      "email",
      "Wi-Fi",
      "software",
      "password",
      "eCourse",
      "資訊",
      "密碼",
      "信箱",
      "網路",
      "軟體"
    ]
  },
  {
    "id": "counseling",
    "name_en": "Counseling",
    "name_zh": "心理諮商",
    "icon": "HeartHandshake",
    "description_en": "Psychological counseling, mental health, and student wellness",
    "description_zh": "心理諮商、心理健康與學生身心支持",
    "keywords": [
      "counseling",
      "mental health",
      "stress",
      "諮商",
      "心理",
      "壓力"
    ],
  }
];

export const offices: Office[] = [
  {
    "id": "oia",
    "name_zh": "國際事務處",
    "name_en": "Office of International Affairs (OIA)",
    "category": "office",
    "service_categories": [
      "international_support",
      "registration",
      "dormitory",
      "career"
    ],
    "building_name_zh": "國際處",
    "building_name_en": "Office of International Affairs Building",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "國際處 2F",
    "indoor_location_note_en": "Office of International Affairs Building · 2nd Floor",
    "function_desc_zh": "協助國際學生處理簽證、居留證、獎學金、報到、交換計畫、工作許可與生活適應問題。",
    "function_desc_en": "Supports international students with visa/ARC, scholarships, registration, exchange programs, work permits, and daily life issues.",
    "service_scope_zh": "簽證與居留證、獎學金、國際生報到、宿舍費繳費單、工作許可、國際學生生活輔導。",
    "service_scope_en": "Visa and ARC, scholarships, international student registration, dormitory payment sheets, work permits, and life support.",
    "common_scenarios_zh": "簽證、居留證、獎學金、工作許可、國際學生報到與生活問題。",
    "common_scenarios_en": "Visa, ARC, scholarships, work permit, international student registration, and life support.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext. 17619",
    "email": "oia@ccu.edu.tw",
    "official_url": "https://oia.ccu.edu.tw/",
    "google_maps_query": "國立中正大學國際事務處",
    "latitude": 23.5606,
    "longitude": 120.4736,
    "source_url": "https://oia.ccu.edu.tw/",
    "needs_manual_review": false
  },
  {
    "id": "oaa",
    "name_zh": "教務處",
    "name_en": "Office of Academic Affairs",
    "category": "office",
    "service_categories": [
      "academic_affairs",
      "registration",
      "course_issues",
      "student_id"
    ],
    "building_name_zh": "行政大樓東棟",
    "building_name_en": "East Wing, Administration Building",
    "floor": "1F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓東棟 1F",
    "indoor_location_note_en": "East Wing, Administration Building · 1st Floor",
    "function_desc_zh": "辦理註冊、復學、休學、退學、選課、加退選、成績、學生證、學分抵免與畢業資格審查等教務事項。",
    "function_desc_en": "Handles registration status, leave/reinstatement/withdrawal, course enrollment, grades, student ID reissue, credit transfer, and graduation review.",
    "service_scope_zh": "註冊、學籍、選課、成績、學生證補發、學分抵免、畢業資格與證書。",
    "service_scope_en": "Registration, enrollment status, course issues, grades, student ID, credit transfer, graduation requirements and certificates.",
    "common_scenarios_zh": "註冊、學籍、選課、成績、學生證補發、學分抵免、畢業資格與證書。",
    "common_scenarios_en": "Registration, enrollment status, course issues, grades, student ID, credit transfer, graduation requirements and certificates.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 11212、11213(Course Registration Issues)",
    "email": "academic@ccu.edu.tw",
    "official_url": "https://oaa.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.56169816951211,
    "longitude": 120.47576902965515,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/oaa/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "oaa_admissions",
    "name_zh": "教務處－招生組",
    "name_en": "Division of Admissions, Office of Academic Affairs",
    "category": "office",
    "service_categories": [
      "registration",
      "academic_affairs"
    ],
    "building_name_zh": "行政大樓東棟",
    "building_name_en": "East Wing, Administration Building",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓東棟 2F",
    "indoor_location_note_en": "East Wing, Administration Building · 2nd Floor",
    "function_desc_zh": "負責學生招生、申請、考試、考生陳情、申訴與退費等業務。",
    "function_desc_en": "Responsible for student admissions, applications, examinations, candidates' petitions, appeals, and refunds.",
    "service_scope_zh": "各類招生試務辦理；考生陳情、申訴與退費；公文、工讀生與郵件管理。",
    "service_scope_en": "Enrollment and examination affairs; candidates' petitions, appeals, and refunds; document, work-study student, and email management.",
    "common_scenarios_zh": "各類招生試務辦理；考生陳情、申訴與退費；公文、工讀生與郵件管理。",
    "common_scenarios_en": "Enrollment and examination affairs; candidates' petitions, appeals, and refunds; document, work-study student, and email management.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2721480(Admissions Issues)",
    "email": "admchsr@ccu.edu.tw",
    "official_url": "https://oaa.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.561560751920133,
    "longitude": 120.47570204591216,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/oaa_admissions/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "oaa_generalaffairs",
    "name_zh": "教務處－綜合業務組",
    "name_en": "Division of General Affairs, Office of Academic Affairs",
    "category": "office",
    "service_categories": ["academic", "administration"],
    "building_name_zh": "行政大樓東棟",
    "building_name_en": "East Wing, Administration Building",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓東棟 2F",
    "indoor_location_note_en": "East Wing, Administration Building · 2nd Floor",
    "function_desc_zh": "辦理院系所增設調整、招生名額統計、校務發展計畫、校務研究及中英文年報彙編等教務行政業務。",
    "function_desc_en": "Handles administrative work for department establishment and adjustments, enrollment quota reporting, academic development planning, institutional research, and compilation of annual reports.",
    "service_scope_zh": "院系所增設與調整、招生名額與生師比統計、中長程校務發展計畫、校務研究、年度報告彙編。",
    "service_scope_en": "Establishment and adjustment of academic units, enrollment and faculty/student ratio statistics, academic development plans, institutional research, and annual report compilation.",
    "common_scenarios_zh": "院系所增設與調整、招生名額統計、校務發展計畫查詢。",
    "common_scenarios_en": "Inquiries about department establishment, enrollment quota statistics, and academic development plans.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411",
    "email": "academic@ccu.edu.tw",
    "official_url": "https://oaa.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.561664546072027,
    "longitude": 120.47582963399408,
    "source_url": "https://oaa.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/oaa_generalaffairs/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "ctld",
    "name_zh": "教學發展中心",
    "name_en": "Center for Teaching and Learning Development",
    "category": "office",
    "service_categories": [
      "academic_affairs"
    ],
    "building_name_zh": "行政大樓東棟",
    "building_name_en": "East Wing, Administration Building",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓東棟 2F",
    "indoor_location_note_en": "East Wing, Administration Building · 2nd Floor",
    "function_desc_zh": "辦理教學意見調查、教學與學習支持資源、TA 認證培訓、教師教學輔導與評鑑。",
    "function_desc_en": "Administers course evaluation surveys, teaching and learning support resources, TA training, instructional consultation, and teaching evaluation.",
    "service_scope_zh": "教學意見調查、教學支持、TA 認證培訓、教學改進與評鑑。",
    "service_scope_en": "Course evaluation surveys, teaching support, TA certification, teaching improvement, and evaluation.",
    "common_scenarios_zh": "教學意見調查、教學支持、TA 認證培訓、教學改進與評鑑。",
    "common_scenarios_en": "Course evaluation surveys, teaching support, TA certification, teaching improvement, and evaluation.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411",
    "email": "",
    "official_url": "https://oaa.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/ctld/entrance.jpg"
  },
  {
    "id": "osa",
    "name_zh": "學生事務處－學務長室",
    "name_en": "Office of Student Affairs / Dean of Student Affairs Office",
    "category": "office",
    "service_categories": [
      "student_affairs"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 2F",
    "indoor_location_note_en": "West Wing, Administration Building · 2nd Floor",
    "function_desc_zh": "負責學生事務政策制定、跨單位協調、學生行政流程與申訴問題處理。",
    "function_desc_en": "Responsible for student affairs policy making, cross-department coordination, administrative procedures, and student appeals.",
    "service_scope_zh": "學生事務政策、跨單位協調、學生行政流程與申訴協助。",
    "service_scope_en": "Student affairs policy, cross-unit coordination, administrative procedures, and student appeals.",
    "common_scenarios_zh": "學生事務政策、跨單位協調、學生行政流程與申訴協助。",
    "common_scenarios_en": "Student affairs policy, cross-unit coordination, administrative procedures, and student appeals.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 12001",
    "email": "admosa@ccu.edu.tw",
    "official_url": "https://studaffairs.ccu.edu.tw/p/412-1005-349.php?Lang=zh-tw",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.5620475606864,
    "longitude": 120.47530971253194,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/osa/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "osa_life",
    "name_zh": "學務處－生活事務組",
    "name_en": "Student Life and Activities Office, Office of Student Affairs",
    "category": "office",
    "service_categories": [
      "student_affairs",
      "dormitory",
      "tuition",
      "health"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 2F",
    "indoor_location_note_en": "West Wing, Administration Building · 2nd Floor",
    "function_desc_zh": "辦理獎助學金、就學貸款、學雜費減免、弱勢助學、學生宿舍、校外賃居、學生保險、失物招領與校安值勤。",
    "function_desc_en": "Handles scholarships, student loans, tuition reduction, financial aid, dormitory services, off-campus housing, student insurance, lost and found, and campus security duty.",
    "service_scope_zh": "獎助學金、就學貸款、學雜費減免、學生宿舍、學生保險、失物招領與學生生活服務。",
    "service_scope_en": "Scholarships, loans, tuition reduction, dormitory services, student insurance, lost and found, and student life support.",
    "common_scenarios_zh": "獎助學金、就學貸款、學雜費減免、學生宿舍、學生保險、失物招領與學生生活服務。",
    "common_scenarios_en": "Scholarships, loans, tuition reduction, dormitory services, student insurance, lost and found, and student life support.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 12101",
    "email": "admdas@ccu.edu.tw",
    "official_url": "https://studentlife.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.562106036127748,
    "longitude": 120.47519488312196,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/osa_life/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "osa_extracurricular",
    "name_zh": "學務處－課外活動組",
    "name_en": "Division of Extra-Curricular Activities",
    "category": "office",
    "service_categories": [
      "student_affairs"
    ],
    "building_name_zh": "活動中心",
    "building_name_en": "Activity Center",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "活動中心 2F",
    "indoor_location_note_en": "Activity Center · 2nd Floor",
    "function_desc_zh": "辦理社團成立、社團幹部交接、社團活動與校內大型活動、社團經費補助、活動中心場地設備借用與學生會行政支援。",
    "function_desc_en": "Handles club establishment, officer handover, student organization activities, major campus events, funding applications, Activity Center facilities, and Student Association administrative support.",
    "service_scope_zh": "社團成立、社團活動、經費補助、活動中心場地與設備借用、學生自治組織行政流程支援。",
    "service_scope_en": "Club establishment, activities, funding, Activity Center facility booking, and student governance administrative support.",
    "common_scenarios_zh": "社團成立、社團活動、經費補助、活動中心場地與設備借用、學生自治組織行政流程支援。",
    "common_scenarios_en": "Club establishment, activities, funding, Activity Center facility booking, and student governance administrative support.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411",
    "email": "extra@ccu.edu.tw",
    "official_url": "https://extra.ccu.edu.tw/",
    "google_maps_query": "國立中正大學活動中心",
    "latitude": 23.560752987369337,
    "longitude": 120.47202118452867,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/osa_extracurricular/entrance.jpg",
    "floor_plan_image": "/images/offices/osa_extracurricular/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "osa_safety",
    "name_zh": "學務處－學生安全組",
    "name_en": "Division of Student Safety",
    "category": "office",
    "service_categories": [
      "student_affairs",
      "health"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "B1",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 B1",
    "indoor_location_note_en": "West Wing, Administration Building · Basement 1",
    "function_desc_zh": "負責學生安全事件通報、24小時校安中心、校園安全資訊、防災預警、學生生活輔導、性別事件處理、法律諮詢與兵役申請諮詢。",
    "function_desc_en": "Handles student safety incident reporting, 24-hour campus safety support, safety information, risk alerts, student support, gender incident support, legal consultation, and military service applications.",
    "service_scope_zh": "緊急通報、校園安全資訊、學生生活輔導、性別事件處理、法律諮詢、兵役緩徵與出境諮詢。",
    "service_scope_en": "Emergency reporting, campus safety information, student care, gender incident support, legal consultation, and military service deferment/travel consultation.",
    "common_scenarios_zh": "緊急通報、校園安全資訊、學生生活輔導、性別事件處理、法律諮詢、兵役緩徵與出境諮詢。",
    "common_scenarios_en": "Emergency reporting, campus safety information, student care, gender incident support, legal consultation, and military service deferment/travel consultation.",
    "office_hours": "24-hour hotline / Office hours Mon–Fri 08:30–17:00",
    "phone": "05-2721114 / 0910-896-288",
    "email": "",
    "official_url": "https://security.ccu.edu.tw/?Lang=zh-tw",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.561888214976612,
    "longitude": 120.47538945517779,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/osa_safety/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "health_center",
    "name_zh": "衛生保健組",
    "name_en": "Health Services Division",
    "category": "office",
    "service_categories": [
      "health",
      "student_affairs"
    ],
    "building_name_zh": "活動中心",
    "building_name_en": "Activity Center",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "活動中心 2F",
    "indoor_location_note_en": "Activity Center · 2nd Floor",
    "function_desc_zh": "提供新生健康檢查、健康諮詢、校園意外簡易處理、傳染病防治、學生團體保險理賠、健康測量與醫療器材借用等服務。",
    "function_desc_en": "Provides new student health examinations, health consultation, basic first aid, infectious disease prevention, student insurance claims, health measurements, and medical equipment loans.",
    "service_scope_zh": "健檢、簡易醫療處理、保險理賠、健康教育、器材借用、校園活動救護支援。",
    "service_scope_en": "Health checkups, basic first aid, insurance claims, health education, equipment loans, and first-aid support for campus events.",
    "common_scenarios_zh": "健檢、簡易醫療處理、保險理賠、健康教育、器材借用、校園活動救護支援。",
    "common_scenarios_en": "Health checkups, basic first aid, insurance claims, health education, equipment loans, and first-aid support for campus events.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 12345 / 05-2721214",
    "email": "health@ccu.edu.tw",
    "official_url": "https://health.ccu.edu.tw/",
    "google_maps_query": "國立中正大學活動中心",
    "latitude": 23.560441021587568,
    "longitude": 120.4726606164853,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/health_center/entrance.jpg",
    "floor_plan_image": "/images/offices/health_center/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "counseling",
    "name_zh": "諮商中心",
    "name_en": "Counseling Center",
    "category": "office",
    "service_categories": [
      "counseling",
      "health",
      "student_affairs"
    ],
    "building_name_zh": "活動中心",
    "building_name_en": "Activity Center",
    "floor": "3F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "活動中心 3F",
    "indoor_location_note_en": "Activity Center · 3rd Floor",
    "function_desc_zh": "提供心理諮商、心理測驗與評估、學習適應、生涯輔導、學生申訴諮詢、身心障礙學生支持、心理健康講座與自殺防治。",
    "function_desc_en": "Provides counseling, psychological assessments, academic adaptation and career counseling, student complaint consultation, disability support, mental health activities, and suicide prevention.",
    "service_scope_zh": "個別晤談、情緒支持、心理測驗、學習與生涯輔導、身心障礙學生資源支持。",
    "service_scope_en": "Individual counseling, emotional support, assessments, academic/career counseling, and support for students with disabilities.",
    "common_scenarios_zh": "個別晤談、情緒支持、心理測驗、學習與生涯輔導、身心障礙學生資源支持。",
    "common_scenarios_en": "Individual counseling, emotional support, assessments, academic/career counseling, and support for students with disabilities.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 17501 / 05-2721061",
    "email": "advising@ccu.edu.tw",
    "official_url": "https://advising.ccu.edu.tw/",
    "google_maps_query": "國立中正大學活動中心",
    "latitude": 23.560413111112986,
    "longitude": 120.47264482826567,
    "source_url": "https://advising.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/counseling/entrance.jpg",
    "floor_plan_image": "/images/offices/counseling/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "oga_services",
    "name_zh": "總務處－事務組",
    "name_en": "General Services Division, Office of General Affairs",
    "category": "office",
    "service_categories": [
      "student_affairs",
      "dormitory"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "1F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 1F",
    "indoor_location_note_en": "West Wing, Administration Building · 1st Floor",
    "function_desc_zh": "處理公共意外責任險、宿舍水電費、校園環境維護、招待所住宿、行政大樓門禁設備、簡易維修與事務組工讀生管理。",
    "function_desc_en": "Handles public liability insurance, dormitory utilities, campus environment maintenance, guesthouse/accommodation, administration building access and equipment, simple repairs, and work-study management.",
    "service_scope_zh": "保險、宿舍水電、校園環境、門禁設備、簡易維修與住宿管理。",
    "service_scope_en": "Insurance, dormitory utilities, campus environment, access control, simple repairs, and accommodation management.",
    "common_scenarios_zh": "保險、宿舍水電、校園環境、門禁設備、簡易維修與住宿管理。",
    "common_scenarios_en": "Insurance, dormitory utilities, campus environment, access control, simple repairs, and accommodation management.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411",
    "email": "general@ccu.edu.tw",
    "official_url": "https://oga.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.56206802709383,
    "longitude": 120.47527143606194,
    "source_url": "https://oga.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/oga_services/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "cashier",
    "name_zh": "總務處－出納組",
    "name_en": "Cashier Division, Office of General Affairs",
    "category": "office",
    "service_categories": [
      "tuition",
      "registration"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "1F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 1F",
    "indoor_location_note_en": "West Wing, Administration Building · 1st Floor",
    "function_desc_zh": "辦理人事費轉帳撥款、學生註冊與就學相關繳費業務。",
    "function_desc_en": "Handles personnel expense transfers and student registration/payment-related services.",
    "service_scope_zh": "學雜費、註冊相關繳費、行政付款與出納服務。",
    "service_scope_en": "Tuition/fees, registration-related payments, administrative payments, and cashier services.",
    "common_scenarios_zh": "學雜費、註冊相關繳費、行政付款與出納服務。",
    "common_scenarios_en": "Tuition/fees, registration-related payments, administrative payments, and cashier services.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411",
    "email": "general@ccu.edu.tw",
    "official_url": "https://oga.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.562070950866058,
    "longitude": 120.47518531400446,
    "source_url": "https://oga.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/cashier/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "property_management",
    "name_zh": "總務處－保管組",
    "name_en": "Property Management Division, Office of General Affairs",
    "category": "office",
    "service_categories": [
      "student_affairs"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "B1",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 B1",
    "indoor_location_note_en": "West Wing, Administration Building · Basement 1",
    "function_desc_zh": "辦理畢業學位服借用與歸還、畢業生離校手續、校內鑰匙管理、活動器材與公物借用及紀念品管理。",
    "function_desc_en": "Handles graduation gown rental/return, graduate school-leaving procedures, campus key management, equipment/public property loans, and souvenir management.",
    "service_scope_zh": "學位服借用、畢業離校。",
    "service_scope_en": "Graduation gown rental, school-leaving procedures.",
    "common_scenarios_zh": "學位服借用、畢業離校。",
    "common_scenarios_en": "Graduation gown rental, school-leaving procedures.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411",
    "email": "general@ccu.edu.tw",
    "official_url": "https://oga.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.56183704888203,
    "longitude": 120.4751597963578,
    "source_url": "https://oga.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/property_management/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "personnel",
    "name_zh": "人事室",
    "name_en": "Personnel Office",
    "category": "office",
    "service_categories": [
      "student_affairs"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "4F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 4F",
    "indoor_location_note_en": "West Wing, Administration Building · 4th Floor",
    "function_desc_zh": "處理人事相關行政與申訴事項。",
    "function_desc_en": "Handles personnel-related administration and appeals.",
    "service_scope_zh": "人事行政與申訴。",
    "service_scope_en": "Personnel administration and appeals.",
    "common_scenarios_zh": "人事行政與申訴。",
    "common_scenarios_en": "Personnel administration and appeals.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 18116",
    "email": "",
    "official_url": "https://person.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.562054870117983,
    "longitude": 120.47533044561985,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/personnel/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "vehicle_control",
    "name_zh": "總務處-駐警隊－車輛管控中心",
    "name_en": "Campus Security - Vehicle Control Center, Office of General Affairs",
    "category": "office",
    "service_categories": [
      "student_affairs",
      "transportation"
    ],
    "building_name_zh": "活動中心",
    "building_name_en": "Activity Center",
    "floor": "2F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "活動中心 2F",
    "indoor_location_note_en": "Activity Center · 2nd Floor",
    "function_desc_zh": "負責車輛通行證、違規收費與催繳、離校審核、行動不便者臨時通行證、疑似廢棄車輛處理與意見反應。",
    "function_desc_en": "Handles vehicle permits, violation charges/collection, school-leaving review, temporary passes for people with mobility impairments, abandoned vehicle handling, and feedback.",
    "service_scope_zh": "車輛通行證、違規費用、離校審核、臨時通行證與廢棄車輛處理。",
    "service_scope_en": "Vehicle permits, violation fees, school-leaving review, temporary passes, and abandoned vehicles.",
    "common_scenarios_zh": "車輛通行證、違規費用、離校審核、臨時通行證與廢棄車輛處理。",
    "common_scenarios_en": "Vehicle permits, violation fees, school-leaving review, temporary passes, and abandoned vehicles.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext. 13706 (Mr. Huang) / ext. 13707 (Ms. Hsu)",
    "email": "deptvmc@ccu.edu.tw",
    "official_url": "https://oga.ccu.edu.tw/",
    "google_maps_query": "國立中正大學活動中心",
    "latitude": 23.56081435782497,
    "longitude": 120.4720087501023,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/vehicle_control/entrance.jpg",
    "floor_plan_image": "/images/offices/vehicle_control/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "secretariat",
    "name_zh": "秘書室",
    "name_en": "Office of the Secretariat",
    "category": "office",
    "service_categories": [
      "student_affairs"
    ],
    "building_name_zh": "行政大樓西棟",
    "building_name_en": "West Wing, Administration Building",
    "floor": "5F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "行政大樓西棟 5F",
    "indoor_location_note_en": "West Wing, Administration Building · 5th Floor",
    "function_desc_zh": "辦理秘書室行政、工讀生指導、工讀金管理與核銷等相關業務。",
    "function_desc_en": "Handles Secretariat administration, work-study student guidance, allowance management, and reimbursement.",
    "service_scope_zh": "秘書室行政、工讀生與工讀金管理。",
    "service_scope_en": "Secretariat administration and work-study management.",
    "common_scenarios_zh": "秘書室行政、工讀生與工讀金管理。",
    "common_scenarios_en": "Secretariat administration and work-study management.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720402",
    "email": "secretar@ccu.edu.tw",
    "official_url": "https://secretar.ccu.edu.tw/",
    "google_maps_query": "國立中正大學行政大樓",
    "latitude": 23.561870672317863,
    "longitude": 120.4750146647424,
    "source_url": "https://secretar.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/secretariat/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "career_center",
    "name_zh": "職涯發展中心",
    "name_en": "Career Development Center",
    "category": "office",
    "service_categories": [
      "career"
    ],
    "building_name_zh": "共同教室大樓",
    "building_name_en": "Center for General Education",
    "floor": "5F",
    "room_zh": "502室",
    "room_en": "Room 502",
    "indoor_location_note_zh": "共同教室大樓 5F 502室",
    "indoor_location_note_en": "Center for General Education · 5th Floor · Room 502",
    "function_desc_zh": "提供企業招募資訊、履歷投遞、校園徵才、企業參訪、職涯探索測評、職涯講座、履歷求職技能指導、個別職涯諮詢、校外實習申請與職涯相關計畫資訊。",
    "function_desc_en": "Provides employer listings, application opportunities, campus recruitment, company visits, career assessments, career workshops, resume and job readiness guidance, one-on-one counseling, internship guidance, and career-related programs.",
    "service_scope_zh": "徵才、實習、履歷、職涯諮詢、企業參訪與工作坊。",
    "service_scope_en": "Recruitment, internships, resumes, career counseling, company visits, and workshops.",
    "common_scenarios_zh": "徵才、實習、履歷、職涯諮詢、企業參訪與工作坊。",
    "common_scenarios_en": "Recruitment, internships, resumes, career counseling, company visits, and workshops.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext.12201～12206",
    "email": "aftergrd@ccu.edu.tw",
    "official_url": "https://career.ccu.edu.tw/",
    "google_maps_query": "國立中正大學共同教室大樓",
    "latitude": 23.563123909647985,
    "longitude": 120.47609636718511,
    "source_url": "https://career.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/career_center/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "it_center",
    "name_zh": "資訊處",
    "name_en": "Information Technology Office",
    "category": "office",
    "service_categories": [
      "it_support"
    ],
    "building_name_zh": "圖書資訊大樓",
    "building_name_en": "Information and Library Building",
    "floor": "",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "圖書資訊大樓",
    "indoor_location_note_en": "Information and Library Building",
    "function_desc_zh": "提供校園 SSO、WebMail、Microsoft 365、Google Workspace、校園網路、Wi-Fi、eCourse2、雲端教室、軟體下載與資訊技術諮詢。",
    "function_desc_en": "Supports SSO, WebMail, Microsoft 365, Google Workspace, campus network, Wi-Fi, eCourse2, cloud classrooms, software downloads, and IT consultation.",
    "service_scope_zh": "帳號、信箱、網路、eCourse、校園授權軟體與資訊諮詢。",
    "service_scope_en": "Accounts, email, network, eCourse, campus licensed software, and IT consultation.",
    "common_scenarios_zh": "帳號、信箱、網路、eCourse、校園授權軟體與資訊諮詢。",
    "common_scenarios_en": "Accounts, email, network, eCourse, campus licensed software, and IT consultation.",
    "office_hours": "Mon–Fri 09:00–17:00",
    "phone": "05-2720411 ext 14150",
    "email": "consult@ccu.edu.tw",
    "official_url": "https://it.ccu.edu.tw/",
    "google_maps_query": "國立中正大學圖書資訊大樓",
    "latitude": 23.562975606356652,
    "longitude": 120.47430524970238,
    "source_url": "https://it.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/it_center/entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "library",
    "name_zh": "圖書館",
    "name_en": "National Chung Cheng University Library",
    "category": "office",
    "service_categories": [
      "library",
      "academic_affairs"
    ],
    "building_name_zh": "圖書資訊大樓",
    "building_name_en": "Information and Library Building",
    "floor": "",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "圖書資訊大樓",
    "indoor_location_note_en": "Information and Library Building",
    "function_desc_zh": "提供圖書借還、續借、預約、電子資源、資料庫、期刊、多媒體資源、空間申請、自學空間、館際合作、研究協助與論文上傳服務。",
    "function_desc_en": "Provides borrowing, renewal, reservation, e-resources, databases, journals, multimedia resources, space reservations, self-study spaces, interlibrary loan, research support, and thesis upload.",
    "service_scope_zh": "借書、資料庫、自習與討論空間、館際合作與研究支援。",
    "service_scope_en": "Book borrowing, databases, study/discussion spaces, interlibrary loan, and research support.",
    "common_scenarios_zh": "借書、資料庫、自習與討論空間、館際合作與研究支援。",
    "common_scenarios_en": "Book borrowing, databases, study/discussion spaces, interlibrary loan, and research support.",
    "office_hours": "Weekdays (Mon–Fri)\n08:10 – 21:30\nWeekends (Sat–Sun)\n09:00 – 17:00\nNational Holidays\nClosed on national holidays",
    "phone": "05-2720411 ext 15113",
    "email": "cculibsys@ccu.edu.tw",
    "official_url": "https://www.lib.ccu.edu.tw/",
    "google_maps_query": "國立中正大學圖書館",
    "latitude": 23.5646,
    "longitude": 120.4728,
    "source_url": "https://www.lib.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/library/entrance.jpg"
  },
  {
    "id": "language_center",
    "name_zh": "語言中心",
    "name_en": "Language Center",
    "category": "office",
    "service_categories": [
      "academic_affairs",
      "international_support"
    ],
    "building_name_zh": "圖書資訊大樓",
    "building_name_en": "Information and Library Building",
    "floor": "",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "圖書資訊大樓",
    "indoor_location_note_en": "Information and Library Building",
    "function_desc_zh": "提供英語與外語課程、國際學生華語課程與華語輔導、語言學習輔導、同儕輔導、自學資源與英檢語言測驗資訊。",
    "function_desc_en": "Offers English and foreign language courses, Mandarin courses and support for international students, language tutoring, peer support, self-access resources, and language test information.",
    "service_scope_zh": "外語課程、華語課程、語言輔導與語言測驗資訊。",
    "service_scope_en": "Foreign language courses, Mandarin courses, language support, and test information.",
    "common_scenarios_zh": "外語課程、華語課程、語言輔導與語言測驗資訊。",
    "common_scenarios_en": "Foreign language courses, Mandarin courses, language support, and test information.",
    "office_hours": "Mon–Fri 08:30–12:30, 13:30–17:00",
    "phone": "05-2720411 ext 16711",
    "email": "deptclc@ccu.edu.tw (Language Center); ccuemi@ccu.edu.tw (Inquiries related to the Bilingual Program)",
    "official_url": "https://cls.ccu.edu.tw/",
    "google_maps_query": "國立中正大學圖書資訊大樓",
    "latitude": 23.563286792578907,
    "longitude": 120.4745612917533,
    "source_url": "https://lc.ccu.edu.tw/",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/language_center/entrance.jpg",
    "use_manual_coordinates": true
  }
];

export const departments: Department[] = [
  {
    "id": "college_engineering_office",
    "name_zh": "工學院院辦",
    "name_en": "College of Engineering Administrative Office",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "1F",
    "room_zh": "111辦公室",
    "room_en": "Room 111",
    "indoor_location_note_zh": "創新大樓 1F 111辦公室",
    "indoor_location_note_en": "Innovation Building · 1st Floor · Room 111",
    "function_desc_zh": "工學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Engineering Administrative Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://coe.ccu.edu.tw/",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.5628,
    "longitude": 120.4752,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_engineering/college_engineering_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/college_engineering_office/floor_plan.jpg"
  },
  {
    "id": "college_humanities_office",
    "name_zh": "文學院院辦",
    "name_en": "College of Humanities Office",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "5F",
    "room_zh": "501辦公室",
    "room_en": "Room 501",
    "indoor_location_note_zh": "文學院大樓 5F 501辦公室",
    "indoor_location_note_en": "College of Humanities Building · 5th Floor · Room 501",
    "function_desc_zh": "文學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Humanities Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://colliber.ccu.edu.tw/",
    "google_maps_query": "國立中正大學文學院",
    "latitude": 23.561247279486604,
    "longitude": 120.4732939520733,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_humanities/college_humanities_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/college_humanities_office/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "college_law_office",
    "name_zh": "法學院院辦",
    "name_en": "College of Law Office",
    "category": "department",
    "college_zh": "法學院",
    "college_en": "College of Law",
    "building_name_zh": "法學院大樓",
    "building_name_en": "College of Law Building",
    "floor": "5F",
    "room_zh": "511辦公室",
    "room_en": "Room 511",
    "indoor_location_note_zh": "法學院大樓 5F 511辦公室",
    "indoor_location_note_en": "College of Law Building · 5th Floor · Room 511",
    "function_desc_zh": "法學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Law Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptclaw.ccu.edu.tw/",
    "google_maps_query": "國立中正大學法學院",
    "latitude": 23.5592,
    "longitude": 120.4702,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_law/college_law_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_law/college_law_office/floor_plan.jpg",
    "building_entrance_image": "/images/departments/college_law/college_law_office/building_entrance.jpg"
  },
  {
    "id": "college_social_sciences_office",
    "name_zh": "社會科學院院辦",
    "name_en": "College of Social Sciences Office",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "社會科學院大樓西棟",
    "building_name_en": "West Wing, College of Social Sciences Building",
    "floor": "5F",
    "room_zh": "513辦公室",
    "room_en": "Room 513",
    "indoor_location_note_zh": "社會科學院大樓西棟 5F 513辦公室",
    "indoor_location_note_en": "West Wing, College of Social Sciences Building · 5th Floor · Room 513",
    "function_desc_zh": "社會科學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Social Sciences Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://colsoc.ccu.edu.tw/",
    "google_maps_query": "國立中正大學社會科學院",
    "latitude": 23.56064464374194,
    "longitude": 120.47401539035829,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_social_sciences/college_social_sciences_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/college_social_sciences_office/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "college_education_office",
    "name_zh": "教育學院院辦",
    "name_en": "College of Education Office",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "教育學院大樓",
    "building_name_en": "College of Education Building",
    "floor": "3F",
    "room_zh": "303辦公室",
    "room_en": "Room 303",
    "indoor_location_note_zh": "教育學院大樓 3F 303辦公室",
    "indoor_location_note_en": "College of Education Building · 3rd Floor · Room 303",
    "function_desc_zh": "教育學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Education Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://coledu.ccu.edu.tw/",
    "google_maps_query": "國立中正大學教育學院",
    "latitude": 23.563316978200866,
    "longitude": 120.47666604787,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_education/college_education_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/college_education_office/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "college_science_office",
    "name_zh": "理學院院辦",
    "name_en": "College of Science Office",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院一館（數學館）",
    "building_name_en": "College of Science Building I",
    "floor": "3F",
    "room_zh": "302室",
    "room_en": "Room 302",
    "indoor_location_note_zh": "理學院一館（數學館）3F 302辦公室",
    "indoor_location_note_en": "College of Science Building I · 3rd Floor · Room 302",
    "function_desc_zh": "理學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Science Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://science.ccu.edu.tw/",
    "google_maps_query": "國立中正大學理學院",
    "latitude": 23.564103909894776,
    "longitude": 120.47579618506781,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_science/college_science_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/college_science_office/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "college_management_office",
    "name_zh": "管理學院院辦",
    "name_en": "College of Management Office",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "2F",
    "room_zh": "211辦公室",
    "room_en": "Room 211",
    "indoor_location_note_zh": "管理學院大樓 2F 211辦公室",
    "indoor_location_note_en": "College of Management Building · 2nd Floor · Room 211",
    "function_desc_zh": "管理學院院辦辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "College of Management Office office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://colmgt.ccu.edu.tw/",
    "google_maps_query": "國立中正大學管理學院",
    "latitude": 23.56060697202456,
    "longitude": 120.47638643431472,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": true,
    "entrance_image": "/images/departments/college_management/college_management_office/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/college_management_office/floor_plan.jpg",
    "building_entrance_image": "/images/departments/college_management/college_management_office/building_entrance.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "ee",
    "name_zh": "電機工程學系暨研究所",
    "name_en": "Department of Electrical Engineering",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "工學院一館",
    "building_name_en": "College of Engineering I",
    "floor": "3F",
    "room_zh": "332辦公室",
    "room_en": "Room 332",
    "indoor_location_note_zh": "工學院一館 3F 332辦公室",
    "indoor_location_note_en": "College of Engineering I · 3rd Floor · Room 332",
    "function_desc_zh": "電機工程學系暨研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Electrical Engineering office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://ee.ccu.edu.tw/",
    "google_maps_query": "國立中正大學電機工程學系",
    "latitude": 23.5632,
    "longitude": 120.4762,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/ee/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/ee/floor_plan.jpg"
  },
  {
    "id": "telecom_research",
    "name_zh": "電信研究中心",
    "name_en": "Center for Telecommunication Research",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "4F",
    "room_zh": "414辦公室",
    "room_en": "Room 414",
    "indoor_location_note_zh": "創新大樓 4F 414辦公室",
    "indoor_location_note_en": "Innovation Building · 4th Floor · Room 414",
    "function_desc_zh": "電信研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Center for Telecommunication Research office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://ctr.ccu.edu.tw/",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.562021222913106,
    "longitude": 120.47933791012258,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/telecom_research/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/telecom_research/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "csie_digital_learning",
    "name_zh": "資訊工程學系數位學習科技研究中心",
    "name_en": "CSIE Digital Learning Technology Research Center",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "3F",
    "room_zh": "321辦公室",
    "room_en": "Room 321",
    "indoor_location_note_zh": "創新大樓 3F 321辦公室",
    "indoor_location_note_en": "Innovation Building · 3rd Floor · Room 321",
    "function_desc_zh": "資訊工程學系數位學習科技研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "CSIE Digital Learning Technology Research Center office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.562013847150183,
    "longitude": 120.4792198929258,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/csie_digital_learning/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/csie_digital_learning/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "csie_sponsored_research",
    "name_zh": "資訊工程學系建教合作中心",
    "name_en": "CSIE Center for Sponsored Research Projects",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "3F",
    "room_zh": "320辦公室",
    "room_en": "Room 320",
    "indoor_location_note_zh": "創新大樓 3F 320辦公室",
    "indoor_location_note_en": "Innovation Building · 3rd Floor · Room 320",
    "function_desc_zh": "資訊工程學系建教合作中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "CSIE Center for Sponsored Research Projects office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.561819578208585,
    "longitude": 120.4791716576772,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/csie_sponsored_research/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/csie_sponsored_research/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "csie",
    "name_zh": "資訊工程學系",
    "name_en": "Department of Computer Science and Information Engineering",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "工學院一館",
    "building_name_en": "College of Engineering I",
    "floor": "1F",
    "room_zh": "107辦公室",
    "room_en": "Room 107",
    "indoor_location_note_zh": "工學院一館 1F 107辦公室",
    "indoor_location_note_en": "College of Engineering I · 1st Floor · Room 107",
    "function_desc_zh": "資訊工程學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Computer Science and Information Engineering office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://cs.ccu.edu.tw/",
    "google_maps_query": "國立中正大學資訊工程學系",
    "latitude": 23.5632,
    "longitude": 120.4762,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/csie/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/csie/floor_plan.jpg"
  },
  {
    "id": "comm_eng",
    "name_zh": "通訊工程學系",
    "name_en": "Department of Communications Engineering",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "4F",
    "room_zh": "429辦公室",
    "room_en": "Room 429",
    "indoor_location_note_zh": "創新大樓 4F 429辦公室",
    "indoor_location_note_en": "Innovation Building · 4th Floor · Room 429",
    "function_desc_zh": "通訊工程學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Communications Engineering office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://comm.ccu.edu.tw/",
    "google_maps_query": "國立中正大學通訊工程學系",
    "latitude": 23.562028558306825,
    "longitude": 120.47920384418542,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/comm_eng/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/comm_eng/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "aimhi",
    "name_zh": "前瞻製造系統頂尖研究中心",
    "name_en": "Advanced Institute of Manufacturing with High-Tech Innovations",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "2F",
    "room_zh": "209~210辦公室",
    "room_en": "Room 209~210",
    "indoor_location_note_zh": "創新大樓 2F 209~210辦公室",
    "indoor_location_note_en": "Innovation Building · 2nd Floor · Room 209~210",
    "function_desc_zh": "前瞻製造系統頂尖研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Advanced Institute of Manufacturing with High-Tech Innovations office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://aimhi.ccu.edu.tw/",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.561986762313772,
    "longitude": 120.47917702209521,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/aimhi/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/aimhi/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "ome",
    "name_zh": "光機電整合工程研究所",
    "name_en": "Institute of Opto-Mechatronics Engineering",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "創新大樓",
    "building_name_en": "Innovation Building",
    "floor": "2F",
    "room_zh": "234辦公室",
    "room_en": "Room 234",
    "indoor_location_note_zh": "創新大樓 2F 234辦公室",
    "indoor_location_note_en": "Innovation Building · 2nd Floor · Room 234",
    "function_desc_zh": "光機電整合工程研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Institute of Opto-Mechatronics Engineering office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.561652393890682,
    "longitude": 120.4792521239477,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/ome/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/ome/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "chemical_engineering",
    "name_zh": "化學工程學系",
    "name_en": "Department of Chemical Engineering",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "工學院二館",
    "building_name_en": "College of Engineering II",
    "floor": "3F",
    "room_zh": "322辦公室",
    "room_en": "Room 322",
    "indoor_location_note_zh": "工學院二館 3F 322辦公室",
    "indoor_location_note_en": "College of Engineering II · 3rd Floor · Room 322",
    "function_desc_zh": "化學工程學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Chemical Engineering office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://che.ccu.edu.tw/",
    "google_maps_query": "國立中正大學化學工程學系",
    "latitude": 23.5624,
    "longitude": 120.4764,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/chemical_engineering/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/chemical_engineering/floor_plan.jpg"
  },
  {
    "id": "mechanical_engineering",
    "name_zh": "機械工程學系",
    "name_en": "Department of Mechanical Engineering",
    "category": "department",
    "college_zh": "工學院",
    "college_en": "College of Engineering",
    "building_name_zh": "工學院二館",
    "building_name_en": "College of Engineering II",
    "floor": "3F",
    "room_zh": "314辦公室",
    "room_en": "Room 314",
    "indoor_location_note_zh": "工學院二館 3F 314辦公室",
    "indoor_location_note_en": "College of Engineering II · 3rd Floor · Room 314",
    "function_desc_zh": "機械工程學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Mechanical Engineering office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptime.ccu.edu.tw/",
    "google_maps_query": "國立中正大學機械工程學系",
    "latitude": 23.5624,
    "longitude": 120.4764,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_engineering/mechanical_engineering/entrance.jpg",
    "floor_plan_image": "/images/departments/college_engineering/mechanical_engineering/floor_plan.jpg"
  },
  {
    "id": "athletic_sports",
    "name_zh": "運動競技學系",
    "name_en": "Department of Athletic Sports",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "田徑場",
    "building_name_en": "Track and Field",
    "floor": "1F",
    "room_zh": "108辦公室",
    "room_en": "Room 108",
    "indoor_location_note_zh": "田徑場 1F 108辦公室",
    "indoor_location_note_en": "Track and Field · 1st Floor · Room 108",
    "function_desc_zh": "運動競技學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Athletic Sports office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://das-sle.ccu.edu.tw/",
    "google_maps_query": "國立中正大學運動競技學系",
    "latitude": 23.5586,
    "longitude": 120.4763,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_education/athletic_sports/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/athletic_sports/floor_plan.jpg"
  },
  {
    "id": "graduate_education",
    "name_zh": "教育學研究所",
    "name_en": "Graduate Institute of Education",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "教育學院",
    "building_name_en": "College of Education Building",
    "floor": "4F",
    "room_zh": "409~410辦公室",
    "room_en": "Room 409~410",
    "indoor_location_note_zh": "教育學院 4F 409~410辦公室",
    "indoor_location_note_en": "College of Education Building · 4th Floor · Room 409~410",
    "function_desc_zh": "教育學研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Graduate Institute of Education office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptedu.ccu.edu.tw/",
    "google_maps_query": "國立中正大學教育學院",
    "latitude": 23.563065536234426,
    "longitude": 120.47686540424797,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_education/graduate_education/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/graduate_education/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "educational_gerontology",
    "name_zh": "高齡教育研究中心",
    "name_en": "Institute of Educational Gerontology",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "教育學院",
    "building_name_en": "College of Education Building",
    "floor": "2F",
    "room_zh": "202辦公室",
    "room_en": "Room 202",
    "indoor_location_note_zh": "教育學院 2F 202辦公室",
    "indoor_location_note_en": "College of Education Building · 2nd Floor · Room 202",
    "function_desc_zh": "高齡教育研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Institute of Educational Gerontology office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學教育學院",
    "latitude": 23.563333058775378,
    "longitude": 120.47681117931316,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_education/educational_gerontology/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/educational_gerontology/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "teacher_education",
    "name_zh": "師資培育中心",
    "name_en": "Center for Teacher Education / Graduate Institute of Education",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "教育學院",
    "building_name_en": "College of Education Building",
    "floor": "1F",
    "room_zh": "112辦公室",
    "room_en": "Room 112",
    "indoor_location_note_zh": "教育學院 1F 112辦公室",
    "indoor_location_note_en": "College of Education Building · 1st Floor · Room 112",
    "function_desc_zh": "師資培育中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Center for Teacher Education / Graduate Institute of Education office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://resttc.ccu.edu.tw/",
    "google_maps_query": "國立中正大學教育學院",
    "latitude": 23.56328627891681,
    "longitude": 120.47683510207852,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_education/teacher_education/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/teacher_education/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "adult_continuing_education",
    "name_zh": "成人及繼續教育學系",
    "name_en": "Department of Adult and Continuing Education",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "教育學院",
    "building_name_en": "College of Education Building",
    "floor": "3F",
    "room_zh": "308辦公室",
    "room_en": "Room 308",
    "indoor_location_note_zh": "教育學院 3F 308辦公室",
    "indoor_location_note_en": "College of Education Building · 3rd Floor · Room 308",
    "function_desc_zh": "成人及繼續教育學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Adult and Continuing Education office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://cyiaace.ccu.edu.tw/",
    "google_maps_query": "國立中正大學成人及繼續教育學系",
    "latitude": 23.562982209430057,
    "longitude": 120.47696906956452,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_education/adult_continuing_education/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/adult_continuing_education/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "criminology",
    "name_zh": "犯罪防治學系",
    "name_en": "Department of Criminology",
    "category": "department",
    "college_zh": "教育學院",
    "college_en": "College of Education",
    "building_name_zh": "教育學院",
    "building_name_en": "College of Education Building",
    "floor": "6F",
    "room_zh": "609辦公室",
    "room_en": "Room 609",
    "indoor_location_note_zh": "教育學院 6F 609辦公室",
    "indoor_location_note_en": "College of Education Building · 6th Floor · Room 609",
    "function_desc_zh": "犯罪防治學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Criminology office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptcrm.ccu.edu.tw/",
    "google_maps_query": "國立中正大學犯罪防治學系",
    "latitude": 23.563618885097508,
    "longitude": 120.47629018602217,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_education/criminology/entrance.jpg",
    "floor_plan_image": "/images/departments/college_education/criminology/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "taiwan_lit",
    "name_zh": "台灣文學與創意應用研究所",
    "name_en": "Graduate Institute of Taiwan Literature and Innovation",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "1F",
    "room_zh": "107-1辦公室",
    "room_en": "Room 107-1",
    "indoor_location_note_zh": "文學院大樓 1F 107-1辦公室",
    "indoor_location_note_en": "College of Humanities Building · 1st Floor · Room 107-1",
    "function_desc_zh": "台灣文學與創意應用研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Graduate Institute of Taiwan Literature and Innovation office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://gitlci.ccu.edu.tw/",
    "google_maps_query": "國立中正大學台灣文學與創意應用研究所",
    "latitude": 23.56137285015513,
    "longitude": 120.47375920015418,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/taiwan_lit/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/taiwan_lit/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "chinese_lit",
    "name_zh": "中國文學系",
    "name_en": "Department of Chinese Literature",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "2F",
    "room_zh": "205辦公室",
    "room_en": "Room 205",
    "indoor_location_note_zh": "文學院大樓 2F 205辦公室",
    "indoor_location_note_en": "College of Humanities Building · 2nd Floor · Room 205",
    "function_desc_zh": "中國文學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Chinese Literature office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://litera.ccu.edu.tw/",
    "google_maps_query": "國立中正大學中國文學系",
    "latitude": 23.561153000753983,
    "longitude": 120.47345181584159,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/chinese_lit/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/chinese_lit/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "foreign_languages",
    "name_zh": "外國語文學系",
    "name_en": "Department of Foreign Languages and Literature",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "2F",
    "room_zh": "286辦公室",
    "room_en": "Room 286",
    "indoor_location_note_zh": "文學院大樓 2F 286辦公室",
    "indoor_location_note_en": "College of Humanities Building · 2nd Floor · Room 286",
    "function_desc_zh": "外國語文學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Foreign Languages and Literature office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://fllcccu.ccu.edu.tw/",
    "google_maps_query": "國立中正大學外國語文學系",
    "latitude": 23.5613,
    "longitude": 120.47,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/foreign_languages/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/foreign_languages/floor_plan.jpg"
  },
  {
    "id": "history",
    "name_zh": "歷史學系",
    "name_en": "Department of History",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "2F",
    "room_zh": "208辦公室",
    "room_en": "Room 208",
    "indoor_location_note_zh": "文學院大樓 2F 208辦公室",
    "indoor_location_note_en": "College of Humanities Building · 2nd Floor · Room 208",
    "function_desc_zh": "歷史學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of History office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://depthis.ccu.edu.tw/",
    "google_maps_query": "國立中正大學歷史學系",
    "latitude": 23.5613,
    "longitude": 120.47,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/history/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/history/floor_plan.jpg"
  },
  {
    "id": "east_asian_classics",
    "name_zh": "東亞漢籍與儒學研究中心",
    "name_en": "East Asian Center for Classical Chinese Texts and Confucian Studies",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "2F",
    "room_zh": "203辦公室",
    "room_en": "Room 203",
    "indoor_location_note_zh": "文學院大樓 2F 203辦公室",
    "indoor_location_note_en": "College of Humanities Building · 2nd Floor · Room 203",
    "function_desc_zh": "東亞漢籍與儒學研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "East Asian Center for Classical Chinese Texts and Confucian Studies office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://sites.google.com/view/ccueahcrc/%E9%A6%96%E9%A0%81?authuser=0",
    "google_maps_query": "國立中正大學文學院",
    "latitude": 23.561042363535513,
    "longitude": 120.47338476061616,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/east_asian_classics/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/east_asian_classics/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "philosophy",
    "name_zh": "哲學系",
    "name_en": "Department of Philosophy",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "4F",
    "room_zh": "405辦公室",
    "room_en": "Room 405",
    "indoor_location_note_zh": "文學院大樓 4F 405辦公室",
    "indoor_location_note_en": "College of Humanities Building · 4th Floor · Room 405",
    "function_desc_zh": "哲學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Philosophy office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptphi.ccu.edu.tw/",
    "google_maps_query": "國立中正大學哲學系",
    "latitude": 23.561108015876506,
    "longitude": 120.4734927610213,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/philosophy/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/philosophy/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "linguistics",
    "name_zh": "語言學研究所",
    "name_en": "Graduate Institute of Linguistics",
    "category": "department",
    "college_zh": "文學院",
    "college_en": "College of Humanities",
    "building_name_zh": "文學院大樓",
    "building_name_en": "College of Humanities Building",
    "floor": "4F",
    "room_zh": "410辦公室",
    "room_en": "Room 410",
    "indoor_location_note_zh": "文學院大樓 4F 410辦公室",
    "indoor_location_note_en": "College of Humanities Building · 4th Floor · Room 410",
    "function_desc_zh": "語言學研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Graduate Institute of Linguistics office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://linguist.ccu.edu.tw/",
    "google_maps_query": "國立中正大學語言學研究所",
    "latitude": 23.561301450417588,
    "longitude": 120.4736666448795,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/linguistics/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/linguistics/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "law",
    "name_zh": "法律學系暨研究所",
    "name_en": "Department of Law",
    "category": "department",
    "college_zh": "法學院",
    "college_en": "College of Law",
    "building_name_zh": "法學院大樓",
    "building_name_en": "College of Law Building",
    "floor": "3F",
    "room_zh": "309辦公室",
    "room_en": "Room 309",
    "indoor_location_note_zh": "法學院大樓 3F 309辦公室",
    "indoor_location_note_en": "College of Law Building · 3rd Floor · Room 309",
    "function_desc_zh": "法律學系暨研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Law office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptlaw.ccu.edu.tw/",
    "google_maps_query": "國立中正大學法律學系",
    "latitude": 23.5592,
    "longitude": 120.4702,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_law/law/entrance.jpg",
    "floor_plan_image": "/images/departments/college_law/law/floor_plan.jpg"
  },
  {
    "id": "financial_economic_law",
    "name_zh": "財經法律學系暨研究所",
    "name_en": "Department of Financial and Economic Law",
    "category": "department",
    "college_zh": "法學院",
    "college_en": "College of Law",
    "building_name_zh": "法學院大樓",
    "building_name_en": "College of Law Building",
    "floor": "4F",
    "room_zh": "411辦公室",
    "room_en": "Room 411",
    "indoor_location_note_zh": "法學院大樓 4F 411辦公室",
    "indoor_location_note_en": "College of Law Building · 4th Floor · Room 411",
    "function_desc_zh": "財經法律學系暨研究所辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Financial and Economic Law office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptflaw.ccu.edu.tw/",
    "google_maps_query": "國立中正大學財經法律學系",
    "latitude": 23.5592,
    "longitude": 120.4702,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_law/financial_economic_law/entrance.jpg",
    "floor_plan_image": "/images/departments/college_law/financial_economic_law/floor_plan.jpg"
  },
  {
    "id": "economics",
    "name_zh": "經濟學系",
    "name_en": "Department of Economics",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "2F",
    "room_zh": "206辦公室",
    "room_en": "Room 206",
    "indoor_location_note_zh": "管理學院大樓 2F 206辦公室",
    "indoor_location_note_en": "College of Management Building · 2nd Floor · Room 206",
    "function_desc_zh": "經濟學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Economics office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://econ.ccu.edu.tw/",
    "google_maps_query": "國立中正大學經濟學系",
    "latitude": 23.562,
    "longitude": 120.4695,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/economics/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/economics/floor_plan.jpg"
  },
  {
    "id": "finance",
    "name_zh": "財務金融學系",
    "name_en": "Department of Finance",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "2F",
    "room_zh": "203辦公室",
    "room_en": "Room 203",
    "indoor_location_note_zh": "管理學院大樓 2F 203辦公室",
    "indoor_location_note_en": "College of Management Building · 2nd Floor · Room 203",
    "function_desc_zh": "財務金融學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Finance office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptfin.ccu.edu.tw/",
    "google_maps_query": "國立中正大學財務金融學系",
    "latitude": 23.562,
    "longitude": 120.4695,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/finance/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/finance/floor_plan.jpg"
  },
  {
    "id": "business_administration",
    "name_zh": "企業管理學系",
    "name_en": "Department of Business Administration",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "2F",
    "room_zh": "216辦公室",
    "room_en": "Room 216",
    "indoor_location_note_zh": "管理學院大樓 2F 216辦公室",
    "indoor_location_note_en": "College of Management Building · 2nd Floor · Room 216",
    "function_desc_zh": "企業管理學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Business Administration office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://busadm.ccu.edu.tw/",
    "google_maps_query": "國立中正大學企業管理學系",
    "latitude": 23.562,
    "longitude": 120.4695,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/business_administration/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/business_administration/floor_plan.jpg"
  },
  {
    "id": "ait",
    "name_zh": "會計與資訊科技學系",
    "name_en": "Department of Accounting and Information Technology",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院二館",
    "building_name_en": "College of Management II",
    "floor": "2F",
    "room_zh": "267辦公室",
    "room_en": "Room 267",
    "indoor_location_note_zh": "管理學院二館 2F 267辦公室",
    "indoor_location_note_en": "College of Management II · 2nd Floor · Room 267",
    "function_desc_zh": "會計與資訊科技學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Accounting and Information Technology office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://ait.ccu.edu.tw/",
    "google_maps_query": "國立中正大學會計與資訊科技學系",
    "latitude": 23.5628,
    "longitude": 120.4752,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/ait/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/ait/floor_plan.jpg"
  },
  {
    "id": "ait_excellence",
    "name_zh": "會計與資訊科技卓越中心",
    "name_en": "Center for Excellence in Accounting and Information Technology",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院二館",
    "building_name_en": "College of Management II",
    "floor": "3F",
    "room_zh": "377辦公室",
    "room_en": "Room 377",
    "indoor_location_note_zh": "管理學院二館 3F 377辦公室",
    "indoor_location_note_en": "College of Management II · 3rd Floor · Room 377",
    "function_desc_zh": "會計與資訊科技卓越中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Center for Excellence in Accounting and Information Technology office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.5628,
    "longitude": 120.4752,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/ait_excellence/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/ait_excellence/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "information_management",
    "name_zh": "資訊管理學系",
    "name_en": "Department of Information Management",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "2F",
    "room_zh": "219辦公室",
    "room_en": "Room 219",
    "indoor_location_note_zh": "管理學院大樓 2F 219辦公室",
    "indoor_location_note_en": "College of Management Building · 2nd Floor · Room 219",
    "function_desc_zh": "資訊管理學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Information Management office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://mis.ccu.edu.tw/",
    "google_maps_query": "國立中正大學資訊管理學系",
    "latitude": 23.560367767930487,
    "longitude": 120.47626657838507,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/information_management/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/information_management/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "aging_innovation",
    "name_zh": "高齡跨域創新研究中心",
    "name_en": "Interdisciplinary Center for Aging Innovation",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院二館",
    "building_name_en": "College of Management II",
    "floor": "4F",
    "room_zh": "487辦公室",
    "room_en": "Room 487",
    "indoor_location_note_zh": "管理學院二館 4F 487辦公室",
    "indoor_location_note_en": "College of Management II · 4th Floor · Room 487",
    "function_desc_zh": "高齡跨域創新研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Interdisciplinary Center for Aging Innovation office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.5628,
    "longitude": 120.4752,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/aging_innovation/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/aging_innovation/floor_plan.jpg"
  },
  {
    "id": "fintech_master",
    "name_zh": "金融科技碩士學位學程",
    "name_en": "Master Program in Financial Technology",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "1F",
    "room_zh": "110辦公室",
    "room_en": "Room 110",
    "indoor_location_note_zh": "管理學院大樓 1F 110辦公室",
    "indoor_location_note_en": "College of Management Building · 1st Floor · Room 110",
    "function_desc_zh": "金融科技碩士學位學程辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Master Program in Financial Technology office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://mft.ccu.edu.tw/",
    "google_maps_query": "國立中正大學管理學院",
    "latitude": 23.560524089020632,
    "longitude": 120.47631849317845,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "use_manual_coordinates": true,
    "entrance_image": "/images/departments/college_management/fintech_master/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/fintech_master/floor_plan.jpg"
  },
  {
    "id": "imf",
    "name_zh": "國際財務金融管理碩士學位學程",
    "name_en": "International Master Program in Global Finance (IMF)",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院大樓",
    "building_name_en": "College of Management Building",
    "floor": "1F",
    "room_zh": "110辦公室",
    "room_en": "Room 110",
    "indoor_location_note_zh": "管理學院大樓 1F 110辦公室",
    "indoor_location_note_en": "College of Management Building · 1st Floor · Room 110",
    "function_desc_zh": "國際財務金融管理碩士學位學程辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "International Master Program in Global Finance (IMF) office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://imf.ccu.edu.tw/",
    "google_maps_query": "國立中正大學管理學院",
    "latitude": 23.560555308369434,
    "longitude": 120.47634898591488,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "use_manual_coordinates": true,
    "entrance_image": "/images/departments/college_management/imf/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/imf/floor_plan.jpg"
  },
  {
    "id": "manufacturing_integration",
    "name_zh": "製商整合研究中心",
    "name_en": "Center for Manufacturing Integration",
    "category": "department",
    "college_zh": "管理學院",
    "college_en": "College of Management",
    "building_name_zh": "管理學院二館",
    "building_name_en": "College of Management II",
    "floor": "4F",
    "room_zh": "481辦公室",
    "room_en": "Room 481",
    "indoor_location_note_zh": "管理學院二館 4F 481辦公室",
    "indoor_location_note_en": "College of Management II · 4F · Room 481",
    "function_desc_zh": "製商整合研究中心辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Center for Manufacturing Integration office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "",
    "google_maps_query": "國立中正大學創新大樓",
    "latitude": 23.5628,
    "longitude": 120.4752,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_management/manufacturing_integration/entrance.jpg",
    "floor_plan_image": "/images/departments/college_management/manufacturing_integration/floor_plan.jpg"
  },
  {
    "id": "math",
    "name_zh": "數學系",
    "name_en": "Department of Mathematics",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院一館（數學館）",
    "building_name_en": "College of Science Building I",
    "floor": "3F",
    "room_zh": "309-310辦公室",
    "room_en": "Room 309-310",
    "indoor_location_note_zh": "理學院一館（數學館） 3F 309-310辦公室",
    "indoor_location_note_en": "College of Science Building I · 3rd Floor · Room 309-310",
    "function_desc_zh": "數學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Mathematics office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://math.ccu.edu.tw/",
    "google_maps_query": "國立中正大學數學系",
    "latitude": 23.5639,
    "longitude": 120.4687,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_science/math/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/math/floor_plan.jpg"
  },
  {
    "id": "physics",
    "name_zh": "物理學系",
    "name_en": "Department of Physics",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院一館（物理館）",
    "building_name_en": "College of Science Building I",
    "floor": "2F",
    "room_zh": "204辦公室",
    "room_en": "Room 204",
    "indoor_location_note_zh": "理學院一館（物理館） 2F 204辦公室",
    "indoor_location_note_en": "College of Science Building I · 2nd Floor · Room 204",
    "function_desc_zh": "物理學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Physics office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://physics.ccu.edu.tw/",
    "google_maps_query": "國立中正大學物理學系",
    "latitude": 23.5639,
    "longitude": 120.4687,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_science/physics/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/physics/floor_plan.jpg"
  },
  {
    "id": "chem_biochem",
    "name_zh": "化學暨生物化學系",
    "name_en": "Department of Chemistry and Biochemistry",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院二館",
    "building_name_en": "College of Science Building II",
    "floor": "3F",
    "room_zh": "305辦公室",
    "room_en": "Room 305",
    "indoor_location_note_zh": "理學院二館 3F 305辦公室",
    "indoor_location_note_en": "College of Science Building II · 3rd Floor · Room 305",
    "function_desc_zh": "化學暨生物化學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Chemistry and Biochemistry office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptche.ccu.edu.tw/",
    "google_maps_query": "國立中正大學化學暨生物化學系",
    "latitude": 23.5634,
    "longitude": 120.4679,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_science/chem_biochem/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/chem_biochem/floor_plan.jpg"
  },
  {
    "id": "earth_environment",
    "name_zh": "地球與環境科學系",
    "name_en": "Department of Earth and Environmental Sciences",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院一館（地科館）",
    "building_name_en": "College of Science Building I",
    "floor": "2F",
    "room_zh": "201辦公室",
    "room_en": "Room 201",
    "indoor_location_note_zh": "理學院一館（地科館） 2F 201辦公室",
    "indoor_location_note_en": "College of Science Building I · 2nd Floor · Room 201",
    "function_desc_zh": "地球與環境科學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Earth and Environmental Sciences office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://eq.ccu.edu.tw/",
    "google_maps_query": "國立中正大學地球與環境科學系",
    "latitude": 23.5639,
    "longitude": 120.4687,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_science/earth_environment/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/earth_environment/floor_plan.jpg"
  },
  {
    "id": "biomedical_sciences",
    "name_zh": "生物醫學科學系",
    "name_en": "Department of Biomedical Sciences",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院二館",
    "building_name_en": "College of Science Building II",
    "floor": "2F",
    "room_zh": "235辦公室",
    "room_en": "Room 235",
    "indoor_location_note_zh": "理學院二館 2F 235辦公室",
    "indoor_location_note_en": "College of Science Building II · 2nd Floor · Room 235",
    "function_desc_zh": "生物醫學科學系辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Biomedical Sciences office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://physics.ccu.edu.tw/",
    "google_maps_query": "國立中正大學生物醫學科學系",
    "latitude": 23.5634,
    "longitude": 120.4679,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_science/biomedical_sciences/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/biomedical_sciences/floor_plan.jpg"
  },
  {
    "id": "stemphd",
    "name_zh": "跨領域科學國際博士學位學程",
    "name_en": "STEM PhD Program",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院一館",
    "building_name_en": "College of Science (Building 1)",
    "floor": "3F",
    "room_zh": "R302",
    "room_en": "Room R302",
    "indoor_location_note_zh": "理學院一館 3F R302",
    "indoor_location_note_en": "College of Science (Building 1) · 3F Room R302",
    "function_desc_zh": "辦理跨領域科學國際博士學位學程相關行政業務，包含學程聯繫、學生事務協助與學程辦公室諮詢。",
    "function_desc_en": "Handles administrative affairs for the STEM PhD Program, including program contact, student-related support, and office inquiries.",
    "service_scope_zh": "跨領域科學國際博士學位學程行政聯繫、學生事務協助、學程資訊與辦公室諮詢。行政助理：鄭小姐；電話：+886-(0)5-272-0411 ext. 61004；Fax：+886-(0)5-272-0728；Email：cosia@ccu.edu.tw。",
    "service_scope_en": "Administrative contact, student-related assistance, program information, and office inquiries for the STEM PhD Program. Administrative Assistant: Ms. Cheng; Tel: +886-(0)5-272-0411 ext. 61004; Fax: +886-(0)5-272-0728; E-mail: cosia@ccu.edu.tw.",
    "service_categories": [
      "department_offices"
    ],
    "official_url": "https://stemphd.ccu.edu.tw/",
    "google_maps_query": "國立中正大學理學院一館",
    "latitude": 23.560721193031082,
    "longitude": 120.47410889679124,
    "use_manual_coordinates": true,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_science/stemphd/entrance.jpg",
    "floor_plan_image": "/images/departments/college_science/stemphd/floor_plan.jpg"
  },
  {
    "id": "interdisciplinary_studies",
    "name_zh": "紫荊不分系學士學位學程",
    "name_en": "Bachelor Program in Interdisciplinary Studies",
    "category": "department",
    "college_zh": "其他",
    "college_en": "Other",
    "building_name_zh": "共同教室大樓",
    "building_name_en": "Center for General Education Building",
    "floor": "2F",
    "room_zh": "210辦公室",
    "room_en": "Room 210",
    "indoor_location_note_zh": "共同教室大樓 2F 210辦公室",
    "indoor_location_note_en": "Center for General Education · 2nd Floor · Room 210",
    "function_desc_zh": "紫荊不分系學士學位學程辦公室，提供系所或學院相關行政、課程與學生諮詢服務。",
    "function_desc_en": "Bachelor Program in Interdisciplinary Studies office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": [
      "department_offices",
      "academic_affairs",
      "course_issues"
    ],
    "official_url": "https://deptids.ccu.edu.tw/",
    "google_maps_query": "國立中正大學紫荊不分系學士學位學程",
    "latitude": 23.5628,
    "longitude": 120.4738,
    "source_url": "",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/other/interdisciplinary_studies/entrance.jpg",
    "floor_plan_image": "/images/departments/other/interdisciplinary_studies/floor_plan.jpg"
  },
  {
    "id": "social_welfare",
    "name_zh": "社會福利學系暨研究所",
    "name_en": "Department of Social Welfare",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "社會科學院大樓",
    "building_name_en": "College of Social Sciences Building",
    "floor": "2F",
    "room_zh": "230辦公室",
    "room_en": "Room 230",
    "indoor_location_note_zh": "社會科學院大樓東棟 2F 230辦公室",
    "indoor_location_note_en": "East Wing, College of Social Sciences Building · 2nd Floor · Room 230",
    "function_desc_zh": "社會福利學系暨研究所辦公室，提供系所行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Social Welfare office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://dsw.ccu.edu.tw/",
    "google_maps_query": "國立中正大學社會福利學系",
    "latitude": 23.5636,
    "longitude": 120.4692,
    "source_url": "https://dsw.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/social_welfare/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/social_welfare/floor_plan.jpg"
  },
  {
    "id": "psychology",
    "name_zh": "心理學系暨研究所",
    "name_en": "Department of Psychology",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "社會科學院大樓",
    "building_name_en": "College of Social Sciences Building",
    "floor": "4F",
    "room_zh": "405辦公室",
    "room_en": "Room 405",
    "indoor_location_note_zh": "社會科學院大樓東棟 4F 405辦公室",
    "indoor_location_note_en": "East Wing, College of Social Sciences Building · 4th Floor · Room 405",
    "function_desc_zh": "心理學系暨研究所辦公室，提供系所行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Psychology office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://psy.ccu.edu.tw/",
    "google_maps_query": "國立中正大學心理學系",
    "latitude": 23.5636,
    "longitude": 120.4692,
    "source_url": "https://psy.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/psychology/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/psychology/floor_plan.jpg"
  },
  {
    "id": "political_science",
    "name_zh": "政治學系暨研究所",
    "name_en": "Department of Political Science",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Law Building",
    "building_name_zh": "法學院大樓",
    "building_name_en": "College of Social Sciences Building",
    "floor": "7F",
    "room_zh": "712辦公室",
    "room_en": "Room 712",
    "indoor_location_note_zh": "法學院大樓 7F 712辦公室",
    "indoor_location_note_en": "College of Law Building · 7th Floor · Room 712",
    "function_desc_zh": "政治學系暨研究所辦公室，提供系所行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Political Science office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://polsci.ccu.edu.tw/",
    "google_maps_query": "國立中正大學政治學系",
    "latitude": 23.564325100954154,
    "longitude": 120.47715262114119,
    "source_url": "https://polsci.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/political_science/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/political_science/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "communication",
    "name_zh": "傳播學系含電訊傳播碩士班",
    "name_en": "Department of Communication",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "社會科學院大樓",
    "building_name_en": "College of Social Sciences Building",
    "floor": "2F",
    "room_zh": "212辦公室",
    "room_en": "Room 212",
    "indoor_location_note_zh": "社會科學院大樓西棟 2F 212辦公室",
    "indoor_location_note_en": "West Wing, College of Social Sciences Building · 2nd Floor · Room 212",
    "function_desc_zh": "傳播學系辦公室，提供系所行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Communication office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://telecom.ccu.edu.tw/",
    "google_maps_query": "國立中正大學傳播學系",
    "latitude": 23.5636,
    "longitude": 120.4692,
    "source_url": "https://telecom.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/communication/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/communication/floor_plan.jpg"
  },
  {
    "id": "labor_relations",
    "name_zh": "勞工關係學系暨研究所",
    "name_en": "Department of Labor Relations",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "社會科學院大樓",
    "building_name_en": "College of Social Sciences Building",
    "floor": "5F",
    "room_zh": "528辦公室",
    "room_en": "Room 528",
    "indoor_location_note_zh": "社會科學院大樓東棟 5F 528辦公室",
    "indoor_location_note_en": "East Wing, College of Social Sciences Building · 5F · Room 528",
    "function_desc_zh": "勞工關係學系暨研究所辦公室，提供系所行政、課程與學生諮詢服務。",
    "function_desc_en": "Department of Labor Relations office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://labor.ccu.edu.tw/",
    "google_maps_query": "國立中正大學勞工關係學系",
    "latitude": 23.5636,
    "longitude": 120.4692,
    "source_url": "https://labor.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/labor_relations/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/labor_relations/floor_plan.jpg"
  },
  {
    "id": "isia",
    "name_zh": "戰略暨國際事務研究所",
    "name_en": "Institute of Stratrgy and International Affairs",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "法學院大樓",
    "building_name_en": "College of Law Building",
    "floor": "6F",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "法學院大樓 6F",
    "indoor_location_note_en": "College of Law Building · 6th Floor",
    "function_desc_zh": "戰略暨國際事務研究所辦公室，提供研究所行政、課程與學生諮詢服務。",
    "function_desc_en": "Graduate Institute of Strategic and International Affairs office. Provides administrative, curriculum, and student inquiry services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://isia.ccu.edu.tw/",
    "google_maps_query": "國立中正大學社會科學院",
    "latitude": 23.56419828108415,
    "longitude": 120.47697052841933,
    "source_url": "https://isia.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/isia/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/isia/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "cogsci",
    "name_zh": "認知科學博士學位學程",
    "name_en": "PhD Program in Cognitive Sciences",
    "category": "department",
    "college_zh": "社會科學院",
    "college_en": "College of Social Sciences",
    "building_name_zh": "社會科學院大樓",
    "building_name_en": "College of Social Sciences Building",
    "floor": "5F",
    "room_zh": "510辦公室",
    "room_en": "Room 510",
    "indoor_location_note_zh": "社會科學院大樓西棟 5F 510辦公室",
    "indoor_location_note_en": "West Wing, College of Social Sciences Building · 5th Floor · Room 510",
    "function_desc_zh": "認知科學博士學位學程辦公室，提供跨領域博士課程行政服務。",
    "function_desc_en": "Doctoral Program in Cognitive Science office. Provides interdisciplinary doctoral program administrative services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues"],
    "official_url": "https://cogsci.ccu.edu.tw/",
    "google_maps_query": "國立中正大學社會科學院",
    "latitude": 23.560721193031082,
    "longitude": 120.47410889679124,
    "source_url": "https://cogsci.ccu.edu.tw/",
    "needs_manual_review": false,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/cogsci/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/cogsci/floor_plan.jpg",
    "use_manual_coordinates": true
  },
  {
    "id": "stemphd",
    "name_zh": "跨領域科學國際博士學位學程",
    "name_en": "International PhD Program in Interdisciplinary Science",
    "category": "department",
    "college_zh": "理學院",
    "college_en": "College of Science",
    "building_name_zh": "理學院大樓",
    "building_name_en": "College of Science Building",
    "floor": "",
    "room_zh": "",
    "room_en": "",
    "indoor_location_note_zh": "理學院大樓",
    "indoor_location_note_en": "College of Science Building",
    "function_desc_zh": "跨領域科學國際博士學位學程辦公室，提供國際博士課程行政服務。",
    "function_desc_en": "International PhD Program in Interdisciplinary Science office. Provides international doctoral program administrative services.",
    "service_scope_zh": "系所/學院行政、課程諮詢、修業規定、簽章與學生事務協助。",
    "service_scope_en": "Department/college administration, curriculum inquiries, program regulations, signatures, and student affairs support.",
    "service_categories": ["department_offices", "academic_affairs", "course_issues", "international_support"],
    "official_url": "https://stemphd.ccu.edu.tw",
    "google_maps_query": "國立中正大學理學院",
    "latitude": 23.564187619936725,
    "longitude": 120.47594290811958,
    "source_url": "https://stemphd.ccu.edu.tw",
    "needs_manual_review": false,
    "is_college_office": false,
    "use_manual_coordinates": true
  }
];

export const tasks: Task[] = [
  {
    "id": "arc_resident_visa",
    "task_name_zh": "以居留簽證辦理居留證",
    "task_name_en": "Changing Resident Visa to ARC",
    "scenario_zh": "你剛到台灣，需要在入境或取得居留簽證後30日內申請居留證。",
    "scenario_en": "You just arrived in Taiwan and must apply within 30 days of entry or obtaining a resident visa.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "2吋大頭照",
      "護照",
      "居留簽證",
      "居住證明(OIA提供)",
      "在學或入學許可證明"
    ],
    "required_documents_en": [
      "two-inch photo",
      "passport",
      "resident visa",
      "proof of accommodation(from OIA)",
      "admission permit or certificate"
    ],
    "steps": [
      {
        "zh": "使用線上申辦系統：https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=zh",
        "en": "Using Students Online Application System: https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en"
      },
      {
        "zh": "進入網站註冊帳號",
        "en": "Create and activate an account"
      },
      {
        "zh": "填寫資料並上傳檔案：2吋大頭照、護照、居留簽證、居住證明(OIA提供)、在學或入學許可證明",
        "en": "Fill out the application form and upload required documents: two-inch photo, passport, resident visa, proof of accommodation(from OIA), admission permit or certificate"
      },
      {
        "zh": "資料核准後進行繳費：NT$1,000/年",
        "en": "Pay after approval: NT$1,000/year"
      },
      {
        "zh": "攜帶繳費收據至移民署領取居留證",
        "en": "Bring your payment receipt and collect your ARC at NIA service centers"
      }
    ]
  },
  {
    "id": "arc_visitor_visa",
    "task_name_zh": "以停留簽證辦理居留證",
    "task_name_en": "Changing Visitor Visa to ARC",
    "scenario_zh": "你持有停留簽證但想在台灣待超過六個月，應在簽證到期前15日申請。",
    "scenario_en": "You have a visitor visa but want to stay in Taiwan for more than six months; apply 15 days before your visa expires.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "2吋大頭照",
      "護照",
      "停留簽證",
      "居住證明(OIA提供)",
      "在學或入學許可證明",
      "健康檢查合格證明"
    ],
    "required_documents_en": [
      "two-inch photo",
      "passport",
      "visitor visa",
      "proof of accommodation(from OIA)",
      "admission permit or certificate",
      "health certificate"
    ],
    "steps": [
      {
        "zh": "使用線上申辦系統：https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=zh",
        "en": "Using Students Online Application System: https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en"
      },
      {
        "zh": "進入網站註冊帳號",
        "en": "Create and activate an account"
      },
      {
        "zh": "填寫資料並上傳檔案：2吋大頭照、護照、停留簽證、居住證明(OIA提供)、在學或入學許可證明、健康檢查合格證明",
        "en": "Fill out the application form and upload required documents: two-inch photo, passport, visitor visa, proof of accommodation(from OIA), admission permit or certificate, health certificate"
      },
      {
        "zh": "資料核准後進行繳費：NT$1,000/年 + NT$2,200",
        "en": "Pay after approval: NT$1,000/year and additional fee of NT$2,200"
      },
      {
        "zh": "攜帶繳費收據至移民署領取居留證",
        "en": "Bring your payment receipt and collect your ARC at NIA service centers"
      }
    ]
  },
  {
    "id": "arc_extension",
    "task_name_zh": "申請延期居留證",
    "task_name_en": "Extending an ARC",
    "scenario_zh": "你需要延長在台灣的居留期限（在居留期限到期前3個月內）",
    "scenario_en": "You need to extend your residency in Taiwan(within 3 months before the expiration of residency).",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "2吋大頭照",
      "護照",
      "居留證",
      "在學或註冊證明"
    ],
    "required_documents_en": [
      "two-inch photo",
      "passport",
      "ARC",
      "proof of enrollment"
    ],
    "steps": [
      {
        "zh": "使用線上申辦系統：https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=zh",
        "en": "Using Students Online Application System: https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en"
      },
      {
        "zh": "填寫資料並上傳檔案：2吋大頭照、護照、居留證、在學或註冊證明",
        "en": "Fill out the application form and upload required documents: two-inch photo, passport, ARC,proof of enrollment"
      },
      {
        "zh": "資料核准後進行繳費：NT$1,000/年",
        "en": "Pay after approval: NT$1,000/year"
      },
      {
        "zh": "攜帶繳費收據與舊證至移民署領取新的居留證",
        "en": "Bring your payment receipt and old ARC to collect your new ARC at NIA service centers"
      }
    ]
  },
  {
    "id": "go_to_nia",
    "task_name_zh": "前往移民署",
    "task_name_en": "Go to the National Immigration Agency (NIA)",
    "scenario_zh": "你需要從學校前往嘉義市移民署服務站。",
    "scenario_en": "You need to travel from CCU to the NIA Chiayi City Service Center.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "transportation",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "離學校最近的移民署為嘉義市移民署服務站：https://servicestation.immigration.gov.tw/5880/#",
        "en": "The nearest NIA is the NIA Chiayi City Service Center: https://servicestation.immigration.gov.tw/5880/#"
      },
      {
        "zh": "根據Google地圖指示前往目的地：https://reurl.cc/M2M8GW",
        "en": "Follow the directions on Google Maps to reach your destination: https://reurl.cc/M2M8GW"
      },
      {
        "zh": "服務時間：星期一至星期五 08:00 - 17:00",
        "en": "Office hours: Mon to Fri 08:00 - 17:00"
      },
      {
        "zh": "電話號碼：(05) 216 - 6100",
        "en": "TEL: (05) 216 - 6100"
      },
      {
        "zh": "地址：嘉義市東區吳鳳北路184號2樓",
        "en": "Adress: No. 184, Wufeng North Road, East District, Chiayi City, 2nd Floor"
      }
    ]
  },
  {
    "id": "resident_visa_degree",
    "task_name_zh": "申請居留簽證（學位生）",
    "task_name_en": "Apply for Resident Visa (Degree-Seeking Student)",
    "scenario_zh": "你是學位生，需要申請簽證。",
    "scenario_en": "You are a degree-seeking student who needs to apply for a visa.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "申請表",
      "2吋大頭照x2",
      "護照",
      "健康檢查合格證明",
      "入學許可或通知",
      "最高學歷畢業證書與歷年成績單",
      "財力證明"
    ],
    "required_documents_en": [
      "application form",
      "two-inch photo x2",
      "passport",
      "health certificate",
      "admission permit",
      "highest education diploma and transcripts",
      "proof of financial support"
    ],
    "steps": [
      {
        "zh": "線上填寫申請表並列印簽名：https://www.boca.gov.tw/fp-9-185-35222-1.html",
        "en": "Fill out the application form online, then print and sign it: https://www.boca.gov.tw/cp-166-283-c4da3-2.html"
      },
      {
        "zh": "準備文件（含正影本）：申請表、2吋大頭照x2、護照、健康檢查合格證明、入學許可或通知、最高學歷畢業證書與歷年成績單、財力證明",
        "en": "Prepare the required documents(original and photocopy): application form, two-inch photo x2, passport, health certificate, admission permit, highest education diploma and transcripts, proof of financial support"
      },
      {
        "zh": "費用： https://www.boca.gov.tw/cp-396-32-4a369-1.html",
        "en": "application fees: https://www.boca.gov.tw/cp-396-32-4a369-1.html"
      },
      {
        "zh": "提交上述文件至中華民國駐外館處申請",
        "en": "Submit the above documents to Taiwan overseas missions to apply"
      }
    ]
  },
  {
    "id": "resident_visa_exchange_year",
    "task_name_zh": "申請居留簽證（學年交換生）",
    "task_name_en": "Apply for Resident Visa (Year-Long Exchange Student)",
    "scenario_zh": "你是交換生，會在台灣待超過六個月。",
    "scenario_en": "You are an exchange student staying in Taiwan for more than six months.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "申請表",
      "2吋大頭照x2",
      "護照",
      "健康檢查合格證明",
      "大專校院核准函",
      "就讀學校入學許可/通知",
      "國外就讀學校之在學證明"
    ],
    "required_documents_en": [
      "application form",
      "two-inch photo x2",
      "passport",
      "health certificate",
      "letter of approval issued by university",
      "admission permit",
      "overseas school’s record of enrollment"
    ],
    "steps": [
      {
        "zh": "線上填寫申請表並列印簽名：https://www.boca.gov.tw/cp-402-186-c060a-1.html",
        "en": "Fill out the application form online, then print and sign it: https://www.boca.gov.tw/cp-166-284-6f5f7-2.html"
      },
      {
        "zh": "準備文件（含正影本）：申請表、2吋大頭照x2、護照、健康檢查合格證明、大專校院核准函、就讀學校入學許可/通知、國外就讀學校之在學證明",
        "en": "Prepare the required documents(original and photocopy): application form, two-inch photo x2, passport, health certificate, letter of approval issued by university, admission permit, overseas school’s record of enrollment"
      },
      {
        "zh": "費用： https://www.boca.gov.tw/cp-396-32-4a369-1.html",
        "en": "application fees: https://www.boca.gov.tw/cp-396-32-4a369-1.html"
      },
      {
        "zh": "提交上述文件至中華民國駐外館處申請",
        "en": "Submit the above documents to Taiwan overseas missions to apply"
      }
    ]
  },
  {
    "id": "visitor_visa_exchange_semester",
    "task_name_zh": "申請停留簽證（學期交換生）",
    "task_name_en": "Apply for Visitor Visa (Semester Exchange Student)",
    "scenario_zh": "你是交換生，只會在台灣待六個月以內。",
    "scenario_en": "You are an exchange student staying in Taiwan for less than six months.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "申請表",
      "2吋大頭照x2",
      "護照",
      "大專校院核准函",
      "就讀學校入學許可/通知",
      "國外就讀學校之在學證明"
    ],
    "required_documents_en": [
      "application form",
      "two-inch photo x2",
      "passport",
      "letter of approval issued by university",
      "admission permit",
      "overseas school’s record of enrollment"
    ],
    "steps": [
      {
        "zh": "線上填寫申請表並列印簽名：https://www.boca.gov.tw/cp-400-4336-94cdb-1.html",
        "en": "Fill out the application form online, then print and sign it: https://www.boca.gov.tw/cp-158-4342-a78b4-2.html"
      },
      {
        "zh": "準備文件（含正影本）：申請表、2吋大頭照x2、護照、大專校院核准函、就讀學校入學許可/通知、國外就讀學校之在學證明",
        "en": "Prepare the required documents(original and photocopy): application form, two-inch photo x2, passport, letter of approval issued by university, admission permit, overseas school’s record of enrollment"
      },
      {
        "zh": "費用： https://www.boca.gov.tw/cp-396-32-4a369-1.html",
        "en": "application fees: https://www.boca.gov.tw/cp-158-4342-a78b4-2.html"
      },
      {
        "zh": "提交上述文件至中華民國駐外館處申請",
        "en": "Submit the above documents to Taiwan overseas missions to apply"
      }
    ]
  },
  {
    "id": "find_oia",
    "task_name_zh": "找國際處",
    "task_name_en": "Go to the Office of International Affairs (OIA)",
    "scenario_zh": "你有簽證、居留證、獎學金或國際學生相關問題需要協助。",
    "scenario_en": "You need help with visa, ARC, scholarships, or international student-related issues.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "前往碩博士宿舍旁標有國際處的建築（位於斜坡最底下）",
        "en": "Go to the building labeled \"Office of International Affairs\" next to the Graduate Dormitories (Located at the bottom of the slope)"
      },
      {
        "zh": "進入建築後，右轉上二樓，即是國際處",
        "en": "Enter the building, turn right, and go up to the 2nd floor, where you will find the OIA"
      },
      {
        "zh": "依循辦公室門牌尋找對應的辦理窗口",
        "en": "Follow the room signs to find the specific office you need"
      },
      {
        "zh": "向櫃台工作人員說明你的需求",
        "en": "Present your inquiry to the staff at the counter"
      }
    ]
  },
  {
    "id": "new_student_health_check",
    "task_name_zh": "辦理新生健康檢查",
    "task_name_en": "Complete New Student Health Examination",
    "scenario_zh": "你是新生，需要完成學校規定的新生健康檢查。",
    "scenario_en": "As a new student, you need to complete the required health examination.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [
      "護照",
      "費用",
      "CCU健康檢查表",
      "其他所需文件"
    ],
    "required_documents_en": [
      "passport",
      "fees",
      "CCU health examination form",
      "other required documents"
    ],
    "steps": [
      {
        "zh": "參考國際處手冊內所列的詳細時間、所需文件、費用",
        "en": "Refer to the International Office handbook for detailed schedules, required documents, and fees"
      },
      {
        "zh": "檢查當天請攜帶護照、費用、CCU健康檢查表及其他所需文件",
        "en": "Bring your passport, fees, CCU health examination form and other required documents on the day of the check-up"
      },
      {
        "zh": "前往禮堂完成基本身體測量與檢查項目",
        "en": "Go to the auditorium to complete basic physical measurements and examinations"
      },
      {
        "zh": "約45天後將通知你前往系辦領取健檢報告（如果你是來自國際處的交換生，請至國際處領取）",
        "en": "You will be notified approximately 45 days later to collect your health check-up report from the department office(if you are an exchange student from OIA, please go to OIA to collect it)"
      }
    ]
  },
  {
    "id": "health_doc_reprint",
    "task_name_zh": "健康檢查文件補印",
    "task_name_en": "Reprinting Health Check Documents",
    "scenario_zh": "你在健康檢查時忘了帶疫苗證明影本或其他文件。",
    "scenario_en": "You forgot to bring vaccination records or other documents during the health check.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [
      "疫苗證明影本或其他文件"
    ],
    "required_documents_en": [
      "a copy of your vaccination records or other required documents"
    ],
    "steps": [
      {
        "zh": "如果你有電子檔，可到校內資訊處、全家、或其它地方列印",
        "en": "If you have an electronic file, you can print it at the Office of information technology, FamilyMart or other locations in campus"
      },
      {
        "zh": "若你身邊沒有任何資料，請至衛生保健組或國際處尋求幫助",
        "en": "If you do not have any materials with you, please seek assistance from Health Services Division or OIA"
      }
    ]
  },
  {
    "id": "campus_basic_medical",
    "task_name_zh": "校內簡易醫療服務",
    "task_name_en": "On-Campus Basic Medical Services",
    "scenario_zh": "你身體不舒服或受傷，需要簡易處理。",
    "scenario_en": "You are feeling unwell or have a minor injury and need basic treatment.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "衛生保健組提供簡易傷口處理",
        "en": "Health Services Division provides basic wound care and injury treatment"
      },
      {
        "zh": "衛生保健組提供器材借用，含冷熱敷袋、體溫計、拐杖、輪椅",
        "en": "Health Services Division provides equipment for short-term loan, including hot/cold packs, thermometers, crutches, and wheelchairs"
      },
      {
        "zh": "衛生保健組提供簡易測量，含血壓、體溫、身高體重、體脂、腰圍",
        "en": "Health Services Division provides basic health measurements, including blood pressure, body temperature, height, weight, body fat, and waist circumference"
      },
      {
        "zh": "學士班C棟學生宿舍提供換藥服務（寒暑假無提供服務）",
        "en": "Undergraduate student dormitory in building C provides dressing change services(is not available during winter or summer breaks)"
      }
    ]
  },
  {
    "id": "graduation_eligibility",
    "task_name_zh": "確認畢業資格",
    "task_name_en": "Confirming Graduation Eligibility",
    "scenario_zh": "你即將畢業，想確認自己是否符合畢業資格。",
    "scenario_en": "You are nearing graduation and want to confirm eligibility.",
    "target_unit_type": "department",
    "target_unit_id": "college_management_office",
    "category_id": "academic_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "前往系辦網站尋找修業規定（若英文版網站查無資料，你可能會需要使用到中文版網站，並自行翻譯修業規定內容）",
        "en": "Visit the department website to find the study regulation (If the information is not available on the English website, you may need to use the Chinese website and translate the study regulation yourself)"
      },
      {
        "zh": "若你在網站上無法找到資料，請至系辦確認畢業學分相關規定",
        "en": "If you cannot find the information on the website, please go to the department office to confirm the regulations regarding graduation credits"
      },
      {
        "zh": "檢視在選課系統上的畢業資格審查表，確認還缺多少學分",
        "en": "Review graduation requirement checklist on course selection system to confirm how many credits you are still missing"
      },
      {
        "zh": "若有缺少學分，請儘速與指導教授或系辦討論補救方式",
        "en": "If you are missing credits, please discuss remedial measures with your advisor or the department office as soon as possible"
      }
    ]
  },
  {
    "id": "scholarship",
    "task_name_zh": "申請獎學金",
    "task_name_en": "Apply for Scholarship",
    "scenario_zh": "你想了解並申請學校或校外獎學金。",
    "scenario_en": "You want to learn about and apply for scholarships.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [
      "所需文件"
    ],
    "required_documents_en": [
      "required documents"
    ],
    "steps": [
      {
        "zh": "為了能領取獎學金，你需要先在校內郵局開設一個帳戶",
        "en": "To receive your scholarship, you need to open a postal account at the on-campus Post Office"
      },
      {
        "zh": "至國際處網站查看目前開放的獎學金項目：https://oia.ccu.edu.tw/p/412-1008-3967.php?Lang=zh-tw",
        "en": "Check OIA website for currently available scholarships: https://oia.ccu.edu.tw/p/412-1008-3967.php?Lang=en"
      },
      {
        "zh": "確認申請資格與截止日期",
        "en": "Confirm eligibility requirements and application deadlines"
      },
      {
        "zh": "備妥所需文件並於期限內提交至國際處",
        "en": "Prepare required documents and submit before the deadline"
      },
      {
        "zh": "等待審核結果通知",
        "en": "Wait for review result notification"
      }
    ]
  },
  {
    "id": "suspension",
    "task_name_zh": "申請休學",
    "task_name_en": "Apply for Suspension",
    "scenario_zh": "你因個人、健康或其他原因需要申請暫時停學。",
    "scenario_en": "You need to apply for suspension of studies.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "休學申請表"
    ],
    "required_documents_en": [
      "Application Form for Suspension"
    ],
    "steps": [
      {
        "zh": "休學期間以一學期、一學年或二學年為期，累計以不超過二學年為原則",
        "en": "The duration of suspension can be one semester, one academic year, or two academic years, with a total limit of two academic years in principle"
      },
      {
        "zh": "於教務處網站上下載休學申請表，並閱讀文件內所附的辦理流程： https://oaa.ccu.edu.tw/p/406-1004-14288,r1960.php?Lang=zh-tw",
        "en": "Download the Application Form for Suspension from the Office of Academic Affairs website and read the attached procedures: https://oaa.ccu.edu.tw/p/406-1004-14288,r1960.php?Lang=zh-tw"
      },
      {
        "zh": "至SSO網路離校系統辦理離校手續：https://www026182.ccu.edu.tw/hZhUp6Fqyr8lLbHHA",
        "en": "Complete the departure clearance via the Online Leave System in SSO: https://www026182.ccu.edu.tw/hZhUp6Fqyr8lLbHHA"
      },
      {
        "zh": "等待各單位網路審核通過（若有單位審核未通過，則需親自到該單位詢問）",
        "en": "Wait for online approval from all departments (if any department disapprove your application, you must visit that department in person to inquire)"
      },
      {
        "zh": "網路審核通過後，請列印休學申請表，依照申請表需求進行填寫與取得各單位的簽名",
        "en": "After online approval is granted, print the application form, fill it out as required, and obtain the signatures from the respective departments"
      },
      {
        "zh": "若辦理完成，教務處教學組將核發休學同意涵",
        "en": "Once completed, the Curriculum Division of the Office of Academic Affairs will issue the Suspension Approval Letter"
      },
      {
        "zh": "國際生注意：休學期間居留證效力需另行確認（洽國際處）",
        "en": "Note for International Students: Confirm the impact on your ARC or visa status during leave (contact OIA)"
      }
    ]
  },
  {
    "id": "arc_after_suspension",
    "task_name_zh": "休學後的居留證處理",
    "task_name_en": "Handling Your ARC After Suspension of Studies",
    "scenario_zh": "你打算休學，但不確定是否能繼續留在台灣。",
    "scenario_en": "You plan to suspend studies and are unsure whether you can remain in Taiwan.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "一但畢業、休學、退學，你便無法再以就學為理由待在台灣（除非你有繼續居留在台灣的其他理由並經移民署核准）",
        "en": "Once you graduate, suspend your studies, or withdraw, you no longer be able to stay in Taiwan under the reason of studying(unless you have other reason for continued residence in Taiwan and have approved by NIA)"
      },
      {
        "zh": "如果你沒有其他居留理由，你需要在期限內將居留證繳回移民署，並辦理出境",
        "en": "If you have no other reason for residency, you must return your ARC to NIA and depart from Taiwan within the specified deadline"
      },
      {
        "zh": "休學結束返台時，需重新申請簽證",
        "en": "When returning to Taiwan after your suspension ends, you must re-apply for a visa"
      }
    ]
  },
  {
    "id": "registration_degree",
    "task_name_zh": "辦理入學報到手續（學位生）",
    "task_name_en": "Complete Registration Procedure (Degree-Seeking Student)",
    "scenario_zh": "你是剛到學校的學位生，需要完成入學報到流程。",
    "scenario_en": "You are a degree-seeking student who just arrived and need to complete registration.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "registration",
    "required_documents_zh": [
      "國際處手冊上提供的所需文件"
    ],
    "required_documents_en": [
      "required documents provided in the OIA handbook"
    ],
    "steps": [
      {
        "zh": "參考國際處手冊上提供的資訊與辦理流程，並準備需要的文件",
        "en": "Refer to the information and procedures provided in the OIA handbook and prepare the required documents"
      },
      {
        "zh": "辦理宿舍入住",
        "en": "Handle your dormitory check-in"
      },
      {
        "zh": "至學籍資料登錄系統填寫資料：https://www026198.ccu.edu.tw/academic/",
        "en": "Fill out the required information in the Student Academic Record Entry System: https://www026198.ccu.edu.tw/academic/"
      },
      {
        "zh": "列印繳費單並繳費：https://school.bot.com.tw/newTwbank/mobile/login.aspx 和https://cdn.gamma.app/m7bhp5q4xrar3i8/4bade826d004445fa87ca5b00d019599/original/How-to-get-the-payment-receipt.pdf.pdf",
        "en": "Print the payment receipt and pay the fees: https://school.bot.com.tw/newTwbank/mobile/login.aspx and https://cdn.gamma.app/m7bhp5q4xrar3i8/4bade826d004445fa87ca5b00d019599/original/How-to-get-the-payment-receipt.pdf.pdf"
      },
      {
        "zh": "準備所需資料至國際處報到",
        "en": "Bring the required documents to OIA to complete the registration"
      },
      {
        "zh": "準備所需資料至教務處教學組報到",
        "en": "Bring the required documents to report to Division of Curriculum and Instruction to  complete the registration"
      },
      {
        "zh": "所有程序完成後，即可從教學組拿到學生證",
        "en": "Once all procedures are completed, you can receive your Student ID card from Division of Curriculum and Instruction"
      }
    ]
  },
  {
    "id": "registration_exchange",
    "task_name_zh": "辦理入學報到手續（交換生）",
    "task_name_en": "Complete Registration Procedure (Exchange Student)",
    "scenario_zh": "你是剛到學校的交換生，需要完成入學報到流程。",
    "scenario_en": "You are an exchange student who just arrived and need to complete registration.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "registration",
    "required_documents_zh": [
      "國際處手冊上提供的所需文件"
    ],
    "required_documents_en": [
      "required documents provided in the OIA handbook"
    ],
    "steps": [
      {
        "zh": "參考國際處手冊上提供的資訊與辦理流程，並準備需要的文件",
        "en": "Refer to the information and procedures provided in the OIA handbook and prepare the required documents"
      },
      {
        "zh": "辦理宿舍入住",
        "en": "Handle your dormitory check-in"
      },
      {
        "zh": "準備所需資料至國際處報到",
        "en": "Bring the required documents to OIA to complete the registration"
      },
      {
        "zh": "從國際處取得報到手續單、學生證、宿舍繳費單，並完成繳費",
        "en": "Obtain your Registration Sheet, student ID card and dormitory payment sheet from OIA, and complete the payment."
      },
      {
        "zh": "前往你的系辦報到",
        "en": "Bring the required documents to your department office to complete the registration"
      },
      {
        "zh": "於選課期間選課，並列印選課申請表給教授與系主任簽章：https://cross-school.ccu.edu.tw/index.php?language=c",
        "en": "Select your courses during the course selection period, and print the Course Selection Application Form to obtain the required signatures from the professors and the director of your host department: https://cross-school.ccu.edu.tw/index.php?language=e"
      },
      {
        "zh": "完成簽章後，將選課申請表提交給教學組，以取得eCourse使用權限",
        "en": "After obtaining the signatures, submit the  Course Selection Application Form to Division of Curriculum and Instruction to gain access to use eCourse"
      },
      {
        "zh": "將已完成的報到手續單提交給國際處",
        "en": "Submit the completed Registration Sheet to OIA"
      }
    ]
  },
  {
    "id": "tuition_fee",
    "task_name_zh": "辦理各學期註冊與繳交學雜費",
    "task_name_en": "Pay Tuition and Fees to Complete Semester Registration",
    "scenario_zh": "你每學期都需要完成正式註冊與繳交學費。",
    "scenario_en": "You need to complete formal registration and pay tuition each semester.",
    "target_unit_type": "office",
    "target_unit_id": "cashier",
    "category_id": "tuition",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "依學校通知於期限內繳交學雜費（通常為每學期開學前）",
        "en": "Pay your tuition and fees within the deadline according to school notifications (usually before the start of each semester)"
      },
      {
        "zh": "登入繳費網站進行繳費（登入資訊可參考國際處提供的資料：https://cdn.gamma.app/m7bhp5q4xrar3i8/4bade826d004445fa87ca5b00d019599/original/How-to-get-the-payment-receipt.pdf.pdf）",
        "en": "Log in to the payment website to make the payment (for login information, refer to the file provided by OIA: https://cdn.gamma.app/m7bhp5q4xrar3i8/4bade826d004445fa87ca5b00d019599/original/How-to-get-the-payment-receipt.pdf.pdf)."
      },
      {
        "zh": "繳費後，即完成註冊手續",
        "en": "Once the payment is made, the registration process is complete"
      }
    ]
  },
  {
    "id": "department_transfer",
    "task_name_zh": "轉系申請",
    "task_name_en": "Application for Transfer to Another Department",
    "scenario_zh": "你想申請轉到其他學系。",
    "scenario_en": "You want to apply for an internal transfer to another department.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "歷年成績單：幾乎多數學系皆要求檢附，且經常規定成績單上必須包含班級排名。",
      "轉系理由書／動機說明：多系要求申請者撰寫轉系理由，部分科系有字數或語言限制（例如：中文系與歷史系要求300至500字、外文系要求以英文撰寫且250字為限）。",
      "未來修課規劃／研讀計畫：部分學系（如生醫系、政治系、會資系）會要求檢附未來的研讀與修課規劃書。",
      "其他有利審查資料：部分學系鼓勵或視實際需要要求繳交其他有利審查的資料，例如自我介紹、相關專業科目成績表現等。外文系另有規定須符合相當等級的英文能力檢定成績（如多益800分或全民英檢中高級複試等）。",
      "特殊身分證明文件：若申請特定學系（如運技系），需額外檢附校隊證明資料或運動績優獨招入學證明。"
    ],
    "required_documents_en": [
      "Official academic transcript: Most departments require this, and many specify that class ranking must be included.",
      "Statement of purpose / transfer motivation letter: Many departments require applicants to explain their reasons for transferring. Some impose word limits or language requirements (e.g., the Department of Chinese Literature and the Department of History require 300–500 words in Chinese; the Department of Foreign Languages requires an essay in English, limited to 250 words).",
      "Study plan / future course plan: Some departments (such as Biomedical Sciences, Political Science, and Accounting & Information Systems) require a proposed study plan.",
      "Supporting materials: Some departments encourage or require additional materials, such as a self-introduction or evidence of academic performance in relevant subjects. The Department of Foreign Languages also requires proof of English proficiency, such as a TOEIC score of 800 or passing the High-Intermediate GEPT speaking and writing test.",
      "Special status documentation: Applicants to certain departments (e.g., Athletic Performance) must submit additional documentation, such as proof of university team membership or admission through athletic excellence."
    ],
    "steps": [
      {
        "zh": "書面審查（初審）：由各學系所的招生委員會或系所事務委員會，針對申請者繳交的成績單、轉系理由書及有利資料進行初步資格審查與評分。",
        "en": "Document review (initial review): The department's admissions or academic affairs committee reviews transcripts, the transfer statement, and supporting materials."
      },
      {
        "zh": "面談／口試（複審）：許多學系（涵蓋文、理、社科、工、管、法、教育等學院）規定申請者必須與系主任或轉系審查委員進行面談或口試，以此表現來決定錄取順序或名額。",
        "en": "Interview / oral examination (secondary review): Many departments require applicants to attend an interview or oral examination with the department chair or review committee."
      },
      {
        "zh": "轉系考試：部分特定學系會舉辦專業科目考試。",
        "en": "Departmental examination: Some departments may administer subject-specific examinations."
      },
      {
        "zh": "結果決議：最後將綜合書面審查成績、面談（或考試）表現以及原學系成績，由各學系的招生委員會或系務會議進行複審，決定最終錄取與備取名單。",
        "en": "Final decision: Admission decisions are made based on document review, interview or examination performance, and academic records from the original department."
      }
    ]
  },
  {
    "id": "course_syllabus",
    "task_name_zh": "課程大綱",
    "task_name_en": "Course Syllabus",
    "scenario_zh": "你需要查詢課程目標、進度與評分標準，或申請正式紙本課綱。",
    "scenario_en": "You need to check course objectives, schedule, grading criteria, or request an official syllabus.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "course_issues",
    "required_documents_zh": [
      "線上一般查詢：無須準備任何實體文件",
      "申請紙本核章認證（如適用）：自行於系統列印下來的課程大綱紙本",
      "歷年成績單（用以證明確實曾修習並通過該門課程）",
      "身分證明文件（如學生證）"
    ],
    "required_documents_en": [
      "For online inquiry:No physical documents are required.",
      "For official hard-copy certification (if applicable): Printed course syllabus from the system.",
      "Official transcript showing successful completion of the course.",
      "Identification (e.g., student ID)."
    ],
    "steps": [
      {
        "zh": "線上查詢流程：登入或前往中正大學教務系統 (https://kiki.ccu.edu.tw/)。",
        "en": "Online inquiry: Log in to the CCU academic system: [https://kiki.ccu.edu.tw/](https://kiki.ccu.edu.tw/)"
      },
      {
        "zh": "於網頁選單中找到「資料查詢」區塊，點選「開課資料查詢」。",
        "en": "Select \"Course Information Search\" under the \"Information Search\" menu."
      },
      {
        "zh": "依照您的需求，點選對應的學期與系統。",
        "en": "Choose the relevant semester."
      },
      {
        "zh": "進入查詢介面後，輸入系所、課程名稱或教師姓名進行條件檢索。",
        "en": "Enter the department, course title, or instructor's name."
      },
      {
        "zh": "點擊搜尋結果中的課程連結，即可檢視詳細的課程大綱與每週進度。",
        "en": "Click the course link to view the full syllabus and weekly schedule."
      },
      {
        "zh": "紙本核章流程（若需正式證明）：依上述流程查到課程大綱後，將網頁內容完整列印。",
        "en": "Official certification: Print the complete syllabus."
      },
      {
        "zh": "攜帶列印出的課程大綱與歷年成績單，前往「該課程的開課系所辦公室」請系所助理初步確認並核章。",
        "en": "Bring the printed syllabus and transcript to the offering department office for initial verification and endorsement."
      },
      {
        "zh": "若需求單位（如國外學校）要求需有學校教務處戳章，再送至教務處教學組加蓋認證章即可完成辦理。",
        "en": "If an official university stamp is required, submit the endorsed documents to the Curriculum Division of the Office of Academic Affairs for certification."
      }
    ]
  },
  {
    "id": "course_override",
    "task_name_zh": "必修課滿了怎麼辦（加簽）",
    "task_name_en": "What to Do If a Required Course Is Full (Course Override)",
    "scenario_zh": "必修課人數已滿，或沒有成功選到想要的課。",
    "scenario_en": "A required course is full or you could not enroll in the desired course.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "course_issues",
    "required_documents_zh": [
      "科目加簽單：需透過選課系統線上操作產生並列印，並於表單上填寫具體的「加簽理由」。"
    ],
    "required_documents_en": [
      "Course override request form generated through the registration system."
    ],
    "steps": [
      {
        "zh": "線上申請與列印：於第二階段選課期間登入選課系統。在加選功能中，部分科目會出現「加簽」選項。點選該選項並確認後，系統會產生該科目的加簽單，請自行列印。",
        "en": "Log in during the second-stage registration period."
      },
      {
        "zh": "填寫理由與核章：於紙本加簽單上填寫完整的加簽理由，並親自拿給「授課教師」與「開課系所主管」簽名同意。",
        "en": "Select the \"Override\" option if available and print the form.\nComplete the reason section and obtain signatures from the instructor and department chair."
      },
      {
        "zh": "實體送件：將完成核章的加簽單，親自送至「教務處教學組」辦理審核。",
        "en": "Submit the signed form to the Curriculum Division."
      },
      {
        "zh": "自行上網選課：教學組核可後，務必於選課截止前自行上網點選該課程，才算真正完成加選。\n\n例外情況（特例辦理）：由於加簽選項是由系統自行判斷產生，如果系統上沒有顯示某科目的加簽選項，但同學確實有強烈的加簽需求（例如為畢業必修等），請直接洽詢「教務處教學組」，以特例方式協助辦理。",
        "en": "After approval, complete the course add process online before the registration deadline.\nSpecial Case:\nIf the override option does not appear in the system but you have a compelling need (e.g., graduation requirement), contact the Curriculum Division directly for assistance."
      }
    ]
  },
  {
    "id": "exchange_ecourse_account",
    "task_name_zh": "交換生剛開學時沒有 eCourse 帳號",
    "task_name_en": "Exchange Students Do Not Have an eCourse Account at the Beginning of the Semester",
    "scenario_zh": "交換生不知道如何登入 eCourse2。",
    "scenario_en": "Exchange students do not know how to log in to eCourse2.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [
      "交換生的專屬學號。",
      "可連線上網的電腦或行動裝置。"
    ],
    "required_documents_en": [
      "Your student ID number.",
      "A computer or mobile device with internet access."
    ],
    "steps": [
      {
        "zh": "登入學籍系統修改預設密碼：請先前往中正大學的「校際生學籍系統」（https://www026168.ccu.edu.tw/）。首次登入時，系統的預設帳號與密碼皆為學生的學號。",
        "en": "Visit the Intercollegiate Student Academic System: https://www026168.ccu.edu.tw/"
      },
      {
        "zh": "登入後修改密碼。",
        "en": "Log in using your student ID as both username and default password."
      },
      {
        "zh": "等待約 10 分鐘讓系統同步。",
        "en": "Change your password."
      },
      {
        "zh": "同步完成後，前往 eCourse2，使用「Non-CCU Faculty/Student Login」登入。",
        "en": "Wait approximately 10 minutes for synchronization."
      },
      {
        "zh": "帳號格式為 ccu 加上學號，例如 ccu123456789；密碼為剛剛更新後的新密碼。",
        "en": "Log in to eCourse2 via the \"Non-CCU Faculty/Student Login\" portal. Username: ccu + your student ID (e.g., ccu123456789). Password: your newly updated password."
      }
    ]
  },
  {
    "id": "exchange_course_registration",
    "task_name_zh": "交換生要在開學時才能選課",
    "task_name_en": "Exchange Students Can Only Register for Courses After the Semester Begins",
    "scenario_zh": "交換生需在開學後確認選課流程。",
    "scenario_en": "Exchange students need to finalize registration after the semester begins.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "course_issues",
    "required_documents_zh": [
      "個人學籍資料與學號：用於初次建立校際選課系統帳號。",
      "紙本加簽單：用於開學第一週徵詢授課教師，並取得教師簽名同意使用。"
    ],
    "required_documents_en": [
      "Student ID and academic information.",
      "Printed course add form or registration list."
    ],
    "steps": [
      {
        "zh": "系統註冊帳號：國際交換生、國內交換生須先進入教務系統的「校際選課系統」完成帳號與密碼註冊手續。",
        "en": "Register an account in the Intercollegiate Course Registration System."
      },
      {
        "zh": "登入選課系統：帳號註冊完成後，再前往教務系統中的「選課系統」，循著「校內教職員生」的登入入口登入系統。",
        "en": "Log in to the regular course registration system."
      },
      {
        "zh": "開學第一週先去上課，並徵詢授課教師是否同意加選，取得教師簽名。",
        "en": "Attend classes during the first week and obtain the instructor's approval and signature."
      },
      {
        "zh": "注意選課名額限制，尤其是通識課程與體育課程。",
        "en": "Note enrollment limits, especially for General Education and Physical Education courses."
      },
      {
        "zh": "送件與確認：將已獲教師簽名的單據依教務處規定流程送件辦理，核准後務必於選課系統內再次確認課程是否已成功加入個人的修課清單中。",
        "en": "Submit signed documents and confirm successful enrollment online."
      }
    ]
  },
  {
    id: "course_password_error",
    task_name_zh: "單一入口或選課系統密碼錯誤",
    task_name_en: "SSO or Course System Password Issue",
    scenario_zh:
      "國際學生若遇到單一入口、選課系統或校務系統密碼錯誤、忘記密碼、帳號被鎖定等問題，通常需要先確認系統綁定的身分證件號碼，再使用忘記密碼功能或尋求行政單位協助。",
    scenario_en:
      "International students who encounter password errors, forgotten passwords, or account lock issues with the CCU Single Sign-On Portal, course selection system, or other campus systems should first confirm the ID number linked to their account, then use the Forgot Password function or seek administrative assistance.",
    target_unit_type: "office",
    target_unit_id: "oia",
    category_id: "it_support",
    required_documents_zh: [
      "學生證。",
      "護照或居留證。",
      "若尚未取得居留證，請準備護照號碼、臨時統一證號、錄取通知書或報到資料，以便確認系統綁定之身分證件號碼。",
      "申請入學時填寫的私人 Email 信箱，因密碼重設連結通常會寄到該信箱。"
    ],
    required_documents_en: [
      "Student ID card.",
      "Passport or ARC.",
      "If you have not received your ARC yet, prepare your passport number, temporary ID number, admission letter, or registration documents to verify which ID number is linked to the school system.",
      "The personal email address used during admission, because the password reset link is usually sent to that email address."
    ],
    steps: [
      {
        zh: "先確認系統要求輸入的身分證字號可能對應哪一組資料。國際學生最常見的是居留證號碼，請確認第一個英文字母為大寫，例如 A123456789。",
        en: "First confirm which ID number the system may be using for verification. For international students, the most common option is the ARC number. Make sure the first letter is capitalized, such as A123456789."
      },
      {
        zh: "若你是新生或尚未取得居留證，請嘗試護照號碼或學校入學時配發的臨時統一證號。這些資料通常可以在錄取通知書或報到資料中找到。",
        en: "If you are a new student or have not received your ARC yet, try your passport number or the temporary ID number assigned during admission. This information can usually be found in your admission letter or registration documents."
      },
      {
        zh: "進入國立中正大學單一入口網站，點選「忘記密碼」。在身分證字號欄位輸入居留證號碼、臨時證號或護照號碼。",
        en: "Go to the National Chung Cheng University Single Sign-On Portal and click Forgot Password. In the ID Number field, enter your ARC number, temporary ID number, or passport number."
      },
      {
        zh: "系統會將密碼重設連結寄到你申請入學時留下的私人 Email 信箱。請確認該信箱是否能正常收信，也記得檢查垃圾郵件匣。",
        en: "The system will send a password reset link to the personal email address you provided during admission. Make sure you can access that email account and check the spam folder if needed."
      },
      {
        zh: "如果嘗試上述號碼後仍顯示錯誤，或帳號因輸入太多次被鎖定，建議國際學生先帶學生證與護照或居留證前往國際事務處。國際處可協助確認系統綁定的證件號碼，或協助聯繫資訊處。",
        en: "If the system still shows an error after trying the numbers above, or if your account is locked after too many failed attempts, international students are advised to bring their student ID card and passport or ARC to the Office of International Affairs first. OIA can help confirm the ID number linked to your account or contact the IT Center for assistance."
      },
      {
        zh: "若你可以直接說明需求，也可以帶學生證前往圖書館大樓內的資訊處服務櫃檯，說明「忘記密碼」或「帳號被鎖定」，由承辦人員核對身分後協助重設密碼。",
        en: "If you can explain the issue directly, you may also bring your student ID card to the IT Center service desk in the Library Building and explain that you forgot your password or that your account is locked. Staff can reset the password after verifying your identity."
      }
    ]
  },
  {
    "id": "default_password",
    "task_name_zh": "不知道系統的預設密碼是什麼",
    "task_name_en": "I Don't Know the System's Default Password",
    "scenario_zh": "你不知道首次登入系統的初始密碼。",
    "scenario_en": "You do not know the default password for first-time login.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [
      "學號。",
      "身分證字號或統一證號。",
      "出生年月日。",
      "可收信的電子郵件信箱。"
    ],
    "required_documents_en": [
      "Student ID number.",
      "National ID number or ARC/passport information.",
      "Date of birth.",
      "A valid email address."
    ],
    "steps": [
      {
        "zh": "取得初始密碼：請前往「校園單一入口網頁」（https://portal.ccu.edu.tw/），選擇「第一次登入->學生->請先按此註冊帳號」，並點選初始密碼功能，輸入個人資料進行身分驗證即可取得。或者，可至學籍系統的「新生初始密碼查詢」網頁，輸入學號、身分證字號與出生年月日，畫面即會顯示您的初始密碼。",
        "en": "Visit the Campus Single Sign-On Portal: https://portal.ccu.edu.tw/"
      },
      {
        "zh": "寄發啟用驗證信：回到單一入口的註冊帳號頁面，依序輸入您的學號、剛剛取得的新生初始密碼，以及您的電子郵件信箱。確認無誤後，按下「寄出驗證信」。",
        "en": "Register your account and retrieve your initial password."
      },
      {
        "zh": "點擊驗證連結與初次登入：等待約 3 到 5 分鐘後，至您的電子信箱收取系統寄發的驗證信。點選信件內的「啟用連結」完成帳號啟用作業。接著，請使用學號與初始密碼進行第一次登入。",
        "en": "Verify your email address."
      },
      {
        "zh": "重設個人專屬密碼：初次登入成功時，系統會馬上顯示「You must change password」連結。點選後將導向重設頁面，請在此輸入您的學號與身分證末四碼，並點選「寄送驗證信」。系統會寄送一封具 15 分鐘效期的重設連結信件，請於時效內點開連結，輸入符合複雜度要求的新密碼。",
        "en": "Activate your account via the verification link."
      },
      {
        "zh": "使用新密碼登入與日後忘記密碼處理：密碼修改成功後，即可回到單一入口首頁，使用學號與這組新設定的密碼登入單一入口。若日後不慎忘記密碼，可直接在單一入口登入頁面點選「忘記密碼」來重設（請注意：重設密碼後需等待 10 分鐘，伺服器同步後方可重新登入）。",
        "en": "Use the new password for future access."
      }
    ]
  },
  {
    "id": "ccu_email",
    "task_name_zh": "註冊 CCU 信箱",
    "task_name_en": "Registering for a CCU Email Account",
    "scenario_zh": "你想知道如何使用學校信箱。",
    "scenario_en": "You want to know how to use your CCU email account.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [
      "學號：用以推算登入帳號。",
      "身分證字號：用以推算登入密碼（僑外生需準備居留證號碼或出生年月日與護照英文姓名）。"
    ],
    "required_documents_en": [
      "Student ID number.",
      "National ID number or ARC/passport information for international students."
    ],
    "steps": [
      {
        "zh": "確認帳號編碼規則：學生信箱的帳號是將「學號第一碼數字」轉為特定的「英文字母」後，再加上原本學號的後 8 碼。數字轉換對應：4 轉為 u、6 轉為 g、5 轉為 s、8 轉為 d。範例：若學號為 406530001，帳號即為 u06530001；信箱地址為 u06530001@ccu.edu.tw。",
        "en": "Determine your account username based on your student ID."
      },
      {
        "zh": "確認預設密碼規則：111 學年度（含）以後入學之一般生：Edu$ 加上身分證（或統一證號）後 5 碼。110 學年度（含）以前入學之一般生：edu 加上身分證（或統一證號）後 5 碼。交換生：edu 加上學號後 4 碼。僑生、外籍生：edu 加上居留證後 5 碼，或者 edu 加上出生月、日與英文姓氏前兩個字母。",
        "en": "Use the default password format according to your student category."
      },
      {
        "zh": "登入 Webmail 系統：前往中正大學網路信箱（WebMail）首頁：https://webmail.ccu.edu.tw，輸入上述的帳號與密碼即可開始收發信件。",
        "en": "Log in at: https://webmail.ccu.edu.tw"
      },
      {
        "zh": "設定備援信箱與忘記密碼處理：為了避免日後登入問題，強烈建議首次登入後，至「設定」中綁定個人的「備援電子郵件」。若日後不慎忘記密碼，只要在密碼輸入錯誤 1 次後，系統便會出現「忘記密碼」連結，可透過備援信箱重設。若從未設定備援信箱，則必須下載紙本的「電子郵件帳號密碼申請表」，填寫並經主管簽章後送交資訊處人工辦理。",
        "en": "Set a backup email address after your first login."
      },
      {
        "zh": "補充說明（校友信箱 G Suite）：若您要申請的是可以使用 Google 相關服務（如雲端硬碟）的「校友信箱（@alum.ccu.edu.tw）」，則必須另外前往「校友信箱申請系統」（https://alum.ccu.edu.tw/）依網頁指示進行身分驗證來提出申請。",
        "en": "If you are applying for an alumni email account, use the alumni email application system: https://alum.ccu.edu.tw/"
      }
    ]
  },
  {
    "id": "leave_application",
    "task_name_zh": "請假",
    "task_name_en": "Leave of Absence from Class",
    "scenario_zh": "你因故無法出席課程，需要辦理請假。",
    "scenario_en": "You cannot attend class and need to apply for leave.",
    "target_unit_type": "department",
    "target_unit_id": "",
    "category_id": "student_affairs",
    "required_documents_zh": [
      "依據不同假別，需準備並上傳對應之證明文件（系統僅受理單一 PDF 格式檔案，且檔案大小需小於 3MB）：",
      "事假：必須於系統內註明具體請假理由，理由不得空白，否則會被退單。部分情況下請假達特定日數需檢附相關佐證函件。",
      "病假：須檢附證明（如醫療院所的就診收據即可）；若連續請假達四日（含）以上，則必須附上醫生診斷證明。",
      "公假：須檢附代表國家、學校參賽，或經政府機關、學校選派擔任公務之相關證明文件（如開會通知單等）。",
      "喪假：須檢附相關證明，且依規定僅限請假人之直系血親、直系姻親、配偶或兄弟姐妹之喪葬。",
      "生理假：每月得請假一日，無需出示證明。",
      "心理健康假：每學期以三天為限，無需檢附證明（但請注意：請假達第三次時需填寫量表，且系統將通知導師及諮商中心介入關懷，另不得據此假別申請補考）。"
    ],
    "required_documents_en": [
      "All supporting documents must be uploaded as a single PDF file under 3 MB.",
      "Personal leave: Detailed reason required.",
      "Sick leave: Medical receipt or certificate; a doctor's note is required for four or more consecutive days.",
      "Official leave: Proof of participation in official events or competitions.",
      "Bereavement leave: Proof of relationship and relevant documentation.",
      "Menstrual leave: No documentation required (one day per month).",
      "Mental health leave: Up to three days per semester; no documentation required."
    ],
    "steps": [
      {
        "zh": "登入線上請假系統：請登入「國立中正大學單一入口」網站，點選「學生個人請假操作管理系統」。因手機介面可能導致部分功能無法順利運作，強烈建議使用電腦進行操作。",
        "en": "Log in to the CCU Single Sign-On Portal.\nAccess the Student Leave Management System."
      },
      {
        "zh": "填寫假單與上傳附件：於系統內選定欲請假之日期與課程，填寫假別與事由。若需檢附證明（如病假證明），請將資料轉存為單一 PDF 檔後上傳。",
        "en": "Select the dates and courses.\nEnter the leave type and reason.\nUpload supporting documents if required."
      },
      {
        "zh": "線上送出與系所審核：假單送出後，會先由「系所辦公室」進行線上審核。審核通過後，系統即會自動 Email 通知授課老師及助教，老師也可至系統後台查詢假單狀態",
        "en": "Submit the application online.\nThe department will review the request.\nOnce approved, the system will notify the instructor and TA automatically."
      },
      {
        "zh": "突發狀況與事後補請假：請假原則上應「事前親自辦理」，若遇重大事故無法事前請假，可先以電話或書信向授課教師或系所報備。事後請假務必於「來校上課當日起算十日內（不含假日）」完成線上系統補請手續，逾期未補辦者將視同缺曠課。\n\n例外情況（考試假）：考試假不得以其他種類的假別申請。若需請考試假，仍維持紙本作業，請親自向系所辦公室索取紙本假單，送交授課老師簽章並確認補考安排後，再交由系所備查。",
        "en": "Important Notes:\nLeave should generally be requested in advance.\nIf an emergency prevents prior application, notify the instructor or department immediately.\nRetroactive leave must be submitted within 10 class days of returning to campus.\nExam leave requires a paper form and direct instructor approval."
      }
    ]
  },
  {
    "id": "dorm_fee",
    "task_name_zh": "如何繳宿舍費用",
    "task_name_en": "How to Pay the Dormitory Fee",
    "scenario_zh": "你需要繳交宿舍費、住宿押金或電費。",
    "scenario_en": "You need to pay dormitory fees, deposit, or electricity fees.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "dormitory",
    "required_documents_zh": [
      "繳費單",
      "現金或付款工具"
    ],
    "required_documents_en": [
      "Payment sheet",
      "cash or other payment methods"
    ],
    "steps": [
      {
        "zh": "國際處領取繳費單後根據金額選擇繳納方式並自行繳納",
        "en": "Obtain the payment sheet from the Office of International Affairs (OIA)"
      },
      {
        "zh": "根據金額選擇繳納方式。",
        "en": "choose a payment method based on the amount."
      },
      {
        "zh": "注意:如金額超過新台幣五萬則需前往銀行繳納",
        "en": "complete the payment independently.\n\nNote:If the amount exceeds NTD 50,000, payment must be made at a bank."
      }
    ]
  },
  {
    "id": "next_year_room",
    "task_name_zh": "如何選下學年的寢室",
    "task_name_en": "How to Select a Dormitory Room for the Next Academic Year",
    "scenario_zh": "你想知道下學年宿舍寢室怎麼申請或選房。",
    "scenario_en": "You want to know how to apply for or select a room for the next academic year.",
    "target_unit_type": "office",
    "target_unit_id": "dorm_service",
    "category_id": "dormitory",
    "required_documents_zh": [
      "能上網的裝置"
    ],
    "required_documents_en": [
      "A device with internet access"
    ],
    "steps": [
      {
        "zh": "查看官方公告",
        "en": "Check the official announcement"
      },
      {
        "zh": "於期限內向國際處或相關宿舍服務中心申請",
        "en": "apply to the Office of International Affairs (OIA) or the relevant dormitory service center within the deadline"
      },
      {
        "zh": "準備所需資訊",
        "en": "prepare the required information"
      },
      {
        "zh": "完成線上選房",
        "en": "complete online room selection"
      },
      {
        "zh": "等待宿舍人員安排或確認寢室",
        "en": "wait for the dormitory staff to arrange or confirm the room assignment"
      }
    ]
  },
  {
    "id": "library_services",
    "task_name_zh": "使用圖書館服務",
    "task_name_en": "Using Library Services",
    "scenario_zh": "你想借書、找論文、預約討論室或使用自習空間。",
    "scenario_en": "You want to borrow books, search theses, reserve rooms, or use study spaces.",
    "target_unit_type": "office",
    "target_unit_id": "library",
    "category_id": "library",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "線上入口：前往 https://portal.ccu.edu.tw/sso_index.php",
        "en": "Online Portal: Go to https://portal.ccu.edu.tw/sso_index.php"
      },
      {
        "zh": "選擇圖書館相關圖示：My圖書館、圖書館資源探索、自學空間",
        "en": "Select the relevant library icon: Library, AlmaPrimo, or Self-Study"
      },
      {
        "zh": "臨櫃服務：直接前往圖書館詢問所需服務",
        "en": "In Person: Visit the Library directly and ask the counter staff for the service you need"
      }
    ]
  },
  {
    "id": "licensed_software",
    "task_name_zh": "校園授權軟體下載",
    "task_name_en": "Downloading Campus Licensed Software",
    "scenario_zh": "你想下載學校授權的正版軟體。",
    "scenario_en": "You want to download licensed software provided by the university.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "連接校內網路（若在校外可以使用VPN）參考網站：https://it.ccu.edu.tw/p/426100930.php 最下方下載Ivanti和查看使用說明：https://it.ccu.edu.tw/var/file/9/1009/img/1404/609499594.pdf",
        "en": "Connect to the campus network (if offcampus, use VPN). Reference: https://it.ccu.edu.tw/p/426100930.php Download Ivanti and view instructions at the bottom of the page: https://it.ccu.edu.tw/var/file/9/1009/img/1404/609499594.pdf"
      },
      {
        "zh": "前往 https://software.ccu.edu.tw/",
        "en": "Go to https://software.ccu.edu.tw/"
      },
      {
        "zh": "使用單一入口帳號密碼登入",
        "en": "Log in with your Single SignOn (SSO) account"
      },
      {
        "zh": "選擇想下載的類別：辦公室軟體區(Office)、作業系統區(OS)、統計套裝軟體區(Statistics)、MATLAB(數值運算套裝軟體)、程式設計區(Program)、熱門自由軟體區(Free)、防毒軟體區(AntiVirus)",
        "en": "Select the category you need: Office Software, Operating System (OS), Statistics, MATLAB, Programming, Free Software, or AntiVirus"
      },
      {
        "zh": "點擊軟體下載連結",
        "en": "Click the software download link"
      },
      {
        "zh": "認證軟體（可見 https://it.ccu.edu.tw/p/426100918.php 有安裝指導）",
        "en": "Activate/authenticate the software (installation guides available at https://it.ccu.edu.tw/p/426100918.php)"
      }
    ]
  },
  {
    "id": "graduation_gown",
    "task_name_zh": "借用畢業學位服",
    "task_name_en": "Borrowing Graduation Gown",
    "scenario_zh": "你即將畢業，需要借用學位服參加典禮。",
    "scenario_en": "You are about to graduate and need to borrow a gown for the ceremony.",
    "target_unit_type": "office",
    "target_unit_id": "property_management",
    "category_id": "student_affairs",
    "required_documents_zh": [
      "收據",
      "學生證"
    ],
    "required_documents_en": [
      "receipt",
      "student ID"
    ],
    "steps": [
      {
        "zh": "團體借用：向畢代登記並繳費後統一借用",
        "en": "Group Borrowing: Register with the graduation class representative and pay the fee for a group loan"
      },
      {
        "zh": "個人借用（參考 https://oga.ccu.edu.tw/p/404100611703.php?Lang=zhtw）：至出納組繳交洗滌費",
        "en": "Individual Borrowing (Reference: https://oga.ccu.edu.tw/p/404100611703.php?Lang=zhtw): Pay the cleaning fee at the Cashier's Office"
      },
      {
        "zh": "攜帶收據及學生證到保管組辦理借用手續",
        "en": "Bring your receipt and student ID to the Storage Office to complete the borrowing process"
      },
      {
        "zh": "保管組位置：行政大樓西側地下一樓",
        "en": "Storage Office location: Basement level 1 (B1), west side of the Administration Building"
      }
    ]
  },
  {
    "id": "career_center_visit",
    "task_name_zh": "前往職涯發展中心",
    "task_name_en": "Visiting the Career Development Center",
    "scenario_zh": "你想尋求就業輔導、履歷建議或實習資源。",
    "scenario_en": "You need career counseling, resume advice, or internship resources.",
    "target_unit_type": "office",
    "target_unit_id": "career_center",
    "category_id": "career",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "前往共同教室大樓",
        "en": "Go to the Common Classroom Building"
      },
      {
        "zh": "走到 5 樓",
        "en": "Head to the 5th floor"
      },
      {
        "zh": "尋找 502 教室（即職涯發展中心）",
        "en": "Find Room 502 (Career Development Center)"
      }
    ]
  },
  {
    "id": "work_in_taiwan",
    "task_name_zh": "畢業後留台工作",
    "task_name_en": "Working in Taiwan After Graduation",
    "scenario_zh": "你畢業後想留在台灣工作，需要了解相關資源與管道。",
    "scenario_en": "You have graduated and want to stay in Taiwan for work. Here are the relevant resources and channels.",
    "target_unit_type": "office",
    "target_unit_id": "career_center",
    "category_id": "career",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "勞動部－外國人在臺工作服務網 (EZ Work Taiwan)：https://ezworktaiwan.wda.gov.tw/Content_List.aspx?n=90B5EEEBE3049C9B",
        "en": "Ministry of Labor – EZ Work Taiwan: https://ezworktaiwan.wda.gov.tw/Content_List.aspx?n=90B5EEEBE3049C9B"
      },
      {
        "zh": "國發會－Talent Taiwan 國際人才服務及延攬中心：https://talent.nat.gov.tw/zh/employers/category/foreignstudentsstudyingintaiwan",
        "en": "National Development Council – Talent Taiwan International Talent Services: https://talent.nat.gov.tw/zh/employers/category/foreignstudentsstudyingintaiwan"
      },
      {
        "zh": "僑委會－僑生 i 就業 Career All Pass：https://ocac.events.104.com.tw/",
        "en": "Overseas Community Affairs Council – Career All Pass (for overseas Chinese students): https://ocac.events.104.com.tw/"
      }
    ]
  },
  {
    "id": "work_permit",
    "task_name_zh": "申請工作許可",
    "task_name_en": "Applying for a Work Permit",
    "scenario_zh": "你是在台就學的外籍學生，想申請合法打工許可。",
    "scenario_en": "You are an international student in Taiwan and want to apply for a legal work permit.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "career",
    "required_documents_zh": [
      "學生證正反面",
      "在學證明（影印學生證正反面至教務處加蓋註冊章）",
      "居留證(ARC)正反面",
      "護照正反面"
    ],
    "required_documents_en": [
      "front and back of student ID",
      "proof of enrollment (photocopy of student ID stamped by the Registrar's Office)",
      "ARC (front and back)",
      "passport (front and back)"
    ],
    "steps": [
      {
        "zh": "前往外國專業人員工作許可申辦網：https://ezwp.wda.gov.tw/",
        "en": "Visit the Work Permit Application Portal for Foreign Professionals: https://ezwp.wda.gov.tw/"
      },
      {
        "zh": "填入應填資料（請注意申請資格）",
        "en": "Fill in the required information (please check eligibility requirements carefully)"
      },
      {
        "zh": "上傳個人資料：學生證正反面／在學證明（影印學生證正反面至教務處加蓋註冊章）／居留證(ARC)正反面／護照正反面",
        "en": "Upload personal documents: front and back of student ID / proof of enrollment (photocopy of student ID stamped by the Registrar's Office) / ARC (front and back) / passport (front and back)"
      },
      {
        "zh": "申請費用：新台幣 100 元",
        "en": "Application fee: NT$100"
      },
      {
        "zh": "繳費方式（擇一）：ATM 繳費、台灣 Pay、郵局劃撥（戶名：勞動部勞動力發展署聘僱許可收費專戶 / 帳號：19058848）",
        "en": "Payment options (choose one): ATM transfer, Taiwan Pay, or postal transfer (Account name: Work Permit Fee Account of the Workforce Development Agency, MOL / Account number: 19058848)"
      },
      {
        "zh": "等待審核；查詢案件狀態：https://ezwp.wda.gov.tw/wcfonline/wSite/Control?function=RunAction&_action=pr0000/pr0000_qp.xml\n•「雇主編號」：輸入 ARC 號碼\n•「收文起迄日期」：輸入寄出申請件當日及一週後的日期",
        "en": "Wait for review; check application status at: https://ezwp.wda.gov.tw/wcfonline/wSite/Control?function=RunAction&_action=pr0000/pr0000_qp.xml\n•\"number of employer\": Enter your ARC number\n•\"Submitting date\": Enter the date you submitted your application and the date one week later"
      }
    ]
  },
  {
    "id": "off_campus_internship",
    "task_name_zh": "申請校外實習",
    "task_name_en": "Applying for Off-Campus Internships",
    "scenario_zh": "你想透過學校管道申請校外實習機會。",
    "scenario_en": "You want to apply for off-campus internships through university channels.",
    "target_unit_type": "office",
    "target_unit_id": "career_center",
    "category_id": "career",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "前往 https://career.ccu.edu.tw/p/40310384787.php?Lang=zhtw 查詢實習相關資訊",
        "en": "Visit https://career.ccu.edu.tw/p/40310384787.php?Lang=zhtw for internship information"
      },
      {
        "zh": "依照需求投遞履歷並等待錄取結果",
        "en": "Submit your resume according to your interests and wait for results"
      }
    ]
  },
  {
    "id": "scam_help",
    "task_name_zh": "被詐騙時該如何尋求協助",
    "task_name_en": "What to Do If You Are Scammed",
    "scenario_zh": "你遭遇詐騙或疑似詐騙，需要立即求助。",
    "scenario_en": "You have been scammed or suspect fraud and need immediate help.",
    "target_unit_type": "office",
    "target_unit_id": "osa_safety",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "撥打 165 反詐騙專線",
        "en": "Call the antifraud hotline: 165"
      },
      {
        "zh": "撥打 110 報警",
        "en": "Call the police: 110"
      },
      {
        "zh": "向 OIA（國際處）尋求協助",
        "en": "Seek assistance from OIA (Office of International Affairs)"
      }
    ]
  },
  {
    "id": "emergency_report",
    "task_name_zh": "緊急事件通報處理",
    "task_name_en": "Emergency Incident Reporting",
    "scenario_zh": "你或他人遭遇緊急狀況，需要立即通報。",
    "scenario_en": "You or someone else is in an emergency and needs to report it.",
    "target_unit_type": "office",
    "target_unit_id": "osa_safety",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "校安中心通報專線：052721114",
        "en": "Campus Safety Center Hotline: 052721114"
      },
      {
        "zh": "緊急公務手機：0910896288",
        "en": "Emergency Mobile Phone: 0910896288"
      }
    ]
  },
  {
    "id": "emergency_aid",
    "task_name_zh": "急難救助金",
    "task_name_en": "Emergency Financial Aid",
    "scenario_zh": "你遇到緊急經濟困難，需要申請急難救助。",
    "scenario_en": "You are facing a financial emergency and need to apply for aid.",
    "target_unit_type": "office",
    "target_unit_id": "osa_life",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "校內急難救助：https://studentlife.ccu.edu.tw/p/404103420790.php?Lang=zhtw",
        "en": "Oncampus emergency aid: https://studentlife.ccu.edu.tw/p/404103420790.php?Lang=zhtw"
      },
      {
        "zh": "校外急難救助：https://studentlife.ccu.edu.tw/p/404103420791.php?Lang=zhtw",
        "en": "Offcampus emergency aid: https://studentlife.ccu.edu.tw/p/404103420791.php?Lang=zhtw"
      }
    ]
  },
  {
    "id": "student_insurance_claim",
    "task_name_zh": "申請學生保險理賠",
    "task_name_en": "Applying for Student Insurance Claims",
    "scenario_zh": "你因意外或疾病住院，需要申請學生保險理賠。",
    "scenario_en": "You were injured or hospitalized and want to file a student insurance claim.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [
      "理賠資格：已繳納學保費之在學學生；涵蓋意外傷害及疾病住院，不含門診疾病、掛號費、診斷書費、救護車費等。門診費用累積超過 500 元可申請，上限為 5,000 元。",
      "備妥文件",
      "保險金申請表（未滿18歲需法定代理人簽章）",
      "診斷證明書（正本）",
      "醫療費用收據（正本或副本，副本須由醫療院所蓋「與正本相符」及醫院專用章）",
      "事故學期之學保費繳費證明",
      "X光片光碟（骨折、不完全骨折或骨骼龜裂者）",
      "意外事故證明文件（如報案三聯單，無則免附）",
      "居留證影本（外籍生）"
    ],
    "required_documents_en": [
      "Eligibility: Currently enrolled students who have paid the student insurance fee. Coverage includes accidental injuries and hospitalization due to illness. Outpatient visits, registration fees, medical certificate fees, and ambulance fees are not covered. Outpatient expenses exceeding NT$500 in total may be claimed, up to a maximum of NT$5,000.",
      "Required Documents",
      "Insurance claim form (legal guardian signature required for those under 18)",
      "Original medical diagnosis certificate",
      "Medical expense receipt (original or certified copy stamped by the hospital as \"true copy\")",
      "Proof of student insurance payment for the semester of the incident",
      "Xray disc (for fractures, incomplete fractures, or hairline fractures)",
      "Accident documentation (e.g., police report; not required if unavailable)",
      "Copy of ARC (for international students)"
    ],
    "steps": [
      {
        "zh": "備齊上述文件",
        "en": "Prepare all required documents"
      },
      {
        "zh": "每週一 12:30–14:00 由保險專員到校收件（寒暑假期間由衛保組代收）",
        "en": "An insurance representative visits campus every Monday from 12:30–14:00 to collect submissions (during winter/summer break, documents are received by the Health Center)"
      },
      {
        "zh": "保險公司進行理賠審核（約 2–4 週後以簡訊通知結果）",
        "en": "The insurance company reviews the claim (results notified by SMS within approximately 2–4 weeks)"
      },
      {
        "zh": "保險金將匯入您的帳戶",
        "en": "The claim amount will be transferred to your bank account"
      }
    ]
  },
  {
    "id": "replace_student_id",
    "task_name_zh": "補辦或換發學生證",
    "task_name_en": "Replace or Reissue Student ID Card",
    "scenario_zh": "學生證遺失、毀損、姓名變更，或畢業 / 退學離校期間需要處理學生證問題。",
    "scenario_en": "For students whose student ID card is lost, damaged, requires a name change, or needs to be handled during graduation or withdrawal procedures.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "student_id",
    "required_documents_zh": [
      "學生證補、換發申請表",
      "工本費新臺幣 300 元",
      "依個案需要檢附之身分或證明文件"
    ],
    "required_documents_en": [
      "Application form for student ID replacement or reissue",
      "NTD 300 processing fee",
      "Identity or supporting documents required for the case"
    ],
    "steps": [
      {
        "zh": "至教務處網頁下載申請表，或至教務處教學組填寫申請表。",
        "en": "Download the application form from the Office of Academic Affairs website or fill it out at the Curriculum and Instruction Section."
      },
      {
        "zh": "至總務處出納組繳交工本費新臺幣 300 元。",
        "en": "Pay the NTD 300 processing fee at the Cashier Division."
      },
      {
        "zh": "將申請表與繳費證明送交教務處辦理。",
        "en": "Submit the application form and payment proof to the Office of Academic Affairs."
      },
      {
        "zh": "依教務處通知領取補發或換發後的學生證。",
        "en": "Collect the replacement or reissued student ID card according to OAA instructions."
      }
    ]
  },
  {
    "id": "apply_reinstatement",
    "task_name_zh": "辦理復學或提前復學",
    "task_name_en": "Apply for Reinstatement of Study",
    "scenario_zh": "休學生需要復學，或希望提前復學並取得復學同意函時。",
    "scenario_en": "For students returning from leave of absence or applying for early reinstatement and needing a reinstatement approval.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "復學申請書",
      "個人身分證明文件",
      "原休學同意函或保留入學資格同意函",
      "委託書（非本人辦理時）"
    ],
    "required_documents_en": [
      "Application Form for Reinstatement of Study",
      "Personal identification document",
      "Original leave approval or admission reservation approval",
      "Authorization letter if handled by a representative"
    ],
    "steps": [
      {
        "zh": "填寫復學申請書，並備妥身分證明及原休學或保留入學資格同意函。",
        "en": "Complete the reinstatement application form and prepare your ID and original leave or admission reservation approval."
      },
      {
        "zh": "送交相關單位審核。",
        "en": "Submit the application to the relevant units for review."
      },
      {
        "zh": "由教務處教學組核發復學同意函。",
        "en": "The Curriculum and Instruction Section will issue the approval for reinstatement."
      },
      {
        "zh": "若為提前復學，應於欲復學學期開始前兩週完成申請。",
        "en": "For early reinstatement, complete the application no later than two weeks before the intended semester begins."
      }
    ]
  },
  {
    "id": "apply_credit_transfer",
    "task_name_zh": "辦理學分抵免",
    "task_name_en": "Apply for Credit Transfer",
    "scenario_zh": "新生、轉學生或具先前修課紀錄者，需要將已修課程申請抵免中正大學學分。",
    "scenario_en": "For new students, transfer students, or students with previous coursework who need to apply for credit transfer at CCU.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "學分抵免申請單",
      "原校歷年成績單正本",
      "相關課程資料（如系所要求）"
    ],
    "required_documents_en": [
      "Credit transfer application form",
      "Original official transcript from the previous institution",
      "Relevant course materials if required by the department"
    ],
    "steps": [
      {
        "zh": "至教務系統的學分抵免申請系統登錄資料。",
        "en": "Enter your information in the credit transfer application system."
      },
      {
        "zh": "列印抵免申請單，並檢附原校歷年成績單正本。",
        "en": "Print the credit transfer application form and attach the original transcript from the previous institution."
      },
      {
        "zh": "依課程類型送交語言中心、通識中心、所屬系所或開課系所審核。",
        "en": "Submit the application to the Language Center, General Education Center, your department, or the course-offering department depending on the course type."
      },
      {
        "zh": "完成相關單位審核後，送至教務處教學組辦理。",
        "en": "After review by the relevant units, submit the documents to the Curriculum and Instruction Section."
      }
    ]
  },
  {
    "id": "apply_intercollegiate_course",
    "task_name_zh": "申請校際選課",
    "task_name_en": "Apply for Intercollegiate Course Enrollment",
    "scenario_zh": "本校學生想修讀他校課程，或他校學生想修讀中正大學課程時。",
    "scenario_en": "For CCU students who want to take courses at another university, or students from other universities who want to take CCU courses.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "course_issues",
    "required_documents_zh": [
      "校際選課申請單",
      "原校或修課學校要求之表單",
      "繳費證明或完成選課證明（依學校規定）"
    ],
    "required_documents_en": [
      "Intercollegiate course application form",
      "Forms required by the home or host university",
      "Payment proof or course enrollment proof if required"
    ],
    "steps": [
      {
        "zh": "依公告期間進入校際選課系統申請。",
        "en": "Apply through the intercollegiate course system within the announced application period."
      },
      {
        "zh": "完成課程加選後，列印校際選課申請單。",
        "en": "After adding the course, print the intercollegiate course application form."
      },
      {
        "zh": "依規定取得原校、所屬系所、任課教師、修課學校或教務處簽章。",
        "en": "Obtain the required approvals from the home university, department, course instructor, host university, or academic affairs office."
      },
      {
        "zh": "依修課學校規定完成繳費，並於截止日前將完成簽章的申請單送回教務處教學組。",
        "en": "Complete payment according to the host university’s rules and submit the signed application form to the Curriculum and Instruction Section before the deadline."
      }
    ]
  },
  {
    "id": "withdraw_course",
    "task_name_zh": "申請課程棄選",
    "task_name_en": "Apply for Course Withdrawal",
    "scenario_zh": "學生選上課程後，因特殊情況無法繼續修讀，需要在期限內辦理棄選。",
    "scenario_en": "For students who cannot continue taking an enrolled course and need to apply for course withdrawal before the deadline.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "course_issues",
    "required_documents_zh": [
      "選課系統申請資料",
      "特殊情況說明或其他文件（如公告要求）"
    ],
    "required_documents_en": [
      "Course selection system application record",
      "Explanation or additional documents if required by the announcement"
    ],
    "steps": [
      {
        "zh": "在公告申請期間內進入選課系統。",
        "en": "Enter the course selection system during the announced application period."
      },
      {
        "zh": "於主選單點選「申請棄選」，選擇欲棄選的課程。",
        "en": "Select “Apply for Course Withdrawal” from the main menu and choose the course to withdraw."
      },
      {
        "zh": "確認棄選資料無誤後送出申請。",
        "en": "Confirm the withdrawal information and submit the application."
      },
      {
        "zh": "回到「我的棄選單」確認已出現棄選課程名稱。",
        "en": "Check “My Withdrawal List” to confirm that the withdrawn course appears."
      }
    ]
  },
  {
    "id": "complete_school_leaving",
    "task_name_zh": "辦理畢業、休學或退學離校手續",
    "task_name_en": "Complete School-Leaving Procedures",
    "scenario_zh": "學生因畢業、休學或退學需要完成離校程序，並確認圖書、器材、學位服或欠款是否已結清。",
    "scenario_en": "For students who need to complete school-leaving procedures due to graduation, leave of absence, or withdrawal, and confirm that books, equipment, gowns, or unpaid fees are cleared.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "網路離校系統申請資料",
      "學生證或身分證明",
      "各單位要求之歸還或繳清證明"
    ],
    "required_documents_en": [
      "Online school-leaving system record",
      "Student ID or identity document",
      "Clearance proof required by relevant units"
    ],
    "steps": [
      {
        "zh": "進入網路離校系統提出離校申請。",
        "en": "Submit the school-leaving application through the online school-leaving system."
      },
      {
        "zh": "確認是否有圖書、器材、學位服、宿舍費、學雜費或其他欠款未歸還或未繳清。",
        "en": "Check whether there are unreturned books, equipment, gowns, dormitory fees, tuition, or other unpaid items."
      },
      {
        "zh": "依各單位要求完成歸還、繳費或審核。",
        "en": "Complete returns, payments, or reviews required by each unit."
      },
      {
        "zh": "完成各單位審核後，依教務處規定領取相關證明或學位證書。",
        "en": "After all units approve the clearance, collect relevant certificates or the diploma according to OAA rules."
      }
    ]
  },
  {
    "id": "apply_tuition_reduction",
    "task_name_zh": "申請學雜費減免",
    "task_name_en": "Apply for Tuition and Fee Reduction",
    "scenario_zh": "符合減免資格的學生，需要在每學期規定期限內申請學雜費減免。",
    "scenario_en": "For students eligible for tuition and fee reduction who need to apply within the announced period each semester.",
    "target_unit_type": "office",
    "target_unit_id": "osa_life",
    "category_id": "tuition",
    "required_documents_zh": [
      "學雜費減免申請表",
      "資格證明文件",
      "其他生活事務組公告要求之文件"
    ],
    "required_documents_en": [
      "Tuition and fee reduction application form",
      "Eligibility proof",
      "Other documents required by the Student Life Division announcement"
    ],
    "steps": [
      {
        "zh": "登入學校單一入口系統。",
        "en": "Log in to the university single sign-on portal."
      },
      {
        "zh": "點選「學雜費減免」並完成線上申請。",
        "en": "Select “Tuition and Fee Reduction” and complete the online application."
      },
      {
        "zh": "列印申請表，並準備相關資格證明文件。",
        "en": "Print the application form and prepare the required eligibility documents."
      },
      {
        "zh": "依期限將申請表與證明文件送交生活事務組。",
        "en": "Submit the application form and supporting documents to the Student Life Division before the deadline."
      }
    ]
  },
  {
    "id": "apply_student_loan",
    "task_name_zh": "申請就學貸款",
    "task_name_en": "Apply for Student Loan",
    "scenario_zh": "學生需要辦理就學貸款，或同時具有學雜費減免、補助身分而需要確認申貸金額。",
    "scenario_en": "For students who need to apply for a student loan or confirm the loan amount when also receiving tuition reduction or subsidies.",
    "target_unit_type": "office",
    "target_unit_id": "osa_life",
    "category_id": "tuition",
    "required_documents_zh": [
      "註冊繳費單",
      "就學貸款申請資料",
      "身分或資格證明文件",
      "銀行或生活事務組要求之文件"
    ],
    "required_documents_en": [
      "Tuition and fees payment slip",
      "Student loan application information",
      "Identity or eligibility documents",
      "Documents required by the bank or Student Life Division"
    ],
    "steps": [
      {
        "zh": "確認當學期註冊繳費單與就學貸款申請時程。",
        "en": "Check the semester tuition payment slip and student loan application schedule."
      },
      {
        "zh": "若具有學雜費減免或補助身分，先確認應扣除的補助金額。",
        "en": "If you receive tuition reduction or subsidies, confirm the amount to be deducted first."
      },
      {
        "zh": "依銀行與生活事務組規定完成就學貸款申請。",
        "en": "Complete the student loan application according to the bank and Student Life Division requirements."
      },
      {
        "zh": "依公告期限繳交或補交相關資料。",
        "en": "Submit or supplement the required documents before the announced deadline."
      }
    ]
  },
  {
    "id": "apply_disadvantaged_student_aid",
    "task_name_zh": "申請弱勢學生助學金",
    "task_name_en": "Apply for Disadvantaged Student Aid",
    "scenario_zh": "學生符合弱勢助學資格，需要申請弱勢學生助學金或相關助學補助。",
    "scenario_en": "For students eligible for disadvantaged student aid who need to apply for financial assistance or related subsidies.",
    "target_unit_type": "office",
    "target_unit_id": "osa_life",
    "category_id": "tuition",
    "required_documents_zh": [
      "弱勢助學申請表",
      "家庭或所得相關證明",
      "生活事務組公告要求之文件"
    ],
    "required_documents_en": [
      "Disadvantaged student aid application form",
      "Household or income-related proof",
      "Documents required by the Student Life Division announcement"
    ],
    "steps": [
      {
        "zh": "登入單一入口，進入弱勢助學申請系統。",
        "en": "Log in to the single sign-on portal and enter the disadvantaged student aid application system."
      },
      {
        "zh": "填寫申請資料並列印申請表。",
        "en": "Complete the application information and print the application form."
      },
      {
        "zh": "準備家庭、所得或其他資格證明文件。",
        "en": "Prepare household, income, or other eligibility documents."
      },
      {
        "zh": "依公告期限將資料送交生活事務組。",
        "en": "Submit the documents to the Student Life Division before the announced deadline."
      }
    ]
  },
  {
    "id": "apply_student_group_insurance_claim",
    "task_name_zh": "申請學生團體保險理賠",
    "task_name_en": "Apply for Student Group Insurance Claim",
    "scenario_zh": "學生因疾病住院、意外事故、受傷或其他符合學生團保範圍的情況，需要申請保險理賠。",
    "scenario_en": "For students who need to file a student group insurance claim due to hospitalization, accident, injury, or other covered situations.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [
      "理賠申請書",
      "診斷證明書正本",
      "醫療費用收據正本或加蓋醫院章之影本",
      "存摺封面影本",
      "ARC 影本（外籍生）",
      "X 光光碟（骨折時）"
    ],
    "required_documents_en": [
      "Claim application form",
      "Original diagnosis certificate",
      "Original medical receipt or copy stamped by the hospital",
      "Photocopy of bank or post office passbook cover",
      "Photocopy of ARC for international students",
      "CD copy of X-ray images if a bone fracture is diagnosed"
    ],
    "steps": [
      {
        "zh": "就醫後向醫療院所索取診斷證明書與醫療費用收據。",
        "en": "After medical treatment, obtain the diagnosis certificate and medical receipt from the medical institution."
      },
      {
        "zh": "準備理賠申請書、收據、診斷證明、存摺封面與相關附件。",
        "en": "Prepare the claim form, receipt, diagnosis certificate, passbook cover, and related attachments."
      },
      {
        "zh": "將文件親送或郵寄至衛生保健組。",
        "en": "Submit the documents to the Health Center in person or by post."
      },
      {
        "zh": "由衛生保健組協助送交保險公司審核。",
        "en": "The Health Center will forward the application to the insurance company for review."
      }
    ]
  },
  {
    "id": "get_campus_licensed_software",
    "task_name_zh": "下載或使用校園授權軟體",
    "task_name_en": "Access Campus Licensed Software",
    "scenario_zh": "學生需要下載 Office、統計軟體、MATLAB、程式開發工具或其他校園授權軟體。",
    "scenario_en": "For students who need to download or use Office, statistical software, MATLAB, programming tools, or other campus licensed software.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [
      "中正大學帳號",
      "校內網路或 VPN 使用條件",
      "資訊處公告要求之授權或安裝資訊"
    ],
    "required_documents_en": [
      "CCU account",
      "Campus network or VPN access if required",
      "License or installation information required by the IT Center announcement"
    ],
    "steps": [
      {
        "zh": "先確認要使用的軟體是否列於資訊處校園授權軟體服務中。",
        "en": "First confirm whether the software is listed under the IT Center campus licensed software service."
      },
      {
        "zh": "依資訊處說明使用校內網路或指定方式進入下載頁面。",
        "en": "Access the download page through the campus network or designated method according to IT Center instructions."
      },
      {
        "zh": "使用中正大學帳號登入或完成授權驗證。",
        "en": "Log in with your CCU account or complete license verification."
      },
      {
        "zh": "依安裝說明下載、安裝並啟用軟體。",
        "en": "Download, install, and activate the software according to the installation instructions."
      }
    ]
  },
  {
    "id": "ask_it_support",
    "task_name_zh": "詢問 SSO、校園信箱、Wi-Fi 或 eCourse2 問題",
    "task_name_en": "Ask for Help with SSO, Campus Email, Wi-Fi, or eCourse2",
    "scenario_zh": "學生無法登入單一入口、校園信箱、Wi-Fi、eCourse2，或遇到校園資訊系統問題。",
    "scenario_en": "For students who cannot access SSO, campus email, Wi-Fi, eCourse2, or encounter campus IT system issues.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [
      "學生證號或學號",
      "問題截圖",
      "錯誤訊息",
      "使用的裝置與瀏覽器資訊"
    ],
    "required_documents_en": [
      "Student ID number",
      "Screenshot of the issue",
      "Error message",
      "Device and browser information"
    ],
    "steps": [
      {
        "zh": "先確認問題發生在哪個系統，例如 SSO、WebMail、Wi-Fi 或 eCourse2。",
        "en": "First identify which system has the issue, such as SSO, WebMail, Wi-Fi, or eCourse2."
      },
      {
        "zh": "截圖保存錯誤訊息，並記錄發生時間與使用裝置。",
        "en": "Take a screenshot of the error message and record the time and device used."
      },
      {
        "zh": "透過資訊處服務台電話、Email 或諮詢服務管道聯繫資訊處。",
        "en": "Contact the IT Center through the service desk phone, email, or consultation channel."
      },
      {
        "zh": "依資訊處回覆提供補充資訊或完成後續設定。",
        "en": "Provide additional information or complete follow-up settings according to IT Center instructions."
      }
    ]
  },
  {
    "id": "apply_academic_documents",
    "task_name_zh": "申請成績單、在學證明或學籍成績證明文件",
    "task_name_en": "Apply for Transcript, Enrollment Certificate, or Academic Records",
    "scenario_zh": "學生需要申請在學證明、中文或英文成績單、名次證明、學位證明書、修業證明書或其他學籍成績相關證明文件。",
    "scenario_en": "For students who need to apply for an enrollment certificate, Chinese or English transcript, ranking certificate, degree certificate, study certificate, or other academic record documents.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "學生證或身分證明文件",
      "學籍成績證明文件申請書",
      "申請費用",
      "委託書與身分證件影本（委託他人代辦時）",
      "護照姓名資料（申請英文文件時建議確認）"
    ],
    "required_documents_en": [
      "Student ID card or identity document",
      "Academic record document application form",
      "Application fee",
      "Authorization letter and photocopy of ID if handled by a representative",
      "Passport-name information when applying for English documents"
    ],
    "steps": [
      {
        "zh": "先確認要申請的文件類型，例如在學證明、中文成績單、英文歷年成績單、學位證明書或修業證明書。",
        "en": "First confirm the type of document needed, such as enrollment certificate, Chinese transcript, English transcript, degree certificate, or study certificate."
      },
      {
        "zh": "可依文件類型使用教務系統線上申請，或至教務處教學組櫃台辦理。",
        "en": "Depending on the document type, apply through the academic affairs system online or at the Curriculum and Instruction Section counter."
      },
      {
        "zh": "準備學生證或身分證明文件；若委託他人辦理，需另備委託書與本人身分證件影本。",
        "en": "Prepare your student ID or identity document. If another person handles the application, prepare an authorization letter and a photocopy of your ID."
      },
      {
        "zh": "依教務處規定繳交費用，並依核發時間領取或下載文件。",
        "en": "Pay the required fee and collect or download the document according to the processing time set by the Office of Academic Affairs."
      }
    ]
  },
  {
    "id": "apply_withdrawal",
    "task_name_zh": "辦理退學申請",
    "task_name_en": "Apply for Withdrawal from School",
    "scenario_zh": "學生因個人、學業或其他原因決定退學，需要完成網路離校與退學申請流程。",
    "scenario_en": "For students who decide to withdraw from school for personal, academic, or other reasons and need to complete online school-leaving and withdrawal procedures.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "退學申請書",
      "學生證",
      "網路離校系統審核結果",
      "家長簽章（學士班學生依規定需要時）",
      "委託書（非本人辦理時）"
    ],
    "required_documents_en": [
      "Withdrawal application form",
      "Student ID card",
      "Online school-leaving system clearance result",
      "Parent or guardian signature if required for undergraduate students",
      "Authorization letter if handled by a representative"
    ],
    "steps": [
      {
        "zh": "先至網路離校系統提出離校申請，並確認相關單位均已線上審核通過。",
        "en": "First submit the school-leaving application through the online school-leaving system and confirm that all relevant units have approved it."
      },
      {
        "zh": "至教務處網頁下載退學申請書。",
        "en": "Download the withdrawal application form from the Office of Academic Affairs website."
      },
      {
        "zh": "填寫退學申請書；學士班學生依規定需要家長簽章時，應完成簽章。",
        "en": "Complete the withdrawal application form. Undergraduate students should obtain the required parent or guardian signature when applicable."
      },
      {
        "zh": "攜帶學生證與申請書，依表單所列單位完成核章後送交教務處教學組辦理。",
        "en": "Bring your student ID and the application form, obtain required approvals from the units listed on the form, and submit it to the Curriculum and Instruction Section."
      }
    ]
  },
  {
    "id": "apply_transfer_study_certificate",
    "task_name_zh": "申請轉學修業證明書",
    "task_name_en": "Apply for Transfer Study Certificate",
    "scenario_zh": "退學生已在校修業一學期以上並有成績紀錄，需要申請修業證明書作為轉學或其他用途。",
    "scenario_en": "For withdrawn students who have studied for at least one semester with academic records and need a study certificate for transfer or other purposes.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "學生證或身分證明文件",
      "離校手續單或網路離校審核結果",
      "修業證明書申請資料",
      "委託書（非本人辦理時）"
    ],
    "required_documents_en": [
      "Student ID card or identity document",
      "School-leaving checklist or online clearance result",
      "Study certificate application information",
      "Authorization letter if handled by a representative"
    ],
    "steps": [
      {
        "zh": "確認自己是否符合條件：退學生在校一學期以上且具有成績，其學籍經核准者可申請修業證明書。",
        "en": "Confirm eligibility: withdrawn students who studied for at least one semester and have academic records may apply after the student status is approved."
      },
      {
        "zh": "若為自願退學，可於辦理退學時一併向教務處教學組提出申請，或於退學後攜帶身分證明文件辦理。",
        "en": "For voluntary withdrawal, apply at the Curriculum and Instruction Section when processing withdrawal, or bring an identity document after withdrawal to apply."
      },
      {
        "zh": "若為非自願退學，先完成網路離校系統；若無法登入，下載離校手續單並完成相關單位核章。",
        "en": "For involuntary withdrawal, complete the online school-leaving system first. If you cannot log in, download the school-leaving checklist and obtain approvals from relevant units."
      },
      {
        "zh": "攜帶學生證、離校手續單或相關證明至教務處教學組辦理。",
        "en": "Bring your student ID, school-leaving checklist, or related proof to the Curriculum and Instruction Section."
      }
    ]
  },
  {
    "id": "apply_minor_or_double_major",
    "task_name_zh": "申請輔系或雙主修",
    "task_name_en": "Apply for Minor or Double Major",
    "scenario_zh": "學生想加修其他學系、研究所或學位學程作為輔系或雙主修，需要依公告期間提出申請。",
    "scenario_en": "For students who want to add another department, graduate institute, or degree program as a minor or double major and need to apply during the announced period.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "輔系或雙主修申請表",
      "成績單或學業成績相關資料",
      "欲申請學系、所或學位學程規定之審查資料",
      "主修系所主管簽章",
      "加修系所或學位學程要求之文件"
    ],
    "required_documents_en": [
      "Minor or double major application form",
      "Transcript or academic performance documents",
      "Review materials required by the intended department, institute, or degree program",
      "Approval signature from the home department or institute",
      "Documents required by the intended department or degree program"
    ],
    "steps": [
      {
        "zh": "先查看教務處公告的當學年度輔系或雙主修受理期間與申請資格。",
        "en": "Check the Office of Academic Affairs announcement for the application period and eligibility for the academic year."
      },
      {
        "zh": "確認欲申請系所或學位學程公告的申請標準、名額與應修科目學分表。",
        "en": "Confirm the application standards, quota, and required course credits announced by the intended department or degree program."
      },
      {
        "zh": "填寫輔系或雙主修申請表，並備妥成績單及審查資料。",
        "en": "Complete the minor or double major application form and prepare the transcript and review materials."
      },
      {
        "zh": "依規定送主修系所主管簽章，並於截止日前送達欲申請之系所或教務處指定單位。",
        "en": "Obtain the required approval from your home department or institute and submit the application to the intended unit or designated OAA unit before the deadline."
      }
    ]
  },
  {
    "id": "abandon_minor_or_double_major",
    "task_name_zh": "放棄修讀輔系或雙主修",
    "task_name_en": "Abandon Minor or Double Major",
    "scenario_zh": "學生已核准修讀輔系或雙主修，但因修課規劃、畢業進度或其他原因需要放棄修讀。",
    "scenario_en": "For students who have been approved for a minor or double major but need to abandon it due to course planning, graduation progress, or other reasons.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "放棄修讀雙主修、輔系申請書",
      "學生證",
      "相關證明文件（特殊情況時）",
      "委託書與身分證件影本（委託他人辦理時）"
    ],
    "required_documents_en": [
      "Application form for abandoning double major or minor",
      "Student ID card",
      "Supporting documents for special cases",
      "Authorization letter and photocopy of ID if handled by a representative"
    ],
    "steps": [
      {
        "zh": "確認當學期放棄修讀輔系或雙主修的申請期限。",
        "en": "Confirm the application deadline for abandoning the minor or double major for the semester."
      },
      {
        "zh": "至教務處表單下載區下載「放棄修讀雙主修、輔系申請書」。",
        "en": "Download the application form for abandoning double major or minor from the OAA forms section."
      },
      {
        "zh": "填妥基本資料與放棄理由，並依規定送主修系所及雙主修或輔系單位主管簽章。",
        "en": "Complete the basic information and reason for abandonment, then obtain required approvals from the home department and the double-major or minor unit."
      },
      {
        "zh": "攜帶學生證，於期限內親送教務處教學組辦理；若委託他人辦理，需另備委託文件。",
        "en": "Bring your student ID and submit the form to the Curriculum and Instruction Section before the deadline. If another person handles it, prepare authorization documents."
      }
    ]
  },
  {
    "id": "apply_degree_exam_or_advisor_registration",
    "task_name_zh": "申請學位考試或登錄指導教授",
    "task_name_en": "Apply for Degree Examination or Register Thesis Advisor",
    "scenario_zh": "碩博士生需要登錄指導教授、申請學位考試，或處理論文口試相關行政流程。",
    "scenario_en": "For graduate students who need to register a thesis advisor, apply for a degree examination, or complete thesis oral defense-related administrative procedures.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "academic_affairs",
    "required_documents_zh": [
      "教務系統申請資料",
      "指導教授相關資料",
      "學位考試申請資料",
      "系所或學位學程要求之審查文件",
      "論文或口試相關資料（依系所規定）"
    ],
    "required_documents_en": [
      "Academic affairs system application record",
      "Thesis advisor information",
      "Degree examination application information",
      "Review documents required by the department or degree program",
      "Thesis or oral defense-related materials if required by the department"
    ],
    "steps": [
      {
        "zh": "先確認所屬系所或學位學程對指導教授登錄、學位考試與論文口試的規定與時程。",
        "en": "First confirm your department or degree program’s rules and schedule for advisor registration, degree examination, and thesis oral defense."
      },
      {
        "zh": "登入教務系統，進入「申請學位考試及登錄指導教授」功能。",
        "en": "Log in to the academic affairs system and enter the “Apply for Degree Examination and Register Thesis Advisor” function."
      },
      {
        "zh": "依系統要求填寫指導教授、學位考試或口試相關資料。",
        "en": "Enter thesis advisor, degree examination, or oral defense-related information as required by the system."
      },
      {
        "zh": "依系所規定繳交紙本或電子附件，並追蹤系所與教務處審核結果。",
        "en": "Submit paper or electronic attachments according to department rules and follow up on the department and OAA review status."
      }
    ]
  },
  {
    "id": "opt_out_student_group_insurance",
    "task_name_zh": "申請不參加學生團體保險或退保",
    "task_name_en": "Opt Out of Student Group Insurance",
    "scenario_zh": "學生選擇不參加學生團體保險，或需在期限內辦理退保切結。",
    "scenario_en": "For students who choose not to participate in student group insurance or need to submit an opt-out declaration before the deadline.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [
      "不參加學生團體保險切結書",
      "學生本人簽章",
      "法定代理人或家屬簽章（依年齡或身分規定）",
      "系所主管簽章",
      "學生證或身分證明文件"
    ],
    "required_documents_en": [
      "Student group insurance opt-out declaration form",
      "Student signature or seal",
      "Legal representative or family member signature if required by age or status",
      "Department or institute chair signature",
      "Student ID card or identity document"
    ],
    "steps": [
      {
        "zh": "先至衛生保健組學生團體保險頁面下載當學期「不參加學生團體保險切結書」。",
        "en": "Download the current semester student group insurance opt-out declaration form from the Health Center website."
      },
      {
        "zh": "填寫切結書，並依規定完成本人、家屬或法定代理人、系所主管簽章。",
        "en": "Complete the declaration form and obtain the required signatures from yourself, family member or legal representative, and department chair."
      },
      {
        "zh": "於衛保組公告期限內，將切結書繳交至活動中心二樓衛生保健組。",
        "en": "Submit the declaration form to the Health Center on the 2nd floor of the Activity Center before the announced deadline."
      },
      {
        "zh": "逾期未辦理者，依衛保組規定通常視同參加學生團體保險。",
        "en": "If the form is not submitted before the deadline, the student is generally treated as enrolled in the student group insurance according to Health Center rules."
      }
    ]
  },
  {
    "id": "apply_emergency_financial_aid",
    "task_name_zh": "申請校內外急難救助",
    "task_name_en": "Apply for Emergency Financial Aid",
    "scenario_zh": "學生因家庭、經濟、意外、重大變故或其他急難情況，需要申請校內外急難慰問金或急難救助金。",
    "scenario_en": "For students who need to apply for emergency financial aid due to family, financial, accident-related, major incident, or other urgent hardship situations.",
    "target_unit_type": "office",
    "target_unit_id": "osa_life",
    "category_id": "tuition",
    "required_documents_zh": [
      "急難救助申請表",
      "學生證或身分證明文件",
      "急難事由相關證明文件",
      "家庭或經濟狀況相關資料（依補助類型要求）",
      "生活事務組或公告要求之其他文件"
    ],
    "required_documents_en": [
      "Emergency financial aid application form",
      "Student ID card or identity document",
      "Supporting documents for the emergency situation",
      "Household or financial documents if required by the aid type",
      "Other documents required by the Student Life Division or announcement"
    ],
    "steps": [
      {
        "zh": "先至生活事務組校內急難救助頁面確認可申請的急難慰問金或救助金類型。",
        "en": "Check the Student Life Division emergency aid page to confirm which type of emergency grant or aid may apply."
      },
      {
        "zh": "下載對應的實施要點與申請表，確認資格、申請期限與應備文件。",
        "en": "Download the relevant guidelines and application form, then confirm eligibility, deadline, and required documents."
      },
      {
        "zh": "備妥急難事由證明、身分資料與其他補助類型要求的文件。",
        "en": "Prepare proof of the emergency situation, identity documents, and other documents required for the aid type."
      },
      {
        "zh": "依公告方式將申請資料送交學務處生活事務組，並依通知補件或等待審核結果。",
        "en": "Submit the application materials to the Student Life Division according to the announcement, then provide supplements or wait for the review result as instructed."
      }
    ]
  },
  {
    id: "gender_equity_case_or_form_inquiry",
    task_name_zh: "性別平等事件申請、檢舉與表單查詢",
    task_name_en: "Gender Equity Case Application, Report, and Form Inquiry",
    scenario_zh:
      "你遇到或想了解校園性別事件、性騷擾、性侵害、性霸凌、性別平等相關申請或檢舉流程，或需要下載性平會相關表單。",
    scenario_en:
      "You need information about campus gender equity cases, sexual harassment, sexual assault, gender bullying, gender equity investigation applications, reports, or related forms.",
    target_unit_type: "office",
    target_unit_id: "secretariat",
    category_id: "student_affairs",
    required_documents_zh: [
      "國立中正大學校園性別事件調查或檢舉申請書。",
      "可協助說明事件的相關資料或證明文件。",
      "申請或檢舉須具真實姓名；可依官方說明親送、Email 或郵寄提出。"
    ],
    required_documents_en: [
      "CCU campus gender-related incident investigation or report application form.",
      "Relevant information or supporting documents that may help explain the case.",
      "The application or report must be submitted under the real name of the applicant or reporter. It may be submitted in person, by email, or by post according to the official instructions."
    ],
    steps: [
      {
        zh: "先至秘書室網站的「性平會表單」或性別平等教育委員會頁面確認最新表單與申請說明。",
        en: "First check the Secretariat website under Gender Equity Committee forms or the Gender Equity Education Committee page for the latest forms and instructions."
      },
      {
        zh: "下載並填寫「校園性別事件調查或檢舉申請書」，並準備可協助說明事件的相關資料。",
        en: "Download and complete the campus gender-related incident investigation or report application form, and prepare relevant supporting information."
      },
      {
        zh: "依官方說明，將申請或檢舉資料以親送、Email 或郵寄方式，具真實姓名向收件單位提出。官方頁面列出的收件單位為學務處衛生保健組，Email 為 health@ccu.edu.tw。",
        en: "Submit the application or report under your real name in person, by email, or by post according to the official instructions. The official page lists the Health Services Division of the Office of Student Affairs as the receiving unit, with email health@ccu.edu.tw."
      },
      {
        zh: "收件後，校園性別事件申請調查會於三日內交由學校性別平等教育委員會調查處理。",
        en: "After receiving the application, the school will forward the case to the Gender Equity Education Committee for investigation within three days."
      },
      {
        zh: "學校會於接獲申請書二十日內，以書面通知申請人或檢舉人是否受理。",
        en: "The school will notify the applicant or reporter in writing within twenty days whether the case is accepted."
      }
    ]
  },
  {
    id: "admission_application_and_appeal_inquiry",
    task_name_zh: "查詢入學申請、招生資料與考生申訴",
    task_name_en: "Admission Application, Recruitment Information, and Applicant Appeal Inquiry",
    scenario_zh:
      "你需要查詢招生簡章、招生日程、招生名額、申請資料、考生陳情、申訴或退費相關問題。",
    scenario_en:
      "You need information about admission guidelines, admission schedules, admission quotas, application documents, applicant petitions, appeals, or refund-related issues.",
    target_unit_type: "office",
    target_unit_id: "oaa_admissions",
    category_id: "registration",
    required_documents_zh: [
      "申請入學或招生相關問題：請準備申請身分、申請學制、系所名稱與申請編號。",
      "考生陳情、申訴或退費：請準備相關通知、繳費資料、申請紀錄或可說明問題的文件。"
    ],
    required_documents_en: [
      "For admission or application inquiries: prepare your applicant status, degree level, department or program name, and application number.",
      "For applicant petitions, appeals, or refund issues: prepare relevant notices, payment records, application records, or documents explaining the issue."
    ],
    steps: [
      {
        zh: "先確認你的問題屬於招生簡章、招生日程、招生名額、申請資料、考生陳情、申訴或退費哪一類。",
        en: "First identify whether your issue is about admission guidelines, admission schedules, admission quotas, application documents, applicant petitions, appeals, or refunds."
      },
      {
        zh: "至教務處招生相關頁面或招生資訊系統查看最新公告與申請資訊。",
        en: "Check the Office of Academic Affairs admission pages or admission information system for the latest announcements and application information."
      },
      {
        zh: "若是個案問題，請準備申請編號、身分資料、系所名稱與相關文件，再洽詢教務處招生組。",
        en: "For case-specific issues, prepare your application number, identity information, department or program name, and relevant documents before contacting the Division of Admissions."
      },
      {
        zh: "若涉及考生陳情、申訴或退費，請依招生組或當年度簡章公告的方式提出。",
        en: "If the issue involves applicant petitions, appeals, or refunds, follow the instructions provided by the Division of Admissions or the admission guidelines for that year."
      }
    ]
  },
  {
    id: "academic_program_and_statistics_inquiry",
    task_name_zh: "查詢學程、境外專班與教務統計相關資訊",
    task_name_en: "Academic Program, Overseas Program, and Academic Statistics Inquiry",
    scenario_zh:
      "你需要查詢院系所或學位學程增設調整、境外專班、招生名額、年度報告、校務研究或教務統計相關資訊。",
    scenario_en:
      "You need information about the establishment or adjustment of colleges, departments, degree programs, overseas programs, admission quotas, annual reports, institutional research, or academic statistics.",
    target_unit_type: "office",
    target_unit_id: "oaa_generalaffairs",
    category_id: "academic_affairs",
    required_documents_zh: [
      "明確的查詢主題，例如學程名稱、系所名稱、招生名額、年度報告、境外專班或校務研究資料。",
      "若是正式申請或校內行政流程，請依綜合業務組公告或承辦人指示準備資料。"
    ],
    required_documents_en: [
      "A clear inquiry topic, such as program name, department name, admission quota, annual report, overseas program, or institutional research data.",
      "For formal applications or internal administrative procedures, prepare documents according to the Division of General Affairs announcement or staff instructions."
    ],
    steps: [
      {
        zh: "先確認你要查詢的是學程資訊、院系所增設調整、境外專班、招生名額、年度報告或校務研究資料。",
        en: "First identify whether your inquiry is about program information, department or program establishment and adjustment, overseas programs, admission quotas, annual reports, or institutional research."
      },
      {
        zh: "至教務處綜合業務組頁面查看業務職掌與相關資訊。",
        en: "Visit the Division of General Affairs page under the Office of Academic Affairs to check its responsibilities and related information."
      },
      {
        zh: "若是增設調整院系所或學位學程相關問題，請查看教務處「增設調整系所」頁面與作業要點。",
        en: "For questions about establishing or adjusting departments or degree programs, check the Office of Academic Affairs page on department and program establishment or adjustment and its related regulations."
      },
      {
        zh: "若需要進一步資料或正式行政協助，請依頁面提供之承辦人或信箱洽詢綜合業務組。",
        en: "If further data or formal administrative assistance is needed, contact the Division of General Affairs using the staff contact information or email listed on the official page."
      }
    ]
  },
  {
    id: "course_feedback_ta_and_learning_support",
    task_name_zh: "教學意見調查、TA 認證與學習支持",
    task_name_en: "Course Feedback, TA Certification, and Learning Support",
    scenario_zh:
      "你需要填寫教學意見調查、了解學習支持資源，或查詢教學助理 TA 認證課程與相關研習資訊。",
    scenario_en:
      "You need to complete course feedback, find learning support resources, or check Teaching Assistant certification courses and related training information.",
    target_unit_type: "office",
    target_unit_id: "ctld",
    category_id: "academic_affairs",
    required_documents_zh: [
      "教學意見調查：通常需使用學校系統登入。",
      "TA 認證或研習：請準備學生身分、課程或助教相關資料，並依公告要求辦理。",
      "學習支持或教學相關問題：請準備課程名稱、授課教師、問題描述與相關截圖或證明。"
    ],
    required_documents_en: [
      "Course feedback: school system login is usually required.",
      "TA certification or training: prepare your student identity, course or TA-related information, and follow the announcement requirements.",
      "Learning support or teaching-related issues: prepare the course name, instructor name, issue description, and relevant screenshots or evidence."
    ],
    steps: [
      {
        zh: "若要填寫教學意見調查，請從教務處線上系統或常用系統進入線上教學意見調查系統。",
        en: "To complete course feedback, access the online course evaluation system through the Office of Academic Affairs online systems or common systems."
      },
      {
        zh: "若要查詢 TA 認證或研習，請至教學發展中心的教學助理 TA 頁面確認當學期課程與名單公告。",
        en: "To check TA certification or training, visit the Teaching Assistant section of the Center for Teaching and Learning Development to confirm current semester courses and certification lists."
      },
      {
        zh: "若是學習支持或教學相關問題，請先整理課程名稱、授課教師與問題內容，再依教學發展中心公告或承辦人資訊洽詢。",
        en: "For learning support or teaching-related issues, organize the course name, instructor, and issue description before contacting the Center for Teaching and Learning Development according to its announcements or staff information."
      }
    ]
  },
  {
    id: "counseling_first_appointment",
    task_name_zh: "預約初次諮商與心理支持",
    task_name_en: "First Counseling Appointment and Mental Health Support",
    scenario_zh:
      "你感到壓力、焦慮、孤單、適應困難，或希望預約初次晤談與了解心理支持資源。",
    scenario_en:
      "You feel stressed, anxious, lonely, have adjustment difficulties, or want to schedule a first counseling appointment and learn about mental health support resources.",
    target_unit_type: "office",
    target_unit_id: "counseling",
    category_id: "counseling",
    required_documents_zh: [
      "可使用的 Email 信箱，系統會寄送預約成功通知。",
      "初談時請提前 5 至 10 分鐘親至諮商中心填寫基本資料表。",
      "若需取消，請依官方說明於預定晤談日前一天透過系統或電話取消。"
    ],
    required_documents_en: [
      "An accessible email address, as the system will send a successful reservation notice.",
      "Arrive at the Counseling Center 5 to 10 minutes early for the first interview to complete the basic information form.",
      "If cancellation is needed, cancel through the system or by phone no later than the day before the scheduled appointment according to official instructions."
    ],
    steps: [
      {
        zh: "進入諮商中心初次晤談預約系統，查看預約時間表。",
        en: "Enter the Counseling Center first appointment reservation system and check the available schedule."
      },
      {
        zh: "預約受理時間為預定初談日前兩週至前一天；請選擇可出席的時段。",
        en: "Reservations are accepted from two weeks before to one day before the planned first appointment. Choose a time slot you can attend."
      },
      {
        zh: "完成預約後，系統出現預約成功畫面才算完成，系統也會寄信至你填寫的信箱。",
        en: "The reservation is completed only when the system shows a successful reservation screen. The system will also send an email to the address you provided."
      },
      {
        zh: "請於預約時段前 5 至 10 分鐘到活動中心三樓諮商中心，填寫基本資料表並準時報到。",
        en: "Arrive at the Counseling Center on the third floor of the Activity Center 5 to 10 minutes before your appointment to complete the basic information form and check in on time."
      },
      {
        zh: "若無法前來，最遲應於預定晤談日前一天透過系統或電話取消，以維護資源使用公平。",
        en: "If you cannot attend, cancel through the system or by phone no later than the day before the scheduled appointment to maintain fair access to resources."
      }
    ]
  },
  {
    id: "activity_venue_equipment_and_club_application",
    task_name_zh: "活動場地器材借用與社團活動申請",
    task_name_en: "Activity Venue, Equipment, and Club Activity Application",
    scenario_zh:
      "你或你的社團需要申請活動中心場地、器材、社團活動、校外活動、電子看板或社團行政服務。",
    scenario_en:
      "You or your club need to apply for Activity Center venues, equipment, club activities, off-campus activities, digital signage, or student club administrative services.",
    target_unit_type: "office",
    target_unit_id: "osa_extracurricular",
    category_id: "student_affairs",
    required_documents_zh: [
      "活動基本資料與活動計畫書。",
      "若為校外活動，依公告可能需家長同意書與保險相關資料。",
      "若借用場地或器材，需確認活動日期、時間、場地、器材需求與申請人聯絡資料。"
    ],
    required_documents_en: [
      "Basic activity information and activity proposal.",
      "For off-campus activities, parental consent forms and insurance-related documents may be required according to announcements.",
      "For venue or equipment borrowing, confirm activity date, time, venue, equipment needs, and applicant contact information."
    ],
    steps: [
      {
        zh: "先確認你要申請的是校內活動、校外活動、活動中心場地器材、社團服務或電子看板。",
        en: "First identify whether you are applying for an on-campus activity, off-campus activity, Activity Center venue or equipment, club service, or digital signage."
      },
      {
        zh: "依課外活動組公告，使用 SSO 登入活中場器系統線上申請。",
        en: "According to the Division of Extracurricular Activities announcement, use SSO to log in to the Activity Center venue and equipment system for online application."
      },
      {
        zh: "填寫活動基本資料，並依申請類型附上活動計畫書或相關文件。",
        en: "Fill in the basic activity information and attach the activity proposal or required documents according to the application type."
      },
      {
        zh: "課外活動組承辦人會依活動內容提出注意事項並進行初步審核，必要時會會簽相關主管單位。",
        en: "The staff of the Division of Extracurricular Activities will review the application, provide comments based on the activity content, and coordinate with related units if necessary."
      },
      {
        zh: "活動核准後，請依核准時間與規定使用場地及器材，並於使用後恢復原狀。",
        en: "After approval, use the venue and equipment according to the approved time and rules, and restore the venue after use."
      }
    ]
  },
  {
    id: "vehicle_parking_permit_inquiry",
    task_name_zh: "申請車輛通行證與停車相關服務",
    task_name_en: "Vehicle Access Permit and Parking Service Inquiry",
    scenario_zh:
      "你需要了解校內車輛通行、停車規定、機車或汽車通行證、車證申請系統或車管相關問題。",
    scenario_en:
      "You need information about campus vehicle access, parking rules, scooter or car permits, the vehicle permit application system, or vehicle management issues.",
    target_unit_type: "office",
    target_unit_id: "vehicle_control",
    category_id: "student_affairs",
    required_documents_zh: [
      "學生證或本校身分證明。",
      "車輛相關資料，例如車牌號碼、行照或申請系統要求之資料。",
      "若為特殊車種或特殊情況，請依駐警隊車管業務或車證申請系統公告準備。"
    ],
    required_documents_en: [
      "Student ID card or CCU identification.",
      "Vehicle information such as license plate number, vehicle registration, or other information required by the application system.",
      "For special vehicle types or special circumstances, prepare documents according to the Campus Security vehicle management or permit application system announcements."
    ],
    steps: [
      {
        zh: "先確認你的需求是汽車、機車、微型電動二輪車或其他車輛通行與停車問題。",
        en: "First identify whether your need concerns cars, scooters, micro electric two-wheel vehicles, or other vehicle access and parking issues."
      },
      {
        zh: "至總務處駐警隊的車管業務或車證申請系統查看最新申請規定。",
        en: "Check the Campus Security vehicle management page or vehicle permit application system under the Office of General Affairs for the latest application rules."
      },
      {
        zh: "依系統要求填寫申請資料並上傳或提供車輛相關證明。",
        en: "Fill in the application information and upload or provide vehicle-related documents as required by the system."
      },
      {
        zh: "若不確定是否符合申請資格，請先洽詢駐警隊車管相關窗口。",
        en: "If you are unsure whether you are eligible, contact the Campus Security vehicle management service first."
      }
    ]
  },
  {
    id: "campus_facility_repair_inquiry",
    task_name_zh: "校園公共設施維修與緊急搶修通報",
    task_name_en: "Campus Public Facility Repair and Emergency Maintenance Report",
    scenario_zh:
      "你發現公共空間設備損壞，例如燈具、浴室漏水、局部跳電或其他需要維修的校園設施問題。",
    scenario_en:
      "You notice damage or malfunction in public facilities, such as lights, bathroom leaks, partial power outages, or other campus maintenance issues.",
    target_unit_type: "office",
    target_unit_id: "oga_services",
    category_id: "student_affairs",
    required_documents_zh: [
      "問題地點，例如建築物、樓層、房間或公共區域。",
      "問題描述與照片。",
      "若為緊急狀況，請準備可聯絡電話並立即通知相關管理或警衛單位。"
    ],
    required_documents_en: [
      "Problem location, such as building, floor, room, or public area.",
      "Description and photos of the issue.",
      "For emergencies, prepare a contact phone number and notify the responsible manager or campus security immediately."
    ],
    steps: [
      {
        zh: "先判斷問題是否屬於各單位自行管理設備；若是單位自行管理設備，應由使用單位自行處理。",
        en: "First determine whether the issue concerns equipment managed by a specific unit. If so, the user unit should handle it first."
      },
      {
        zh: "若是公共區域問題，請先通知該區域或單位管理員，由管理員進行初級維修或判斷。",
        en: "For public area issues, notify the area or unit manager first so they can conduct basic repair or assessment."
      },
      {
        zh: "若管理員無法處理，再由管理員填具維修單送交營繕組處理。",
        en: "If the manager cannot resolve the issue, the manager should submit a maintenance request to the Construction and Maintenance Division."
      },
      {
        zh: "若為下班時間緊急搶修，依官方流程請通知警衛室，再由警衛室通知相關單位處理。",
        en: "For emergency repairs after office hours, notify the security office according to the official procedure, and the security office will contact the relevant unit."
      }
    ]
  },
  {
    id: "tuition_payment_receipt_and_cashier_service",
    task_name_zh: "學雜費繳費、收據與出納服務",
    task_name_en: "Tuition Payment, Receipt, and Cashier Services",
    scenario_zh:
      "你需要列印學雜費繳費單、確認線上繳費方式、處理就學貸款、繳納工本費、申請收據或洽詢出納相關服務。",
    scenario_en:
      "You need to print a tuition payment slip, check online payment methods, handle student loans, pay processing fees, request receipts, or ask about cashier services.",
    target_unit_type: "office",
    target_unit_id: "cashier",
    category_id: "tuition",
    required_documents_zh: [
      "學生證或學號。",
      "繳費單、繳費通知或台灣銀行學雜費入口網站資料。",
      "若申請收據或處理工本費，請準備申請項目與繳款資料。"
    ],
    required_documents_en: [
      "Student ID card or student number.",
      "Payment slip, payment notice, or information from the Bank of Taiwan tuition payment portal.",
      "For receipt requests or processing fee payments, prepare the application item and payment information."
    ],
    steps: [
      {
        zh: "先確認你要辦理的是學雜費繳費、列印繳費單、線上繳費、就學貸款、工本費繳納或收據問題。",
        en: "First identify whether your issue concerns tuition payment, printing payment slips, online payment, student loans, processing fees, or receipts."
      },
      {
        zh: "至出納組學雜費繳費專區查看收費標準、台灣銀行學雜費入口網站與線上繳費說明。",
        en: "Visit the Cashier Division tuition and fees section to check fee standards, the Bank of Taiwan tuition payment portal, and online payment instructions."
      },
      {
        zh: "若為就學貸款，依頁面說明使用台灣銀行就學貸款入口網，或從學校 SSO 進入就學貸款可貸費用明細線上申請系統。",
        en: "For student loans, follow the page instructions to use the Bank of Taiwan student loan portal, or access the school loan-related online application system through CCU SSO."
      },
      {
        zh: "若為工本費繳納，例如補發學生證、宿舍鑰匙等，官方流程指出可至出納櫃台填寫申請書並繳費，再交由相關單位辦理。",
        en: "For processing fees such as student ID replacement or dormitory key fees, the official procedure states that you may complete the application form and pay at the cashier counter, then submit it to the relevant unit."
      }
    ]
  }
];

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();

const includesAny = (haystack: string, needles: string[]) => {
  const normalized = normalize(haystack);
  return needles.some(needle => normalized.includes(normalize(needle)));
};

const collectUnitText = (unit: Office | Department) => [
  unit.name_zh,
  unit.name_en,
  unit.building_name_zh,
  unit.building_name_en,
  unit.floor,
  unit.room_zh || "",
  unit.room_en || "",
  unit.indoor_location_note_zh,
  unit.indoor_location_note_en,
  unit.function_desc_zh,
  unit.function_desc_en,
  unit.service_scope_zh,
  unit.service_scope_en,
  unit.google_maps_query,
  "common_scenarios_zh" in unit ? unit.common_scenarios_zh : "",
  "common_scenarios_en" in unit ? unit.common_scenarios_en : "",
  "college_zh" in unit ? unit.college_zh : "",
  "college_en" in unit ? unit.college_en : "",
].join(" ");

const SEARCH_SYNONYMS: Record<string, string[]> = {
  "居留證": ["arc", "外僑居留證", "residence permit", "alien resident certificate"],
  "arc": ["居留證", "外僑居留證", "residence permit", "alien resident certificate"],
  "簽證": ["visa", "居留簽證", "停留簽證", "resident visa", "visitor visa"],
  "visa": ["簽證", "居留簽證", "停留簽證", "resident visa", "visitor visa"],

  "工作證": ["工作許可", "work permit", "打工", "part-time work"],
  "工作許可": ["工作證", "work permit", "打工", "part-time work"],
  "work permit": ["工作證", "工作許可", "打工"],

  "加簽": ["加選", "課程加簽", "override", "course override", "必修課滿了"],
  "加選": ["加簽", "override", "course override"],
  "override": ["加簽", "加選", "course override"],

  "退選": ["棄選", "withdraw", "course withdrawal", "drop course"],
  "棄選": ["退選", "withdraw", "course withdrawal", "drop course"],
  "withdraw": ["退選", "棄選", "course withdrawal"],

  "學費": ["學雜費", "繳費", "tuition", "fee", "payment"],
  "學雜費": ["學費", "繳費", "tuition", "fee", "payment"],
  "宿舍費": ["住宿費", "宿舍繳費", "dormitory fee", "dorm fee"],
  "繳費": ["學費", "學雜費", "宿舍費", "payment", "cashier"],

  "信箱": ["email", "webmail", "ccu email", "校園信箱"],
  "email": ["信箱", "webmail", "ccu email", "校園信箱"],
  "密碼": ["password", "sso", "單一入口", "登入"],
  "password": ["密碼", "sso", "單一入口", "登入"],

  "健保": ["nhi", "health insurance", "健康保險"],
  "nhi": ["健保", "health insurance", "健康保險"],
  "保險": ["團保", "學生團體保險", "insurance", "claim", "理賠"],
  "理賠": ["保險", "團保", "student insurance claim"],

  "休學": ["suspension", "leave of absence", "暫時停學"],
  "復學": ["reinstatement", "return to study"],
  "退學": ["withdrawal", "withdraw from school"],

  "成績單": ["transcript", "academic records", "學籍成績證明"],
  "在學證明": ["enrollment certificate", "certificate of enrollment"],
  "課程大綱": ["syllabus", "course syllabus", "課綱"],

  "教授": ["professor", "instructor", "老師"],
  "老師": ["professor", "instructor", "教授"],
  "教授不收國際生": ["drop course", "加退選", "教授", "international students"],

  "畢業": ["graduation", "畢業資格", "離校", "學位服"],
  "學位服": ["畢業服", "graduation gown", "gown"],

  "急難": ["急難救助", "emergency aid", "financial aid"],
  "獎學金": ["scholarship", "financial aid"],

  "註冊繳費": ["學雜費", "繳費", "tuition", "semester registration"],
  "報到": ["入學報到", "registration", "check in"],
  "交換生": ["exchange student", "visiting student", "校際生"],
  "eCourse": ["ecourse2", "線上學習平台", "課程平台"],
  "單一入口": ["sso", "portal", "登入", "密碼"],
  "請假": ["leave", "absence", "請假系統"],
  "課綱": ["課程大綱", "syllabus", "course syllabus"],
  "國際處": ["oia", "office of international affairs"],
  "教務處": ["oaa", "office of academic affairs"],
  "資訊處": ["it center", "information technology office"],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[，。！？、；：,.!?;:()[\]{}"'“”‘’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandQuery(query: string): string[] {
  const normalized = normalizeText(query);
  const tokens = normalized.split(" ").filter(Boolean);
  const expanded = new Set<string>();

  if (normalized) expanded.add(normalized);

  for (const token of tokens) {
    expanded.add(token);
    const synonyms = SEARCH_SYNONYMS[token];
    if (synonyms) {
      synonyms.forEach((s) => expanded.add(normalizeText(s)));
    }
  }

  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (normalized.includes(key)) {
      expanded.add(normalizeText(key));
      synonyms.forEach((s) => expanded.add(normalizeText(s)));
    }
  }

  return Array.from(expanded).filter(Boolean);
}

function countMatches(text: string, queryTerms: string[]): number {
  const normalized = normalizeText(text);
  if (!normalized) return 0;

  let score = 0;

  for (const term of queryTerms) {
    if (!term) continue;

    if (normalized === term) {
      score += 20;
    } else if (normalized.includes(term)) {
      score += 8;
    } else {
      const words = term.split(" ").filter(Boolean);
      for (const word of words) {
        if (word.length >= 2 && normalized.includes(word)) {
          score += 2;
        }
      }
    }
  }

  return score;
}

function joinFields(fields: Array<string | string[] | undefined>): string {
  return fields
    .flatMap((field) => {
      if (!field) return [];
      return Array.isArray(field) ? field : [field];
    })
    .join(" ");
}

export function searchByNeed(query: string, _language: "en" | "zh" = "en"): { offices: Office[]; departments: Department[]; tasks: Task[] } {
  const queryTerms = expandQuery(query);

  if (queryTerms.length === 0) {
    return {
      tasks: [],
      offices: [],
      departments: [],
    };
  }

  const scoredTasks = tasks
    .map((task) => {
      const stepText = task.steps
        .map((step) => `${step.zh} ${step.en}`)
        .join(" ");

      const searchableText = joinFields([
        task.id,
        task.task_name_zh,
        task.task_name_en,
        task.scenario_zh,
        task.scenario_en,
        task.category_id,
        task.target_unit_id,
        task.required_documents_zh,
        task.required_documents_en,
        stepText,
      ]);

      let score = countMatches(searchableText, queryTerms);

      score += countMatches(task.task_name_zh, queryTerms) * 3;
      score += countMatches(task.task_name_en, queryTerms) * 3;
      score += countMatches(task.scenario_zh, queryTerms) * 2;
      score += countMatches(task.scenario_en, queryTerms) * 2;

      return { item: task, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const matchedTaskUnitIds = new Set(
    scoredTasks
      .slice(0, 8)
      .map(({ item }) => item.target_unit_id)
      .filter(Boolean)
  );

  const scoredOffices = offices
    .map((office) => {
      const searchableText = joinFields([
        office.id,
        office.name_zh,
        office.name_en,
        office.function_desc_zh,
        office.function_desc_en,
        office.service_scope_zh,
        office.service_scope_en,
        office.common_scenarios_zh,
        office.common_scenarios_en,
        office.building_name_zh,
        office.building_name_en,
        office.floor,
        office.room_zh,
        office.room_en,
        office.email,
        office.phone,
        office.service_categories,
      ]);

      let score = countMatches(searchableText, queryTerms);

      score += countMatches(office.name_zh, queryTerms) * 3;
      score += countMatches(office.name_en, queryTerms) * 3;
      score += countMatches(office.service_scope_zh, queryTerms) * 2;
      score += countMatches(office.service_scope_en, queryTerms) * 2;

      if (matchedTaskUnitIds.has(office.id)) {
        score += 15;
      }

      return { item: office, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const scoredDepartments = departments
    .map((dept) => {
      const searchableText = joinFields([
        dept.id,
        dept.name_zh,
        dept.name_en,
        dept.college_zh,
        dept.college_en,
        dept.function_desc_zh,
        dept.function_desc_en,
        dept.service_scope_zh,
        dept.service_scope_en,
        dept.building_name_zh,
        dept.building_name_en,
        dept.floor,
        dept.room_zh,
        dept.room_en,
        dept.service_categories,
      ]);

      let score = countMatches(searchableText, queryTerms);

      score += countMatches(dept.name_zh, queryTerms) * 3;
      score += countMatches(dept.name_en, queryTerms) * 3;
      score += countMatches(dept.college_zh, queryTerms) * 2;
      score += countMatches(dept.college_en, queryTerms) * 2;

      if (matchedTaskUnitIds.has(dept.id)) {
        score += 15;
      }

      return { item: dept, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    tasks: scoredTasks.slice(0, 12).map(({ item }) => item),
    offices: scoredOffices.slice(0, 8).map(({ item }) => item),
    departments: scoredDepartments.slice(0, 8).map(({ item }) => item),
  };
}

export function getOfficeById(id: string) {
  return offices.find(office => office.id === id);
}

export function getDepartmentById(id: string) {
  return departments.find(department => department.id === id);
}

export function getTaskById(id: string) {
  return tasks.find(task => task.id === id);
}

export function getServiceCategoryById(id: string) {
  return serviceCategories.find(category => category.id === id);
}

export function filterByCategory(categoryId: string) {
  return {
    offices: offices.filter(o => o.service_categories.includes(categoryId)),
    departments: departments.filter(d => d.service_categories.includes(categoryId)),
    tasks: tasks.filter(t => t.category_id === categoryId),
  };
}

export function getColleges() {
  const seen = new Map<string, { zh: string; en: string }>();
  departments.forEach(d => {
    if (!seen.has(d.college_en)) {
      seen.set(d.college_en, { zh: d.college_zh, en: d.college_en });
    }
  });
  return Array.from(seen.values());
}
