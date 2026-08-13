"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Nullable<T> = T | null;

type Product = {
  id: string;
  productType: string;
  productClass: string;
  modality: string;
  ingredient: string;
  brand: string;
  companyProxy: string;
  fdaHolder: string;
  companyBasis: string;
  secondaryPartner: Nullable<string>;
  applicationType: string;
  applicationNumber: string;
  productNumbers: string;
  dosageForm: string;
  route: string;
  routeGroup: string;
  dosageFormRoute: string;
  strengths: string;
  approvalDate: string;
  approvalYear: Nullable<number>;
  approvalDecade: string;
  marketStatus: string;
  genericScreen: string;
  activeGenericCount: Nullable<number>;
  activeGenericApplications: Nullable<string>;
  historicalGenericApplications: Nullable<string>;
  genericApplicants: Nullable<string>;
  authorizedGeneric: string;
  biosimilarScreen: string;
  oncologyResult: string;
  oncologyReason: string;
  oncologyConfidence: string;
  moa: Nullable<string>;
  targets: Nullable<string>;
  targetGenes: Nullable<string>;
  targetClasses: Nullable<string>;
  moaCoverage: string;
  moaResolved: boolean;
  moaUrls: Nullable<string>;
  regulatorySource: string;
  snapshotDate: string;
  regulatoryUrls: Nullable<string>;
  dataFlag: string;
  recommendedCompany: string;
  recommendedChange: string;
  rightsStatus: string;
  rightsClass: string;
  rightsEvidence: string;
  rightsDuration: string;
  rightsDurationBasis: string;
  rightsConfidence: string;
  rightsUrls: Nullable<string>;
  rightsRuleId: Nullable<string>;
  nextDiligence: string;
  hlsStatus: string;
  rank: Nullable<number>;
  tier: Nullable<string>;
  fitScore: Nullable<number>;
  fitLabel: Nullable<string>;
  displayBrand: Nullable<string>;
  therapyLens: Nullable<string>;
  commercialForm: Nullable<string>;
  strategicRationale: Nullable<string>;
  primaryCallPoints: Nullable<string>;
  specialistCallPoints: Nullable<string>;
  commercialFit: Nullable<string>;
  revenueThreshold: Nullable<string>;
  revenueDisplay: Nullable<string>;
  revenueUsdMm: Nullable<number>;
  revenuePeriod: Nullable<string>;
  revenueEvidenceType: Nullable<string>;
  revenueMethodology: Nullable<string>;
  revenueUrls: Nullable<string>;
  revenueConfidence: Nullable<string>;
  transactionSignal: Nullable<string>;
  rightsFinding: Nullable<string>;
  keyRisks: Nullable<string>;
  strategyUrls: Nullable<string>;
};

type ShortlistItem = Record<string, string | number | null>;

type Catalog = {
  meta: {
    regulatorySnapshot: string;
    rightsSnapshot: string;
    totals: {
      products: number;
      nda: number;
      biologics: number;
      shortlisted: number;
      recommended: number;
      rightsRules: number;
      moaResolved: number;
    };
    distributions: {
      modality: Array<{ label: string; count: number }>;
      routeGroup: Array<{ label: string; count: number }>;
      approvalDecade: Array<{ label: string; count: number }>;
    };
  };
  shortlist: ShortlistItem[];
  strategy: Array<{ dimension: string; interpretation: string; impact: string; basis: string }>;
  scoring: Array<{ component: string; points: number; interpretation: string }>;
  evidenceHierarchy: Array<{ type: string; definition: string; confidence: string }>;
  sources: Array<{ name: string; category: string; finding: string; url: string }>;
  products: Product[];
};

type View = "explore" | "priorities" | "saved" | "methodology";
type ReviewStatus = "Saved" | "Reviewing" | "Diligence" | "Pass";
type Review = { status: ReviewStatus; note: string; updatedAt: string };
type Filters = {
  dealScope: "all" | "shortlist" | "recommended";
  salesBand: "all" | "under25" | "25to100" | "over100" | "unprofiled";
  productClass: string[];
  routeGroup: string[];
  rightsClass: string[];
  rightsConfidence: string[];
  moa: "all" | "resolved" | "unresolved";
  decade: string[];
};

const EMPTY_FILTERS: Filters = {
  dealScope: "all",
  salesBand: "all",
  productClass: [],
  routeGroup: [],
  rightsClass: [],
  rightsConfidence: [],
  moa: "all",
  decade: [],
};

const VIEW_LABELS: Record<View, string> = {
  explore: "All assets",
  priorities: "Deal flow",
  saved: "My list",
  methodology: "Deal criteria",
};

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const displayValue = (value: unknown, fallback = "Not available") =>
  value === null || value === undefined || value === "" ? fallback : String(value);
const splitUrls = (value: Nullable<string>) => (value ? value.split("|").map((url) => url.trim()).filter(Boolean) : []);
const hostLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function sourceLinks(value: Nullable<string>, label = "Evidence") {
  const urls = splitUrls(value);
  if (!urls.length) return null;
  return (
    <details className="source-disclosure">
      <summary>Reference links <span>+</span></summary>
      <div className="source-links">
        {urls.map((url, index) => (
          <a href={url} target="_blank" rel="noreferrer" key={`${url}-${index}`}>
            <span>{label} {urls.length > 1 ? index + 1 : ""}</span>
            <small>{hostLabel(url)} ↗</small>
          </a>
        ))}
      </div>
    </details>
  );
}

