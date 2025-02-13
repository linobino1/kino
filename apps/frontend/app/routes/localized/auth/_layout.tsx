import { Outlet } from 'react-router'

export const handle = { i18n: 'auth' }

export default function Auth() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center pb-[23vh]">
      <main className="flex w-fit flex-col items-center gap-4 bg-white p-16 text-black">
        <Outlet />
      </main>
    </div>
  )
}
