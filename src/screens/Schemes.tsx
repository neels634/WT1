// Screen 8: schemes at the point of sale, each with a "Check eligibility" stepper.
import { useState } from 'react'
import { Icon } from '../components/Icon'
import { BottomSheet, Chip, PrimaryButton, Screen, SecondaryButton } from '../components/ui'
import { CROPS, MSP_CROPS, SCHEMES, type CropId, type SchemeId } from '../data/mock'
import { useApp } from '../state/AppState'
import type { TKey } from '../i18n/en'

const ICON: Record<SchemeId, string> = { msp: 'scale', storage: 'store', enam: 'prices' }

export default function Schemes() {
  const { t } = useApp()
  const [open, setOpen] = useState<SchemeId | null>(null)

  return (
    <Screen title={t('schemesTitle')} farmer>
      <p className="mb-3 text-[17px] text-muted">{t('schemesSub')}</p>
      <div className="flex flex-col gap-3">
        {SCHEMES.map((s) => (
          <button
            key={s}
            onClick={() => setOpen(s)}
            className="flex items-start gap-3 rounded-3xl bg-mint p-4 text-left hover:bg-mint-strong"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-forest">
              <Icon name={ICON[s]} size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[19px] leading-tight font-bold">{t(`scheme_${s}`)}</div>
              <div className="mt-0.5 text-[16px] leading-snug text-muted">{t(`scheme_${s}_short` as TKey)}</div>
              <span className="mt-2 inline-block rounded-full border border-black/15 bg-white px-2 text-[13px] font-semibold text-muted">
                {t('toBeVerified')}
              </span>
            </div>
            <Icon name="chevron" size={20} className="mt-3 shrink-0 text-forest" />
          </button>
        ))}
      </div>
      {open && <SchemeSheet scheme={open} onClose={() => setOpen(null)} />}
    </Screen>
  )
}

function SchemeSheet({ scheme, onClose }: { scheme: SchemeId; onClose: () => void }) {
  const { t, crop: appCrop } = useApp()
  const [step, setStep] = useState(0) // 0 = info, 1..2 = questions, 3 = result
  const [crop, setCrop] = useState<CropId>(appCrop)
  const [answers, setAnswers] = useState<boolean[]>([])

  const answer = (v: boolean) => {
    const a = [...answers]
    a[step - 1] = v
    setAnswers(a)
    setStep(step + 1)
  }

  let result: { ok: boolean; text: string } | null = null
  if (step === 3) {
    if (scheme === 'msp' && !MSP_CROPS.includes(crop)) result = { ok: false, text: t('resultMspNo', { crop: t(`crop_${crop}`) }) }
    else if (answers.every(Boolean)) result = { ok: true, text: t('resultEligible') }
    else result = { ok: false, text: t('resultNotEligible') }
  }

  return (
    <BottomSheet title={t(`scheme_${scheme}`)} onClose={onClose}>
      {step === 0 && (
        <>
          <span className="mb-2 inline-block rounded-full border border-black/15 px-2 text-[13px] font-semibold text-muted">
            {t('toBeVerified')}
          </span>
          <p className="text-[18px] leading-relaxed">{t(`scheme_${scheme}_body` as TKey)}</p>
          <div className="mt-5">
            <PrimaryButton icon="check" onClick={() => setStep(1)}>
              {t('checkEligibility')}
            </PrimaryButton>
          </div>
        </>
      )}

      {step >= 1 && step <= 2 && (
        <div className="fade-in" key={step}>
          <div className="mb-2 flex gap-1.5" aria-hidden="true">
            {[1, 2].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-forest' : 'bg-black/10'}`} />
            ))}
          </div>
          <div className="mb-1 text-[14px] font-semibold text-muted">{t('step', { n: step, m: 2 })}</div>
          <p className="mb-4 text-[20px] leading-snug font-bold">{t(`q_${scheme}_${step}` as TKey)}</p>
          {scheme === 'msp' && step === 1 ? (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {CROPS.map((c) => (
                  <Chip key={c} active={crop === c} onClick={() => setCrop(c)}>
                    {t(`crop_${c}`)}
                  </Chip>
                ))}
              </div>
              <PrimaryButton onClick={() => answer(true)}>{t('next')}</PrimaryButton>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <PrimaryButton icon="check" onClick={() => answer(true)}>
                {t('yes')}
              </PrimaryButton>
              <SecondaryButton icon="close" onClick={() => answer(false)}>
                {t('no')}
              </SecondaryButton>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="fade-in">
          <div
            className={`flex items-start gap-3 rounded-2xl p-4 ${result.ok ? 'bg-leaf/10 text-leaf' : 'bg-gold-soft text-[#7a5200]'}`}
          >
            <Icon name={result.ok ? 'check' : 'info'} size={28} className="shrink-0" />
            <p className="text-[19px] leading-snug font-bold">{result.text}</p>
          </div>
          <p className="mt-3 text-[16px] text-muted">{t('resultNote')}</p>
          <div className="mt-4 flex flex-col gap-2">
            <PrimaryButton onClick={onClose}>{t('close')}</PrimaryButton>
            <SecondaryButton
              icon="reset"
              onClick={() => {
                setAnswers([])
                setStep(1)
              }}
            >
              {t('startOver')}
            </SecondaryButton>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
