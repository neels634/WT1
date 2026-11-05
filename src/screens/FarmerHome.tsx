// Screen 2: Farmer Home.
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Chip, PrimaryButton, SampleBadge, Screen } from '../components/ui'
import { decide, inr } from '../data/calc'
import { CROPS, HOME_MANDI, todayPrice, yesterdayPrice } from '../data/mock'
import { useApp } from '../state/AppState'

export default function FarmerHome() {
  const { t, crop, setCrop, transport, quantity, showToast } = useApp()
  const navigate = useNavigate()
  const price = todayPrice(crop, HOME_MANDI)
  const diff = price - yesterdayPrice(crop, HOME_MANDI)
  const d = decide(crop, transport, quantity)

  const tiles = [
    { icon: 'prices', label: t('tilePrices'), path: '/farmer/prices' },
    { icon: 'sell', label: t('tileSell'), path: '/farmer/sell' },
    { icon: 'group', label: t('tileGroup'), path: '/farmer/group' },
    { icon: 'schemes', label: t('tileSchemes'), path: '/farmer/schemes' },
  ]

  return (
    <Screen
      title={t('appName')}
      farmer
      footer={
        <PrimaryButton icon="pin" onClick={() => navigate('/farmer/prices')}>
          {t('whereSell')}
        </PrimaryButton>
      }
    >
      <p className="mb-3 text-[20px] font-bold">{t('greeting')}</p>

      <div className="mb-2 text-[15px] font-semibold text-muted">{t('yourCrop')}</div>
      <div className="mb-3 flex flex-wrap gap-2">
        {CROPS.map((c) => (
          <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
            {t(`crop_${c}`)}
          </Chip>
        ))}
      </div>

      <button
        onClick={() => showToast(t('toastVillage'))}
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-mint px-4 text-[16px] font-semibold"
      >
        <Icon name="pin" size={20} className="text-forest" />
        {t('yourVillage')}: {t('homeVillage')}
      </button>

      {/* Today's price card */}
      <div className="rounded-3xl bg-mint p-4">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[16px] font-semibold text-muted">{t('todayAt', { mandi: t('mandi_phaltan') })}</span>
          <SampleBadge />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[38px] leading-none font-extrabold">{t('rs', { n: inr(price) })}</span>
          <span className="text-[16px] text-muted">{t('perQuintal')}</span>
        </div>
        <div className={`mt-1 flex items-center gap-1 text-[16px] font-semibold ${diff >= 0 ? 'text-leaf' : 'text-down'}`}>
          <Icon name={diff >= 0 ? 'up' : 'down'} size={18} />
          {t('vsYesterday', { sign: diff >= 0 ? '+' : '−', n: inr(Math.abs(diff)) })}
        </div>
        {d.gainPerQuintal > 0 && (
          <button
            onClick={() => navigate('/farmer/compare')}
            className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-left text-[16px] font-semibold"
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
            <span className="flex-1">{t('bestToday', { mandi: t(`mandi_${d.best.mandi}`), n: inr(d.gainPerQuintal) })}</span>
            <Icon name="chevron" size={20} className="text-forest" />
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {tiles.map((x) => (
          <button
            key={x.path}
            onClick={() => navigate(x.path)}
            className="flex min-h-24 flex-col items-start justify-between gap-2 rounded-3xl border-2 border-forest/12 bg-white p-4 text-left hover:bg-mint"
          >
            <Icon name={x.icon} size={30} className="text-forest" />
            <span className="text-[18px] leading-tight font-bold">{x.label}</span>
          </button>
        ))}
      </div>
    </Screen>
  )
}
