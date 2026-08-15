import type { CommercialModel, TeamRole } from "./commercialModels";

export type CommercialModelProduct = {
  brand: string;
  ingredient: string;
  productType: string;
  modality: string;
  route: string;
  dosageForm: string;
  mechanism: string | null;
};

type MarketKey = "cardio" | "dermatology" | "endocrine" | "hematology" | "immunology" | "infectious" | "neuroscience" | "ophthalmology" | "pulmonary" | "womens" | "specialty";

type MarketSpec = {
  label: string;
  salesRole: string;
  reps: number;
  msls: number;
  accounts: number;
  access: number;
  geographies: string[];
  geographyMethod: string;
};

const FDA_DRUGS = { label: "FDA Drugs@FDA product and label database", url: "https://www.fda.gov/drugs/drug-approvals-and-databases/about-drugsfda" };
const FDA_BIOLOGICS = { label: "FDA Purple Book biologic database", url: "https://purplebooksearch.fda.gov/" };
const CMS_PROVIDERS = { label: "CMS physician and practitioner utilization data", url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners" };
const CMS_HOSPITALS = { label: "CMS hospital service-area data", url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/hospital-service-area" };
const CMS_PART_B = { label: "CMS Part B drugs and biologicals", url: "https://www.cms.gov/cms-guide-medical-technology-companies-and-other-interested-parties/payment/part-b-drugs" };
const HRSA_WORKFORCE = { label: "HRSA Area Health Resources Files", url: "https://data.hrsa.gov/topics/health-workforce/nchwa/ahrf" };

const MARKETS: Record<MarketKey, MarketSpec> = {
  cardio: {
    label: "Cardiovascular / renal", salesRole: "Cardio-renal sales reps", reps: 50, msls: 7, accounts: 5, access: 5,
    geographies: ["Northeast corridor", "Mid-Atlantic", "Southeast / Florida", "Texas triangle", "Great Lakes", "California / Pacific Northwest"],
    geographyMethod: "Prioritizes dense cardiology, nephrology and high-volume integrated delivery networks, then expands by treated-patient concentration.",
  },
  dermatology: {
    label: "Dermatology", salesRole: "Dermatology sales reps", reps: 42, msls: 4, accounts: 3, access: 3,
    geographies: ["NY / NJ / New England", "Mid-Atlantic", "Florida / Georgia", "Texas triangle", "California", "Chicago / Great Lakes"],
    geographyMethod: "Prioritizes metropolitan dermatology groups and APP-dense practices, with secondary weighting for population and climate where relevant.",
  },
  endocrine: {
    label: "Endocrinology / metabolic", salesRole: "Endocrine specialty reps", reps: 44, msls: 6, accounts: 4, access: 5,
    geographies: ["Northeast corridor", "Southeast diabetes belt", "Texas", "Great Lakes", "California", "Arizona / Mountain West"],
    geographyMethod: "Weights endocrinology density, high-volume metabolic practices, specialty pharmacies and states with high chronic-disease burden.",
  },
  hematology: {
    label: "Hematology / rare blood disorders", salesRole: "Hematology sales reps", reps: 28, msls: 8, accounts: 7, access: 7,
    geographies: ["Boston / New York", "Philadelphia / Baltimore–DC", "Atlanta / Southeast", "Chicago / Great Lakes", "Texas", "California"],
    geographyMethod: "Concentrates on academic hematology centers, hemophilia treatment centers, infusion hubs and large regional referral networks.",
  },
  immunology: {
    label: "Immunology", salesRole: "Immunology sales reps", reps: 46, msls: 8, accounts: 5, access: 7,
    geographies: ["Northeast corridor", "Mid-Atlantic", "Southeast / Florida", "Texas", "Great Lakes", "California / Pacific Northwest"],
    geographyMethod: "Prioritizes large rheumatology, gastroenterology, allergy and dermatology groups plus infusion and specialty-pharmacy hubs.",
  },
  infectious: {
    label: "Infectious disease / institutional", salesRole: "Institutional sales reps", reps: 30, msls: 7, accounts: 8, access: 3,
    geographies: ["Northeast academic centers", "Mid-Atlantic", "Southeast", "Texas", "Great Lakes", "California / Pacific Northwest"],
    geographyMethod: "Weights major hospitals, academic infectious-disease centers, antimicrobial-stewardship programs and public-health referral hubs.",
  },
  neuroscience: {
    label: "Neurology / psychiatry", salesRole: "Neuroscience sales reps", reps: 48, msls: 7, accounts: 4, access: 4,
    geographies: ["Northeast corridor", "Mid-Atlantic", "Southeast / Florida", "Texas", "Great Lakes", "California / Pacific Northwest"],
    geographyMethod: "Prioritizes high-volume neurology and psychiatry groups, academic referral centers and community mental-health networks.",
  },
  ophthalmology: {
    label: "Ophthalmology", salesRole: "Ophthalmology sales reps", reps: 38, msls: 6, accounts: 5, access: 5,
    geographies: ["NY / NJ / New England", "Mid-Atlantic", "Florida", "Texas", "California", "Great Lakes / Arizona"],
    geographyMethod: "Prioritizes retina and ophthalmology groups, ambulatory surgery centers and older-patient markets with dense Medicare utilization.",
  },
  pulmonary: {
    label: "Pulmonology / allergy", salesRole: "Pulmonary specialty reps", reps: 48, msls: 6, accounts: 4, access: 5,
    geographies: ["Northeast corridor", "Southeast / Florida", "Texas", "Ohio Valley / Great Lakes", "California", "Mountain West / Pacific Northwest"],
    geographyMethod: "Weights pulmonology and allergy practices, severe-disease centers, population density and respiratory-disease burden.",
  },
  womens: {
    label: "Women's health", salesRole: "Women's health sales reps", reps: 36, msls: 5, accounts: 4, access: 3,
    geographies: ["Northeast corridor", "Mid-Atlantic", "Southeast / Florida", "Texas", "California", "Great Lakes"],
    geographyMethod: "Prioritizes large OB/GYN groups, fertility centers, women's-health systems and high-volume metropolitan practices.",
  },
  specialty: {
    label: "Mechanism-led specialty", salesRole: "Specialty sales reps", reps: 38, msls: 6, accounts: 4, access: 4,
    geographies: ["Northeast corridor", "Mid-Atlantic", "Southeast / Florida", "Texas", "Great Lakes", "California / Pacific Northwest"],
    geographyMethod: "Uses national specialist and facility density as the starting footprint; product-level patient concentration should set final territories.",
  },
};

function marketFor(product: CommercialModelProduct): MarketKey {
  const route = `${product.route} ${product.dosageForm}`.toLowerCase();
  const signal = `${product.brand} ${product.ingredient} ${product.mechanism ?? ""}`.toLowerCase();
  if (/ophthalmic|intravitreal|ocular/.test(route)) return "ophthalmology";
  if (/vaginal|intrauterine/.test(route) || /progesterone|estrogen|gonadotropin|follicle-stimulating|luteinizing/.test(signal)) return "womens";
  if (/integrase|reverse transcriptase|viral|virus|bacterial|beta-lactamase|penicillin-binding|antifungal|glucan synthase|hiv|hepatitis/.test(signal)) return "infectious";
  if (/inhal|nebul/.test(route) || /beta-2 adrenergic|leukotriene|ige|interleukin-5|il-5/.test(signal)) return "pulmonary";
  if (/insulin|glucagon|somatostatin|growth hormone|thyroid|glp-1|glucose-dependent insulinotropic|dipeptidyl peptidase 4|vitamin d receptor/.test(signal)) return "endocrine";
  if (/dopamine|serotonin|5-hydroxytryptamine|gaba|cgrp|calcitonin gene-related|acetylcholine|muscarinic|orexin|monoamine|opioid|norepinephrine|glutamate|amyloid|tau protein/.test(signal)) return "neuroscience";
  if (/interleukin|jak[123]|janus kinase|tumor necrosis factor|tnf|integrin|b-cell|cd20|cd19|complement|immunoglobulin/.test(signal)) return "immunology";
  if (/coagulation|factor x|factor ix|factor viii|von willebrand|thrombopoietin|plasminogen|prothrombin|fibrin|erythropoietin|hemoglobin|hepcidin/.test(signal)) return "hematology";
  if (/endothelin|angiotensin|renin|aldosterone|hmg-coa|cholesterol|pcsk9|natriuretic|cardiac|beta-1 adrenergic|platelet|thromboxane/.test(signal)) return "cardio";
  if (/topical|cutaneous/.test(route) || /melanocortin 1|retinoic acid|keratin/.test(signal)) return "dermatology";
  return "specialty";
}

function modelChannel(product: CommercialModelProduct, market: MarketKey) {
  const route = `${product.route} ${product.dosageForm}`.toLowerCase();
  const modality = `${product.productType} ${product.modality}`.toLowerCase();
  const signal = `${product.ingredient} ${product.mechanism ?? ""}`.toLowerCase();
  const biologic = /biologic|monoclonal|recombinant|protein|peptide|oligonucleotide/.test(modality);
  const infused = /intravenous|intravitreal|infusion/.test(route);
  const selfInjected = /subcutaneous|intramuscular|injection/.test(route) && !infused;
  const rare = /oligonucleotide/.test(modality) || /antisense|pharmacological chaperone|complement factor|molybdenum cofactor/.test(signal);
  const hospital = /intravenous/.test(route) && !/monoclonal/.test(modality) && market !== "hematology" && market !== "immunology";
  if (rare) return { label: "Rare disease / high touch", reps: 22, accountLift: 3, accessLift: 4, mslLift: 3, educators: 8, hospital: false, biologic };
  if (hospital) return { label: "Hospital / acute care", reps: 26, accountLift: 4, accessLift: 0, mslLift: 1, educators: 0, hospital: true, biologic };
  if (infused) return { label: "Infused specialist", reps: 32, accountLift: 3, accessLift: 3, mslLift: 2, educators: 4, hospital: true, biologic };
  if (selfInjected && biologic) return { label: "Self-injected specialty", reps: 42, accountLift: 1, accessLift: 2, mslLift: 1, educators: 6, hospital: false, biologic };
  if (/inhal|nebul|enteral|implant|intrauterine/.test(route)) return { label: "Device-enabled specialty", reps: 40, accountLift: 1, accessLift: 1, mslLift: 0, educators: 5, hospital: false, biologic };
  return { label: "Office-based specialty", reps: MARKETS[market].reps, accountLift: 0, accessLift: 0, mslLift: biologic ? 1 : 0, educators: 0, hospital: false, biologic };
}

function compactRoles(roles: TeamRole[]) {
  return roles.filter((role) => role.count > 0);
}

export function universeCommercialModel(product: CommercialModelProduct): CommercialModel {
  const marketKey = marketFor(product);
  const market = MARKETS[marketKey];
  const channel = modelChannel(product, marketKey);
  const mechanismCount = Math.max(1, (product.mechanism?.match(/\|/g)?.length ?? 0) + 1);
  const reps = Math.max(2, Math.round((channel.reps + (mechanismCount >= 3 ? 4 : 0)) / 2) * 2);
  const managers = Math.max(3, Math.ceil(reps / 8));
  const msls = market.msls + channel.mslLift + (mechanismCount >= 3 ? 1 : 0);
  const accounts = market.accounts + channel.accountLift;
  const access = market.access + channel.accessLift;
  const patientSupport = channel.educators + (channel.biologic ? 2 : 0);
  const field = compactRoles([
    { role: channel.hospital ? "Institutional / specialty reps" : market.salesRole, count: reps },
    { role: "Regional managers", count: managers },
    { role: "MSLs", count: msls },
    { role: "Strategic / health-system accounts", count: accounts },
    { role: "Field access / reimbursement", count: access },
    { role: "Field educators / nurses", count: patientSupport },
  ]);
  const inside = compactRoles([
    { role: channel.hospital ? "Contracting / tender support" : "Patient access / case support", count: channel.hospital ? 4 : 5 + Math.ceil(patientSupport / 3) },
    { role: "Medical information / safety", count: 2 + Math.ceil(msls / 5) },
    { role: "Brand, data and operations", count: 5 + (reps >= 46 ? 1 : 0) },
  ]);
  const sources = [FDA_DRUGS, CMS_PROVIDERS, HRSA_WORKFORCE];
  if (channel.biologic) sources.splice(1, 0, FDA_BIOLOGICS);
  if (channel.hospital) sources.splice(2, 0, CMS_HOSPITALS, CMS_PART_B);
  return {
    indication: `${market.label} market`,
    archetype: `${market.label} · ${channel.label}`,
    confidence: "Directional",
    field,
    inside,
    geographies: market.geographies,
    evidence: `${product.route} ${product.dosageForm}; ${product.modality}; ${mechanismCount} mechanism signal${mechanismCount === 1 ? "" : "s"} in the screened product record. No company headcount disclosure is assumed.`,
    method: `Standalone U.S. model calculated from the ${channel.label.toLowerCase()} archetype, ${market.label.toLowerCase()} call-point density, route, modality, mechanism complexity and access burden. Shared corporate functions are excluded.`,
    geographyMethod: `${market.geographyMethod} CMS and HRSA data are directional inputs; validate actual prescribers, patients and account volume before diligence.`,
    note: "Broad-pass estimate. Replace with product-specific owner disclosures, claims and account-level data if the asset advances.",
    sources,
  };
}
