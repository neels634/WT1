// Screen 6: choose how to sell, confirm, then the success screen.
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { PrimaryButton, SampleBadge, Screen, SecondaryButton } from '../components/ui'
import { buyerOffers, inr } from '../data/calc'
import { type BuyerId } from '../data/mock'
import { useApp } from '../state/AppState'

const BUYER_ICON: Record<BuyerId, string> = { local: 'store', enam: 'prices', group: 'group' }

export default function Sell() {
  const { t, crop, quantity, transport, preferredBuyer, confirmSale } = useApp()
  const navigate = useNavigate()
  const offers = buyerOffers(crop, transport, quantity)
  const best = offers.reduce((a, b) => (b.net > a.net ? b : a))
  const [picked, setPicked] = useState<BuyerId>(preferredBuyer ?? best.buyer)
  const sel = offers.find((o) => o.buyer === picked)!

  return (
    <Screen
      title={t('tileSell')}
      farmer
      footer={
        <PrimaryButton
          icon="check"
          onClick={() => {
            confirmSale({ crop, quintals: quantity, buyer: sel.buyer, netPrice: sel.net, total: sel.total, gain: Math.max(0, sel.gain) })
            navigate('/farmer/sell/done', { replace: true })
          }}
        >
          {t('confirmSale')} · {t('rs', { n: inr(sel.total) })}
        </PrimaryButton>
      }
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[22px] font-bold">{t('sellTitle')}</h2>
        <SampleBadge />
      </div>
      <p className="mb-3 text-[17px] text-muted">{t('sellFor', { q: quantity, crop: t(`crop_${crop}`) })}</p>

      <div role="radiogroup" className="flex flex-col gap-3">
        {offers.map((o) => {
          const on = o.buyer === picked
          return (
            <button
              key={o.buyer}
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(o.buyer)}
              className={`rounded-3xl border-[3px] p-4 text-left transition-colors ${on ? 'border-forest bg-mint' : 'border-forest/10 bg-white hover:bg-mint/60'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${on ? 'bg-forest text-gold' : 'bg-mint text-forest'}`}>
                  <Icon name={BUYER_ICON[o.buyer]} size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] leading-tight font-bold">{t(`buyer_${o.buyer}`)}</div>
                  <div className="text-[15px] text-muted">{t(`pay_${o.buyer}`)}</div>
                </div>
                <span
                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-forest bg-forest text-white' : 'border-forest/30'}`}
                >
                  {on && <Icon name="check" size={16} />}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[15px] tabular-nums">
                <div>
                  <div className="text-muted">{t('offer')}</div>
                  <div className="font-bold">{t('rs', { n: inr(o.offer) })}</div>
                </div>
                <div>
                  <div className="text-muted">{t('transportCost')}</div>
                  <div className="font-bold">
                    {t('rs', { n: inr(o.transport) })}
                    {o.buyer === 'group' && <span className="block text-[13px] font-normal text-muted">{t('sharedTempo')}</span>}
                  </div>
                </div>
                <div>
                  <div className="text-muted">{t('net')}</div>
                  <div className="text-[18px] font-extrabold">{t('rs', { n: inr(o.net) })}</div>
                </div>
              </div>
              <div className={`mt-2 text-[15px] font-semibold ${o.gain > 0 ? 'text-leaf' : 'text-muted'}`}>
                {o.gain > 0 ? t('moreThanLocal', { n: inr(o.gain) }) : t('sameAsLocal')}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-3">
        <SecondaryButton icon="group" onClick={() => navigate('/farmer/group')}>
          {t('groupLink')}
        </SecondaryButton>
      </div>
    </Screen>
  )
}

export function SellDone() {
  const { t, lastSale, showToast } = useApp()
  const navigate = useNavigate()
  if (!lastSale) return <Navigate to="/farmer" replace />
  const s = lastSale
  const rows: [string, string, boolean?][] = [
    [t('summaryBuyer'), t(`buyer_${s.buyer}`)],
    [t('summaryQty'), t('quintals', { n: s.quintals })],
    [t('summaryNet'), t('rsPerQ', { n: inr(s.netPrice) })],
    [t('summaryTotal'), t('rs', { n: inr(s.total) })],
    [t('summaryGain'), `+${t('rs', { n: inr(s.gain * s.quintals) })} (+${t('rsPerQ', { n: inr(s.gain) })})`, true],
  ]
  return (
    <Screen
      title={t('successTitle')}
      farmer
      footer={
        <div className="flex flex-col gap-2">
          <PrimaryButton icon="store" onClick={() => navigate('/farmer')}>
            {t('backHome')}
          </PrimaryButton>
        </div>
      }
    >
      <div className="flex flex-col items-center pt-2 text-center">
        <div className="pop flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-white shadow-lg shadow-leaf/30">
          <Icon name="check" size={46} />
        </div>
        <h2 className="mt-3 text-[26px] font-extrabold">{t('successTitle')}</h2>
        <p className="text-[15px] text-muted">{t('successSub')}</p>
        <SampleBadge className="mt-2" />
      </div>
      <dl className="mt-4 divide-y divide-black/5 rounded-3xl bg-mint px-4">
        {rows.map(([k, v, hi]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 py-3">
            <dt className="text-[16px] text-muted">{k}</dt>
            <dd className={`text-right text-[17px] font-bold ${hi ? 'text-[#B97F00]' : ''}`}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-col gap-2">
        <SecondaryButton icon="whatsapp" onClick={() => showToast(t('toastWa'))}>
          {t('shareWa')}
        </SecondaryButton>
        <SecondaryButton icon="officer" onClick={() => navigate('/officer')}>
          {t('seeOfficer')}
        </SecondaryButton>
      </div>
    </Screen>
  )
}
