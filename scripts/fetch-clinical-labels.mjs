import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(await readFile(path.join(projectRoot, "public/data/catalog.json"), "utf8"));
const outputPath = process.argv[2] ?? "/tmp/rightsatlas-clinical-label-sections.json";

const LABEL_CODES = {
  indications: "34067-9",
  boxedWarning: "34066-1",
  contraindications: "34070-3",
  warnings: "43685-7",
  adverseReactions: "34084-4",
  clinicalStudies: "34092-7",
  specificPopulations: "43684-0",
};

const SEARCH_OVERRIDES = {
  "AMELUZ + RhodoLED": "AMELUZ",
  "HETLIOZ / HETLIOZ LQ": "HETLIOZ",
  "Humalog Mix 50/50": "HUMALOG MIX50/50",
  "Humalog Mix 75/25": "HUMALOG MIX75/25",
  "SIGNIFOR LAR KIT": "SIGNIFOR LAR",
  "Enbrel Mini": "ENBREL",
  "Epogen/Procrit": "EPOGEN",
  "GATTEX KIT": "GATTEX",
  "Follistim AQ Cartridge": "FOLLISTIM AQ",
  "Gonal-f RFF RediJect": "GONAL-F RFF REDI-JECT",
};

function specialtySignalScore(product) {
  const route = `${product.route} ${product.dosageForm}`.toLowerCase();
  const modality = `${product.productType} ${product.modality}`.toLowerCase();
  let score = product.mechanism ? 2 : 0;
  if (/subcutaneous|intravenous|intramuscular|inhal|implant|ophthalmic|topical|transdermal|sublingual|buccal|enteral/.test(route)) score += 3;
  if (/biologic|vaccine|peptide|protein|antibody|enzyme|cell|gene|plasma|blood/.test(modality)) score += 3;
  if (/device|kit|extended|delayed|suspension|spray|patch|film/.test(route)) score += 1;
  return score;
}

function specialtyUniverse() {
  const ranked = catalog.targets.specialty.map((target) => {
    const source = catalog.universe.find((product) => product.strategyAsset === target.asset);
    return {
      brand: target.asset,
      ingredient: target.ingredient,
      company: target.company,
      route: target.route,
      dosageForm: source?.dosageForm ?? target.dosing,
      modality: source?.modality ?? "",
      mechanism: target.mechanism,
      specialtyRank: target.rank,
      piUrl: target.piUrl,
    };
  });
  const rankedAssets = new Set(ranked.map((product) => product.brand));
  const broader = catalog.universe
    .filter((product) => product.mechanism && (!product.strategyAsset || !rankedAssets.has(product.strategyAsset)))
    .sort((a, b) => specialtySignalScore(b) - specialtySignalScore(a) || a.brand.localeCompare(b.brand))
    .slice(0, 61)
    .map((product) => ({ ...product, specialtyRank: null, piUrl: null }));
  return [...ranked, ...broader];
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function xmlText(xml) {
  return decodeXml(xml)
    .replace(/<styleCode>.*?<\/styleCode>/gis, " ")
    .replace(/<(?:br|lineBreak)\b[^>]*\/?\s*>/gi, "\n")
    .replace(/<\/(?:title|paragraph|item|list|tr|table|caption)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00a0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function sectionForCode(xml, code) {
  const codePattern = new RegExp(`<code\\s+[^>]*code=["']${code}["'][^>]*>`, "i");
  const codeMatch = codePattern.exec(xml);
  if (!codeMatch) return null;
  const start = xml.lastIndexOf("<section", codeMatch.index);
  if (start < 0) return null;
  const tokens = /<\/?section\b[^>]*>/gi;
  tokens.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tokens.exec(xml))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) return xml.slice(start, tokens.lastIndex);
  }
  return null;
}

function directChildSections(sectionXml) {
  const tokens = /<\/?section\b[^>]*>/gi;
  const children = [];
  let depth = 0;
  let childStart = -1;
  let match;
  while ((match = tokens.exec(sectionXml))) {
    const closing = match[0].startsWith("</");
    if (!closing) {
      depth += 1;
      if (depth === 2) childStart = match.index;
    } else {
      if (depth === 2 && childStart >= 0) {
        children.push(sectionXml.slice(childStart, tokens.lastIndex));
        childStart = -1;
      }
      depth -= 1;
    }
  }
  return children;
}

function sectionTitle(sectionXml) {
  const match = sectionXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? xmlText(match[1]) : "Clinical study";
}

function clinicalGroups(sectionXml) {
  if (!sectionXml) return [];
  const children = directChildSections(sectionXml);
  if (!children.length) return [{ title: sectionTitle(sectionXml), text: xmlText(sectionXml) }];
  return children.map((child) => ({ title: sectionTitle(child), text: xmlText(child) }));
}

function setIdFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get("setid");
  } catch {
    return null;
  }
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function resultScore(product, result) {
  const title = normalize(result.title);
  const brand = normalize(SEARCH_OVERRIDES[product.brand] ?? product.brand);
  const companyWords = normalize(product.company).split(" ").filter((word) => word.length > 4);
  let score = title.includes(brand) ? 100 : 0;
  score += companyWords.filter((word) => title.includes(word)).length * 5;
  score += Number(result.spl_version ?? 0) / 100;
  return score;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "RightsAtlas clinical evidence review" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "RightsAtlas clinical evidence review" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function resolveLabel(product) {
  const suppliedSetId = setIdFromUrl(product.piUrl);
  if (suppliedSetId) return { setid: suppliedSetId, title: product.brand, published_date: null, supplied: true };
  const drugName = SEARCH_OVERRIDES[product.brand] ?? product.brand;
  const endpoint = new URL("https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json");
  endpoint.searchParams.set("drug_name", drugName);
  endpoint.searchParams.set("name_type", "b");
  endpoint.searchParams.set("pagesize", "100");
  const data = await fetchJson(endpoint);
  const results = Array.isArray(data.data) ? data.data : [];
  if (!results.length) return null;
  return [...results].sort((a, b) => resultScore(product, b) - resultScore(product, a))[0];
}

const products = specialtyUniverse();
const records = [];
for (const [index, product] of products.entries()) {
  try {
    const label = await resolveLabel(product);
    if (!label) {
      records.push({ ...product, status: "not_found" });
      process.stderr.write(`[${index + 1}/81] ${product.brand}: no label\n`);
      continue;
    }
    const xml = await fetchText(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${label.setid}.xml`);
    const sections = Object.fromEntries(Object.entries(LABEL_CODES).map(([key, code]) => {
      const section = sectionForCode(xml, code);
      return [key, section ? xmlText(section) : ""];
    }));
    const clinicalSection = sectionForCode(xml, LABEL_CODES.clinicalStudies);
    records.push({
      ...product,
      status: "found",
      label: {
        setid: label.setid,
        title: label.title,
        publishedDate: label.published_date,
        url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${label.setid}`,
        pdfUrl: `https://dailymed.nlm.nih.gov/dailymed/downloadpdffile.cfm?setId=${label.setid}`,
      },
      sections,
      clinicalGroups: clinicalGroups(clinicalSection),
    });
    process.stderr.write(`[${index + 1}/81] ${product.brand}: ${label.setid}\n`);
  } catch (error) {
    records.push({ ...product, status: "error", error: String(error) });
    process.stderr.write(`[${index + 1}/81] ${product.brand}: ${error}\n`);
  }
  await new Promise((resolve) => setTimeout(resolve, 120));
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), records }, null, 2)}\n`);
const found = records.filter((record) => record.status === "found").length;
process.stdout.write(`Wrote ${records.length} records (${found} labels) to ${outputPath}\n`);
