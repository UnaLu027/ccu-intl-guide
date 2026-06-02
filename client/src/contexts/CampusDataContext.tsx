import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  departments as staticDepartments,
  offices as staticOffices,
  serviceCategories as staticServiceCategories,
  tasks as staticTasks,
  type Department,
  type Office,
  type ServiceCategory,
  type Task,
} from "@/data/campusData";

interface CampusDataPayload {
  serviceCategories: ServiceCategory[];
  offices: Office[];
  departments: Department[];
  tasks: Task[];
}

interface CampusDataContextValue extends CampusDataPayload {
  loading: boolean;
  source: "database" | "static";
  searchByNeed: (query: string) => { offices: Office[]; departments: Department[]; tasks: Task[] };
  filterByCategory: (categoryId: string) => { offices: Office[]; departments: Department[]; tasks: Task[] };
  getColleges: () => { zh: string; en: string }[];
}

const staticData: CampusDataPayload = {
  serviceCategories: staticServiceCategories,
  offices: staticOffices,
  departments: staticDepartments,
  tasks: staticTasks,
};

const CampusDataContext = createContext<CampusDataContextValue | null>(null);

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[_\-.,:;|()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsQuery(fields: unknown[], query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return normalizeSearchText(
    fields
      .flatMap((field) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        return [field];
      })
      .map((field) => typeof field === "object" ? JSON.stringify(field) : String(field))
      .join(" ")
  ).includes(normalizedQuery);
}

function makeContextValue(data: CampusDataPayload, loading: boolean, source: "database" | "static"): CampusDataContextValue {
  const searchByNeed = (query: string) => {
    const normalizedQuery = normalizeSearchText(query);

    const tasks = normalizedQuery
      ? data.tasks
          .filter((task) =>
            containsQuery([
              task.id,
              task.task_name_zh,
              task.task_name_en,
              task.scenario_zh,
              task.scenario_en,
              task.category_id,
              task.target_unit_id,
              task.required_documents_zh,
              task.required_documents_en,
              task.steps,
            ], query)
          )
          .map((task) => {
            let score = 0;
            if (containsQuery([task.task_name_zh, task.task_name_en], query)) score += 8;
            if (containsQuery([task.scenario_zh, task.scenario_en], query)) score += 4;
            if (containsQuery([task.required_documents_zh, task.required_documents_en], query)) score += 2;
            if (containsQuery([task.steps], query)) score += 1;
            return { task, score };
          })
          .sort((a, b) => b.score !== a.score ? b.score - a.score : a.task.task_name_zh.localeCompare(b.task.task_name_zh))
          .map(({ task }) => task)
      : [];

    return {
      tasks,
      offices: data.offices
        .filter((office) =>
          containsQuery([
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
          ], query)
        )
        .slice(0, 10),
      departments: data.departments
        .filter((department) =>
          containsQuery([
            department.id,
            department.name_zh,
            department.name_en,
            department.college_zh,
            department.college_en,
            department.function_desc_zh,
            department.function_desc_en,
            department.service_scope_zh,
            department.service_scope_en,
            department.building_name_zh,
            department.building_name_en,
            department.floor,
            department.room_zh,
            department.room_en,
            department.service_categories,
          ], query)
        )
        .slice(0, 10),
    };
  };

  const filterByCategory = (categoryId: string) => ({
    offices: data.offices.filter((office) => office.service_categories.includes(categoryId)),
    departments: data.departments.filter((department) => department.service_categories.includes(categoryId)),
    tasks: data.tasks.filter((task) => task.category_id === categoryId),
  });

  const getColleges = () => {
    const seen = new Map<string, { zh: string; en: string }>();
    data.departments.forEach((department) => {
      if (!seen.has(department.college_en)) {
        seen.set(department.college_en, { zh: department.college_zh, en: department.college_en });
      }
    });
    return Array.from(seen.values());
  };

  return { ...data, loading, source, searchByNeed, filterByCategory, getColleges };
}

export function CampusDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CampusDataPayload>(staticData);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"database" | "static">("static");

  useEffect(() => {
    let active = true;

    fetch("/api/content-data")
      .then((response) => {
        if (!response.ok) throw new Error("content data request failed");
        return response.json() as Promise<CampusDataPayload>;
      })
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setSource("database");
      })
      .catch(() => {
        if (!active) return;
        setData(staticData);
        setSource("static");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => makeContextValue(data, loading, source), [data, loading, source]);

  return <CampusDataContext.Provider value={value}>{children}</CampusDataContext.Provider>;
}

export function useCampusData() {
  const value = useContext(CampusDataContext);
  if (!value) {
    return makeContextValue(staticData, false, "static");
  }
  return value;
}
