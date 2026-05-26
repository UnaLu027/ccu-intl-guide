export type StudentGuideId = "degree" | "exchange";
export type StudentGuideAudience = "degree" | "exchange";

export type StudentGuideCategoryId =
  | "before_arrival"
  | "before_departure"
  | "visa_arc"
  | "visa_insurance"
  | "registration"
  | "payment_fees"
  | "accommodation"
  | "health_insurance"
  | "campus_life"
  | "postal_account"
  | "safety_regulations"
  | "anti_fraud"
  | "anti_sexual_harassment"
  | "orientation"
  | "course_selection"
  | "arc"
  | "end_exchange";

export interface StudentGuideCategory {
  id: StudentGuideCategoryId;
  name_en: string;
  name_zh: string;
}

export interface StudentGuideLink {
  url: string;
  label_en: string;
  label_zh: string;
}

export type LocalizedTableValue = string | { en: string; zh: string };

export type HandbookBlock =
  | { type: "paragraph"; content_en: string; content_zh: string }
  | { type: "note"; tone?: "info" | "warning" | "danger"; content_en: string; content_zh: string }
  | { type: "checklist"; items: Array<{ en: string; zh: string; note_en?: string; note_zh?: string }> }
  | { type: "timeline"; items: Array<{ date: string; event_en: string; event_zh: string }> }
  | {
      type: "table";
      columns: Array<{ key: string; label_en: string; label_zh: string }>;
      rows: Array<Record<string, LocalizedTableValue>>;
    }
  | { type: "links"; links: StudentGuideLink[] }
  | {
      type: "contact";
      name_en: string;
      name_zh: string;
      email?: string;
      phone?: string;
      location_en?: string;
      location_zh?: string;
      links?: StudentGuideLink[];
    };

export interface StudentGuideSourceReference {
  documentId: string;
  documentTitle_en: string;
  documentTitle_zh: string;
  pages: string;
}

export interface StudentGuideSection {
  id: string;
  title_en: string;
  title_zh: string;
  categoryId: StudentGuideCategoryId;
  tags_en: string[];
  tags_zh: string[];
  summary_en: string;
  summary_zh: string;
  sourceReferences?: StudentGuideSourceReference[];
  relatedTaskIds?: string[];
  blocks: HandbookBlock[];
}

export interface StudentGuide {
  id: StudentGuideId;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  audience: StudentGuideAudience;
  sourcePdfUrls: string[];
  filters: StudentGuideCategory[];
  sections: StudentGuideSection[];
}

const degreeSources = {
  handbook: {
    documentId: "handbook_2026_spring_international_students",
    documentTitle_en: "International Students Handbook",
    documentTitle_zh: "國際學生手冊",
  },
  quick: {
    documentId: "guide_2026_spring_international_students",
    documentTitle_en: "International Students Quick Guide",
    documentTitle_zh: "國際學生重點提醒",
  },
};

const exchangeSource = {
  documentId: "handbook_2026_spring_exchange_students",
  documentTitle_en: "Exchange Students Handbook",
  documentTitle_zh: "交換生手冊",
};

export const degreeGuideFilters: StudentGuideCategory[] = [
  { id: "before_arrival", name_en: "Before Arrival", name_zh: "抵達前" },
  { id: "visa_arc", name_en: "Visa & ARC", name_zh: "簽證與 ARC" },
  { id: "registration", name_en: "Registration", name_zh: "註冊" },
  { id: "payment_fees", name_en: "Payment & Fees", name_zh: "繳費與費用" },
  { id: "accommodation", name_en: "Accommodation", name_zh: "住宿" },
  { id: "health_insurance", name_en: "Health & Insurance", name_zh: "健康與保險" },
  { id: "campus_life", name_en: "Campus Life", name_zh: "校園生活" },
  { id: "postal_account", name_en: "Postal Savings Account", name_zh: "郵局帳戶" },
  { id: "safety_regulations", name_en: "Safety & Regulations", name_zh: "安全與法規" },
  { id: "anti_fraud", name_en: "Anti-Fraud", name_zh: "防詐騙" },
  { id: "anti_sexual_harassment", name_en: "Anti-Sexual Harassment", name_zh: "反性騷擾" },
];

export const exchangeGuideFilters: StudentGuideCategory[] = [
  { id: "before_arrival", name_en: "Before Arrival", name_zh: "抵達前" },
  { id: "visa_insurance", name_en: "Visa & Insurance", name_zh: "簽證與保險" },
  { id: "accommodation", name_en: "Dormitory", name_zh: "住宿" },
  { id: "orientation", name_en: "Check-in & Orientation", name_zh: "報到與說明會" },
  { id: "course_selection", name_en: "Course Selection", name_zh: "選課" },
  { id: "arc", name_en: "ARC", name_zh: "ARC" },
  { id: "payment_fees", name_en: "Fees", name_zh: "費用" },
  { id: "end_exchange", name_en: "Leaving Procedure", name_zh: "離校程序" },
];

