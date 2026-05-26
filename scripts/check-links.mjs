import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

const SOURCE_FILES = [
  "client/src/data/campusData.ts",
  "shared/campusData.ts",
  "shared/studentGuideData.ts",
];
const JSON_REPORT = "link-check-report.json";
const MD_REPORT = "link-check-report.md";
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 6;

const urlRegex = /https?:\/\/[A-Za-z0-9._~:/?#@!$&()*+,;=%-]+/g;
const trailingPunctuation = /[)\]}.;,!?:\uFF0C\u3002\uFF1B\uFF1A\uFF01\uFF1F\u3001]+$/u;

function cleanUrl(url) {
  return url.trim().replace(trailingPunctuation, "");
}

function extractUrls() {
  const urls = new Set();

  for (const sourceFile of SOURCE_FILES) {
    const source = readFileSync(sourceFile, "utf8");
    for (const match of source.match(urlRegex) ?? []) {
      const url = cleanUrl(match);
      if (url) urls.add(url);
    }
  }

  return [...urls].sort((a, b) => a.localeCompare(b));
}

function classifyStatus(httpStatus, error) {
  if (error) return "NEEDS_MANUAL_CHECK";
  if (httpStatus >= 200 && httpStatus < 400) return "OK";
  if (httpStatus === 401 || httpStatus === 403) return "PROTECTED_BUT_EXISTS";
  if (httpStatus === 404 || httpStatus === 410) return "BROKEN";
  return "NEEDS_MANUAL_CHECK";
}

async function fetchWithTimeout(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "ccu-intl-guide-link-checker/1.0",
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUrl(url) {
  const attempts = ["HEAD", "GET"];
  let lastError = "";

  for (const method of attempts) {
    try {
      const response = await fetchWithTimeout(url, method);
      const httpStatus = response.status;

      if (method === "HEAD" && [405, 501].includes(httpStatus)) {
        continue;
      }

      return {
        url,
        status: classifyStatus(httpStatus),
        httpStatus,
        method,
        finalUrl: response.url,
        error: "",
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (method === "HEAD") continue;
    }
  }

  return {
    url,
    status: "NEEDS_MANUAL_CHECK",
    httpStatus: null,
    method: "GET",
    finalUrl: "",
    error: lastError,
  };
}

async function mapWithConcurrency(items, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
      const result = results[index];
      console.log(`[${index + 1}/${items.length}] ${result.status} ${result.url}`);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => worker())
  );

  return results;
}

function summarize(results) {
  return results.reduce((counts, result) => {
    counts[result.status] = (counts[result.status] ?? 0) + 1;
    return counts;
  }, {});
}

function markdownReport(results) {
  const counts = summarize(results);
  const generatedAt = new Date().toISOString();
  const important = results.filter((result) => result.status !== "OK");

  const lines = [
    "# Link Check Report",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "## Summary",
    "",
    "| Status | Count |",
    "| --- | ---: |",
    ...Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([status, count]) => `| ${status} | ${count} |`),
    "",
    "## Non-OK Links",
    "",
  ];

  if (important.length === 0) {
    lines.push("All checked links returned OK.");
  } else {
    lines.push("| Status | HTTP | Method | URL | Note |");
    lines.push("| --- | ---: | --- | --- | --- |");
    for (const result of important) {
      const httpStatus = result.httpStatus ?? "";
      const note = result.error ? result.error.replaceAll("|", "\\|") : result.finalUrl;
      lines.push(`| ${result.status} | ${httpStatus} | ${result.method} | ${result.url} | ${note} |`);
    }
  }

  lines.push("");
  lines.push("## All Links");
  lines.push("");
  lines.push("| Status | HTTP | Method | URL |");
  lines.push("| --- | ---: | --- | --- |");
  for (const result of results) {
    lines.push(`| ${result.status} | ${result.httpStatus ?? ""} | ${result.method} | ${result.url} |`);
  }

  return `${lines.join("\n")}\n`;
}

const urls = extractUrls();
console.log(`Checking ${urls.length} unique links from ${SOURCE_FILES.join(", ")}`);

const results = await mapWithConcurrency(urls, checkUrl);
await writeFile(JSON_REPORT, `${JSON.stringify(results, null, 2)}\n`);
await writeFile(MD_REPORT, markdownReport(results));

const counts = summarize(results);
console.log(`Wrote ${JSON_REPORT} and ${MD_REPORT}`);
console.log(counts);

if (process.env.LINK_CHECK_FAIL_ON_BROKEN === "1" && counts.BROKEN) {
  process.exitCode = 1;
}
