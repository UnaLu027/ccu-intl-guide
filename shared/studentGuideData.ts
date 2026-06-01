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

const baseStudentGuides: StudentGuide[] = [
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
              { item: { en: "Health check", zh: "健康檢查" }, estimate: { en: "NTD 1400", zh: "NTD 1400" }, note: { en: "Mandatory for every new student. If missed, students must go to a hospital by themselves and the fee will be more expensive.", zh: "每位新生皆須完成。若錯過校內健檢，需自行至醫院辦理，費用會較高。" } },
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

const studentGuideBlockSupplements: Record<string, HandbookBlock[]> = {
  degree_calendar: [
    {
      type: "timeline",
      items: [
        { date: "02/27-02/28", event_en: "228 Peace Memorial Day.", event_zh: "二二八和平紀念日。" },
        { date: "03/16", event_en: "Deadline for submitting the Student Group Insurance waiver.", event_zh: "繳交不參加學生團體保險切結書截止。" },
        { date: "04/03-04/06", event_en: "Children's Day and Tomb Sweeping Day holidays.", event_zh: "兒童節與民族掃墓節連假。" },
        { date: "04/07-04/08", event_en: "Intercollegiate activities; classes suspended.", event_zh: "校際活動停課。" },
        { date: "04/20-04/26", event_en: "Mid-term examination period.", event_zh: "期中考週。" },
        { date: "04/27-05/25", event_en: "Application period for course drop.", event_zh: "棄選申請期間。" },
        { date: "05/01", event_en: "Labor Day.", event_zh: "勞動節。" },
        { date: "05/15", event_en: "Two-thirds refund benchmark date for suspension or withdrawal.", event_zh: "休退學退費三分之二基準日。" },
        { date: "05/29", event_en: "Deadline for early graduation application.", event_zh: "提前畢業申請截止。" },
        { date: "06/01", event_en: "Application begins for department transfer, minor, and double major.", event_zh: "轉系、輔系、雙主修申請開始。" },
        { date: "06/06", event_en: "Graduation ceremony.", event_zh: "畢業典禮。" },
        { date: "06/08-06/12", event_en: "First-stage course selection for the next semester.", event_zh: "下學期第一階段選課。" },
        { date: "06/20-06/26", event_en: "Final examination period.", event_zh: "期末考週。" },
        { date: "07/31", event_en: "Semester ends.", event_zh: "學期結束。" },
      ],
    },
  ],
  degree_registration_overview: [
    {
      type: "timeline",
      items: [
        { date: "1", event_en: "Complete dormitory check-in after arrival. Dorm internet can be requested only after receiving the room and bed number.", event_zh: "抵達後先完成宿舍入住；取得房號與床號後，才能申請宿舍網路。" },
        { date: "2", event_en: "Apply for dorm internet at the Computer Center / Office of Information Technology in CB1 from 7PM to 10PM. Prepare the computer address, internet cable, and room / bed information. Fee: NT$1,000.", event_zh: "至資訊處電算中心 CB1 申請宿舍網路，時間為 19:00 至 22:00。請準備電腦位址、網路線、房號與床號，費用為 NTD 1,000。" },
        { date: "3", event_en: "Upload a digital photo to the Student Academic Record Entry System. The default password is birthday plus the first two uppercase letters of the student's name.", event_zh: "至學籍資料登錄系統上傳數位照片。預設密碼為生日加上姓名前兩個大寫英文字母。" },
        { date: "4", event_en: "Download the payment bill from the payment system and pay before the deadline.", event_zh: "至繳費系統下載繳費單，並於期限內完成繳費。" },
        { date: "5", event_en: "Complete registration document checks at OIA, Health Center, and Office of Academic Affairs.", event_zh: "依序至國際事務處、衛生保健組與教務處完成報到與文件查驗。" },
      ],
    },
    {
      type: "table",
      columns: [
        { key: "unit", label_en: "Unit", label_zh: "單位" },
        { key: "location", label_en: "Location", label_zh: "地點" },
        { key: "documents", label_en: "Documents", label_zh: "文件" },
        { key: "notes", label_en: "Notes", label_zh: "備註" },
      ],
      rows: [
        {
          unit: { en: "Office of International Affairs", zh: "國際事務處" },
          location: { en: "OIA", zh: "國際事務處" },
          documents: { en: "Student Registration Form, passport, visa, diploma, transcript, payment receipt if applicable, and other documents required by OIA.", zh: "學生報到表、護照、簽證、畢業證書、成績單、適用者之繳費收據，以及國際事務處要求的其他文件。" },
          notes: { en: "Confirm identity, arrival status, and OIA-required materials.", zh: "確認身分、抵達狀態與國際事務處要求資料。" },
        },
        {
          unit: { en: "Health Center", zh: "衛生保健組" },
          location: { en: "Health Center", zh: "衛生保健組" },
          documents: { en: "CCU Student Health Examination Form, NT$630, passport, and Registration Sheet.", zh: "中正大學學生健康檢查表、NTD 630、護照與報到單。" },
          notes: { en: "Complete health check procedures as instructed.", zh: "依現場指示完成健康檢查程序。" },
        },
        {
          unit: { en: "Office of Academic Affairs", zh: "教務處" },
          location: { en: "Office of Academic Affairs", zh: "教務處" },
          documents: { en: "Photocopy of passport with visa, authenticated diploma, authenticated transcript, Student Academic Record Entry Form, and Registration Sheet.", zh: "含簽證之護照影本、經驗證之畢業證書、經驗證之成績單、學籍資料登錄表與報到單。" },
          notes: { en: "Academic record verification and registration completion.", zh: "辦理學籍資料確認與註冊完成程序。" },
        },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "After payment, keep the receipt for registration if required.", zh: "完成繳費後，請保留收據以備報到查驗。" },
        { en: "Payment can be made at convenience stores, post offices, or Bank of Taiwan. If the amount exceeds NT$40,000, pay at a post office or the Bank of Taiwan counter at B1 of the Administration Building.", zh: "可至便利商店、郵局或臺灣銀行繳費；若金額超過 NTD 40,000，須至郵局或行政大樓 B1 臺灣銀行櫃台繳費。" },
        { en: "The Bank of Taiwan campus counter is open from 09:00 to 11:50.", zh: "校內臺灣銀行櫃台時間為 09:00 至 11:50。" },
        { en: "Even with a CCU scholarship, students may still need to pay insurance, dormitory deposit, computer practicum fee, or internet fee.", zh: "即使獲得中正大學獎學金，仍可能須繳交保險費、宿舍保證金、電腦實習費或網路費。" },
        { en: "Registration guidance also includes Chinese Program information, postal account setup after receiving ARC, language learning resources, and English proficiency tests.", zh: "報到資訊也包含中文課程、取得 ARC 後辦理郵局帳戶、語言學習資源與英語能力測驗等提醒。" },
      ],
    },
  ],
  degree_health_check: [
    {
      type: "checklist",
      items: [
        { en: "Prepare passport, CCU Student Health Examination Form, Registration Sheet, and the health check fee.", zh: "請準備護照、中正大學學生健康檢查表、報到單與健康檢查費。" },
        { en: "On-campus health check fee: NT$630.", zh: "校內健康檢查費用為 NTD 630。" },
        { en: "Three days before the check, keep a regular schedule and avoid overeating or heavy drinking.", zh: "健檢前三天請維持正常作息，避免暴飲暴食。" },
        { en: "Fasting is not required. If you have eaten, tell the blood-drawing staff.", zh: "健檢當天不需要空腹；若已進食，請告知抽血人員。" },
        { en: "Avoid wearing contact lenses. If contact lenses are necessary, bring a lens case.", zh: "請避免配戴隱形眼鏡；若必須配戴，請攜帶隱形眼鏡盒。" },
        { en: "Avoid clothing or accessories containing metal.", zh: "請避免穿戴含金屬物品的衣物或配件。" },
        { en: "Pregnant students or students who may be pregnant must inform the X-ray staff.", zh: "孕婦或可能懷孕者須告知 X 光檢查人員。" },
        { en: "The health check report can usually be collected from the department office about 45 days later.", zh: "健康檢查報告約 45 天後可至系辦領取。" },
        { en: "Students who miss the on-campus health check must complete the check at a designated or qualified hospital and submit the report as required.", zh: "若錯過校內健檢，須自行至指定或合格醫院完成健康檢查，並依規定繳交報告。" },
      ],
    },
  ],
  degree_health_insurance: [
    {
      type: "checklist",
      items: [
        { en: "New international students must submit proof of medical and accident insurance valid for at least six months at registration.", zh: "國際新生註冊時須提出至少六個月有效的醫療與傷害保險證明。" },
        { en: "If the insurance was purchased overseas, the insurance certificate must be authenticated by an Overseas Agency.", zh: "若保險是在國外購買，保險證明須經海外館處驗證。" },
        { en: "Students who are not yet eligible for National Health Insurance should use medical insurance during the initial period in Taiwan.", zh: "尚未符合全民健保資格者，抵臺初期先以醫療保險保障。" },
        { en: "Students may apply for NHI after holding an ARC and continuously residing in Taiwan for six months.", zh: "持有 ARC 並連續居留滿六個月後，才可申請加入全民健保。" },
        { en: "Example: if the ARC issue date is 03/10, the earliest NHI application date is 09/10.", zh: "例：若 ARC 核發日為 03/10，最早可於 09/10 申請全民健保。" },
      ],
    },
    {
      type: "table",
      columns: [
        { key: "type", label_en: "Type", label_zh: "類型" },
        { key: "when", label_en: "When used", label_zh: "使用時機" },
        { key: "note", label_en: "Note", label_zh: "說明" },
      ],
      rows: [
        { type: { en: "Medical insurance", zh: "醫療保險" }, when: { en: "Before NHI eligibility after arriving in Taiwan.", zh: "抵臺初期、尚未符合全民健保資格前使用。" }, note: { en: "Must cover medical and accident needs.", zh: "須涵蓋醫療與傷害保障。" } },
        { type: { en: "National Health Insurance", zh: "全民健保" }, when: { en: "After meeting ARC and residence requirements.", zh: "符合 ARC 與居留條件後加入。" }, note: { en: "Apply after six months of continuous residence.", zh: "連續居留滿六個月後申請。" } },
      ],
    },
    {
      type: "links",
      links: [{ url: "https://www.nhi.gov.tw/en/mp-2.html", label_en: "Open National Health Insurance Website", label_zh: "開啟全民健保署英文網站" }],
    },
  ],
  degree_postal_account: [
    {
      type: "contact",
      name_en: "National Chung Cheng University Post Office",
      name_zh: "國立中正大學郵局",
      location_en: "Activity Center 1F",
      location_zh: "活動中心一樓",
      phone: "08:30-17:00; break 12:30-13:30",
    },
    {
      type: "checklist",
      items: [
        { en: "Passport.", zh: "護照正本。" },
        { en: "ARC.", zh: "ARC 正本。" },
        { en: "Chinese name stamp / seal.", zh: "中文姓名印章。" },
        { en: "Student Status Certificate if under 20 years old.", zh: "未滿 20 歲者須準備在學證明。" },
        { en: "Minimum deposit NT$100.", zh: "最低存款 NTD 100。" },
        { en: "After opening the account, send the Personal Account Form and a copy or photo of the bank passbook to OIA.", zh: "開戶後，須將個人帳戶表與存摺影本或照片寄給國際事務處。" },
      ],
    },
    {
      type: "note",
      tone: "warning",
      content_en: "All documents must be originals. Photos or printed photos cannot replace formal documents. The post office will provide the CRS Self-Certification Form; pages marked NO NEED TO FILL should be handled according to the instructions.",
      content_zh: "所有文件必須為正本，照片或列印照片不可作為正式文件。郵局會提供 CRS 自我證明表；若頁面標示不需填寫，請依指示處理。",
    },
    {
      type: "contact",
      name_en: "Office of International Affairs",
      name_zh: "國際事務處",
      email: "ccuoiais@ccu.edu.tw",
    },
  ],
  degree_campus_life: [
    {
      type: "checklist",
      items: [
        { en: "Use campus stores and convenience stores for daily necessities after arrival.", zh: "抵達後可利用校園商店與便利商店購買日常用品。" },
        { en: "Check campus dining options and nearby living resources before the first week of classes.", zh: "開學第一週前可先確認校內餐飲與校內外生活資源。" },
        { en: "Keep a list of nearby clinics, hospitals, and emergency contacts.", zh: "請保留附近診所、醫院與緊急聯絡方式。" },
        { en: "For daily-life questions, contact OIA or ask trusted campus staff before making decisions.", zh: "生活問題可先詢問國際事務處或可信任的校內人員。" },
      ],
    },
  ],
  degree_library: [
    {
      type: "checklist",
      items: [
        { en: "Use CCU SSO to access the Library Online System.", zh: "使用圖書館線上系統需透過中正大學單一入口登入。" },
        { en: "Regularly check your borrowing status.", zh: "請定期檢查借閱狀況。" },
        { en: "If a borrowed item is reserved by another user, the due date may be advanced.", zh: "若借閱書籍被他人預約，到期日可能提前。" },
        { en: "It is recommended to check borrowing status every 10 days.", zh: "建議每 10 天查詢一次借閱狀況。" },
        { en: "Use My Account / Renew to manage renewal when available.", zh: "可使用個人帳戶與續借功能管理借閱資料。" },
        { en: "Register or confirm your email address to receive library notices.", zh: "請自行登錄或確認 email，才能收到圖書館通知。" },
        { en: "Food and drinks are prohibited in the library.", zh: "館內禁止飲食。" },
        { en: "Set mobile phones to vibration mode.", zh: "手機請調成震動。" },
        { en: "Violations may lead to penalty points or suspension of borrowing and library access privileges.", zh: "違規可能扣點或暫停借閱與館舍使用權。" },
      ],
    },
    {
      type: "note",
      tone: "info",
      content_en: "The library floor guide is listed below according to the handbook. Students should still confirm current room use on the library website before visiting.",
      content_zh: "下方依手冊整理圖書館樓層配置。實際空間使用仍建議以圖書館網站公告為準。",
    },
  ],
  degree_sports_facilities: [
    {
      type: "checklist",
      items: [
        { en: "CCU sports facilities may include indoor and outdoor exercise spaces; confirm the latest facility list on the Sports Center website.", zh: "中正大學運動設施包含室內外運動空間，最新設施清單請以體育中心網站為準。" },
        { en: "Check opening hours before visiting.", zh: "使用前請先確認開放時間。" },
        { en: "Some facilities may require reservation or payment.", zh: "部分設施可能需預約或付費。" },
        { en: "Follow facility rules and staff instructions while using sports facilities.", zh: "使用運動設施時，請遵守場館規則與現場人員指示。" },
      ],
    },
    {
      type: "links",
      links: [{ url: "https://sport.ccu.edu.tw/", label_en: "Open Sports Center Page", label_zh: "開啟體育中心頁面" }],
    },
  ],
  degree_work_permit: [
    {
      type: "timeline",
      items: [
        { date: "1", event_en: "Fill in the online application form.", event_zh: "填寫線上申請表。" },
        { date: "2", event_en: "Pay the fee at an ATM or post office.", event_zh: "至 ATM 或郵局繳費。" },
        { date: "3", event_en: "Upload front and back of student ID card with semester registration stamp.", event_zh: "上傳含本學期註冊章之學生證正反面。" },
        { date: "4", event_en: "Upload valid passport.", event_zh: "上傳有效護照。" },
        { date: "5", event_en: "Upload front and back of valid ARC.", event_zh: "上傳有效 ARC 正反面。" },
        { date: "6", event_en: "Wait and check application status. Use ARC number in Number of Employer and use submitting date.", event_zh: "等待並查詢申請狀態；查詢時於雇主號碼欄輸入 ARC 號碼，並輸入送件日期。" },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "Off-campus full-time and part-time jobs require a work permit.", zh: "校外全職與兼職工作皆需工作許可。" },
        { en: "Only degree-seeking students can apply for a work permit.", zh: "只有學位生可以申請工作許可。" },
        { en: "Learning-Oriented Part-Time Assistant jobs do not need a work permit.", zh: "學習型兼任助理不需工作許可。" },
        { en: "Labor-Oriented Part-Time Assistant jobs require a work permit.", zh: "勞僱型兼任助理需要工作許可。" },
        { en: "If receiving stipend from a lab or department, confirm with the advisor which assistant type applies.", zh: "若從實驗室或系所領取津貼，請向指導教授確認屬於哪一類助理。" },
        { en: "Work permit validity is six months at most.", zh: "工作許可效期最長六個月。" },
        { en: "Fall semester permit is valid until March 31; spring semester permit is valid until September 30.", zh: "秋季學期申請之工作許可效期至隔年 3 月 31 日；春季學期申請者效期至同年 9 月 30 日。" },
        { en: "Return the work permit to OIA if suspended or discontinued.", zh: "若休學或中止就學，須將仍有效之工作許可繳回國際事務處。" },
        { en: "Reissue documents: application form, declaration with stamp from department director or OIA, and copies of valid passport and ARC.", zh: "補發文件包含申請表、系所主管或國際事務處蓋章之聲明書，以及有效護照與 ARC 影本。" },
      ],
    },
    {
      type: "contact",
      name_en: "Workforce Development Agency",
      name_zh: "勞動力發展署",
      phone: "0800-881-339 / 02-2380-1720; Mon-Fri 08:30-12:30, 13:30-17:30",
      links: [{ url: "https://www.wda.gov.tw/en/", label_en: "Open Workforce Development Agency Website", label_zh: "開啟勞動力發展署英文網站" }],
    },
  ],
  degree_arc_application_extension: [
    {
      type: "note",
      tone: "danger",
      content_en: "Late first-time ARC application may be fined NT$2,000-10,000. Late ARC extension may be fined NT$10,000-50,000. If more than 30 days late, the student must leave Taiwan and re-apply from abroad.",
      content_zh: "首次 ARC 逾期申請可能罰 NTD 2,000 至 10,000；ARC 逾期延期可能罰 NTD 10,000 至 50,000。若逾期超過 30 天，須離境並自境外重新申請。",
    },
    {
      type: "checklist",
      items: [
        { en: "Address or passport changes must be reported within 30 days.", zh: "地址或護照資料變更須於 30 日內通報。" },
        { en: "Penalty for not reporting personal information updates: NT$2,000-10,000.", zh: "未通報個人資料變更，可能罰 NTD 2,000 至 10,000。" },
        { en: "ARC collection location: Chiayi City Service Center.", zh: "ARC 領取地點：嘉義市服務站。" },
        { en: "Method of collection: in person in Taiwan.", zh: "領取方式：在臺本人親自領取。" },
        { en: "Bring the payment receipt paper or digital copy.", zh: "請攜帶繳費收據紙本或電子檔。" },
      ],
    },
  ],
  degree_chinese_language: [
    {
      type: "checklist",
      items: [
        { en: "Chinese Training Program courses are credit-loaded and free.", zh: "華語訓練課程可採計學分且免費。" },
        { en: "International students are encouraged to take at least one Chinese course.", zh: "鼓勵國際學生至少修習一門華語課程。" },
        { en: "The course system URL may need to be updated once the new course selection system is ready.", zh: "新選課系統完成後，課程系統網址可能需要更新。" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/1334_e.html", label_en: "Open Chinese Credit Course Information", label_zh: "開啟華語學分課程資訊" },
      ],
    },
  ],
  degree_gender_incident_regulations: [
    {
      type: "contact",
      name_en: "Office of Student Affairs",
      name_zh: "學生事務處",
      email: "health@ccu.edu.tw",
      phone: "Investigation hotline 05-272-0411 ext. 12346; 24-hour reporting hotline 05-272-1114",
    },
    {
      type: "checklist",
      items: [
        { en: "Faculty and staff who become aware of suspected incidents must report within 24 hours.", zh: "教職員知悉疑似事件後，須於 24 小時內通報。" },
        { en: "Possible assistance includes psychological counseling, legal assistance, academic assistance, financial assistance, social welfare referral, and other protective measures.", zh: "可能協助包含心理諮商、法律協助、課業協助、經濟協助、社會福利轉介與其他保護措施。" },
      ],
    },
  ],
  exchange_document_submission: [
    {
      type: "note",
      tone: "info",
      content_en: "Deadline: Feb. 5, 2026. Send scanned copies to astevelyn@ccu.edu.tw and ciacoop@ccu.edu.tw.",
      content_zh: "繳交期限：2026 年 2 月 5 日。請將掃描檔寄至 astevelyn@ccu.edu.tw 與 ciacoop@ccu.edu.tw。",
    },
  ],
  exchange_health_check: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Item", label_zh: "項目" },
        { key: "detail", label_en: "Detail", label_zh: "說明" },
      ],
      rows: [
        { item: { en: "Date", zh: "日期" }, detail: { en: "Mar. 5", zh: "3 月 5 日" } },
        { item: { en: "Time", zh: "時間" }, detail: { en: "9:30-13:30", zh: "09:30-13:30" } },
        { item: { en: "Requirement", zh: "規定" }, detail: { en: "Mandatory for every new student.", zh: "每位新生皆須參加。" } },
        { item: { en: "Fee", zh: "費用" }, detail: { en: "NTD 1400", zh: "NTD 1400" } },
        { item: { en: "Documents", zh: "文件" }, detail: { en: "Passport and CCU Student Health Examination Form.", zh: "護照與中正大學學生健康檢查表。" } },
      ],
    },
  ],
  exchange_course_types: [
    {
      type: "note",
      tone: "info",
      content_en: "Spring 2026 offers 3 Chinese Training Courses with 7 credits total. Chinese courses are free for international students, and exchange students are encouraged to take at least one Chinese course.",
      content_zh: "2026 春季提供 3 門華語訓練課程，共 7 學分。華語課程對國際學生免費，並鼓勵交換生至少修習一門華語課程。",
    },
  ],
  exchange_arrival_transportation: [
    {
      type: "table",
      columns: [
        { key: "route", label_en: "Route", label_zh: "路線" },
        { key: "cost", label_en: "Estimated cost", label_zh: "預估費用" },
      ],
      rows: [
        { route: { en: "Taipei city to CCU pickup", zh: "臺北市至中正大學接送" }, cost: { en: "Around NTD 5,500", zh: "約 NTD 5,500" } },
        { route: { en: "Taoyuan to CCU pickup", zh: "桃園至中正大學接送" }, cost: { en: "Around NTD 5,000", zh: "約 NTD 5,000" } },
      ],
    },
  ],
  exchange_fees_expenses: [
    {
      type: "table",
      columns: [
        { key: "route", label_en: "Transportation item", label_zh: "交通項目" },
        { key: "cost", label_en: "Estimated cost", label_zh: "預估費用" },
      ],
      rows: [
        { route: { en: "Taipei city to CCU pickup", zh: "臺北市至中正大學接送" }, cost: { en: "Around NTD 5,500", zh: "約 NTD 5,500" } },
        { route: { en: "Taoyuan to CCU pickup", zh: "桃園至中正大學接送" }, cost: { en: "Around NTD 5,000", zh: "約 NTD 5,000" } },
      ],
    },
  ],
  exchange_arc: [
    {
      type: "links",
      links: [
        { url: "https://coa.immigration.gov.tw/coa-frontend/foreign-student/individual/login", label_en: "Open ARC Online Application Login", label_zh: "開啟 ARC 線上申請登入" },
      ],
    },
  ],
  exchange_work_restriction: [
    {
      type: "checklist",
      items: [
        { en: "Full-time and part-time jobs are both included in the work restriction.", zh: "全職與兼職工作皆包含在工作限制內。" },
        { en: "Receiving stipend from a lab is included if it counts as paid work.", zh: "若實驗室津貼被認定為有給付工作，也包含在限制內。" },
        { en: "Work permit is issued by the Bureau of Employment and Vocational Training / Workforce Development authority.", zh: "工作許可由就業與職業訓練主管機關／勞動力發展主管機關核發。" },
        { en: "Exchange and visiting students are not allowed to work on or off campus in Taiwan.", zh: "交換生與訪問學生不得在臺灣校內或校外工作。" },
      ],
    },
  ],
  exchange_check_in_leaving: [
    {
      type: "table",
      columns: [
        { key: "form", label_en: "Form", label_zh: "表單" },
        { key: "items", label_en: "Required items", label_zh: "需完成事項" },
      ],
      rows: [
        { form: { en: "Appendix 1 Registration Sheet", zh: "附錄一 報到單" }, items: { en: "Home University, Host Department at CCU, mobile number, come to OIA, get student ID card, get payment sheet for dormitory fee, check in at host department, accomplish course-taking procedure and hand in sheet to Office of Academic Affairs, hand registration sheet to OIA.", zh: "填寫母校、中正大學接待系所、手機號碼；至國際事務處報到、領取學生證、領取宿舍費繳費單、至接待系所報到、完成選課程序並將表單交至教務處、將報到單繳回國際事務處。" } },
        { form: { en: "Appendix 2 School Leaving Procedure", zh: "附錄二 離校程序單" }, items: { en: "Return key, equipment, and materials borrowed from host department; return library books if any; return PE Center equipment if any; visit dorm service center to reserve checkout date; hand leaving sheet to OIA. Even if nothing was borrowed, students still need stamps from each designated office.", zh: "歸還向接待系所借用的鑰匙、設備與資料；若有借書須歸還圖書館；若有借用體育中心器材須歸還；至宿舍服務中心預約退宿日期；將離校單交回國際事務處。即使未借用任何物品，仍須至指定單位蓋章。" } },
      ],
    },
  ],
  degree_oia_services: [
    {
      type: "checklist",
      items: [
        { en: "Use the OIA Service Request Form for registration questions.", zh: "註冊問題可使用國際事務處服務需求表單。" },
        { en: "Use the form for ARC questions.", zh: "ARC 問題可使用表單詢問。" },
        { en: "Use the form for scholarship questions.", zh: "獎學金問題可使用表單詢問。" },
        { en: "Use the form for campus life questions.", zh: "校園生活問題可使用表單詢問。" },
        { en: "Use the form for emergency or support requests.", zh: "緊急或支援需求可使用表單通報。" },
      ],
    },
    {
      type: "contact",
      name_en: "Office of International Affairs",
      name_zh: "國際事務處",
      email: "ccuoiais@ccu.edu.tw",
      phone: "05-2720411 ext. 17600-17619",
      location_en: "2nd floor above the CCU Supermarket, near the graduate student dormitory",
      location_zh: "中正大學超市樓上二樓，鄰近研究生宿舍",
      links: [{ url: "https://docs.google.com/forms/d/e/1FAIpQLScTAvImpj1fn3-JH2CFd290tC5FfLD-dHF24AZ7R5eongvOLw/viewform", label_en: "Open OIA Service Request Form", label_zh: "開啟國際事務處服務需求表單" }],
    },
  ],
  degree_alert_assistance_mechanism: [
    {
      type: "checklist",
      items: [
        { en: "International students facing major difficulties in life, language, learning, or psychological adjustment may seek help from OIA.", zh: "國際學生若在生活、語言、學習或心理適應上有重大困難，可向國際事務處尋求協助。" },
        { en: "Departments, teachers, or administrative staff who notice that an international student may need help can submit an Alert Form.", zh: "系所、教師或行政人員若發現國際學生可能需要協助，可填寫通報表。" },
        { en: "Students may submit a Self-Assessment Form for their own situation.", zh: "學生本人可填寫自我評估表說明狀況。" },
        { en: "After receiving the information, OIA may coordinate support or referrals with related campus units.", zh: "國際事務處收到後，可協調相關校內單位進行協助或轉介。" },
      ],
    },
    {
      type: "note",
      tone: "info",
      content_en: "Alert Form and Self-Assessment Form links should be added after OIA confirms the latest official URLs.",
      content_zh: "通報表與自我評估表連結，需待國際事務處確認最新官方網址後再加入。",
    },
  ],
  degree_quarantine: [
    {
      type: "note",
      tone: "danger",
      content_en: "Animal and plant quarantine violations can result in heavy fines. Hotline: 0800-039-131.",
      content_zh: "違反動植物檢疫規定可能產生高額罰鍰。檢疫專線：0800-039-131。",
    },
    {
      type: "checklist",
      items: [
        { en: "Do not bring or mail pork products, meat products, processed meat, sausage, jerky, roast duck, or instant noodles containing meat.", zh: "請勿攜帶或郵寄豬肉製品、肉類製品、加工肉品、香腸、肉乾、烤鴨或含肉泡麵。" },
        { en: "Do not bring fresh milk, raw eggs, bones, horns, fur, feathers, vegetables, flowers, fruits, rhizomes, plants, seeds, live insects, soil, or wood.", zh: "請勿攜帶鮮奶、生蛋、骨頭、角、毛皮、羽毛、蔬菜、花卉、水果、根莖類、植物、種子、活昆蟲、土壤或木材。" },
        { en: "Bringing pork products into Taiwan may lead to NT$200,000 for the first offense and NT$1,000,000 for the second offense.", zh: "攜帶豬肉產品入境，首次違規可能罰 NTD 200,000，第二次可能罰 NTD 1,000,000。" },
        { en: "Mailing pork products may cause the recipient to be fined NT$200,000 for the first offense and NT$1,000,000 for repeated offenses.", zh: "郵寄豬肉產品可能使收件人受罰，首次可能罰 NTD 200,000，重複違規可能罰 NTD 1,000,000。" },
        { en: "Travelers without residence status who cannot pay the fine on the spot may be denied entry.", zh: "無居留身分者若無法當場繳納罰鍰，可能被拒絕入境。" },
      ],
    },
  ],
  degree_smoke_free_campus: [
    {
      type: "note",
      tone: "danger",
      content_en: "CCU is a 100% smoke-free campus. Smoking is prohibited indoors and outdoors, including electronic cigarettes and heated tobacco products.",
      content_zh: "中正大學為全面無菸校園，室內外皆禁止吸菸，包含電子煙與加熱菸。",
    },
    {
      type: "checklist",
      items: [
        { en: "The legal smoking age has been raised to 20.", zh: "吸菸年齡已提高至 20 歲。" },
        { en: "Violations may be fined up to NT$10,000.", zh: "違規最高可罰 NTD 10,000。" },
        { en: "Smoking cessation hotline: 0800-531-531.", zh: "戒菸專線：0800-531-531。" },
      ],
    },
  ],
  degree_anti_fraud: [
    {
      type: "note",
      tone: "danger",
      content_en: "Quick money is not worth the cost to your future.",
      content_zh: "快速賺錢不值得用你的未來作為代價。",
    },
    {
      type: "checklist",
      items: [
        { en: "A dummy account is opened under your name but controlled by someone else.", zh: "人頭帳戶是以你的名字開立，但實際由他人控制的帳戶。" },
        { en: "Fraud groups may use dummy accounts to receive money, transfer funds, or launder money.", zh: "詐騙集團可能使用人頭帳戶收款、轉帳與洗錢。" },
        { en: "Even if you did not take the money, police may trace the account back to you.", zh: "即使錢不是你拿的，警方仍可能從帳戶資料追查到你。" },
        { en: "Never hand over your passbook, ATM card, PIN, SIM card, ID, passport, ARC, or online banking account.", zh: "不要交出存摺、提款卡、密碼、SIM 卡、身分證件、護照、ARC 或網路銀行帳號。" },
        { en: "Do not give your account to anyone for quick money or an easy job.", zh: "不要因快速賺錢或輕鬆工作而交出帳戶。" },
        { en: "Selling, lending, or providing bank accounts or ATM cards may make you an accomplice to fraud.", zh: "販售、出借或提供帳戶與提款卡，可能讓你成為詐騙共犯。" },
        { en: "If someone asks you to provide an account or withdraw money, ask OIA, police, or trusted campus staff first.", zh: "若有人要求你提供帳戶或提款，請先詢問國際事務處、警方或可信任教職員。" },
      ],
    },
  ],
  exchange_calendar: [
    {
      type: "timeline",
      items: [
        { date: "02/14-02/20", event_en: "Spring holidays.", event_zh: "春節假期。" },
        { date: "02/23", event_en: "Dormitory move-in day for exchange and visiting students.", event_zh: "交換生與訪問學生宿舍入住日。" },
        { date: "02/23", event_en: "First lecture day.", event_zh: "第一堂課開始。" },
        { date: "02/23-03/06", event_en: "Course selection period.", event_zh: "選課期間。" },
        { date: "02/26", event_en: "Orientation for exchange and visiting students.", event_zh: "交換生與訪問學生說明會。" },
        { date: "02/27-02/28", event_en: "228 Peace Memorial Day.", event_zh: "二二八和平紀念日。" },
        { date: "04/20-04/26", event_en: "Mid-term examination period.", event_zh: "期中考週。" },
        { date: "04/27-05/25", event_en: "Application period for course drop.", event_zh: "棄選申請期間。" },
        { date: "05/01", event_en: "Labor Day.", event_zh: "勞動節。" },
        { date: "06/18", event_en: "Last lecture day.", event_zh: "最後上課日。" },
        { date: "06/19", event_en: "Dragon Boat Festival.", event_zh: "端午節。" },
        { date: "06/20-06/26", event_en: "Final examination period.", event_zh: "期末考週。" },
        { date: "07/05", event_en: "Dormitory move-out deadline.", event_zh: "宿舍退宿截止日。" },
      ],
    },
  ],
  exchange_required_tasks: [
    {
      type: "checklist",
      items: [
        { en: "Book a flight ticket to Taiwan and try to arrive during daytime.", zh: "預訂來臺機票，並建議白天抵達。" },
        { en: "If the flight is cancelled, notify CCU immediately because OIA must inform the Dormitory Service Center.", zh: "若航班取消，請立即通知中正大學，因國際事務處需通知宿舍服務中心。" },
        { en: "Contact your buddy in January and February.", zh: "請於一月與二月主動聯繫學伴。" },
        { en: "Read Taiwanese news before arrival.", zh: "抵達前可先閱讀臺灣新聞，了解當地情況。" },
        { en: "Send scanned documents before the deadline.", zh: "請於期限前寄送掃描文件。" },
        { en: "Upon arrival, buy a local SIM card at the airport.", zh: "抵達後可先在機場購買本地 SIM 卡。" },
        { en: "Do not bring processed meat or meat products into Taiwan.", zh: "請勿攜帶加工肉品或肉類製品入境臺灣。" },
        { en: "Prepare at least NTD 10,000 cash for first-arrival expenses.", zh: "請準備至少 NTD 10,000 現金作為初抵臺開銷。" },
      ],
    },
    {
      type: "links",
      links: [{ url: "https://www.taipeitimes.com/", label_en: "Open Taipei Times", label_zh: "開啟 Taipei Times 新聞網站" }],
    },
  ],
  exchange_boarding_checklist: [
    {
      type: "checklist",
      items: [
        { en: "Passport and visa.", zh: "護照與簽證。" },
        { en: "Flight ticket.", zh: "機票。" },
        { en: "At least NTD 10,000 cash.", zh: "至少 NTD 10,000 現金。" },
        { en: "Do not bring meat products, processed meat, sausage, jerky, roast duck, instant noodles with meat, or other meat products.", zh: "請勿攜帶肉類製品、加工肉品、香腸、肉乾、烤鴨、含肉泡麵或其他肉類產品。" },
        { en: "Violation may result in fines from NT$200,000 to NT$1,000,000.", zh: "違規可能被罰 NTD 200,000 至 NTD 1,000,000。" },
        { en: "If the flight is cancelled, inform CCU immediately.", zh: "若航班取消，請立即通知中正大學。" },
      ],
    },
  ],
  exchange_sim_card: [
    {
      type: "checklist",
      items: [
        { en: "Buy a local SIM card at the airport upon arrival.", zh: "抵達後可在機場購買本地 SIM 卡。" },
        { en: "Prepare passport and boarding pass.", zh: "請準備護照與登機證。" },
        { en: "Prepare cash or credit card.", zh: "請準備現金或信用卡。" },
        { en: "A 30-day plan is around NTD 1,000.", zh: "30 天方案約 NTD 1,000。" },
        { en: "The SIM card should cover at least the first 10 days.", zh: "SIM 卡至少應涵蓋抵臺後前 10 天使用。" },
        { en: "Students under 18 may need a parental consent letter.", zh: "未滿 18 歲學生可能需要家長同意書。" },
      ],
    },
  ],
  exchange_medical_examination: [
    {
      type: "checklist",
      items: [
        { en: "Students staying over six months need the Health Certificate for Residence Application.", zh: "停留超過六個月者，需準備居留申請用健康檢查證明。" },
        { en: "Students staying less than six months need the Health Certificate for Short-Term Students.", zh: "停留未滿六個月者，需準備短期學生健康檢查證明。" },
        { en: "Short-term students may need measles and rubella antibody titers or immunization certificates, plus chest X-ray for tuberculosis.", zh: "短期學生可能需提供麻疹與德國麻疹抗體或接種證明，以及肺結核胸部 X 光檢查。" },
        { en: "If vaccination or antibody proof is already available, submit a photocopy and CCU may arrange chest X-ray.", zh: "若已有疫苗或抗體證明，可繳交影本，中正大學可能另安排胸部 X 光檢查。" },
        { en: "If the exam has never been completed, print the form and complete the exam in the home country before departure.", zh: "若從未完成此健康檢查，請列印表格並於出發前在母國完成檢查。" },
      ],
    },
    {
      type: "links",
      links: [{ url: "https://reurl.cc/eGaj3K", label_en: "Open Health Certificate Form", label_zh: "開啟健康檢查表" }],
    },
  ],
  exchange_visa_insurance: [
    {
      type: "checklist",
      items: [
        { en: "Students from China, Hong Kong, and Macao will be contacted privately by OIA regarding Taiwan Entry Permit.", zh: "中國大陸、香港與澳門學生之入臺證事宜，國際事務處會另行個別聯繫。" },
        { en: "Overseas travel insurance must cover accident and sickness.", zh: "海外旅遊保險須涵蓋意外與疾病。" },
        { en: "Insurance must cover outpatient and inpatient medical expenses.", zh: "保險須涵蓋門診與住院醫療費用。" },
        { en: "Insurance certificate must be submitted to OIA.", zh: "保險證明須繳交給國際事務處。" },
        { en: "Students who do not submit an insurance certificate may be forced to withdraw from the exchange or visiting program.", zh: "未繳交保險證明者，可能被要求退出交換或訪問計畫。" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://www.boca.gov.tw/cp-158-4342-a78b4-2.html", label_en: "Open Visitor Visa Guide for Exchange Students", label_zh: "開啟交換生停留簽證說明" },
        { url: "https://www.boca.gov.tw/cp-8-4336-94cdb-1.html", label_en: "Open Visitor Visa Application Information", label_zh: "開啟停留簽證申請資訊" },
        { url: "https://www.boca.gov.tw/cp-166-284-6f5f7-2.html", label_en: "Open Resident Visa Guide for Exchange Students", label_zh: "開啟交換生居留簽證說明" },
        { url: "https://www.boca.gov.tw/cp-9-186-c060a-1.html", label_en: "Open Resident Visa Application Information", label_zh: "開啟居留簽證申請資訊" },
      ],
    },
  ],
  exchange_dorm_check_in: [
    {
      type: "checklist",
      items: [
        { en: "OIA arranges on-campus dormitory for exchange students.", zh: "國際事務處會為交換生安排校內宿舍。" },
        { en: "Undergraduate exchange students usually stay in quad rooms.", zh: "大學部交換生通常安排四人房。" },
        { en: "Graduate exchange students usually stay in twin rooms.", zh: "研究所交換生通常安排雙人房。" },
        { en: "Rooms include bedstead, closet, desk, and chair.", zh: "房內包含床架、衣櫃、書桌與椅子。" },
        { en: "Students must buy mattress, pillow, quilt, sheets, and personal daily necessities.", zh: "學生須自行購買床墊、枕頭、棉被、床單與個人日用品。" },
        { en: "The supermarket is on the first floor of the OIA Building.", zh: "超市位於國際事務處大樓一樓。" },
      ],
    },
  ],
  exchange_orientation: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Item", label_zh: "項目" },
        { key: "detail", label_en: "Detail", label_zh: "說明" },
      ],
      rows: [
        { item: { en: "Date", zh: "日期" }, detail: { en: "Feb. 26", zh: "2 月 26 日" } },
        { item: { en: "Time", zh: "時間" }, detail: { en: "10:00 a.m.", zh: "上午 10:00" } },
        { item: { en: "Venue", zh: "地點" }, detail: { en: "Office of International Affairs, 2nd floor above CCU Supermarket", zh: "國際事務處，中正大學超市樓上二樓" } },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "Passport or Taiwan Entry Permit.", zh: "護照或入臺證。" },
        { en: "Medical Health Examination.", zh: "健康檢查資料。" },
        { en: "Medical Health Insurance.", zh: "醫療保險證明。" },
        { en: "CCU invitation letter.", zh: "中正大學邀請函。" },
      ],
    },
  ],
  exchange_dorm_payment: [
    {
      type: "checklist",
      items: [
        { en: "The bank counter is at B1 of the Administration Building and opens Monday to Friday morning only.", zh: "銀行櫃台位於行政大樓 B1，僅週一至週五上午開放。" },
        { en: "Students may also pay at convenience stores or post offices before the deadline.", zh: "學生也可於期限前至便利商店或郵局繳費。" },
        { en: "If the payment amount is over NTD 50,000, it must be paid at the bank.", zh: "若繳費金額超過 NTD 50,000，須至銀行繳費。" },
        { en: "On-campus dormitory fee depends on the exchange agreement.", zh: "校內宿舍費依交換協議而定。" },
        { en: "Even if dormitory fee is waived, residence deposit and electricity fee may still be required.", zh: "即使免宿舍費，仍可能須繳交住宿保證金與電費。" },
        { en: "Off-campus dormitory fees are paid directly to the landlord.", zh: "校外住宿費用須直接支付給房東。" },
      ],
    },
  ],
  exchange_course_selection: [
    {
      type: "timeline",
      items: [
        { date: "1", event_en: "Open the Inter-Collegiate Course Selection System.", event_zh: "開啟校際選課系統。" },
        { date: "2", event_en: "Click International Exchange Student.", event_zh: "點選國際交換生。" },
        { date: "3", event_en: "Enter student ID number and password. The default password is the student ID number.", event_zh: "輸入學號與密碼；預設密碼為學號。" },
        { date: "4", event_en: "Modify the password. It must be 4-10 characters and include uppercase letters, lowercase letters, numbers, and special characters. Allowed special characters: !@$^_-. It cannot be the same as the account.", event_zh: "修改密碼。密碼須為 4 至 10 碼，包含大寫字母、小寫字母、數字與特殊符號；可用特殊符號為 !@$^_-，且不得與帳號相同。" },
        { date: "5", event_en: "Select courses.", event_zh: "選擇課程。" },
        { date: "6", event_en: "Print the Course Selection Application Form.", event_zh: "列印選課申請表。" },
        { date: "7", event_en: "Ask professors and the department director to sign or stamp.", event_zh: "請授課教師與系所主管簽名或蓋章。" },
        { date: "8", event_en: "Submit the signed form to the Office of Academic Affairs before the deadline.", event_zh: "於期限前將已簽核表單送交教務處。" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://cross-school.ccu.edu.tw/index.php?language=c", label_en: "Open Inter-Collegiate Course Selection System", label_zh: "開啟校際選課系統" },
        { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/index_e.html", label_en: "Open Academic Course List", label_zh: "開啟課程查詢系統" },
        { url: "https://kiki.ccu.edu.tw/~ccmisp06//Course/all_english.html", label_en: "Open English-Taught Course List", label_zh: "開啟英語授課課程清單" },
        { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/Z121_e.html", label_en: "Open Chinese Training Course List", label_zh: "開啟華語課程清單" },
        { url: "https://ecourse2.ccu.edu.tw/index.php", label_en: "Open eCourse2", label_zh: "開啟 eCourse2" },
      ],
    },
  ],
  exchange_ecourse: [
    {
      type: "paragraph",
      content_en: "After the Office of Academic Affairs receives the signed Course Selection Application Form, students can usually use eCourse the next day. eCourse2 is used for course materials, announcements, and online learning.",
      content_zh: "教務處收到已簽核的選課申請表後，學生通常可於隔天使用 eCourse。eCourse2 用於課程教材、公告與線上學習。",
    },
    {
      type: "links",
      links: [{ url: "https://ecourse2.ccu.edu.tw/index.php", label_en: "Open eCourse2", label_zh: "開啟 eCourse2" }],
    },
  ],
  exchange_visa_extension: [
    {
      type: "checklist",
      items: [
        { en: "Application form.", zh: "申請表。" },
        { en: "One photograph.", zh: "照片一張。" },
        { en: "Passport.", zh: "護照。" },
        { en: "Student ID card.", zh: "學生證。" },
        { en: "Fee NTD 600.", zh: "費用 NTD 600。" },
        { en: "Students staying less than six months cannot apply for ARC after arrival.", zh: "停留未滿六個月者，抵臺後不能申請 ARC。" },
        { en: "Visitor visa extension must be completed before the visa expiry date.", zh: "停留簽證延期須於簽證到期日前完成。" },
        { en: "If extension is not completed before the expiry date, students must leave Taiwan.", zh: "若未於到期日前完成延期，須離開臺灣。" },
      ],
    },
  ],
};

const studentGuidePdfDetailSupplements: Record<string, HandbookBlock[]> = {
  degree_pre_arrival_checklist: [
    {
      type: "checklist",
      items: [
        { en: "ID photo size: 4.5 x 3.5 cm; head length 3.2-3.6 cm; white background; taken within the last 6 months.", zh: "證件照規格：4.5 x 3.5 公分，頭部長度 3.2 至 3.6 公分，白色背景，六個月內拍攝。" },
        { en: "Photos taken in the home country may not meet Taiwan requirements; students can take photos at the photo shop on CCU campus.", zh: "母國拍攝的照片可能不符合臺灣規格，學生可至中正大學校園照相店拍攝。" },
        { en: "Diploma and transcript translations must follow authentication requirements when the original documents are not in Chinese or English.", zh: "若畢業證書與成績單原文非中文或英文，翻譯文件須依規定辦理驗證。" },
        { en: "Taiwan voltage is 110V. Bring a compatible plug or adapter if needed.", zh: "臺灣電壓為 110V，必要時請準備合適插頭或轉接頭。" },
        { en: "Taiwan country code is 886.", zh: "臺灣國碼為 886。" },
        { en: "For international calls from Taiwan, dial 019 + country code + area code + local number.", zh: "從臺灣撥打國際電話：019 + 國碼 + 區碼 + 當地電話號碼。" },
        { en: "Students may apply for cellular service at the airport after arrival.", zh: "抵臺後可於機場申辦行動通訊服務。" },
      ],
    },
  ],
  degree_fees: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Item", label_zh: "項目" },
        { key: "tuition", label_en: "Tuition", label_zh: "學費" },
        { key: "misc", label_en: "Miscellaneous fees", label_zh: "雜費" },
        { key: "total", label_en: "Total", label_zh: "合計" },
      ],
      rows: [
        { item: { en: "College of Engineering", zh: "工學院" }, tuition: "34,833", misc: "20,457", total: "55,290" },
        { item: { en: "College of Sciences and Department of Psychology / Communications / Information Management / Athletic Sports", zh: "理學院與心理學系、傳播學系、資訊管理學系、運動競技學系" }, tuition: "34,200", misc: "20,085", total: "54,285" },
        { item: { en: "College of Management, except Department of Information Management", zh: "管理學院，資訊管理學系除外" }, tuition: "31,033", misc: "18,226", total: "49,259" },
        { item: { en: "Other colleges, except listed departments", zh: "其他學院，前列系所除外" }, tuition: "30,400", misc: "17,854", total: "48,254" },
      ],
    },
    {
      type: "note",
      tone: "info",
      content_en: "Delayed undergraduate students and graduate students from the 5th semester to the final semester pay miscellaneous fees of NT$20,106 and credit fees of NT$3,015 per credit for up to 9 credits. Students taking 10 credits or more pay full tuition and miscellaneous fees.",
      content_zh: "延修大學生與研究生自第五學期起至最後一學期，若修課不超過 9 學分，須繳雜費 NTD 20,106 與每學分 NTD 3,015 的學分費；若修 10 學分以上，須繳全額學雜費。",
    },
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Item", label_zh: "項目" },
        { key: "amount", label_en: "Amount", label_zh: "金額" },
        { key: "note", label_en: "Note", label_zh: "備註" },
      ],
      rows: [
        { item: { en: "Undergraduate on-campus accommodation", zh: "大學部校內住宿" }, amount: "NT$7,530", note: { en: "Per semester.", zh: "每學期。" } },
        { item: { en: "Graduate accommodation", zh: "研究生住宿" }, amount: "NT$7,210 / NT$10,130", note: { en: "Per semester, depending on room type.", zh: "每學期，依房型而定。" } },
        { item: { en: "Dormitory deposit", zh: "宿舍保證金" }, amount: "NT$1,600", note: { en: "Paid with dormitory fees.", zh: "隨住宿費繳交。" } },
        { item: { en: "Electricity fee", zh: "電費" }, amount: "NT$2,000", note: { en: "Per semester.", zh: "每學期。" } },
        { item: { en: "Winter vacation dormitory", zh: "寒假住宿" }, amount: "NT$1,130", note: { en: "Includes deposit NT$600 and electricity NT$500.", zh: "含保證金 NTD 600 與電費 NTD 500。" } },
        { item: { en: "Summer vacation dormitory", zh: "暑假住宿" }, amount: "NT$3,000", note: { en: "Includes deposit NT$1,000 and electricity NT$1,000.", zh: "含保證金 NTD 1,000 與電費 NTD 1,000。" } },
        { item: { en: "Chinese New Year dormitory fee", zh: "春節住宿費" }, amount: "NT$300", note: { en: "For living in the dormitory during Chinese New Year.", zh: "春節期間住宿費。" } },
        { item: { en: "Off-campus rent", zh: "校外租屋" }, amount: "NT$21,000-33,000", note: { en: "About NT$3,500-5,500 per month.", zh: "約每月 NTD 3,500 至 5,500。" } },
        { item: { en: "Computer lab fee", zh: "電腦實習費" }, amount: "Bachelor NT$1,155 / Master NT$460", note: { en: "Per semester, paid only in the first year.", zh: "每學期，僅第一年兩學期繳交。" } },
      ],
    },
  ],
  degree_registration_overview: [
    {
      type: "table",
      columns: [
        { key: "unit", label_en: "Unit", label_zh: "單位" },
        { key: "documents", label_en: "Documents", label_zh: "文件" },
      ],
      rows: [
        {
          unit: { en: "Office of International Affairs", zh: "國際事務處" },
          documents: { en: "Passport and visa with stamp of entering Taiwan; ID photo 4.5 x 3.5 cm; diploma original and authenticated version; transcript original and authenticated version; English Proficiency Certificate; Chinese Proficiency Certificate; Financial Statement; Health Certificate or ARC; Health Insurance or NHI if any; Taiwan Bank information if any.", zh: "護照與含入境章之簽證、4.5 x 3.5 公分證件照、畢業證書正本與驗證本、成績單正本與驗證本、英文能力證明、中文能力證明、財力證明、健康證明或 ARC、醫療保險或健保資料如有、臺灣銀行資料如有。" },
        },
      ],
    },
  ],
  degree_accommodation: [
    {
      type: "table",
      columns: [
        { key: "type", label_en: "Dormitory type", label_zh: "宿舍類型" },
        { key: "capacity", label_en: "Students per room", label_zh: "每房人數" },
        { key: "equipment", label_en: "Room equipment", label_zh: "房內設備" },
      ],
      rows: [
        { type: { en: "Undergraduate dormitory", zh: "大學部宿舍" }, capacity: { en: "4 students per room", zh: "四人一房" }, equipment: { en: "Beds, L-shaped desks, closets, telephone, lamps, and internet access.", zh: "床、L 型書桌、衣櫃、電話、檯燈與網路。" } },
        { type: { en: "Graduate dormitory", zh: "研究生宿舍" }, capacity: { en: "2 students per room", zh: "兩人一房" }, equipment: { en: "Beds, desks, chairs, book shelves, closets, telephone, and internet access.", zh: "床、書桌、椅子、書架、衣櫃、電話與網路。" } },
        { type: { en: "PhD dormitory", zh: "博士生宿舍" }, capacity: { en: "1-3 students per room", zh: "一至三人一房" }, equipment: { en: "Beds, desks, chairs, book shelves, closets, telephone, and internet access.", zh: "床、書桌、椅子、書架、衣櫃、電話與網路。" } },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "Residence deposit: NT$1,600; electricity charge: NT$2,000.", zh: "住宿保證金 NTD 1,600；電費 NTD 2,000。" },
        { en: "Students receive an IC card with NT$1,000 for room electricity.", zh: "學生會取得含 NTD 1,000 房間電費的 IC 卡。" },
        { en: "NT$500 is reserved for public space electricity.", zh: "NTD 500 保留作公共空間電費。" },
        { en: "At the end of the semester, the Dormitory Service Center settles the exact electricity cost.", zh: "學期末由宿舍服務中心結算實際電費。" },
        { en: "Dormitories do not provide sheets, kitchen space, or permission to cook in the room.", zh: "宿舍不提供床單，無廚房空間，也不可在房內烹煮。" },
        { en: "Public facilities include washing machines, RO drinking water, and social lounge.", zh: "公共設施包含洗衣機、RO 飲水機與交誼廳。" },
        { en: "Dormitory network information: ext. 14151.", zh: "宿舍網路洽詢分機：14151。" },
      ],
    },
  ],
  degree_library: [
    {
      type: "table",
      columns: [
        { key: "floor", label_en: "Floor", label_zh: "樓層" },
        { key: "facilities", label_en: "Facilities", label_zh: "空間與服務" },
      ],
      rows: [
        { floor: { en: "Basement", zh: "地下室" }, facilities: { en: "Study room, open 24 hours during midterm and final weeks.", zh: "自習室，期中考與期末考週 24 小時開放。" } },
        { floor: "1F", facilities: { en: "Audio-Visual Center, Cafeteria, Acquisition and Cataloging Division, Audio-Visual Resources Division, Center of Language Study, Center of Cultural Events.", zh: "視聽中心、餐廳、採編組、視聽資源組、語言中心、藝文中心。" } },
        { floor: "2F", facilities: { en: "Information Desk, Reference Desk, Circulation Desk, Database Research Area, Reference Materials, Microform Materials, Current Journals, Photocopy Room, Reader's Services Division.", zh: "服務台、參考諮詢台、流通櫃台、資料庫查詢區、參考資料、微縮資料、現期期刊、影印室、讀者服務組。" } },
        { floor: "3F", facilities: { en: "Newspapers Reading Area, Bound Western Journals, Art Exhibition Hall, Study Carrels.", zh: "報紙閱讀區、西文合訂期刊、藝術展覽廳、研究小間。" } },
        { floor: "4F", facilities: { en: "Bound East-Asian Journals, Maps and Atlas, Carrels, Reports on Overseas Assignments.", zh: "東亞語文合訂期刊、地圖與圖冊、研究小間、出國報告。" } },
        { floor: "5F", facilities: { en: "East-Asian Language Collection, Photocopy Room, Carrels and Discussion Rooms, Collection Maintenance Division.", zh: "東亞語文書庫、影印室、研究小間與討論室、典藏維護組。" } },
        { floor: "6F", facilities: { en: "East-Asian Language Collection, Photocopy Room, Carrels and Discussion Rooms, Collection Maintenance Division.", zh: "東亞語文書庫、影印室、研究小間與討論室、典藏維護組。" } },
        { floor: "7F", facilities: { en: "Western Language Collection, American Studies Library Collection, Photocopy Room, Carrels and Discussion Rooms, Conference Room, Library Director's Office.", zh: "西文書庫、美國研究書庫、影印室、研究小間與討論室、會議室、館長室。" } },
        { floor: "8F", facilities: { en: "Western Language Collection, Photocopy Room, Carrels and Discussion Rooms, School History Hall.", zh: "西文書庫、影印室、研究小間與討論室、校史館。" } },
      ],
    },
  ],
  degree_campus_life: [
    {
      type: "table",
      columns: [
        { key: "place", label_en: "Place", label_zh: "地點" },
        { key: "details", label_en: "Details", label_zh: "內容" },
      ],
      rows: [
        { place: { en: "On-campus shops", zh: "校內商店" }, details: { en: "Three FamilyMart stores; the Student Activity Center FamilyMart is open 24 hours. Student Activity Center also has beverage shop, coffee shop, vegetarian food stand, noodle shop, fruit shop, post office, hair-cut salon, and bookstore.", zh: "校內有三間全家便利商店，其中活動中心全家 24 小時營業。活動中心另有飲料店、咖啡店、素食攤、麵店、水果店、郵局、理髮店與書店。" } },
        { place: { en: "University Supermarket", zh: "大學超市" }, details: { en: "Students can buy a NT$100 share and receive yearly bonus; the NT$100 share is refundable after graduation.", zh: "可購買 NTD 100 股份成為社員並領取年度回饋，畢業後可退還 NTD 100。" } },
        { place: { en: "Eating out", zh: "外食" }, details: { en: "Options include campus restaurants, restaurants and stands outside the front gate, Minxiong downtown, and eateries around the dormitory slope.", zh: "可選擇校內餐廳、校門口外道路兩側餐廳與攤販、民雄市區，以及宿舍坡道周邊餐飲。" } },
      ],
    },
    {
      type: "table",
      columns: [
        { key: "name", label_en: "Hospital / Clinic", label_zh: "醫院／診所" },
        { key: "address", label_en: "Address", label_zh: "地址" },
        { key: "phone", label_en: "Phone", label_zh: "電話" },
        { key: "website", label_en: "Website", label_zh: "網站" },
      ],
      rows: [
        { name: { en: "Tzu Chi Hospital (Dalin)", zh: "大林慈濟醫院" }, address: { en: "No.2, Minsheng Rd., Dalin Township, Chiayi County 622, Taiwan", zh: "嘉義縣大林鎮民生路 2 號" }, phone: "(05) 264-8000 ext. 5920, 5921", website: "https://dalin.tzuchi-healthcare.org.tw/" },
        { name: { en: "Chiayi Christian Hospital", zh: "嘉義基督教醫院" }, address: { en: "No.539, Zhongxiao Rd., East Dist., Chiayi City 600, Taiwan", zh: "嘉義市東區忠孝路 539 號" }, phone: "(05) 2764994", website: "http://elearn2.cych.org.tw/1900/en/index.php" },
        { name: { en: "Chang Gung Memorial Hospital (Chiayi)", zh: "嘉義長庚紀念醫院" }, address: { en: "No.8, Sec. W., Jiapu Rd., Puzi City, Chiayi County 613, Taiwan", zh: "嘉義縣朴子市嘉朴路西段 8 號" }, phone: "(05) 3621000", website: "https://www.cgmh.org.tw/eng/about/system" },
        { name: { en: "St. Martin De Porres Hospital", zh: "聖馬爾定醫院" }, address: { en: "No.565, Sec. 2, Daya Rd., East Dist., Chiayi City 600, Taiwan", zh: "嘉義市東區大雅路二段 565 號" }, phone: "(05) 2756555", website: "https://www.stm.org.tw/stm_en/" },
        { name: { en: "Huider Clinic", zh: "懷德診所" }, address: { en: "No. 281, Sec. 1, University Road, Minxiong Township, Chiayi County 621, Taiwan", zh: "嘉義縣民雄鄉大學路一段 281 號" }, phone: "(05) 2721665", website: "https://www.facebook.com/wedeclinic?locale=zh_TW" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://eng.taiwan.net.tw/", label_en: "Open Tourism Bureau", label_zh: "開啟交通部觀光署英文網站" },
        { url: "https://oia.ccu.edu.tw/?Lang=en", label_en: "Open OIA Website", label_zh: "開啟國際事務處英文網站" },
        { url: "https://www.facebook.com/groups/696419170371204/", label_en: "Open Buy & Sell of CCU", label_zh: "開啟中正大學二手買賣社群" },
        { url: "https://english.moe.gov.tw/mp-1.html", label_en: "Open Ministry of Education", label_zh: "開啟教育部英文網站" },
        { url: "https://www.boca.gov.tw/mp-2.html", label_en: "Open Ministry of Foreign Affairs", label_zh: "開啟外交部領事事務局英文網站" },
        { url: "https://www.ali-nsa.net/en", label_en: "Open Alishan National Scenic Area", label_zh: "開啟阿里山國家風景區英文網站" },
        { url: "http://www.kingbus.com.tw/", label_en: "Open King Bus", label_zh: "開啟國光客運網站" },
        { url: "https://www.thsrc.com.tw/index_en.html", label_en: "Open Taiwan High Speed Rail", label_zh: "開啟台灣高鐵英文網站" },
        { url: "https://tip.railway.gov.tw/tra-tip-web/tip?lang=EN_US", label_en: "Open Taiwan Railways", label_zh: "開啟臺鐵英文網站" },
        { url: "https://travel.chiayi.gov.tw/English", label_en: "Open Travel in Chiayi City", label_zh: "開啟嘉義市觀光英文網站" },
        { url: "https://tbocc.cyhg.gov.tw/en/", label_en: "Open Travel in Chiayi County", label_zh: "開啟嘉義縣觀光英文網站" },
        { url: "https://cypac.cyhg.gov.tw/en/", label_en: "Open Chiayi County Performing Art Center", label_zh: "開啟嘉義縣表演藝術中心英文網站" },
        { url: "https://www.cypd.gov.tw/english", label_en: "Open Chiayi County Police Bureau", label_zh: "開啟嘉義縣警察局英文網站" },
      ],
    },
  ],
  degree_sports_facilities: [
    {
      type: "checklist",
      items: [
        { en: "Outdoor facilities include 12 tennis courts, 6 volleyball courts, 6 basketball courts, a soccer field, a softball field, a baseball field, golf driving range, track, and swimming pool.", zh: "戶外設施包含 12 座網球場、6 座排球場、6 座籃球場、足球場、壘球場、棒球場、高爾夫練習場、跑道與游泳池。" },
        { en: "The gymnasium includes weight training equipment, bowling center, table tennis courts, and squash racquet courts.", zh: "體育館內有重量訓練設備、保齡球館、桌球場與壁球場。" },
      ],
    },
  ],
};