export const studentGuides: StudentGuide[] = [
  {
    id: "degree",
    title_en: "Degree-Seeking Student Guide",
    title_zh: "學位生新生指南",
    description_en:
      "For international degree-seeking students who will study at CCU for a full degree program.",
    description_zh: "適用於即將至中正大學攻讀正式學位的國際學位生。",
    audience: "degree",
    sourcePdfUrls: [
      "/docs/handbooks/2026-spring-handbook-international-students.pdf",
      "/docs/handbooks/2026-spring-guide-international-students.pdf",
    ],
    filters: degreeGuideFilters,
    sections: [
      {
        id: "degree_welcome",
        title_en: "Welcome to CCU",
        title_zh: "歡迎來到中正大學",
        categoryId: "before_arrival",
        tags_en: ["welcome", "oia", "contact"],
        tags_zh: ["歡迎", "國際處", "聯絡方式"],
        summary_en: "OIA welcome message and contact channels for new international students.",
        summary_zh: "國際事務處給國際新生的歡迎訊息與聯絡方式。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.1-p.2" }],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "The Office of International Affairs welcomes international students to National Chung Cheng University and serves as a key support point for arrival, registration, and campus life questions.",
            content_zh:
              "國際事務處歡迎國際學生加入國立中正大學，也是抵臺、報到與校園生活遇到問題時的重要協助窗口。",
          },
          {
            type: "contact",
            name_en: "Office of International Affairs",
            name_zh: "國際事務處",
            email: "ccuoiais@ccu.edu.tw",
            phone: "+886-5-2720411 ext. 17618",
            links: [{ url: "https://oia.ccu.edu.tw/?Lang=en", label_en: "Open OIA Website", label_zh: "開啟國際處網站" }],
          },
        ],
      },
      {
        id: "degree_calendar",
        title_en: "Important Dates and Calendar",
        title_zh: "重要日期與行事曆",
        categoryId: "before_arrival",
        tags_en: ["calendar", "orientation", "registration"],
        tags_zh: ["行事曆", "迎新", "註冊"],
        summary_en: "Important dates for move-in, registration, orientation, exams, and dormitory move-out.",
        summary_zh: "宿舍入住、註冊、迎新、考試與退宿等重要日期。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.3-p.5" }],
        relatedTaskIds: ["registration_degree"],
        blocks: [
          {
            type: "timeline",
            items: [
              { date: "02/20", event_en: "Semester begins; dormitory move-in day.", event_zh: "學期開始；宿舍可開始入住。" },
              { date: "02/23", event_en: "New student registration begins.", event_zh: "新生註冊開始。" },
              { date: "02/23-03/06", event_en: "First course selection period for new students.", event_zh: "新生第一階段選課。" },
              { date: "02/25", event_en: "Welcome orientation for international students.", event_zh: "國際學生迎新說明會。" },
              { date: "04/01", event_en: "Registration deadline.", event_zh: "註冊截止日。" },
              { date: "07/05", event_en: "Dormitory move-out deadline.", event_zh: "宿舍退宿截止日。" },
            ],
          },
        ],
      },
      {
        id: "degree_pre_arrival_checklist",
        title_en: "Pre-arrival Checklist",
        title_zh: "抵達前準備清單",
        categoryId: "before_arrival",
        tags_en: ["documents", "passport", "visa", "health"],
        tags_zh: ["文件", "護照", "簽證", "健康檢查"],
        summary_en: "Documents, funds, personal items, and phone arrangements to prepare before coming to Taiwan.",
        summary_zh: "來臺前需準備的文件、資金、個人物品與通訊安排。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.6-p.7" }],
        relatedTaskIds: ["resident_visa_degree", "arc_resident_visa"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Valid resident visa and health certificate for ARC application.", zh: "有效居留簽證與申請 ARC 所需健康檢查證明。" },
              { en: "Passport original and three photocopies.", zh: "護照正本與三份影本。" },
              { en: "Personal photos and a digital photo file.", zh: "個人照片與電子檔。" },
              { en: "Diploma, transcript, language certificates, and financial statement.", zh: "畢業證書、成績單、語言能力證明與財力證明。" },
              { en: "Initial personal funds, regular medication, and phone or SIM card plan.", zh: "初期生活費、個人常用藥品，以及手機或 SIM 卡方案。" },
            ],
          },
          {
            type: "note",
            content_en: "The handbook suggests preparing around NT$60,000 per semester for initial personal expenses.",
            content_zh: "手冊建議每學期先準備約新臺幣 60,000 元作為初期個人開銷。",
          },
        ],
      },
      {
        id: "degree_fees",
        title_en: "Estimated Fees and Living Expenses",
        title_zh: "費用與生活開銷預估",
        categoryId: "payment_fees",
        tags_en: ["tuition", "payment", "fees"],
        tags_zh: ["學雜費", "繳費", "費用"],
        summary_en: "Estimated tuition, insurance, housing, network, computer lab, and living expenses.",
        summary_zh: "學雜費、保險、住宿、網路、電腦實習費與生活費預估。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.8-p.9" }],
        relatedTaskIds: ["tuition_fee", "tuition_payment_receipt_and_cashier_service", "dorm_fee"],
        blocks: [
          {
            type: "table",
            columns: [
              { key: "item", label_en: "Item", label_zh: "項目" },
              { key: "estimate", label_en: "Estimated Cost", label_zh: "預估費用" },
              { key: "note", label_en: "Note", label_zh: "備註" },
            ],
            rows: [
              {
                item: { en: "Tuition and miscellaneous fees", zh: "學雜費" },
                estimate: "NT$48,254-55,290",
                note: { en: "Varies by college or program.", zh: "依學院或學程而異。" },
              },
              {
                item: { en: "Student insurance", zh: "學生團體保險" },
                estimate: "NT$313",
                note: { en: "Per semester.", zh: "每學期收取。" },
              },
              {
                item: { en: "Medical insurance / NHI", zh: "醫療保險或全民健保" },
                estimate: "NT$3,000 / NT$4,956",
                note: { en: "Depends on NHI eligibility.", zh: "依是否符合健保資格而定。" },
              },
              {
                item: { en: "Dormitory network", zh: "宿舍網路費" },
                estimate: "NT$1,000",
                note: { en: "Per semester.", zh: "每學期收取。" },
              },
              {
                item: { en: "Living expenses", zh: "生活費" },
                estimate: { en: "Around NT$54,000", zh: "約 NT$54,000" },
                note: { en: "Approx. NT$9,000 per month.", zh: "約每月 NT$9,000。" },
              },
            ],
          },
        ],
      },
      {
        id: "degree_accommodation",
        title_en: "Accommodation",
        title_zh: "住宿",
        categoryId: "accommodation",
        tags_en: ["dormitory", "housing", "network"],
        tags_zh: ["宿舍", "住宿", "宿舍網路"],
        summary_en: "Dormitory assignment, room equipment, public facilities, and dormitory network reminders.",
        summary_zh: "宿舍安排、房間設備、公共設施與宿網申請提醒。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.10-p.12" }],
        relatedTaskIds: ["dorm_fee"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "OIA arranges on-campus accommodation for new international students.", zh: "國際處會協助新生安排校內住宿。" },
              { en: "Rooms are assigned by the university; students cannot choose rooms or roommates.", zh: "宿舍由學校安排，學生無法自行選擇房間或室友。" },
              { en: "Prepare your own mattress, pillow, quilt, sheets, and daily necessities.", zh: "請自備床墊、枕頭、棉被、床單與生活用品。" },
              { en: "Apply for dormitory wired network after receiving your room and bed number.", zh: "拿到房號與床號後，再申請宿舍有線網路。" },
            ],
          },
          {
            type: "links",
            links: [
              { url: "https://www.dorm.ccu.edu.tw/student/login", label_en: "Open Dormitory Network System", label_zh: "開啟宿舍網路申請系統" },
              { url: "https://www.dorm.ccu.edu.tw/en", label_en: "Open Dormitory Website", label_zh: "開啟宿舍服務網站" },
            ],
          },
        ],
      },
      {
        id: "degree_registration_overview",
        title_en: "Registration and Check-in Overview",
        title_zh: "註冊與報到流程總覽",
        categoryId: "registration",
        tags_en: ["registration", "student id", "documents"],
        tags_zh: ["註冊", "學生證", "文件"],
        summary_en: "Administrative steps after arrival, from dorm check-in to ARC application.",
        summary_zh: "抵校後從宿舍入住、照片上傳、繳費、文件繳交到 ARC 申請的流程總覽。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.13-p.19" },
          { ...degreeSources.quick, pages: "p.4-p.7" },
        ],
        relatedTaskIds: ["registration_degree", "tuition_fee", "arc_resident_visa", "new_student_health_check"],
        blocks: [
          {
            type: "timeline",
            items: [
              { date: "抵校後", event_en: "Complete dormitory check-in first.", event_zh: "先完成宿舍入住。" },
              { date: "報到時", event_en: "Go to OIA for registration and document review.", event_zh: "至國際處報到並確認文件。" },
              { date: "期限前", event_en: "Download the payment slip and complete payment.", event_zh: "下載繳費單並於期限前完成繳費。" },
              { date: "文件確認後", event_en: "Submit authenticated documents to the academic office to complete registration.", event_zh: "至教務處繳交驗證文件並完成註冊。" },
            ],
          },
        ],
      },
      {
        id: "degree_payment_receipt",
        title_en: "Payment and Receipts",
        title_zh: "繳費與收據",
        categoryId: "payment_fees",
        tags_en: ["payment", "receipt", "tuition"],
        tags_zh: ["繳費", "收據", "學雜費"],
        summary_en: "How payment receipts connect to registration and ARC residence certification.",
        summary_zh: "繳費收據與註冊、申請 ARC 居住證明之間的關係。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.5-p.6" }],
        relatedTaskIds: ["tuition_payment_receipt_and_cashier_service", "tuition_fee"],
        blocks: [
          {
            type: "note",
            content_en:
              "Even scholarship recipients may still need to complete payment procedures for insurance, dormitory deposit, or related fees. Payment proof may be needed before OIA issues residence certification for ARC application.",
            content_zh:
              "即使獲得獎學金，也可能仍須完成保險、宿舍保證金或相關費用的繳費程序。國際處核發 ARC 所需居住證明前，可能會確認繳費證明。",
          },
          {
            type: "links",
            links: [{ url: "https://school.bot.com.tw/newTwbank/StudentLogin.aspx", label_en: "Open Tuition Payment System", label_zh: "開啟學雜費繳費系統" }],
          },
        ],
      },
      {
        id: "degree_student_id",
        title_en: "Student ID Card Issuance",
        title_zh: "學生證領取",
        categoryId: "registration",
        tags_en: ["student id", "academic office"],
        tags_zh: ["學生證", "教務處"],
        summary_en: "Student ID is issued after the registration documents are reviewed by the academic office.",
        summary_zh: "教務處確認註冊文件後，學生可領取學生證。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.4" }],
        relatedTaskIds: ["registration_degree"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Prepare the student registration form provided by OIA.", zh: "準備國際處提供的學生註冊表。" },
              { en: "Prepare payment proof, passport with visa, authenticated diploma, and authenticated transcript.", zh: "準備繳費證明、含簽證之護照、驗證後畢業證書與成績單。" },
              { en: "Submit documents to the Division of Curriculum and Instruction to receive the student ID card.", zh: "至教務處教學組繳交文件並領取學生證。" },
            ],
          },
        ],
      },
      {
        id: "degree_enrollment_certificate",
        title_en: "Certificate of Enrollment",
        title_zh: "在學證明",
        categoryId: "registration",
        tags_en: ["certificate", "enrollment", "arc"],
        tags_zh: ["證明", "在學", "ARC"],
        summary_en: "Certificate of enrollment and payment proof may be needed before OIA issues residence certification for ARC.",
        summary_zh: "申請 ARC 的居住證明前，可能需要先準備在學證明與繳費證明。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.7" }],
        relatedTaskIds: ["arc_resident_visa"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Print Chinese and English certificates of enrollment after obtaining student ID.", zh: "取得學生證後，列印中文與英文在學證明。" },
              { en: "Send certificate of enrollment, payment proof, and accommodation deposit receipt to OIA if requested.", zh: "依國際處要求寄送在學證明、繳費證明與住宿保證金收據。" },
              { en: "OIA can then issue the residence certificate needed for ARC application.", zh: "國際處確認後可核發申請 ARC 所需的居住證明。" },
            ],
          },
        ],
      },
      {
        id: "degree_health_check",
        title_en: "Health Check",
        title_zh: "健康檢查",
        categoryId: "health_insurance",
        tags_en: ["health check", "auditorium"],
        tags_zh: ["健康檢查", "大禮堂"],
        summary_en: "New students must complete the on-campus health check even if they already completed an entry health check.",
        summary_zh: "即使已完成入境所需健康檢查，新生仍須完成校內健康檢查。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.19" },
          { ...degreeSources.quick, pages: "p.11" },
        ],
        relatedTaskIds: ["new_student_health_check"],
        blocks: [
          {
            type: "timeline",
            items: [{ date: "03/05 09:30-13:30", event_en: "Health check at the Auditorium. Please arrive before 13:00.", event_zh: "於大禮堂進行健康檢查，請於 13:00 前抵達。" }],
          },
          {
            type: "note",
            content_en: "If you wear glasses or contact lenses, bring glasses on the health check day so corrected eyesight can be tested.",
            content_zh: "若配戴眼鏡或隱形眼鏡，健康檢查當天請攜帶眼鏡，以便測量矯正後視力。",
          },
        ],
      },
      {
        id: "degree_health_insurance",
        title_en: "Health Insurance and NHI",
        title_zh: "健康保險與全民健保",
        categoryId: "health_insurance",
        tags_en: ["insurance", "nhi", "health"],
        tags_zh: ["保險", "全民健保", "健康"],
        summary_en: "Insurance requirements differ before and after NHI eligibility.",
        summary_zh: "取得全民健保資格前後，保險安排不同。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.19-p.25" }],
        relatedTaskIds: ["student_insurance_claim", "opt_out_student_group_insurance"],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "International students must have health coverage during their stay. Students not yet eligible for NHI use short-term medical insurance first; students who meet NHI requirements should join NHI.",
            content_zh:
              "國際學生在臺期間需有健康保障。尚未符合全民健保資格者，通常先使用短期醫療保險；符合資格後應加入全民健保。",
          },
          {
            type: "links",
            links: [{ url: "https://www.nhi.gov.tw/en/mp-2.html", label_en: "Open National Health Insurance Website", label_zh: "開啟健保署英文網站" }],
          },
        ],
      },
      {
        id: "degree_visa_arc",
        title_en: "Visa and ARC",
        title_zh: "簽證與 ARC",
        categoryId: "visa_arc",
        tags_en: ["visa", "arc", "resident visa"],
        tags_zh: ["簽證", "ARC", "居留簽證"],
        summary_en: "Degree-seeking students must enter Taiwan with the correct visa status for study.",
        summary_zh: "學位生須以符合就學目的的正確簽證身分入境臺灣。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.13-p.19" },
          { ...degreeSources.quick, pages: "p.3" },
        ],
        relatedTaskIds: ["resident_visa_degree", "arc_resident_visa"],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "Tourist visa, visa-exempt entry, and landing visa are not valid routes for studying in Taiwan and may prevent later resident visa or ARC application.",
            content_zh:
              "觀光簽證、免簽與落地簽不是在臺就學可用的方式，且可能導致後續無法轉辦居留簽證或 ARC。",
          },
        ],
      },
      {
        id: "degree_arc_application_extension",
        title_en: "ARC Application and Extension",
        title_zh: "ARC 申請與延期",
        categoryId: "visa_arc",
        tags_en: ["arc", "extension", "immigration"],
        tags_zh: ["ARC", "延期", "移民署"],
        summary_en: "Documents, fees, deadline, and online system reminders for ARC application and renewal.",
        summary_zh: "ARC 申請與延期所需文件、費用、期限與線上系統提醒。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.16-p.17" },
          { ...degreeSources.quick, pages: "p.8-p.10" },
        ],
        relatedTaskIds: ["arc_resident_visa", "arc_extension"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "First-time ARC application should be completed within 30 days after entering Taiwan or from the visa issue date.", zh: "首次申請 ARC 應於入境臺灣後或簽證核發日起 30 日內完成。" },
              { en: "Prepare ID photo, passport scan, resident visa scan, OIA residence certificate, and fee after approval.", zh: "準備證件照、護照掃描檔、居留簽證掃描檔、國際處居住證明，核准後繳交規費。" },
              { en: "ARC extension can be submitted up to three months before the ARC expires.", zh: "ARC 延期可於到期前三個月內提出申請。" },
            ],
          },
          {
            type: "links",
            links: [{ url: "https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en", label_en: "Open Students Online Application System", label_zh: "開啟學生線上申辦系統" }],
          },
        ],
      },
      {
        id: "degree_postal_account",
        title_en: "Postal Savings Account",
        title_zh: "郵局帳戶",
        categoryId: "postal_account",
        tags_en: ["post office", "bank account", "arc"],
        tags_zh: ["郵局", "帳戶", "ARC"],
        summary_en: "Items to bring when applying for a postal savings account at the CCU post office.",
        summary_zh: "在中正大學郵局開立郵局帳戶時需要攜帶的項目。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.17-p.18" },
          { ...degreeSources.quick, pages: "p.12-p.17" },
        ],
        relatedTaskIds: ["bank_account"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Passport and ARC.", zh: "護照與 ARC。" },
              { en: "Chinese name stamp or seal.", zh: "中文姓名印章。" },
              { en: "Student status certificate if you are under 20 years old.", zh: "未滿 20 歲者需準備學生身分證明。" },
              { en: "Minimum deposit of NT$100.", zh: "最低存款 NT$100。" },
            ],
          },
          {
            type: "note",
            content_en: "All documents must be originals. Pictures or printed photos of documents are not accepted.",
            content_zh: "所有文件須為正本，不接受文件照片或列印照片。",
          },
        ],
      },
      {
        id: "degree_chinese_language",
        title_en: "Chinese Courses and Language Resources",
        title_zh: "中文課程與語言資源",
        categoryId: "campus_life",
        tags_en: ["chinese course", "language center"],
        tags_zh: ["中文課程", "語言中心"],
        summary_en: "Chinese training courses and language resources are available for international students.",
        summary_zh: "國際學生可使用中文課程與語言學習資源。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.17" },
          { ...degreeSources.quick, pages: "p.46-p.47" },
        ],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "The Chinese training program is credit-loaded and free for international students. Students are encouraged to take at least one Chinese course during their stay at CCU.",
            content_zh:
              "中文訓練課程為國際學生可修習的學分課程，且免收課程費用。學校鼓勵國際學生在校期間至少修習一門中文課程。",
          },
          {
            type: "links",
            links: [{ url: "https://chineselanguagecenter.ccu.edu.tw/?Lang=en", label_en: "Open Chinese Language Center Page", label_zh: "開啟華語中心頁面" }],
          },
        ],
      },
      {
        id: "degree_ecourse",
        title_en: "eCourse",
        title_zh: "eCourse",
        categoryId: "campus_life",
        tags_en: ["ecourse", "online learning"],
        tags_zh: ["eCourse", "線上學習"],
        summary_en: "eCourse is the learning platform used for course materials and online learning activities.",
        summary_zh: "eCourse 是課程教材與線上學習活動使用的平台。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.13-p.19" }],
        relatedTaskIds: ["exchange_ecourse_account", "course_password_error"],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "After registration and course setup are complete, students may use eCourse for course materials, announcements, and online learning activities.",
            content_zh:
              "完成註冊與選課設定後，學生可使用 eCourse 查看課程教材、公告與線上學習活動。",
          },
          {
            type: "links",
            links: [{ url: "https://ecourse2.ccu.edu.tw/", label_en: "Open eCourse2", label_zh: "開啟 eCourse2" }],
          },
        ],
      },
      {
        id: "degree_computer_wifi",
        title_en: "Computer Classrooms and Campus Wi-Fi",
        title_zh: "電腦教室與校園 Wi-Fi",
        categoryId: "campus_life",
        tags_en: ["computer classroom", "wifi", "account", "password"],
        tags_zh: ["電腦教室", "無線網路", "帳號", "密碼"],
        summary_en: "Computer classroom opening hours, campus Wi-Fi login, and default account rules for new students.",
        summary_zh: "說明電腦教室開放時間、校園 Wi-Fi 登入方式，以及新生帳號與預設密碼規則。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.26-p.35" }],
        relatedTaskIds: ["campus_wifi_or_computer_room", "ecourse_account"],
        blocks: [
          {
            type: "table",
            columns: [
              { key: "item", label_en: "Item", label_zh: "項目" },
              { key: "detail", label_en: "Detail", label_zh: "說明" },
            ],
            rows: [
              {
                item: { en: "Computer classroom opening hours", zh: "電腦教室開放時間" },
                detail: {
                  en: "Monday to Friday, 08:00–21:00. During winter and summer vacations, 09:00–17:00.",
                  zh: "週一至週五 08:00–21:00；寒暑假期間為 09:00–17:00。",
                },
              },
              {
                item: { en: "Campus Wi-Fi login", zh: "校園 Wi-Fi 登入" },
                detail: {
                  en: "Use your CCU student email account and password to log in.",
                  zh: "使用中正大學學生信箱帳號與密碼登入。",
                },
              },
              {
                item: { en: "Default password for degree-seeking students", zh: "學位生預設密碼" },
                detail: {
                  en: "Edu$ + the last 5 digits of your ID number.",
                  zh: "Edu$ 加上身分證明文件號碼後五碼。",
                },
              },
              {
                item: { en: "Default password for exchange students", zh: "交換生預設密碼" },
                detail: {
                  en: "Edu$ + the last 5 numerals of your passport number.",
                  zh: "Edu$ 加上護照號碼最後五個數字。",
                },
              },
            ],
          },
          {
            type: "checklist",
            items: [
              {
                en: "For new student account conversion, 4 is converted to u, 6 to g, 5 to s, and 8 to d.",
                zh: "新生帳號轉碼規則：4 轉為 u、6 轉為 g、5 轉為 s、8 轉為 d。",
              },
              {
                en: "If you cannot log in, confirm whether your registration and account activation have been completed.",
                zh: "若無法登入，請先確認是否已完成註冊與帳號開通。",
              },
            ],
          },
        ],
      },
      {
        id: "degree_drivers_license",
        title_en: "Driver's License and Traffic Reminders",
        title_zh: "駕照與交通提醒",
        categoryId: "safety_regulations",
        tags_en: ["driver license", "scooter", "traffic", "motor vehicle"],
        tags_zh: ["駕照", "機車", "交通", "監理"],
        summary_en: "International students must have a valid license before driving a scooter or car in Taiwan.",
        summary_zh: "國際學生在臺灣騎乘機車或駕駛汽車前，須持有有效駕照。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.26-p.35" }],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "Driving without a valid license is illegal in Taiwan and may result in fines, vehicle impoundment, or other legal consequences.",
            content_zh:
              "在臺灣無照駕駛屬違法行為，可能面臨罰鍰、車輛扣留或其他法律責任。",
          },
          {
            type: "checklist",
            items: [
              {
                en: "Taiwan uses left-hand drive vehicles and traffic rules may differ from your home country.",
                zh: "臺灣車輛為左駕，交通規則可能與你的國家不同。",
              },
              {
                en: "You may apply for a Taiwanese driver's license or convert a valid foreign license if eligible.",
                zh: "符合資格者可考取臺灣駕照，或依規定換發臺灣駕照。",
              },
              {
                en: "For motorcycle license tests, prepare required identity documents, ARC, health check certificate, photos, and fees.",
                zh: "報考機車駕照時，通常需準備身分文件、ARC、體檢證明、照片與規費。",
              },
              {
                en: "Check official test questions and practice tests before taking the written examination.",
                zh: "參加筆試前，請先查閱官方題庫並使用模擬測驗練習。",
              },
            ],
          },
          {
            type: "links",
            links: [
              {
                url: "https://www.mvdis.gov.tw/m3-emv-eng/",
                label_en: "Open Motor Vehicle Driver Information Service",
                label_zh: "開啟監理服務英文網站",
              },
              {
                url: "https://www.thb.gov.tw/en//cl.aspx?n=825",
                label_en: "Open English Driver's License Test Questions",
                label_zh: "開啟英文駕照筆試題庫",
              },
              {
                url: "https://www.mvdis.gov.tw/m3-simulator-drv/index",
                label_en: "Open Driver's License Practice Test",
                label_zh: "開啟駕照模擬測驗",
              },
            ],
          },
        ],
      },
      {
        id: "degree_oia_service_request",
        title_en: "OIA Service Request",
        title_zh: "國際處服務需求表",
        categoryId: "campus_life",
        tags_en: ["oia", "service request", "support", "contact"],
        tags_zh: ["國際處", "服務需求", "協助", "聯絡方式"],
        summary_en: "Students may use the OIA service request form when they need assistance from the Office of International Affairs.",
        summary_zh: "國際學生若需要國際處協助，可填寫國際處服務需求表。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.36-p.44" }],
        relatedTaskIds: ["international_student_support"],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "If you have questions about registration, ARC, campus life, or other international student matters, you may contact OIA or submit the OIA service request form.",
            content_zh:
              "若你在註冊、ARC、校園生活或其他國際學生相關事項上需要協助，可聯絡國際處或填寫服務需求表。",
          },
          {
            type: "contact",
            name_en: "Office of International Affairs",
            name_zh: "國際事務處",
            email: "ccuoiais@ccu.edu.tw",
            phone: "05-2720411 ext. 17600–17619",
            location_en: "2nd floor above the CCU Supermarket, next to the graduate student dormitory.",
            location_zh: "研究生宿舍旁超市樓上二樓。",
            links: [
              {
                url: "https://docs.google.com/forms/d/e/1FAIpQLScTAvImpj1fn3-JH2CFd290tC5FfLD-dHF24AZ7R5eongvOLw/viewform",
                label_en: "Open OIA Service Request Form",
                label_zh: "開啟國際處服務需求表",
              },
            ],
          },
        ],
      },
      {
        id: "degree_alert_assistance_mechanism",
        title_en: "Alert and Assistance Mechanism",
        title_zh: "預警與協助機制",
        categoryId: "campus_life",
        tags_en: ["alert", "self-assessment", "support", "referral"],
        tags_zh: ["預警", "自我評估", "協助", "轉介"],
        summary_en: "When international students face serious life, language, or learning difficulties, OIA may coordinate assistance and referrals.",
        summary_zh: "當國際學生面臨生活、語言或學習重大困難時，國際處可協調相關單位提供協助與轉介。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.36-p.44" }],
        relatedTaskIds: ["international_student_support"],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "If you are experiencing serious difficulties in daily life, language communication, learning, or mental adjustment, please seek help early.",
            content_zh:
              "若你在生活、語言溝通、學習或心理適應上遇到重大困難，請及早尋求協助。",
          },
          {
            type: "checklist",
            items: [
              {
                en: "Students may contact OIA directly or complete a self-assessment form when they need support.",
                zh: "學生若需要協助，可直接聯絡國際處，或填寫自我評估表。",
              },
              {
                en: "Departments, teachers, or staff may submit an alert form when they notice that an international student may need help.",
                zh: "系所、教師或行政人員若發現國際學生可能需要協助，可填寫預警表。",
              },
              {
                en: "OIA may coordinate with related campus units for follow-up support or referral.",
                zh: "國際處可協調校內相關單位進行後續協助或轉介。",
              },
            ],
          },
        ],
      },
      {
        id: "degree_campus_life",
        title_en: "Campus Life",
        title_zh: "校園生活",
        categoryId: "campus_life",
        tags_en: ["campus life", "daily life"],
        tags_zh: ["校園生活", "日常生活"],
        summary_en: "Campus life information includes shops, services, transportation, and daily support resources.",
        summary_zh: "校園生活資訊包含商店、服務、交通與日常支援資源。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.26-p.35" }],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "Use the campus life sections and OIA website to check daily life resources, campus services, and announcements that help you settle in.",
            content_zh:
              "可透過手冊校園生活章節與國際處網站，查詢日常生活資源、校園服務與協助安頓的公告。",
          },
          {
            type: "links",
            links: [{ url: "https://oia.ccu.edu.tw/?Lang=en", label_en: "Open OIA Website", label_zh: "開啟國際處網站" }],
          },
        ],
      },
      {
        id: "degree_library",
        title_en: "Library",
        title_zh: "圖書館",
        categoryId: "campus_life",
        tags_en: ["library", "study"],
        tags_zh: ["圖書館", "學習"],
        summary_en: "The library provides study spaces, collections, and academic resources.",
        summary_zh: "圖書館提供自習空間、館藏與學術資源。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.26-p.35" }],
        relatedTaskIds: ["library_services"],
        blocks: [
          {
            type: "paragraph",
            content_en: "Students can use library spaces and services after completing school registration and account setup.",
            content_zh: "完成註冊與帳號設定後，學生可使用圖書館空間與服務。",
          },
          { type: "links", links: [{ url: "https://lib.ccu.edu.tw/", label_en: "Open Library Page", label_zh: "開啟圖書館頁面" }] },
        ],
      },
      {
        id: "degree_sports_facilities",
        title_en: "Sports Facilities",
        title_zh: "體育設施",
        categoryId: "campus_life",
        tags_en: ["sports", "facilities"],
        tags_zh: ["體育", "設施"],
        summary_en: "Sports facilities and activity spaces are part of campus life resources.",
        summary_zh: "體育設施與活動空間是校園生活資源的一部分。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.26-p.35" }],
        relatedTaskIds: ["sports_facility_reservation"],
        blocks: [
          {
            type: "links",
            links: [{ url: "https://sport.ccu.edu.tw/", label_en: "Open Sports Center Page", label_zh: "開啟體育中心頁面" }],
          },
        ],
      },
      {
        id: "degree_work_permit",
        title_en: "Work Permit and Employment Reminders",
        title_zh: "工作許可與就業提醒",
        categoryId: "safety_regulations",
        tags_en: ["work permit", "employment"],
        tags_zh: ["工作許可", "就業"],
        summary_en: "International students need a valid work permit before working in Taiwan.",
        summary_zh: "國際學生在臺工作前須取得有效工作許可。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.45-p.49" },
          { ...degreeSources.quick, pages: "p.27" },
        ],
        relatedTaskIds: ["work_permit", "work_in_taiwan"],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "Working without a valid permit may result in fines and other immigration consequences. Confirm your eligibility before accepting any job, stipend, or paid work.",
            content_zh:
              "未取得有效工作許可即工作，可能面臨罰鍰與其他居留後果。接受工作、津貼或有給付活動前，請先確認資格。",
          },
          { type: "links", links: [{ url: "https://ezwp.wda.gov.tw/", label_en: "Open Work Permit Application Portal", label_zh: "開啟工作許可申辦網" }] },
        ],
      },
      {
        id: "degree_oia_services",
        title_en: "OIA Services and Contact",
        title_zh: "國際處服務與聯絡方式",
        categoryId: "campus_life",
        tags_en: ["oia", "contact", "support"],
        tags_zh: ["國際處", "聯絡方式", "支援"],
        summary_en: "OIA provides support for international student registration, ARC, scholarships, and life questions.",
        summary_zh: "國際處協助國際學生註冊、ARC、獎學金與生活問題。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.1-p.2" },
          { ...degreeSources.quick, pages: "p.47-p.49" },
        ],
        relatedTaskIds: ["international_student_support"],
        blocks: [
          {
            type: "contact",
            name_en: "Office of International Affairs",
            name_zh: "國際事務處",
            email: "ccuoiais@ccu.edu.tw",
            phone: "+886-5-2720411 ext. 17618",
            links: [
              { url: "https://oia.ccu.edu.tw/?Lang=en", label_en: "Open OIA Website", label_zh: "開啟國際處網站" },
              { url: "https://www.facebook.com/oiaccuedutw", label_en: "Open OIA Facebook Page", label_zh: "開啟國際處 Facebook" },
            ],
          },
        ],
      },
      {
        id: "degree_quarantine",
        title_en: "Plant and Animal Quarantine Regulations",
        title_zh: "動植物檢疫規定",
        categoryId: "safety_regulations",
        tags_en: ["quarantine", "pork", "customs"],
        tags_zh: ["檢疫", "豬肉製品", "海關"],
        summary_en: "Do not bring or mail restricted animal and plant products into Taiwan.",
        summary_zh: "不要攜帶或郵寄受限制的動植物產品入境臺灣。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.19-p.21" }],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "Do not bring or mail pork products or other restricted animal and plant products into Taiwan. Violations may lead to large fines.",
            content_zh:
              "不要攜帶或郵寄豬肉製品及其他受限制的動植物產品入境臺灣，違規可能面臨高額罰鍰。",
          },
        ],
      },
      {
        id: "degree_important_laws",
        title_en: "Important Regulations in Taiwan — General Law",
        title_zh: "台灣重要法規：一般法律",
        categoryId: "safety_regulations",
        tags_en: ["law", "fraud", "bank account", "drugs", "overstay"],
        tags_zh: ["法規", "詐騙", "帳戶", "毒品", "逾期停留"],
        summary_en: "Important legal reminders on DUI, theft, fraud, bank accounts, drugs, work, false documents, and visa overstay.",
        summary_zh: "提醒酒駕、竊盜、詐騙、帳戶、毒品、工作、假證件與逾期停留等重要法律規定。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.24-p.28" }],
        relatedTaskIds: ["work_permit", "scam_help"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Do not drive after drinking alcohol, including bicycles, electric bicycles, motorcycles, and cars.", zh: "飲酒後不得駕駛，包括自行車、電動自行車、機車與汽車。" },
              { en: "Do not take others' property. Found lost items should be handed to the proper authority.", zh: "不得拿取他人物品；拾得遺失物應交給相關單位，不可自行占有。" },
              { en: "Do not keep or use items belonging to others without permission. Borrowing and not returning may also cause legal issues.", zh: "不得未經同意保留或使用他人物品；借用不還也可能產生法律問題。" },
              { en: "Do not sell, lend, or hand over your bank account, ATM card, passbook, or PIN.", zh: "不要販售、出借或交付自己的銀行帳戶、金融卡、存摺或密碼。" },
              { en: "Do not help unknown people withdraw, transfer, receive, or deliver money. You may become a fraud accomplice or money mule.", zh: "不要協助不明人士提領、轉帳、收款或交付金錢，否則可能成為詐騙共犯或車手。" },
              { en: "Do not share your SIM card, phone number, identity documents, or personal data for unknown purposes.", zh: "不要將 SIM 卡、電話門號、身分證件或個人資料提供給不明人士使用。" },
              { en: "Illegal drugs, including marijuana, are strictly prohibited in Taiwan.", zh: "臺灣嚴禁持有、使用或販售毒品，包含大麻。" },
              { en: "Do not work without a valid work permit, including online jobs, freelance work, or paid activities.", zh: "未取得有效工作許可前，不得工作，包含線上工作、接案或其他有給付活動。" },
              { en: "Do not use fake documents or another person's identity documents.", zh: "不得使用假文件或借用他人身分證件。" },
              { en: "Do not overstay your visa or ARC, even by one day.", zh: "不要讓簽證或 ARC 逾期，即使只逾期一天也可能違規。" },
            ],
          },
        ],
      },
      {
        id: "degree_transportation_regulations",
        title_en: "Important Regulations in Taiwan — Transportation",
        title_zh: "台灣重要法規：交通",
        categoryId: "safety_regulations",
        tags_en: ["traffic", "driver license", "scooter", "insurance"],
        tags_zh: ["交通", "駕照", "機車", "強制險"],
        summary_en: "Transportation reminders on license, vehicle registration, fuel tax, emission inspection, compulsory insurance, ownership transfer, and inspection.",
        summary_zh: "提醒駕照、車輛登記、燃料稅、排氣檢驗、強制險、過戶與驗車等交通規定。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.29-p.31" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Driving a car or motorcycle requires a valid Taiwanese license or a recognized international driving permit with a valid home country license.", zh: "駕駛汽車或機車須持有有效臺灣駕照，或符合規定的國際駕照與原國駕照。" },
              { en: "Unregistered vehicles or vehicles without legal license plates may lead to fines or impoundment.", zh: "未完成登記或未懸掛合法牌照的車輛，可能面臨罰鍰或扣車。" },
              { en: "Vehicle owners must pay fuel usage fees and license taxes on time.", zh: "車主須按時繳納燃料使用費與牌照稅。" },
              { en: "Scooters and cars may need regular emission inspections, especially older vehicles.", zh: "機車與汽車可能需定期接受排氣檢驗，尤其是較舊車輛。" },
              { en: "All motor vehicles must have valid Compulsory Motor Vehicle Liability Insurance.", zh: "所有汽機車都必須投保有效的強制汽車責任保險。" },
              { en: "When buying or selling a vehicle, ownership transfer must be completed at the motor vehicle office.", zh: "買賣車輛時，雙方須至監理機關完成過戶。" },
              { en: "Some vehicles must pass regular safety inspections depending on vehicle type and age.", zh: "部分車輛需依車種與車齡完成定期安全檢驗。" },
            ],
          },
        ],
      },
      {
        id: "degree_smoke_free_campus",
        title_en: "Smoke-Free Campus",
        title_zh: "無菸校園",
        categoryId: "safety_regulations",
        tags_en: ["smoke-free", "campus"],
        tags_zh: ["無菸", "校園"],
        summary_en: "CCU is a smoke-free campus.",
        summary_zh: "中正大學為無菸校園。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.32" }],
        blocks: [
          {
            type: "note",
            content_en:
              "Smoking, e-cigarettes, and heated tobacco are not allowed on campus. Please respect no-smoking signs and keep the campus healthy.",
            content_zh:
              "校園內禁止吸菸、使用電子煙與加熱菸。請遵守禁菸標示，共同維護健康校園。",
          },
        ],
      },
      {
        id: "degree_anti_fraud",
        title_en: "Anti-Fraud Notice",
        title_zh: "防詐騙提醒",
        categoryId: "anti_fraud",
        tags_en: ["fraud", "safety", "money mule"],
        tags_zh: ["詐騙", "安全", "帳戶風險"],
        summary_en: "Foreign nationals should protect personal information, bank accounts, cards, and phone numbers.",
        summary_zh: "外籍學生應保護個資、帳戶、金融卡與電話門號。",
        sourceReferences: [{ ...degreeSources.quick, pages: "p.34-p.44" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Do not provide bank accounts or ATM cards to others.", zh: "不要將帳戶或金融卡提供給他人。" },
              { en: "Do not help unknown people withdraw, transfer, or receive money.", zh: "不要協助不明人士提領、轉帳或收款。" },
              { en: "Do not share your phone number, SIM card, or identity information for unknown purposes.", zh: "不要將電話門號、SIM 卡或身分資料交給不明人士使用。" },
              { en: "If you suspect fraud, ask OIA, police, or trusted school staff before acting.", zh: "若懷疑遇到詐騙，請先詢問國際處、警方或可信任的校內人員。" },
            ],
          },
        ],
      },
      {
        id: "degree_anti_sexual_harassment",
        title_en: "Anti-Sexual Harassment and Self-Protection",
        title_zh: "反性騷擾與自我保護",
        categoryId: "anti_sexual_harassment",
        tags_en: ["sexual harassment", "gender equity", "safety"],
        tags_zh: ["性騷擾", "性別平等", "安全"],
        summary_en: "Recognize harassment, protect yourself, and seek help when needed.",
        summary_zh: "辨識性騷擾、保護自己，並在需要時尋求協助。",
        sourceReferences: [
          { ...degreeSources.handbook, pages: "p.67-p.70" },
          { ...degreeSources.quick, pages: "p.18" },
        ],
        relatedTaskIds: ["gender_equity_case_or_form_inquiry"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Clearly refuse unwanted words, contact, following, photos, or harassment.", zh: "對不受歡迎的言語、肢體接觸、跟蹤、拍攝或騷擾明確拒絕。" },
              { en: "Call 113 or 110 if there is danger or urgent need.", zh: "若有危險或緊急需求，可撥打 113 或 110。" },
              { en: "Preserve evidence and seek help from school units.", zh: "保存相關證據，並向校內單位尋求協助。" },
              { en: "Do not touch, joke, spread sexual content, or pressure others without consent.", zh: "未經同意，不要觸碰他人、開性玩笑、散布性內容或造成壓迫。" },
            ],
          },
        ],
      },
      {
        id: "degree_gender_incident_regulations",
        title_en: "Sexual Assault, Sexual Harassment, and Sexual Bullying Prevention Regulations",
        title_zh: "性侵害、性騷擾與性霸凌防治規定",
        categoryId: "anti_sexual_harassment",
        tags_en: ["gender equity", "sexual harassment", "sexual assault", "sexual bullying"],
        tags_zh: ["性別平等", "性騷擾", "性侵害", "性霸凌"],
        summary_en: "A summary of formal reporting, confidentiality, and handling principles for campus gender-related incidents.",
        summary_zh: "整理校園性別事件的正式通報、保密與處理原則。",
        sourceReferences: [{ ...degreeSources.handbook, pages: "p.67-p.70" }],
        relatedTaskIds: ["gender_equity_case_or_form_inquiry"],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "If you experience or witness sexual assault, sexual harassment, or sexual bullying, seek help as early as possible and preserve relevant evidence.",
            content_zh:
              "若你遭遇或目睹性侵害、性騷擾或性霸凌事件，請及早尋求協助並保存相關證據。",
          },
          {
            type: "checklist",
            items: [
              { en: "Reports or applications may be submitted in writing, orally, or by email, depending on the school procedure.", zh: "可依學校程序以書面、口頭或電子郵件方式提出申請或通報。" },
              { en: "The university should protect the privacy of the applicant, reporter, and involved parties.", zh: "學校應保護申請人、通報人與當事人的隱私。" },
              { en: "Faculty and staff who become aware of suspected campus gender incidents may have reporting responsibilities.", zh: "教職員若知悉疑似校園性別事件，可能負有依法通報責任。" },
              { en: "The Gender Equity Education Committee handles investigation and follow-up according to relevant regulations.", zh: "性別平等教育委員會會依相關規定進行調查與後續處理。" },
              { en: "In urgent danger, call 110 or 113 immediately.", zh: "若有立即危險，請立刻撥打 110 或 113。" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "exchange",
    title_en: "Exchange Student Guide",
    title_zh: "交換生新生指南",
    description_en: "For exchange and visiting students coming to CCU for one semester or one academic year.",
    description_zh: "適用於來中正大學交換一學期或一學年的交換生與訪問學生。",
    audience: "exchange",
    sourcePdfUrls: ["/docs/handbooks/2026-spring-handbook-exchange-students.pdf"],
    filters: exchangeGuideFilters,
    sections: [
      {
        id: "exchange_highlights",
        title_en: "Pre-Reading Highlights",
        title_zh: "閱讀前提醒",
        categoryId: "before_arrival",
        tags_en: ["important", "contact", "oia"],
        tags_zh: ["重要提醒", "聯絡方式", "國際處"],
        summary_en: "Read the exchange handbook carefully and contact OIA if anything is unclear.",
        summary_zh: "請仔細閱讀交換生手冊，如有疑問請聯絡國際處。",
        sourceReferences: [{ ...exchangeSource, pages: "p.2" }],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "Exchange and visiting students are expected to read the guide carefully because it affects arrival, registration, course selection, and leaving procedures.",
            content_zh: "交換生與訪問學生應仔細閱讀指南，因為內容會影響抵達、報到、選課與離校程序。",
          },
          {
            type: "contact",
            name_en: "OIA Exchange Student Contact",
            name_zh: "國際處交換生窗口",
            email: "astevelyn@ccu.edu.tw",
            phone: "+886-5-2720411 ext. 17606",
            links: [
              { url: "mailto:ciacoop@ccu.edu.tw", label_en: "Email OIA Cooperation Division", label_zh: "寄信給國際處交流組" },
            ],
          },
        ],
      },
      {
        id: "exchange_calendar",
        title_en: "Important Dates and Calendar",
        title_zh: "重要日期與行事曆",
        categoryId: "before_arrival",
        tags_en: ["calendar", "course selection", "orientation"],
        tags_zh: ["行事曆", "選課", "說明會"],
        summary_en: "Key dates for exchange and visiting students.",
        summary_zh: "交換生與訪問學生的重要日期。",
        sourceReferences: [{ ...exchangeSource, pages: "p.3" }],
        blocks: [
          {
            type: "timeline",
            items: [
              { date: "02/23", event_en: "Dormitory move-in day and first lecture day.", event_zh: "宿舍入住日與第一天上課。" },
              { date: "02/23-03/06", event_en: "Course selection period.", event_zh: "選課期間。" },
              { date: "02/26", event_en: "Orientation for exchange and visiting students.", event_zh: "交換生與訪問學生說明會。" },
              { date: "07/05", event_en: "Dormitory move-out deadline.", event_zh: "宿舍退宿截止日。" },
            ],
          },
        ],
      },
      {
        id: "exchange_required_tasks",
        title_en: "Required Tasks Before Departure and After Arrival",
        title_zh: "出發前與抵達後必辦事項",
        categoryId: "before_arrival",
        tags_en: ["departure", "arrival", "documents"],
        tags_zh: ["出發", "抵達", "文件"],
        summary_en: "Main tasks from reading the guide to arriving at CCU.",
        summary_zh: "從閱讀指南到抵達中正大學的主要必辦事項。",
        sourceReferences: [{ ...exchangeSource, pages: "p.4-p.8" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Read the guide carefully.", zh: "仔細閱讀本指南。" },
              { en: "Complete the required medical examination before visa application.", zh: "申請簽證前完成所需醫療檢查。" },
              { en: "Apply for the correct visa according to your exchange period.", zh: "依交換期間申請正確簽證。" },
              { en: "Purchase overseas travel insurance.", zh: "購買海外旅遊保險。" },
              { en: "Send required scanned documents to OIA by the announced deadline.", zh: "依期限將指定文件掃描檔寄給國際處。" },
            ],
          },
        ],
      },
      {
        id: "exchange_document_submission",
        title_en: "Required Document Submission Before Arrival",
        title_zh: "抵達前指定文件繳交",
        categoryId: "before_arrival",
        tags_en: ["documents", "email", "medical examination", "visa", "insurance"],
        tags_zh: ["文件", "電子郵件", "醫療檢查", "簽證", "保險"],
        summary_en: "Exchange and visiting students must send designated scanned documents to OIA before the announced deadline.",
        summary_zh: "交換生與訪問學生須於指定期限前將相關文件掃描檔寄給國際處。",
        sourceReferences: [{ ...exchangeSource, pages: "p.6" }],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en:
              "After completing the required pre-departure procedures, send scanned copies of the designated documents to OIA by the announced deadline.",
            content_zh: "完成出發前必要程序後，請於公告期限前將指定文件掃描檔寄給國際處。",
          },
          {
            type: "checklist",
            items: [
              { en: "Certificate of medical examination.", zh: "醫療檢查證明。" },
              { en: "Visa.", zh: "簽證。" },
              { en: "Flight ticket.", zh: "機票。" },
              { en: "Insurance certificate.", zh: "保險證明。" },
            ],
          },
          {
            type: "contact",
            name_en: "OIA Exchange Student Contact",
            name_zh: "國際處交換生窗口",
            email: "astevelyn@ccu.edu.tw",
            links: [
              { url: "mailto:ciacoop@ccu.edu.tw", label_en: "Email OIA Cooperation Division", label_zh: "寄信給國際處交流組" },
            ],
          },
        ],
      },
      {
        id: "exchange_boarding_checklist",
        title_en: "Boarding Checklist and Customs Reminder",
        title_zh: "登機準備清單與入境提醒",
        categoryId: "before_arrival",
        tags_en: ["boarding", "customs", "cash", "meat products"],
        tags_zh: ["登機", "海關", "現金", "肉製品"],
        summary_en: "Prepare essential documents and avoid bringing restricted meat products into Taiwan.",
        summary_zh: "準備必要文件與初期現金，並避免攜帶受限制肉製品入境臺灣。",
        sourceReferences: [{ ...exchangeSource, pages: "p.6-p.7" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Passport and visa.", zh: "護照與簽證。" },
              { en: "Flight ticket.", zh: "機票。" },
              { en: "At least NTD 10,000 cash for SIM card, transportation, bedding, and first-arrival expenses.", zh: "至少準備新臺幣 10,000 元現金，用於 SIM 卡、交通、寢具與初抵臺生活開銷。" },
              { en: "If your flight is cancelled, inform CCU immediately so OIA can notify the Dormitory Service Center.", zh: "若航班取消，請立即通知中正大學，以便國際處轉知宿舍服務中心。" },
            ],
          },
          {
            type: "note",
            tone: "warning",
            content_en:
              "Do not bring processed meat or meat products into Taiwan. Violations may result in fines of NTD 200,000 to NTD 1,000,000.",
            content_zh: "請勿攜帶肉類加工品或肉製品入境臺灣，違規可能面臨新臺幣 200,000 元至 1,000,000 元罰鍰。",
          },
        ],
      },
      {
        id: "exchange_sim_card",
        title_en: "Buying a SIM Card Upon Arrival",
        title_zh: "抵臺後購買 SIM 卡",
        categoryId: "before_arrival",
        tags_en: ["sim card", "airport", "phone", "arrival"],
        tags_zh: ["SIM 卡", "機場", "手機", "抵達"],
        summary_en: "Exchange students may buy a local SIM card at the airport upon arrival in Taiwan.",
        summary_zh: "交換生抵達臺灣後，可在機場購買臺灣當地 SIM 卡。",
        sourceReferences: [{ ...exchangeSource, pages: "p.7" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Prepare your passport and boarding pass.", zh: "準備護照與登機證。" },
              { en: "Prepare cash or credit card, around NTD 1,000 for a 30-day plan.", zh: "準備現金或信用卡，約新臺幣 1,000 元可購買 30 天方案。" },
              { en: "Make sure the SIM card includes enough data for at least your first 10 days in Taiwan.", zh: "請確認 SIM 卡流量足以支援抵臺後至少前 10 天使用。" },
              { en: "Students under 18 years old may need a parental consent letter.", zh: "未滿 18 歲學生可能需要家長同意書。" },
            ],
          },
        ],
      },
      {
        id: "exchange_medical_examination",
        title_en: "Medical Examination",
        title_zh: "醫療檢查",
        categoryId: "visa_insurance",
        tags_en: ["medical examination", "health certificate"],
        tags_zh: ["醫療檢查", "健康證明"],
        summary_en: "Medical examination requirements depend on the planned length of stay.",
        summary_zh: "醫療檢查要求會依預計停留時間不同而有所差異。",
        sourceReferences: [{ ...exchangeSource, pages: "p.4" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Students staying more than six months need the health certificate for residence application before arrival.", zh: "停留超過六個月者，抵臺前需完成居留申請用健康檢查證明。" },
              { en: "Students staying less than six months need the health certificate for short-term students.", zh: "停留未滿六個月者，需完成短期學生健康檢查證明。" },
              { en: "Keep a photocopy before submitting documents for visa application.", zh: "申請簽證送件前，請先保留影本。" },
            ],
          },
        ],
      },
      {
        id: "exchange_visa_insurance",
        title_en: "Visa and Insurance",
        title_zh: "簽證與保險",
        categoryId: "visa_insurance",
        tags_en: ["visa", "insurance", "visitor visa", "resident visa"],
        tags_zh: ["簽證", "保險", "停留簽證", "居留簽證"],
        summary_en: "Visa type and insurance requirements depend on your stay length.",
        summary_zh: "簽證類型與保險要求會依停留時間不同而有所不同。",
        sourceReferences: [{ ...exchangeSource, pages: "p.5-p.6" }],
        relatedTaskIds: ["resident_visa_exchange_year", "visitor_visa_exchange_semester"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Apply for a visitor visa if staying less than six months.", zh: "停留未滿六個月者，申請停留簽證。" },
              { en: "Apply for a resident visa if staying more than six months.", zh: "停留超過六個月者，申請居留簽證。" },
              { en: "Purchase overseas travel insurance covering accident and sickness during the full exchange period.", zh: "購買涵蓋整個交換期間意外與疾病的海外旅遊保險。" },
            ],
          },
          {
            type: "links",
            links: [
              { url: "https://www.boca.gov.tw/cp-158-4342-a78b4-2.html", label_en: "Open Visitor Visa Guide for Exchange Students", label_zh: "開啟交換生停留簽證說明" },
              { url: "https://www.boca.gov.tw/cp-166-284-6f5f7-2.html", label_en: "Open Resident Visa Guide for Exchange Students", label_zh: "開啟交換生居留簽證說明" },
            ],
          },
        ],
      },
      {
        id: "exchange_buddy",
        title_en: "Buddy Contact",
        title_zh: "Buddy 聯繫",
        categoryId: "before_arrival",
        tags_en: ["buddy", "arrival support"],
        tags_zh: ["學伴", "抵達協助"],
        summary_en: "OIA assigns a local student buddy to help exchange students before and after arrival.",
        summary_zh: "國際處會安排本地學生學伴，在抵達前後協助交換生。",
        sourceReferences: [{ ...exchangeSource, pages: "p.6" }],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "OIA assigns a local student buddy before the semester begins. Contact your buddy early to introduce yourself and discuss arrival support.",
            content_zh: "國際處會在學期開始前安排本地學生學伴。請提早聯繫學伴，互相認識並確認抵達協助方式。",
          },
        ],
      },
      {
        id: "exchange_arrival_transportation",
        title_en: "Arrival in Taiwan and Transportation",
        title_zh: "抵達台灣與交通方式",
        categoryId: "before_arrival",
        tags_en: ["arrival", "transportation", "hsr"],
        tags_zh: ["抵達", "交通", "高鐵"],
        summary_en: "Arrival reminders and transportation options from the airport or HSR station to CCU.",
        summary_zh: "抵臺提醒，以及從機場或高鐵站前往中正大學的交通方式。",
        sourceReferences: [{ ...exchangeSource, pages: "p.6-p.7" }],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Prepare passport, visa, flight ticket, and at least NT$10,000 cash for first arrival expenses.", zh: "準備護照、簽證、機票與至少 NT$10,000 現金作為初抵臺開銷。" },
              { en: "Do not bring processed meat products into Taiwan.", zh: "不要攜帶肉類加工品入境臺灣。" },
              { en: "Buy a local SIM card at the airport if needed.", zh: "如有需要，可在機場購買臺灣 SIM 卡。" },
            ],
          },
          { type: "links", links: [{ url: "https://en.thsrc.com.tw/", label_en: "Open Taiwan High Speed Rail", label_zh: "開啟台灣高鐵英文網站" }] },
        ],
      },
      {
        id: "exchange_dorm_check_in",
        title_en: "Dormitory Check-in",
        title_zh: "宿舍入住",
        categoryId: "accommodation",
        tags_en: ["dormitory", "check-in"],
        tags_zh: ["宿舍", "入住"],
        summary_en: "OIA reserves on-campus dormitory rooms for exchange students.",
        summary_zh: "國際處會為交換生安排校內宿舍。",
        sourceReferences: [{ ...exchangeSource, pages: "p.7" }],
        relatedTaskIds: ["registration_exchange", "dorm_fee"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "OIA reserves on-campus dormitory rooms for exchange students.", zh: "國際處會為交換生預留校內宿舍。" },
              { en: "Rooms include basic furniture, but students must buy mattress, pillow, quilt, and daily necessities.", zh: "宿舍提供基本家具，但床墊、枕頭、棉被與生活用品需自行購買。" },
              { en: "The campus supermarket is located on the first floor of the OIA building.", zh: "校內超市位於國際處大樓一樓。" },
            ],
          },
        ],
      },
      {
        id: "exchange_orientation",
        title_en: "Exchange Student Orientation",
        title_zh: "交換生說明會",
        categoryId: "orientation",
        tags_en: ["orientation", "oia", "documents"],
        tags_zh: ["說明會", "國際處", "文件"],
        summary_en: "Exchange students must attend OIA orientation and bring required documents.",
        summary_zh: "交換生須參加國際處說明會並攜帶指定文件。",
        sourceReferences: [{ ...exchangeSource, pages: "p.7-p.8" }],
        relatedTaskIds: ["registration_exchange"],
        blocks: [
          {
            type: "timeline",
            items: [{ date: "02/26 10:00", event_en: "Orientation at OIA.", event_zh: "於國際處參加交換生說明會。" }],
          },
          {
            type: "checklist",
            items: [
              { en: "Passport or Taiwan Entry Permit.", zh: "護照或入台證。" },
              { en: "Medical health examination.", zh: "健康檢查資料。" },
              { en: "Medical health insurance.", zh: "醫療保險證明。" },
              { en: "Invitation letter from CCU.", zh: "中正大學邀請函。" },
            ],
          },
        ],
      },
      {
        id: "exchange_arc",
        title_en: "ARC Application for Students Staying Over Six Months",
        title_zh: "停留超過六個月學生 ARC 申請",
        categoryId: "arc",
        tags_en: ["arc", "immigration", "resident visa"],
        tags_zh: ["ARC", "移民署", "居留簽證"],
        summary_en: "ARC application is mandatory for exchange students staying in Taiwan for more than six months.",
        summary_zh: "停留臺灣超過六個月的交換生須申請 ARC。",
        sourceReferences: [{ ...exchangeSource, pages: "p.8-p.13" }],
        relatedTaskIds: ["arc_resident_visa"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Apply during the first week of the semester if staying over six months.", zh: "若停留超過六個月，請於學期第一週辦理申請。" },
              { en: "Prepare passport, resident visa, student ID copy, photo, and fee.", zh: "準備護照、居留簽證、學生證影本、照片與規費。" },
              { en: "ARC also serves as a multiple re-entry permit during your stay.", zh: "ARC 也是在臺期間多次入出境許可。" },
            ],
          },
          {
            type: "links",
            links: [{ url: "https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en", label_en: "Open Students Online Application System", label_zh: "開啟學生線上申辦系統" }],
          },
        ],
      },
      {
        id: "exchange_dorm_payment",
        title_en: "Dormitory Fee, Deposit, and Electricity Payment",
        title_zh: "宿舍費、押金與電費繳納",
        categoryId: "payment_fees",
        tags_en: ["payment", "dormitory", "deposit"],
        tags_zh: ["繳費", "宿舍", "押金"],
        summary_en: "Payment requirements depend on the exchange agreement and payment sheet.",
        summary_zh: "繳費項目依交換協議與繳費單內容而定。",
        sourceReferences: [{ ...exchangeSource, pages: "p.8" }],
        relatedTaskIds: ["dorm_fee"],
        blocks: [
          {
            type: "paragraph",
            content_en:
              "Whether the dormitory fee is charged depends on the exchange agreement. Students still need to follow the payment sheet for residence deposit, electricity fee, or other listed charges.",
            content_zh:
              "是否需繳交宿舍費依交換協議而定。學生仍須依繳費單繳交住宿保證金、電費或其他列示費用。",
          },
        ],
      },
      {
        id: "exchange_health_check",
        title_en: "Health Check",
        title_zh: "健康檢查",
        categoryId: "visa_insurance",
        tags_en: ["health check", "student health examination"],
        tags_zh: ["健康檢查", "學生健康檢查"],
        summary_en: "Every new exchange student must complete the CCU student health examination.",
        summary_zh: "每位交換新生都必須完成中正大學學生健康檢查。",
        sourceReferences: [{ ...exchangeSource, pages: "p.8-p.9" }],
        relatedTaskIds: ["new_student_health_check"],
        blocks: [
          {
            type: "timeline",
            items: [{ date: "03/05 09:30-13:30", event_en: "Complete the CCU student health examination.", event_zh: "完成中正大學學生健康檢查。" }],
          },
          {
            type: "checklist",
            items: [
              { en: "Bring passport.", zh: "攜帶護照。" },
              { en: "Bring CCU Student Health Examination Form.", zh: "攜帶中正大學學生健康檢查表。" },
              { en: "If you miss the arranged health check, you must go to a hospital by yourself.", zh: "若錯過校內安排的健康檢查，須自行至醫院辦理。" },
            ],
          },
        ],
      },
      {
        id: "exchange_course_selection",
        title_en: "Course Selection Process",
        title_zh: "選課流程",
        categoryId: "course_selection",
        tags_en: ["course selection", "course list"],
        tags_zh: ["選課", "課程清單"],
        summary_en: "Exchange students select courses online, print the application form, collect signatures, and submit it before the deadline.",
        summary_zh: "交換生線上選課後，列印申請表、取得簽章並於期限前繳回。",
        sourceReferences: [{ ...exchangeSource, pages: "p.9-p.11" }],
        relatedTaskIds: ["registration_exchange", "exchange_course_registration"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Open the Inter-Collegiate Course Selection System and choose International Exchange Student.", zh: "進入校際選課系統並選擇「國際交換生」身分。" },
              { en: "Log in with student ID and default password, then modify the password.", zh: "使用學號與預設密碼登入，並先修改密碼。" },
              { en: "Select courses, print the Course Selection Application Form, and obtain required signatures.", zh: "選課後列印選課申請表，取得授課教師與系所主管簽章。" },
              { en: "Submit the signed sheet to the Office of Academic Affairs before the deadline.", zh: "期限前將簽章完成的表單交至教務處。" },
            ],
          },
          {
            type: "links",
            links: [
              { url: "https://cross-school.ccu.edu.tw/index.php?language=e", label_en: "Open Inter-Collegiate Course Selection System", label_zh: "開啟校際選課系統" },
              { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/index_e.html", label_en: "Open Academic Course List", label_zh: "開啟課程查詢系統" },
              { url: "https://kiki.ccu.edu.tw/~ccmisp06//Course/all_english.html", label_en: "Open English-Taught Course List", label_zh: "開啟英語授課課程清單" },
              { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/Z121_e.html", label_en: "Open Chinese Training Course List", label_zh: "開啟華語課程清單" },
            ],
          },
        ],
      },
      {
        id: "exchange_ecourse",
        title_en: "eCourse Use",
        title_zh: "eCourse 使用",
        categoryId: "course_selection",
        tags_en: ["ecourse", "course platform"],
        tags_zh: ["eCourse", "課程平台"],
        summary_en: "eCourse access is enabled after the academic office receives course selection documents.",
        summary_zh: "教務處收到選課文件後，才會開通 eCourse 使用權限。",
        sourceReferences: [{ ...exchangeSource, pages: "p.11" }],
        relatedTaskIds: ["exchange_ecourse_account"],
        blocks: [
          {
            type: "note",
            content_en:
              "The handbook notes that eCourse access is usually enabled after the Office of Academic Affairs receives the course selection sheet.",
            content_zh: "手冊提醒，教務處收到選課表後，通常才會開通 eCourse 使用權限。",
          },
          { type: "links", links: [{ url: "https://ecourse2.ccu.edu.tw/index.php", label_en: "Open eCourse2", label_zh: "開啟 eCourse2" }] },
        ],
      },
      {
        id: "exchange_course_types",
        title_en: "Types of Courses Available to Exchange Students",
        title_zh: "交換生可選課程類型",
        categoryId: "course_selection",
        tags_en: ["courses", "academic courses", "chinese courses", "general education"],
        tags_zh: ["課程", "系所課程", "華語課程", "通識課程"],
        summary_en: "Exchange and visiting students may choose academic courses, Chinese training courses, and selected language-related programs, but general education courses are not guaranteed.",
        summary_zh: "交換生與訪問學生可選系所課程、華語課程與語言相關學程，但通識課程通常無法保證名額。",
        sourceReferences: [{ ...exchangeSource, pages: "p.11-p.12" }],
        relatedTaskIds: ["exchange_course_registration"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Academic courses are offered by departments and may be taught in Chinese or English.", zh: "系所課程由各系所開設，可能以中文或英文授課。" },
              { en: "English-taught courses are usually marked in the course list.", zh: "英語授課課程通常會在課程清單中標示。" },
              { en: "Chinese training courses are provided by the Center for Language Studies and are credit-loaded.", zh: "華語課程由語言中心提供，屬於有學分課程。" },
              { en: "The Certificate Program of Applied Language Studies may require a placement test.", zh: "應用語言學程可能需要參加分級測驗。" },
              { en: "General education courses are not guaranteed because they are usually limited by enrollment quota.", zh: "通識課程通常有名額限制，因此不保證交換生一定能選上。" },
            ],
          },
          {
            type: "links",
            links: [
              { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/index_e.html", label_en: "Open Academic Course List", label_zh: "開啟課程查詢系統" },
              { url: "https://kiki.ccu.edu.tw/~ccmisp06//Course/all_english.html", label_en: "Open English-Taught Course List", label_zh: "開啟英語授課課程清單" },
              { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/Z121_e.html", label_en: "Open Chinese Training Course List", label_zh: "開啟華語課程清單" },
            ],
          },
        ],
      },
      {
        id: "exchange_visa_extension",
        title_en: "Visa Extension Reminder",
        title_zh: "簽證延期提醒",
        categoryId: "visa_insurance",
        tags_en: ["visa extension", "visitor visa"],
        tags_zh: ["簽證延期", "停留簽證"],
        summary_en: "Students with visitor visas must apply for extension before the visa expires.",
        summary_zh: "持停留簽證者須在簽證到期前辦理延期。",
        sourceReferences: [{ ...exchangeSource, pages: "p.12" }],
        relatedTaskIds: ["arc_extension"],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en: "If visa extension is not completed before the expiry date, the student may have to leave Taiwan.",
            content_zh: "若未在簽證到期前完成延期，可能必須離開臺灣。",
          },
        ],
      },
      {
        id: "exchange_fees_expenses",
        title_en: "Fees and Living Expenses",
        title_zh: "費用與生活開銷",
        categoryId: "payment_fees",
        tags_en: ["fees", "expenses", "transportation"],
        tags_zh: ["費用", "生活開銷", "交通"],
        summary_en: "Estimated fees and expenses for exchange and visiting students.",
        summary_zh: "交換生與訪問學生的費用與生活開銷預估。",
        sourceReferences: [{ ...exchangeSource, pages: "p.13-p.14" }],
        relatedTaskIds: ["dorm_fee", "tuition_fee"],
        blocks: [
          {
            type: "table",
            columns: [
              { key: "item", label_en: "Item", label_zh: "項目" },
              { key: "estimate", label_en: "Estimate", label_zh: "預估" },
              { key: "note", label_en: "Note", label_zh: "備註" },
            ],
            rows: [
              { item: { en: "ARC application", zh: "ARC 申請" }, estimate: "NT$1,000", note: { en: "Only for students staying more than six months.", zh: "僅適用於停留超過六個月者。" } },
              { item: { en: "Visitor visa extension", zh: "停留簽證延期" }, estimate: "NT$600", note: { en: "Apply before visa expiry.", zh: "請於簽證到期前申請。" } },
              { item: { en: "On-campus dormitory", zh: "校內宿舍" }, estimate: "US$310-360", note: { en: "Depends on exchange agreement.", zh: "依交換協議而定。" } },
              { item: { en: "Health check", zh: "健康檢查" }, estimate: { en: "Around US$25", zh: "約 US$25" }, note: { en: "May be higher if completed off campus.", zh: "若自行至校外醫院辦理，費用可能較高。" } },
            ],
          },
        ],
      },
      {
        id: "exchange_work_restriction",
        title_en: "Work Restriction for Exchange Students",
        title_zh: "交換生工作限制",
        categoryId: "end_exchange",
        tags_en: ["work", "restriction", "permit"],
        tags_zh: ["工作", "限制", "許可"],
        summary_en: "Exchange and visiting students are not allowed to work on or off campus in Taiwan.",
        summary_zh: "交換生與訪問學生不得在臺灣校內或校外工作。",
        sourceReferences: [{ ...exchangeSource, pages: "p.14" }],
        relatedTaskIds: ["work_permit"],
        blocks: [
          {
            type: "note",
            tone: "warning",
            content_en: "Only degree-seeking students can apply for a work permit. Exchange and visiting students are not allowed to work in Taiwan.",
            content_zh: "只有學位生可以申請工作許可。交換生與訪問學生不得在臺灣工作。",
          },
        ],
      },
      {
        id: "exchange_check_in_leaving",
        title_en: "Check-in and End-of-Exchange Leaving Procedure",
        title_zh: "報到與交換結束離校程序",
        categoryId: "end_exchange",
        tags_en: ["check-in", "leaving", "procedure"],
        tags_zh: ["報到", "離校", "程序"],
        summary_en: "Exchange students must complete check-in after arrival and school-leaving procedures before departure.",
        summary_zh: "交換生抵校後須完成報到，離校前須完成離校程序。",
        sourceReferences: [{ ...exchangeSource, pages: "p.14" }],
        relatedTaskIds: ["registration_exchange", "complete_school_leaving"],
        blocks: [
          {
            type: "checklist",
            items: [
              { en: "Complete the Registration Sheet for Exchange/Visiting Students upon arrival.", zh: "抵校後完成交換生／訪問學生報到單。" },
              { en: "Before leaving, complete the School Leaving Procedure Sheet issued by OIA.", zh: "離校前完成國際處提供的交換生離校程序單。" },
            ],
          },
        ],
      },
      {
        id: "exchange_campus_life_links",
        title_en: "Useful Campus Life Links",
        title_zh: "校園生活相關連結",
        categoryId: "end_exchange",
        tags_en: ["campus life", "video", "links"],
        tags_zh: ["校園生活", "影片", "連結"],
        summary_en: "Campus videos and useful links help exchange students understand the campus environment.",
        summary_zh: "校園影片與實用連結可協助交換生認識校園環境。",
        sourceReferences: [{ ...exchangeSource, pages: "p.17" }],
        blocks: [
          {
            type: "links",
            links: [
              { url: "https://www.youtube.com/watch?v=ggWsB4jjwCs", label_en: "Watch CCU Campus Video", label_zh: "觀看中正大學校園影片" },
              { url: "https://youtu.be/VRh_XvDZT7k", label_en: "Watch CCU Campus Video", label_zh: "觀看中正大學校園影片" },
              { url: "https://youtu.be/av5z3u3jgrY", label_en: "Watch CCU Campus Video", label_zh: "觀看中正大學校園影片" },
            ],
          },
        ],
      },
      {
        id: "exchange_oia_location",
        title_en: "Location of OIA",
        title_zh: "國際處位置",
        categoryId: "orientation",
        tags_en: ["oia", "location", "supermarket"],
        tags_zh: ["國際處", "位置", "超市"],
        summary_en: "OIA is located on the second floor above the CCU Supermarket.",
        summary_zh: "國際處位於中正大學超市樓上二樓。",
        sourceReferences: [{ ...exchangeSource, pages: "p.19" }],
        blocks: [
          {
            type: "paragraph",
            content_en: "The Office of International Affairs is located on the second floor right above the CCU Supermarket.",
            content_zh: "國際事務處位於中正大學超市正上方二樓。",
          },
        ],
      },
    ],
  },
];

export function getStudentGuideById(id: string | undefined) {
  return studentGuides.find((guide) => guide.id === id);
}

export function getCategoryName(guide: StudentGuide, categoryId: StudentGuideCategoryId) {
  return guide.filters.find((category) => category.id === categoryId);
}
