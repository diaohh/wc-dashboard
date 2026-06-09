import { Outlet } from 'react-router-dom'

import { SiteHeader } from '@/widgets/site-header'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* App-wide ambient World Cup gradient, fixed behind all content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="bg-wc-gold/20 absolute -top-48 -right-40 size-[50rem] rounded-full blur-3xl" />
        <div className="bg-wc-gold/10 absolute top-1/3 -left-48 size-[55rem] rounded-full blur-3xl" />
      </div>

      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