const studentGuideFinalPdfCorrections: Record<string, HandbookBlock[]> = {
  degree_health_check: [
    {
      type: "contact",
      name_en: "Chia-Yi Christian Hospital",
      name_zh: "嘉義基督教醫院",
      phone: "05-2765041 ext. 2792 / 2750-2751",
      location_en: "Chia-Yi Christian Hospital Health Examination Service",
      location_zh: "嘉義基督教醫院健康檢查服務",
    },
    {
      type: "note",
      tone: "info",
      content_en: "Service hours: Mon-Sat morning 08:00-12:00; Mon-Fri afternoon 13:30-17:30. Please call to make an appointment or inquire about your report.",
      content_zh: "服務時間：週一至週六上午 08:00-12:00；週一至週五下午 13:30-17:30。請先電話詢問預約或報告相關事宜。",
    },
    {
      type: "checklist",
      items: [
        { en: "No need to fast.", zh: "不需要空腹。" },
        { en: "Bring original ARC or passport.", zh: "攜帶 ARC 或護照正本。" },
        { en: "Feces needs to be collected on site.", zh: "糞便檢體需現場採集。" },
        { en: "Pregnant women or those who may be pregnant cannot undergo X-ray.", zh: "孕婦或可能懷孕者不可照 X 光。" },
        { en: "If vaccinated against German measles and measles, bring original and photocopy of vaccination certificate.", zh: "若已接種德國麻疹與麻疹疫苗，請攜帶接種證明正本與影本。" },
        { en: "No appointment required, on-site processing.", zh: "不需預約，現場辦理。" },
        { en: "Bring an ID photo.", zh: "攜帶證件照。" },
      ],
    },
  ],
  degree_registration_overview: [
    {
      type: "table",
      columns: [
        { key: "unit", label_en: "Unit", label_zh: "單位" },
        { key: "location", label_en: "Location", label_zh: "地點" },
        { key: "documents", label_en: "Documents", label_zh: "文件" },
        { key: "notes", label_en: "Notes", label_zh: "備註" },
      ],
      rows: [
        {
          unit: { en: "Office of International Affairs", zh: "國際事務處" },
          location: { en: "OIA", zh: "國際事務處" },
          documents: {
            en: "Passport & Visa with stamp of entering Taiwan; ID Photo 4.5 x 3.5 cm; Diploma original and authenticated version; Transcript original and authenticated version; English Proficiency Certificate; Chinese Proficiency Certificate; Financial Statement; Health Certificate or ARC; Health Insurance or NHI, if any; Taiwan Bank, if any.",
            zh: "護照與簽證含入境章、4.5 x 3.5 cm 證件照、畢業證書正本與驗證本、成績單正本與驗證本、英文能力證明、中文能力證明、財力證明、健康證明或 ARC、醫療保險或健保資料（如有）、臺灣銀行資料（如有）。",
          },
          notes: { en: "OIA verifies identity, arrival status, and international student registration materials.", zh: "國際處確認身分、入境狀態與國際學生報到資料。" },
        },
        {
          unit: { en: "Health Center", zh: "衛生保健組" },
          location: { en: "Health Center", zh: "衛生保健組" },
          documents: { en: "CCU Student Health Examination Form; NT$630; passport; Registration Sheet.", zh: "中正大學學生健康檢查表、NT$630、護照、註冊程序單。" },
          notes: { en: "Complete health check procedures as instructed.", zh: "依現場指示完成健康檢查流程。" },
        },
        {
          unit: { en: "Office of Academic Affairs", zh: "教務處" },
          location: { en: "Office of Academic Affairs", zh: "教務處" },
          documents: { en: "Photocopy of passport with visa; authenticated diploma; authenticated transcript; Student Academic Record Entry Form; Registration Sheet.", zh: "含簽證之護照影本、驗證後畢業證書、驗證後成績單、學籍資料登錄表、註冊程序單。" },
          notes: { en: "Academic record verification and registration completion.", zh: "完成學籍審核與註冊確認。" },
        },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "Complete Dorm Check-in before applying for dormitory internet; room and bed information are required.", zh: "先完成宿舍入住，取得房號與床號後才能申請宿舍網路。" },
        { en: "Dorm Internet is handled at the Computer Center / Office of Information Technology in CB1 from 7PM-10PM; fee NT$1,000; prepare computer address, internet cable, and room / bed information.", zh: "宿舍網路於 CB1 資訊處辦理，時間 19:00-22:00，費用 NT$1,000，需準備電腦位址、網路線、房號與床號。" },
        { en: "Upload a digital photo to the Student Academic Record Entry System. Default password is birthday plus the first two uppercase letters of the student's name.", zh: "新生須至學籍資料登錄系統上傳數位照片；預設密碼為生日加姓名前兩個大寫字母。" },
        { en: "If payment amount exceeds NT$40,000, pay at a post office or the Bank of Taiwan counter at B1 of the Administration Building. The campus Bank of Taiwan counter opens 09:00-11:50.", zh: "繳費金額若超過 NT$40,000，只能至郵局或行政大樓 B1 臺灣銀行繳費；校內臺灣銀行櫃台時間為 09:00-11:50。" },
        { en: "Even with a CCU scholarship, students may still need to pay insurance, dormitory deposit, computer practicum fee, or internet fee.", zh: "即使獲得 CCU scholarship，仍可能需繳保險費、宿舍保證金、電腦實習費或網路費。" },
        { en: "Registration guidance also covers Chinese Program information, Post Account after getting ARC, Language Learning Resources, and English Proficiency Test information.", zh: "報到資訊也包含中文課程、取得 ARC 後辦理郵局帳戶、語言學習資源與英文能力測驗資訊。" },
      ],
    },
  ],
  degree_fees: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Fee item", label_zh: "費用項目" },
        { key: "amount", label_en: "Amount", label_zh: "金額" },
        { key: "note", label_en: "Note", label_zh: "備註" },
      ],
      rows: [
        { item: { en: "College tuition / miscellaneous fees / total", zh: "各學院學費／雜費／總額" }, amount: { en: "See tuition table by college.", zh: "依各學院費用表計算。" }, note: { en: "Tuition and miscellaneous fees differ by college and program.", zh: "學費與雜費依學院與學制不同。" } },
        { item: { en: "Delayed undergraduate or graduate from 5th semester", zh: "延畢大學部或碩博士第 5 學期起" }, amount: { en: "Miscellaneous fees plus credit fees.", zh: "繳交雜費與學分費。" }, note: { en: "Credit fee NT$3,015 per credit; 10 credits or more pay full tuition and miscellaneous fees.", zh: "學分費 NT$3,015／學分；10 學分以上繳全額學雜費。" } },
        { item: { en: "Undergraduate on-campus accommodation", zh: "大學部校內住宿" }, amount: "NT$7,530", note: { en: "Per semester.", zh: "每學期。" } },
        { item: { en: "Graduate accommodation", zh: "研究生住宿" }, amount: "NT$7,210 / NT$10,130", note: { en: "Per semester, depending on room type.", zh: "依房型每學期計算。" } },
        { item: { en: "Dorm deposit", zh: "宿舍保證金" }, amount: "NT$1,600", note: { en: "Residence deposit.", zh: "住宿保證金。" } },
        { item: { en: "Electricity fee", zh: "電費" }, amount: "NT$2,000", note: { en: "Includes room electricity card and public electricity reserve.", zh: "包含寢室電費儲值與公共電費預留。" } },
        { item: { en: "Winter / summer vacation dorm fees", zh: "寒暑假住宿費" }, amount: { en: "Charged separately.", zh: "另依假期住宿規定收費。" }, note: { en: "Students staying during breaks should confirm with dormitory office.", zh: "假期住宿請依宿舍公告確認。" } },
        { item: { en: "Off-campus rent", zh: "校外租屋" }, amount: "NT$21,000-33,000", note: { en: "About NT$3,500-5,500 per month.", zh: "約每月 NTD 3,500 至 5,500。" } },
        { item: { en: "Computer lab fee", zh: "電腦實習費" }, amount: "Bachelor NT$1,155 / Master NT$460", note: { en: "Per semester where applicable.", zh: "依適用學制每學期收費。" } },
        { item: { en: "Chinese New Year dorm fee", zh: "春節宿舍費" }, amount: "NT$300", note: { en: "For students staying in dormitory during Chinese New Year.", zh: "春節期間留宿宿舍者適用。" } },
      ],
    },
  ],
  degree_pre_arrival_checklist: [
    {
      type: "checklist",
      items: [
        { en: "ID photo size 4.5 x 3.5 cm; head length 3.2-3.6 cm; white background; taken within 6 months.", zh: "證件照尺寸 4.5 x 3.5 cm，頭部長度 3.2-3.6 cm，白色背景，6 個月內拍攝。" },
        { en: "Photos from the home country may not meet Taiwan requirements; students can take photos at CCU campus photo shop.", zh: "在原國家拍攝的照片可能不符合臺灣規定，可於中正大學校內照相店拍攝。" },
        { en: "Diploma and transcript translation must follow authentication rules if the original documents are not in Chinese or English.", zh: "畢業證書與成績單若非中文或英文，翻譯本需依規定完成驗證。" },
        { en: "Taiwan voltage is 110V; bring a compatible plug or adapter.", zh: "臺灣電壓為 110V，請準備相容插頭或轉接頭。" },
        { en: "Taiwan country code is 886.", zh: "臺灣國碼為 886。" },
        { en: "International calls from Taiwan: 019 + country code + area code + local number.", zh: "從臺灣撥打國際電話：019 + 國碼 + 區碼 + 當地電話號碼。" },
        { en: "Apply cellular service at the airport after arrival.", zh: "抵臺後可於機場辦理行動電話門號。" },
      ],
    },
  ],
  degree_accommodation: [
    {
      type: "table",
      columns: [
        { key: "type", label_en: "Room type", label_zh: "房型" },
        { key: "capacity", label_en: "Capacity", label_zh: "人數" },
        { key: "equipment", label_en: "Room equipment", label_zh: "設備" },
      ],
      rows: [
        { type: { en: "Undergraduate", zh: "大學部" }, capacity: { en: "4 students per room", zh: "4 人一間" }, equipment: { en: "Bed, desk, closet, phone, lamp, and internet access.", zh: "床、書桌、衣櫃、電話、檯燈與網路。" } },
        { type: { en: "Graduate", zh: "研究生" }, capacity: { en: "2 students per room", zh: "2 人一間" }, equipment: { en: "Bed, desk, chair, bookshelf, closet, phone, and internet access.", zh: "床、書桌、椅子、書架、衣櫃、電話與網路。" } },
        { type: { en: "PhD", zh: "博士生" }, capacity: { en: "1-3 students per room", zh: "1 至 3 人一間" }, equipment: { en: "Bed, desk, chair, bookshelf, closet, phone, and internet access.", zh: "床、書桌、椅子、書架、衣櫃、電話與網路。" } },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "Residence deposit NT$1,600 and electricity charge NT$2,000 are required.", zh: "需繳住宿保證金 NT$1,600 與電費 NT$2,000。" },
        { en: "The IC card includes NT$1,000 for room electricity; NT$500 is reserved for public space electricity.", zh: "IC 卡含 NT$1,000 寢室電費，另預留 NT$500 作為公共空間電費。" },
        { en: "Electricity is settled at the end of the semester.", zh: "學期末會結算實際電費。" },
        { en: "Dormitories do not provide sheets, kitchen space, or permission to cook in the room.", zh: "宿舍不提供床單，無廚房，房內不得烹煮。" },
        { en: "Public facilities include washing machines, RO drinking water, and social lounge.", zh: "公共設施包含洗衣機、RO 飲水機與交誼空間。" },
        { en: "Dormitory network extension: 14151.", zh: "宿舍網路分機：14151。" },
      ],
    },
  ],
  degree_library: [
    {
      type: "table",
      columns: [
        { key: "floor", label_en: "Floor", label_zh: "樓層" },
        { key: "facilities", label_en: "Facilities", label_zh: "設施" },
      ],
      rows: [
        { floor: { en: "Basement", zh: "地下室" }, facilities: { en: "Study room; open 24 hours during midterm/final weeks.", zh: "自習室；期中考與期末考週 24 小時開放。" } },
        { floor: "1F", facilities: { en: "Audio-Visual Center, Cafeteria, Acquisition and Cataloging Division, Audio-Visual Resources Division, Center of Language Study, Center of Cultural Events.", zh: "視聽中心、餐廳、採編組、視聽資料組、語言中心、藝文中心。" } },
        { floor: "2F", facilities: { en: "Information Desk, Reference Desk, Circulation Desk, Database Research Area, Reference Materials, Microform Materials, Current Journals, Photocopy Room, Reader's Services Division.", zh: "服務台、參考諮詢台、流通櫃台、資料庫查詢區、參考資料、縮影片資料、現期期刊、影印室、讀者服務組。" } },
        { floor: "3F", facilities: { en: "Newspapers Reading Area, Bound Western Journals, Art Exhibition Hall, Study Carrels.", zh: "報紙閱覽區、西文合訂期刊、藝術展覽廳、研究小間。" } },
        { floor: "4F", facilities: { en: "Bound East-Asian Journals, Maps & Atlas, Carrels, Reports on Overseas Assignments.", zh: "東亞語文合訂期刊、地圖與地圖集、研究小間、出國報告。" } },
        { floor: "5F", facilities: { en: "East-Asian Language Collection, Photocopy Room, Carrels & Discussion Rooms, Collection Maintenance Division.", zh: "東亞語文館藏、影印室、研究小間與討論室、館藏維護組。" } },
        { floor: "6F", facilities: { en: "East-Asian Language Collection, Photocopy Room, Carrels & Discussion Rooms, Collection Maintenance Division.", zh: "東亞語文館藏、影印室、研究小間與討論室、館藏維護組。" } },
        { floor: "7F", facilities: { en: "Western Language Collection, American Studies Library Collection, Photocopy Room, Carrels & Discussion Rooms, Conference Room, Library Director's Office.", zh: "西文館藏、美國研究圖書館館藏、影印室、研究小間與討論室、會議室、館長室。" } },
        { floor: "8F", facilities: { en: "Western Language Collection, Photocopy Room, Carrels & Discussion Rooms, School History Hall.", zh: "西文館藏、影印室、研究小間與討論室、校史館。" } },
      ],
    },
    {
      type: "checklist",
      items: [
        { en: "Use CCU SSO to access the Library Online System.", zh: "使用 CCU SSO 進入圖書館線上系統。" },
        { en: "Check borrowing status regularly; if another user reserves a borrowed item, the due date may be advanced.", zh: "定期查看借閱狀態；若借閱資料被他人預約，歸還期限可能提前。" },
        { en: "Check My Account / Renew about every 10 days and confirm your email to receive notices.", zh: "建議約每 10 天至 My Account / Renew 查詢，並確認 email 可收到通知。" },
        { en: "Food and drinks are prohibited; mobile phones should be set to vibration.", zh: "館內禁止飲食，手機請調成震動。" },
        { en: "Violations may lead to penalty points or suspension of borrowing / library privileges.", zh: "違規可能扣點或暫停借閱／館舍使用權。" },
      ],
    },
  ],
  degree_campus_life: [
    {
      type: "table",
      columns: [
        { key: "topic", label_en: "Topic", label_zh: "主題" },
        { key: "details", label_en: "Details", label_zh: "內容" },
      ],
      rows: [
        { topic: { en: "On-campus shops", zh: "校內商店" }, details: { en: "Three FamilyMart stores; Student Activity Center 24-hour FamilyMart; beverage shop, coffee shop, vegetarian food stand, noodle shop, fruit shop, post office, hair-cut salon, and bookstore.", zh: "三間全家便利商店、活動中心 24 小時全家、飲料店、咖啡店、素食攤、麵店、水果店、郵局、理髮店與書店。" } },
        { topic: { en: "University Supermarket share NT$100", zh: "大學超市股金 NT$100" }, details: { en: "University Supermarket share NT$100 is refundable after graduation.", zh: "大學超市股金 NT$100，畢業後可退還。" } },
        { topic: { en: "Eating-out", zh: "外食" }, details: { en: "Campus restaurants, restaurants and stands outside front gate, Minxiong downtown, and dormitory slope eateries.", zh: "可至校內餐廳、前門外餐廳與攤販、民雄市區、宿舍坡道周邊店家用餐。" } },
      ],
    },
    {
      type: "table",
      columns: [
        { key: "name", label_en: "Hospital / Clinic", label_zh: "醫院／診所" },
        { key: "address", label_en: "Address", label_zh: "地址" },
        { key: "phone", label_en: "Phone", label_zh: "電話" },
        { key: "website", label_en: "Website", label_zh: "網站" },
      ],
      rows: [
        { name: { en: "Tzu Chi Hospital (Dalin)", zh: "大林慈濟醫院" }, address: { en: "No.2, Minsheng Rd., Dalin Township, Chiayi County 622, Taiwan", zh: "嘉義縣大林鎮民生路 2 號" }, phone: "(05) 264-8000 ext. 5920, 5921", website: "https://dalin.tzuchi-healthcare.org.tw/" },
        { name: { en: "Chiayi Christian Hospital", zh: "嘉義基督教醫院" }, address: { en: "No.539, Zhongxiao Rd., East Dist., Chiayi City 600, Taiwan", zh: "嘉義市東區忠孝路 539 號" }, phone: "(05) 2764994", website: "http://elearn2.cych.org.tw/1900/en/index.php" },
        { name: { en: "Chang Gung Memorial Hospital (Chiayi)", zh: "嘉義長庚紀念醫院" }, address: { en: "No.8, Sec. W., Jiapu Rd., Puzi City, Chiayi County 613, Taiwan", zh: "嘉義縣朴子市嘉朴路西段 8 號" }, phone: "(05) 3621000", website: "https://www.cgmh.org.tw/eng/about/system" },
        { name: { en: "St. Martin De Porres Hospital", zh: "聖馬爾定醫院" }, address: { en: "No.565, Sec. 2, Daya Rd., East Dist., Chiayi City 600, Taiwan", zh: "嘉義市東區大雅路二段 565 號" }, phone: "(05) 2756555", website: "https://www.stm.org.tw/stm_en/" },
        { name: { en: "Huider Clinic", zh: "惠德診所" }, address: { en: "No. 281, Sec. 1, University Road, Minxiong Township, Chiayi County 621, Taiwan", zh: "嘉義縣民雄鄉大學路一段 281 號" }, phone: "(05) 2721665", website: "https://www.facebook.com/wedeclinic?locale=zh_TW" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://eng.taiwan.net.tw/", label_en: "Open Tourism Bureau", label_zh: "開啟交通部觀光署英文網站" },
        { url: "https://oia.ccu.edu.tw/?Lang=en", label_en: "Open OIA Website", label_zh: "開啟國際處網站" },
        { url: "https://www.facebook.com/groups/696419170371204/", label_en: "Open Buy & Sell of CCU", label_zh: "開啟中正大學買賣社團" },
        { url: "https://english.moe.gov.tw/mp-1.html", label_en: "Open Ministry of Education", label_zh: "開啟教育部英文網站" },
        { url: "https://www.boca.gov.tw/mp-2.html", label_en: "Open Ministry of Foreign Affairs", label_zh: "開啟外交部領事事務局英文網站" },
        { url: "https://www.ali-nsa.net/en", label_en: "Open Alishan National Scenic Area", label_zh: "開啟阿里山國家風景區英文網站" },
        { url: "http://www.kingbus.com.tw/", label_en: "Open King Bus", label_zh: "開啟國光客運網站" },
        { url: "https://en.thsrc.com.tw/", label_en: "Open Taiwan High Speed Rail", label_zh: "開啟台灣高鐵英文網站" },
        { url: "https://tip.railway.gov.tw/tra-tip-web/tip?lang=EN_US", label_en: "Open Taiwan Railways", label_zh: "開啟台灣鐵路英文網站" },
        { url: "https://travel.chiayi.gov.tw/English", label_en: "Open Travel in Chiayi City", label_zh: "開啟嘉義市旅遊英文網站" },
        { url: "https://tbocc.cyhg.gov.tw/en/", label_en: "Open Travel in Chiayi County", label_zh: "開啟嘉義縣旅遊英文網站" },
        { url: "https://cypac.cyhg.gov.tw/en/", label_en: "Open Chiayi County Performing Art Center", label_zh: "開啟嘉義縣表演藝術中心英文網站" },
        { url: "https://www.cypd.gov.tw/english", label_en: "Open Chiayi County Police Bureau", label_zh: "開啟嘉義縣警察局英文網站" },
      ],
    },
  ],
  degree_sports_facilities: [
    {
      type: "checklist",
      items: [
        { en: "Outdoor facilities include 12 tennis courts, 6 volleyball courts, 6 basketball courts, soccer field, softball field, baseball field, golf driving range, track, and swimming pool.", zh: "戶外設施包含 12 座網球場、6 座排球場、6 座籃球場、足球場、壘球場、棒球場、高爾夫練習場、跑道與游泳池。" },
        { en: "Indoor facilities include gymnasium, weight training equipment, bowling center, table tennis courts, and squash racquet courts.", zh: "室內設施包含體育館、重量訓練設備、保齡球館、桌球場與壁球場。" },
      ],
    },
  ],
  degree_work_permit: [
    {
      type: "checklist",
      items: [
        { en: "Off-campus full-time/part-time work requires a valid work permit.", zh: "校外全職或兼職工作皆需有效工作許可。" },
        { en: "Only degree-seeking students can apply for work permit.", zh: "只有學位生可以申請工作許可。" },
        { en: "Learning-Oriented Part-Time Assistant: no work permit needed; Labor-Oriented Part-Time Assistant: work permit required.", zh: "學習型兼任助理不需工作許可；勞僱型兼任助理需工作許可。" },
        { en: "If receiving stipend from lab/department, confirm with advisor which type applies.", zh: "若自實驗室或系所領取 stipend，請先與指導教授確認屬於哪一類。" },
        { en: "Maximum 20 hours per week except winter/summer vacations.", zh: "除寒暑假外，每週最多工作 20 小時。" },
        { en: "Work permit valid up to 6 months. Fall semester permit valid until March 31; Spring semester permit valid until September 30.", zh: "工作許可最長 6 個月；秋季學期許可至 3 月 31 日，春季學期許可至 9 月 30 日。" },
        { en: "Return work permit to OIA if suspended or discontinued.", zh: "若休學或退學，須將工作許可繳回國際處。" },
        { en: "Reissue documents: application form, declaration with stamp from department director or OIA, copies of valid passport and ARC.", zh: "補發文件包含申請表、經系主任或國際處蓋章之聲明書、有效護照與 ARC 影本。" },
      ],
    },
    {
      type: "timeline",
      items: [
        { date: "1", event_en: "Fill application form.", event_zh: "填寫申請表。" },
        { date: "2", event_en: "Pay fee at ATM or post office.", event_zh: "至 ATM 或郵局繳費。" },
        { date: "3", event_en: "Upload front/back student ID with semester registration stamp.", event_zh: "上傳含當學期註冊章之學生證正反面。" },
        { date: "4", event_en: "Upload passport.", event_zh: "上傳護照。" },
        { date: "5", event_en: "Upload front/back ARC.", event_zh: "上傳 ARC 正反面。" },
        { date: "6", event_en: "Wait and check status; use ARC number in Number of Employer and use submitting date.", event_zh: "等待並查詢進度；Number of Employer 請填 ARC 號碼，日期使用送件日期。" },
      ],
    },
    {
      type: "contact",
      name_en: "Workforce Development Agency",
      name_zh: "勞動力發展署",
      phone: "0800-881-339 / 02-2380-1720; Monday-Friday 8:30-12:30, 13:30-17:30",
      links: [{ url: "https://ezwp.wda.gov.tw/", label_en: "Open Work Permit Application Portal", label_zh: "開啟工作許可申辦網" }],
    },
  ],
  degree_arc_application_extension: [
    {
      type: "note",
      tone: "danger",
      content_en: "First-time ARC late application penalty NT$2,000-10,000. ARC extension late renewal penalty NT$10,000-50,000. If over 30 days late, students must leave Taiwan and re-apply from abroad.",
      content_zh: "首次 ARC 逾期申請罰鍰 NT$2,000-10,000；ARC 延期逾期罰鍰 NT$10,000-50,000。逾期超過 30 天須離境並自境外重新申請。",
    },
    {
      type: "checklist",
      items: [
        { en: "Address/passport changes must be reported within 30 days.", zh: "地址或護照資料變更須於 30 天內通報。" },
        { en: "Penalty for not reporting personal info update: NT$2,000-10,000.", zh: "未通報個人資料變更，罰鍰 NT$2,000-10,000。" },
        { en: "ARC collection location: Chiayi City Service Center.", zh: "ARC 領取地點：嘉義市服務站。" },
        { en: "Method of collection: in person in Taiwan.", zh: "領取方式：在臺本人領取。" },
        { en: "Bring payment receipt paper or digital copy.", zh: "攜帶繳費收據紙本或電子檔。" },
      ],
    },
  ],
  degree_chinese_language: [
    {
      type: "checklist",
      items: [
        { en: "Chinese Training Program is credit-loaded and free.", zh: "中文課程有學分且免費。" },
        { en: "International students are encouraged to take at least one Chinese course.", zh: "鼓勵國際學生至少修習一門中文課。" },
        { en: "Course system URL may need update once new course selection system is ready.", zh: "新的選課系統上線後，課程系統網址可能需要更新。" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://kiki.ccu.edu.tw/~ccmisp06/Course/1334_e.html", label_en: "Open Chinese Credit Course Information", label_zh: "開啟中文學分課程資訊" },
        { url: "https://chineselanguagecenter.ccu.edu.tw/", label_en: "Open Chinese Language Center Page", label_zh: "開啟華語中心頁面" },
      ],
    },
  ],
  degree_gender_incident_regulations: [
    {
      type: "contact",
      name_en: "Office of Student Affairs",
      name_zh: "學務處",
      email: "health@ccu.edu.tw",
      phone: "Gender Equality Investigation Application Acceptance Hotline: 05-272-0411 ext.12346; Gender Equality Reporting 24-hour Hotline: 05-272-1114",
    },
    {
      type: "checklist",
      items: [
        { en: "Receiving agency: Office of Student Affairs.", zh: "受理單位：學務處。" },
        { en: "Faculty/staff who become aware of suspected incidents must report within 24 hours.", zh: "教職員知悉疑似事件後，須於 24 小時內通報。" },
        { en: "University sends written notification of acceptance within 20 days.", zh: "學校於 20 日內以書面通知是否受理。" },
        { en: "If not accepted, applicant/victim/informant may request reconsideration within 20 days.", zh: "若不受理，申請人、被害人或通報人可於 20 日內申復。" },
        { en: "If dissatisfied with handling result, applicant/victim/offender may request reconsideration within 30 days.", zh: "若不服處理結果，申請人、被害人或行為人可於 30 日內申復。" },
        { en: "Possible assistance includes psychological counseling, legal assistance, academic assistance, financial assistance, social welfare referral, and other protective measures.", zh: "可提供心理諮商、法律協助、課業協助、經濟協助、社會福利轉介與其他保護措施。" },
      ],
    },
  ],
  exchange_health_check: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Item", label_zh: "項目" },
        { key: "detail", label_en: "Detail", label_zh: "內容" },
      ],
      rows: [
        { item: { en: "Date and time", zh: "日期與時間" }, detail: { en: "Mar. 5, 9:30-13:30", zh: "3 月 5 日 09:30-13:30" } },
        { item: { en: "Requirement", zh: "規定" }, detail: { en: "Mandatory for every new student.", zh: "每位新生皆須完成。" } },
        { item: { en: "Fee", zh: "費用" }, detail: { en: "NTD 1400", zh: "NTD 1400" } },
        { item: { en: "Bring", zh: "攜帶文件" }, detail: { en: "Passport and CCU Student Health Examination Form.", zh: "護照與中正大學學生健康檢查表。" } },
        { item: { en: "If missed", zh: "若錯過" }, detail: { en: "Students must go to a hospital by themselves and the fee will be more expensive.", zh: "需自行至醫院辦理，費用會較高。" } },
      ],
    },
  ],
  exchange_document_submission: [
    {
      type: "checklist",
      items: [
        { en: "Deadline: Feb. 5, 2026.", zh: "截止日期：2026 年 2 月 5 日。" },
        { en: "Email scanned copies to astevelyn@ccu.edu.tw and ciacoop@ccu.edu.tw.", zh: "請將掃描檔寄至 astevelyn@ccu.edu.tw 與 ciacoop@ccu.edu.tw。" },
        { en: "Required documents: certificate of medical examination, visa, flight ticket, and insurance certificate.", zh: "需繳文件：體檢證明、簽證、機票與保險證明。" },
      ],
    },
  ],
  exchange_course_types: [
    {
      type: "checklist",
      items: [
        { en: "Academic courses are held by departments and may be taught in Chinese or English.", zh: "學術課程由各系所開設，可能以中文或英文授課。" },
        { en: "Chinese training courses are provided by Center for Language Studies.", zh: "中文訓練課程由語言中心提供。" },
        { en: "Certificate Program of Applied Language Studies may be available.", zh: "可選修應用語言學程相關課程。" },
        { en: "Spring 2026 offers 3 Chinese Training Courses, 7 credits total.", zh: "2026 春季提供 3 門中文訓練課程，共 7 學分。" },
        { en: "Chinese courses are free for international students.", zh: "中文課程對國際學生免費。" },
        { en: "Exchange students are encouraged to take at least one Chinese course.", zh: "鼓勵交換生至少修習一門中文課。" },
        { en: "General Education courses are not guaranteed because of quota limits.", zh: "通識課程因名額限制，不保證可選上。" },
      ],
    },
  ],
  exchange_arrival_transportation: [
    {
      type: "table",
      columns: [
        { key: "route", label_en: "Route", label_zh: "路線" },
        { key: "cost", label_en: "Estimated cost", label_zh: "預估費用" },
      ],
      rows: [
        { route: { en: "Taipei city to CCU pickup around NTD5500", zh: "台北市區至中正大學接送" }, cost: { en: "Around NTD5,500", zh: "約 NTD5,500" } },
        { route: { en: "Taoyuan to CCU around NTD5000", zh: "桃園至中正大學接送" }, cost: { en: "Around NTD5,000", zh: "約 NTD5,000" } },
      ],
    },
  ],
  exchange_fees_expenses: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Item", label_zh: "項目" },
        { key: "estimate", label_en: "Estimate", label_zh: "預估費用" },
        { key: "note", label_en: "Note", label_zh: "備註" },
      ],
      rows: [
        { item: { en: "Visiting student administration fee", zh: "訪問學生行政費" }, estimate: "US$500", note: { en: "For visiting students.", zh: "訪問學生適用。" } },
        { item: { en: "Visiting student tuition per semester", zh: "訪問學生每學期學費" }, estimate: "US$1,609-1,843", note: { en: "Depends on program.", zh: "依課程或學制而定。" } },
        { item: { en: "Exchange students under exchange agreement", zh: "交換協議學生" }, estimate: { en: "Exempt from tuition and administration fee.", zh: "免學費與行政費。" }, note: { en: "Based on exchange agreement.", zh: "依交換協議辦理。" } },
        { item: { en: "TPE Airport to CCU pickup", zh: "桃園機場至中正大學接送" }, estimate: "Around NTD5,000", note: { en: "Up to two students.", zh: "最多約兩人。" } },
        { item: { en: "Taipei city to CCU pickup around NTD5500", zh: "台北市區至中正大學接送" }, estimate: "Around NTD5,500", note: { en: "Private pickup estimate.", zh: "專車接送預估。" } },
        { item: { en: "Taipei to Chiayi HSR", zh: "台北至嘉義高鐵" }, estimate: "NTD1,080", note: { en: "One-way ticket.", zh: "單程票。" } },
        { item: { en: "Taoyuan to Chiayi HSR", zh: "桃園至嘉義高鐵" }, estimate: "NTD920", note: { en: "One-way ticket.", zh: "單程票。" } },
        { item: { en: "Chiayi HSR to CCU taxi", zh: "嘉義高鐵至中正大學計程車" }, estimate: "Around NTD700", note: { en: "Taxi estimate.", zh: "計程車預估。" } },
        { item: { en: "On-campus dormitory", zh: "校內宿舍" }, estimate: "US$310-360 per semester", note: { en: "Depends on exchange agreement.", zh: "依交換協議而定。" } },
        { item: { en: "Dormitory deposit", zh: "宿舍押金" }, estimate: "Around US$55", note: { en: "Refundable subject to dorm rules.", zh: "依宿舍規定退還。" } },
        { item: { en: "Electricity", zh: "電費" }, estimate: "Around US$50 per semester", note: { en: "Estimated.", zh: "預估費用。" } },
        { item: { en: "Internet", zh: "網路費" }, estimate: "Around US$35 per semester", note: { en: "Estimated.", zh: "預估費用。" } },
        { item: { en: "Off-campus dormitory", zh: "校外住宿" }, estimate: "US$700-800 for 4.5 months", note: { en: "Paid directly to landlord.", zh: "直接繳給房東。" } },
        { item: { en: "Off-campus dormitory deposit", zh: "校外住宿押金" }, estimate: "Around US$170", note: { en: "Depends on landlord.", zh: "依房東規定。" } },
        { item: { en: "Water", zh: "水費" }, estimate: "Around US$4 per month", note: { en: "Estimated.", zh: "預估費用。" } },
        { item: { en: "Mattress, pillow, quilt", zh: "床墊、枕頭、棉被" }, estimate: "Around US$100", note: { en: "Personal purchase.", zh: "自行購買。" } },
        { item: { en: "Insurance", zh: "保險" }, estimate: "Around US$28 per month", note: { en: "For students eligible for NHI.", zh: "符合健保資格者適用。" } },
        { item: { en: "Health check", zh: "健康檢查" }, estimate: "NTD 1400", note: { en: "Mandatory for every new student.", zh: "每位新生皆須完成。" } },
        { item: { en: "Food", zh: "餐費" }, estimate: "Around US$3 per meal", note: { en: "Estimated.", zh: "預估費用。" } },
      ],
    },
  ],
  exchange_arc: [
    {
      type: "checklist",
      items: [
        { en: "ARC applies to students staying in Taiwan for more than 6 months.", zh: "ARC 適用於在臺停留超過 6 個月的學生。" },
        { en: "Apply within 30 days after entering Taiwan.", zh: "入境後 30 天內申請。" },
        { en: "Application fee: NTD1,000.", zh: "申請費：NTD1,000。" },
        { en: "ARC also works as multiple re-entry permit.", zh: "ARC 同時具有多次入境許可功能。" },
        { en: "If ARC is lost, students must pay NTD1,000 to apply for a new one.", zh: "ARC 遺失需繳 NTD1,000 申請補發。" },
        { en: "Required documents: application form, photo, passport, resident visa, photocopy of student ID card, and fee NTD1,000.", zh: "所需文件：申請表、照片、護照、居留簽證、學生證影本與費用 NTD1,000。" },
        { en: "Photo requirements: color photo, front head and shoulder, taken within 6 months, no hat, no glasses, 4.5cm x 3.5cm, head length 3.2-3.6cm, white background.", zh: "照片規格：彩色、正面半身、6 個月內拍攝、不可戴帽與眼鏡、4.5cm x 3.5cm、頭部 3.2-3.6cm、白色背景。" },
      ],
    },
    {
      type: "links",
      links: [
        { url: "https://coa.immigration.gov.tw/coa-frontend/student/entry?lang=en", label_en: "Open Students Online Application System", label_zh: "開啟學生線上申辦系統" },
        { url: "https://coa.immigration.gov.tw/coa-frontend/foreign-student/individual/login", label_en: "Open ARC Online Application Login", label_zh: "開啟 ARC 線上申請登入" },
      ],
    },
  ],
  exchange_work_restriction: [
    {
      type: "note",
      tone: "danger",
      content_en: "Exchange/visiting students are not allowed to work on or off campus in Taiwan. Full-time and part-time jobs are included, and receiving stipend from lab is included if it counts as paid work.",
      content_zh: "交換生與訪問學生不得在臺灣校內或校外工作。全職、兼職皆包含在內；若實驗室 stipend 屬於有給付工作，也包含在限制內。",
    },
    {
      type: "checklist",
      items: [
        { en: "Work permit from Bureau of Employment and Vocational Training is for eligible students; exchange/visiting students are not allowed to work on or off campus in Taiwan.", zh: "工作許可由就業服務相關機關核發；交換生與訪問學生不得在臺灣校內或校外工作。" },
        { en: "Working without permission may result in fine of NTD30,000-150,000.", zh: "未經許可工作可能罰鍰 NTD30,000-150,000。" },
      ],
    },
  ],
  exchange_check_in_leaving: [
    {
      type: "table",
      columns: [
        { key: "form", label_en: "Form", label_zh: "表單" },
        { key: "items", label_en: "Required items", label_zh: "必要項目" },
      ],
      rows: [
        { form: { en: "Appendix 1 Registration Sheet", zh: "附錄一 報到程序單" }, items: { en: "Home University; Host Department at CCU; mobile number; come to OIA; get student ID card; get payment sheet for dormitory fee; check in at host department; accomplish course-taking procedure and hand in sheet to Office of Academic Affairs; hand registration sheet to OIA.", zh: "填寫原學校、中正大學接待系所、手機號碼；至國際處報到、領學生證、領宿舍費繳費單、至接待系所報到、完成選課程序並繳交至教務處，最後將報到程序單交回國際處。" } },
        { form: { en: "Appendix 2 School Leaving Procedure", zh: "附錄二 離校程序單" }, items: { en: "Return key/equipment/materials borrowed from host department; return library books if any; return PE Center equipment if any; visit dorm service center to reserve checkout date; hand leaving sheet to OIA. Even if nothing was borrowed, students still need stamps from each designated office.", zh: "歸還向接待系所借用的鑰匙、設備與物品；若有借書需歸還圖書館；若有借用體育中心器材需歸還；至宿舍服務中心預約退宿日期；將離校程序單交回國際處。即使沒有借用任何物品，也仍需至指定單位蓋章。" } },
      ],
    },
  ],
};

