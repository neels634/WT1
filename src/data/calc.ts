// Rules for Compare and Decide, and the Sell screen. Pure functions on the sample data.
import {
  BUYERS,
  GROUP_OFFER_BELOW_PUNE,
  GROUP_TRANSPORT,
  HOME_MANDI,
  MANDI_INFO,
  MANDIS,
  TRANSPORT_FACTOR,
  priceHistory,
  todayPrice,
  type BuyerId,
  type CropId,
  type MandiId,
  type TransportId,
} from './mock'

export interface MandiQuote {
  mandi: MandiId
  price: number
  transport: number
  net: number
  total: number
}

export function transportCost(mandi: MandiId, transport: TransportId): number {
  return Math.round(MANDI_INFO[mandi].tempoCost * TRANSPORT_FACTOR[transport])
}

export function quotes(crop: CropId, transport: TransportId, quintals: number): MandiQuote[] {
  return MANDIS.map((mandi) => {
    const price = todayPrice(crop, mandi)
    const t = transportCost(mandi, transport)
    const net = price - t
    return { mandi, price, transport: t, net, total: net * quintals }
  })
}

export interface Decision {
  quotes: MandiQuote[]
  best: MandiQuote
  local: MandiQuote
  gainPerQuintal: number
  gainTotal: number
  /** Consecutive daily rises of the best mandi's price, ending today. */
  risingDays: number
  hold: boolean
}

export function decide(crop: CropId, transport: TransportId, quintals: number): Decision {
  const qs = quotes(crop, transport, quintals)
  const best = qs.reduce((a, b) => (b.net > a.net ? b : a))
  const local = qs.find((q) => q.mandi === HOME_MANDI)!
  const gainPerQuintal = best.net - local.net
  const h = priceHistory(crop, best.mandi)
  let risingDays = 0
  for (let i = h.length - 1; i > 0 && h[i] > h[i - 1]; i--) risingDays++
  return {
    quotes: qs,
    best,
    local,
    gainPerQuintal,
    gainTotal: gainPerQuintal * quintals,
    risingDays,
    // Advice rule: price rose on each of the last 3 days -> suggest holding.
    hold: risingDays >= 3,
  }
}

export interface BuyerOffer {
  buyer: BuyerId
  mandi: MandiId
  offer: number
  transport: number
  net: number
  total: number
  gain: number
}

export function buyerOffers(crop: CropId, transport: TransportId, quintals: number): BuyerOffer[] {
  const localNet = todayPrice(crop, HOME_MANDI)
  return BUYERS.map((buyer) => {
    let offer: number
    let t: number
    let mandi: MandiId
    if (buyer === 'local') {
      mandi = HOME_MANDI
      offer = todayPrice(crop, HOME_MANDI)
      t = 0
    } else if (buyer === 'enam') {
      mandi = 'pune'
      offer = todayPrice(crop, 'pune')
      t = transportCost('pune', transport)
    } else {
      mandi = 'pune'
      offer = todayPrice(crop, 'pune') - GROUP_OFFER_BELOW_PUNE
      t = GROUP_TRANSPORT
    }
    const net = offer - t
    return { buyer, mandi, offer, transport: t, net, total: net * quintals, gain: net - localNet }
  })
}

/** Indian digit grouping: 1,23,456 */
export function inr(n: number): string {
  return Math.round(n).toLocaleString('en-IN')
}
