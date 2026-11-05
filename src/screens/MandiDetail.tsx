// Screen 4: one mandi, its 7-day price line.
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '../components/Icon'
import { PrimaryButton, SampleBadge, Screen } from '../components/ui'
import { inr, transportCost } from '../data/calc'
import { ARRIVALS, HISTORY_DAYS, HOME_MANDI, MANDI_COLORS, MANDI_INFO, MANDIS, priceHistory, type MandiId } from '../data/mock'
import { useApp } from '../state/AppState'

export function dayLabel(i: number, t: ReturnType<typeof useApp>['t']): string {
  const ago = HISTORY_DAYS - 1 - i
  return ago === 0 ? t('today') : ago === 1 ? t('yesterday') : t('daysAgo', { n: ago })
}

export default function MandiDetail() {
  const { id } = useParams()
  const { t, crop } = useApp()
  const navigate = useNavigate()
  if (!id || !MANDIS.includes(id as MandiId)) return <Navigate to="/farmer/prices" replace />
  const m = id as MandiId
  const h = priceHistory(crop, m)
  const home = priceHistory(crop, HOME_MANDI)
  const showHome = m !== HOME_MANDI
  const data = h.map((p, i) => ({ day: dayLabel(i, t), price: p, home: home[i] }))
  const week = h[h.length - 1] - h[0]
  const roseEveryDay = h.every((p, i) => i === 0 || p > h[i - 1])
  const lastIdx = data.length - 1

  return (
    <Screen
      title={t(`mandi_${m}`)}
      farmer
      footer={
        <PrimaryButton icon="scale" onClick={() => navigate('/farmer/compare')}>
          {t('compare')}
        </PrimaryButton>
      }
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[16px] font-semibold text-muted">
          {t(`crop_${crop}`)} · {t('priceTodayLabel')}
        </div>
        <SampleBadge />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[38px] leading-none font-extrabold">{t('rs', { n: inr(h[lastIdx]) })}</span>
        <span className="text-[16px] text-muted">{t('perQuintal')}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-[16px] font-semibold text-leaf">
        <Icon name="up" size={18} />
        {t('changeWeek', { sign: week >= 0 ? '+' : '−', n: inr(Math.abs(week)) })}
        {roseEveryDay && <span className="text-muted">· {t('rose7')}</span>}
      </div>

      <section className="mt-4 rounded-3xl bg-mint p-3 pt-4">
        <h2 className="mb-1 px-1 text-[17px] font-bold">{t('sevenDay')}</h2>
        <div className="h-60 w-full" role="img" aria-label={t('sevenDay')}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 22, right: 64, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="#1B2A1F" strokeOpacity={0.08} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#55665A' }}
                tickLine={false}
                axisLine={false}
                interval={0}
                tickFormatter={(v: string, i: number) => (i === 0 || i === 3 || i === lastIdx ? v : '')}
              />
              <YAxis
                width={44}
                tick={{ fontSize: 12, fill: '#55665A' }}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 40', 'dataMax + 40']}
                tickFormatter={(v: number) => inr(v)}
              />
              <Tooltip formatter={(v: number) => t('rs', { n: inr(v) })} contentStyle={{ borderRadius: 12, fontSize: 14 }} />
              {showHome && (
                <Line
                  dataKey="home"
                  name={t('mandi_phaltan')}
                  stroke={MANDI_COLORS[HOME_MANDI]}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="home"
                    content={(p) => endLabel(p, lastIdx, t('mandi_phaltan'), MANDI_COLORS[HOME_MANDI])}
                  />
                </Line>
              )}
              <Line
                dataKey="price"
                name={t(`mandi_${m}`)}
                stroke={MANDI_COLORS[m]}
                strokeWidth={3.5}
                dot={{ r: 3.5, strokeWidth: 0, fill: MANDI_COLORS[m] }}
                animationDuration={250}
              >
                <LabelList dataKey="price" content={(p) => endLabel(p, lastIdx, t(`mandi_${m}`), '#1B2A1F', true)} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label={t('arrivals')} value={t('qShort', { n: inr(ARRIVALS[m]) })} />
        <Stat label={t('distance')} value={t('km', { n: MANDI_INFO[m].distanceKm })} />
        <Stat label={t('transportTempo')} value={t('rs', { n: inr(transportCost(m, 'tempo')) })} />
      </div>
    </Screen>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-forest/10 p-3">
      <div className="text-[14px] leading-tight text-muted">{label}</div>
      <div className="text-[18px] font-bold">{value}</div>
    </div>
  )
}

// Direct label at the last point of a line, instead of a legend.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function endLabel(p: any, lastIdx: number, name: string, color: string, bold = false) {
  if (p.index !== lastIdx) return null
  return (
    <g>
      <text x={Number(p.x) + 8} y={Number(p.y) - 4} fontSize={12} fontWeight={bold ? 700 : 500} fill={color}>
        {name}
      </text>
      <text x={Number(p.x) + 8} y={Number(p.y) + 11} fontSize={12} fontWeight={bold ? 700 : 500} fill={color}>
        {inr(Number(p.value))}
      </text>
    </g>
  )
}