export function AcquisitionApp() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [view, setView] = useState<View>("priorities");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState("strategic");
  const [visibleCount, setVisibleCount] = useState(30);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [toast, setToast] = useState("");
  const [shortlistFilter, setShortlistFilter] = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);

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
      const initialView = params.get("view") as View | null;
      if (initialView && Object.keys(VIEW_LABELS).includes(initialView)) setView(initialView);
      setQuery(params.get("q") ?? "");
      setSelectedProductId(params.get("product"));
      try {
        const storedReviews = JSON.parse(localStorage.getItem("rightsatlas-reviews") ?? "{}");
        const storedCompare = JSON.parse(localStorage.getItem("rightsatlas-compare") ?? "[]");
        setReviews(storedReviews);
        setCompareIds(Array.isArray(storedCompare) ? storedCompare.slice(0, 3) : []);
      } catch {
        setReviews({});
        setCompareIds([]);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (view !== "priorities") params.set("view", view);
    if (query) params.set("q", query);
    if (selectedProductId) params.set("product", selectedProductId);
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", next);
  }, [view, query, selectedProductId]);

  useEffect(() => {
    document.body.classList.toggle("overlay-open", Boolean(selectedProductId || filtersOpen || compareOpen));
    return () => document.body.classList.remove("overlay-open");
  }, [selectedProductId, filtersOpen, compareOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const productsById = useMemo(
    () => new Map((catalog?.products ?? []).map((product) => [product.id, product])),
    [catalog],
  );

  const selectedProduct = selectedProductId ? productsById.get(selectedProductId) ?? null : null;

  const searchIndex = useMemo(() => {
    const index = new Map<string, string>();
    for (const product of catalog?.products ?? []) {
      index.set(product.id, [
        product.brand,
        product.ingredient,
        product.recommendedCompany,
        product.companyProxy,
        product.fdaHolder,
        product.applicationType,
        product.applicationNumber,
        product.modality,
        product.therapyLens,
        product.revenueDisplay,
        product.rightsClass,
        product.hlsStatus,
        product.moa,
        product.targets,
        product.targetGenes,
        product.rightsEvidence,
        product.rightsFinding,
        product.transactionSignal,
      ].filter(Boolean).join(" ").toLowerCase());
    }
    return index;
  }, [catalog]);

  const filteredProducts = useMemo(() => {
    if (!catalog) return [];
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const savedIds = new Set(Object.keys(reviews));
    const filtered = catalog.products.filter((product) => {
      if (view === "saved" && !savedIds.has(product.id)) return false;
      if (terms.length && !terms.every((term) => searchIndex.get(product.id)?.includes(term))) return false;
      if (filters.dealScope === "shortlist" && product.rank === null) return false;
      if (filters.dealScope === "recommended" && product.hlsStatus !== "Recommended acquisition candidate") return false;
      if (filters.salesBand === "under25" && (product.revenueUsdMm === null || product.revenueUsdMm >= 25)) return false;
      if (filters.salesBand === "25to100" && (product.revenueUsdMm === null || product.revenueUsdMm < 25 || product.revenueUsdMm > 100)) return false;
      if (filters.salesBand === "over100" && (product.revenueUsdMm === null || product.revenueUsdMm <= 100)) return false;
      if (filters.salesBand === "unprofiled" && product.revenueUsdMm !== null) return false;
      if (filters.productClass.length && !filters.productClass.includes(product.productClass)) return false;
      if (filters.routeGroup.length && !filters.routeGroup.includes(product.routeGroup)) return false;
      if (filters.rightsClass.length && !filters.rightsClass.includes(product.rightsClass)) return false;
      if (filters.rightsConfidence.length && !filters.rightsConfidence.includes(product.rightsConfidence)) return false;
      if (filters.moa === "resolved" && !product.moaResolved) return false;
      if (filters.moa === "unresolved" && product.moaResolved) return false;
      if (filters.decade.length && !filters.decade.includes(product.approvalDecade)) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      if (sort === "sales-high") return (b.revenueUsdMm ?? -1) - (a.revenueUsdMm ?? -1);
      if (sort === "sales-low") return (a.revenueUsdMm ?? Number.MAX_SAFE_INTEGER) - (b.revenueUsdMm ?? Number.MAX_SAFE_INTEGER);
      if (sort === "fit") return (b.fitScore ?? -1) - (a.fitScore ?? -1);
      if (sort === "newest") return (b.approvalYear ?? 0) - (a.approvalYear ?? 0);
      if (sort === "oldest") return (a.approvalYear ?? 9999) - (b.approvalYear ?? 9999);
      if (sort === "company") return a.recommendedCompany.localeCompare(b.recommendedCompany);
      if (sort === "brand") return a.brand.localeCompare(b.brand);
      const rankA = typeof a.rank === "number" ? a.rank : 9999;
      const rankB = typeof b.rank === "number" ? b.rank : 9999;
      if (rankA !== rankB) return rankA - rankB;
      if (a.rightsClass !== b.rightsClass) return a.rightsClass === "Deal rule applied" ? -1 : 1;
      if (a.rightsConfidence !== b.rightsConfidence) return a.rightsConfidence === "High" ? -1 : 1;
      return a.brand.localeCompare(b.brand);
    });
  }, [catalog, filters, query, reviews, searchIndex, sort, view]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisibleCount(30), 0);
    return () => window.clearTimeout(timer);
  }, [filters, query, sort, view]);

  const activeFilterCount =
    (filters.dealScope === "all" ? 0 : 1) +
    (filters.salesBand === "all" ? 0 : 1) +
    filters.productClass.length +
    filters.routeGroup.length +
    filters.rightsClass.length +
    filters.rightsConfidence.length +
    filters.decade.length +
    (filters.moa === "all" ? 0 : 1);

  const compareProducts = compareIds.map((id) => productsById.get(id)).filter(Boolean) as Product[];

  const updateReview = (productId: string, patch: Partial<Review>) => {
    setReviews((current) => {
      const existing = current[productId] ?? { status: "Saved", note: "", updatedAt: "" };
      const next = {
        ...current,
        [productId]: { ...existing, ...patch, updatedAt: new Date().toISOString() },
      };
      localStorage.setItem("rightsatlas-reviews", JSON.stringify(next));
      return next;
    });
  };

  const removeReview = (productId: string) => {
    setReviews((current) => {
      const next = { ...current };
      delete next[productId];
      localStorage.setItem("rightsatlas-reviews", JSON.stringify(next));
      return next;
    });
    setToast("Removed from your review");
  };

  const toggleCompare = (productId: string) => {
    setCompareIds((current) => {
      if (current.includes(productId)) {
        const next = current.filter((id) => id !== productId);
        localStorage.setItem("rightsatlas-compare", JSON.stringify(next));
        return next;
      }
      if (current.length >= 3) {
        setToast("Compare up to three products");
        return current;
      }
      const next = [...current, productId];
      localStorage.setItem("rightsatlas-compare", JSON.stringify(next));
      return next;
    });
  };

  const navigate = (nextView: View) => {
    setView(nextView);
    setSelectedProductId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyPreset = (preset: "priority" | "oral-rights" | "cardiology" | "psychiatry") => {
    if (preset === "priority") {
      navigate("priorities");
      return;
    }
    navigate("explore");
    if (preset === "oral-rights") {
      setFilters({ ...EMPTY_FILTERS, routeGroup: ["Oral"], rightsClass: ["Deal rule applied"] });
    }
    if (preset === "cardiology" || preset === "psychiatry") {
      setFilters(EMPTY_FILTERS);
      setQuery(preset);
    }
  };

  const exportCsv = () => {
    const headers = ["Asset", "Ingredient", "Therapeutic area", "Current U.S. rights holder", "Recent annual sales", "Sales period", "Recommendation", "Fit score", "Transaction signal", "Route", "Application", "Next diligence"];
    const rows = filteredProducts.map((product) => [
      product.brand,
      product.ingredient,
      product.therapyLens ?? "",
      product.recommendedCompany,
      product.revenueDisplay ?? "",
      product.revenuePeriod ?? "",
      product.tier ?? product.hlsStatus,
      product.fitScore ?? "",
      product.transactionSignal ?? "",
      product.route,
      `${product.applicationType} ${product.applicationNumber}`,
      product.nextDiligence,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rightsatlas-filtered-products.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setToast(`Exported ${formatNumber(rows.length)} records`);
  };

  const shareCurrentView = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast("Link copied");
    } catch {
      setToast("Copy the URL from your browser");
    }
  };

  if (loadError) {
    return (
      <main className="state-page">
        <div className="brand-mark">RA</div>
        <h1>The product catalog could not be loaded.</h1>
        <p>Refresh the page to try again.</p>
        <button className="button primary" onClick={() => window.location.reload()}>Refresh</button>
      </main>
    );
  }

  if (!catalog) return <LoadingScreen />;

  const routeOptions = catalog.meta.distributions.routeGroup.slice(0, 10).map((item) => item.label);
  const decadeOptions = catalog.meta.distributions.approvalDecade
    .map((item) => item.label)
    .filter((label) => label !== "Unknown")
    .sort()
    .reverse();

  const filtersPanel = (
    <FilterControls
      filters={filters}
      setFilters={setFilters}
      routeOptions={routeOptions}
      decadeOptions={decadeOptions}
      onClear={() => setFilters(EMPTY_FILTERS)}
    />
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate("priorities")} aria-label="RightsAtlas home">
          <span className="brand-mark">RA</span>
          <span><strong>RightsAtlas</strong><small>U.S. acquisition desk</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {(Object.keys(VIEW_LABELS) as View[]).map((item) => (
            <button key={item} className={view === item ? "active" : ""} onClick={() => navigate(item)}>
              {VIEW_LABELS[item]}
              {item === "saved" && Object.keys(reviews).length > 0 ? <b>{Object.keys(reviews).length}</b> : null}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={shareCurrentView} aria-label="Copy link to this view">↗</button>
          <button className="button compare-button" onClick={() => setCompareOpen(true)} disabled={compareIds.length === 0}>
            Compare <span>{compareIds.length}</span>
          </button>
        </div>
      </header>

      {view === "priorities" ? (
        <PrioritiesView
          catalog={catalog}
          productsById={productsById}
          shortlistFilter={shortlistFilter}
          setShortlistFilter={setShortlistFilter}
          openProduct={setSelectedProductId}
          compareIds={compareIds}
          toggleCompare={toggleCompare}
          reviews={reviews}
          updateReview={updateReview}
        />
      ) : view === "methodology" ? (
        <MethodologyView catalog={catalog} />
      ) : (
        <main>
          <section className="search-hero">
            <div className="hero-copy">
              <p className="eyebrow">U.S. product acquisition workspace</p>
              <h1>{view === "saved" ? "The assets on your deal list." : "Find an asset worth pursuing."}</h1>
              <p>
                {view === "saved"
                  ? "Keep your thesis, next step, and comparison set together as the opportunity develops."
                  : "Search by rights holder, therapeutic area, annual sales, brand, or ingredient—then move the best opportunities into your deal list."}
              </p>
            </div>
            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search asset, rights holder, therapy area, sales…"
                aria-label="Search products"
              />
              {query ? <button onClick={() => setQuery("")} aria-label="Clear search">×</button> : <kbd>⌘ K</kbd>}
            </div>
            {view === "explore" ? (
              <div className="query-presets" aria-label="Suggested queries">
                <button onClick={() => applyPreset("priority")}><span>01</span> Ranked deal flow</button>
                <button onClick={() => applyPreset("cardiology")}><span>02</span> Cardiology</button>
                <button onClick={() => applyPreset("psychiatry")}><span>03</span> Psychiatry</button>
                <button onClick={() => applyPreset("oral-rights")}><span>04</span> Oral + transaction history</button>
              </div>
            ) : null}
          </section>

          <section className="metric-strip" aria-label="Deal-flow overview">
            <Metric value={catalog.meta.totals.shortlisted} label="assets with sales context" accent />
            <Metric value={catalog.meta.totals.recommended} label="recommended to pursue" />
            <Metric value={4} label="front-of-queue assets" />
            <Metric value={2} label="active partnering signals" />
          </section>

          <div className="explorer-layout">
            <aside className="filter-rail">
              <div className="filter-rail-heading">
                <h2>Filter assets</h2>
                {activeFilterCount ? <button onClick={() => setFilters(EMPTY_FILTERS)}>Reset</button> : null}
              </div>
              {filtersPanel}
            </aside>

            <section className="results-pane">
              <div className="results-toolbar">
                <div>
                  <p>{query ? `Results for “${query}”` : view === "saved" ? "Your active list" : "Available product universe"}</p>
                  <strong>{formatNumber(filteredProducts.length)} assets</strong>
                </div>
                <div className="toolbar-actions">
                  <button className="filter-trigger" onClick={() => setFiltersOpen(true)}>
                    Filters {activeFilterCount ? <b>{activeFilterCount}</b> : null}
                  </button>
                  <label className="sort-control">
                    <span>Sort</span>
                    <select value={sort} onChange={(event) => setSort(event.target.value)}>
                      <option value="strategic">Deal priority</option>
                      <option value="sales-high">Annual sales: high to low</option>
                      <option value="sales-low">Annual sales: low to high</option>
                      <option value="fit">Strategic fit</option>
                      <option value="newest">Newest approval</option>
                      <option value="oldest">Oldest approval</option>
                      <option value="company">Rights company</option>
                      <option value="brand">Brand A–Z</option>
                    </select>
                  </label>
                  <button className="export-button" onClick={exportCsv}>↓ CSV</button>
                </div>
              </div>

              {activeFilterCount ? (
                <ActiveFilters filters={filters} setFilters={setFilters} />
              ) : null}

              {filteredProducts.length ? (
                <div className="product-list">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      selectedForCompare={compareIds.includes(product.id)}
                      isSaved={Boolean(reviews[product.id])}
                      onOpen={() => setSelectedProductId(product.id)}
                      onCompare={() => toggleCompare(product.id)}
                      onSave={() => {
                        if (reviews[product.id]) removeReview(product.id);
                        else {
                          updateReview(product.id, { status: "Saved" });
                          setToast("Added to your review");
                        }
                      }}
                    />
                  ))}
                  {visibleCount < filteredProducts.length ? (
                    <button className="load-more" onClick={() => setVisibleCount((count) => count + 40)}>
                      Show 40 more <span>{formatNumber(filteredProducts.length - visibleCount)} remaining</span>
                    </button>
                  ) : null}
                </div>
              ) : (
                <EmptyState view={view} onClear={() => { setQuery(""); setFilters(EMPTY_FILTERS); }} />
              )}
            </section>
          </div>
        </main>
      )}

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {(Object.keys(VIEW_LABELS) as View[]).map((item) => (
          <button key={item} className={view === item ? "active" : ""} onClick={() => navigate(item)}>
            <span>{item === "explore" ? "⌕" : item === "priorities" ? "↑" : item === "saved" ? "◇" : "i"}</span>
            {VIEW_LABELS[item]}
            {item === "saved" && Object.keys(reviews).length > 0 ? <b>{Object.keys(reviews).length}</b> : null}
          </button>
        ))}
      </nav>

      {selectedProduct ? (
        <ProductDrawer
          product={selectedProduct}
          review={reviews[selectedProduct.id]}
          isCompared={compareIds.includes(selectedProduct.id)}
          onClose={() => setSelectedProductId(null)}
          onUpdateReview={(patch) => updateReview(selectedProduct.id, patch)}
          onRemoveReview={() => removeReview(selectedProduct.id)}
          onCompare={() => toggleCompare(selectedProduct.id)}
        />
      ) : null}

      {filtersOpen ? (
        <div className="overlay" role="presentation" onMouseDown={() => setFiltersOpen(false)}>
          <section className="filter-sheet" role="dialog" aria-modal="true" aria-label="Product filters" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-header"><div><p>Narrow the opportunity set</p><h2>Deal filters</h2></div><button onClick={() => setFiltersOpen(false)} aria-label="Close filters">×</button></div>
            {filtersPanel}
            <button className="button primary sheet-apply" onClick={() => setFiltersOpen(false)}>
              View {formatNumber(filteredProducts.length)} assets
            </button>
          </section>
        </div>
      ) : null}

      {compareOpen ? (
        <CompareDrawer products={compareProducts} onClose={() => setCompareOpen(false)} onRemove={toggleCompare} onOpenProduct={setSelectedProductId} />
      ) : null}

      {compareIds.length > 0 && !compareOpen ? (
        <button className="compare-dock" onClick={() => setCompareOpen(true)}>
          <span>{compareIds.length}</span>
          Compare selected
          <b>→</b>
        </button>
      ) : null}

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-brand"><span className="brand-mark">RA</span><strong>RightsAtlas</strong></div>
      <div className="loading-copy"><span>OPENING DEAL WORKSPACE</span><h1>Assembling the asset opportunity set.</h1></div>
      <div className="loading-track"><i /></div>
    </div>
  );
}

