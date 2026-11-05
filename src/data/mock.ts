// ALL SAMPLE DATA FOR THE DEMO. Every number here is invented.
// Prices are rupees per quintal. Change numbers here and the whole app follows.

export type CropId = 'onion' | 'soybean' | 'jowar'
export type MandiId = 'phaltan' | 'baramati' | 'satara' | 'pune'
export type TransportId = 'own' | 'tempo' | 'shared'
export type BuyerId = 'local' | 'enam' | 'group'
export type VillageId = 'phaltan' | 'tardgaon' | 'sakharwadi' | 'vinchurni' | 'adarki'

export const HOME_MANDI: MandiId = 'phaltan'
export const HOME_VILLAGE: VillageId = 'phaltan'
export const DEFAULT_QUANTITY = 20
export const DEFAULT_TRANSPORT: TransportId = 'tempo'

export const CROPS: CropId[] = ['onion', 'soybean', 'jowar']
export const MANDIS: MandiId[] = ['phaltan', 'baramati', 'satara', 'pune']

/** One colour per mandi, used in every chart. */
export const MANDI_COLORS: Record<MandiId, string> = {
  phaltan: '#6B7F70',
  baramati: '#2E7D32',
  satara: '#3B6EA8',
  pune: '#B4532A',
}

export const MANDI_INFO: Record<MandiId, { distanceKm: number; tempoCost: number }> = {
  phaltan: { distanceKm: 0, tempoCost: 0 },
  baramati: { distanceKm: 55, tempoCost: 60 },
  satara: { distanceKm: 60, tempoCost: 70 },
  pune: { distanceKm: 110, tempoCost: 130 },
}

/** Transport cost = tempo cost x factor. */
export const TRANSPORT_FACTOR: Record<TransportId, number> = {
  tempo: 1.0,
  own: 0.7,
  shared: 0.5,
}
export const TRANSPORTS: TransportId[] = ['own', 'tempo', 'shared']

/** Today's arrivals in quintals (Onion values; reused for other crops). */
export const ARRIVALS: Record<MandiId, number> = {
  phaltan: 380,
  baramati: 620,
  satara: 450,
  pune: 1900,
}

export const HISTORY_DAYS = 7

/** Onion, 7-day history, oldest first. Last value is today. */
const ONION_HISTORY: Record<MandiId, number[]> = {
  phaltan: [1290, 1320, 1360, 1390, 1410, 1430, 1450],
  baramati: [1450, 1480, 1520, 1550, 1570, 1590, 1610],
  satara: [1360, 1390, 1430, 1460, 1480, 1500, 1520],
  pune: [1620, 1650, 1690, 1720, 1740, 1760, 1780],
}

/** Today's price per crop. Soybean and Jowar are placeholders. */
const TODAY: Record<CropId, Record<MandiId, number>> = {
  onion: { phaltan: 1450, baramati: 1610, satara: 1520, pune: 1780 },
  soybean: { phaltan: 4600, baramati: 4720, satara: 4660, pune: 4810 },
  jowar: { phaltan: 3000, baramati: 3090, satara: 3050, pune: 3160 },
}

/** Other crops reuse the Onion history shape, shifted to their own today's price. */
export function priceHistory(crop: CropId, mandi: MandiId): number[] {
  const shift = TODAY[crop][mandi] - TODAY.onion[mandi]
  return ONION_HISTORY[mandi].map((p) => p + shift)
}

export function todayPrice(crop: CropId, mandi: MandiId): number {
  return TODAY[crop][mandi]
}

export function yesterdayPrice(crop: CropId, mandi: MandiId): number {
  const h = priceHistory(crop, mandi)
  return h[h.length - 2]
}

// ---------- Buyers on the Sell screen ----------
export const BUYERS: BuyerId[] = ['local', 'enam', 'group']
/** Village group offer is this much below the Pune price (Onion: 1,780 - 60 = 1,720). */
export const GROUP_OFFER_BELOW_PUNE = 60
/** Shared tempo cost for the village group sale. */
export const GROUP_TRANSPORT = 65

// ---------- Group sell ----------
export const GROUP_START = {
  farmers: 12,
  quintals: 240,
  target: 300,
  savingPerQuintal: 65,
}

// ---------- Officer dashboard ----------
export interface VillageRow {
  id: VillageId
  farmers: number
  quintals: number
  avgGain: number
}

export const VILLAGES_START: VillageRow[] = [
  { id: 'phaltan', farmers: 52, quintals: 910, avgGain: 190 },
  { id: 'tardgaon', farmers: 38, quintals: 640, avgGain: 205 },
  { id: 'sakharwadi', farmers: 41, quintals: 590, avgGain: 170 },
  { id: 'vinchurni', farmers: 33, quintals: 520, avgGain: 195 },
  { id: 'adarki', farmers: 28, quintals: 380, avgGain: 165 },
]

/** Extra detail shown when a village row expands on the dashboard. */
export const VILLAGE_DETAIL: Record<VillageId, { mainCrop: CropId; topMandi: MandiId; krishiMitras: number }> = {
  phaltan: { mainCrop: 'onion', topMandi: 'pune', krishiMitras: 4 },
  tardgaon: { mainCrop: 'onion', topMandi: 'pune', krishiMitras: 3 },
  sakharwadi: { mainCrop: 'soybean', topMandi: 'baramati', krishiMitras: 3 },
  vinchurni: { mainCrop: 'onion', topMandi: 'baramati', krishiMitras: 2 },
  adarki: { mainCrop: 'jowar', topMandi: 'satara', krishiMitras: 2 },
}

export interface SaleRecord {
  id: string
  village: VillageId
  farmerKey: string // i18n key or plain name
  crop: CropId
  quintals: number
  buyer: BuyerId
  netPrice: number
  gain: number // Rs per quintal over selling locally
  isDemo?: boolean // true for the sale made during the demo
}

export const RECENT_SALES_START: SaleRecord[] = [
  { id: 's3', village: 'tardgaon', farmerKey: 'sampleFarmer1', crop: 'onion', quintals: 18, buyer: 'enam', netPrice: 1650, gain: 200 },
  { id: 's2', village: 'sakharwadi', farmerKey: 'sampleFarmer2', crop: 'soybean', quintals: 25, buyer: 'group', netPrice: 4685, gain: 85 },
  { id: 's1', village: 'vinchurni', farmerKey: 'sampleFarmer3', crop: 'onion', quintals: 15, buyer: 'group', netPrice: 1655, gain: 205 },
]

// ---------- Krishi Mitra families (fictional names) ----------
export interface Family {
  id: string
  crop: CropId
  quintals: number
  informed: boolean
}

export const FAMILIES_START: Family[] = [
  { id: 'ramesh', crop: 'onion', quintals: 20, informed: false },
  { id: 'sunita', crop: 'onion', quintals: 12, informed: true },
  { id: 'dattatray', crop: 'soybean', quintals: 30, informed: false },
  { id: 'anita', crop: 'jowar', quintals: 15, informed: true },
  { id: 'vilas', crop: 'onion', quintals: 25, informed: false },
  { id: 'savita', crop: 'soybean', quintals: 18, informed: false },
]

// ---------- Schemes (plain-language placeholders, to be verified) ----------
export type SchemeId = 'msp' | 'storage' | 'enam'
export const SCHEMES: SchemeId[] = ['msp', 'storage', 'enam']
/** MSP applies only to notified crops. Confirm against the official list before the jury. */
export const MSP_CROPS: CropId[] = ['soybean', 'jowar']