/**
 * Content expansion based on:
 * - 2026 Spring Guide for International Students, pp.35-49
 * - 2026 Spring Handbook for CCU Exchange Students, pp.2-19
 *
 * This is intentionally implemented as an additional block map so it works with the
 * existing HandbookBlock types and mergeGuideBlocksWithDedupe() pipeline.
 * No existing section IDs, task mappings, admin logic, analytics, or map logic are changed.
 */
const studentGuideCoverageGapAdditions: Record<string, HandbookBlock[]> = {
  degree_anti_fraud: [
    {
      type: "note",
      tone: "danger",
      content_en:
        "Never sell, lend, or open a bank account for someone else. Handing over your bank account, ATM card, PIN, online banking access, passport, ARC, or SIM card may make you a fraud accomplice, even if you did not personally keep the money.",
      content_zh:
        "切勿販售、出借或替他人開設銀行帳戶。將帳戶、提款卡、密碼、網路銀行權限、護照、ARC 或 SIM 卡交給他人，即使自己沒有拿走款項，也可能成為詐騙共犯。",
    },
    {
      type: "table",
      columns: [
        { key: "risk", label_en: "Risk", label_zh: "風險" },
        { key: "meaning", label_en: "What it means for you", label_zh: "可能造成的後果" },
      ],
      rows: [
        {
          risk: { en: "Dummy account", zh: "人頭帳戶" },
          meaning: {
            en: "Fraud groups may use an account in your name to receive or withdraw money from victims.",
            zh: "詐騙集團可能利用以你名義持有的帳戶收取或提領被害人款項。",
          },
        },
        {
          risk: { en: "Frozen or restricted accounts", zh: "帳戶遭凍結或限制" },
          meaning: {
            en: "Once your account is reported or flagged, accessing your own funds or obtaining financial services may become difficult.",
            zh: "帳戶一旦遭通報或列為警示，領取自己的款項或申辦金融服務都可能變得困難。",
          },
        },
        {
          risk: { en: "Criminal responsibility", zh: "刑事責任" },
          meaning: {
            en: "Selling an account or helping withdraw or deliver money may lead to investigation, prosecution, imprisonment, repayment claims, or immigration consequences.",
            zh: "販售帳戶、協助提款或交付款項，可能導致偵查、起訴、監禁、賠償責任或居留影響。",
          },
        },
        {
          risk: { en: "Future in Taiwan", zh: "在臺未來發展" },
          meaning: {
            en: "A fraud-related case may affect study, work, visa, ARC, or future plans in Taiwan.",
            zh: "涉及詐騙案件可能影響就學、工作、簽證、ARC 或未來在臺規劃。",
          },
        },
      ],
    },
    {
      type: "paragraph",
      content_en:
        "What is a money mule? A money mule is a person who helps fraudsters withdraw money, collect cash from victims, or pass money onward. The quick guide warns that handing the money over to someone else does not remove your legal risk.",
      content_zh:
        "什麼是車手（Money Mule）？車手是協助詐騙者提領款項、向被害人收取現金，或將款項轉交出去的人。懶人包提醒，即使最後將錢交給別人，也不代表沒有法律風險。",
    },
    {
      type: "checklist",
      items: [
        {
          en: "Never lend or sell your bank account, ATM card, PIN, SIM card, passport, ARC, or online banking information.",
          zh: "絕不要出借或販售銀行帳戶、提款卡、密碼、SIM 卡、護照、ARC 或網路銀行資料。",
        },
        {
          en: "Refuse anyone who asks you to open an account, receive money, transfer money, or withdraw cash in exchange for quick money or an easy job.",
          zh: "若有人以快速賺錢或輕鬆工作為由，要求你開戶、收款、轉帳或提款，請直接拒絕。",
        },
        {
          en: "If you notice unusual transactions, contact your bank and the police immediately, and ask OIA or trusted campus staff for help.",
          zh: "若發現帳戶有異常交易，請立即聯絡銀行與警方，並向國際處或可信任的校內人員求助。",
        },
        {
          en: "Be cautious of overseas job offers promising high pay, free travel, or easy work; scammers may take away your phone or passport and force you to participate in fraud.",
          zh: "對宣稱高薪、免費機票或輕鬆工作的海外工作機會保持警覺；詐騙者可能扣留你的手機或護照，並強迫你參與詐騙。",
        },
      ],
    },
    {
      type: "table",
      columns: [
        { key: "case", label_en: "Case reminder in the guide", label_zh: "懶人包案例提醒" },
        { key: "lesson", label_en: "Lesson", label_zh: "重點" },
      ],
      rows: [
        {
          case: { en: "Selling or lending an account before leaving Taiwan", zh: "離臺前販售或出借帳戶" },
          lesson: {
            en: "Leaving Taiwan does not erase responsibility; an account owner may still be investigated or stopped when departing.",
            zh: "離開臺灣並不會消除責任；帳戶持有人仍可能遭調查，甚至於出境時被查獲。",
          },
        },
        {
          case: { en: "Accepting a quick-money cash withdrawal job", zh: "接受快速賺錢的提款工作" },
          lesson: {
            en: "Withdrawing or delivering cash for others may involve fraud victims' money and cause serious legal and financial consequences.",
            zh: "替他人提款或交付款項，可能涉及被害人遭詐款項，並造成嚴重法律與金錢後果。",
          },
        },
        {
          case: { en: "Being recruited through an overseas job advertisement", zh: "遭海外工作廣告招募" },
          lesson: {
            en: "Verify job offers before travelling and do not surrender personal documents or communication devices to strangers.",
            zh: "出國工作前務必查證機會真實性，不要將證件或通訊設備交給陌生人。",
          },
        },
      ],
    },
    {
      type: "links",
      links: [
        {
          url: "/student-guide-assets/degree/anti-fraud-quick-guide-pages-35-44.png",
          label_en: "View Illustrated Anti-Fraud Cards from the Quick Guide",
          label_zh: "查看懶人包防詐圖卡整理",
        },
      ],
    },
  ],
  degree_oia_services: [
    {
      type: "note",
      tone: "warning",
      content_en:
        "Important: If your phone number, address, or email changes, inform the Office of International Affairs as soon as possible so the university can contact you in time.",
      content_zh:
        "重要提醒：若你的電話號碼、地址或電子郵件有任何變更，請儘速通知國際事務處，以便學校能及時聯繫你。",
    },
    {
      type: "contact",
      name_en: "Personal Information Update - Office of International Affairs",
      name_zh: "個人資料更新 - 國際事務處",
      email: "ccuoiais@ccu.edu.tw",
    },
    {
      type: "checklist",
      items: [
        { en: "The OIA website provides detailed guides, useful resources, and latest news for international students.", zh: "國際處網站提供國際學生所需的詳細指南、實用資源與最新消息。" },
        { en: "Information includes admissions procedures and documents, housing, scholarships, campus life, and frequently asked questions.", zh: "網站資訊包含申請流程與文件、住宿、獎學金、校園生活及常見問題。" },
        { en: "Check the latest news regularly and follow the official OIA Facebook page for timely updates.", zh: "請定期查看最新消息，並追蹤國際處官方 Facebook 以取得即時更新。" },
      ],
    },
  ],
  degree_chinese_language: [
    {
      type: "paragraph",
      content_en:
        "The CCU Chinese Language Center provides Chinese language instruction using multimedia activities and learning games to develop language ability and understanding of local culture.",
      content_zh:
        "中正大學華語中心透過多媒體活動與學習遊戲提供華語教學，協助學生培養語言能力並了解在地文化。",
    },
    {
      type: "links",
      links: [
        {
          url: "https://docs.google.com/document/d/1lDky-L_R6xyISnlPd7Ii_iU5DTEYm3SSn19hhaVw9eI/edit?usp=sharing",
          label_en: "Open Chinese Course and Language Center Information",
          label_zh: "開啟華語課程與華語中心補充資訊",
        },
      ],
    },
  ],
  exchange_highlights: [
    {
      type: "note",
      tone: "info",
      content_en:
        "Information in this handbook may be updated with timely notice. Exchange and visiting students should review updates carefully so they do not miss procedures that affect arrival, registration, course selection, or departure.",
      content_zh:
        "本手冊資訊可能依公告適時更新。交換生與訪問學生應仔細確認最新資訊，以免遺漏影響抵達、報到、選課或離校的程序。",
    },
    {
      type: "table",
      columns: [
        { key: "item", label_en: "OIA Contact Item", label_zh: "國際處聯絡資訊" },
        { key: "detail", label_en: "Detail", label_zh: "內容" },
      ],
      rows: [
        { item: { en: "Contact", zh: "聯絡人" }, detail: { en: "Project Assistant Evelyn NGUYEN (Ms.)", zh: "Project Assistant Evelyn NGUYEN 女士" } },
        { item: { en: "Office hours", zh: "辦公時間" }, detail: { en: "Monday-Friday, 08:30-12:00 / 13:30-17:00", zh: "週一至週五，08:30-12:00 / 13:30-17:00" } },
      ],
    },
  ],
  exchange_calendar: [
    {
      type: "note",
      tone: "warning",
      content_en: "During the Spring Holidays from Feb. 14 to Feb. 20, 2026, the university will be closed throughout the holiday period.",
      content_zh: "2026 年 2 月 14 日至 2 月 20 日春節假期期間，學校全程關閉。",
    },
  ],
  exchange_arc: [
    {
      type: "note",
      tone: "warning",
      content_en:
        "Students staying in Taiwan for more than six months should also plan for National Health Insurance after becoming eligible.",
      content_zh:
        "在臺停留超過六個月的學生，除申請 ARC 外，也應提前規劃符合資格後加入全民健康保險。",
    },
    {
      type: "table",
      columns: [
        { key: "item", label_en: "National Health Insurance reminder", label_zh: "全民健保提醒" },
        { key: "detail", label_en: "Detail from the handbook", label_zh: "手冊說明" },
      ],
      rows: [
        {
          item: { en: "Eligibility timing", zh: "加入時間" },
          detail: { en: "Mandatory after six months of residence with an ARC; payment begins from the seventh month of stay.", zh: "持 ARC 居留滿六個月後須加入；自居留第七個月起開始繳費。" },
        },
        {
          item: { en: "Estimated monthly cost", zh: "每月約略費用" },
          detail: { en: "About NTD 826 per month, according to the Spring 2026 exchange handbook.", zh: "依 2026 春季交換生手冊，約為每月 NTD 826。" },
        },
        {
          item: { en: "Travel during the first six months", zh: "前六個月離臺提醒" },
          detail: { en: "During the first six months, leaving Taiwan more than once or for more than one month may affect NHI eligibility.", zh: "前六個月內，若離臺超過一次或單次離臺超過一個月，可能影響健保加入資格。" },
        },
      ],
    },
  ],
  exchange_fees_expenses: [
    {
      type: "table",
      columns: [
        { key: "item", label_en: "Additional off-campus housing item", label_zh: "校外住宿補充項目" },
        { key: "estimate", label_en: "Estimate / Payment Rule", label_zh: "預估費用／繳納方式" },
      ],
      rows: [
        { item: { en: "Off-campus internet fee", zh: "校外住宿網路費" }, estimate: { en: "Around US$50 per semester", zh: "約每學期 US$50" } },
        { item: { en: "Off-campus electricity fee", zh: "校外住宿電費" }, estimate: { en: "Paid by students every two months", zh: "由學生每兩個月繳交一次" } },
      ],
    },
    {
      type: "links",
      links: [
        { url: "http://www.gladsea.com.tw/", label_en: "View Off-Campus Dormitory Photos Mentioned in the Handbook", label_zh: "查看手冊所列校外住宿照片網站" },
      ],
    },
  ],
  exchange_check_in_leaving: [
    {
      type: "note",
      tone: "info",
      content_en:
        "The original appendix forms are provided below as reference images. Students should obtain and submit the official current form issued by OIA when completing check-in or school-leaving procedures.",
      content_zh:
        "下方提供原手冊附錄表單圖片作為參考。實際辦理報到或離校程序時，仍請使用國際處提供之最新正式表單。",
    },
    {
      type: "links",
      links: [
        { url: "/student-guide-assets/exchange/appendix-1-registration-sheet-p15.png", label_en: "View Appendix 1: Registration Sheet", label_zh: "查看附錄一：報到程序單" },
        { url: "/student-guide-assets/exchange/appendix-2-school-leaving-p16.png", label_en: "View Appendix 2: School Leaving Procedure Sheet", label_zh: "查看附錄二：離校程序單" },
      ],
    },
  ],
  exchange_oia_location: [
    {
      type: "note",
      tone: "info",
      content_en:
        "Use the campus map to locate the Office of International Affairs, the CCU Supermarket, dormitories, the Administration Building, the Library, and other key arrival destinations.",
      content_zh:
        "可利用校園地圖確認國際事務處、中正大學超市、宿舍、行政大樓、圖書館與其他初抵臺常用地點的位置。",
    },
    {
      type: "links",
      links: [
        { url: "/student-guide-assets/exchange/ccu-campus-map-p18.png", label_en: "View CCU Campus Map", label_zh: "查看中正大學校園地圖" },
        { url: "/student-guide-assets/exchange/oia-location-map-p19.png", label_en: "View OIA Location Guide", label_zh: "查看國際處位置指引圖" },
      ],
    },
  ],
};

