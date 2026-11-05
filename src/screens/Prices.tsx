// Screen 3: Mandi Mitra, today's rates.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Chip, PrimaryButton, SampleBadge, Screen } from '../components/ui'
import { inr } from '../data/calc'
import { ARRIVALS, CROPS, MANDI_COLORS, MANDI_INFO, MANDIS, todayPrice, yesterdayPrice } from '../data/mock'
import { useApp } from '../state/AppState'

type Sort = 'price' | 'distance' | 'arrivals'

export default function Prices() {
  const { t, crop, setCrop } = useApp()
  const navigate = useNavigate()
  const [sort, setSort] = useState<Sort>('price')

  const rows = MANDIS.map((m) => ({
    m,
    price: todayPrice(crop, m),
    diff: todayPrice(crop, m) - yesterdayPrice(crop, m),
    arrivals: ARRIVALS[m],
    km: MANDI_INFO[m].distanceKm,
  })).sort((a, b) => (sort === 'price' ? b.price - a.price : sort === 'distance' ? a.km - b.km : b.arrivals - a.arrivals))

  return (
    <Screen
      title={t('mandiMitra')}
      farmer
      footer={
        <PrimaryButton icon="scale" onClick={() => navigate('/farmer/compare')}>
          {t('compareAll')}
        </PrimaryButton>
      }
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[22px] font-bold">{t('pricesTitle')}</h2>
        <SampleBadge />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {CROPS.map((c) => (
          <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
            {t(`crop_${c}`)}
          </Chip>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-semibold text-muted">{t('sortBy')}:</span>
        {(['price', 'distance', 'arrivals'] as Sort[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            aria-pressed={sort === s}
            className={`min-h-11 rounded-full px-3.5 text-[15px] font-semibold ${sort === s ? 'bg-ink text-white' : 'bg-mint text-ink'}`}
          >
            {t(s === 'price' ? 'sortPrice' : s === 'distance' ? 'sortDistance' : 'sortArrivals')}
          </button>
        ))}
      </div>

      <p className="mb-2 text-[15px] text-muted">{t('tapMandi')}</p>
      <ul className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.m}>
            <button
              onClick={() => navigate(`/farmer/mandi/${r.m}`)}
              className="flex w-full items-center gap-3 rounded-3xl bg-mint p-4 text-left hover:bg-mint-strong"
            >
              <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: MANDI_COLORS[r.m] }} />
              <div className="min-w-0 flex-1">
                <div className="text-[19px] leading-tight font-bold">{t(`mandi_${r.m}`)}</div>
                <div className="text-[15px] text-muted">
                  {t('arrivals')} {t('qShort', { n: inr(r.arrivals) })} · {t('km', { n: r.km })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[20px] leading-tight font-extrabold">{t('rs', { n: inr(r.price) })}</div>
                <div className={`flex items-center justify-end gap-0.5 text-[15px] font-semibold ${r.diff >= 0 ? 'text-leaf' : 'text-down'}`}>
                  <Icon name={r.diff >= 0 ? 'up' : 'down'} size={16} />
                  {inr(Math.abs(r.diff))} <span className="sr-only">{r.diff >= 0 ? t('up') : t('down')}</span>
                </div>
              </div>
              <Icon name="chevron" size={20} className="shrink-0 text-forest" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[14px] text-muted">{t('pricesUnit')}</p>
    </Screen>
  )
}
