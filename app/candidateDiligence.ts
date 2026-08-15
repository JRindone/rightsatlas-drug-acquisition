import type { AssetDiligence, DiligenceSource, RevenueFact } from "./diligence";

type OwnerProfile = Pick<AssetDiligence, "ownership" | "parent" | "rightsHolder" | "ticker" | "companyUrl"> & {
  sources: DiligenceSource[];
};

type CandidateInput = Partial<Pick<AssetDiligence, "latestDisplay" | "latestPeriod" | "sortUsdMm" | "disclosure" | "launch" | "indicationSplit">> & {
  revenueFacts?: RevenueFact[];
  notes?: string[];
  sources?: DiligenceSource[];
};

function candidate(profile: OwnerProfile, input: CandidateInput = {}): AssetDiligence {
  return {
    ownership: profile.ownership,
    parent: profile.parent,
    rightsHolder: profile.rightsHolder,
    ticker: profile.ticker,
    companyUrl: profile.companyUrl,
    latestDisplay: input.latestDisplay ?? "Not disclosed",
    latestPeriod: input.latestPeriod ?? "Latest annual product revenue",
    sortUsdMm: input.sortUsdMm ?? null,
    disclosure: input.disclosure ?? "Not disclosed",
    launch: input.launch ?? "U.S. marketed",
    indicationSplit: input.indicationSplit ?? "No indication-level revenue split disclosed.",
    revenueFacts: input.revenueFacts ?? [],
    notes: input.notes ?? ["No separate annual product revenue was located in the current owner's public reporting."],
    sources: [...(input.sources ?? []), ...profile.sources],
  };
}

