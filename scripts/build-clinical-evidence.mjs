import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const inputPath = process.argv[2] ?? "/tmp/rightsatlas-clinical-label-sections.json";
const outputPath = process.argv[3] ?? path.join(projectRoot, "public/data/clinical-evidence.json");
const reusePublications = process.argv.includes("--reuse-publications");
const raw = JSON.parse(await readFile(inputPath, "utf8"));
let existingPublicationMap = new Map();
if (reusePublications) {
  try {
    const existing = JSON.parse(await readFile(outputPath, "utf8"));
    existingPublicationMap = new Map(existing.records.flatMap((record) => (record.studies ?? []).map((study) => [
      `${record.brand}::${study.indicationGroup}`,
      study.publications ?? [],
    ])));
  } catch {
    existingPublicationMap = new Map();
  }
}

const LEGACY_SEARCH = {
  RAYALDEE: "calcifediol extended release secondary hyperparathyroidism phase 3",
  "AMELUZ + RhodoLED": "BF-200 ALA photodynamic therapy actinic keratosis randomized",
  LODOCO: "colchicine LoDoCo2 cardiovascular randomized",
  SECUADO: "asenapine transdermal schizophrenia phase 3",
  GVOKE: "ready-to-use liquid glucagon severe hypoglycemia phase 3",
  KEVEYIS: "dichlorphenamide primary periodic paralysis randomized",
  ZYPITAMAG: "pitavastatin magnesium hyperlipidemia bioequivalence",
  BELSOMRA: "suvorexant insomnia phase 3 randomized",
  "HETLIOZ / HETLIOZ LQ": "tasimelteon non-24-hour sleep wake disorder SET RESET",
  "Humalog Mix 50/50": "insulin lispro mix 50/50 clinical trial",
  "Humalog Mix 75/25": "insulin lispro mix 75/25 clinical trial",
  "Novolog Mix 70/30": "biphasic insulin aspart 70/30 randomized",
  "SIGNIFOR LAR KIT": "pasireotide LAR acromegaly PAOLA phase 3",
  Actimmune: "interferon gamma chronic granulomatous disease randomized",
  Activase: "alteplase acute ischemic stroke NINDS randomized",
  Aimovig: "erenumab migraine STRIVE ARISE phase 3",
  Ajovy: "fremanezumab migraine HALO phase 3",
  Anthim: "obiltoxaximab anthrax healthy volunteers animal rule",
  Apidra: "insulin glulisine phase 3 randomized diabetes",
  Aranesp: "darbepoetin alfa chronic kidney disease anemia phase 3",
  Avonex: "interferon beta-1a multiple sclerosis pivotal randomized",
  Basaglar: "insulin glargine biosimilar ELEMENT 1 ELEMENT 2",
  Betaseron: "interferon beta-1b multiple sclerosis pivotal trial",
  "BYNFEZIA PEN": "octreotide acromegaly carcinoid VIPoma clinical trial",
  Campath: "alemtuzumab B-cell chronic lymphocytic leukemia CAM307",
  "Cathflo Activase": "alteplase occluded central venous catheter COOL trial",
  Cinqair: "reslizumab asthma phase 3 randomized",
  Crysvita: "burosumab X-linked hypophosphatemia phase 3 randomized",
  Digifab: "digoxin immune fab clinical study toxicity",
  "Egrifta SV": "tesamorelin HIV lipodystrophy phase 3 randomized",
  "Egrifta WR": "tesamorelin HIV lipodystrophy phase 3 randomized",
  Enbrel: "etanercept pivotal randomized rheumatoid arthritis psoriasis ankylosing",
  "Enbrel Mini": "etanercept pivotal randomized rheumatoid arthritis psoriasis ankylosing",
  "Epogen/Procrit": "epoetin alfa anemia chronic kidney disease pivotal trial",
  "Follistim AQ Cartridge": "follitropin beta assisted reproduction randomized",
  Genotropin: "somatropin growth hormone deficiency Turner syndrome clinical trial",
  "Gonal-f": "follitropin alfa assisted reproductive technology randomized",
  "Gonal-f RFF RediJect": "follitropin alfa assisted reproductive technology randomized",
  Humalog: "insulin lispro diabetes pivotal randomized trial",
  "Humulin R U-500": "U-500 regular insulin clinical trial severe insulin resistance",
  Increlex: "mecasermin severe primary IGF-1 deficiency clinical study",
  Kalbitor: "ecallantide hereditary angioedema EDEMA3 EDEMA4",
  Kepivance: "palifermin oral mucositis phase 3 randomized",
};

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withoutHeading(text, headingPattern) {
  return text.replace(headingPattern, "").trim();
}

