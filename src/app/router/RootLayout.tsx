import { Outlet } from 'react-router-dom'

import { SiteHeader } from '@/widgets/site-header'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