// ─── Block deduplication helpers ─────────────────────────────────────────────

/**
 * Returns a stable string key for a HandbookBlock used to detect duplicates.
 * Blocks with the same key are considered identical and the second occurrence is dropped.
 */
function blockDedupeKey(block: HandbookBlock): string {
  switch (block.type) {
    case "contact":
      return `contact:${block.name_zh || block.name_en}:${block.phone ?? block.email ?? block.location_zh ?? block.location_en ?? ""}`;
    case "links":
      return `links:${[...block.links].map((l) => l.url).sort().join("|")}`;
    case "note":
      return `note:${block.tone ?? ""}:${block.content_zh || block.content_en}`;
    case "paragraph":
      return `paragraph:${block.content_zh || block.content_en}`;
    case "table":
      return `table:${block.columns.map((c) => c.key).join(",")}:${JSON.stringify(block.rows).slice(0, 300)}`;
    case "checklist":
      return `checklist:${block.items.map((i) => (i.zh || i.en).toLowerCase().trim()).join("|").slice(0, 500)}`;
    case "timeline":
      return `timeline:${block.items.map((i) => `${i.date}:${(i.event_zh || i.event_en).toLowerCase().trim()}`).join("|").slice(0, 500)}`;
    default:
      return JSON.stringify(block).slice(0, 200);
  }
}

