"use client";

import { useEffect, useMemo, useState } from "react";
import { COMMERCIAL_MODELS, teamTotal, type CommercialModel } from "./commercialModels";
import { TOP20_DILIGENCE, type AssetDiligence } from "./diligence";

type StrategyKey = "core" | "specialty";
type View = "situation" | "targets" | "database" | "deals" | "saved";

type Strategy = {
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  verdict: string;
  leadingAssets: string[];
};

type Target = {
  id: string;
  strategy: StrategyKey;
  rank: number;
  tier: string;
  score: number;
  asset: string;
  ingredient: string;
  platform: string;
  therapyArea: string;
  routeDosing: string;
  route: string;
  dosing: string;
  mechanism: string;
  company: string;
  revenue: string;
  revenueUsdMm: number | null;
  period: string;
  evidenceType: string;
  revenueConfidence: string;
  callPoints: string;
  medicalEngagement: string;
  teamFit: string;
  transactionSignal: string;
  rationale: string;
  risks: string;
  revenueAssumption: string;
  leverage: string;
  buildInterpretation: string;
  platformPrinciple: string | null;
  piUrl: string;
  piPublished: string | null;
};

type Product = {
  id: string;
  productType: string;
  modality: string;
  ingredient: string;
  brand: string;
  company: string;
  dosageForm: string;
  route: string;
  marketStatus: string;
  mechanism: string | null;
  strategyAsset: string | null;
  coreRank: number | null;
  coreScore: number | null;
  specialtyRank: number | null;
  specialtyScore: number | null;
};

type Methodology = {
  dimension: string;
  core: string;
  specialty: string;
  interpretation: string;
};

type TeamModel = {
  priority: number;
  platform: string;
  anchors: string;
  callPoints: string;
  customerFacingMin: number;
  customerFacingMax: number;
  runRateMin: number;
  runRateMax: number;
  strength: string;
  risk: string;
};

type Catalog = {
  meta: {
    title: string;
    updated: string;
    products: number;
    strategyRecords: number;
    uniqueTargets: number;
  };
  strategies: Record<StrategyKey, Strategy>;
  targets: Record<StrategyKey, Target[]>;
  methodology: Methodology[];
  teamModels: TeamModel[];
  universe: Product[];
};

type DealBenchmark = {
  id: string;
  date: string;
  buyer: string;
  seller: string;
  asset: string;
  therapyArea: string;
  stage: string;
  structure: string;
  rightsScope: string;
  guaranteedUsdMm: number | null;
  guaranteedDisplay: string;
  contingentUsdMm: number | null;
  contingentDisplay: string;
  headlineUsdMm: number | null;
  royalty: string;
  salesAtDealUsdMm: number | null;
  economics: string;
  insight: string;
  status: string;
  sourceLabel: string;
  sourceUrl: string;
};

type DealBenchmarkCatalog = {
  meta: {
    title: string;
    coverage: string;
    updated: string;
    method: string;
  };
  deals: DealBenchmark[];
};

const VIEW_LABELS: Record<View, string> = {
  situation: "Current situation",
  targets: "Targets",
  database: "Database",
  deals: "Deal benchmarks",
  saved: "Saved",
};

const SPECIALTY_STRATEGY_NAME = "Option 2 - New specialty platform";

const WEIGHT_LEVEL: Record<string, number> = {
  "Very high": 4,
  High: 3,
  Moderate: 2,
  Low: 1,
};

const CRITERIA_DEFINITIONS: Record<string, { definition: string; calculation: string }> = {
  "Therapy-area alignment": {
    definition: "How closely the asset matches Cohaddy's expertise or a deliberate specialty-market thesis.",
    calculation: "Indication fit with cardiology, psychiatry or a clearly defined specialty platform.",
  },
  "Existing call-point leverage": {
    definition: "How much of the prescriber network can be reached through existing field relationships.",
    calculation: "Overlap with PCP, office staff, cardiology and endocrinology call points.",
  },
  "Concentrated specialist universe": {
    definition: "Whether a focused national team can cover the relevant prescribers and centers.",
    calculation: "Higher for fewer, identifiable specialist accounts; lower for broad, diffuse markets.",
  },
  "Shared corporate infrastructure": {
    definition: "How much of the new business can reuse existing company functions instead of being rebuilt.",
    calculation: "Reuse of finance, legal, compliance, regulatory, safety, HR, IT, distribution and analytics; dedicated field, medical, access and patient-support needs remain incremental.",
  },
  "Commercial-model complexity": {
    definition: "The specialized operating burden required to sell and support the product.",
    calculation: "Device or procedure training, site of care, reimbursement, market access, patient services, specialty pharmacy and medical-education needs.",
  },
  "Revenue ceiling": {
    definition: "A transaction-size and operating-scale screen based on recent annual U.S. product sales.",
    calculation: "Assets at roughly $100m or less pass the target range when U.S. sales are publicly disclosed; undisclosed products remain unquantified.",
  },
  "Transaction signal / owner feasibility": {
    definition: "Evidence that a rights deal, partnership or carve-out may be actionable.",
    calculation: "Public partnering language, reduced promotion, a commercial reset, small owner or non-core status raise the assessment.",
  },
  "Platform coherence": {
    definition: "Whether the first asset can anchor a second asset using the same specialty organization.",
    calculation: "Overlap in prescribers, territories, MSL coverage, market access, patient support and operating infrastructure.",
  },
  "Owner availability": {
    definition: "The estimated likelihood that the current rights holder would consider a transaction.",
    calculation: "Owner strategy, product priority, investment level, portfolio fit, public statements and carve-out complexity.",
  },
};