const lilly: OwnerProfile = {
  ownership: "Public parent", parent: "Eli Lilly and Company", rightsHolder: "Eli Lilly and Company", ticker: "NYSE: LLY", companyUrl: "https://www.lilly.com/",
  sources: [{ id: "lilly-company", label: "Lilly U.S. corporate site", url: "https://www.lilly.com/" }],
};
const novo: OwnerProfile = {
  ownership: "Public parent", parent: "Novo Nordisk A/S", rightsHolder: "Novo Nordisk Inc.", ticker: "NYSE: NVO", companyUrl: "https://www.novonordisk-us.com/",
  sources: [{ id: "novo-us", label: "Novo Nordisk U.S.", url: "https://www.novonordisk-us.com/" }],
};
const recordati: OwnerProfile = {
  ownership: "Public parent", parent: "Recordati S.p.A.", rightsHolder: "Recordati Rare Diseases Inc.", ticker: "BIT: REC", companyUrl: "https://recordatirarediseases.com/",
  sources: [{ id: "recordati-us", label: "Recordati Rare Diseases U.S.", url: "https://recordatirarediseases.com/" }],
};
const amgen: OwnerProfile = {
  ownership: "Public parent", parent: "Amgen Inc.", rightsHolder: "Amgen Inc.", ticker: "NASDAQ: AMGN", companyUrl: "https://www.amgen.com/",
  sources: [{ id: "amgen-company", label: "Amgen corporate site", url: "https://www.amgen.com/" }],
};
const roche: OwnerProfile = {
  ownership: "Public parent", parent: "Roche Holding AG", rightsHolder: "Genentech, Inc.", ticker: "SIX: ROG", companyUrl: "https://www.gene.com/",
  sources: [{ id: "gene-company", label: "Genentech U.S.", url: "https://www.gene.com/" }],
};
const novartis: OwnerProfile = {
  ownership: "Public parent", parent: "Novartis AG", rightsHolder: "Novartis Pharmaceuticals Corporation", ticker: "NYSE: NVS", companyUrl: "https://www.novartis.com/us-en/",
  sources: [{ id: "novartis-us", label: "Novartis U.S.", url: "https://www.novartis.com/us-en/" }],
};
const sanofi: OwnerProfile = {
  ownership: "Public parent", parent: "Sanofi S.A.", rightsHolder: "Sanofi / Sanofi Genzyme", ticker: "NASDAQ: SNY", companyUrl: "https://www.sanofi.us/",
  sources: [{ id: "sanofi-us", label: "Sanofi U.S.", url: "https://www.sanofi.us/" }],
};
const teva: OwnerProfile = {
  ownership: "Public parent", parent: "Teva Pharmaceutical Industries Ltd.", rightsHolder: "Teva Pharmaceuticals USA, Inc.", ticker: "NYSE: TEVA", companyUrl: "https://www.tevausa.com/",
  sources: [{ id: "teva-us", label: "Teva U.S.", url: "https://www.tevausa.com/" }],
};
const elusys: OwnerProfile = {
  ownership: "Private", parent: "Elusys Holdings LLC", rightsHolder: "Elusys Therapeutics, Inc.", companyUrl: "https://www.elusys.com/",
  sources: [{ id: "elusys-company", label: "Elusys Therapeutics", url: "https://www.elusys.com/" }],
};
const kiniksa: OwnerProfile = {
  ownership: "Public parent", parent: "Kiniksa Pharmaceuticals International, plc", rightsHolder: "Kiniksa Pharmaceuticals (UK), Ltd.", ticker: "NASDAQ: KNSA", companyUrl: "https://www.kiniksa.com/",
  sources: [{ id: "kiniksa-company", label: "Kiniksa corporate site", url: "https://www.kiniksa.com/" }],
};
const biogen: OwnerProfile = {
  ownership: "Public parent", parent: "Biogen Inc.", rightsHolder: "Biogen Inc.", ticker: "NASDAQ: BIIB", companyUrl: "https://www.biogen.com/",
  sources: [{ id: "biogen-company", label: "Biogen corporate site", url: "https://www.biogen.com/" }],
};
const gsk: OwnerProfile = {
  ownership: "Public parent", parent: "GSK plc", rightsHolder: "GlaxoSmithKline LLC", ticker: "NYSE: GSK", companyUrl: "https://us.gsk.com/",
  sources: [{ id: "gsk-us", label: "GSK U.S.", url: "https://us.gsk.com/" }],
};
const bayer: OwnerProfile = {
  ownership: "Public parent", parent: "Bayer AG", rightsHolder: "Bayer HealthCare Pharmaceuticals Inc.", ticker: "XETRA: BAYN", companyUrl: "https://www.bayer.com/en/us/united-states",
  sources: [{ id: "bayer-us", label: "Bayer U.S.", url: "https://www.bayer.com/en/us/united-states" }],
};
const sun: OwnerProfile = {
  ownership: "Public parent", parent: "Sun Pharmaceutical Industries Ltd.", rightsHolder: "Sun Pharmaceutical Industries, Inc.", ticker: "NSE: SUNPHARMA", companyUrl: "https://sunpharma.com/usa/",
  sources: [{ id: "sun-us", label: "Sun Pharma U.S.", url: "https://sunpharma.com/usa/" }],
};
const ucb: OwnerProfile = {
  ownership: "Public parent", parent: "UCB S.A.", rightsHolder: "UCB, Inc.", ticker: "Euronext: UCB", companyUrl: "https://www.ucb-usa.com/",
  sources: [{ id: "ucb-us", label: "UCB U.S.", url: "https://www.ucb-usa.com/" }],
};
const kyowa: OwnerProfile = {
  ownership: "Public parent", parent: "Kyowa Kirin Co., Ltd.", rightsHolder: "Kyowa Kirin, Inc.", ticker: "TSE: 4151", companyUrl: "https://www.kyowakirin.com/usa/",
  sources: [{ id: "kyowa-us", label: "Kyowa Kirin U.S.", url: "https://www.kyowakirin.com/usa/" }],
};
const serb: OwnerProfile = {
  ownership: "Private", parent: "SERB Pharmaceuticals", rightsHolder: "Salvagenix Inc. (a SERB company)", companyUrl: "https://serb.com/",
  sources: [{ id: "serb-company", label: "SERB corporate history", url: "https://serb.com/about-us/history/" }],
};
const regeneron: OwnerProfile = {
  ownership: "Public parent", parent: "Regeneron Pharmaceuticals, Inc.", rightsHolder: "Regeneron Pharmaceuticals, Inc.", ticker: "NASDAQ: REGN", companyUrl: "https://www.regeneron.com/",
  sources: [{ id: "regn-company", label: "Regeneron corporate site", url: "https://www.regeneron.com/" }],
};
const emergent: OwnerProfile = {
  ownership: "Public parent", parent: "Emergent BioSolutions Inc.", rightsHolder: "Emergent BioSolutions Inc.", ticker: "NYSE: EBS", companyUrl: "https://www.emergentbiosolutions.com/",
  sources: [{ id: "ebs-company", label: "Emergent BioSolutions", url: "https://www.emergentbiosolutions.com/" }],
};
const futurePak: OwnerProfile = {
  ownership: "Private", parent: "Future Pak, LLC", rightsHolder: "Theratechnologies Inc.", companyUrl: "https://www.theratech.com/",
  sources: [{ id: "thera-company", label: "Theratechnologies corporate site", url: "https://www.theratech.com/" }],
};
const takeda: OwnerProfile = {
  ownership: "Public parent", parent: "Takeda Pharmaceutical Company Limited", rightsHolder: "Takeda Pharmaceuticals U.S.A., Inc.", ticker: "NYSE: TAK", companyUrl: "https://www.takeda.com/en-us/",
  sources: [{ id: "takeda-us", label: "Takeda U.S.", url: "https://www.takeda.com/en-us/" }],
};
const astraZeneca: OwnerProfile = {
  ownership: "Public parent", parent: "AstraZeneca PLC", rightsHolder: "AstraZeneca Pharmaceuticals LP", ticker: "NASDAQ: AZN", companyUrl: "https://www.astrazeneca-us.com/",
  sources: [{ id: "az-us", label: "AstraZeneca U.S.", url: "https://www.astrazeneca-us.com/" }],
};
const organon: OwnerProfile = {
  ownership: "Public parent", parent: "Organon & Co.", rightsHolder: "Organon USA LLC", ticker: "NYSE: OGN", companyUrl: "https://www.organon.com/",
  sources: [{ id: "ogn-company", label: "Organon corporate site", url: "https://www.organon.com/" }],
};
const sobi: OwnerProfile = {
  ownership: "Public parent", parent: "Swedish Orphan Biovitrum AB (publ)", rightsHolder: "Sobi, Inc.", ticker: "Nasdaq Stockholm: SOBI", companyUrl: "https://www.sobi.com/en/united-states",
  sources: [{ id: "sobi-us", label: "Sobi U.S.", url: "https://www.sobi.com/en/united-states" }],
};
const pfizer: OwnerProfile = {
  ownership: "Public parent", parent: "Pfizer Inc.", rightsHolder: "Pfizer Inc.", ticker: "NYSE: PFE", companyUrl: "https://www.pfizer.com/",
  sources: [{ id: "pfizer-product", label: "Pfizer U.S. Genotropin page", url: "https://www.pfizer.com/products/product-detail/genotropin" }],
};
const emd: OwnerProfile = {
  ownership: "Public parent", parent: "Merck KGaA", rightsHolder: "EMD Serono, Inc.", ticker: "Frankfurt: MRK", companyUrl: "https://www.emdserono.com/us-en",
  sources: [{ id: "emd-us", label: "EMD Serono U.S.", url: "https://www.emdserono.com/us-en" }],
};
const gilead: OwnerProfile = {
  ownership: "Public parent", parent: "Gilead Sciences, Inc.", rightsHolder: "Gilead Sciences, Inc.", ticker: "NASDAQ: GILD", companyUrl: "https://www.gilead.com/",
  sources: [{ id: "gilead-company", label: "Gilead corporate site", url: "https://www.gilead.com/" }],
};
const rhythm: OwnerProfile = {
  ownership: "Public parent", parent: "Rhythm Pharmaceuticals, Inc.", rightsHolder: "Rhythm Pharmaceuticals, Inc.", ticker: "NASDAQ: RYTM", companyUrl: "https://www.rhythmtx.com/",
  sources: [{ id: "rhythm-company", label: "Rhythm corporate site", url: "https://www.rhythmtx.com/" }],
};
const eton: OwnerProfile = {
  ownership: "Public parent", parent: "Eton Pharmaceuticals, Inc.", rightsHolder: "Eton Pharmaceuticals, Inc.", ticker: "NASDAQ: ETON", companyUrl: "https://www.etonpharma.com/",
  sources: [{ id: "eton-company", label: "Eton Pharmaceuticals", url: "https://www.etonpharma.com/" }],
};
const evolus: OwnerProfile = {
  ownership: "Public parent", parent: "Evolus, Inc.", rightsHolder: "Evolus, Inc.", ticker: "NASDAQ: EOLS", companyUrl: "https://www.evolus.com/",
  sources: [{ id: "evolus-company", label: "Evolus corporate site", url: "https://www.evolus.com/" }],
};

