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
  },
  {
    "id": "transportation",
    "name_en": "Transportation",
    "name_zh": "交通",
    "icon": "Bus",
    "description_en": "YouBike, buses, taxis, and airport transportation",
    "description_zh": "YouBike、公車、計程車與機場交通",
    "keywords": [
      "bus",
      "taxi",
      "YouBike",
      "airport",
      "交通",
      "公車",
      "計程車",
      "機場",
      "民雄"
    ]
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": false,
    "entrance_image": "/images/offices/oaa/entrance.jpg"
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/oaa_admissions/entrance.jpg"
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
    "latitude": 23.5628,
    "longitude": 120.4724,
    "source_url": "https://oaa.ccu.edu.tw/",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/oaa_generalaffairs/entrance.jpg"
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
    "needs_manual_review": true,
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/osa/entrance.jpg"
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/osa_life/entrance.jpg"
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
    "needs_manual_review": true,
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/osa_safety/entrance.jpg"
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
    "needs_manual_review": true,
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "https://oga.ccu.edu.tw/",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/oga_services/entrance.jpg"
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "https://oga.ccu.edu.tw/",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/cashier/entrance.jpg"
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "https://oga.ccu.edu.tw/",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/property_management/entrance.jpg"
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/personnel/entrance.jpg"
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
    "needs_manual_review": true,
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
    "latitude": 23.564,
    "longitude": 120.4714,
    "source_url": "https://secretar.ccu.edu.tw/",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/secretariat/entrance.jpg"
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
    "latitude": 23.5628,
    "longitude": 120.4738,
    "source_url": "https://career.ccu.edu.tw/",
    "needs_manual_review": true,
    "entrance_image": "/images/offices/career_center/entrance.jpg"
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "latitude": 23.5613,
    "longitude": 120.47,
    "source_url": "",
    "needs_manual_review": true,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_humanities/philosophy/entrance.jpg",
    "floor_plan_image": "/images/departments/college_humanities/philosophy/floor_plan.jpg"
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
    "is_college_office": false
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
    "needs_manual_review": true,
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
    "needs_manual_review": true,
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
    "latitude": 23.5636,
    "longitude": 120.4692,
    "source_url": "https://polsci.ccu.edu.tw/",
    "needs_manual_review": true,
    "is_college_office": false,
    "entrance_image": "/images/departments/college_social_sciences/political_science/entrance.jpg",
    "floor_plan_image": "/images/departments/college_social_sciences/political_science/floor_plan.jpg"
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "使用線上申辦系統。",
        "en": "Use the Students Online Application System."
      },
      {
        "zh": "註冊並啟用帳號。",
        "en": "Create and activate an account."
      },
      {
        "zh": "填寫資料並上傳大頭照、護照、居留簽證、居住證明與入學/在學證明。",
        "en": "Fill out the form and upload photo, passport, resident visa, proof of accommodation, and admission/enrollment proof."
      },
      {
        "zh": "資料核准後繳費 NT$1,000/年。",
        "en": "Pay NT$1,000 per year after approval."
      },
      {
        "zh": "攜帶繳費收據至移民署領取居留證。",
        "en": "Bring your payment receipt and collect your ARC at the NIA service center."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "arc_extension",
    "task_name_zh": "申請延期居留證",
    "task_name_en": "Extending an ARC",
    "scenario_zh": "你需要延長在台灣的居留期限。",
    "scenario_en": "You need to extend your residency in Taiwan.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "nhi_card",
    "task_name_zh": "申請健保卡",
    "task_name_en": "Apply for National Health Insurance (NHI) Card",
    "scenario_zh": "你需在台灣居住超過6個月才有資格申請健保卡。",
    "scenario_en": "You must stay in Taiwan for more than six months to apply for an NHI card.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "medical_with_nhi",
    "task_name_zh": "校外就醫看病（有健保卡）",
    "task_name_en": "Off-Campus Medical Treatment (with NHI Card)",
    "scenario_zh": "你身體不舒服，需要就醫且已有健保卡。",
    "scenario_en": "You feel unwell and need to see a doctor with an NHI card.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "medical_without_nhi",
    "task_name_zh": "校外就醫看病（無健保卡）",
    "task_name_en": "Off-Campus Medical Treatment (without NHI Card)",
    "scenario_zh": "你身體不舒服，需要就醫但沒有健保卡。",
    "scenario_en": "You feel unwell and need to see a doctor without an NHI card.",
    "target_unit_type": "office",
    "target_unit_id": "health_center",
    "category_id": "health",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "postal_account",
    "task_name_zh": "辦理郵局帳戶",
    "task_name_en": "Apply for a Postal Account",
    "scenario_zh": "你需要郵局帳戶以領取獎學金、存錢、提款或繳費。",
    "scenario_en": "You need a postal account to receive scholarships, save money, withdraw cash, or pay fees.",
    "target_unit_type": "office",
    "target_unit_id": "oia",
    "category_id": "international_support",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "course_password_error",
    "task_name_zh": "選課密碼輸入持續顯示錯誤",
    "task_name_en": "Course Registration Password Keeps Showing as Incorrect",
    "scenario_zh": "你輸入選課密碼一直顯示錯誤。",
    "scenario_en": "Your course registration password keeps showing as incorrect.",
    "target_unit_type": "office",
    "target_unit_id": "oaa",
    "category_id": "course_issues",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "target_unit_id": "college_management_office",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "dorm_parcel",
    "task_name_zh": "宿舍包裹服務",
    "task_name_en": "Dormitory Parcel Service",
    "scenario_zh": "你需要收宿舍包裹或委託宿舍服務中心代收。",
    "scenario_en": "You need to receive dormitory parcels or request proxy collection.",
    "target_unit_type": "office",
    "target_unit_id": "dorm_service",
    "category_id": "dormitory",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "dorm_checkin",
    "task_name_zh": "住宿報到程序",
    "task_name_en": "Dormitory Check-In Procedure",
    "scenario_zh": "你需要完成宿舍入住報到。",
    "scenario_en": "You need to complete dormitory check-in.",
    "target_unit_type": "office",
    "target_unit_id": "dorm_service",
    "category_id": "dormitory",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "find_dorm",
    "task_name_zh": "找不到宿舍",
    "task_name_en": "Unable to Find the Dormitory",
    "scenario_zh": "你剛到學校但找不到宿舍位置。",
    "scenario_en": "You just arrived and cannot find your dormitory.",
    "target_unit_type": "office",
    "target_unit_id": "dorm_service",
    "category_id": "dormitory",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "printing",
    "task_name_zh": "哪裡可以列印東西",
    "task_name_en": "Where to Print Documents",
    "scenario_zh": "你需要在校內或附近找地方列印文件。",
    "scenario_en": "You need to find places on or near campus to print documents.",
    "target_unit_type": "office",
    "target_unit_id": "it_center",
    "category_id": "it_support",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "join_club",
    "task_name_zh": "加入社團或參加校園活動",
    "task_name_en": "Joining Clubs or Participating in Campus Activities",
    "scenario_zh": "你想找到有興趣的社團或參加校內活動。",
    "scenario_en": "You want to find clubs or participate in campus activities.",
    "target_unit_type": "office",
    "target_unit_id": "osa_extracurricular",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "language_learning",
    "task_name_zh": "取得語言學習與中文課程支援",
    "task_name_en": "Chinese Language Learning and Course Support",
    "scenario_zh": "你想報名中文課程或了解語言學習資源。",
    "scenario_en": "You want to enroll in Chinese courses or find language learning resources.",
    "target_unit_type": "office",
    "target_unit_id": "language_center",
    "category_id": "academic_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "sports_facility",
    "task_name_zh": "預約體育設施的場地",
    "task_name_en": "Reserving Sports Facilities",
    "scenario_zh": "你想使用或預約校內體育設施。",
    "scenario_en": "You want to use or reserve sports facilities on campus.",
    "target_unit_type": "office",
    "target_unit_id": "osa_extracurricular",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "sports_hours",
    "task_name_zh": "健身房和體育館的開放時間",
    "task_name_en": "Gym and Sports Center Opening Hours",
    "scenario_zh": "你想知道校內體育設施的開放時間。",
    "scenario_en": "You want to know the opening hours of sports facilities.",
    "target_unit_type": "office",
    "target_unit_id": "osa_extracurricular",
    "category_id": "student_affairs",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "work_in_taiwan",
    "task_name_zh": "畢業後留台工作",
    "task_name_en": "Working in Taiwan After Graduation",
    "scenario_zh": "你畢業後想留在台灣工作。",
    "scenario_en": "You have graduated and want to stay in Taiwan for work.",
    "target_unit_type": "office",
    "target_unit_id": "career_center",
    "category_id": "career",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
      }
    ]
  },
  {
    "id": "part_time_jobs",
    "task_name_zh": "校園附近兼職資訊",
    "task_name_en": "Part-Time Job Opportunities Near Campus",
    "scenario_zh": "你想在校內或附近找打工或實習機會。",
    "scenario_en": "You are looking for part-time work or internships on or near campus.",
    "target_unit_type": "office",
    "target_unit_id": "career_center",
    "category_id": "career",
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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
    "required_documents_zh": [],
    "required_documents_en": [],
    "steps": [
      {
        "zh": "確認需求與適用條件。",
        "en": "Confirm your need and eligibility."
      },
      {
        "zh": "準備所需文件或資訊。",
        "en": "Prepare the required documents or information."
      },
      {
        "zh": "依指引至負責單位或線上系統辦理。",
        "en": "Follow the guide to complete the process online or at the responsible unit."
      },
      {
        "zh": "完成後再次確認結果。",
        "en": "Check the result after completion."
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

export function searchByNeed(query: string, _language: "en" | "zh" = "en"): { offices: Office[]; departments: Department[]; tasks: Task[] } {
  const q = normalize(query);
  if (!q) return { offices: [], departments: [], tasks: [] };

  const keywordHints = serviceCategories
    .filter(category => includesAny(q, [category.name_en, category.name_zh, ...category.keywords]))
    .map(category => category.id);

  const officeResults = offices.filter(office => {
    const text = collectUnitText(office);
    return normalize(text).includes(q) || office.service_categories.some(id => keywordHints.includes(id));
  });

  const departmentResults = departments.filter(department => {
    const text = collectUnitText(department);
    return normalize(text).includes(q) || department.service_categories.some(id => keywordHints.includes(id));
  });

  const taskResults = tasks.filter(task => {
    const text = [
      task.task_name_zh,
      task.task_name_en,
      task.scenario_zh,
      task.scenario_en,
      task.category_id,
      ...task.required_documents_zh,
      ...task.required_documents_en,
      ...task.steps.flatMap(step => [step.zh, step.en]),
    ].join(" ");
    return normalize(text).includes(q) || keywordHints.includes(task.category_id);
  });

  return { offices: officeResults, departments: departmentResults, tasks: taskResults };
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
