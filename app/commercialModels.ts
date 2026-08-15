export type TeamRole = {
  role: string;
  count: number;
};

export type CommercialModel = {
  indication?: string;
  archetype?: string;
  confidence: "High" | "Medium" | "Directional";
  field: TeamRole[];
  inside: TeamRole[];
  geographies: string[];
  evidence: string;
  method: string;
  geographyMethod: string;
  note?: string;
  sources: { label: string; url: string }[];
};

export const COMMERCIAL_MODELS: Record<string, CommercialModel> = {
  TRYVIO: {
    confidence: "Medium",
    field: [
      { role: "Specialty sales reps", count: 42 },
      { role: "Regional managers", count: 6 },
      { role: "MSLs", count: 8 },
      { role: "Strategic accounts", count: 3 },
      { role: "Field access", count: 4 },
    ],
    inside: [
      { role: "Patient access", count: 6 },
      { role: "Medical information / safety", count: 3 },
      { role: "Brand, data and operations", count: 6 },
    ],
    geographies: ["Boston–NYC–Philadelphia", "Baltimore–DC–Richmond", "Chicago–Cleveland–Detroit", "Atlanta–Carolinas–Florida", "Texas triangle", "Los Angeles–San Diego / Bay Area"],
    evidence: "Idorsia reports established U.S. field-sales and MSL coverage plans, with promotion funding dependent on a partner; no headcount was disclosed.",
    method: "Modeled for a specialist-first launch: roughly 225 priority hypertension, cardiology and nephrology accounts per rep, plus national KOL, access and retail-distribution coverage.",
    geographyMethod: "Prioritizes major resistant-hypertension referral centers, high-volume cardiology systems and dense nephrology markets; expands to selected PCP accounts only after specialist adoption.",
    note: "No dedicated field nurses in the base case; office education is handled by reps and MSLs.",
    sources: [
      { label: "Idorsia U.S. commercial update", url: "https://www.idorsia.com/investors/news-and-events/media-releases/media-release-details?id=3440206" },
      { label: "Certified hypertension centers", url: "https://www.ash-us.org/htn-specialist/certified-htn-centers/" },
    ],
  },
  QBREXZA: {
    confidence: "High",
    field: [
      { role: "Dermatology sales reps", count: 48 },
      { role: "Regional managers", count: 6 },
      { role: "MSLs", count: 4 },
      { role: "Strategic accounts", count: 3 },
      { role: "Field access", count: 2 },
    ],
    inside: [
      { role: "Patient access", count: 4 },
      { role: "Medical information", count: 2 },
      { role: "Brand, trade and analytics", count: 5 },
    ],
    geographies: ["NY / NJ / PA / New England", "Florida / Georgia", "Texas triangle", "Coastal California", "Chicago / Great Lakes", "Phoenix / Denver / Seattle"],
    evidence: "Journey disclosed a 68-professional dermatology field force with national coverage across major U.S. markets for its portfolio.",
    method: "Right-sizes the disclosed portfolio team to a QBREXZA-led standalone platform using dense dermatology offices, PA/NP call points and limited reimbursement burden.",
    geographyMethod: "Weights AAD member density, large dermatology groups, warm-weather hyperhidrosis demand and major urban markets.",
    note: "No dedicated nurses; product training is simple enough for sales and medical teams.",
    sources: [
      { label: "Journey field-force disclosure", url: "https://ir.journeymedicalcorp.com/financials/sec-filings/content/0001104659-21-112547/0001104659-21-112547.pdf" },
      { label: "AAD dermatologist directory", url: "https://find-a-derm-backend.aad.org/country/United%20States" },
    ],
  },
  RAYALDEE: {
    confidence: "High",
    field: [
      { role: "Nephrology sales reps", count: 35 },
      { role: "Regional managers", count: 4 },
      { role: "MSLs", count: 4 },
      { role: "Renal strategic accounts", count: 3 },
      { role: "Field access", count: 3 },
    ],
    inside: [
      { role: "Patient / reimbursement support", count: 4 },
      { role: "Medical information", count: 2 },
      { role: "Brand, data and operations", count: 4 },
    ],
    geographies: ["Southeast CKD belt", "Texas", "NY / NJ / Philadelphia", "Chicago–Detroit–Cleveland–St. Louis", "California", "Baltimore–DC"],
    evidence: "OPKO disclosed a 58-person sales, marketing and market-access team in 2022; an earlier expansion reached 71 field reps when access improved.",
    method: "Uses the latest disclosed total organization as the anchor, with fewer reps than the peak launch force and greater account/access concentration for current revenue.",
    geographyMethod: "Prioritizes CKD burden, nephrologist density, Medicare exposure and high-volume renal systems.",
    sources: [
      { label: "OPKO 58-person team disclosure", url: "https://www.opko.com/investors/sec-filings/all-sec-filings/content/0000944809-23-000013/opk-20221231.htm" },
      { label: "OPKO field-force expansion", url: "https://www.opko.com/investors/news-events/press-releases/detail/308/opko-health-provides-commercial-update-for-rayaldee" },
    ],
  },
  INPEFA: {
    confidence: "High",
    field: [
      { role: "Cardio-renal sales reps", count: 60 },
      { role: "Regional managers", count: 8 },
      { role: "MSLs", count: 10 },
      { role: "IDN / strategic accounts", count: 6 },
      { role: "Field access", count: 6 },
    ],
    inside: [
      { role: "Coverage and patient support", count: 8 },
      { role: "Medical information", count: 3 },
      { role: "Brand, data and operations", count: 7 },
    ],
    geographies: ["Northeast heart-failure IDNs", "Mid-Atlantic", "Southeast / Florida", "Texas", "Great Lakes", "California / Pacific Northwest"],
    evidence: "Lexicon disclosed approximately 150 cardiovascular specialty representatives at launch, focused on high-volume prescribers and institutions.",
    method: "Models a narrower specialist rebuild at 40% of the original rep footprint, preserving heavier MSL, IDN and access coverage for a complex heart-failure story.",
    geographyMethod: "Targets top heart-failure systems, cardiology groups, nephrology referral networks and states with high cardio-renal burden.",
    sources: [
      { label: "Lexicon INPEFA sales-force disclosure", url: "https://investors.lexpharma.com/static-files/a73d6ba9-b16a-4711-95f2-f44e000cf213" },
    ],
  },
  "AMELUZ + RhodoLED": {
    confidence: "Medium",
    field: [
      { role: "Dermatology sales reps", count: 34 },
      { role: "Regional managers", count: 5 },
      { role: "MSLs", count: 4 },
      { role: "Group-practice accounts", count: 4 },
      { role: "Field reimbursement", count: 7 },
      { role: "Procedure educators", count: 7 },
    ],
    inside: [
      { role: "Reimbursement support", count: 7 },
      { role: "Medical information", count: 2 },
      { role: "Device, logistics and brand operations", count: 6 },
    ],
    geographies: ["Florida", "Texas", "California / Arizona", "Northeast corridor", "Southeast", "Great Lakes / Denver / Seattle"],
    evidence: "Biofrontera reports a national direct commercial team selling into dermatology offices and a buy-and-bill, in-office procedure model.",
    method: "Territories are sized to procedure-capable dermatology offices; extra educators and reimbursement roles reflect device placement, workflow training, inventory and buy-and-bill pull-through.",
    geographyMethod: "Prioritizes dermatologist density, actinic-keratosis exposure, large group practices and sunbelt procedure volume.",
    sources: [
      { label: "Biofrontera 2025 annual report", url: "https://www.sec.gov/Archives/edgar/data/1858685/000149315226011625/form10-k.htm" },
      { label: "AAD dermatologist directory", url: "https://find-a-derm-backend.aad.org/country/United%20States" },
    ],
  },
  MYCAPSSA: {
    confidence: "Medium",
    field: [
      { role: "Rare-endocrine account managers", count: 18 },
      { role: "Regional managers", count: 3 },
      { role: "MSLs", count: 6 },
      { role: "Pituitary-center accounts", count: 3 },
      { role: "Field reimbursement", count: 5 },
      { role: "Patient education liaisons", count: 5 },
    ],
    inside: [
      { role: "Total Care coordinators / nurses", count: 8 },
      { role: "Medical information", count: 2 },
      { role: "Brand, data and specialty-pharmacy ops", count: 5 },
    ],
    geographies: ["Boston–New York–Philadelphia", "Cleveland–Columbus–Chicago", "Atlanta–Durham", "Houston–Dallas", "Phoenix–Los Angeles–Stanford", "Seattle"],
    evidence: "Chiesi discloses field reimbursement managers, patient education liaisons and a hub staffed by pharmacists, coordinators, reimbursement specialists and nursing support.",
    method: "Sizes territories around pituitary centers rather than population, then adds high-touch access and adherence support for specialty-pharmacy initiation.",
    geographyMethod: "Built from Pituitary Network Association centers of excellence and major neuroendocrine referral hubs.",
    sources: [
      { label: "Chiesi Total Care team", url: "https://chiesitotalcare.com/mycapssa/healthcare-professionals/" },
      { label: "Pituitary centers of excellence", url: "https://pituitary.org/medical-resources/pituitary-centers-of-excellence/" },
    ],
  },
  CUVRIOR: {
    confidence: "Medium",
    field: [
      { role: "Rare-disease account managers", count: 8 },
      { role: "Regional managers", count: 2 },
      { role: "MSLs", count: 4 },
      { role: "National / center accounts", count: 2 },
      { role: "Field access", count: 3 },
      { role: "Patient educators", count: 3 },
    ],
    inside: [
      { role: "Case managers", count: 5 },
      { role: "Medical information", count: 1 },
      { role: "Brand, data and specialty-pharmacy ops", count: 3 },
    ],
    geographies: ["Houston / Miami / New Orleans", "Pittsburgh / New Haven", "Ann Arbor / Chicago", "Los Angeles / Sacramento", "Seattle", "Winston-Salem"],
    evidence: "Orphalan describes a targeted U.S. rare-disease launch; the Wilson Disease Association lists 11 U.S. centers of excellence and product support includes case management.",
    method: "One account manager covers roughly one to two center clusters plus community spillover; MSL and case-management ratios are intentionally high for diagnosis, monitoring and adherence.",
    geographyMethod: "Directly follows the U.S. Wilson Disease Centers of Excellence network.",
    sources: [
      { label: "Orphalan U.S. launch", url: "https://www.orphalan.com/orphalan-announces-us-commercial-launch-of-cuvrior-for-the-treatment-of-wilson-disease/" },
      { label: "Wilson Disease Centers of Excellence", url: "https://wilsondisease.org/living-with-wilson-disease/centers-of-excellence/" },
    ],
  },
  LODOCO: {
    confidence: "Directional",
    field: [
      { role: "Cardiovascular sales reps", count: 45 },
      { role: "Regional managers", count: 6 },
      { role: "MSLs", count: 7 },
      { role: "Strategic accounts", count: 4 },
      { role: "Field access", count: 3 },
    ],
    inside: [
      { role: "Virtual sales", count: 10 },
      { role: "Medical information", count: 3 },
      { role: "Brand, data and mail-order operations", count: 6 },
    ],
    geographies: ["Boston–NYC–Philadelphia", "Baltimore–DC", "Chicago–Cleveland", "Atlanta–Florida", "Texas triangle", "California"],
    evidence: "AGEPHA identifies LODOCO as its first U.S. launch and uses nationwide BlinkRx and Marley Drug fulfillment; no U.S. field headcount is public.",
    method: "Models a preventive-cardiology launch limited to high-decile cardiologists and lipid/inflammation opinion leaders, with virtual reach for the long tail.",
    geographyMethod: "Prioritizes large cardiology groups, preventive-cardiology centers and high-ASCVD-volume IDNs; mail-order provides national fulfillment.",
    note: "No dedicated nurses; access friction is handled through centralized pharmacy partners.",
    sources: [
      { label: "AGEPHA U.S. launch", url: "https://agephapharma.com/news-insights/u-s-fda-approves-first-anti-inflammatory-drug-for-cardiovascular-disease/" },
      { label: "LODOCO national fulfillment", url: "https://lodoco.com/wp-content/uploads/2023/09/10.3.1.-Approved-Provider-Flyer-V2.pdf" },
    ],
  },
  SECUADO: {
    confidence: "Directional",
    field: [
      { role: "Psychiatry sales reps", count: 42 },
      { role: "Regional managers", count: 6 },
      { role: "MSLs", count: 6 },
      { role: "IDN / community-mental-health accounts", count: 5 },
      { role: "Field access", count: 4 },
    ],
    inside: [
      { role: "Patient access", count: 8 },
      { role: "Medical information", count: 3 },
      { role: "Brand, data and operations", count: 6 },
    ],
    geographies: ["NYC / NJ / Philadelphia / Boston", "Baltimore–DC", "Chicago–Detroit–Cleveland", "Atlanta / Florida", "Texas", "California"],
    evidence: "Noven is a fully integrated specialty company and operates the Noven Care Access Network; it does not disclose a SECUADO-specific team size.",
    method: "Territories cover high-volume psychiatrists and community mental-health clinics; account roles handle organized systems and access, while patch education remains rep/MSL-led.",
    geographyMethod: "Weights psychiatrist density, community mental-health facility concentration and large Medicaid markets.",
    sources: [
      { label: "Noven commercial and support model", url: "https://www.noven.com/" },
      { label: "SECUADO product overview", url: "https://www.noven.com/secuado/" },
    ],
  },
  CREXONT: {
    confidence: "Medium",
    field: [
      { role: "Neurology sales reps", count: 55 },
      { role: "Regional managers", count: 7 },
      { role: "MSLs", count: 8 },
      { role: "Movement-center accounts", count: 5 },
      { role: "Field access", count: 5 },
      { role: "Clinical educators", count: 6 },
    ],
    inside: [
      { role: "Patient / reimbursement support", count: 8 },
      { role: "Medical information", count: 3 },
      { role: "Brand, data and operations", count: 7 },
    ],
    geographies: ["NY / NJ / PA", "Florida", "California", "Texas", "Ohio / Michigan / Illinois", "Carolinas / Tennessee", "Pacific Northwest / Mountain West"],
    evidence: "Amneal reports strong second-year uptake and runs a dedicated specialty business; a public team count is not product-specific.",
    method: "Uses Parkinson's center density and a broader community-neurology layer, with educators to support conversion, titration and office workflow.",
    geographyMethod: "Anchored to Parkinson's Foundation Centers of Excellence and Amneal's 27-site real-world CREXONT study footprint.",
    sources: [
      { label: "Amneal CREXONT update", url: "https://investors.amneal.com/news/press-releases/press-release-details/2025/Amneal-Announces-New-Data-from-Phase-3-Study-Showing-Significant-Improvements-in-Sleep-Quality-with-CREXONT-Carbidopa-and-Levodopa-Extended-Release-Capsules-in-Parkinsons-Disease/default.aspx" },
      { label: "Parkinson's care network", url: "https://www.parkinson.org/living-with-parkinsons/finding-care/global-care-network" },
    ],
  },
  IGALMI: {
    confidence: "High",
    field: [
      { role: "Institutional sales reps", count: 45 },
      { role: "Regional managers", count: 6 },
      { role: "MSLs", count: 8 },
      { role: "Corporate account directors", count: 5 },
      { role: "Field access", count: 4 },
      { role: "Clinical educators", count: 6 },
    ],
    inside: [
      { role: "Hospital contracting / inside support", count: 5 },
      { role: "Medical information", count: 3 },
      { role: "Brand, data and operations", count: 6 },
    ],
    geographies: ["Northeast hospital corridor", "Mid-Atlantic", "Atlanta / Florida", "Texas", "Great Lakes", "California / Pacific Northwest"],
    evidence: "BioXcel disclosed 70 institutional reps covering more than 1,700 hospitals, 7,000 HCPs and a dedicated corporate-account team before later downsizing.",
    method: "Right-sizes the disclosed hospital model to the current supervised-use label, retaining enough account and clinical support for P&T, GPO and IDN pull-through.",
    geographyMethod: "Follows large behavioral-health hospitals, emergency departments and high-value IDNs rather than population alone.",
    note: "If at-home use is approved, add an estimated 35–45 reps, 4 MSLs and 8–10 inside-support roles.",
    sources: [
      { label: "BioXcel 70-rep / 1,700-hospital disclosure", url: "https://ir.bioxceltherapeutics.com/news-releases/news-release-details/bioxcel-therapeutics-reports-fourth-quarter-and-full-year-2022/" },
      { label: "Current at-home launch planning", url: "https://ir.bioxceltherapeutics.com/news-releases/news-release-details/bioxcel-therapeutics-submits-supplemental-new-drug-application" },
    ],
  },
  GVOKE: {
    confidence: "Medium",
    field: [
      { role: "Diabetes sales reps", count: 70 },
      { role: "Regional managers", count: 9 },
      { role: "MSLs", count: 6 },
      { role: "National / payer accounts", count: 5 },
      { role: "Field access", count: 5 },
      { role: "Diabetes clinical educators", count: 10 },
    ],
    inside: [
      { role: "Patient access", count: 6 },
      { role: "Medical information", count: 3 },
      { role: "Brand, trade and analytics", count: 8 },
    ],
    geographies: ["Texas / Florida / California", "NY / NJ / Pennsylvania", "Southeast", "Chicago / Ohio / Michigan", "Arizona / Colorado", "National high-volume endocrine accounts"],
    evidence: "Xeris disclosed 229 sales-and-marketing employees across GVOKE, KEVEYIS and RECORLEV, with GVOKE at approximately 265,000 annual prescriptions in 2024.",
    method: "Allocates a scaled share of the portfolio organization to GVOKE, with broad endocrine coverage and educators for rescue readiness and office/patient training.",
    geographyMethod: "Weights diagnosed diabetes, endocrinologist density, major pediatric/endocrine systems and high-volume retail markets.",
    sources: [
      { label: "Xeris workforce disclosure", url: "https://fintel.io/doc/sec-xeris-biopharma-holdings-inc-1867096-10k-2025-march-06-20153-3460" },
      { label: "Xeris 2024 product performance", url: "https://www.xerispharma.com/news-releases/news-release-details/xeris-biopharma-delivers-record-fourth-quarter-and-full-year" },
    ],
  },
  KEVEYIS: {
    confidence: "Medium",
    field: [
      { role: "Rare-neurology account managers", count: 10 },
      { role: "Regional managers", count: 2 },
      { role: "MSLs", count: 5 },
      { role: "Center / national accounts", count: 3 },
      { role: "Field access", count: 4 },
      { role: "Patient access managers / educators", count: 5 },
    ],
    inside: [
      { role: "Case managers / pharmacy liaisons", count: 6 },
      { role: "Medical information", count: 2 },
      { role: "Brand, data and operations", count: 4 },
    ],
    geographies: ["Boston–NYC–Philadelphia–Baltimore", "Durham / Atlanta / Florida", "Chicago–Cleveland", "Dallas–Houston", "Denver–Phoenix", "Los Angeles–San Francisco–Seattle"],
    evidence: "Xeris CareConnection discloses dedicated patient access managers, case management, rare-disease pharmacy support and patient mentors.",
    method: "Uses a center-and-patient-finding model: few account managers, high MSL/access ratios and centralized case management for diagnosis, specialty-pharmacy and adherence work.",
    geographyMethod: "Clusters around neuromuscular referral centers, academic neurology programs and national rare-disease patient-finding activity.",
    sources: [
      { label: "KEVEYIS patient-support model", url: "https://www.keveyis.com/patient/patient-support/" },
      { label: "KEVEYIS support-services detail", url: "https://www.keveyis.com/wp-content/pdf/keveyis-start-form.pdf" },
    ],
  },
  AFREZZA: {
    confidence: "Medium",
    field: [
      { role: "Diabetes sales reps", count: 85 },
      { role: "Regional managers", count: 11 },
      { role: "MSLs", count: 10 },
      { role: "National / payer accounts", count: 6 },
      { role: "Field access", count: 8 },
      { role: "Diabetes educators", count: 14 },
    ],
    inside: [
      { role: "Reimbursement / nurse support", count: 10 },
      { role: "Medical information", count: 4 },
      { role: "Brand, trade, data and operations", count: 10 },
    ],
    geographies: ["California", "Texas", "Florida", "NY / NJ / Pennsylvania", "Southeast", "Chicago–Cleveland–Detroit", "Arizona / Colorado"],
    evidence: "MannKind has described a national sales force with device and diabetes experience plus reimbursement and adherence programs; product revenue supports a broad specialist footprint.",
    method: "Models high call-frequency endocrinology coverage with above-average educator, access and nurse support for inhaler training, pulmonary testing workflow and insulin initiation.",
    geographyMethod: "Weights endocrinology density, insulin-treated population, diabetes centers and current high-volume urban/suburban markets.",
    sources: [
      { label: "MannKind commercial-support model", url: "https://investors.mannkindcorp.com/news-releases/news-release-details/mannkind-assumes-responsibility-distribution-afrezzar-and" },
      { label: "MannKind 2025 performance", url: "https://investors.mannkindcorp.com/node/21096/pdf" },
    ],
  },
  QUVIVIQ: {
    confidence: "High",
    field: [
      { role: "Sleep / psychiatry sales reps", count: 30 },
      { role: "Regional managers", count: 4 },
      { role: "MSLs", count: 5 },
      { role: "Strategic accounts", count: 4 },
      { role: "Field access", count: 3 },
    ],
    inside: [
      { role: "Virtual sales", count: 20 },
      { role: "Patient access", count: 4 },
      { role: "Medical information", count: 2 },
      { role: "Brand, data and operations", count: 6 },
    ],
    geographies: ["Top 30 U.S. sleep / psychiatry metros", "Northeast corridor", "Florida / Southeast", "Texas", "California", "National virtual coverage"],
    evidence: "Idorsia disclosed a shift from roughly 100 field reps to 20 virtual reps while maintaining U.S. sales and supporting more than 50,000 prescribers.",
    method: "Blends the disclosed lean virtual model with a small field overlay for high-decile sleep and psychiatry accounts; avoids rebuilding a broad primary-care force.",
    geographyMethod: "Field roles concentrate in top sleep/psychiatry metros; virtual reps cover the national long tail.",
    sources: [
      { label: "Idorsia 20-virtual / 100-field disclosure", url: "https://www.idorsia.com/investors/news-and-events/media-releases/media-release-details?id=3401710" },
      { label: "Idorsia 2025 U.S. update", url: "https://www.idorsia.com/investors/news-and-events/media-releases/media-release-details?id=3440206" },
    ],
  },
  ZYPITAMAG: {
    confidence: "Directional",
    field: [
      { role: "Cardio-metabolic sales reps", count: 18 },
      { role: "Regional managers", count: 3 },
      { role: "MSLs", count: 3 },
      { role: "Strategic accounts", count: 2 },
      { role: "Field access", count: 2 },
    ],
    inside: [
      { role: "Virtual / digital sales", count: 8 },
      { role: "Medical information", count: 2 },
      { role: "Pharmacy, trade and data operations", count: 5 },
    ],
    geographies: ["Northeast corridor", "Florida", "Texas", "California", "Great Lakes", "National Marley Drug reach"],
    evidence: "Medicure reports a restructured U.S. sales team and national direct-to-patient pharmacy reach, but does not disclose product-specific field headcount.",
    method: "Treats ZYPITAMAG as a low-cost portfolio add-on: a small cardio-metabolic field overlay plus digital and pharmacy-led national coverage.",
    geographyMethod: "Field effort follows concentrated cardiology/lipid markets; Marley Drug supports all-state fulfillment and long-tail demand.",
    note: "Not economical as a fully standalone national field organization without adjacent assets.",
    sources: [
      { label: "Medicure commercial-team restructuring", url: "https://www.medicure.com/wcm-docs/docs/annual_general_meeting/medicure_inc_20f_december_31_2023.pdf" },
      { label: "Medicure national pharmacy footprint", url: "https://www.medicure.com/medicure-marks-its-25th-anniversary" },
    ],
  },
  SAVAYSA: {
    confidence: "Directional",
    field: [
      { role: "Key-territory sales reps", count: 16 },
      { role: "Regional managers", count: 2 },
      { role: "MSLs", count: 3 },
      { role: "Anticoagulation / IDN accounts", count: 3 },
      { role: "Field access", count: 2 },
    ],
    inside: [
      { role: "Virtual sales", count: 6 },
      { role: "Medical information", count: 2 },
      { role: "Trade, data and operations", count: 4 },
    ],
    geographies: ["Northeast academic systems", "Mid-Atlantic", "Florida", "Texas", "Great Lakes", "California"],
    evidence: "Daiichi Sankyo continues to report U.S. sales but provides no SAVAYSA-specific team; current sales are small relative to the global edoxaban franchise.",
    method: "Models a mature carve-out with only high-value anticoagulation clinics, electrophysiology groups and selected IDNs; most long-tail coverage is virtual.",
    geographyMethod: "Targets large AF/VTE systems and anticoagulation programs, not a broad cardiology universe.",
    note: "Best operated as a portfolio add-on; standalone team economics are weak.",
    sources: [
      { label: "Daiichi Sankyo current U.S. sales", url: "https://www.daiichisankyo.com/files/investors/library/quarterly_result/2025/Q2/FY2025Q2_Reference_Data_E.pdf" },
      { label: "SAVAYSA U.S. product overview", url: "https://www.daiichisankyo.com/alias/pc/products/" },
    ],
  },
  BYSANTI: {
    confidence: "High",
    field: [
      { role: "Psychiatry sales reps", count: 100 },
      { role: "Regional managers", count: 12 },
      { role: "MSLs", count: 10 },
      { role: "IDN / strategic accounts", count: 8 },
      { role: "Field access", count: 6 },
    ],
    inside: [
      { role: "Patient access", count: 8 },
      { role: "Medical information", count: 3 },
      { role: "Launch, brand and data operations", count: 10 },
    ],
    geographies: ["Top 50 psychiatry markets", "NYC / Los Angeles / Chicago", "Texas metros", "Philadelphia / Boston / DC", "Florida / Atlanta", "Phoenix / San Diego / San Francisco / Seattle"],
    evidence: "Vanda disclosed an approximately 300-representative psychiatry force for Fanapt and stated that the infrastructure can pivot to BYSANTI.",
    method: "Uses one-third of the owner's disclosed psychiatry footprint for a specialty-focused standalone launch, retaining substantial MSL, access and organized-account support.",
    geographyMethod: "Prioritizes high-volume psychiatrists, community mental-health groups, Medicaid-heavy markets and major health systems.",
    note: "This is a standalone rights-holder model; Vanda's actual shared franchise footprint is materially larger.",
    sources: [
      { label: "Vanda 300-rep psychiatry disclosure", url: "https://www.sec.gov/Archives/edgar/data/1347178/000162828025023154/vnda8-k572025exhibit991.htm" },
      { label: "Vanda BYSANTI commercial leverage", url: "https://www.publicnow.com/view/E387F7AA074C643381C6E21CC49B83938CE96B7F" },
    ],
  },
  BELSOMRA: {
    confidence: "Medium",
    field: [
      { role: "Sleep / psychiatry sales reps", count: 60 },
      { role: "Regional managers", count: 8 },
      { role: "MSLs", count: 7 },
      { role: "Strategic accounts", count: 5 },
      { role: "Field access", count: 4 },
    ],
    inside: [
      { role: "Virtual sales", count: 20 },
      { role: "Patient access", count: 5 },
      { role: "Medical information", count: 3 },
      { role: "Brand, data and operations", count: 8 },
    ],
    geographies: ["Top 40 U.S. sleep / psychiatry metros", "Northeast corridor", "Florida / Southeast", "Texas", "California", "National virtual coverage"],
    evidence: "Merck reports ongoing U.S. product sales but not product-specific staffing; the QUVIVIQ disclosed field-to-virtual transition is the closest observable DORA analog.",
    method: "Scales above QUVIVIQ's lean footprint for higher U.S. revenue and established demand, while keeping primary-care long-tail coverage virtual.",
    geographyMethod: "Field roles cover sleep specialists, psychiatry groups and highest-decile PCPs in major metros; virtual coverage handles the rest.",
    sources: [
      { label: "Merck 2025 BELSOMRA sales", url: "https://www.merck.com/news/merck-highlights-progress-advancing-broad-diverse-pipeline/" },
      { label: "Comparable DORA commercial model", url: "https://www.idorsia.com/investors/news-and-events/media-releases/media-release-details?id=3401710" },
    ],
  },
  "HETLIOZ / HETLIOZ LQ": {
    confidence: "Medium",
    field: [
      { role: "Rare-disease account managers", count: 12 },
      { role: "Regional managers", count: 2 },
      { role: "MSLs", count: 5 },
      { role: "National / center accounts", count: 3 },
      { role: "Field access", count: 4 },
      { role: "Patient education liaisons", count: 4 },
    ],
    inside: [
      { role: "Patient care coordinators", count: 7 },
      { role: "Medical information", count: 2 },
      { role: "Brand, data and specialty-pharmacy ops", count: 5 },
    ],
    geographies: ["Boston–NYC–Philadelphia–DC", "Chicago–Cleveland", "Atlanta–Durham", "Dallas–Houston", "Denver–Phoenix", "California–Seattle"],
    evidence: "Vanda reports a dedicated HETLIOZSolutions program with patient care coordinators and education/support, alongside a broader multi-product commercial organization.",
    method: "Uses a rare-sleep center-and-patient-finding model with high access and coordinator intensity for diagnosis, specialty-pharmacy onboarding and adherence.",
    geographyMethod: "Clusters around sleep centers, blindness services, genetics programs and Smith-Magenis referral networks; patient support remains national.",
    sources: [
      { label: "HETLIOZSolutions support model", url: "https://www.hetlioz.com/hetliozsolutions" },
      { label: "Vanda 2025 portfolio disclosure", url: "https://vandapharmaceuticalsinc.gcs-web.com/static-files/c8143e4b-badc-4029-86f4-db65895955bc" },
    ],
  },
};

export function teamTotal(roles: TeamRole[]) {
  return roles.reduce((sum, item) => sum + item.count, 0);
}
