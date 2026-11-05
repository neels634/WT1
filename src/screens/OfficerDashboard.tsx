// Screen 10: taluka officer dashboard. Uses the full width on a laptop.
import { Fragment, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '../components/Icon'
import { SampleBadge, TopBar, useCountUp } from '../components/ui'
import { inr } from '../data/calc'
import { ARRIVALS, MANDI_COLORS, MANDIS, VILLAGE_DETAIL, priceHistory, type VillageId } from '../data/mock'
import { totals, useApp } from '../state/AppState'
import type { TKey } from '../i18n/en'
import { dayLabel, endLabel } from './MandiDetail'

export default function OfficerDashboard() {
  const { t, villages, recentSales, showToast } = useApp()
  const [open, setOpen] = useState<VillageId | null>(null)
  const tot = totals(villages)
  const gain = useCountUp(tot.avgGain)
  const hasDemoSale = recentSales.some((s) => s.isDemo)

  const arrivals = MANDIS.map((m) => ({ m, name: t(`mandi_${m}`), q: ARRIVALS[m] }))
  const trend = Array.from({ length: 7 }, (_, i) => {
    const row: Record<string, number | string> = { day: dayLabel(i, t) }
    for (const m of MANDIS) row[m] = priceHistory('onion', m)[i]
    return row
  })

  return (
    <div className="min-h-dvh bg-[#F6F9F3]">
      <TopBar title={t('officerTitle')} wide />
      <main className="screen-in mx-auto max-w-6xl px-4 pt-4 pb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[24px] leading-tight font-extrabold">{t('officerTitle')}</h2>
            <p className="text-[16px] text-muted">{t('officerSub')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SampleBadge />
            <button
              onClick={() => showToast(t('toastDownload'))}
              className="flex min-h-12 items-center gap-2 rounded-2xl bg-forest px-4 text-[17px] font-bold text-white shadow hover:bg-forest-dark"
            >
              <Icon name="download" size={22} />
              {t('download')}
            </button>
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label={t('kpiFarmers')} value={inr(tot.farmers)} />
          <Kpi label={t('kpiQuintals')} value={inr(tot.quintals)} />
          <Kpi label={t('kpiGain')} value={`${t('rs', { n: inr(gain) })}`} sub={t('kpiGainUnit')} highlight pulse={hasDemoSale} />
          <Kpi label={t('kpiVillages')} value={String(tot.villages)} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* Village table */}
          <section className="min-w-0 rounded-3xl bg-white p-3 shadow-sm sm:p-4 lg:col-span-3">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[19px] font-bold">{t('villageTable')}</h3>
              <span className="text-[14px] text-muted">{t('tapRow')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[15px] tabular-nums sm:text-[16px]">
                <thead>
                  <tr className="border-b-2 border-forest/15 text-[14px] text-muted">
                    <th className="py-2 pr-2 font-semibold">{t('colVillage')}</th>
                    <th className="py-2 pr-2 text-right font-semibold">{t('colFarmers')}</th>
                    <th className="py-2 pr-2 text-right font-semibold">{t('colQuintals')}</th>
                    <th className="py-2 text-right font-semibold">{t('colGain')}</th>
                  </tr>
                </thead>
                <tbody>
                  {villages.map((v) => {
                    const isOpen = open === v.id
                    const det = VILLAGE_DETAIL[v.id]
                    const touched = hasDemoSale && v.id === 'phaltan'
                    return (
                      <Fragment key={v.id}>
                        <tr
                          onClick={() => setOpen(isOpen ? null : v.id)}
                          className={`cursor-pointer border-b border-black/5 hover:bg-mint ${touched ? 'bg-gold-soft' : ''}`}
                          aria-expanded={isOpen}
                        >
                          <td className="py-3 pr-2 font-semibold">
                            <span className="flex flex-wrap items-center gap-1">
                              <Icon name={isOpen ? 'chevronDown' : 'chevron'} size={18} className="shrink-0 text-forest" />
                              {t(`village_${v.id}` as TKey)}
                              {touched && (
                                <span className="rounded-full bg-gold px-2 text-[12px] font-bold">{t('newSale')}</span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-right">{inr(v.farmers)}</td>
                          <td className="py-3 pr-2 text-right">{inr(v.quintals)}</td>
                          <td className="py-3 text-right font-bold text-leaf">{inr(v.avgGain)}</td>
                        </tr>
                        {isOpen && (
                          <tr className="fade-in bg-mint/60">
                            <td colSpan={4} className="px-3 py-3 text-[15px]">
                              <div className="grid grid-cols-3 gap-2">
                                <Detail label={t('mainCrop')} value={t(`crop_${det.mainCrop}`)} />
                                <Detail label={t('topMandi')} value={t(`mandi_${det.topMandi}`)} />
                                <Detail label={t('krishiMitras')} value={String(det.krishiMitras)} />
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent sales */}
          <section className="min-w-0 rounded-3xl bg-white p-4 shadow-sm lg:col-span-2">
            <h3 className="mb-2 text-[19px] font-bold">{t('recentSales')}</h3>
            <ul className="flex flex-col gap-2">
              {recentSales.slice(0, 5).map((s) => (
                <li
                  key={s.id}
                  className={`fade-in rounded-2xl p-3 ${s.isDemo ? 'bg-gold-soft ring-2 ring-gold' : 'bg-mint'}`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold">
                      {t(s.farmerKey as TKey)}
                      {s.isDemo && <span className="ml-2 rounded-full bg-gold px-2 text-[12px] font-bold">{t('newSale')}</span>}
                    </span>
                    <span className="font-bold whitespace-nowrap text-leaf">+{t('rs', { n: inr(s.gain) })}/q</span>
                  </div>
                  <div className="text-[14px] text-muted">
                    {t(`crop_${s.crop}`)} · {t('quintals', { n: s.quintals })} · {t('rsPerQ', { n: inr(s.netPrice) })} ·{' '}
                    {t('via', { buyer: t(`buyer_${s.buyer}`) })}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-[17px] font-bold">{t('arrivalsTitle')}</h3>
            <div className="h-64" role="img" aria-label={t('arrivalsTitle')}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arrivals} margin={{ top: 22, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#1B2A1F" strokeOpacity={0.08} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#1B2A1F' }} tickLine={false} axisLine={false} />
                  <YAxis width={44} tick={{ fontSize: 12, fill: '#55665A' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => inr(v)} />
                  <Tooltip formatter={(v: number) => t('quintals', { n: inr(v) })} cursor={{ fill: '#EEF4E8' }} contentStyle={{ borderRadius: 12, fontSize: 14 }} />
                  <Bar dataKey="q" radius={[8, 8, 0, 0]} animationDuration={250}>
                    {arrivals.map((a) => (
                      <Cell key={a.m} fill={MANDI_COLORS[a.m]} />
                    ))}
                    <LabelList dataKey="q" position="top" formatter={(v: number) => inr(v)} style={{ fontSize: 13, fontWeight: 700, fill: '#1B2A1F' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-[17px] font-bold">{t('trendTitle')}</h3>
            <div className="h-64" role="img" aria-label={t('trendTitle')}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 12, right: 70, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#1B2A1F" strokeOpacity={0.08} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: '#55665A' }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickFormatter={(v: string, i: number) => (i === 0 || i === 3 || i === 6 ? v : '')}
                  />
                  <YAxis width={44} tick={{ fontSize: 12, fill: '#55665A' }} tickLine={false} axisLine={false} domain={['dataMin - 40', 'dataMax + 40']} tickFormatter={(v: number) => inr(v)} />
                  <Tooltip formatter={(v: number) => t('rs', { n: inr(v) })} contentStyle={{ borderRadius: 12, fontSize: 14 }} />
                  {MANDIS.map((m) => (
                    <Line key={m} dataKey={m} name={t(`mandi_${m}`)} stroke={MANDI_COLORS[m]} strokeWidth={2.5} dot={false} animationDuration={250}>
                      <LabelList dataKey={m} content={(p) => endLabel(p, 6, t(`mandi_${m}`), MANDI_COLORS[m], true)} />
                    </Line>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function Kpi({ label, value, sub, highlight, pulse }: { label: string; value: string; sub?: string; highlight?: boolean; pulse?: boolean }) {
  return (
    <div className={`rounded-3xl p-4 shadow-sm ${highlight ? 'border-[3px] border-gold bg-gold-soft' : 'bg-white'} ${pulse ? 'pop' : ''}`}>
      <div className="text-[15px] leading-tight font-semibold text-muted">{label}</div>
      <div className={`mt-1 text-[32px] leading-none font-extrabold tabular-nums ${highlight ? 'text-[#B97F00]' : ''}`}>{value}</div>
      {sub && <div className="mt-1 text-[13px] text-[#7a5200]">{sub}</div>}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[13px] text-muted">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  )
}
