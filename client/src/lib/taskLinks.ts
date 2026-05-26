export interface TaskLink {
  url: string;
  label_zh: string;
  label_en: string;
}

const trailingUrlPunctuation = /[)\]}.;,!?:\uFF0C\u3002\uFF1B\uFF1A\uFF01\uFF1F\u3001]+$/;
const trailingTextPunctuation = /[\s:;,.!?|\uFF0C\u3002\uFF1B\uFF1A\uFF01\uFF1F\u3001]+$/;

const zh = {
  ccupPortal: "\u958b\u555f\u4e2d\u6b63\u5927\u5b78\u55ae\u4e00\u5165\u53e3",
  ecourse2: "\u958b\u555f eCourse2",
  campusSoftware: "\u958b\u555f\u6821\u5712\u6388\u6b0a\u8edf\u9ad4\u5e73\u53f0\uff08\u9650\u6821\u5167\u7db2\u8def\uff09",
  oitSoftware: "\u958b\u555f\u8cc7\u8a0a\u8655\u8edf\u9ad4\u670d\u52d9\u9801",
  vpnPdf: "\u958b\u555f VPN PDF \u6559\u5b78",
  vpnService: "\u958b\u555f VPN \u670d\u52d9\u9801",
  softwareActivation: "\u958b\u555f\u8edf\u9ad4\u8a8d\u8b49\u6559\u5b78",
  onCampusEmergencyAid: "\u958b\u555f\u6821\u5167\u6025\u96e3\u6551\u52a9",
  offCampusEmergencyAid: "\u958b\u555f\u6821\u5916\u6025\u96e3\u6551\u52a9",
  studentApplication: "\u958b\u555f\u5b78\u751f\u7dda\u4e0a\u7533\u8fa6\u7cfb\u7d71",
  niaChiayi: "\u958b\u555f\u5609\u7fa9\u5e02\u79fb\u6c11\u7f72\u670d\u52d9\u7ad9\u9801\u9762",
  maps: "\u958b\u555f Google Maps \u5c0e\u822a",
  visaApplication: "\u958b\u555f\u7c3d\u8b49\u7dda\u4e0a\u586b\u8868\u7cfb\u7d71",
  visaFee: "\u958b\u555f\u7c3d\u8b49\u898f\u8cbb\u8aaa\u660e",
  degreeVisa: "\u958b\u555f\u5b78\u4f4d\u751f\u5c45\u7559\u7c3d\u8b49\u8aaa\u660e",
  exchangeResidentVisa: "\u958b\u555f\u4ea4\u63db\u751f\u5c45\u7559\u7c3d\u8b49\u8aaa\u660e",
  exchangeVisitorVisa: "\u958b\u555f\u4ea4\u63db\u751f\u505c\u7559\u7c3d\u8b49\u8aaa\u660e",
  oiaScholarships: "\u958b\u555f\u570b\u969b\u8655\u734e\u5b78\u91d1\u9801\u9762",
  gown: "\u958b\u555f\u5b78\u4f4d\u670d\u501f\u7528\u8aaa\u660e",
  internship: "\u958b\u555f\u6821\u5916\u5be6\u7fd2\u8cc7\u8a0a",
  workPermit: "\u958b\u555f\u5de5\u4f5c\u8a31\u53ef\u7533\u8fa6\u7db2",
  intercollegiateStudent: "\u958b\u555f\u6821\u969b\u751f\u5b78\u7c4d\u7cfb\u7d71",
  academicRecord: "\u958b\u555f\u5b78\u7c4d\u8cc7\u6599\u767b\u9304\u7cfb\u7d71",
  payment: "\u958b\u555f\u7e73\u8cbb\u7cfb\u7d71",
  career: "\u958b\u555f\u8077\u6daf\u4e2d\u5fc3\u9801\u9762",
  library: "\u958b\u555f\u5716\u66f8\u9928\u9801\u9762",
  sportsReservation: "\u958b\u555f\u9ad4\u80b2\u5834\u5730\u501f\u7528\u7cfb\u7d71",
  sportsOffice: "\u958b\u555f\u9ad4\u80b2\u5ba4\u9801\u9762",
  chineseLanguageCenter: "\u958b\u555f\u83ef\u8a9e\u4e2d\u5fc3\u9801\u9762",
  webmail: "\u958b\u555f\u4e2d\u6b63\u5927\u5b78 Webmail",
  alumniEmail: "\u958b\u555f\u6821\u53cb\u4fe1\u7bb1\u7cfb\u7d71",
  intercollegiateCourse: "\u958b\u555f\u6821\u969b\u9078\u8ab2\u7cfb\u7d71",
  academicAffairs: "\u958b\u555f\u6559\u52d9\u7cfb\u7d71",
  pdf: "\u958b\u555f PDF \u6559\u5b78",
  ccuPage: "\u958b\u555f\u4e2d\u6b63\u5927\u5b78\u9801\u9762",
  link: "\u958b\u555f\u9023\u7d50",
};