const lilly10k: DiligenceSource = { id: "lilly-24", label: "Lilly 2024 Form 10-K", url: "https://www.sec.gov/Archives/edgar/data/59478/000005947825000067/lly-20241231.htm" };
const novo25: DiligenceSource = { id: "novo-25", label: "Novo Nordisk 2025 annual report", url: "https://www.novonordisk.com/content/dam/nncorp/global/en/investors/irmaterial/annual_report/2026/novo-nordisk-annual-report-2025.pdf" };
const recordati25: DiligenceSource = { id: "recordati-25", label: "Recordati 2025 annual report", url: "https://annualreport.recordati.com/wp-content/uploads/2026/04/ANNUAL-REPORT-2025_260429.pdf" };
const amgen25: DiligenceSource = { id: "amgen-25", label: "Amgen FY2025 results", url: "https://www.amgen.com/newsroom/press-releases/2026/02/amgen-reports-fourth-quarter-and-full-year-2025-financial-results" };
const roche25: DiligenceSource = { id: "roche-25", label: "Roche FY2025 investor update", url: "https://assets.roche.com/f/176343/x/7bf0314a2a/260129_ir_fy25_en.pdf" };
const novartis25: DiligenceSource = { id: "novartis-25", label: "Novartis 2025 annual report", url: "https://www.novartis.com/sites/novartis_com/files/novartis-annual-report-2025.pdf" };
const sanofi25: DiligenceSource = { id: "sanofi-25", label: "Sanofi 2025 Form 20-F", url: "https://www.sanofi.com/assets/dotcom/content-app/publications/annual-report-on-form-20-f/2025-01-01-form-20-f-2025-en.pdf" };
const teva25: DiligenceSource = { id: "teva-25", label: "Teva FY2025 results", url: "https://ir.tevapharm.com/news-and-events/press-releases/press-release-details/2026/Teva-Innovative-Portfolio-and-Consistent-Execution-of-Pivot-to-Growth-Strategy-Deliver-Third-Consecutive-Year-of-Growth-Pipeline-Positioned-to-Unlock-Significant-Value-Potential/default.aspx" };
const kiniksa25: DiligenceSource = { id: "kiniksa-25", label: "Kiniksa FY2025 results", url: "https://investors.kiniksa.com/news-releases/news-release-details/kiniksa-pharmaceuticals-reports-fourth-quarter-and-full-year-3/" };
const biogen25: DiligenceSource = { id: "biogen-25", label: "Biogen 2025 Form 10-K", url: "https://investors.biogen.com/node/30146/html" };
const gsk25: DiligenceSource = { id: "gsk-25", label: "GSK 2025 annual-report investor information", url: "https://www.gsk.com/media/3rxjw5di/investor-information-2025.pdf" };
const ucb25: DiligenceSource = { id: "ucb-25", label: "UCB 2025 integrated annual report", url: "https://www.ucb.com/sites/default/files/2026-02/IAR_2025_WEB.pdf" };
const kyowa25: DiligenceSource = { id: "kyowa-25", label: "Kyowa Kirin FY2025 results presentation", url: "https://ir.kyowakirin.com/en/library/earnings/earnings0/main/0118/teaserItems1/00/linkList/01/link/presentation_2022_q2_en.pdf" };
const regn25: DiligenceSource = { id: "regn-25", label: "Regeneron FY2025 results", url: "https://investor.regeneron.com/news-releases/news-release-details/regeneron-reports-fourth-quarter-and-full-year-2025-financial" };
const thera24: DiligenceSource = { id: "thera-24", label: "Theratechnologies FY2024 results", url: "https://www.theratech.com/news-releases/news-release-details/theratechnologies-reports-financial-results-fourth-quarter-and-0/" };
const theraSale: DiligenceSource = { id: "thera-sale", label: "Future Pak acquisition completion", url: "https://www.theratech.com/node/16566/pdf" };
const takeda25: DiligenceSource = { id: "takeda-25", label: "Takeda FY2025 Form 20-F", url: "https://assets-dam.takeda.com/image/upload/v1781693344/Global/Investor/form20-f/E_FY2025_Form_20-F.pdf" };
const az25: DiligenceSource = { id: "az-25", label: "AstraZeneca 2025 Form 20-F", url: "https://www.sec.gov/Archives/edgar/data/901832/000110465926019130/azn-20251231x20f.htm" };
const organon25: DiligenceSource = { id: "ogn-25", label: "Organon FY2025 results", url: "https://www.organon.com/news/organon-reports-results-for-the-fourth-quarter-and-full-year-ended-december-31-2025/" };
const sobi25: DiligenceSource = { id: "sobi-25", label: "Sobi FY2025 results", url: "https://www.sobi.com/sites/sobi/files/pr/202602046224-1.pdf" };
const emd25: DiligenceSource = { id: "emd-25", label: "Merck KGaA 2025 annual report — Healthcare", url: "https://www.reports.emdgroup.com/en/annualreport/2025/management-report/report-on-economic-position/course-of-business-and-economic-position/healthcare.html" };
const gileadApproval: DiligenceSource = { id: "gilead-approval", label: "Gilead U.S. Hepcludex approval", url: "https://www.gilead.com/news/news-details/2026/fda-grants-accelerated-approval-to-gileads-hepcludex-bulevirtide-gmod-the-first-and-only-approved-treatment-for-chronic-hepatitis-delta-virus-hdv" };
const rhythm25: DiligenceSource = { id: "rhythm-25", label: "Rhythm 2025 annual report", url: "https://ir.rhythmtx.com/static-files/47fcb308-a758-4c07-ac28-ce9cae15f850" };
const eton25: DiligenceSource = { id: "eton-25", label: "Eton FY2025 results", url: "https://ir.etonpharma.com/news-releases/news-release-details/eton-pharmaceuticals-reports-fourth-quarter-and-full-year-2025/" };
const evolus25: DiligenceSource = { id: "evolus-25", label: "Evolus FY2025 results", url: "https://investors.evolus.com/press-releases-and-news/news-details/2026/Evolus-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results-Delivers-Sixth-Consecutive-Year-of-Double-Digit-Growth-and-Expects-Sustainable-Profitability1-Beginning-in-2026/default.aspx" };

