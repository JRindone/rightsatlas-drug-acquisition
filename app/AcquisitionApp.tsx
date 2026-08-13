"use client";

import { useEffect, useMemo, useState } from "react";

type StrategyKey = "core" | "specialty";
type View = "situation" | "targets" | "database" | "saved";

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

const VIEW_LABELS: Record<View, string> = {
  situation: "Current situation",
  targets: "Targets",
  database: "Database",
  saved: "Saved",
};

const STRATEGY_NAMES: Record<StrategyKey, string> = {
  core: "Option 1 - Current platform",
  specialty: "Option 2 - New specialty platform",
};

const WEIGHT_LEVEL: Record<string, number> = {
  "Very high": 4,
  High: 3,
  Moderate: 2,
  Low: 1,
};

function money(value: number | null) {
  if (value === null || Number.isNaN(value)) return "Not profiled";
  if (value < 1) return `$${value.toFixed(1)}m`;
  if (value < 10) return `$${value.toFixed(1)}m`;
  return `$${Math.round(value)}m`;
}

function short(value: string, limit = 180) {
  if (value.length <= limit) return value;
  const clipped = value.slice(0, limit);
  return `${clipped.slice(0, clipped.lastIndexOf(" "))}…`;
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

function StrategyToggle({ value, onChange }: { value: StrategyKey; onChange: (next: StrategyKey) => void }) {
  return (
    <div className="strategy-toggle" aria-label="Strategy option">
      <button className={value === "core" ? "active" : ""} onClick={() => onChange("core")}>
        <span>Option 1</span>
        Current platform
      </button>
      <button className={value === "specialty" ? "active" : ""} onClick={() => onChange("specialty")}>
        <span>Option 2</span>
        New specialty platform
      </button>
    </div>
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
  return (
    <nav className="mobile-nav" aria-label="Primary">
      {(Object.keys(VIEW_LABELS) as View[]).map((item) => (
        <button key={item} className={view === item ? "active" : ""} onClick={() => onChange(item)}>
          <span>{item === "saved" && savedCount ? savedCount : item === "situation" ? "01" : item === "targets" ? "02" : item === "database" ? "03" : "04"}</span>
          {VIEW_LABELS[item]}
        </button>
      ))}
    </nav>
  );
}

function SituationView({
  catalog,
  strategyKey,
  onStrategyChange,
}: {
  catalog: Catalog;
  strategyKey: StrategyKey;
  onStrategyChange: (strategy: StrategyKey) => void;
}) {
  return (
    <div className="view-stack">
      <section className="situation-intro">
        <p className="eyebrow">CEO decision frame</p>
        <h1>Current situation</h1>
        <div className="situation-copy">
          <p>Cohaddy Bio is an established life sciences company with marketed products in cardiology and psychiatry.</p>
          <p>Field teams primarily call on PCPs and supporting staff, with selective reach into cardiology and endocrinology.</p>
          <p>Under experienced leadership, Cohaddy recently stabilized its balance sheet and is positioned to increase EBITDA and enterprise value by acquiring a U.S. commercial asset or its rights.</p>
        </div>
      </section>

      <section className="section-block screening-section">
        <div className="section-heading">
          <div><p className="eyebrow">Asset screen</p><h2>Assets were screened as follows</h2></div>
          <p>One eligible universe. Two independent rankings.</p>
        </div>
        <div className="screening-funnel" aria-label="Screening funnel from 1,605 eligible products to two independent Top 20 strategy lists">
          <div className="funnel-node funnel-start">
            <strong>1,605</strong>
            <span>FDA-approved, non-generic, non-oncology U.S. products</span>
          </div>
          <div className="funnel-flow" aria-hidden="true"><i /><i /></div>
          <div className="funnel-filters">
            <span>Commercial asset</span>
            <span>≈ $100m or less annual sales</span>
            <span>Plausible rights path</span>
            <span>Call-point or specialty-platform fit</span>
          </div>
          <div className="funnel-flow compact" aria-hidden="true"><i /><i /></div>
          <div className="funnel-split" aria-hidden="true"><span /><i /><span /></div>
          <p className="strategy-instruction"><strong>Two independent options exist.</strong> Click a strategy to view its scoring weights, operating model and ranked results across the app.</p>
          <div className="funnel-outcomes">
            <button className={strategyKey === "core" ? "active" : ""} onClick={() => onStrategyChange("core")}>
              <span>{STRATEGY_NAMES.core}</span><strong>Acquire into current call points</strong><small>Use existing PCP, staff, cardiology and psychiatry reach; add only missing specialist capacity.</small>
            </button>
            <button className={strategyKey === "specialty" ? "active" : ""} onClick={() => onStrategyChange("specialty")}>
              <span>{STRATEGY_NAMES.specialty}</span><strong>Build a focused specialty team</strong><small>Stand up dedicated field, medical, access and patient-support capabilities around a coherent franchise.</small>
            </button>
          </div>
          <p className="funnel-overlap"><strong>15</strong> assets appear in both lists and are scored separately.</p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow">Decision model</p><h2>Criteria and relative weights</h2></div>
          <p>Weights change with the active option.</p>
        </div>
        <div className="weights-grid">
          {catalog.methodology.map((item) => {
            const value = item[strategyKey];
            const level = WEIGHT_LEVEL[value] ?? 3;
            return (
              <article className="weight-row" key={item.dimension} title={item.interpretation}>
                <div><strong>{item.dimension}</strong><span>{value.replace("Target approximately ", "")}</span></div>
                <div className="weight-meter" aria-label={`${item.dimension}: ${value}`}>
                  {[1, 2, 3, 4].map((step) => <i key={step} className={step <= level ? "filled" : ""} />)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow">Operating model</p><h2>{strategyKey === "core" ? "Use what already works" : "Build around a platform"}</h2></div>
        </div>
        {strategyKey === "core" ? (
          <div className="operating-grid">
            <article className="surface"><span>Use now</span><strong>Primary care + office staff</strong><p>Activate current GP, nurse, NP and PA relationships.</p></article>
            <article className="surface"><span>Extend</span><strong>Cardiology + endocrinology</strong><p>Focus existing selective influence on high-value accounts.</p></article>
            <article className="surface"><span>Add only</span><strong>Specialist gaps</strong><p>Build territories, MSLs and access capacity only where overlap is weak.</p></article>
          </div>
        ) : (
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
        )}
      </section>

      <section className="section-block assumptions">
        <div className="section-heading">
          <div><p className="eyebrow">Screening rules</p><h2>Assumptions and caveats</h2></div>
        </div>
        <div className="assumption-grid">
          <p><span>01</span>Each option is ranked independently.</p>
          <p><span>02</span>Sales, team size and run-rate are screening estimates.</p>
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
  saved,
  compared,
  onOpen,
  onSave,
  onCompare,
}: {
  target: Target;
  drugType: string;
  saved: boolean;
  compared: boolean;
  onOpen: () => void;
  onSave: () => void;
  onCompare: () => void;
}) {
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
        <div><span>Annual sales</span><strong>{money(target.revenueUsdMm)}</strong><small>{target.period}</small></div>
        <div><span>U.S. rights holder</span><strong>{target.company}</strong></div>
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
        <button className="text-action" onClick={onOpen}>Open deal brief <ArrowIcon /></button>
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
      const haystack = [target.asset, target.ingredient, target.company, target.therapyArea, target.callPoints, target.mechanism].join(" ").toLowerCase();
      return matchesPlatform && (!needle || haystack.includes(needle));
    });
    return [...items].sort((a, b) => sort === "sales" ? (b.revenueUsdMm ?? -1) - (a.revenueUsdMm ?? -1) : a.rank - b.rank);
  }, [targets, platform, query, sort]);

  return (
    <div className="view-stack">
      <section className="page-intro compact">
        <div><p className="eyebrow">Active strategy</p><h1>{STRATEGY_NAMES[targets[0]?.strategy ?? "core"]} targets</h1><p>{strategy.description}</p></div>
        <div className="intro-stat"><strong>{filtered.length}</strong><span>of 20 assets</span></div>
      </section>
      <section className="target-tools">
        <label className="search-field"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search asset, holder, therapy or call point" /></label>
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

function DatabaseView({ catalog, strategyKey, onViewTarget }: { catalog: Catalog; strategyKey: StrategyKey; onViewTarget: (asset: string) => void }) {
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState("All routes");
  const [visible, setVisible] = useState(48);
  const routes = useMemo(() => ["All routes", ...Array.from(new Set(catalog.universe.map((product) => product.route).filter(Boolean))).sort()], [catalog.universe]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalog.universe.filter((product) => {
      const matchesRoute = route === "All routes" || product.route === route;
      const haystack = [product.brand, product.ingredient, product.company, product.mechanism, product.modality].join(" ").toLowerCase();
      return matchesRoute && (!needle || haystack.includes(needle));
    }).sort((a, b) => {
      const rankA = strategyKey === "core" ? a.coreRank : a.specialtyRank;
      const rankB = strategyKey === "core" ? b.coreRank : b.specialtyRank;
      if (rankA !== null || rankB !== null) return (rankA ?? 999) - (rankB ?? 999);
      return a.brand.localeCompare(b.brand);
    });
  }, [catalog.universe, query, route, strategyKey]);

  return (
    <div className="view-stack">
      <section className="page-intro compact">
        <div><p className="eyebrow">Wider screen</p><h1>Product database</h1><p>Search the full U.S. product universe behind the strategy screen.</p></div>
        <div className="intro-stat"><strong>{filtered.length.toLocaleString()}</strong><span>of {catalog.meta.products.toLocaleString()}</span></div>
      </section>
      <section className="target-tools database-tools">
        <label className="search-field"><SearchIcon /><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(48); }} placeholder="Search product, ingredient, company or mechanism" /></label>
        <select value={route} onChange={(event) => { setRoute(event.target.value); setVisible(48); }} aria-label="Route filter">
          {routes.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>
      <section className="database-list">
        {filtered.slice(0, visible).map((product) => {
          const rank = strategyKey === "core" ? product.coreRank : product.specialtyRank;
          const score = strategyKey === "core" ? product.coreScore : product.specialtyScore;
          return (
            <article className={`database-row ${rank ? "linked" : ""}`} key={product.id}>
              <div className="database-name"><h3>{product.brand}</h3><span>{product.ingredient}</span></div>
              <div><span className="row-label">Company</span><strong>{product.company}</strong></div>
              <div><span className="row-label">Administration</span><strong>{product.dosageForm} · {product.route}</strong></div>
              <div><span className="row-label">Mechanism</span><strong>{short(product.mechanism ?? "Not classified", 90)}</strong></div>
              {rank && product.strategyAsset ? (
                <button className="strategy-link" onClick={() => onViewTarget(product.strategyAsset!)}><b>#{rank}</b><span>{score} fit</span><ArrowIcon /></button>
              ) : <span className="unranked">Wider universe</span>}
            </article>
          );
        })}
      </section>
      {visible < filtered.length && <button className="button load-more" onClick={() => setVisible((count) => count + 48)}>Show 48 more</button>}
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
        <div><p className="eyebrow">Active strategy</p><h1>Saved · {STRATEGY_NAMES[targets[0]?.strategy ?? "core"]}</h1><p>Keep the decision set tight.</p></div>
        <div className="intro-stat"><strong>{saved.length}</strong><span>saved assets</span></div>
      </section>
      {saved.length ? (
        <section className="target-list">
          {saved.map((target) => (
            <TargetCard key={target.id} target={target} drugType={drugTypeFor(target, catalog)} saved compared={compareIds.includes(target.id)} onOpen={() => onOpen(target.id)} onSave={() => onSave(target.id)} onCompare={() => onCompare(target.id)} />
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

function TargetDrawer({ target, onClose, saved, onSave }: { target: Target; onClose: () => void; saved: boolean; onSave: () => void }) {
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
          <div><span>Annual sales</span><strong>{money(target.revenueUsdMm)}</strong><small>{target.period}</small></div>
          <div><span>U.S. rights holder</span><strong>{target.company}</strong></div>
        </div>
        <div className="drawer-body">
          <DetailRow label="Why it fits">{target.rationale}</DetailRow>
          <DetailRow label="Primary call points"><span className="inline-chips">{callPointChips(target.callPoints).map((item) => <b key={item}>{item}</b>)}</span></DetailRow>
          <DetailRow label="Product"><span className="inline-chips"><b>{target.mechanism}</b><b>{target.route}</b><b>{target.dosing}</b></span></DetailRow>
          <DetailRow label="Team model">{target.teamFit}</DetailRow>
          <DetailRow label="Transaction signal">{target.transactionSignal}</DetailRow>
          <DetailRow label="Validate next">{target.risks}</DetailRow>
          <DetailRow label="Sales assumption">{target.revenueAssumption}</DetailRow>
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
                <div><dt>Annual sales</dt><dd>{money(target.revenueUsdMm)}</dd></div>
                <div><dt>Rights holder</dt><dd>{target.company}</dd></div>
                <div><dt>Call points</dt><dd>{target.callPoints}</dd></div>
                <div><dt>Mechanism</dt><dd>{target.mechanism}</dd></div>
                <div><dt>Team</dt><dd>{target.teamFit}</dd></div>
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
  const [loadError, setLoadError] = useState(false);
  const [strategyKey, setStrategyKey] = useState<StrategyKey>("core");
  const [view, setView] = useState<View>("situation");
  const [hydrated, setHydrated] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<Record<StrategyKey, string[]>>({ core: [], specialty: [] });
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(new URL("data/catalog.json", window.location.href).toString())
      .then((response) => {
        if (!response.ok) throw new Error("Data unavailable");
        return response.json();
      })
      .then((data: Catalog) => setCatalog(data))
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const urlStrategy = params.get("strategy");
      const urlView = params.get("view");
      const storedStrategy = localStorage.getItem("cohaddy-strategy");
      if (urlStrategy === "specialty" || urlStrategy === "core") setStrategyKey(urlStrategy);
      else if (storedStrategy === "specialty" || storedStrategy === "core") setStrategyKey(storedStrategy);
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
    localStorage.setItem("cohaddy-strategy", strategyKey);
    const params = new URLSearchParams();
    if (strategyKey !== "core") params.set("strategy", strategyKey);
    if (view !== "situation") params.set("view", view);
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [hydrated, strategyKey, view]);

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

  function changeStrategy(next: StrategyKey) {
    setSelectedTargetId(null);
    setCompareOpen(false);
    setStrategyKey(next);
    setToast(`${STRATEGY_NAMES[next]} selected`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  if (!catalog || !strategy) {
    return <main className="loading-screen"><div className="brand-mark">CB</div><p className="eyebrow">Cohaddy Bio</p><h1>Preparing the strategy room</h1><div className="loading-line"><span /></div></main>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => changeView("situation")} aria-label="Cohaddy Bio strategy home">
          <span className="brand-mark">CB</span>
          <span><strong>Cohaddy Bio</strong><small>Asset strategy</small></span>
        </button>
        <Nav view={view} onChange={changeView} />
        <StrategyToggle value={strategyKey} onChange={changeStrategy} />
      </header>

      <main className="page-shell">
        {view === "situation" && <SituationView catalog={catalog} strategyKey={strategyKey} onStrategyChange={changeStrategy} />}
        {view === "targets" && <TargetsView catalog={catalog} targets={targets} strategy={strategy} savedIds={savedIds} compareIds={activeCompareIds} onOpen={setSelectedTargetId} onSave={toggleSaved} onCompare={toggleCompare} />}
        {view === "database" && <DatabaseView catalog={catalog} strategyKey={strategyKey} onViewTarget={viewTarget} />}
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