function diligenceFor(target: Target) {
  return TOP20_DILIGENCE[target.id];
}

function reportedRevenue(target: Target) {
  return diligenceFor(target)?.latestDisplay ?? "Not disclosed";
}

function reportedPeriod(target: Target) {
  return diligenceFor(target)?.latestPeriod ?? "Public product-level figure not located";
}

function short(value: string, limit = 180) {
  if (value.length <= limit) return value;
  const clipped = value.slice(0, limit);
  return `${clipped.slice(0, clipped.lastIndexOf(" "))}…`;
}

function dealMoney(value: number | null) {
  if (value === null) return "Not disclosed";
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}bn`;
  return `$${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}m`;
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function csvCell(value: string | number | null) {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportDeals(deals: DealBenchmark[]) {
  const headers = ["Date", "Asset", "Buyer", "Seller", "Therapy area", "Stage", "Structure", "Rights scope", "Guaranteed USD mm", "Contingent USD mm", "Headline USD mm", "Guaranteed terms", "Contingent terms", "Royalty / retained economics", "Sales at deal USD mm", "Other terms", "Benchmark implication", "Status", "Source"];
  const rows = deals.map((deal) => [deal.date, deal.asset, deal.buyer, deal.seller, deal.therapyArea, deal.stage, deal.structure, deal.rightsScope, deal.guaranteedUsdMm, deal.contingentUsdMm, deal.headlineUsdMm, deal.guaranteedDisplay, deal.contingentDisplay, deal.royalty, deal.salesAtDealUsdMm, deal.economics, deal.insight, deal.status, deal.sourceUrl]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "us-specialty-drug-deal-benchmarks.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function callPointChips(value: string) {
  return value
    .replace(/—/g, "-")
    .split(/;|,|\sand\s/gi)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function drugTypeFor(target: Target, catalog: Catalog) {
  const product = catalog.universe.find((item) => item.strategyAsset === target.asset);
  const classification = `${product?.productType ?? ""} ${product?.modality ?? ""}`.toLowerCase();
  const ingredient = target.ingredient.toLowerCase();

  if (classification.includes("vaccine")) return "Vaccine";
  if (classification.includes("cell") || classification.includes("gene therap")) return "Cell / gene therapy";
  if (classification.includes("biologic") || classification.includes("monoclonal") || classification.includes("blood-") || classification.includes("plasma-")) return "Biologic";
  if (classification.includes("peptide") || classification.includes("protein") || classification.includes("hormone") || classification.includes("enzyme") || ingredient === "glucagon") return "Peptide / protein";
  return "Small molecule";
}

function specialtySignalScore(product: Product) {
  const route = `${product.route} ${product.dosageForm}`.toLowerCase();
  const modality = `${product.productType} ${product.modality}`.toLowerCase();
  let score = product.mechanism ? 2 : 0;
  if (/subcutaneous|intravenous|intramuscular|inhal|implant|ophthalmic|topical|transdermal|sublingual|buccal|enteral/.test(route)) score += 3;
  if (/biologic|vaccine|peptide|protein|antibody|enzyme|cell|gene|plasma|blood/.test(modality)) score += 3;
  if (/device|kit|extended|delayed|suspension|spray|patch|film/.test(route)) score += 1;
  return score;
}

function specialtyDatabase(catalog: Catalog) {
  const ranked = catalog.targets.specialty.map((target) => {
    const source = catalog.universe.find((product) => product.strategyAsset === target.asset);
    return {
      id: source?.id ?? `specialty-${target.rank}`,
      productType: source?.productType ?? `${drugTypeFor(target, catalog)} product`,
      modality: source?.modality ?? drugTypeFor(target, catalog),
      ingredient: target.ingredient,
      brand: target.asset,
      company: target.company,
      dosageForm: source?.dosageForm ?? target.dosing,
      route: target.route,
      marketStatus: "Ranked specialty target",
      mechanism: target.mechanism,
      strategyAsset: target.asset,
      coreRank: null,
      coreScore: null,
      specialtyRank: target.rank,
      specialtyScore: target.score,
    } satisfies Product;
  });

  const rankedAssets = new Set(ranked.map((product) => product.strategyAsset));
  const broader = catalog.universe
    .filter((product) => product.mechanism && !rankedAssets.has(product.strategyAsset))
    .sort((a, b) => specialtySignalScore(b) - specialtySignalScore(a) || a.brand.localeCompare(b.brand))
    .slice(0, 61)
    .map((product) => ({ ...product, coreRank: null, coreScore: null, specialtyRank: null, specialtyScore: null }));

  return [...ranked, ...broader];
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Nav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <nav className="desktop-nav" aria-label="Primary">
      {(Object.keys(VIEW_LABELS) as View[]).map((item) => (
        <button key={item} className={view === item ? "active" : ""} onClick={() => onChange(item)}>
          {VIEW_LABELS[item]}
        </button>
      ))}
    </nav>
  );
}

function MobileNav({ view, onChange, savedCount }: { view: View; onChange: (view: View) => void; savedCount: number }) {
  const items = Object.keys(VIEW_LABELS) as View[];
  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item, index) => (
        <button key={item} className={view === item ? "active" : ""} onClick={() => onChange(item)}>
          <span>{item === "saved" && savedCount ? savedCount : String(index + 1).padStart(2, "0")}</span>
          {VIEW_LABELS[item]}
        </button>
      ))}
    </nav>
  );
}

function SituationView({ catalog, onOpenTargets, onOpenDatabase }: { catalog: Catalog; onOpenTargets: () => void; onOpenDatabase: () => void }) {
  return (
    <div className="view-stack">
      <section className="situation-intro">
        <p className="eyebrow">Option 2 · New specialty platform</p>
        <h1>Build a specialty team</h1>
        <div className="situation-copy">
          <p>Cohaddy Bio is an established life sciences company with marketed products in cardiology and psychiatry. Field teams primarily call on PCPs and supporting staff, with selective reach into cardiology and endocrinology.</p>
          <p>With a stabilized balance sheet, Cohaddy can increase EBITDA and enterprise value by acquiring a U.S. commercial asset and building a focused specialty platform around it.</p>
        </div>
      </section>

      <section className="section-block screening-section">
        <div className="section-heading">
          <div><p className="eyebrow">Asset screen</p><h2>From broad universe to specialty targets</h2></div>
          <p>Counts at every screening stage.</p>
        </div>
        <div className="screening-funnel specialty-funnel" aria-label="Screening funnel from 1,605 screened products to 20 ranked specialty-team targets">
          <div className="funnel-node funnel-stage stage-one">
            <strong>1,605</strong>
            <span>U.S. commercial products screened for specialty fit</span>
          </div>
          <div className="funnel-flow" aria-hidden="true"><i /><i /></div>
          <div className="funnel-node funnel-stage stage-two">
            <strong>635</strong>
            <span>Mechanism-classified products evaluated for a focused team</span>
          </div>
          <div className="funnel-flow compact" aria-hidden="true"><i /><i /></div>
          <button className="funnel-node funnel-stage stage-three" onClick={onOpenDatabase}>
            <strong>81</strong>
            <span>Specialty candidates with concentrated call points or support needs</span>
            <em>Browse specialty database <ArrowIcon /></em>
          </button>
          <div className="funnel-flow compact" aria-hidden="true"><i /><i /></div>
          <button className="funnel-node funnel-stage stage-four" onClick={onOpenTargets}>
            <strong>20</strong>
            <span>Ranked specialty-team targets</span>
            <em>Review targets <ArrowIcon /></em>
          </button>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow">Decision model</p><h2>Criteria and relative weights</h2></div>
          <p>Qualitative weights favor a compact, coherent specialty platform.</p>
        </div>
        <div className="weights-grid">
          {catalog.methodology.map((item) => {
            const value = item.specialty;
            const level = WEIGHT_LEVEL[value] ?? 3;
            const details = CRITERIA_DEFINITIONS[item.dimension];
            return (
              <article className="weight-row" key={item.dimension}>
                <div className="weight-summary">
                  <div><strong>{item.dimension}</strong><span>{value.replace("Target approximately ", "")}</span></div>
                  <div className="weight-meter" aria-label={`${item.dimension}: ${value}`}>
                    {[1, 2, 3, 4].map((step) => <i key={step} className={step <= level ? "filled" : ""} />)}
                  </div>
                </div>
                {details && <div className="criterion-definition">
                  <p>{details.definition}</p>
                  <small><b>Calculated from</b>{details.calculation}</small>
                </div>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow">Operating model</p><h2>Build around a platform</h2></div>
        </div>
        <div className="team-models">
          {catalog.teamModels.map((team) => (
            <article className="team-card" key={team.priority}>
              <div className="team-rank">0{team.priority}</div>
              <div><h3>{team.platform}</h3><p>{team.anchors}</p></div>
              <div className="team-numbers"><strong>{team.customerFacingMin}–{team.customerFacingMax}</strong><span>customer-facing</span></div>
              <div className="team-numbers"><strong>${team.runRateMin}–{team.runRateMax}m</strong><span>annual run-rate</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block assumptions">
        <div className="section-heading">
          <div><p className="eyebrow">Screening rules</p><h2>Assumptions and caveats</h2></div>
        </div>
        <div className="assumption-grid">
          <p><span>01</span>All 20 assets are ranked for specialty-platform fit.</p>
          <p><span>02</span>Revenue shows public facts only; no estimates or currency conversion.</p>
          <p><span>03</span>Owner willingness is not implied by strategic fit.</p>
          <p><span>04</span>Validate product P&amp;L, rights, supply and access before an offer.</p>
        </div>
      </section>
    </div>
  );
}

function TargetCard({
  target,
  drugType,
  commercialModel,
  saved,
  compared,
  onOpen,
  onSave,
  onCompare,
}: {
  target: Target;
  drugType: string;
  commercialModel: CommercialModel;
  saved: boolean;
  compared: boolean;
  onOpen: () => void;
  onSave: () => void;
  onCompare: () => void;
}) {
  const diligence = diligenceFor(target);
  return (
    <article className={`target-card ${target.rank <= 3 ? "priority" : ""}`}>
      <div className="target-topline">
        <div className="rank-score"><span>#{target.rank}</span><strong>{target.score}</strong><small>fit</small></div>
        <div className="target-name">
          <p>{target.tier}</p>
          <h3>{target.asset}</h3>
          <span>{target.therapyArea}</span>
        </div>
        <button className={`save-button ${saved ? "active" : ""}`} onClick={onSave} aria-label={`${saved ? "Remove" : "Save"} ${target.asset}`}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="deal-metrics">
        <div>
          <span>Reported revenue</span>
          <strong>{reportedRevenue(target)}</strong>
          <small>{reportedPeriod(target)}</small>
          {diligence && <em className={`disclosure-badge ${diligence.disclosure.toLowerCase().replaceAll(" ", "-")}`}>{diligence.disclosure}</em>}
        </div>
        <div className="holder-block">
          <span>U.S. rights holder</span>
          {diligence ? <a href={diligence.companyUrl} target="_blank" rel="noreferrer">{diligence.rightsHolder} ↗</a> : <strong>{target.company}</strong>}
          {diligence && <small><b>{diligence.ownership}</b>{diligence.ticker ? ` · ${diligence.ticker}` : ""}<br />Parent: {diligence.parent}</small>}
        </div>
      </div>

      <div className="team-snapshot">
        <div><span>Modeled U.S. team</span><strong>{teamTotal(commercialModel.field) + teamTotal(commercialModel.inside)}</strong><small>{commercialModel.confidence} confidence</small></div>
        <div><span>Field / inside</span><strong>{teamTotal(commercialModel.field)} / {teamTotal(commercialModel.inside)}</strong><small>standalone estimate</small></div>
        <p>{commercialModel.geographies.slice(0, 3).join(" · ")}</p>
      </div>

      <p className="fit-note">{short(target.rationale, 175)}</p>

      <div className="chip-section">
        <span className="chip-label">Primary call points</span>
        <div className="chip-row call-points">
          {callPointChips(target.callPoints).map((item) => <span className="chip" key={item}>{item}</span>)}
        </div>
      </div>
      <div className="chip-row product-facts">
        <span className="chip"><b>Drug type</b>{drugType}</span>
        <span className="chip"><b>MOA</b>{target.mechanism}</span>
        <span className="chip"><b>Route</b>{target.route}</span>
        <span className="chip"><b>Dose</b>{target.dosing}</span>
      </div>

      <div className="target-actions">
        <button className="text-action" onClick={onOpen}>Commercial model &amp; sources <ArrowIcon /></button>
        <button className={`compare-action ${compared ? "active" : ""}`} onClick={onCompare}>{compared ? "In compare" : "Compare"}</button>
        <a href={target.piUrl} target="_blank" rel="noreferrer">Prescribing info ↗</a>
      </div>
    </article>
  );
}

function TargetsView({
  catalog,
  targets,
  strategy,
  savedIds,
  compareIds,
  onOpen,
  onSave,
  onCompare,
}: {
  catalog: Catalog;
  targets: Target[];
  strategy: Strategy;
  savedIds: string[];
  compareIds: string[];
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
  onCompare: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All platforms");
  const [sort, setSort] = useState("fit");
  const platforms = useMemo(() => ["All platforms", ...Array.from(new Set(targets.map((target) => target.platform))).sort()], [targets]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const items = targets.filter((target) => {
      const matchesPlatform = platform === "All platforms" || target.platform === platform;
      const diligence = diligenceFor(target);
      const haystack = [target.asset, target.ingredient, target.company, target.therapyArea, target.callPoints, target.mechanism, diligence?.parent, diligence?.rightsHolder, diligence?.ticker, diligence?.ownership, ...(COMMERCIAL_MODELS[target.asset]?.geographies ?? [])].join(" ").toLowerCase();
      return matchesPlatform && (!needle || haystack.includes(needle));
    });
    return [...items].sort((a, b) => sort === "sales" ? (diligenceFor(b)?.sortUsdMm ?? -1) - (diligenceFor(a)?.sortUsdMm ?? -1) : a.rank - b.rank);
  }, [targets, platform, query, sort]);

  return (
    <div className="view-stack">
      <section className="page-intro compact">
        <div><p className="eyebrow">Specialty screen</p><h1>{SPECIALTY_STRATEGY_NAME} targets</h1><p>{strategy.description}</p><p className="fact-standard">Revenue uses reported facts · team sizes are clearly labeled estimates</p></div>
        <div className="intro-stat"><strong>{filtered.length}</strong><span>of 20 assets</span></div>
      </section>
      <section className="target-tools">
        <label className="search-field"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search asset, holder, therapy or geography" /></label>
        <select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Platform filter">
          {platforms.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort targets">
          <option value="fit">Sort: strategic fit</option>
          <option value="sales">Sort: annual sales</option>
        </select>
      </section>
      <section className="target-list">
        {filtered.length ? filtered.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            drugType={drugTypeFor(target, catalog)}
            commercialModel={COMMERCIAL_MODELS[target.asset]}
            saved={savedIds.includes(target.id)}
            compared={compareIds.includes(target.id)}
            onOpen={() => onOpen(target.id)}
            onSave={() => onSave(target.id)}
            onCompare={() => onCompare(target.id)}
          />
        )) : <div className="empty-state"><h2>No matches</h2><p>Try a broader search or platform.</p></div>}
      </section>
    </div>
  );
}

function DatabaseView({ catalog, onViewTarget }: { catalog: Catalog; onViewTarget: (asset: string) => void }) {
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState("All routes");
  const [visible, setVisible] = useState(48);
  const specialtyProducts = useMemo(() => specialtyDatabase(catalog), [catalog]);
  const routes = useMemo(() => ["All routes", ...Array.from(new Set(specialtyProducts.map((product) => product.route).filter(Boolean))).sort()], [specialtyProducts]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return specialtyProducts.filter((product) => {
      const matchesRoute = route === "All routes" || product.route === route;
      const haystack = [product.brand, product.ingredient, product.company, product.mechanism, product.modality].join(" ").toLowerCase();
      return matchesRoute && (!needle || haystack.includes(needle));
    }).sort((a, b) => {
      const rankA = a.specialtyRank;
      const rankB = b.specialtyRank;
      if (rankA !== null || rankB !== null) return (rankA ?? 999) - (rankB ?? 999);
      return specialtySignalScore(b) - specialtySignalScore(a) || a.brand.localeCompare(b.brand);
    });
  }, [specialtyProducts, query, route]);

  return (
    <div className="view-stack">
      <section className="page-intro compact">
        <div><p className="eyebrow">Specialty screen</p><h1>Specialty product database</h1><p>Search the 81 products screened for concentrated call points, differentiated delivery, or high-support models.</p></div>
        <div className="intro-stat"><strong>{filtered.length.toLocaleString()}</strong><span>of 81 candidates</span></div>
      </section>
      <section className="target-tools database-tools">
        <label className="search-field"><SearchIcon /><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(48); }} placeholder="Search product, ingredient, company or mechanism" /></label>
        <select value={route} onChange={(event) => { setRoute(event.target.value); setVisible(48); }} aria-label="Route filter">
          {routes.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>
      <section className="database-list">
        {filtered.slice(0, visible).map((product) => {
          const rank = product.specialtyRank;
          const score = product.specialtyScore;
          return (
            <article className={`database-row ${rank ? "linked" : ""}`} key={product.id}>
              <div className="database-name"><h3>{product.brand}</h3><span>{product.ingredient}</span></div>
              <div><span className="row-label">Company</span><strong>{product.company}</strong></div>
              <div><span className="row-label">Administration</span><strong>{product.dosageForm} · {product.route}</strong></div>
              <div><span className="row-label">Mechanism</span><strong>{short(product.mechanism ?? "Not classified", 90)}</strong></div>
              {rank && product.strategyAsset ? (
                <button className="strategy-link" onClick={() => onViewTarget(product.strategyAsset!)}><b>#{rank}</b><span>{score} fit</span><ArrowIcon /></button>
              ) : <span className="unranked">Specialty candidate</span>}
            </article>
          );
        })}
      </section>
      {visible < filtered.length && <button className="button load-more" onClick={() => setVisible((count) => count + 48)}>Show 48 more</button>}
    </div>
  );
}

function DealBenchmarksView({ catalog }: { catalog: DealBenchmarkCatalog }) {
  const [query, setQuery] = useState("");
  const [structure, setStructure] = useState("All structures");
  const [year, setYear] = useState("All years");
  const [sort, setSort] = useState("newest");
  const structures = useMemo(() => ["All structures", ...Array.from(new Set(catalog.deals.map((deal) => deal.structure))).sort()], [catalog]);
  const years = useMemo(() => ["All years", ...Array.from(new Set(catalog.deals.map((deal) => deal.date.slice(0, 4)))).sort().reverse()], [catalog]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = catalog.deals.filter((deal) => {
      const haystack = [deal.asset, deal.buyer, deal.seller, deal.therapyArea, deal.stage, deal.structure, deal.rightsScope, deal.royalty, deal.economics, deal.insight].join(" ").toLowerCase();
      return (structure === "All structures" || deal.structure === structure)
        && (year === "All years" || deal.date.startsWith(year))
        && (!needle || haystack.includes(needle));
    });
    return [...matches].sort((a, b) => sort === "guaranteed"
      ? (b.guaranteedUsdMm ?? -1) - (a.guaranteedUsdMm ?? -1)
      : sort === "headline"
        ? (b.headlineUsdMm ?? -1) - (a.headlineUsdMm ?? -1)
        : b.date.localeCompare(a.date));
  }, [catalog, query, structure, year, sort]);

  const licenseUpfronts = catalog.deals
    .filter((deal) => /license|asset purchase/i.test(deal.structure) && deal.guaranteedUsdMm !== null)
    .map((deal) => deal.guaranteedUsdMm as number);
  const medianLicenseUpfront = median(licenseUpfronts);
  const marketed = catalog.deals.filter((deal) => /marketed/i.test(deal.stage)).length;
  const backEnded = catalog.deals.filter((deal) => (deal.contingentUsdMm ?? 0) > 0 || !/^none/i.test(deal.royalty)).length;

  return (
    <div className="view-stack deal-benchmark-view">
      <section className="page-intro compact deal-intro">
        <div><p className="eyebrow">Transaction intelligence</p><h1>U.S. specialty deal benchmarks</h1><p>Compare guaranteed cash, contingent value, rights, royalties and operating obligations—not just headline value.</p><p className="fact-standard">{catalog.meta.coverage} · public terms through {catalog.meta.updated}</p></div>
        <button className="button secondary deal-export" onClick={() => exportDeals(filtered)}>Export {filtered.length} rows</button>
      </section>

      <section className="deal-summary" aria-label="Benchmark summary">
        <article><span>Transactions</span><strong>{catalog.deals.length}</strong><small>public benchmarks</small></article>
        <article><span>Marketed at signing</span><strong>{marketed}</strong><small>commercial precedents</small></article>
        <article><span>Median license upfront</span><strong>{dealMoney(medianLicenseUpfront)}</strong><small>disclosed U.S./global licenses</small></article>
        <article><span>Back-ended structures</span><strong>{backEnded}</strong><small>milestones, CVRs or royalties</small></article>
      </section>

      <section className="deal-tools">
        <label className="search-field"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search asset, party, therapy, rights or term" /></label>
        <select value={structure} onChange={(event) => setStructure(event.target.value)} aria-label="Deal structure filter">
          {structures.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Deal year filter">
          {years.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort deal benchmarks">
          <option value="newest">Sort: newest</option>
          <option value="guaranteed">Sort: guaranteed value</option>
          <option value="headline">Sort: headline value</option>
        </select>
      </section>

      <section className="deal-list" aria-live="polite">
        <div className="deal-results"><strong>{filtered.length}</strong><span>matching transactions</span></div>
        {filtered.map((deal) => (
          <article className="deal-card" key={deal.id}>
            <div className="deal-card-heading">
              <div className="deal-date"><strong>{new Date(`${deal.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</strong><span>{deal.structure}</span></div>
              <div className="deal-title"><h3>{deal.asset}</h3><p>{deal.seller} <ArrowIcon /> {deal.buyer}</p></div>
              <span className={`deal-status ${deal.status.toLowerCase().includes("terminat") ? "terminated" : ""}`}>{deal.status}</span>
            </div>

            <div className="deal-tags"><span>{deal.therapyArea}</span><span>{deal.stage}</span></div>

            <div className="deal-economics">
              <div><span>Guaranteed</span><strong>{deal.guaranteedDisplay}</strong></div>
              <div><span>Contingent</span><strong>{deal.contingentDisplay}</strong></div>
              <div><span>Rights</span><strong>{deal.rightsScope}</strong></div>
            </div>

            <div className="deal-detail-grid">
              <div><span>Royalty / retained economics</span><p>{deal.royalty}</p></div>
              <div><span>Other transaction terms</span><p>{deal.economics}</p></div>
            </div>

            <div className="deal-takeaway"><span>Why it matters</span><p>{deal.insight}</p></div>
            <a className="deal-source" href={deal.sourceUrl} target="_blank" rel="noreferrer">Review {deal.sourceLabel} terms <ArrowIcon /></a>
          </article>
        ))}
        {!filtered.length && <div className="empty-state"><h2>No matching deals</h2><p>Broaden the search or filters.</p></div>}
      </section>

      <section className="deal-method">
        <p className="eyebrow">How to use this set</p>
        <h2>Normalize before negotiating</h2>
        <div>
          <p><b>01</b>Separate cash at close from milestones, CVRs and royalties.</p>
          <p><b>02</b>Adjust for stage, rights geography, debt, supply, working capital and required launch spend.</p>
          <p><b>03</b>For marketed assets, compare price to net sales and contribution profit—not gross sales alone.</p>
          <p><b>04</b>Model reversion, termination, change-of-control and supply-transfer terms before valuing the back end.</p>
        </div>
      </section>
    </div>
  );
}