function Metric({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return <div className={accent ? "metric accent" : "metric"}><strong>{formatNumber(value)}</strong><span>{label}</span></div>;
}

function FilterControls({
  filters,
  setFilters,
  routeOptions,
  decadeOptions,
  onClear,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  routeOptions: string[];
  decadeOptions: string[];
  onClear: () => void;
}) {
  return (
    <div className="filter-controls">
      <FilterGroup title="Deal stage">
        <div className="segmented-control deal-scope-control">
          {([
            ["all", "All assets"],
            ["shortlist", "Sales profile"],
            ["recommended", "Recommended"],
          ] as const).map(([value, label]) => (
            <button key={value} className={filters.dealScope === value ? "active" : ""} onClick={() => setFilters({ ...filters, dealScope: value })}>{label}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Annual U.S. sales">
        <div className="filter-chip-grid sales-band-grid">
          {([
            ["all", "Any sales"],
            ["under25", "Under $25m"],
            ["25to100", "$25–100m"],
            ["over100", "$100m+"],
            ["unprofiled", "Not profiled"],
          ] as const).map(([value, label]) => (
            <button key={value} className={filters.salesBand === value ? "active" : ""} onClick={() => setFilters({ ...filters, salesBand: value })}>{label}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Rights situation">
        {[["Deal rule applied", "Transaction or partner signal"], ["FDA holder proxy", "Current holder only"]].map(([value, label]) => (
          <CheckFilter key={value} label={label} checked={filters.rightsClass.includes(value)} onChange={() => setFilters({ ...filters, rightsClass: toggleValue(filters.rightsClass, value) })} />
        ))}
      </FilterGroup>
      <FilterGroup title="Commercial format">
        <div className="filter-chip-grid">
          {routeOptions.map((value) => (
            <button key={value} className={filters.routeGroup.includes(value) ? "active" : ""} onClick={() => setFilters({ ...filters, routeGroup: toggleValue(filters.routeGroup, value) })}>{value}</button>
          ))}
        </div>
      </FilterGroup>
      <details className="more-filters">
        <summary>More product filters <span>+</span></summary>
        <div>
          <FilterGroup title="Product class">
            {["NDA product", "Biologic"].map((value) => (
              <CheckFilter key={value} label={value} checked={filters.productClass.includes(value)} onChange={() => setFilters({ ...filters, productClass: toggleValue(filters.productClass, value) })} />
            ))}
          </FilterGroup>
          <FilterGroup title="First approval decade">
            <div className="filter-chip-grid compact">
              {decadeOptions.map((value) => (
                <button key={value} className={filters.decade.includes(value) ? "active" : ""} onClick={() => setFilters({ ...filters, decade: toggleValue(filters.decade, value) })}>{value}</button>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Mechanism coverage">
            <div className="segmented-control">
              {(["all", "resolved", "unresolved"] as const).map((value) => (
                <button key={value} className={filters.moa === value ? "active" : ""} onClick={() => setFilters({ ...filters, moa: value })}>{value}</button>
              ))}
            </div>
          </FilterGroup>
        </div>
      </details>
      <button className="clear-filters" onClick={onClear}>Clear all filters</button>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="filter-group"><legend>{title}</legend>{children}</fieldset>;
}

function CheckFilter({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="check-filter"><input type="checkbox" checked={checked} onChange={onChange} /><span>{checked ? "✓" : ""}</span>{label}</label>;
}

function ActiveFilters({ filters, setFilters }: { filters: Filters; setFilters: (filters: Filters) => void }) {
  const chips: Array<{ label: string; clear: () => void }> = [
    ...(filters.dealScope !== "all" ? [{ label: filters.dealScope === "shortlist" ? "Sales profile" : "Recommended", clear: () => setFilters({ ...filters, dealScope: "all" }) }] : []),
    ...(filters.salesBand !== "all" ? [{ label: { under25: "Under $25m", "25to100": "$25–100m", over100: "$100m+", unprofiled: "Sales not profiled" }[filters.salesBand], clear: () => setFilters({ ...filters, salesBand: "all" }) }] : []),
    ...filters.productClass.map((value) => ({ label: value, clear: () => setFilters({ ...filters, productClass: filters.productClass.filter((item) => item !== value) }) })),
    ...filters.routeGroup.map((value) => ({ label: value, clear: () => setFilters({ ...filters, routeGroup: filters.routeGroup.filter((item) => item !== value) }) })),
    ...filters.rightsClass.map((value) => ({ label: value, clear: () => setFilters({ ...filters, rightsClass: filters.rightsClass.filter((item) => item !== value) }) })),
    ...filters.decade.map((value) => ({ label: value, clear: () => setFilters({ ...filters, decade: filters.decade.filter((item) => item !== value) }) })),
    ...(filters.moa !== "all" ? [{ label: `MOA ${filters.moa}`, clear: () => setFilters({ ...filters, moa: "all" }) }] : []),
  ];
  return <div className="active-filters">{chips.map((chip) => <button key={chip.label} onClick={chip.clear}>{chip.label} <span>×</span></button>)}</div>;
}

function ProductRow({
  product,
  selectedForCompare,
  isSaved,
  onOpen,
  onCompare,
  onSave,
}: {
  product: Product;
  selectedForCompare: boolean;
  isSaved: boolean;
  onOpen: () => void;
  onCompare: () => void;
  onSave: () => void;
}) {
  const isStrategic = typeof product.rank === "number";
  return (
    <article className={isStrategic ? "product-row strategic" : "product-row"}>
      <button className="product-main" onClick={onOpen}>
        <span className="product-index">{isStrategic ? String(product.rank).padStart(2, "0") : product.applicationType}</span>
        <span className="product-identity">
          <span className="product-title-line"><strong>{product.brand}</strong>{isStrategic ? <em>{product.tier}</em> : null}</span>
          <span className="ingredient">{product.ingredient}</span>
        </span>
        <span className="deal-fact rights-holder-fact">
          <small>U.S. rights holder</small>
          <strong>{product.recommendedCompany}</strong>
        </span>
        <span className="deal-fact sales-fact">
          <small>Annual sales</small>
          <strong>{product.revenueDisplay ?? "Not yet profiled"}</strong>
        </span>
        <span className="deal-fact therapy-fact">
          <small>Therapeutic area</small>
          <strong>{product.therapyLens ?? product.modality}</strong>
        </span>
        {isStrategic ? <span className="fit-score"><small>FIT</small><strong>{product.fitScore}</strong></span> : null}
        <span className="row-arrow">→</span>
      </button>
      <div className="row-actions">
        <button className={isSaved ? "saved" : ""} onClick={onSave} aria-label={isSaved ? `Remove ${product.brand} from review` : `Save ${product.brand} for review`}>{isSaved ? "◆" : "◇"}</button>
        <button className={selectedForCompare ? "selected" : ""} onClick={onCompare} aria-label={`Compare ${product.brand}`}>{selectedForCompare ? "✓" : "+"}</button>
      </div>
    </article>
  );
}

function EmptyState({ view, onClear }: { view: View; onClear: () => void }) {
  return (
    <div className="empty-state">
      <span>{view === "saved" ? "◇" : "⌕"}</span>
      <h2>{view === "saved" ? "Your review queue is empty." : "No products match this query."}</h2>
      <p>{view === "saved" ? "Save a product from the universe or a priority card to start a review." : "Try a broader term or remove a filter."}</p>
      <button className="button secondary" onClick={onClear}>{view === "saved" ? "Explore products" : "Clear query"}</button>
    </div>
  );
}

function PrioritiesView({
  catalog,
  productsById,
  shortlistFilter,
  setShortlistFilter,
  openProduct,
  compareIds,
  toggleCompare,
  reviews,
  updateReview,
}: {
  catalog: Catalog;
  productsById: Map<string, Product>;
  shortlistFilter: string;
  setShortlistFilter: (value: string) => void;
  openProduct: (id: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  reviews: Record<string, Review>;
  updateReview: (id: string, patch: Partial<Review>) => void;
}) {
  const tiers = ["All", "Priority", "Tuck-in", "Carve-out", "Stretch", "Watchlist", "Excluded"];
  const items = catalog.shortlist.filter((item) => {
    if (shortlistFilter === "All") return true;
    return String(item["Recommendation Tier"]).toLowerCase().includes(shortlistFilter.toLowerCase());
  });
  const topTargets = catalog.shortlist.slice(0, 4);
  return (
    <main className="priorities-page">
      <section className="priority-hero">
        <div>
          <p className="eyebrow">Ranked U.S. deal flow</p>
          <h1>Find the next asset HLS can actually win.</h1>
          <p>Start with the rights holder, annual sales, therapeutic fit, and the signal that makes an approach worth the time.</p>
        </div>
        <aside>
          <span>DEAL THESIS</span>
          <p>Open parallel conversations on <strong>TRYVIO</strong> and <strong>INPEFA</strong>. Keep <strong>LODOCO</strong> and <strong>ZYPITAMAG</strong> close as practical tuck-ins with manageable sales bases.</p>
        </aside>
      </section>

      <section className="deal-summary" aria-label="Priority deal summary">
        <div><strong>4</strong><span>front-of-queue assets</span></div>
        <div><strong>$2.5–17.5m</strong><span>top-target annual sales range</span></div>
        <div><strong>2</strong><span>clear partnering or reset signals</span></div>
        <div><strong>Oral chronic</strong><span>preferred commercial model</span></div>
      </section>

      <section className="top-targets">
        {topTargets.map((item, index) => {
          const id = String(item["Database Record ID"]);
          const product = productsById.get(id);
          if (!product) return null;
          return (
            <article className={`target-card target-${index + 1}`} key={id}>
              <div className="target-rank"><span>0{index + 1}</span><i /></div>
              <div className="target-card-head"><div><small>{item["Recommendation Tier"]}</small><h2>{item.Asset}</h2><p>{item["Active Ingredient"]}</p></div><div className="score-ring" style={{ "--score": Number(item["Fit Score"]) } as React.CSSProperties}><strong>{item["Fit Score"]}</strong><small>FIT</small></div></div>
              <p className="target-area">{item["Therapy Area"]}</p>
              <div className="target-deal-facts"><span><small>Rights holder</small><strong>{item["Current U.S. Rights Company"]}</strong></span><span><small>Annual sales</small><strong>{item["Recent Revenue"]}</strong></span></div>
              <div className="target-signal"><small>Deal signal</small><p>{item["Transaction / Partnering Signal"]}</p></div>
              <div className="target-actions">
                <button className="button primary" onClick={() => openProduct(id)}>Review asset</button>
                <button className={compareIds.includes(id) ? "icon-action selected" : "icon-action"} onClick={() => toggleCompare(id)} aria-label={`Compare ${item.Asset}`}>{compareIds.includes(id) ? "✓" : "+"}</button>
                <button className={reviews[id] ? "icon-action selected" : "icon-action"} onClick={() => updateReview(id, { status: reviews[id]?.status ?? "Saved" })} aria-label={`Save ${item.Asset}`}>{reviews[id] ? "◆" : "◇"}</button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="priority-stack">
        <div className="section-heading"><div><p className="eyebrow">Complete opportunity set</p><h2>12 assets with commercial context</h2></div><p>Compare sales scale, rights holder, strategic fit, and transaction realism before moving an asset into your list.</p></div>
        <div className="tier-tabs" role="tablist">
          {tiers.map((tier) => <button role="tab" aria-selected={shortlistFilter === tier} className={shortlistFilter === tier ? "active" : ""} onClick={() => setShortlistFilter(tier)} key={tier}>{tier}</button>)}
        </div>
        <div className="decision-list">
          {items.map((item) => {
            const id = String(item["Database Record ID"]);
            const score = Number(item["Fit Score"]);
            return (
              <article key={id} className="decision-row">
                <button className="decision-main" onClick={() => openProduct(id)}>
                  <span className="decision-rank">{String(item["Priority Rank"]).padStart(2, "0")}</span>
                  <span className="decision-asset"><strong>{item.Asset}</strong><small>{item["Active Ingredient"]}</small></span>
                  <span className="decision-holder"><small>Rights holder</small><strong>{item["Current U.S. Rights Company"]}</strong></span>
                  <span className="decision-tier">{item["Therapy Area"]}</span>
                  <span className="decision-bar"><i style={{ width: `${score}%` }} /><small>{score}</small></span>
                  <span className="decision-revenue"><small>Annual sales</small><strong>${item["US$mm"]}m</strong></span>
                  <span className="row-arrow">→</span>
                </button>
                <button className={compareIds.includes(id) ? "decision-compare selected" : "decision-compare"} onClick={() => toggleCompare(id)}>{compareIds.includes(id) ? "✓" : "+"}</button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function MethodologyView({ catalog }: { catalog: Catalog }) {
  return (
    <main className="methodology-page">
      <section className="method-hero"><p className="eyebrow">Deal criteria</p><h1>What makes an asset worth pursuing.</h1><p>The screen favors a reachable rights holder, intelligible sales scale, focused therapeutic fit, and a credible reason to start a conversation.</p></section>
      <section className="method-grid">
        <article className="method-panel strategy-panel"><div className="panel-number">01</div><div><p className="eyebrow">Strategic frame</p><h2>What earns attention</h2></div>{catalog.strategy.map((item) => <details key={item.dimension}><summary><strong>{item.dimension}</strong><span>+</span></summary><p>{item.interpretation}</p><small>{item.impact}</small></details>)}</article>
        <article className="method-panel score-panel"><div className="panel-number">02</div><div><p className="eyebrow">Priority score</p><h2>How opportunities are ranked</h2></div><div className="score-components">{catalog.scoring.map((item) => <div key={item.component}><span><strong>{item.component}</strong><small>{item.interpretation}</small></span><b>{item.points}</b></div>)}</div></article>
        <article className="method-panel deal-lens-panel"><div className="panel-number">03</div><div><p className="eyebrow">First conversation</p><h2>The four questions that matter</h2></div><div className="deal-lens-list"><div><strong>Who controls the U.S. rights?</strong><p>Identify the company that can engage on a license, carve-out, or acquisition.</p></div><div><strong>How large is the asset today?</strong><p>Use annual sales to distinguish practical tuck-ins from larger strategic bets.</p></div><div><strong>Can the commercial model travel?</strong><p>Favor therapies, call points, and formats that fit a focused commercial team.</p></div><div><strong>Why would the holder transact?</strong><p>Look for portfolio resets, partnering language, or a credible change-of-control path.</p></div></div></article>
        <article className="method-panel caveat-panel"><div className="panel-number">04</div><div><p className="eyebrow">Use in context</p><h2>A screen for conversations—not a valuation</h2></div><p>RightsAtlas helps decide where to spend business-development time. A live opportunity still needs direct holder contact, financial modeling, legal review, and confirmatory diligence.</p></article>
      </section>
    </main>
  );
}

function ProductDrawer({
  product,
  review,
  isCompared,
  onClose,
  onUpdateReview,
  onRemoveReview,
  onCompare,
}: {
  product: Product;
  review?: Review;
  isCompared: boolean;
  onClose: () => void;
  onUpdateReview: (patch: Partial<Review>) => void;
  onRemoveReview: () => void;
  onCompare: () => void;
}) {
  const [tab, setTab] = useState<"case" | "rights" | "product">(product.fitScore ? "case" : "rights");
  return (
    <div className="overlay drawer-overlay" role="presentation" onMouseDown={onClose}>
      <aside className="product-drawer" role="dialog" aria-modal="true" aria-label={`${product.brand} product detail`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-topline"><button onClick={onClose}>← <span>Back</span></button><div><button className={review ? "selected" : ""} onClick={() => review ? onRemoveReview() : onUpdateReview({ status: "Saved" })}>{review ? "◆ Saved" : "◇ Save"}</button><button className={isCompared ? "selected" : ""} onClick={onCompare}>{isCompared ? "✓ Comparing" : "+ Compare"}</button></div></div>
        <header className="drawer-header">
          <div className="drawer-kicker"><span>{product.therapyLens ?? product.modality}</span><i /> <span>{product.commercialForm ?? product.routeGroup}</span></div>
          <h1>{product.brand}</h1>
          <p>{product.ingredient}</p>
          <div className="drawer-deal-grid">
            <div><small>U.S. rights holder</small><strong>{product.recommendedCompany}</strong></div>
            <div><small>Annual sales</small><strong>{product.revenueDisplay ?? "Not yet profiled"}</strong></div>
            <div><small>Therapeutic area</small><strong>{product.therapyLens ?? product.modality}</strong></div>
            <div><small>Recommendation</small><strong>{product.tier ?? product.hlsStatus}</strong></div>
          </div>
          {product.fitScore ? <div className="drawer-recommendation"><span className="score-ring small" style={{ "--score": product.fitScore } as React.CSSProperties}><strong>{product.fitScore}</strong><small>FIT</small></span><div><small>Strategic fit</small><p>{product.commercialFit}</p></div></div> : null}
        </header>
        <nav className="drawer-tabs">
          {product.fitScore ? <button className={tab === "case" ? "active" : ""} onClick={() => setTab("case")}>Acquisition case</button> : null}
          <button className={tab === "rights" ? "active" : ""} onClick={() => setTab("rights")}>Deal profile</button>
          <button className={tab === "product" ? "active" : ""} onClick={() => setTab("product")}>Product</button>
        </nav>
        <div className="drawer-body">
          {tab === "case" ? <AcquisitionCase product={product} /> : null}
          {tab === "rights" ? <RightsDetail product={product} /> : null}
          {tab === "product" ? <ProductDetail product={product} /> : null}
          <section className="review-workspace">
            <div><span className="section-number">YOUR REVIEW</span><h2>Decision notes</h2></div>
            <label><span>Status</span><select value={review?.status ?? "Saved"} onChange={(event) => onUpdateReview({ status: event.target.value as ReviewStatus })}><option>Saved</option><option>Reviewing</option><option>Diligence</option><option>Pass</option></select></label>
            <label><span>Analyst note</span><textarea value={review?.note ?? ""} onChange={(event) => onUpdateReview({ note: event.target.value })} placeholder="Capture the hypothesis, open questions, or next call…" /></label>
            <p>Saved privately on this device.</p>
          </section>
        </div>
      </aside>
    </div>
  );
}

function AcquisitionCase({ product }: { product: Product }) {
  return (
    <>
      <section className="detail-section lead-section"><span className="section-number">01 / CASE</span><h2>Why it fits</h2><p className="lead-copy">{displayValue(product.strategicRationale)}</p></section>
      <section className="detail-stat-grid">
        <div><small>Recent U.S. revenue</small><strong>{displayValue(product.revenueDisplay)}</strong><span>{displayValue(product.revenueEvidenceType)}</span></div>
        <div><small>Commercial model</small><strong>{displayValue(product.commercialForm)}</strong><span>{displayValue(product.commercialFit)}</span></div>
      </section>
      <section className="detail-section"><span className="section-number">02 / ACTIONABILITY</span><h2>Transaction signal</h2><p>{displayValue(product.transactionSignal)}</p></section>
      <section className="detail-section"><span className="section-number">03 / CALL POINTS</span><div className="two-column-copy"><div><h3>Core reach</h3><p>{displayValue(product.primaryCallPoints)}</p></div><div><h3>Expansion lane</h3><p>{displayValue(product.specialistCallPoints)}</p></div></div></section>
      <section className="detail-section risk-section"><span className="section-number">04 / WATCH ITEMS</span><h2>Key risks & diligence</h2><p>{displayValue(product.keyRisks)}</p></section>
      <details className="secondary-detail"><summary>Sales context <span>+</span></summary><div><h3>{displayValue(product.revenueThreshold)}</h3><p>{displayValue(product.revenueMethodology)}</p>{sourceLinks(product.revenueUrls, "Sales reference")}</div></details>
    </>
  );
}

function RightsDetail({ product }: { product: Product }) {
  return (
    <>
      <section className="rights-verdict"><div><small>CURRENT U.S. RIGHTS HOLDER</small><strong>{product.recommendedCompany}</strong></div><div><small>RIGHTS SITUATION</small><strong>{product.rightsClass === "Deal rule applied" ? "Transaction history identified" : "Current holder identified"}</strong></div></section>
      <section className="detail-section"><span className="section-number">01 / HOLDER CONTEXT</span><h2>{product.recommendedCompany}</h2><p>{product.rightsFinding ?? product.rightsEvidence}</p></section>
      <section className="detail-section"><span className="section-number">02 / CONTROL WINDOW</span><h2>{product.rightsDuration}</h2><p>{product.rightsDurationBasis}</p></section>
      <section className="detail-section diligence-section"><span className="section-number">03 / NEXT MOVE</span><p>{product.nextDiligence}</p></section>
      <details className="secondary-detail"><summary>Rights references <span>+</span></summary><div>{sourceLinks(product.rightsUrls, "Rights reference")}</div></details>
    </>
  );
}

function ProductDetail({ product }: { product: Product }) {
  return (
    <>
      <section className="detail-stat-grid four">
        <div><small>First approval</small><strong>{displayValue(product.approvalYear)}</strong><span>{displayValue(product.approvalDate)}</span></div>
        <div><small>Route</small><strong>{product.routeGroup}</strong><span>{product.route}</span></div>
        <div><small>Application</small><strong>{product.applicationType} {product.applicationNumber}</strong><span>Product {product.productNumbers}</span></div>
        <div><small>Regulatory holder</small><strong>{product.fdaHolder}</strong><span>{product.marketStatus}</span></div>
      </section>
      <section className="detail-section"><span className="section-number">01 / PRESENTATION</span><h2>{product.dosageFormRoute}</h2><p>{product.strengths}</p></section>
      <section className="detail-section"><span className="section-number">02 / MODALITY</span><h2>{product.modality}</h2><p>{product.productType}</p></section>
      <section className="detail-section"><span className="section-number">03 / MECHANISM</span><h2>{product.moaResolved ? "Curated mechanism matched" : "Mechanism unresolved"}</h2><KeyValue label="Mechanism of action" value={product.moa} /><KeyValue label="Biological target(s)" value={product.targets} /><KeyValue label="Target gene(s)" value={product.targetGenes} /><KeyValue label="Target class(es)" value={product.targetClasses} /></section>
      <section className="detail-section"><span className="section-number">04 / COMPETITION SCREEN</span><KeyValue label="Generic screen" value={product.genericScreen} /><KeyValue label="Active generic applications" value={product.activeGenericCount} /><KeyValue label="Biosimilar screen" value={product.biosimilarScreen} /><KeyValue label="Oncology screen" value={product.oncologyResult} /></section>
    </>
  );
}

function KeyValue({ label, value }: { label: string; value: unknown }) {
  return <div className="key-value"><span>{label}</span><strong>{displayValue(value)}</strong></div>;
}

function CompareDrawer({ products, onClose, onRemove, onOpenProduct }: { products: Product[]; onClose: () => void; onRemove: (id: string) => void; onOpenProduct: (id: string) => void }) {
  const rows: Array<[string, (product: Product) => unknown]> = [
    ["U.S. rights holder", (product) => product.recommendedCompany],
    ["Annual sales", (product) => product.revenueDisplay],
    ["Therapeutic area", (product) => product.therapyLens ?? product.modality],
    ["Recommendation", (product) => product.tier ?? product.hlsStatus],
    ["Strategic fit", (product) => product.fitScore],
    ["Transaction signal", (product) => product.transactionSignal],
    ["Commercial form", (product) => product.commercialForm ?? product.dosageFormRoute],
    ["Primary call points", (product) => product.primaryCallPoints],
    ["Next move", (product) => product.nextDiligence],
  ];
  return (
    <div className="overlay compare-overlay" role="presentation" onMouseDown={onClose}>
      <section className="compare-sheet" role="dialog" aria-modal="true" aria-label="Product comparison" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sheet-header"><div><p>Side-by-side review</p><h2>Compare products</h2></div><button onClick={onClose} aria-label="Close comparison">×</button></div>
        {products.length ? (
          <div className={`compare-table columns-${products.length}`}>
            <div className="compare-corner"><span>Decision lens</span></div>
            {products.map((product) => <div className="compare-product-head" key={product.id}><button onClick={() => onRemove(product.id)} aria-label={`Remove ${product.brand}`}>×</button><small>{product.ingredient}</small><strong>{product.brand}</strong><button className="text-link" onClick={() => { onClose(); onOpenProduct(product.id); }}>Open record →</button></div>)}
            {rows.flatMap(([label, getValue]) => [<div className="compare-label" key={`${label}-label`}>{label}</div>, ...products.map((product) => <div className="compare-cell" key={`${label}-${product.id}`}>{displayValue(getValue(product), "—")}</div>)])}
          </div>
        ) : <div className="empty-state"><span>+</span><h2>Select products to compare.</h2><p>Add up to three records from the universe or priority stack.</p></div>}
      </section>
    </div>
  );
}
