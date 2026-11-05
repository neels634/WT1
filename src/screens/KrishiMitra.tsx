// Screen 9: Krishi Mitra helps families who are not comfortable with phones.
import { useState } from 'react'
import { Icon } from '../components/Icon'
import { BottomSheet, PrimaryButton, SampleBadge, Screen } from '../components/ui'
import { decide, inr } from '../data/calc'
import { DEFAULT_TRANSPORT, HOME_MANDI, todayPrice, type Family } from '../data/mock'
import { useApp } from '../state/AppState'
import type { TKey } from '../i18n/en'

export default function KrishiMitra() {
  const { t, families, markInformed, showToast } = useApp()
  const [preview, setPreview] = useState<Family | null>(null)
  const notInformed = families.filter((f) => !f.informed)

  const message = (f: Family) => {
    const d = decide(f.crop, DEFAULT_TRANSPORT, f.quintals)
    return t('messageText', {
      name: t(`family_${f.id}` as TKey),
      crop: t(`crop_${f.crop}`),
      local: inr(todayPrice(f.crop, HOME_MANDI)),
      mandi: t(`mandi_${d.best.mandi}`),
      net: inr(d.best.net),
    })
  }

  return (
    <Screen
      title={t('mitraTitle')}
      footer={
        <PrimaryButton
          icon="message"
          disabled={notInformed.length === 0}
          onClick={() => {
            markInformed(notInformed.map((f) => f.id))
            showToast(t('toastSentAll', { n: notInformed.length }))
          }}
        >
          {notInformed.length === 0 ? t('allInformed') : `${t('sendAll')} (${notInformed.length})`}
        </PrimaryButton>
      }
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[20px] font-bold">{t('mitraSub')}</h2>
        <SampleBadge />
      </div>
      <p className="mb-3 text-[16px] font-semibold text-leaf">
        {t('informedCount', { n: families.length - notInformed.length, m: families.length })}
      </p>

      <ul className="flex flex-col gap-2.5">
        {families.map((f) => (
          <li key={f.id} className="rounded-3xl bg-mint p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[18px] font-bold text-forest">
                {t(`family_${f.id}` as TKey).slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[18px] leading-tight font-bold">{t(`family_${f.id}` as TKey)}</div>
                <div className="text-[15px] text-muted">
                  {t(`crop_${f.crop}`)} · {t('quintals', { n: f.quintals })}
                </div>
                <span
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 text-[14px] font-semibold ${
                    f.informed ? 'bg-leaf/15 text-leaf' : 'bg-gold-soft text-[#7a5200]'
                  }`}
                >
                  {f.informed && <Icon name="check" size={14} />}
                  {f.informed ? t('status_informed') : t('status_not')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setPreview(f)}
              className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-[17px] font-semibold ${
                f.informed ? 'border-2 border-forest/20 bg-white text-forest' : 'bg-white text-forest shadow-sm ring-2 ring-forest'
              }`}
            >
              <Icon name="message" size={20} />
              {f.informed ? t('sendAgain') : t('sendPrice')}
            </button>
          </li>
        ))}
      </ul>

      {preview && (
        <BottomSheet title={t('previewTitle')} onClose={() => setPreview(null)}>
          <div className="rounded-2xl rounded-tl-sm bg-[#DCF3D0] p-4 text-[17px] leading-relaxed">{message(preview)}</div>
          <div className="mt-4">
            <PrimaryButton
              icon="message"
              onClick={() => {
                markInformed([preview.id])
                showToast(t('toastSent', { name: t(`family_${preview.id}` as TKey) }))
                setPreview(null)
              }}
            >
              {t('send')}
            </PrimaryButton>
          </div>
        </BottomSheet>
      )}
    </Screen>
  )
}