const humalogFranchise = (launch: string) => candidate(lilly, {
  latestDisplay: "$1,502.6m", latestPeriod: "FY2024 U.S. Humalog franchise", sortUsdMm: 1502.6, disclosure: "Broader disclosure", launch,
  revenueFacts: [
    { period: "2024", value: "$1,502.6m", scope: "U.S. Humalog franchise; formulation not separated", sourceIds: ["lilly-24"] },
    { period: "2024", value: "$2,324.8m", scope: "Global Humalog franchise", sourceIds: ["lilly-24"] },
    { period: "2023", value: "$1,663.3m", scope: "Global Humalog franchise", sourceIds: ["lilly-24"] },
  ],
  notes: ["Lilly reports Humalog as a franchise; Mix 50/50, Mix 75/25 and other formulations are not separated."], sources: [lilly10k],
});

const entyvioFranchise = (launch: string) => candidate(takeda, {
  latestDisplay: "¥623.7bn", latestPeriod: "FY2025 U.S. Entyvio franchise", disclosure: "Broader disclosure", launch,
  revenueFacts: [
    { period: "FY2025", value: "¥623.7bn", scope: "U.S. Entyvio franchise; year ended March 31, 2026", sourceIds: ["takeda-25"] },
    { period: "FY2024", value: "¥619.2bn", scope: "U.S. Entyvio franchise; year ended March 31, 2025", sourceIds: ["takeda-25"] },
    { period: "FY2023", value: "¥546.1bn", scope: "U.S. Entyvio franchise; year ended March 31, 2024", sourceIds: ["takeda-25"] },
  ], notes: ["Takeda does not separate Entyvio Pen from the full Entyvio franchise."], sources: [takeda25],
});

const enbrelFranchise = (launch: string) => candidate(amgen, {
  latestDisplay: "$2,199m", latestPeriod: "FY2025 U.S. Enbrel franchise", sortUsdMm: 2199, disclosure: "Broader disclosure", launch,
  revenueFacts: [
    { period: "2025", value: "$2,199m", scope: "U.S. Enbrel franchise", sourceIds: ["amgen-25"] },
    { period: "2024", value: "$3,288m", scope: "U.S. Enbrel franchise", sourceIds: ["amgen-25"] },
    { period: "2023", value: "$3,650m", scope: "U.S. Enbrel franchise", sourceIds: ["amgen-25"] },
  ], notes: ["Amgen reports Enbrel as a franchise; Mini is not separated."], sources: [amgen25],
});

