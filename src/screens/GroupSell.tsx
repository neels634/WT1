// Screen 7: pool produce with the village group.
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { PrimaryButton, SampleBadge, Screen, SecondaryButton, useCountUp } from '../components/ui'
import { inr } from '../data/calc'
import { GROUP_START } from '../data/mock'
import { useApp } from '../state/AppState'

export default function GroupSell() {
  const { t, quantity, groupJoined, setGroupJoined, setPreferredBuyer, showToast, crop } = useApp()
  const navigate = useNavigate()
  const farmers = GROUP_START.farmers + (groupJoined ? 1 : 0)
  const pooled = GROUP_START.quintals + (groupJoined ? quantity : 0)
  const pooledShown = useCountUp(pooled)
  const pct = Math.min(100, (pooled / GROUP_START.target) * 100)

  return (
    <Screen
      title={t('groupTitle')}
      farmer
      footer={
        groupJoined ? (
          <PrimaryButton
            icon="sell"
            onClick={() => {
              setPreferredBuyer('group')
              navigate('/farmer/sell')
            }}
          >
            {t('sellWithGroup')}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            icon="group"
            onClick={() => {
              setGroupJoined(true)
              showToast(t('toastJoined'))
            }}
          >
            {t('joinGroup', { q: quantity })}
          </PrimaryButton>
        )
      }
    >
      <div className="mb-3 flex justify-end">
        <SampleBadge />
      </div>
      <section className="rounded-3xl bg-mint p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest text-gold">
            <Icon name="group" size={30} />
          </div>
          <div>
            <h2 className="text-[22px] leading-tight font-extrabold">{t('groupName')}</h2>
            <p className="text-[15px] text-muted">{t('mandi_pune')} · {t('crop_onion')}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-3">
            <div className="text-[32px] leading-none font-extrabold tabular-nums">{farmers}</div>
            <div className="text-[15px] text-muted">{t('farmersJoined')}</div>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <div className="text-[32px] leading-none font-extrabold tabular-nums">{inr(pooledShown)}</div>
            <div className="text-[15px] text-muted">{t('pooled')}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[15px] font-semibold">
            <span>{t('quintals', { n: inr(pooled) })}</span>
            <span className="text-muted">{t('target', { n: GROUP_START.target })}</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-white">
            <div className="bar-grow h-full rounded-full bg-leaf" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border-2 border-gold bg-gold-soft px-3 py-2.5 text-[17px] font-bold text-[#7a5200]">
          <Icon name="truck" size={24} className="shrink-0" />
          {t('saving', { n: GROUP_START.savingPerQuintal })}
        </div>
      </section>

      <p className="mt-4 text-[17px] leading-snug">{t('groupExplain')}</p>
      {crop !== 'onion' && <p className="mt-2 text-[15px] text-muted">{t('groupCropNote')}</p>}

      {groupJoined && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="fade-in flex items-center gap-2 rounded-2xl bg-leaf/10 px-3 py-2.5 text-[17px] font-bold text-leaf">
            <Icon name="check" size={22} />
            {t('joined')}
          </div>
          <SecondaryButton
            icon="close"
            onClick={() => {
              setGroupJoined(false)
              showToast(t('toastLeft'))
            }}
          >
            {t('leaveGroup')}
          </SecondaryButton>
        </div>
      )}
    </Screen>
  )
}
