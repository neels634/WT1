// Simple line icons. Always shown with a word beside them, never alone (except the back arrow, which has an aria-label).
const PATHS: Record<string, string> = {
  back: 'M15 18l-6-6 6-6',
  speaker: 'M4 9v6h4l5 4V5L8 9H4zm12.5-1.5a5 5 0 010 9M19 5a9 9 0 010 14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  farmer: 'M12 3l2 3h-4l2-3zM6 9h12l-1 2H7L6 9zm3 3a3 3 0 106 0M5 21c0-3.9 3.1-6 7-6s7 2.1 7 6',
  mitra: 'M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 2.7-5 6-5s6 2 6 5m0-4.6c.6-.3 1.3-.4 2-.4 3.3 0 6 2 6 5',
  officer: 'M4 20V10m5 10V4m5 16v-7m5 7V8M2 20h20',
  prices: 'M3 17l5-5 4 4 8-8M15 8h5v5',
  sell: 'M3 7h18l-2 11H5L3 7zm5 0V5a4 4 0 018 0v2',
  group: 'M7 10a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zM12 14a3 3 0 100-6 3 3 0 000 6zM5 21c0-3 3-5 7-5s7 2 7 5',
  schemes: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4zm-3 9l2 2 4-4',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zm0-8a3 3 0 100-6 3 3 0 000 6z',
  truck: 'M2 6h11v10H2zM13 10h4l4 4v2h-8M6 19a2 2 0 100-4 2 2 0 000 4zm11 0a2 2 0 100-4 2 2 0 000 4z',
  up: 'M12 19V5m-6 6l6-6 6 6',
  down: 'M12 5v14m6-6l-6 6-6-6',
  check: 'M5 12l5 5L20 7',
  whatsapp: 'M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1L4 20zm5-12c0 4 3 7 7 7l1-2-2-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2-2 1z',
  download: 'M12 4v11m-5-5l5 5 5-5M4 20h16',
  message: 'M4 5h16v11H8l-4 4V5z',
  chevron: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  reset: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4',
  info: 'M12 8h.01M11 12h1v5h1M12 21a9 9 0 100-18 9 9 0 000 18z',
  scale: 'M12 4v16M5 20h14M6 8h12M6 8l-3 6a3 3 0 006 0L6 8zm12 0l-3 6a3 3 0 006 0l-3-6z',
  sprout: 'M12 21v-9m0 3c-4 0-7-3-7-8 4 0 7 3 7 8zm0-2c0-4 3-7 7-7 0 4-3 7-7 7z',
  lang: 'M4 5h8M8 3v2m3 0c-1 5-4 8-7 9m2-5c1 2 3 4 6 5m2 6l4-10 4 10m-7-3h6',
  close: 'M6 6l12 12M18 6L6 18',
  store: 'M3 10l9-6 9 6v10H3V10zm6 10v-6h6v6',
}

export function Icon({ name, size = 24, className = '' }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? PATHS.info} />
    </svg>
  )
}