function splitSentences(text) {
  return text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 25);
}

function pickSentences(text, patterns, maximum = 4, characterLimit = 1200) {
  const selected = [];
  let length = 0;
  for (const sentence of splitSentences(text)) {
    if (!patterns.some((pattern) => pattern.test(sentence))) continue;
    const cleaned = sentence.replace(/\s+/g, " ").trim();
    if (selected.includes(cleaned)) continue;
    if (length + cleaned.length > characterLimit && selected.length) break;
    selected.push(cleaned);
    length += cleaned.length;
    if (selected.length >= maximum) break;
  }
  return selected;
}

function parseNumberedSubsections(text, sectionNumber) {
  if (!text) return [];
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const heading = new RegExp(`^${sectionNumber}\\.(\\d+)\\s+(.+)$`);
  const sections = [];
  let active = null;
  for (const line of lines) {
    const match = line.match(heading);
    if (match) {
      active = { title: match[2].trim(), definition: "" };
      sections.push(active);
    } else if (active) {
      active.definition += `${active.definition ? " " : ""}${line}`;
    }
  }
  return sections.filter((section) => section.definition);
}

function approvedIndications(text) {
  const subsections = parseNumberedSubsections(text, 1);
  if (subsections.length) return subsections.map((section) => ({
    title: section.title,
    definition: section.definition.replace(/\(\s*1\.\d+\s*\)/g, "").trim(),
  }));
  const definition = withoutHeading(text, /^1 INDICATIONS AND USAGE\s*/i);
  return definition ? [{ title: "Approved use", definition }] : [];
}

function warningSummaries(text) {
  const sections = parseNumberedSubsections(text, 5);
  if (sections.length) return sections.slice(0, 8).map((section) => ({
    title: section.title,
    summary: splitSentences(section.definition).slice(0, 2).join(" ").slice(0, 520),
  }));
  return pickSentences(text, [/\brisk\b/i, /\bmay\b/i, /monitor/i, /fatal/i], 5, 1200).map((summary, index) => ({ title: `Key warning ${index + 1}`, summary }));
}

function trialIds(text) {
  return [...new Set(text.match(/NCT\d{8}/g) ?? [])];
}

function phases(text) {
  return [...new Set((text.match(/phase\s+(?:1|2|3|4)(?:[a-z]|\/[123][a-z]?)?/gi) ?? []).map((phase) => phase.replace(/\s+/g, " ")))];
}

function keyMetricLines(text) {
  const lines = text.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const picked = [];
  for (const line of lines) {
    const useful = /(?:\d+(?:\.\d+)?%|hazard ratio|\bHR\b|95% CI|p\s*[=<]|mmHg|EASI-|ACR\d|remission|response|event rate|change from baseline|primary endpoint)/i.test(line);
    if (!useful || line.length < 12 || line.length > 260 || picked.includes(line)) continue;
    picked.push(line);
    if (picked.length >= 14) break;
  }
  return picked;
}

