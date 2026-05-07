import {
  serviceCategories,
  offices,
  departments,
  tasks,
  type Office,
  type Department,
  type Task,
} from "./campusData.js";

export type McpLanguage = "auto" | "en" | "zh-TW";

export interface RankedResult<T> {
  item: T;
  score: number;
  confidence: number;
  matched_by: string[];
}

export interface SearchCampusServicesPayload {
  query: string;
  language: McpLanguage;
  intent: SearchIntent;
  summary: string;
  offices: OfficePayload[];
  departments: DepartmentPayload[];
  tasks: TaskPayload[];
}

type SearchIntent =
  | "contact_lookup"
  | "location_lookup"
  | "task_or_procedure"
  | "unit_lookup"
  | "general_search";

type SearchableUnit = Office | Department;

type OfficePayload = ReturnType<typeof formatOfficeResult>;
type DepartmentPayload = ReturnType<typeof formatDepartmentResult>;
type TaskPayload = ReturnType<typeof formatTaskResult>;

interface AliasRule<T> {
  isMatch: (item: T) => boolean;
  terms: string[];
}

const OFFICE_ALIAS_RULES: Array<AliasRule<Office>> = [
  {
    isMatch: (office) => office.id === "oia" || /international affairs/i.test(office.name_en),
    terms: [
      "oia",
      "international office",
      "international affairs",
      "office of international affairs",
      "visa",
      "arc",
      "work permit",
      "scholarship",
      "international student",
    ],
  },
  {
    isMatch: (office) => office.id === "oaa" || /academic affairs/i.test(office.name_en),
    terms: [
      "oaa",
      "academic affairs",
      "office of academic affairs",
      "registration",
      "student id",
      "course selection",
      "transcript",
      "grades",
    ],
  },
  {
    isMatch: (office) => office.id === "osa" || /student affairs/i.test(office.name_en),
    terms: [
      "osa",
      "student affairs",
      "office of student affairs",
      "student life",
      "student support",
    ],
  },
  {
    isMatch: (office) => office.id === "osa_life" || /life/i.test(office.name_en),
    terms: [
      "student life",
      "life affairs",
      "dorm",
      "dormitory",
      "housing",
      "insurance",
      "lost and found",
      "student insurance",
      "dorm payment",
    ],
  },
  {
    isMatch: (office) => /health|clinic|medical/i.test([office.id, office.name_en, office.service_scope_en].join(" ")),
    terms: ["health center", "clinic", "medical", "doctor", "nhi", "health insurance", "insurance"],
  },
  {
    isMatch: (office) => /library/i.test([office.id, office.name_en].join(" ")),
    terms: ["library", "book", "database", "study room", "printing"],
  },
  {
    isMatch: (office) => /language/i.test([office.id, office.name_en, office.service_scope_en].join(" ")),
    terms: ["language center", "language", "mandarin", "chinese language", "english learning", "language course"],
  },
];

const DEPARTMENT_ALIAS_RULES: Array<AliasRule<Department>> = [
  {
    isMatch: (department) => /management/i.test([department.id, department.name_en, department.college_en].join(" ")),
    terms: ["college of management", "management building", "business", "mis", "ba"],
  },
  {
    isMatch: (department) => /computer|information|mis|cs/i.test([department.id, department.name_en].join(" ")),
    terms: ["computer science", "information management", "mis", "cs", "computer"],
  },
];

const TASK_HINT_RULES: Array<AliasRule<Task>> = [
  {
    isMatch: (task) => textBagForTask(task).includes("student id") || task.category_id === "student_id",
    terms: ["lost student id", "student id replacement", "replace student card", "student card lost", "student id"],
  },
  {
    isMatch: (task) => textBagForTask(task).includes("course") || task.category_id === "course_issues",
    terms: ["course selection", "course registration", "add drop", "add course", "drop course", "course"],
  },
  {
    isMatch: (task) => textBagForTask(task).includes("dorm") || task.category_id === "dormitory",
    terms: ["dorm", "dormitory", "housing", "dorm payment", "dorm fee"],
  },
  {
    isMatch: (task) => textBagForTask(task).includes("insurance") || task.category_id === "health",
    terms: ["health insurance", "nhi", "insurance", "medical insurance"],
  },
  {
    isMatch: (task) => textBagForTask(task).includes("transcript") || task.category_id === "academic_affairs",
    terms: ["transcript", "grade report", "grades", "academic records"],
  },
];