export function cleanTaskUrl(url: string) {
  return url.trim().replace(trailingUrlPunctuation, "");
}

export function extractUrlsFromText(text: string): { cleanedText: string; urls: string[] } {
  const markdownUrlRegex = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  const urlRegex = /https?:\/\/[A-Za-z0-9._~:/?#@!$&()*+,;=%-]+/g;
  const urls: string[] = [];
  const seen = new Set<string>();

  const addUrl = (url: string) => {
    const cleaned = cleanTaskUrl(url);
    if (cleaned && !seen.has(cleaned)) {
      seen.add(cleaned);
      urls.push(cleaned);
    }
  };

  let cleanedText = text.replace(markdownUrlRegex, (_match, label: string, url: string) => {
    addUrl(url);
    return /^https?:\/\//i.test(label) ? "" : label;
  });

  const matches = cleanedText.match(urlRegex) || [];
  matches.forEach(addUrl);

  cleanedText = cleanedText
    .replace(urlRegex, "")
    .replace(new RegExp(`\\s*(?:\\u548C|\\u6216|and|or)\\s*$`, "iu"), "")
    .replace(trailingTextPunctuation, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { cleanedText, urls };
}

export function getTaskLinkLabel(
  url: string,
  index: number,
  t: (en: string, zh: string) => string
) {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("portal.ccu.edu.tw")) {
    return t("Open CCU Portal", zh.ccupPortal);
  }

  if (lowerUrl.includes("ecourse2.ccu.edu.tw")) {
    return t("Open eCourse2", zh.ecourse2);
  }

  if (lowerUrl.includes("software.ccu.edu.tw")) {
    return t("Open Campus Software Download Platform (Campus Network Required)", zh.campusSoftware);
  }

  if (lowerUrl.includes("it.ccu.edu.tw/p/426-1009-36")) {
    return t("Open OIT Software Service Page", zh.oitSoftware);
  }

  if (lowerUrl.includes("609499594.pdf")) {
    return t("Open VPN PDF Guide", zh.vpnPdf);
  }

  if (lowerUrl.includes("it.ccu.edu.tw/p/426-1009-30") || lowerUrl.includes("it.ccu.edu.tw/p/426100930")) {
    return t("Open VPN Service Page", zh.vpnService);
  }

  if (lowerUrl.includes("it.ccu.edu.tw/p/426-1009-18") || lowerUrl.includes("it.ccu.edu.tw/p/426100918")) {
    return t("Open Software Activation Guide", zh.softwareActivation);
  }

  if (lowerUrl.includes("studentlife.ccu.edu.tw/p/404-1034-20790")) {
    return t("Open On-campus Emergency Aid", zh.onCampusEmergencyAid);
  }

  if (lowerUrl.includes("studentlife.ccu.edu.tw/p/404-1034-20791")) {
    return t("Open Off-campus Emergency Aid", zh.offCampusEmergencyAid);
  }

  if (lowerUrl.includes("coa.immigration.gov.tw/coa-frontend/student/entry")) {
    return t("Open Students Online Application System", zh.studentApplication);
  }

  if (lowerUrl.includes("servicestation.immigration.gov.tw/5880")) {
    return t("Open NIA Chiayi City Service Center Page", zh.niaChiayi);
  }

  if (lowerUrl.includes("google.com/maps")) {
    return t("Open Google Maps Directions", zh.maps);
  }

  if (lowerUrl.includes("visawebapp.boca.gov.tw")) {
    return t("Open Online Visa Application Form", zh.visaApplication);
  }

  if (lowerUrl.includes("boca.gov.tw") && lowerUrl.includes("cp-396")) {
    return t("Open Visa Fee Information", zh.visaFee);
  }

  if (lowerUrl.includes("boca.gov.tw") && lowerUrl.includes("cp-166-283")) {
    return t("Open Resident Visa Guide for Foreign Students", zh.degreeVisa);
  }

  if (lowerUrl.includes("boca.gov.tw") && lowerUrl.includes("cp-166-284")) {
    return t("Open Resident Visa Guide for Exchange Students", zh.exchangeResidentVisa);
  }

  if (lowerUrl.includes("boca.gov.tw") && lowerUrl.includes("cp-158-4342")) {
    return t("Open Visitor Visa Guide for Exchange Students", zh.exchangeVisitorVisa);
  }

  if (lowerUrl.includes("oia.ccu.edu.tw") && lowerUrl.includes("3967")) {
    return t("Open OIA Scholarships Page", zh.oiaScholarships);
  }

  if (lowerUrl.includes("oga.ccu.edu.tw") && lowerUrl.includes("11703")) {
    return t("Open Graduation Gown Borrowing Information", zh.gown);
  }

  if (lowerUrl.includes("career.ccu.edu.tw") && lowerUrl.includes("244")) {
    return t("Open Off-Campus Internship Information", zh.internship);
  }

  if (lowerUrl.includes("ezwp.wda.gov.tw")) {
    return t("Open Work Permit Application Portal", zh.workPermit);
  }

  if (lowerUrl.includes("www026168.ccu.edu.tw")) {
    return t("Open Intercollegiate Student System", zh.intercollegiateStudent);
  }

  if (lowerUrl.includes("www026198.ccu.edu.tw/academic")) {
    return t("Open Academic Record System", zh.academicRecord);
  }

  if (lowerUrl.includes("school.bot.com.tw")) {
    return t("Open Payment System", zh.payment);
  }

  if (lowerUrl.includes("career.ccu.edu.tw")) {
    return t("Open Career Center Page", zh.career);
  }

  if (lowerUrl.includes("library.ccu.edu.tw") || lowerUrl.includes("lib.ccu.edu.tw")) {
    return t("Open Library Page", zh.library);
  }

  if (lowerUrl.includes("sportplacerent.ccu.edu.tw")) {
    return t("Open Sports Facility Reservation", zh.sportsReservation);
  }

  if (lowerUrl.includes("sport.ccu.edu.tw")) {
    return t("Open Sports Office Page", zh.sportsOffice);
  }

  if (lowerUrl.includes("chineselanguagecenter.ccu.edu.tw")) {
    return t("Open Chinese Language Center Page", zh.chineseLanguageCenter);
  }

  if (lowerUrl.includes("webmail.ccu.edu.tw")) {
    return t("Open CCU Webmail", zh.webmail);
  }

  if (lowerUrl.includes("alum.ccu.edu.tw")) {
    return t("Open Alumni Email System", zh.alumniEmail);
  }

  if (lowerUrl.includes("cross-school.ccu.edu.tw")) {
    return t("Open Intercollegiate Course System", zh.intercollegiateCourse);
  }

  if (lowerUrl.includes("kiki.ccu.edu.tw")) {
    return t("Open Academic Affairs System", zh.academicAffairs);
  }

  if (lowerUrl.includes(".pdf")) {
    return t("Open PDF Guide", zh.pdf);
  }

  if (lowerUrl.includes("ccu.edu.tw")) {
    return t("Open CCU Page", zh.ccuPage);
  }

  return `${t("Open Link", zh.link)} ${index + 1}`;
}

export function buildTaskLinks(
  urls: string[],
  explicitLinks: TaskLink[] | undefined,
  t: (en: string, zh: string) => string
) {
  const links: Array<{ url: string; label: string }> = [];
  const seen = new Set<string>();

  for (const link of explicitLinks ?? []) {
    const url = cleanTaskUrl(link.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    links.push({ url, label: t(link.label_en, link.label_zh) });
  }

  urls.forEach((rawUrl, index) => {
    const url = cleanTaskUrl(rawUrl);
    if (!url || seen.has(url)) return;
    seen.add(url);
    links.push({ url, label: getTaskLinkLabel(url, index, t) });
  });

  return links;
}
