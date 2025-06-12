import { LivePreviewListener } from '@/components/LivePreviewListener'
import '../(payload)/uno.css'

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <LivePreviewListener />
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
