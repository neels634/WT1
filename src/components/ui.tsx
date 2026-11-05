// Shared building blocks: TopBar, SampleBadge, BottomSheet, Toast, PrimaryButton, Chip, Screen layout.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp, type Role } from '../state/AppState'
import { Icon } from './Icon'

export function SampleBadge({ className = '' }: { className?: string }) {
  const { t } = useApp()
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold-soft px-2.5 py-0.5 text-[13px] font-semibold text-[#8a5d00] ${className}`}
    >
      <Icon name="info" size={14} />
      {t('sampleData')}
    </span>
  )
}

const PARENT: [RegExp, string][] = [
  [/^\/farmer\/mandi\/.+/, '/farmer/prices'],
  [/^\/farmer\/compare/, '/farmer/prices'],
  [/^\/farmer\/sell\/done/, '/farmer'],
  [/^\/farmer\/sell/, '/farmer/compare'],
  [/^\/farmer\/.+/, '/farmer'],
  [/^\/(farmer|mitra|officer)$/, '/'],
]

export function TopBar({ title, farmer = false, wide = false }: { title: string; farmer?: boolean; wide?: boolean }) {
  const { t, toggleLang, showToast } = useApp()
  const navigate = useNavigate()
  const loc = useLocation()
  const [menu, setMenu] = useState(false)

  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate(PARENT.find(([re]) => re.test(loc.pathname))?.[1] ?? '/')
  }

  return (
    <header className="sticky top-0 z-30 bg-forest text-white shadow-md">
      <div className={`mx-auto flex min-h-14 items-center gap-1 px-1.5 py-1 ${wide ? 'max-w-6xl' : ''}`}>
        <button
          onClick={goBack}
          aria-label={t('back')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <Icon name="back" size={26} />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-[19px] leading-tight font-bold">{title}</h1>
        {farmer && (
          <button
            onClick={() => showToast(t('toastVoice'))}
            className="flex h-11 shrink-0 items-center gap-1 rounded-full px-2 hover:bg-white/10"
          >
            <Icon name="speaker" size={22} />
            <span className="hidden text-[14px] font-semibold min-[400px]:inline">{t('listen')}</span>
          </button>
        )}
        <button
          onClick={toggleLang}
          className="h-10 shrink-0 rounded-full border border-white/50 px-3 text-[15px] font-semibold hover:bg-white/10"
        >
          {t('switchLang')}
        </button>
        <button
          onClick={() => setMenu(true)}
          aria-label={t('menu')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <Icon name="menu" size={24} />
        </button>
      </div>
      {menu && <RoleMenu onClose={() => setMenu(false)} />}
    </header>
  )
}

function RoleMenu({ onClose }: { onClose: () => void }) {
  const { t, setRole, reset, showToast } = useApp()
  const navigate = useNavigate()
  const go = (r: Role, path: string) => {
    setRole(r)
    onClose()
    navigate(path)
  }
  return (
    <BottomSheet title={t('switchRole')} onClose={onClose}>
      <div className="flex flex-col gap-2 text-ink">
        <MenuRow icon="farmer" label={t('roleFarmer')} onClick={() => go('farmer', '/farmer')} />
        <MenuRow icon="mitra" label={t('roleMitra')} onClick={() => go('mitra', '/mitra')} />
        <MenuRow icon="officer" label={t('roleOfficer')} onClick={() => go('officer', '/officer')} />
        <MenuRow
          icon="store"
          label={t('home')}
          onClick={() => {
            onClose()
            navigate('/')
          }}
        />
        <MenuRow
          icon="reset"
          label={t('resetDemo')}
          onClick={() => {
            reset()
            onClose()
            navigate('/')
            showToast(t('toastReset'))
          }}
        />
      </div>
    </BottomSheet>
  )
}

function MenuRow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-13 items-center gap-3 rounded-2xl bg-mint px-4 py-2 text-left text-[18px] font-semibold hover:bg-mint-strong"
    >
      <Icon name={icon} className="text-forest" />
      <span className="flex-1">{label}</span>
      <Icon name="chevron" size={20} className="text-muted" />
    </button>
  )
}

export function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const { t } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fade-in absolute inset-0 bg-black/45" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="sheet-in relative max-h-[88vh] w-full max-w-[440px] overflow-y-auto rounded-t-3xl bg-white px-4 pt-3 pb-6 text-ink shadow-2xl outline-none"
      >
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-black/15" />
        <div className="mb-3 flex items-start gap-2">
          <h2 className="flex-1 text-[21px] leading-snug font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-11 shrink-0 items-center gap-1 rounded-full bg-mint px-3 text-[15px] font-semibold"
          >
            <Icon name="close" size={18} />
            {t('close')}
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className="toast-in fixed bottom-24 left-1/2 z-[60] w-[min(92vw,400px)] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-center text-[16px] font-medium text-white shadow-xl"
    >
      {toast.text}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  disabled,
}: {
  children: ReactNode
  onClick: () => void
  icon?: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-forest px-5 py-3 text-[19px] font-bold text-white shadow-lg shadow-forest/25 hover:bg-forest-dark active:scale-[0.99] disabled:opacity-50"
    >
      {icon && <Icon name={icon} size={24} />}
      <span>{children}</span>
    </button>
  )
}

export function SecondaryButton({ children, onClick, icon }: { children: ReactNode; onClick: () => void; icon?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-forest/25 bg-white px-4 py-2 text-[17px] font-semibold text-forest hover:bg-mint"
    >
      {icon && <Icon name={icon} size={22} />}
      <span>{children}</span>
    </button>
  )
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full border-2 px-4 py-1 text-[16px] font-semibold transition-colors ${
        active ? 'border-forest bg-forest text-white' : 'border-forest/20 bg-white text-ink hover:bg-mint'
      }`}
    >
      {children}
    </button>
  )
}

/** Phone-width screen with a sticky primary action at the bottom. */
export function Screen({
  title,
  farmer = false,
  children,
  footer,
}: {
  title: string
  farmer?: boolean
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-white sm:my-0 sm:shadow-2xl">
      <TopBar title={title} farmer={farmer} />
      <main className="screen-in flex-1 px-4 pt-4 pb-6">{children}</main>
      {footer && (
        <div className="sticky bottom-0 z-20 border-t border-black/5 bg-white/95 px-4 pt-3 pb-4 backdrop-blur">{footer}</div>
      )}
    </div>
  )
}

export function useReducedMotion(): boolean {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setR(m.matches)
    m.addEventListener('change', fn)
    return () => m.removeEventListener('change', fn)
  }, [])
  return r
}

/** Counts up to `value` in ~250 ms; jumps straight there when reduced motion is on. */
export function useCountUp(value: number, ms = 250): number {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    if (reduced) {
      setShown(value)
      from.current = value
      return
    }
    const start = performance.now()
    const a = from.current
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      const v = a + (value - a) * (1 - Math.pow(1 - p, 3))
      setShown(v)
      if (p < 1) raf = requestAnimationFrame(step)
      else from.current = value
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      from.current = value
    }
  }, [value, ms, reduced])
  return shown
}