function SavedView({
  catalog,
  targets,
  savedIds,
  compareIds,
  onOpen,
  onSave,
  onCompare,
  onBrowse,
}: {
  catalog: Catalog;
  targets: Target[];
  savedIds: string[];
  compareIds: string[];
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
  onCompare: (id: string) => void;
  onBrowse: () => void;
}) {
  const saved = targets.filter((target) => savedIds.includes(target.id));
  return (
    <div className="view-stack">
      <section className="page-intro compact">
        <div><p className="eyebrow">Specialty screen</p><h1>Saved · {SPECIALTY_STRATEGY_NAME}</h1><p>Keep the decision set tight.</p></div>
        <div className="intro-stat"><strong>{saved.length}</strong><span>saved assets</span></div>
      </section>
      {saved.length ? (
        <section className="target-list">
          {saved.map((target) => (
            <TargetCard key={target.id} target={target} drugType={drugTypeFor(target, catalog)} commercialModel={COMMERCIAL_MODELS[target.asset]} saved compared={compareIds.includes(target.id)} onOpen={() => onOpen(target.id)} onSave={() => onSave(target.id)} onCompare={() => onCompare(target.id)} />
          ))}
        </section>
      ) : (
        <section className="empty-state saved-empty"><span>0</span><h2>No saved assets for this option</h2><p>Save the few worth a closer look.</p><button className="button primary" onClick={onBrowse}>Review targets</button></section>
      )}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="detail-row"><span>{label}</span><p>{children}</p></div>;
}

function RevenueHistory({ diligence }: { diligence: AssetDiligence }) {
  return (
    <section className="revenue-diligence">
      <div className="diligence-heading">
        <div><span>Revenue diligence</span><h3>Publicly reported history</h3></div>
        <span className={`disclosure-badge ${diligence.disclosure.toLowerCase().replaceAll(" ", "-")}`}>{diligence.disclosure}</span>
      </div>
      {diligence.revenueFacts.length ? (
        <div className="revenue-table" role="table" aria-label="Reported revenue history">
          {diligence.revenueFacts.map((fact) => (
            <div className="revenue-row" role="row" key={`${fact.period}-${fact.value}`}>
              <strong role="cell">{fact.period}</strong>
              <b role="cell">{fact.value}</b>
              <p role="cell">{fact.scope}</p>
              <span role="cell" className="fact-sources">
                {fact.sourceIds.map((sourceId) => {
                  const index = diligence.sources.findIndex((source) => source.id === sourceId);
                  const source = diligence.sources[index];
                  return source ? <a href={source.url} target="_blank" rel="noreferrer" aria-label={source.label} key={source.id}>[{index + 1}]</a> : null;
                })}
              </span>
            </div>
          ))}
        </div>
      ) : <p className="no-revenue">No product-level annual revenue was publicly disclosed.</p>}
      {diligence.notes.length > 0 && <div className="diligence-notes">{diligence.notes.map((note) => <p key={note}>{note}</p>)}</div>}
      <div className="source-list">
        <span>Sources</span>
        <ol>
          {diligence.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}
        </ol>
      </div>
    </section>
  );
}

function CommercialModelDetail({ model }: { model: CommercialModel }) {
  const fieldTotal = teamTotal(model.field);
  const insideTotal = teamTotal(model.inside);

  return (
    <section className="commercial-model-detail">
      <div className="commercial-model-heading">
        <div><span>Modeled standalone U.S. team</span><strong>{fieldTotal + insideTotal} roles</strong></div>
        <b className={`confidence-badge ${model.confidence.toLowerCase()}`}>{model.confidence} confidence</b>
      </div>
      <div className="team-role-groups">
        <div>
          <h3><span>{fieldTotal}</span>Field</h3>
          <dl>{model.field.map((item) => <div key={item.role}><dt>{item.role}</dt><dd>{item.count}</dd></div>)}</dl>
        </div>
        <div>
          <h3><span>{insideTotal}</span>Inside</h3>
          <dl>{model.inside.map((item) => <div key={item.role}><dt>{item.role}</dt><dd>{item.count}</dd></div>)}</dl>
        </div>
      </div>
      <div className="model-geographies">
        <span>Priority geographies</span>
        <div>{model.geographies.map((item) => <b key={item}>{item}</b>)}</div>
        <p>{model.geographyMethod}</p>
      </div>
      <div className="model-method">
        <div><span>Observed evidence</span><p>{model.evidence}</p></div>
        <div><span>Estimation method</span><p>{model.method}</p></div>
        {model.note && <div><span>Operating note</span><p>{model.note}</p></div>}
        <div className="model-sources"><span>Sources</span>{model.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>
      </div>
    </section>
  );
}

function TargetDrawer({ target, onClose, saved, onSave }: { target: Target; onClose: () => void; saved: boolean; onSave: () => void }) {
  const diligence = diligenceFor(target);
  const commercialModel = COMMERCIAL_MODELS[target.asset];
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    document.body.classList.add("overlay-open");
    return () => {
      window.removeEventListener("keydown", close);
      document.body.classList.remove("overlay-open");
    };
  }, [onClose]);

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={`${target.asset} deal brief`}>
        <div className="drawer-header">
          <div><p className="eyebrow">#{target.rank} · {target.score} fit</p><h2>{target.asset}</h2><span>{target.tier}</span></div>
          <button className="close-button" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="drawer-summary">
          <div><span>Reported revenue</span><strong>{reportedRevenue(target)}</strong><small>{reportedPeriod(target)}</small></div>
          <div><span>U.S. rights holder</span>{diligence ? <a href={diligence.companyUrl} target="_blank" rel="noreferrer">{diligence.rightsHolder} ↗</a> : <strong>{target.company}</strong>}{diligence && <small>{diligence.ownership}{diligence.ticker ? ` · ${diligence.ticker}` : ""}</small>}</div>
        </div>
        <div className="drawer-body">
          {diligence && <>
            <DetailRow label="Ownership"><b>{diligence.ownership}</b>{diligence.ticker ? ` · ${diligence.ticker}` : ""}<br />Parent: {diligence.parent}</DetailRow>
            <DetailRow label="Commercial status">{diligence.launch}<br />{diligence.indicationSplit}</DetailRow>
            <RevenueHistory diligence={diligence} />
          </>}
          <DetailRow label="Why it fits">{target.rationale}</DetailRow>
          <DetailRow label="Primary call points"><span className="inline-chips">{callPointChips(target.callPoints).map((item) => <b key={item}>{item}</b>)}</span></DetailRow>
          <DetailRow label="Product"><span className="inline-chips"><b>{target.mechanism}</b><b>{target.route}</b><b>{target.dosing}</b></span></DetailRow>
          <DetailRow label="Team fit">{target.teamFit}</DetailRow>
          {commercialModel && <CommercialModelDetail model={commercialModel} />}
          <DetailRow label="Transaction signal">{target.transactionSignal}</DetailRow>
          <DetailRow label="Validate next">{target.risks}</DetailRow>
        </div>
        <div className="drawer-actions">
          <button className={`button ${saved ? "secondary" : "primary"}`} onClick={onSave}>{saved ? "Remove from saved" : "Save asset"}</button>
          <a className="button secondary" href={target.piUrl} target="_blank" rel="noreferrer">Prescribing info ↗</a>
        </div>
      </aside>
    </div>
  );
}

