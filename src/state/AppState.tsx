// In-memory demo state: language, role, crop, compare inputs, sales, group, families.
// A page reload or "Reset demo" returns everything to the starting numbers.
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { en, type TKey } from '../i18n/en'
import { mr } from '../i18n/mr'
import {
  DEFAULT_QUANTITY,
  DEFAULT_TRANSPORT,
  FAMILIES_START,
  HOME_VILLAGE,
  RECENT_SALES_START,
  VILLAGES_START,
  type BuyerId,
  type CropId,
  type Family,
  type SaleRecord,
  type TransportId,
  type VillageRow,
} from '../data/mock'

export type Lang = 'en' | 'mr'
export type Role = 'farmer' | 'mitra' | 'officer'

export interface ConfirmedSale {
  crop: CropId
  quintals: number
  buyer: BuyerId
  netPrice: number
  total: number
  gain: number
}

interface ToastState {
  id: number
  text: string
}

interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  t: (key: TKey, vars?: Record<string, string | number>) => string
  role: Role | null
  setRole: (r: Role) => void
  crop: CropId
  setCrop: (c: CropId) => void
  quantity: number
  setQuantity: (q: number) => void
  transport: TransportId
  setTransport: (t: TransportId) => void
  preferredBuyer: BuyerId | null
  setPreferredBuyer: (b: BuyerId | null) => void
  lastSale: ConfirmedSale | null
  confirmSale: (s: ConfirmedSale) => void
  villages: VillageRow[]
  recentSales: SaleRecord[]
  groupJoined: boolean
  setGroupJoined: (j: boolean) => void
  families: Family[]
  markInformed: (ids: string[]) => void
  toast: ToastState | null
  showToast: (text: string) => void
  reset: () => void
}

const Ctx = createContext<AppState | null>(null)

const dicts = { en, mr }

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [role, setRole] = useState<Role | null>(null)
  const [crop, setCrop] = useState<CropId>('onion')
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)
  const [transport, setTransport] = useState<TransportId>(DEFAULT_TRANSPORT)
  const [preferredBuyer, setPreferredBuyer] = useState<BuyerId | null>(null)
  const [lastSale, setLastSale] = useState<ConfirmedSale | null>(null)
  const [villages, setVillages] = useState<VillageRow[]>(VILLAGES_START)
  const [recentSales, setRecentSales] = useState<SaleRecord[]>(RECENT_SALES_START)
  const [groupJoined, setGroupJoined] = useState(false)
  const [families, setFamilies] = useState<Family[]>(FAMILIES_START)
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => {
      let s: string = dicts[lang][key] ?? en[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
      return s
    },
    [lang],
  )

  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), text })
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  const confirmSale = useCallback((s: ConfirmedSale) => {
    setLastSale(s)
    // Add to the farmer's home village: +1 farmer, +quintals, weighted average gain.
    setVillages((vs) =>
      vs.map((v) =>
        v.id === HOME_VILLAGE
          ? {
              ...v,
              farmers: v.farmers + 1,
              quintals: v.quintals + s.quintals,
              avgGain: (v.avgGain * v.quintals + s.gain * s.quintals) / (v.quintals + s.quintals),
            }
          : v,
      ),
    )
    setRecentSales((rs) => [
      {
        id: `demo-${Date.now()}`,
        village: HOME_VILLAGE,
        farmerKey: 'demoFarmer',
        crop: s.crop,
        quintals: s.quintals,
        buyer: s.buyer,
        netPrice: s.netPrice,
        gain: s.gain,
        isDemo: true,
      },
      ...rs,
    ])
  }, [])

  const markInformed = useCallback((ids: string[]) => {
    setFamilies((fs) => fs.map((f) => (ids.includes(f.id) ? { ...f, informed: true } : f)))
  }, [])

  const reset = useCallback(() => {
    setCrop('onion')
    setQuantity(DEFAULT_QUANTITY)
    setTransport(DEFAULT_TRANSPORT)
    setPreferredBuyer(null)
    setLastSale(null)
    setVillages(VILLAGES_START)
    setRecentSales(RECENT_SALES_START)
    setGroupJoined(false)
    setFamilies(FAMILIES_START)
  }, [])

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === 'en' ? 'mr' : 'en')),
      t,
      role,
      setRole,
      crop,
      setCrop,
      quantity,
      setQuantity,
      transport,
      setTransport,
      preferredBuyer,
      setPreferredBuyer,
      lastSale,
      confirmSale,
      villages,
      recentSales,
      groupJoined,
      setGroupJoined,
      families,
      markInformed,
      toast,
      showToast,
      reset,
    }),
    [lang, t, role, crop, quantity, transport, preferredBuyer, lastSale, confirmSale, villages, recentSales, groupJoined, families, markInformed, toast, showToast, reset],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}

/** Weighted totals for the officer dashboard. */
export function totals(villages: VillageRow[]) {
  const farmers = villages.reduce((a, v) => a + v.farmers, 0)
  const quintals = villages.reduce((a, v) => a + v.quintals, 0)
  const gain = villages.reduce((a, v) => a + v.avgGain * v.quintals, 0) / quintals
  return { farmers, quintals, avgGain: gain, villages: villages.length }
}