function studyDigest(group) {
  const text = group.text.replace(/^14(?:\.\d+)?\s+[^\n]+\n?/, "").trim();
  const ids = trialIds(text);
  return {
    indicationGroup: group.title.replace(/^14(?:\.\d+)?\s+/, ""),
    phases: phases(text),
    trialIds: ids,
    trialRegistryUrls: ids.map((id) => `https://clinicaltrials.gov/study/${id}`),
    population: pickSentences(text, [/\benrolled\b/i, /\brandomized\b/i, /mean age/i, /median age/i, /at baseline/i, /subjects? (?:were|had)/i], 5, 1450),
    design: pickSentences(text, [/randomized/i, /double-blind/i, /placebo-controlled/i, /active-controlled/i, /primary (?:efficacy )?endpoint/i, /treatment period/i, /weeks?\b/i], 5, 1450),
    efficacy: pickSentences(text, [/superior/i, /statistically significant/i, /hazard ratio/i, /primary (?:efficacy )?endpoint/i, /reduced? the risk/i, /clinical response/i, /clinical remission/i, /improvement/i, /difference/i], 7, 2100),
    keyMetrics: keyMetricLines(text),
    publicationMatch: ids.length ? "Trial-registry identifier match" : "Ingredient and indication match",
    publications: [],
  };
}

async function ncbiJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "RightsAtlas/1.0 clinical-evidence-review" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const result = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 360));
  return result;
}