function ComparePanel({ targets, onClose, onRemove }: { targets: Target[]; onClose: () => void; onRemove: (id: string) => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    document.body.classList.add("overlay-open");
    return () => {
      window.removeEventListener("keydown", close);
      document.body.classList.remove("overlay-open");
    };
  }, [onClose]);

  return (
    <div className="overlay compare-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="compare-panel" role="dialog" aria-modal="true" aria-label="Compare assets">
        <div className="compare-header"><div><p className="eyebrow">Side by side</p><h2>Compare {targets.length} assets</h2></div><button className="close-button" onClick={onClose} aria-label="Close"><CloseIcon /></button></div>
        <div className="compare-grid">
          {targets.map((target) => (
            <article className="compare-column" key={target.id}>
              <button className="remove-compare" onClick={() => onRemove(target.id)}>Remove</button>
              <span className="compare-rank">#{target.rank} · {target.score} fit</span>
              <h3>{target.asset}</h3>
              <p>{target.therapyArea}</p>
              <dl>
                <div><dt>Reported revenue</dt><dd>{reportedRevenue(target)}<small>{reportedPeriod(target)}</small></dd></div>
                <div><dt>Rights holder</dt><dd>{diligenceFor(target)?.rightsHolder ?? target.company}<small>{diligenceFor(target)?.ownership}{diligenceFor(target)?.ticker ? ` · ${diligenceFor(target)?.ticker}` : ""}</small></dd></div>
                <div><dt>Call points</dt><dd>{target.callPoints}</dd></div>
                <div><dt>Mechanism</dt><dd>{target.mechanism}</dd></div>
                <div><dt>Modeled U.S. team</dt><dd>{COMMERCIAL_MODELS[target.asset] ? `${teamTotal(COMMERCIAL_MODELS[target.asset].field) + teamTotal(COMMERCIAL_MODELS[target.asset].inside)} total · ${teamTotal(COMMERCIAL_MODELS[target.asset].field)} field · ${teamTotal(COMMERCIAL_MODELS[target.asset].inside)} inside` : target.teamFit}</dd></div>
                <div><dt>Validate</dt><dd>{target.risks}</dd></div>
              </dl>
              <a href={target.piUrl} target="_blank" rel="noreferrer">Prescribing info ↗</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AcquisitionApp() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [dealCatalog, setDealCatalog] = useState<DealBenchmarkCatalog | null>(null);
  const [loadError, setLoadError] = useState(false);
  const strategyKey: StrategyKey = "specialty";
  const [view, setView] = useState<View>("situation");
  const [hydrated, setHydrated] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<Record<StrategyKey, string[]>>({ core: [], specialty: [] });
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(new URL("data/catalog.json", window.location.href).toString()),
      fetch(new URL("data/deal-benchmarks.json", window.location.href).toString()),
    ])
      .then(async ([catalogResponse, dealResponse]) => {
        if (!catalogResponse.ok || !dealResponse.ok) throw new Error("Data unavailable");
        return Promise.all([catalogResponse.json() as Promise<Catalog>, dealResponse.json() as Promise<DealBenchmarkCatalog>]);
      })
      .then(([catalogData, dealData]) => {
        setCatalog(catalogData);
        setDealCatalog(dealData);
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get("view");
      if (urlView && urlView in VIEW_LABELS) setView(urlView as View);
      try {
        const saved = JSON.parse(localStorage.getItem("cohaddy-saved") ?? "[]");
        const compare = JSON.parse(localStorage.getItem("cohaddy-compare") ?? "{}");
        if (Array.isArray(saved)) setSavedIds(saved);
        setCompareIds({
          core: Array.isArray(compare.core) ? compare.core.slice(0, 3) : [],
          specialty: Array.isArray(compare.specialty) ? compare.specialty.slice(0, 3) : [],
        });
      } catch {
        setSavedIds([]);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (view !== "situation") params.set("view", view);
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [hydrated, view]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cohaddy-saved", JSON.stringify(savedIds));
  }, [hydrated, savedIds]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cohaddy-compare", JSON.stringify(compareIds));
  }, [hydrated, compareIds]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const targets = catalog?.targets[strategyKey] ?? [];
  const strategy = catalog?.strategies[strategyKey];
  const activeCompareIds = compareIds[strategyKey];
  const selectedTarget = targets.find((target) => target.id === selectedTargetId) ?? null;
  const comparedTargets = targets.filter((target) => activeCompareIds.includes(target.id));

  function changeView(next: View) {
    setSelectedTargetId(null);
    setCompareOpen(false);
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleSaved(id: string) {
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      const active = current[strategyKey];
      if (active.includes(id)) return { ...current, [strategyKey]: active.filter((item) => item !== id) };
      if (active.length >= 3) {
        setToast("Compare up to 3 assets");
        return current;
      }
      return { ...current, [strategyKey]: [...active, id] };
    });
  }

  function viewTarget(asset: string) {
    const target = targets.find((item) => item.asset === asset);
    setSelectedTargetId(null);
    setCompareOpen(false);
    setView("targets");
    if (target) window.setTimeout(() => setSelectedTargetId(target.id), 0);
  }

  if (loadError) {
    return <main className="loading-screen"><div className="brand-mark">CB</div><h1>Strategy data is unavailable</h1><p>Refresh to try again.</p></main>;
  }

  if (!catalog || !strategy || !dealCatalog) {
    return <main className="loading-screen"><div className="brand-mark">CB</div><p className="eyebrow">Cohaddy Bio</p><h1>Preparing the strategy room</h1><div className="loading-line"><span /></div></main>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => changeView("situation")} aria-label="Cohaddy Bio strategy home">
          <span className="brand-mark">CB</span>
          <span><strong>Cohaddy Bio</strong><small>Specialty build</small></span>
        </button>
        <Nav view={view} onChange={changeView} />
        <div className="strategy-badge"><span>Option 2</span>New specialty platform</div>
      </header>

      <main className="page-shell">
        {view === "situation" && <SituationView catalog={catalog} onOpenTargets={() => changeView("targets")} onOpenDatabase={() => changeView("database")} />}
        {view === "targets" && <TargetsView catalog={catalog} targets={targets} strategy={strategy} savedIds={savedIds} compareIds={activeCompareIds} onOpen={setSelectedTargetId} onSave={toggleSaved} onCompare={toggleCompare} />}
        {view === "database" && <DatabaseView catalog={catalog} onViewTarget={viewTarget} />}
        {view === "deals" && <DealBenchmarksView catalog={dealCatalog} />}
        {view === "saved" && <SavedView catalog={catalog} targets={targets} savedIds={savedIds} compareIds={activeCompareIds} onOpen={setSelectedTargetId} onSave={toggleSaved} onCompare={toggleCompare} onBrowse={() => changeView("targets")} />}
      </main>

      {activeCompareIds.length > 0 && (
        <div className="compare-tray">
          <div><span>{activeCompareIds.length}</span><strong>Ready to compare</strong></div>
          <button onClick={() => setCompareOpen(true)}>Compare assets <ArrowIcon /></button>
        </div>
      )}
      <MobileNav view={view} onChange={changeView} savedCount={targets.filter((target) => savedIds.includes(target.id)).length} />
      {selectedTarget && <TargetDrawer target={selectedTarget} onClose={() => setSelectedTargetId(null)} saved={savedIds.includes(selectedTarget.id)} onSave={() => toggleSaved(selectedTarget.id)} />}
      {compareOpen && <ComparePanel targets={comparedTargets} onClose={() => setCompareOpen(false)} onRemove={toggleCompare} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
