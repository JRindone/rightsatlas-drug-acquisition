"use client";

import { useEffect, useMemo, useState } from "react";

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
};

type Target = {
  asset: string;
  therapyArea: string;
  company: string;
  revenueUsdMm: number | null;
  period: string;
  callPoints: string;
  transactionSignal: string;
  piUrl: string;
};

type Catalog = {
  meta: { products: number };
  universe: Product[];
  targets: { core: Target[]; specialty: Target[] };
};

type Weights = {
  modality: number;
  delivery: number;
  mechanism: number;
  keywords: number;
};

type RankedProduct = Product & {
  category: string;
  routeGroup: string;
  score: number;
  target: Target | null;
  advanced: boolean;
  complex: boolean;
};

const DEFAULT_WEIGHTS: Weights = { modality: 2, delivery: 3, mechanism: 3, keywords: 5 };

function modalityCategory(product: Product) {
  const text = `${product.productType} ${product.modality}`.toLowerCase();
  if (text.includes("vaccine")) return "Vaccine";
  if (/biologic|antibody|protein|peptide|enzyme|hormone|plasma|blood|cell|gene/.test(text)) return "Biologic / advanced";
  if (/small molecule|chemically defined|prescription nda/.test(text)) return "Small molecule";
  return "Other";
}

function routeGroup(product: Product) {
  const text = `${product.route} ${product.dosageForm}`.toLowerCase();
  if (/oral|buccal|sublingual|enteral/.test(text)) return "Oral";
  if (/intravenous|intramuscular|subcutaneous|injection|infusion/.test(text)) return "Injectable";
  if (/topical|transdermal|cream|gel|patch/.test(text)) return "Topical / transdermal";
  if (/inhal|nasal/.test(text)) return "Inhaled / nasal";
  if (/ophthalmic|ocular/.test(text)) return "Ophthalmic";
  return "Other";
}

function hasComplexDelivery(product: Product) {
  const text = `${product.route} ${product.dosageForm}`.toLowerCase();
  const oralOnly = /^oral(?:-\d+)?$/.test(product.route.trim().toLowerCase());
  return !oralOnly || /implant|device|kit|extended|delayed|suspension|spray|patch|film|infusion|injection/.test(text);
}