const CONTACT_TERMS = ["phone", "extension", "ext", "email", "contact", "office hours", "website"];
const LOCATION_TERMS = ["where", "location", "building", "floor", "room", "map", "navigate"];
const PROCEDURE_TERMS = [
  "how",
  "apply",
  "replace",
  "lost",
  "need",
  "document",
  "step",
  "procedure",
  "process",
  "selection",
  "payment",
  "insurance",
  "registration",
  "transcript",
  "student id",
  "dorm",
  "course",
  "visa",
  "arc",
];
const UNIT_TERMS = ["office", "department", "center", "division", "academic affairs", "student affairs", "international affairs", "oia", "oaa", "osa"];

export function normalizeQuery(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[()\[\]{}]/g, " ")
    .replace(/[_\-–—/.,:;|+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasCjk(value: string): boolean {
  return /[\u3400-\u9fff]/.test(value);
}

function tokenize(value: string): string[] {
  const normalized = normalizeQuery(value);
  if (!normalized) return [];

  if (hasCjk(normalized) && !normalized.includes(" ")) {
    return [normalized];
  }

  return normalized
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function confidenceFromScore(score: number): number {
  return Math.min(0.99, Math.max(0, Math.round(score) / 100));
}

function includesAny(query: string, terms: string[]): boolean {
  const normalizedQuery = normalizeQuery(query);
  return terms.some((term) => normalizedQuery.includes(normalizeQuery(term)));
}

function getAliasTerms<T>(item: T, rules: Array<AliasRule<T>>): string[] {
  const terms: string[] = [];
  for (const rule of rules) {
    if (rule.isMatch(item)) {
      terms.push(...rule.terms);
    }
  }
  return unique(terms);
}

function getCategoryText(categoryIds: string[]): string[] {
  return serviceCategories
    .filter((category) => categoryIds.includes(category.id))
    .flatMap((category) => [
      category.id,
      category.name_en,
      category.name_zh,
      category.description_en,
      category.description_zh,
      ...category.keywords,
    ]);
}

function scoreTextFields(
  query: string,
  fields: string[],
  scores: {
    exact: number;
    includes: number;
    token: number;
  }
): { score: number; matched_by: string[] } {
  const normalizedQuery = normalizeQuery(query);
  const queryTokens = tokenize(normalizedQuery);
  let bestScore = 0;
  const matchedBy: string[] = [];

  for (const rawField of fields) {
    const normalizedField = normalizeQuery(rawField);
    if (!normalizedField) continue;

    if (normalizedField === normalizedQuery) {
      bestScore = Math.max(bestScore, scores.exact);
      matchedBy.push(`exact:${rawField}`);
      continue;
    }

    if (normalizedField.includes(normalizedQuery) || normalizedQuery.includes(normalizedField)) {
      bestScore = Math.max(bestScore, scores.includes);
      matchedBy.push(`includes:${rawField}`);
      continue;
    }

    if (queryTokens.length > 0) {
      const fieldTokens = tokenize(normalizedField);
      const matchedTokens = queryTokens.filter((token) =>
        fieldTokens.some((fieldToken) => fieldToken === token || fieldToken.includes(token) || token.includes(fieldToken))
      );

      if (matchedTokens.length > 0) {
        const ratio = matchedTokens.length / queryTokens.length;
        const tokenScore = Math.round(scores.token * ratio);
        bestScore = Math.max(bestScore, tokenScore);
        matchedBy.push(`token:${matchedTokens.join(",")}`);
      }
    }
  }

  return {
    score: bestScore,
    matched_by: unique(matchedBy),
  };
}

function textBagForTask(task: Task): string {
  return normalizeQuery([
    task.id,
    task.task_name_en,
    task.task_name_zh,
    task.scenario_en,
    task.scenario_zh,
    task.category_id,
    ...task.required_documents_en,
    ...task.required_documents_zh,
    ...task.steps.flatMap((step) => [step.en, step.zh]),
  ].join(" "));
}

function rankOffice(office: Office, query: string): RankedResult<Office> {
  const primaryFields = [
    office.id,
    office.name_en,
    office.name_zh,
    office.building_name_en,
    office.building_name_zh,
    office.floor,
    office.room_en ?? "",
    office.room_zh ?? "",
    ...getAliasTerms(office, OFFICE_ALIAS_RULES),
  ];

  const detailFields = [
    office.function_desc_en,
    office.function_desc_zh,
    office.service_scope_en,
    office.service_scope_zh,
    office.common_scenarios_en,
    office.common_scenarios_zh,
    office.phone,
    office.email,
    office.official_url,
    ...getCategoryText(office.service_categories),
  ];

  const primary = scoreTextFields(query, primaryFields, { exact: 100, includes: 85, token: 65 });
  const detail = scoreTextFields(query, detailFields, { exact: 70, includes: 55, token: 35 });
  const score = Math.max(primary.score, detail.score);

  return {
    item: office,
    score,
    confidence: confidenceFromScore(score),
    matched_by: unique([...primary.matched_by, ...detail.matched_by]),
  };
}

function rankDepartment(department: Department, query: string): RankedResult<Department> {
  const primaryFields = [
    department.id,
    department.name_en,
    department.name_zh,
    department.college_en,
    department.college_zh,
    department.building_name_en,
    department.building_name_zh,
    department.floor,
    department.room_en ?? "",
    department.room_zh ?? "",
    ...getAliasTerms(department, DEPARTMENT_ALIAS_RULES),
  ];

  const detailFields = [
    department.function_desc_en,
    department.function_desc_zh,
    department.service_scope_en,
    department.service_scope_zh,
    department.official_url,
    ...getCategoryText(department.service_categories),
  ];

  const primary = scoreTextFields(query, primaryFields, { exact: 100, includes: 82, token: 60 });
  const detail = scoreTextFields(query, detailFields, { exact: 65, includes: 50, token: 32 });
  const score = Math.max(primary.score, detail.score);

  return {
    item: department,
    score,
    confidence: confidenceFromScore(score),
    matched_by: unique([...primary.matched_by, ...detail.matched_by]),
  };
}

function rankTask(task: Task, query: string): RankedResult<Task> {
  const categoryText = getCategoryText([task.category_id]);
  const aliasTerms = getAliasTerms(task, TASK_HINT_RULES);
  const primaryFields = [
    task.id,
    task.task_name_en,
    task.task_name_zh,
    task.scenario_en,
    task.scenario_zh,
    task.category_id,
    ...aliasTerms,
    ...categoryText,
  ];

  const detailFields = [
    ...task.required_documents_en,
    ...task.required_documents_zh,
    ...task.steps.flatMap((step) => [step.en, step.zh]),
  ];

  const primary = scoreTextFields(query, primaryFields, { exact: 100, includes: 88, token: 70 });
  const detail = scoreTextFields(query, detailFields, { exact: 70, includes: 55, token: 35 });
  let score = Math.max(primary.score, detail.score);

  if (inferIntent(query) === "task_or_procedure" && score > 0) {
    score += 10;
  }

  return {
    item: task,
    score,
    confidence: confidenceFromScore(score),
    matched_by: unique([...primary.matched_by, ...detail.matched_by]),
  };
}

function inferIntent(query: string): SearchIntent {
  if (includesAny(query, CONTACT_TERMS)) return "contact_lookup";
  if (includesAny(query, LOCATION_TERMS)) return "location_lookup";
  if (includesAny(query, PROCEDURE_TERMS)) return "task_or_procedure";
  if (includesAny(query, UNIT_TERMS)) return "unit_lookup";

  const q = normalizeQuery(query);
  if (/[\u8655\u7d44\u4e2d\u5fc3\u7cfb\u6240\u9662]/.test(q)) return "unit_lookup";
  if (/[\u7533\u8acb\u88dc\u8fa6\u907a\u5931\u6d41\u7a0b\u6587\u4ef6\u9078\u8ab2\u7e73\u8cbb\u5bbf\u820d\u5065\u4fdd]/.test(q)) return "task_or_procedure";
  if (/[\u54ea\u88e1\u4f4d\u7f6e\u5730\u9ede\u6a13\u623f\u9593]/.test(q)) return "location_lookup";
  if (/[\u96fb\u8a71\u5206\u6a5f\u4fe1\u7bb1\u806f\u7d61]/.test(q)) return "contact_lookup";

  return "general_search";
}

function sortAndFilter<T>(results: RankedResult<T>[], limit: number, threshold: number): RankedResult<T>[] {
  return results
    .filter((result) => result.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function searchCampusServices(query: string, language: McpLanguage = "auto"): SearchCampusServicesPayload {
  const intent = inferIntent(query);
  const officeLimit = intent === "unit_lookup" || intent === "contact_lookup" || intent === "location_lookup" ? 3 : 2;
  const departmentLimit = intent === "unit_lookup" || intent === "location_lookup" ? 3 : 1;
  const taskLimit = intent === "task_or_procedure" ? 5 : 3;

  const rankedOffices = sortAndFilter(offices.map((office) => rankOffice(office, query)), officeLimit, 35);
  const rankedDepartments = sortAndFilter(departments.map((department) => rankDepartment(department, query)), departmentLimit, 35);
  const rankedTasks = sortAndFilter(tasks.map((task) => rankTask(task, query)), taskLimit, 30);

  const total = rankedOffices.length + rankedDepartments.length + rankedTasks.length;

  return {
    query,
    language,
    intent,
    summary:
      total > 0
        ? `Found ${total} ranked result(s). Use the highest confidence results first and avoid listing unrelated items.`
        : "No confident result found. Ask for a more specific office, task, location, or keyword.",
    offices: rankedOffices.map((result) => formatOfficeResult(result, language)),
    departments: rankedDepartments.map((result) => formatDepartmentResult(result, language)),
    tasks: rankedTasks.map((result) => formatTaskResult(result, language)),
  };
}

export function resolveOffice(query: string): RankedResult<Office> | null {
  const result = sortAndFilter(offices.map((office) => rankOffice(office, query)), 1, 35)[0];
  return result ?? null;
}

export function resolveDepartment(query: string): RankedResult<Department> | null {
  const result = sortAndFilter(departments.map((department) => rankDepartment(department, query)), 1, 35)[0];
  return result ?? null;
}

export function resolveTask(query: string): RankedResult<Task> | null {
  const result = sortAndFilter(tasks.map((task) => rankTask(task, query)), 1, 30)[0];
  return result ?? null;
}

function formatLocation(unit: SearchableUnit) {
  return {
    building_en: unit.building_name_en,
    building_zh: unit.building_name_zh,
    floor: unit.floor,
    room_en: unit.room_en ?? "",
    room_zh: unit.room_zh ?? "",
    indoor_note_en: unit.indoor_location_note_en,
    indoor_note_zh: unit.indoor_location_note_zh,
    google_maps_query: unit.google_maps_query,
    latitude: unit.latitude,
    longitude: unit.longitude,
  };
}

export function formatOfficeResult(result: RankedResult<Office>, language: McpLanguage = "auto") {
  const office = result.item;
  return {
    type: "office",
    id: office.id,
    confidence: result.confidence,
    score: result.score,
    matched_by: result.matched_by,
    name_en: office.name_en,
    name_zh: office.name_zh,
    location: formatLocation(office),
    contact: {
      office_hours: office.office_hours,
      phone: office.phone,
      email: office.email,
      official_url: office.official_url,
    },
    services_en: office.service_scope_en,
    services_zh: office.service_scope_zh,
    common_scenarios_en: office.common_scenarios_en,
    common_scenarios_zh: office.common_scenarios_zh,
    needs_manual_review: office.needs_manual_review,
    suggested_answer_language: language,
  };
}

export function formatDepartmentResult(result: RankedResult<Department>, language: McpLanguage = "auto") {
  const department = result.item;
  return {
    type: "department",
    id: department.id,
    confidence: result.confidence,
    score: result.score,
    matched_by: result.matched_by,
    name_en: department.name_en,
    name_zh: department.name_zh,
    college_en: department.college_en,
    college_zh: department.college_zh,
    location: formatLocation(department),
    services_en: department.service_scope_en,
    services_zh: department.service_scope_zh,
    official_url: department.official_url,
    needs_manual_review: department.needs_manual_review,
    suggested_answer_language: language,
  };
}

export function formatTaskResult(result: RankedResult<Task>, language: McpLanguage = "auto") {
  const task = result.item;
  const relatedOffice = task.target_unit_type === "office" ? offices.find((office) => office.id === task.target_unit_id) : undefined;
  const relatedDepartment = task.target_unit_type === "department" ? departments.find((department) => department.id === task.target_unit_id) : undefined;

  return {
    type: "task",
    id: task.id,
    confidence: result.confidence,
    score: result.score,
    matched_by: result.matched_by,
    task_name_en: task.task_name_en,
    task_name_zh: task.task_name_zh,
    scenario_en: task.scenario_en,
    scenario_zh: task.scenario_zh,
    required_documents_en: task.required_documents_en,
    required_documents_zh: task.required_documents_zh,
    steps: task.steps.map((step, index) => ({
      order: index + 1,
      en: step.en,
      zh: step.zh,
    })),
    responsible_unit: relatedOffice
      ? {
          type: "office",
          id: relatedOffice.id,
          name_en: relatedOffice.name_en,
          name_zh: relatedOffice.name_zh,
          location: formatLocation(relatedOffice),
          phone: relatedOffice.phone,
          email: relatedOffice.email,
          official_url: relatedOffice.official_url,
        }
      : relatedDepartment
        ? {
            type: "department",
            id: relatedDepartment.id,
            name_en: relatedDepartment.name_en,
            name_zh: relatedDepartment.name_zh,
            location: formatLocation(relatedDepartment),
            official_url: relatedDepartment.official_url,
          }
        : {
            type: task.target_unit_type,
            id: task.target_unit_id,
          },
    suggested_answer_language: language,
  };
}

export function makeNotFoundPayload(query: string, type: "office" | "department" | "task") {
  return {
    status: "not_found",
    type,
    query,
    message: "No confident exact match found. Use search_campus_service or ask for a more specific keyword.",
    candidates: searchCampusServices(query, "auto"),
  };
}
