// ============================================================
// SYNGEn PRODUCT CATEGORIES
// Based on the company's provided product list.
// ============================================================

export const PRODUCT_CATEGORIES = [
  "All",
  "Multi Micronutrients EDTA",
  "Plant Growth Regulator (PGR)",
  "Mineral Activator",
  "Straight Micronutrients",
  "Liqued Fertilizers",
  "Organic Fertilizers",
  "Non-edible De-oiled Cake Fertilisers",
  "Straight Potassium Fertilisers",
];


// ============================================================
// PRODUCT -> CATEGORY MAP
// ============================================================

export const PRODUCT_CATEGORY_MAP = {

  // ----------------------------------------------------------
  // MULTI MICRONUTRIENTS EDTA
  // ----------------------------------------------------------

  RAISEZEN: "Multi Micronutrients EDTA",
  MANGNIX: "Multi Micronutrients EDTA",
  CALBOFAST: "Multi Micronutrients EDTA",
  COPERZEN: "Multi Micronutrients EDTA",
  CALCIRICH: "Multi Micronutrients EDTA",
  "MAGNUM MG": "Multi Micronutrients EDTA",
  BOROFAST: "Multi Micronutrients EDTA",
  CHEMSULF: "Multi Micronutrients EDTA",
  NUTRIFIX: "Multi Micronutrients EDTA",
  ZINWOX: "Multi Micronutrients EDTA",
  FERAGRAIN: "Multi Micronutrients EDTA",


  // ----------------------------------------------------------
  // PLANT GROWTH REGULATOR (PGR)
  // ----------------------------------------------------------

  HUMIGENE: "Plant Growth Regulator (PGR)",
  "SYNO-WET": "Plant Growth Regulator (PGR)",
  "AMINE-50": "Plant Growth Regulator (PGR)",
  SEAZOLE: "Plant Growth Regulator (PGR)",
  "AMIZ-G5": "Plant Growth Regulator (PGR)",
  SEAZEN: "Plant Growth Regulator (PGR)",
  GROVITA: "Plant Growth Regulator (PGR)",
  ATAMIC: "Plant Growth Regulator (PGR)",
  NUTRIROOTS: "Plant Growth Regulator (PGR)",
  "NUTRIROOTS ZYME GR": "Plant Growth Regulator (PGR)",
  "NITRA BOOST": "Plant Growth Regulator (PGR)",
  FELUROX: "Plant Growth Regulator (PGR)",
  HUMMER: "Plant Growth Regulator (PGR)",
  ROOTZEN: "Plant Growth Regulator (PGR)",
  ZYBRON: "Plant Growth Regulator (PGR)",
  TRICONOL: "Plant Growth Regulator (PGR)",
  "AMINE-80": "Plant Growth Regulator (PGR)",
  BITTROL: "Plant Growth Regulator (PGR)",
  GIBROX: "Plant Growth Regulator (PGR)",
  FISHOX: "Plant Growth Regulator (PGR)",


  // ----------------------------------------------------------
  // MINERAL ACTIVATOR
  // ----------------------------------------------------------

  DYBAC: "Mineral Activator",
  "FUNGI-BLAST": "Mineral Activator",
  "DA-TECH": "Mineral Activator",
  FRUITLOAD: "Mineral Activator",
  JASTECK: "Mineral Activator",
  ATONIEX: "Mineral Activator",
  "PHOS-GUARD": "Mineral Activator",
  SILICLON: "Mineral Activator",
  "PHYTO-98": "Mineral Activator",
  RHODOPHYT: "Mineral Activator",
  BRONOZENE: "Mineral Activator",
  H3PO4: "Mineral Activator",
  SILICONIX: "Mineral Activator",
  ACIDEX: "Mineral Activator",
  CHLOCAL: "Mineral Activator",
  PBC: "Mineral Activator",
  PDH: "Mineral Activator",
  MAGNIUM: "Mineral Activator",
  WITALGROW: "Mineral Activator",
  PROTOSIL: "Mineral Activator",
  PHOSGEN: "Mineral Activator",
  "PH BALANCE": "Mineral Activator",
  GLUCO: "Mineral Activator",
  "GLUCO POTASSIUM": "Mineral Activator",


  // ----------------------------------------------------------
  // STRAIGHT MICRONUTRIENTS
  // ----------------------------------------------------------

  COPREX: "Straight Micronutrients",
  FEROX: "Straight Micronutrients",
  MAGNOX: "Straight Micronutrients",
  "MAGNOX PLUS": "Straight Micronutrients",
  ZINFAST: "Straight Micronutrients",
  "ZINCOL (GR)": "Straight Micronutrients",
  "ZINWOX P": "Straight Micronutrients",
  BORLIC: "Straight Micronutrients",
  "ZINCO FAST": "Straight Micronutrients",
  BOREX: "Straight Micronutrients",
  BOROX: "Straight Micronutrients",
  "NITRO BLAST": "Straight Micronutrients",
  "BOROFAST PLUS": "Straight Micronutrients",


  // ----------------------------------------------------------
  // LIQUED FERTILIZERS
  // ----------------------------------------------------------

  "HYDRO CALP": "Liqued Fertilizers",
  SUGARGEN: "Liqued Fertilizers",
  ZINGENE: "Liqued Fertilizers",
  CALILOCK: "Liqued Fertilizers",
  BOROLOCK: "Liqued Fertilizers",
  "NEXTGEN 6.0.18": "Liqued Fertilizers",
  "NEXTGEN 11.11.8": "Liqued Fertilizers",
  "CALMAG BOOST": "Liqued Fertilizers",
  TRHIORISE: "Liqued Fertilizers",
  CALRAISE: "Liqued Fertilizers",
  "CALCIFAST PLUS": "Liqued Fertilizers",


  // ----------------------------------------------------------
  // ORGANIC FERTILIZERS
  // ----------------------------------------------------------

  CARBOLAR: "Organic Fertilizers",
  "PREMIUM CARBOLAR": "Organic Fertilizers",
  VAMGENE: "Organic Fertilizers",
  CITYCOMPOST: "Organic Fertilizers",
  PHOSMAX: "Organic Fertilizers",
  "SOIL MEAL": "Organic Fertilizers",
  RHODOPHYT: "Organic Fertilizers",
  ACRAZONE: "Organic Fertilizers",
  CARBONOL: "Organic Fertilizers",
  GERMINATION: "Organic Fertilizers",
  HYDROX: "Organic Fertilizers",


  // ----------------------------------------------------------
  // NON-EDIBLE DE-OILED CAKE FERTILISERS
  // ----------------------------------------------------------

  SILICLONIX: "Non-edible De-oiled Cake Fertilisers",
  CILISTAR: "Non-edible De-oiled Cake Fertilisers",


  // ----------------------------------------------------------
  // STRAIGHT POTASSIUM FERTILISERS
  // ----------------------------------------------------------

  POTASULF: "Straight Potassium Fertilisers",
  "4IN1": "Straight Potassium Fertilisers",
};


// ============================================================
// NORMALIZE PRODUCT NAME
// ============================================================

export function normalizeProductName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}


// ============================================================
// GET CATEGORY FOR PRODUCT
//
// First uses the new category from database.
// If database still has an old category, it checks the
// product name against the official product map.
// ============================================================

export function getProductCategory(product) {
  if (!product) return "";

  const productName = normalizeProductName(product.name);

  // First use mapped category when available.
  if (PRODUCT_CATEGORY_MAP[productName]) {
    return PRODUCT_CATEGORY_MAP[productName];
  }

  // Otherwise use category stored in Supabase.
  return product.category || "";
}