export const CANDIDATE_DILIGENCE: Record<string, AssetDiligence> = {
  "Humalog Mix 50/50": humalogFranchise("U.S. marketed; part of the Humalog franchise launched in 1996"),
  "Humalog Mix 75/25": humalogFranchise("U.S. marketed; part of the Humalog franchise launched in 1996"),
  "Novolog Mix 70/30": candidate(novo, {
    latestDisplay: "DKK 567m", latestPeriod: "FY2025 U.S. NovoMix franchise", disclosure: "Broader disclosure", launch: "U.S. marketed",
    revenueFacts: [
      { period: "2025", value: "DKK 567m", scope: "U.S. NovoMix franchise", sourceIds: ["novo-25"] },
      { period: "2024", value: "DKK 632m", scope: "U.S. NovoMix franchise", sourceIds: ["novo-25"] },
    ], notes: ["Novo Nordisk reports NovoMix as a franchise and does not separate the 70/30 presentation."], sources: [novo25],
  }),
  "SIGNIFOR LAR KIT": candidate(recordati, {
    latestDisplay: "€131.3m", latestPeriod: "FY2025 global Signifor franchise", disclosure: "Broader disclosure", launch: "U.S. marketed since 2014",
    revenueFacts: [
      { period: "2025", value: "€131.3m", scope: "Global Signifor franchise", sourceIds: ["recordati-25"] },
      { period: "2024", value: "€118.0m", scope: "Global Signifor franchise", sourceIds: ["recordati-25"] },
    ], notes: ["Recordati does not provide a U.S.-only or LAR-kit-only split."], sources: [recordati25],
  }),
  "Actimmune": candidate(amgen, {
    launch: "U.S. marketed",
    notes: ["Actimmune is included with several products in Amgen's Ultra-Rare group; the group figure is not attributed to Actimmune."], sources: [amgen25],
  }),
  "Activase": candidate(roche, {
    latestDisplay: "CHF 1,056m", latestPeriod: "FY2025 U.S. Activase/TNKase combined", disclosure: "Broader disclosure", launch: "U.S. marketed since 1987",
    revenueFacts: [{ period: "2025", value: "CHF 1,056m", scope: "U.S. Activase and TNKase combined", sourceIds: ["roche-25"] }],
    notes: ["Roche combines Activase with TNKase; no Activase-only figure is presented."], sources: [roche25],
  }),
  "Adakveo": candidate(novartis, {
    launch: "U.S. launch: 2019", notes: ["Adakveo is listed in the U.S. portfolio but is not separately reported in Novartis product-sales tables."],
    sources: [{ id: "adakveo-us", label: "Novartis U.S. product portfolio", url: "https://www.novartis.com/us-en/about/products?site=PS003386" }, novartis25],
  }),
  "Admelog": candidate(sanofi, {
    launch: "U.S. launch: 2018", notes: ["Sanofi includes Admelog in an insulin 'Others' line and does not provide separate U.S. product sales."], sources: [sanofi25],
  }),
  "Aimovig": candidate(amgen, {
    latestDisplay: "$311m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 311, disclosure: "Exact U.S.", launch: "U.S. launch: 2018",
    revenueFacts: [
      { period: "2025", value: "$311m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
      { period: "2024", value: "$308m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
      { period: "2023", value: "$303m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
    ], notes: [], sources: [amgen25],
  }),
  "Ajovy": candidate(teva, {
    latestDisplay: "$295m", latestPeriod: "FY2025 U.S. product revenue", sortUsdMm: 295, disclosure: "Exact U.S.", launch: "U.S. launch: 2018",
    revenueFacts: [
      { period: "2025", value: "$295m", scope: "U.S. product revenue", sourceIds: ["teva-25"] },
      { period: "2024", value: "$207m", scope: "U.S. product revenue", sourceIds: ["teva-25"] },
    ], notes: [], sources: [teva25],
  }),
  "Anthim": candidate(elusys, {
    launch: "FDA approved in 2016; supplied through U.S. government preparedness contracts",
    notes: ["No recurring commercial U.S. annual product-sales series is publicly disclosed."],
    sources: [{ id: "anthim-ownership", label: "Elusys sale and royalty disclosure", url: "https://www.sec.gov/Archives/edgar/data/1476963/000155837024005902/scpx-20231231x10k.htm" }],
  }),
  "Apidra": candidate(sanofi, {
    launch: "U.S. marketed since 2004", notes: ["Sanofi includes Apidra in an insulin 'Others' line and does not provide separate U.S. product sales."], sources: [sanofi25],
  }),
  "Aranesp": candidate(amgen, {
    latestDisplay: "$416m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 416, disclosure: "Exact U.S.", launch: "U.S. marketed since 2001",
    revenueFacts: [
      { period: "2025", value: "$416m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
      { period: "2025", value: "$1,389m", scope: "Global product sales", sourceIds: ["amgen-25"] },
      { period: "2024", value: "$1,342m", scope: "Global product sales", sourceIds: ["amgen-25"] },
      { period: "2023", value: "$1,362m", scope: "Global product sales", sourceIds: ["amgen-25"] },
    ], notes: [], sources: [amgen25],
  }),
  "Arcalyst": candidate(kiniksa, {
    latestDisplay: "$677.6m", latestPeriod: "FY2025 net product revenue", sortUsdMm: 677.6, disclosure: "Broader disclosure", launch: "U.S. launch for recurrent pericarditis: 2021",
    revenueFacts: [
      { period: "2025", value: "$677.6m", scope: "Net product revenue; geography not separately labeled", sourceIds: ["kiniksa-25"] },
      { period: "2024", value: "$423.2m", scope: "Net product revenue; geography not separately labeled", sourceIds: ["kiniksa-25"] },
    ], notes: ["Kiniksa reports product revenue without an indication split."], sources: [kiniksa25],
  }),
  "Avonex": candidate(biogen, {
    latestDisplay: "$482.9m", latestPeriod: "FY2025 U.S. product revenue", sortUsdMm: 482.9, disclosure: "Exact U.S.", launch: "U.S. marketed since 1996",
    revenueFacts: [
      { period: "2025", value: "$482.9m", scope: "U.S. product revenue", sourceIds: ["biogen-25"] },
      { period: "2024", value: "$451.3m", scope: "U.S. product revenue", sourceIds: ["biogen-25"] },
      { period: "2023", value: "$536.7m", scope: "U.S. product revenue", sourceIds: ["biogen-25"] },
    ], notes: [], sources: [biogen25],
  }),
  "Basaglar": candidate(lilly, {
    latestDisplay: "$375.4m", latestPeriod: "FY2024 U.S. Basaglar/Rezvoglar", sortUsdMm: 375.4, disclosure: "Broader disclosure", launch: "U.S. launch: 2016",
    revenueFacts: [
      { period: "2024", value: "$375.4m", scope: "U.S. Basaglar and Rezvoglar combined", sourceIds: ["lilly-24"] },
      { period: "2024", value: "$676.9m", scope: "Global Basaglar and Rezvoglar combined", sourceIds: ["lilly-24"] },
      { period: "2023", value: "$728.3m", scope: "Global Basaglar and Rezvoglar combined", sourceIds: ["lilly-24"] },
    ], notes: ["Lilly combines Basaglar with Rezvoglar in product reporting."], sources: [lilly10k],
  }),
  "Benlysta": candidate(gsk, {
    latestDisplay: "£1,464m", latestPeriod: "FY2025 U.S. product sales", disclosure: "Exact U.S.", launch: "U.S. launch: 2011",
    revenueFacts: [
      { period: "2025", value: "£1,464m", scope: "U.S. product sales", sourceIds: ["gsk-25"] },
      { period: "2024", value: "£1,222m", scope: "U.S. product sales", sourceIds: ["gsk-25"] },
    ], notes: ["GSK does not provide a sales split by approved indication."], sources: [gsk25],
  }),
  "Betaseron": candidate(bayer, {
    launch: "U.S. marketed since 1993", notes: ["Bayer does not separately disclose current U.S. Betaseron annual revenue."],
    sources: [{ id: "bayer-reports", label: "Bayer annual reports", url: "https://www.bayer.com/en/investors/annual-reports" }],
  }),
  "BYNFEZIA PEN": candidate(sun, {
    launch: "U.S. launch: 2020", notes: ["Sun Pharma does not separately disclose BYNFEZIA PEN product revenue."],
    sources: [{ id: "sun-25", label: "Sun Pharma FY2025 annual report", url: "https://sunpharma.com/wp-content/uploads/2025/07/SPIL-Annual-Report-2024-25.pdf" }],
  }),
  "Cablivi": candidate(sanofi, {
    latestDisplay: "€143m", latestPeriod: "FY2025 U.S. product sales", disclosure: "Exact U.S.", launch: "U.S. launch: 2019",
    revenueFacts: [
      { period: "2025", value: "€143m", scope: "U.S. product sales", sourceIds: ["sanofi-25"] },
      { period: "2025", value: "€271m", scope: "Global product sales", sourceIds: ["sanofi-25"] },
    ], notes: [], sources: [sanofi25],
  }),
  "Campath": candidate(sanofi, {
    launch: "Commercial distribution discontinued in 2012; controlled access continues",
    notes: ["No current commercial product-sales line is disclosed."], sources: [sanofi25],
  }),
  "Cathflo Activase": candidate(roche, {
    launch: "U.S. marketed since 2001", notes: ["Roche's Activase/TNKase sales line cannot be attributed to Cathflo Activase."], sources: [roche25],
  }),
  "Cimzia": candidate(ucb, {
    latestDisplay: "€1,208m", latestPeriod: "FY2025 U.S. product revenue", disclosure: "Exact U.S.", launch: "U.S. launch: 2008",
    revenueFacts: [
      { period: "2025", value: "€1,208m", scope: "U.S. product revenue", sourceIds: ["ucb-25"] },
      { period: "2024", value: "€1,289m", scope: "U.S. product revenue", sourceIds: ["ucb-25"] },
      { period: "2025", value: "€1,954m", scope: "Global product revenue", sourceIds: ["ucb-25"] },
    ], notes: ["UCB does not provide an indication-level revenue split."], sources: [ucb25],
  }),
  "Cinqair": candidate(teva, {
    launch: "U.S. launch: 2016", notes: ["Teva does not separately disclose Cinqair product revenue."], sources: [teva25],
  }),
  "Cosentyx": candidate(novartis, {
    latestDisplay: "$3,839m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 3839, disclosure: "Exact U.S.", launch: "U.S. launch: 2015",
    revenueFacts: [
      { period: "2025", value: "$3,839m", scope: "U.S. product sales", sourceIds: ["novartis-25"] },
      { period: "2025", value: "$6,668m", scope: "Global product sales", sourceIds: ["novartis-25"] },
      { period: "2024", value: "$6,141m", scope: "Global product sales", sourceIds: ["novartis-25"] },
    ], notes: ["Novartis does not provide an indication-level revenue split."], sources: [novartis25],
  }),
  "Crysvita": candidate(kyowa, {
    latestDisplay: "$946m", latestPeriod: "FY2025 North America revenue", sortUsdMm: 946, disclosure: "Broader disclosure", launch: "U.S. launch: 2018",
    revenueFacts: [
      { period: "2025", value: "$946m", scope: "North America sales revenue", sourceIds: ["kyowa-25"] },
      { period: "2024", value: "$860m", scope: "North America sales revenue", sourceIds: ["kyowa-25"] },
      { period: "2023", value: "$747m", scope: "North America sales revenue", sourceIds: ["kyowa-25"] },
      { period: "2022", value: "$662m", scope: "North America sales revenue", sourceIds: ["kyowa-25"] },
      { period: "2021", value: "$527m", scope: "North America sales revenue", sourceIds: ["kyowa-25"] },
    ], notes: ["Kyowa Kirin reports North America, not U.S.-only, revenue."], sources: [kyowa25],
  }),
  "Digifab": candidate(serb, {
    launch: "U.S. marketed", notes: ["SERB is privately held and does not publicly report annual DigiFab product revenue."],
    sources: [{ id: "digifab-pi", label: "DigiFab U.S. prescribing information", url: "https://digifab.health/getmedia/20260204/87131120_20251_NO_V1_DigiFab%20Package%20Insert.pdf" }],
  }),
  "Dupixent": candidate({ ...regeneron, rightsHolder: "Regeneron Pharmaceuticals, Inc. / Sanofi Genzyme" }, {
    latestDisplay: "€11,538m", latestPeriod: "FY2025 U.S. product sales reported by Sanofi", disclosure: "Exact U.S.", launch: "U.S. launch: 2017",
    revenueFacts: [
      { period: "2025", value: "€11,538m", scope: "U.S. Dupixent sales reported by Sanofi", sourceIds: ["sanofi-25"] },
      { period: "2025", value: "€15,714m", scope: "Global Dupixent sales reported by Sanofi", sourceIds: ["sanofi-25"] },
    ], notes: ["Regeneron and Sanofi co-commercialize; Regeneron's economics are profit-share income rather than booked product sales."], sources: [sanofi25],
  }),
  "Ebanga": candidate(emergent, {
    launch: "FDA approved in 2020; medical-countermeasure product",
    notes: ["Emergent lists Ebanga in its medical-countermeasure portfolio but does not separately disclose annual product revenue."],
    sources: [{ id: "ebs-25", label: "Emergent 2025 ESG report and product portfolio", url: "https://www.emergentbiosolutions.com/wp-content/uploads/2026/05/2025-Emergent-ESG-Report.pdf" }],
  }),
  "Egrifta SV": candidate(futurePak, {
    latestDisplay: "$60.147m", latestPeriod: "FY2024 U.S. net sales before take-private", sortUsdMm: 60.147, disclosure: "Exact U.S.", launch: "U.S. formulation launch: 2019",
    revenueFacts: [
      { period: "2024", value: "$60.147m", scope: "U.S. net sales", sourceIds: ["thera-24"] },
      { period: "2023", value: "$53.705m", scope: "U.S. net sales", sourceIds: ["thera-24"] },
    ], notes: ["Future Pak completed its acquisition of Theratechnologies in September 2025; no post-acquisition annual product figure is public."], sources: [thera24, theraSale],
  }),
  "Egrifta WR": candidate(futurePak, {
    latestPeriod: "Annual product revenue after 2025 launch", launch: "U.S. availability: September 2025",
    notes: ["The WR formulation launched shortly before Future Pak completed its acquisition; no separate annual WR revenue is public."], sources: [theraSale, thera24],
  }),
  "Emgality": candidate(lilly, {
    latestDisplay: "$559.7m", latestPeriod: "FY2024 U.S. product revenue", sortUsdMm: 559.7, disclosure: "Exact U.S.", launch: "U.S. launch: 2018",
    revenueFacts: [
      { period: "2024", value: "$559.7m", scope: "U.S. product revenue", sourceIds: ["lilly-24"] },
      { period: "2024", value: "$870.4m", scope: "Global product revenue", sourceIds: ["lilly-24"] },
      { period: "2023", value: "$678.3m", scope: "Global product revenue", sourceIds: ["lilly-24"] },
    ], notes: ["Lilly does not provide an indication-level revenue split."], sources: [lilly10k],
  }),
  "Enbrel": enbrelFranchise("U.S. marketed since 1998"),
  "Enbrel Mini": enbrelFranchise("U.S. marketed; presentation within the Enbrel franchise"),
  "Enspryng": candidate(roche, {
    latestDisplay: "CHF 97m", latestPeriod: "FY2025 U.S. product sales", disclosure: "Exact U.S.", launch: "U.S. launch: 2020",
    revenueFacts: [
      { period: "2025", value: "CHF 97m", scope: "U.S. product sales", sourceIds: ["roche-25"] },
      { period: "2025", value: "CHF 364m", scope: "Global product sales", sourceIds: ["roche-25"] },
    ], notes: [], sources: [roche25],
  }),
  "Entyvio": entyvioFranchise("U.S. launch: 2014"),
  "Entyvio Pen": entyvioFranchise("U.S. subcutaneous presentation launched after the IV franchise"),
  "Epogen/Procrit": candidate({ ...amgen, parent: "Amgen Inc. / Johnson & Johnson", rightsHolder: "Amgen Inc. (EPOGEN) / Janssen (PROCRIT)", ticker: "NASDAQ: AMGN / NYSE: JNJ" }, {
    launch: "U.S. marketed since 1989", notes: ["The catalog row combines two brands with separate rights holders; no clean combined U.S. product-sales figure is used."], sources: [amgen25],
  }),
  "Evenity": candidate(amgen, {
    latestDisplay: "$1,600m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 1600, disclosure: "Exact U.S.", launch: "U.S. launch: 2019",
    revenueFacts: [
      { period: "2025", value: "$1,600m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
      { period: "2024", value: "$1,131m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
      { period: "2023", value: "$809m", scope: "U.S. product sales", sourceIds: ["amgen-25"] },
    ], notes: [], sources: [amgen25],
  }),
  "Evkeeza": candidate(regeneron, {
    latestDisplay: "$162.2m", latestPeriod: "FY2025 U.S. net product sales", sortUsdMm: 162.2, disclosure: "Exact U.S.", launch: "U.S. launch: 2021",
    revenueFacts: [
      { period: "2025", value: "$162.2m", scope: "U.S. net product sales", sourceIds: ["regn-25"] },
      { period: "2024", value: "$125.7m", scope: "U.S. net product sales", sourceIds: ["regn-25"] },
      { period: "2023", value: "$77.3m", scope: "U.S. net product sales", sourceIds: ["regn-25"] },
    ], notes: [], sources: [regn25],
  }),
  "Fasenra": candidate(astraZeneca, {
    latestDisplay: "$1,195m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 1195, disclosure: "Exact U.S.", launch: "U.S. launch: 2017",
    revenueFacts: [
      { period: "2025", value: "$1,195m", scope: "U.S. product sales", sourceIds: ["az-25"] },
      { period: "2024", value: "$1,049m", scope: "U.S. product sales", sourceIds: ["az-25"] },
      { period: "2023", value: "$992m", scope: "U.S. product sales", sourceIds: ["az-25"] },
    ], notes: ["AstraZeneca does not provide an indication-level revenue split."], sources: [az25],
  }),
  "Fiasp": candidate(novo, {
    latestDisplay: "DKK 1,079m", latestPeriod: "FY2025 U.S. product sales", disclosure: "Exact U.S.", launch: "U.S. launch: 2017",
    revenueFacts: [
      { period: "2025", value: "DKK 1,079m", scope: "U.S. product sales", sourceIds: ["novo-25"] },
      { period: "2024", value: "DKK 213m", scope: "U.S. product sales", sourceIds: ["novo-25"] },
    ], notes: [], sources: [novo25],
  }),
  "Follistim AQ Cartridge": candidate(organon, {
    latestDisplay: "$112m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 112, disclosure: "Exact U.S.", launch: "U.S. marketed",
    revenueFacts: [
      { period: "2025", value: "$112m", scope: "U.S. product sales", sourceIds: ["ogn-25"] },
      { period: "2024", value: "$84m", scope: "U.S. product sales", sourceIds: ["ogn-25"] },
      { period: "2025", value: "$264m", scope: "Global product sales", sourceIds: ["ogn-25"] },
    ], notes: [], sources: [organon25],
  }),
  "Gamifant": candidate(sobi, {
    latestDisplay: "SEK 2,710m", latestPeriod: "FY2025 global product revenue", disclosure: "Broader disclosure", launch: "U.S. launch: 2018",
    revenueFacts: [
      { period: "2025", value: "SEK 2,710m", scope: "Global product revenue", sourceIds: ["sobi-25"] },
      { period: "2024", value: "SEK 1,876m", scope: "Global product revenue", sourceIds: ["sobi-25"] },
    ], notes: ["Sobi does not provide a U.S.-only revenue split."], sources: [sobi25],
  }),
  "GATTEX KIT": candidate(takeda, {
    latestDisplay: "¥145.7bn", latestPeriod: "FY2025 global GATTEX/REVESTIVE", disclosure: "Broader disclosure", launch: "U.S. launch: 2013",
    revenueFacts: [
      { period: "FY2025", value: "¥145.7bn", scope: "Global GATTEX/REVESTIVE franchise; year ended March 31, 2026", sourceIds: ["takeda-25"] },
      { period: "FY2024", value: "¥146.3bn", scope: "Global GATTEX/REVESTIVE franchise", sourceIds: ["takeda-25"] },
      { period: "FY2023", value: "¥119.3bn", scope: "Global GATTEX/REVESTIVE franchise", sourceIds: ["takeda-25"] },
    ], notes: ["Takeda does not provide a U.S.-only GATTEX split."], sources: [takeda25],
  }),
  "Genotropin": candidate(pfizer, {
    launch: "U.S. marketed", notes: ["Pfizer lists Genotropin in its U.S. portfolio but does not separately report annual product revenue."],
    sources: [{ id: "pfizer-reports", label: "Pfizer annual reports", url: "https://investors.pfizer.com/Investors/Financials/Annual-Reports/default.aspx?LanguageId=1" }],
  }),
  "Gonal-f": candidate(emd, {
    latestDisplay: "€735m", latestPeriod: "FY2025 global Gonal-f franchise", disclosure: "Broader disclosure", launch: "U.S. marketed since 1997",
    revenueFacts: [
      { period: "2025", value: "€735m", scope: "Global Gonal-f franchise", sourceIds: ["emd-25"] },
      { period: "2024", value: "€833m", scope: "Global Gonal-f franchise", sourceIds: ["emd-25"] },
    ], notes: ["Merck KGaA does not provide a U.S.-only split."], sources: [emd25],
  }),
  "Gonal-f RFF RediJect": candidate(emd, {
    latestDisplay: "€735m", latestPeriod: "FY2025 global Gonal-f franchise", disclosure: "Broader disclosure", launch: "U.S. marketed; presentation within the Gonal-f franchise",
    revenueFacts: [
      { period: "2025", value: "€735m", scope: "Global Gonal-f franchise; RediJect not separated", sourceIds: ["emd-25"] },
      { period: "2024", value: "€833m", scope: "Global Gonal-f franchise; RediJect not separated", sourceIds: ["emd-25"] },
    ], notes: ["Merck KGaA does not separate RediJect or provide a U.S.-only split."], sources: [emd25],
  }),
  "Hepcludex": candidate(gilead, {
    latestDisplay: "No completed U.S. annual period", latestPeriod: "U.S. approval: May 2026", disclosure: "Pre-revenue", launch: "FDA accelerated approval: May 22, 2026",
    notes: ["The first full U.S. annual reporting period has not completed; no estimate is shown."], sources: [gileadApproval],
  }),
  "Humalog": humalogFranchise("U.S. launch: 1996"),
  "Humatrope": candidate(lilly, {
    launch: "U.S. marketed since 1987", notes: ["Lilly includes Humatrope in other products and does not separately disclose annual U.S. product revenue."], sources: [lilly10k],
  }),
  "Humulin R U-500": candidate(lilly, {
    latestDisplay: "$643.4m", latestPeriod: "FY2024 U.S. Humulin franchise", sortUsdMm: 643.4, disclosure: "Broader disclosure", launch: "U.S. marketed; presentation within the Humulin franchise",
    revenueFacts: [
      { period: "2024", value: "$643.4m", scope: "U.S. Humulin franchise; U-500 not separated", sourceIds: ["lilly-24"] },
      { period: "2024", value: "$917.1m", scope: "Global Humulin franchise", sourceIds: ["lilly-24"] },
      { period: "2023", value: "$852.1m", scope: "Global Humulin franchise", sourceIds: ["lilly-24"] },
    ], notes: ["Lilly does not separate U-500 from the Humulin franchise."], sources: [lilly10k],
  }),
  "Ilaris": candidate(novartis, {
    latestDisplay: "$1,041m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 1041, disclosure: "Exact U.S.", launch: "U.S. launch: 2009",
    revenueFacts: [
      { period: "2025", value: "$1,041m", scope: "U.S. product sales", sourceIds: ["novartis-25"] },
      { period: "2025", value: "$1,883m", scope: "Global product sales", sourceIds: ["novartis-25"] },
      { period: "2024", value: "$1,509m", scope: "Global product sales", sourceIds: ["novartis-25"] },
    ], notes: ["Novartis does not provide an indication-level revenue split."], sources: [novartis25],
  }),
  "Ilumya": candidate(sun, {
    latestDisplay: "Not disclosed", latestPeriod: "U.S. annual product revenue", launch: "U.S. launch: 2018",
    notes: ["Sun Pharma identifies Ilumya as a key specialty product but reports only the broader global specialty portfolio."],
    sources: [{ id: "sun-25", label: "Sun Pharma FY2025 annual report", url: "https://sunpharma.com/wp-content/uploads/2025/07/SPIL-Annual-Report-2024-25.pdf" }],
  }),
  "IMCIVREE": candidate(rhythm, {
    latestDisplay: "$194.771m", latestPeriod: "FY2025 global net product revenue", disclosure: "Broader disclosure", launch: "U.S. launch: 2020",
    revenueFacts: [
      { period: "2025", value: "$194.771m", scope: "Global net product revenue; 69% generated in the U.S.", sourceIds: ["rhythm-25"] },
      { period: "2024", value: "$130.126m", scope: "Global net product revenue; 74% generated in the U.S.", sourceIds: ["rhythm-25"] },
    ], notes: ["The issuer provides rounded U.S. percentages, so no calculated U.S. dollar estimate is shown."], sources: [rhythm25],
  }),
  "Increlex": candidate(eton, {
    launch: "U.S. marketed since 2005; Eton acquired U.S. rights in 2025",
    notes: ["Eton reports company product revenue but does not separately disclose Increlex annual sales."], sources: [eton25],
  }),
  "Inmazeb": candidate(regeneron, {
    latestDisplay: "$37.4m", latestPeriod: "FY2025 U.S. net product sales", sortUsdMm: 37.4, disclosure: "Exact U.S.", launch: "FDA approved in 2020; government-preparedness demand",
    revenueFacts: [
      { period: "2025", value: "$37.4m", scope: "U.S. net product sales", sourceIds: ["regn-25"] },
      { period: "2024", value: "$76.8m", scope: "U.S. net product sales", sourceIds: ["regn-25"] },
      { period: "2023", value: "$69.8m", scope: "U.S. net product sales", sourceIds: ["regn-25"] },
    ], notes: ["Sales may vary with government purchasing cycles."], sources: [regn25],
  }),
  "Jeuveau": candidate(evolus, {
    latestDisplay: "$294.956m", latestPeriod: "FY2025 company product revenue", sortUsdMm: 294.956, disclosure: "Broader disclosure", launch: "U.S. launch: 2019",
    revenueFacts: [
      { period: "2025", value: "$294.956m", scope: "Company product revenue; includes Jeuveau/Nuceiva and the Evolysse launch", sourceIds: ["evolus-25"] },
      { period: "2024", value: "$264.306m", scope: "Company product revenue; primarily Jeuveau/Nuceiva", sourceIds: ["evolus-25"] },
    ], notes: ["Evolus no longer provides a clean Jeuveau-only figure after adding Evolysse."], sources: [evolus25],
  }),
  "Kalbitor": candidate(takeda, {
    launch: "U.S. launch: 2009", notes: ["Takeda includes Kalbitor in an Other Rare Diseases line and does not separately disclose product revenue."], sources: [takeda25],
  }),
  "Kepivance": candidate(sobi, {
    launch: "U.S. marketed since 2004", notes: ["Sobi includes Kepivance in Other Specialty Care and does not separately disclose product revenue."], sources: [sobi25],
  }),
  "Kesimpta": candidate(novartis, {
    latestDisplay: "$2,943m", latestPeriod: "FY2025 U.S. product sales", sortUsdMm: 2943, disclosure: "Exact U.S.", launch: "U.S. launch: 2020",
    revenueFacts: [
      { period: "2025", value: "$2,943m", scope: "U.S. product sales", sourceIds: ["novartis-25"] },
      { period: "2025", value: "$4,426m", scope: "Global product sales", sourceIds: ["novartis-25"] },
      { period: "2024", value: "$3,224m", scope: "Global product sales", sourceIds: ["novartis-25"] },
    ], notes: [], sources: [novartis25],
  }),
};
