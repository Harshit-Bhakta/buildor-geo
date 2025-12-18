import { Inter } from 'next/font/google'
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Coding Task - GeoBuildor',
  description: 'Interactive coding environment for geospatial learning',
}

export default function CodingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <Providers>
        {children}
      </Providers>
    </div>
  )
}