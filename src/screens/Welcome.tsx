// Screen 1: language and role.
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useApp, type Role } from '../state/AppState'

export default function Welcome() {
  const { t, lang, setLang, setRole, reset, showToast } = useApp()
  const navigate = useNavigate()

  const pick = (r: Role, path: string) => {
    setRole(r)
    navigate(path)
  }

  const roles: { r: Role; path: string; icon: string; title: string; desc: string }[] = [
    { r: 'farmer', path: '/farmer', icon: 'farmer', title: t('roleFarmer'), desc: t('roleFarmerDesc') },
    { r: 'mitra', path: '/mitra', icon: 'mitra', title: t('roleMitra'), desc: t('roleMitraDesc') },
    { r: 'officer', path: '/officer', icon: 'officer', title: t('roleOfficer'), desc: t('roleOfficerDesc') },
  ]

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-white sm:shadow-2xl">
      <div className="relative overflow-hidden bg-forest px-5 pt-8 pb-10 text-white">
        {/* field rows */}
        <svg className="pointer-events-none absolute -right-10 -bottom-6 opacity-15" width="260" height="160" viewBox="0 0 260 160" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M0 ${150 - i * 22} Q130 ${110 - i * 22} 260 ${150 - i * 22}`} stroke="#E8A317" strokeWidth="6" fill="none" />
          ))}
        </svg>
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-2 ring-gold/70">
            <Icon name="sprout" size={34} className="text-gold" />
          </div>
          <div>
            <div className="text-[28px] leading-tight font-extrabold">{t('appName')}</div>
            <div className="text-[15px] text-white/80">{lang === 'en' ? 'शेत समृद्धी' : 'Shet Samruddhi'}</div>
          </div>
        </div>
        <p className="relative mt-5 text-[20px] leading-snug font-semibold text-white/95">{t('pitch')}</p>
      </div>

      <main className="screen-in -mt-5 flex-1 rounded-t-3xl bg-white px-4 pt-5 pb-6">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-muted">
          <Icon name="lang" size={20} />
          {t('chooseLang')}
        </div>
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-mint p-1.5">
          {(['mr', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`min-h-12 rounded-xl text-[18px] font-bold transition-colors ${
                lang === l ? 'bg-forest text-white shadow' : 'text-ink hover:bg-white/70'
              }`}
            >
              {l === 'mr' ? 'मराठी' : 'English'}
            </button>
          ))}
        </div>

        <h2 className="mb-3 text-[21px] font-bold">{t('welcomeChoose')}</h2>
        <div className="flex flex-col gap-3">
          {roles.map((x, i) => (
            <button
              key={x.r}
              onClick={() => pick(x.r, x.path)}
              className={`flex items-center gap-4 rounded-3xl border-2 p-4 text-left transition-colors ${
                i === 0 ? 'border-forest bg-mint hover:bg-mint-strong' : 'border-forest/15 bg-white hover:bg-mint'
              }`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${i === 0 ? 'bg-forest text-gold' : 'bg-mint text-forest'}`}>
                <Icon name={x.icon} size={30} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[20px] leading-tight font-bold">{x.title}</div>
                <div className="text-[16px] text-muted">{x.desc}</div>
              </div>
              <Icon name="chevron" className="shrink-0 text-forest" />
            </button>
          ))}
        </div>

        <p className="mt-6 rounded-2xl bg-gold-soft px-4 py-3 text-[15px] leading-snug text-[#6b4a00]">{t('honesty')}</p>

        <button
          onClick={() => {
            reset()
            showToast(t('toastReset'))
          }}
          className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-full px-4 text-[16px] font-semibold text-muted hover:bg-mint"
        >
          <Icon name="reset" size={20} />
          {t('resetDemo')}
        </button>
      </main>
    </div>
  )
}