function sales(value: number | null) {
  if (value === null) return "Not profiled";
  if (value < 1) return `$${value.toFixed(1)}m`;
  if (value < 10) return `$${value.toFixed(1)}m`;
  return `$${Math.round(value)}m`;
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function WeightControl({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="weight-control">
      <span>{label}<b>{value}</b></span>
      <input type="range" min="0" max="5" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export function AssetScreenerApp() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [query, setQuery] = useState("");
  const [priorityKeywords, setPriorityKeywords] = useState("");
  const [modality, setModality] = useState("All modalities");
  const [route, setRoute] = useState("All routes");
  const [salesLimit, setSalesLimit] = useState("all");
  const [mustMechanism, setMustMechanism] = useState(false);
  const [mustAdvanced, setMustAdvanced] = useState(false);
  const [mustComplex, setMustComplex] = useState(false);
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const [sort, setSort] = useState("score");
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [shortlistReady, setShortlistReady] = useState(false);
  const [visible, setVisible] = useState(40);

  useEffect(() => {
    fetch(new URL("data/catalog.json", window.location.href).toString())
      .then((response) => response.json())
      .then((data: Catalog) => setCatalog(data));
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("asset-screener-shortlist") ?? "[]");
        if (Array.isArray(saved)) setShortlist(saved);
      } catch {
        setShortlist([]);
      }
      setShortlistReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shortlistReady) return;
    localStorage.setItem("asset-screener-shortlist", JSON.stringify(shortlist));
  }, [shortlist, shortlistReady]);

  const targetMap = useMemo(() => {
    const map = new Map<string, Target>();
    if (!catalog) return map;
    [...catalog.targets.specialty, ...catalog.targets.core].forEach((target) => {
      if (!map.has(target.asset.toLowerCase())) map.set(target.asset.toLowerCase(), target);
    });
    return map;
  }, [catalog]);

  const rankedProducts = useMemo(() => {
    if (!catalog) return [];
    const terms = priorityKeywords.toLowerCase().split(/[,;]+/).map((term) => term.trim()).filter(Boolean);
    return catalog.universe.map((product): RankedProduct => {
      const category = modalityCategory(product);
      const productRoute = routeGroup(product);
      const advanced = category === "Biologic / advanced" || category === "Vaccine";
      const complex = hasComplexDelivery(product);
      const target = product.strategyAsset ? targetMap.get(product.strategyAsset.toLowerCase()) ?? null : targetMap.get(product.brand.toLowerCase()) ?? null;
      const haystack = [product.brand, product.ingredient, product.company, product.mechanism, product.modality, target?.therapyArea, target?.callPoints].filter(Boolean).join(" ").toLowerCase();
      const keywordMatch = terms.length > 0 && terms.some((term) => haystack.includes(term));
      const factors = [
        { weight: weights.modality, match: advanced },
        { weight: weights.delivery, match: complex },
        { weight: weights.mechanism, match: Boolean(product.mechanism) },
        ...(terms.length ? [{ weight: weights.keywords, match: keywordMatch }] : []),
      ];
      const denominator = factors.reduce((total, factor) => total + factor.weight, 0);
      const numerator = factors.reduce((total, factor) => total + (factor.match ? factor.weight : 0), 0);
      return { ...product, category, routeGroup: productRoute, target, advanced, complex, score: denominator ? Math.round((numerator / denominator) * 100) : 0 };
    });
  }, [catalog, priorityKeywords, targetMap, weights]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const maxSales = Number(salesLimit);
    return rankedProducts
      .filter((product) => {
        const haystack = [product.brand, product.ingredient, product.company, product.mechanism, product.modality, product.target?.therapyArea].filter(Boolean).join(" ").toLowerCase();
        if (needle && !haystack.includes(needle)) return false;
        if (modality !== "All modalities" && product.category !== modality) return false;
        if (route !== "All routes" && product.routeGroup !== route) return false;
        if (mustMechanism && !product.mechanism) return false;
        if (mustAdvanced && !product.advanced) return false;
        if (mustComplex && !product.complex) return false;
        if (shortlistOnly && !shortlist.includes(product.id)) return false;
        if (salesLimit === "profiled" && product.target?.revenueUsdMm == null) return false;
        if (!Number.isNaN(maxSales) && (product.target?.revenueUsdMm == null || product.target.revenueUsdMm > maxSales)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "brand") return a.brand.localeCompare(b.brand);
        if (sort === "holder") return a.company.localeCompare(b.company) || a.brand.localeCompare(b.brand);
        if (sort === "sales") return (b.target?.revenueUsdMm ?? -1) - (a.target?.revenueUsdMm ?? -1);
        return b.score - a.score || Number(Boolean(b.target)) - Number(Boolean(a.target)) || a.brand.localeCompare(b.brand);
      });
  }, [modality, mustAdvanced, mustComplex, mustMechanism, query, rankedProducts, route, salesLimit, shortlist, shortlistOnly, sort]);

  function updateWeight(key: keyof Weights, value: number) {
    setWeights((current) => ({ ...current, [key]: value }));
    setVisible(40);
  }

  function resetCriteria() {
    setQuery("");
    setPriorityKeywords("");
    setModality("All modalities");
    setRoute("All routes");
    setSalesLimit("all");
    setMustMechanism(false);
    setMustAdvanced(false);
    setMustComplex(false);
    setShortlistOnly(false);
    setWeights(DEFAULT_WEIGHTS);
    setVisible(40);
  }

  function toggleShortlist(id: string) {
    setShortlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function exportResults() {
    const rows = [
      ["Screen score", "Brand", "Ingredient", "Rights holder", "Modality", "Route", "Annual sales US$m", "Mechanism"],
      ...filtered.map((product) => [product.score, product.brand, product.ingredient, product.company, product.category, product.route, product.target?.revenueUsdMm ?? "", product.mechanism ?? ""]),
    ];
    const blob = new Blob([rows.map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "us-specialty-asset-screen.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!catalog) {
    return <main className="screener-loading"><span>AS</span><strong>Loading asset universe</strong></main>;
  }

  return (
    <div className="screener-shell">
      <header className="screener-header">
          <a className="screener-brand" href="./">
          <span>AS</span>
          <div><strong>Asset Screener</strong><small>US specialty markets</small></div>
        </a>
        <nav>
          <button className={shortlistOnly ? "active" : ""} onClick={() => setShortlistOnly((value) => !value)}>Shortlist <b>{shortlist.length}</b></button>
          <a href="./">Back to original version</a>
        </nav>
      </header>

      <main className="screener-main">
        <section className="screener-intro">
          <div><p>US specialty markets</p><h1>Asset Screener</h1><span>Set the criteria. Rank the product universe.</span></div>
          <dl>
            <div><dt>Universe</dt><dd>{catalog.meta.products.toLocaleString()}</dd></div>
            <div><dt>Matches</dt><dd>{filtered.length.toLocaleString()}</dd></div>
            <div><dt>Shortlisted</dt><dd>{shortlist.length}</dd></div>
          </dl>
        </section>

        <div className="screener-workspace">
          <aside className="criteria-panel">
            <div className="panel-title"><div><span>01</span><h2>Criteria</h2></div><button onClick={resetCriteria}>Reset</button></div>

            <label className="field-control"><span>Product or rights holder</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(40); }} placeholder="Search brand, company, ingredient" /></label>
            <label className="field-control"><span>Priority keywords</span><input value={priorityKeywords} onChange={(event) => { setPriorityKeywords(event.target.value); setVisible(40); }} placeholder="e.g. dermatology, GLP-1, neurology" /></label>
            <div className="select-grid">
              <label className="field-control"><span>Modality</span><select value={modality} onChange={(event) => { setModality(event.target.value); setVisible(40); }}><option>All modalities</option><option>Small molecule</option><option>Biologic / advanced</option><option>Vaccine</option><option>Other</option></select></label>
              <label className="field-control"><span>Route</span><select value={route} onChange={(event) => { setRoute(event.target.value); setVisible(40); }}><option>All routes</option><option>Oral</option><option>Injectable</option><option>Topical / transdermal</option><option>Inhaled / nasal</option><option>Ophthalmic</option><option>Other</option></select></label>
            </div>
            <label className="field-control"><span>Annual sales screen</span><select value={salesLimit} onChange={(event) => { setSalesLimit(event.target.value); setVisible(40); }}><option value="all">All products</option><option value="profiled">Profiled sales only</option><option value="25">$25m or less</option><option value="50">$50m or less</option><option value="100">$100m or less</option></select></label>

            <fieldset className="must-match"><legend>Must match</legend>
              <label><input type="checkbox" checked={mustMechanism} onChange={(event) => setMustMechanism(event.target.checked)} /><span>Defined mechanism</span></label>
              <label><input type="checkbox" checked={mustAdvanced} onChange={(event) => setMustAdvanced(event.target.checked)} /><span>Advanced modality</span></label>
              <label><input type="checkbox" checked={mustComplex} onChange={(event) => setMustComplex(event.target.checked)} /><span>Complex delivery</span></label>
            </fieldset>

            <div className="weight-section"><div className="subheading"><span>02</span><h3>Ranking weights</h3><small>0–5</small></div>
              <WeightControl label="Differentiated modality" value={weights.modality} onChange={(value) => updateWeight("modality", value)} />
              <WeightControl label="Complex delivery" value={weights.delivery} onChange={(value) => updateWeight("delivery", value)} />
              <WeightControl label="Defined mechanism" value={weights.mechanism} onChange={(value) => updateWeight("mechanism", value)} />
              <WeightControl label="Keyword alignment" value={weights.keywords} onChange={(value) => updateWeight("keywords", value)} />
            </div>
          </aside>

          <section className="results-panel">
            <div className="results-toolbar">
              <div><span>03</span><h2>Results</h2><b>{filtered.length.toLocaleString()} matches</b></div>
              <div><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort results"><option value="score">Sort: screen score</option><option value="sales">Sort: annual sales</option><option value="brand">Sort: brand</option><option value="holder">Sort: rights holder</option></select><button onClick={exportResults} disabled={!filtered.length}>Export CSV</button></div>
            </div>

            <div className="result-list">
              {filtered.slice(0, visible).map((product) => (
                <article className="asset-row" key={product.id}>
                  <div className="screen-score"><strong>{product.score}</strong><span>screen</span></div>
                  <div className="asset-identity"><div><h3>{product.brand || product.ingredient}</h3><p>{product.ingredient}</p></div><div className="asset-tags"><span>{product.category}</span><span>{product.routeGroup}</span>{product.target && <span className="profiled">Sales profiled</span>}</div></div>
                  <dl className="asset-business-data">
                    <div><dt>US rights holder</dt><dd>{product.company}</dd></div>
                    <div><dt>Annual sales</dt><dd>{sales(product.target?.revenueUsdMm ?? null)}{product.target && <small>{product.target.period}</small>}</dd></div>
                    <div><dt>Administration</dt><dd>{product.dosageForm} · {product.route}</dd></div>
                    <div><dt>Mechanism</dt><dd>{product.mechanism ?? "Not classified"}</dd></div>
                  </dl>
                  {product.target && <div className="profiled-context"><span>{product.target.therapyArea}</span><p>{product.target.callPoints}</p></div>}
                  <div className="asset-actions"><button className={shortlist.includes(product.id) ? "active" : ""} onClick={() => toggleShortlist(product.id)}>{shortlist.includes(product.id) ? "Shortlisted" : "Add to shortlist"}</button>{product.target?.piUrl && <a href={product.target.piUrl} target="_blank" rel="noreferrer">Prescribing information ↗</a>}</div>
                </article>
              ))}
              {!filtered.length && <div className="no-results"><strong>No matches</strong><span>Remove a required criterion or broaden a filter.</span></div>}
            </div>
            {visible < filtered.length && <button className="show-more" onClick={() => setVisible((count) => count + 40)}>Show 40 more</button>}
          </section>
        </div>
      </main>
    </div>
  );
}