async function ncbiText(url) {
  const response = await fetch(url, { headers: { "user-agent": "RightsAtlas/1.0 clinical-evidence-review" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const result = await response.text();
  await new Promise((resolve) => setTimeout(resolve, 360));
  return result;
}

function articleFromXml(xml) {
  const pmid = xml.match(/<PMID[^>]*>(\d+)<\/PMID>/i)?.[1];
  if (!pmid) return null;
  const title = decodeXml(xml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/i)?.[1] ?? "Published clinical study");
  const journal = decodeXml(xml.match(/<Journal>[\s\S]*?<Title>([\s\S]*?)<\/Title>/i)?.[1] ?? "Journal publication");
  const year = xml.match(/<(?:PubDate|ArticleDate)>[\s\S]*?<Year>(\d{4})<\/Year>/i)?.[1] ?? null;
  const doi = decodeXml(xml.match(/<ArticleId[^>]*IdType=["']doi["'][^>]*>([\s\S]*?)<\/ArticleId>/i)?.[1] ?? "") || null;
  const ids = trialIds(xml);
  return { pmid, title, journal, year, doi, url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, trialIds: ids };
}

async function nctPublications(ids) {
  const result = new Map(ids.map((id) => [id, []]));
  const batches = [];
  for (let index = 0; index < ids.length; index += 24) batches.push(ids.slice(index, index + 24));
  for (const batch of batches) {
    const term = batch.map((id) => `${id}[All Fields]`).join(" OR ");
    const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
    searchUrl.searchParams.set("db", "pubmed");
    searchUrl.searchParams.set("retmode", "json");
    searchUrl.searchParams.set("retmax", "500");
    searchUrl.searchParams.set("term", term);
    const search = await ncbiJson(searchUrl);
    const pmids = search.esearchresult?.idlist ?? [];
    if (!pmids.length) continue;
    const fetchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
    fetchUrl.searchParams.set("db", "pubmed");
    fetchUrl.searchParams.set("retmode", "xml");
    fetchUrl.searchParams.set("id", pmids.join(","));
    const xml = await ncbiText(fetchUrl);
    for (const articleXml of xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/gi) ?? []) {
      const article = articleFromXml(articleXml);
      if (!article) continue;
      for (const id of article.trialIds) {
        if (!result.has(id)) continue;
        const existing = result.get(id);
        if (!existing.some((item) => item.pmid === article.pmid)) existing.push(article);
      }
    }
  }
  return result;
}

async function fallbackPublications(query) {
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.searchParams.set("db", "pubmed");
  searchUrl.searchParams.set("retmode", "json");
  searchUrl.searchParams.set("retmax", "6");
  searchUrl.searchParams.set("sort", "relevance");
  searchUrl.searchParams.set("term", `(${query}) AND (randomized controlled trial[Publication Type] OR clinical trial[Publication Type] OR clinical trial, phase iii[Publication Type])`);
  const search = await ncbiJson(searchUrl);
  const pmids = search.esearchresult?.idlist ?? [];
  if (!pmids.length) return [];
  const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  summaryUrl.searchParams.set("db", "pubmed");
  summaryUrl.searchParams.set("retmode", "json");
  summaryUrl.searchParams.set("id", pmids.join(","));
  const summary = await ncbiJson(summaryUrl);
  return pmids.map((pmid) => {
    const item = summary.result?.[pmid];
    const articleIds = item?.articleids ?? [];
    return {
      pmid,
      title: item?.title?.replace(/\.$/, "") ?? "Published clinical study",
      journal: item?.fulljournalname || item?.source || "Journal publication",
      year: item?.pubdate?.match(/\d{4}/)?.[0] ?? null,
      doi: articleIds.find((id) => id.idtype === "doi")?.value ?? null,
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      trialIds: [],
    };
  });
}

const records = raw.records.map((record) => {
  if (record.status !== "found") return { brand: record.brand, ingredient: record.ingredient, specialtyRank: record.specialtyRank, status: record.status };
  const studies = record.clinicalGroups.map(studyDigest);
  const adverse = record.sections.adverseReactions ?? "";
  return {
    brand: record.brand,
    ingredient: record.ingredient,
    specialtyRank: record.specialtyRank,
    status: "reviewed",
    label: record.label,
    approvedIndications: approvedIndications(record.sections.indications ?? ""),
    safety: {
      boxedWarning: withoutHeading(record.sections.boxedWarning ?? "", /^BOXED WARNING SECTION\s*/i).slice(0, 1200),
      contraindications: withoutHeading(record.sections.contraindications ?? "", /^4 CONTRAINDICATIONS\s*/i).slice(0, 900),
      keyWarnings: warningSummaries(record.sections.warnings ?? ""),
      commonAdverseReactions: pickSentences(adverse, [/most common/i, /≥\s*\d+%/i, /at least \d+%/i, /incidence/i], 6, 1800),
      studyPopulation: pickSentences(adverse, [/subjects? (?:were|with)/i, /patients? (?:were|with)/i, /clinical trials?/i, /exposed to/i], 4, 1200),
    },
    studies,
    noClinicalStudiesStatement: studies.length ? null : "The current U.S. prescribing information does not contain a Clinical Studies section for this presentation.",
  };
});

const allNctIds = [...new Set(records.flatMap((record) => record.studies?.flatMap((study) => study.trialIds) ?? []))];
process.stderr.write(`${reusePublications ? "Reusing" : "Resolving"} journal publications for ${allNctIds.length} label-listed trial identifiers.\n`);
const exactPublications = reusePublications ? new Map() : await nctPublications(allNctIds);

for (const [recordIndex, record] of records.entries()) {
  if (record.status !== "reviewed") continue;
  for (const study of record.studies) {
    const existing = existingPublicationMap.get(`${record.brand}::${study.indicationGroup}`);
    if (existing) {
      study.publications = existing;
      continue;
    }
    const exact = study.trialIds.flatMap((id) => exactPublications.get(id) ?? []);
    study.publications = [...new Map(exact.map((publication) => [publication.pmid, publication])).values()];
    if (study.publications.length || study.trialIds.length) continue;
    const query = LEGACY_SEARCH[record.brand] ?? `${record.ingredient} ${study.indicationGroup}`;
    try {
      study.publications = await fallbackPublications(query);
    } catch (error) {
      process.stderr.write(`${record.brand} / ${study.indicationGroup}: ${error}\n`);
    }
  }
  process.stderr.write(`[${recordIndex + 1}/${records.length}] ${record.brand}: ${record.studies.reduce((sum, study) => sum + study.publications.length, 0)} publications\n`);
}

const output = {
  meta: {
    title: "U.S. prescribing-information and registration-evidence review",
    generatedAt: new Date().toISOString(),
    products: records.length,
    scope: "All efficacy studies described in the current U.S. prescribing information, plus the label's integrated safety population. Earlier studies not described in the label require FDA review-package confirmation.",
    publicationMethod: "PubMed publications matched by label-listed NCT identifier where available; legacy-label publications matched by ingredient and indication and labeled accordingly.",
  },
  records,
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
process.stdout.write(`Wrote ${records.length} clinical-evidence records to ${outputPath}\n`);
