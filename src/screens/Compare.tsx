// Screen 5: Compare and Decide, the core feature.
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Chip, PrimaryButton, SampleBadge, Screen, useCountUp } from '../components/ui'
import { decide, inr } from '../data/calc'
import { CROPS, HOME_MANDI, MANDI_COLORS, TRANSPORTS } from '../data/mock'
import { useApp } from '../state/AppState'

export default function Compare() {
  const { t, crop, setCrop, quantity, setQuantity, transport, setTransport, setPreferredBuyer } = useApp()
  const navigate = useNavigate()
  const d = decide(crop, transport, quantity)
  const gainShown = useCountUp(d.gainPerQuintal)
  const max = Math.max(...d.quotes.map((q) => q.net))
  const min = Math.min(...d.quotes.map((q) => q.net))
  // Bars start from a floor below the lowest net price, so differences are visible.
  const floor = Math.max(0, min - (max - min) * 1.2 - 50)
  const bestName = t(`mandi_${d.best.mandi}`)
  const localName = t(`mandi_${HOME_MANDI}`)

  return (
    <Screen
      title={t('compareTitle')}
      farmer
      footer={
        <PrimaryButton
          icon="sell"
          onClick={() => {
            setPreferredBuyer(d.best.mandi === HOME_MANDI ? 'local' : null)
            navigate('/farmer/sell')
          }}
        >
          {t('sellHere')}: {bestName}
        </PrimaryButton>
      }
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {CROPS.map((c) => (
            <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
              {t(`crop_${c}`)}
            </Chip>
          ))}
        </div>
        <SampleBadge />
      </div>

      {/* Quantity */}
      <section className="rounded-3xl bg-mint p-4">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="qty" className="text-[17px] font-bold">
            {t('quantity')}
          </label>
          <span className="text-[22px] font-extrabold whitespace-nowrap">{t('quintals', { n: quantity })}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-11 w-11 shrink-0 rounded-full bg-white text-[24px] font-bold text-forest shadow-sm"
            aria-label="−1"
          >
            −
          </button>
          <input
            id="qty"
            type="range"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-11 w-full"
          />
          <button
            onClick={() => setQuantity(Math.min(100, quantity + 1))}
            className="h-11 w-11 shrink-0 rounded-full bg-white text-[24px] font-bold text-forest shadow-sm"
            aria-label="+1"
          >
            +
          </button>
        </div>

        <div className="mt-3 mb-2 text-[17px] font-bold">{t('transport')}</div>
        <div className="flex flex-wrap gap-2">
          {TRANSPORTS.map((x) => (
            <Chip key={x} active={transport === x} onClick={() => setTransport(x)}>
              {t(`transport_${x}`)}
            </Chip>
          ))}
        </div>
      </section>

      {/* Best mandi + gain: the biggest number on the screen */}
      <section className="pop mt-4 rounded-3xl border-[3px] border-gold bg-gold-soft p-4" key={`${crop}-${d.best.mandi}`}>
        {d.gainPerQuintal > 0 ? (
          <>
            <div className="text-[15px] font-semibold text-[#7a5200]">{t('bestMandi')}</div>
            <div className="text-[26px] leading-tight font-extrabold">{bestName}</div>
            <div className="mt-2 text-[56px] leading-none font-extrabold text-[#B97F00] tabular-nums">
              +{t('rs', { n: inr(gainShown) })}
            </div>
            <div className="text-[17px] font-semibold text-[#7a5200]">
              {t('perQuintal')} · {t('gainOverLocal', { mandi: localName })}
            </div>
            <div className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-[17px] font-bold text-leaf">
              {t('gainTotal', { n: inr(d.gainTotal), q: quantity })}
            </div>
            <div className="mt-1 px-1 text-[15px] text-muted">{t('youGet', { n: inr(d.best.total) })}</div>
          </>
        ) : (
          <div className="text-[22px] font-extrabold">{t('localBest', { mandi: localName })}</div>
        )}
      </section>

      {/* Net price bars */}
      <section className="mt-4">
        <h2 className="text-[18px] font-bold">{t('netPrice')}</h2>
        <p className="mb-2 text-[14px] text-muted">{t('netExplain')}</p>
        <ul className="flex flex-col gap-2">
          {[...d.quotes]
            .sort((a, b) => b.net - a.net)
            .map((q) => {
              const isBest = q.mandi === d.best.mandi
              const pct = ((q.net - floor) / (max - floor)) * 100
              return (
                <li key={q.mandi} className={`rounded-2xl p-2.5 ${isBest ? 'bg-gold-soft ring-2 ring-gold' : 'bg-mint'}`}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-2 text-[17px] font-bold">
                      {t(`mandi_${q.mandi}`)}
                      {isBest && (
                        <span className="rounded-full bg-gold px-2 text-[13px] font-bold text-ink">{t('bestTag')}</span>
                      )}
                    </span>
                    <span className="text-[18px] font-extrabold tabular-nums">{t('rs', { n: inr(q.net) })}</span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full bg-white">
                    <div
                      className="bar-grow h-full rounded-full"
                      style={{ width: `${pct}%`, background: isBest ? '#E8A317' : MANDI_COLORS[q.mandi] }}
                    />
                  </div>
                  <div className="mt-1 text-[14px] text-muted tabular-nums">
                    {t('rs', { n: inr(q.price) })} − {t('transportCost')} {t('rs', { n: inr(q.transport) })}
                  </div>
                </li>
              )
            })}
        </ul>
      </section>

      {/* Advice */}
      <section className="mt-4 flex gap-3 rounded-3xl border-2 border-leaf/30 bg-white p-4">
        <Icon name="info" size={28} className="mt-0.5 shrink-0 text-leaf" />
        <div>
          <h2 className="text-[17px] font-bold">{t('adviceTitle')}</h2>
          <p className="text-[17px] leading-snug">
            {d.hold ? t('adviceHold', { mandi: bestName, n: d.risingDays }) : t('adviceSell', { mandi: bestName })}
          </p>
          <p className="mt-1 text-[14px] text-muted">{t('adviceNote')}</p>
        </div>
      </section>
    </Screen>
  )
}