function normalizeBlockDedupeText(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function checklistItemDedupeKey(item: { en: string; zh: string }) {
  return `${normalizeBlockDedupeText(item.en)}|${normalizeBlockDedupeText(item.zh)}`;
}

function timelineItemDedupeKey(item: { date: string; event_en: string; event_zh: string }) {
  return `${normalizeBlockDedupeText(item.date)}|${normalizeBlockDedupeText(item.event_en)}|${normalizeBlockDedupeText(item.event_zh)}`;
}

function linkDedupeKey(url: string) {
  return url.trim().replace(/\/$/, "");
}

/**
 * Merges multiple block arrays into one, deduplicating by blockDedupeKey.
 * Also deduplicates checklist items, timeline items, and links across all merged blocks.
 * First occurrence wins so static guide ordering remains stable.
 */
function mergeGuideBlocksWithDedupe(...blockGroups: HandbookBlock[][]): HandbookBlock[] {
  const seen = new Set<string>();
  const seenChecklistItems = new Set<string>();
  const seenTimelineItems = new Set<string>();
  const seenLinks = new Set<string>();
  const result: HandbookBlock[] = [];

  for (const group of blockGroups) {
    for (const block of group) {
      let processed: HandbookBlock = block;

      if (block.type === "checklist") {
        const dedupedItems = block.items.filter((item) => {
          const key = checklistItemDedupeKey(item);
          if (seenChecklistItems.has(key)) return false;
          seenChecklistItems.add(key);
          return true;
        });
        if (dedupedItems.length === 0) continue;
        processed = { ...block, items: dedupedItems };
      } else if (block.type === "timeline") {
        const dedupedItems = block.items.filter((item) => {
          const key = timelineItemDedupeKey(item);
          if (seenTimelineItems.has(key)) return false;
          seenTimelineItems.add(key);
          return true;
        });
        if (dedupedItems.length === 0) continue;
        processed = { ...block, items: dedupedItems };
      } else if (block.type === "links") {
        const dedupedLinks = block.links.filter((link) => {
          const key = linkDedupeKey(link.url);
          if (seenLinks.has(key)) return false;
          seenLinks.add(key);
          return true;
        });
        if (dedupedLinks.length === 0) continue;
        processed = { ...block, links: dedupedLinks };
      } else if (block.type === "contact" && block.links) {
        const dedupedLinks = block.links.filter((link) => {
          const key = linkDedupeKey(link.url);
          if (seenLinks.has(key)) return false;
          seenLinks.add(key);
          return true;
        });
        processed = { ...block, links: dedupedLinks.length > 0 ? dedupedLinks : undefined };
      }

      const key = blockDedupeKey(processed);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(processed);
      }
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────

function applyStudentGuideSupplements(guides: StudentGuide[]): StudentGuide[] {
  return guides.map((guide) => ({
    ...guide,
    sections: guide.sections.map((section) => ({
      ...section,
      blocks: mergeGuideBlocksWithDedupe(
        section.blocks,
        studentGuideBlockSupplements[section.id] ?? [],
        studentGuidePdfDetailSupplements[section.id] ?? [],
        studentGuideFinalPdfCorrections[section.id] ?? [],
        studentGuideCoverageGapAdditions[section.id] ?? [],
      ),
    })),
  }));
}

export const studentGuides: StudentGuide[] = applyStudentGuideSupplements(baseStudentGuides);

export function getStudentGuideById(id: string | undefined) {
  return studentGuides.find((guide) => guide.id === id);
}

export function getCategoryName(guide: StudentGuide, categoryId: StudentGuideCategoryId) {
  return guide.filters.find((category) => category.id === categoryId);
}
