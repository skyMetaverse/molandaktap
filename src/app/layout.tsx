import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from '@/components/providers/WagmiProvider'
import CustomConnectButton from '@/components/CustomConnectButton'
import ScoreDisplay from '@/components/ScoreDisplay'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className="overflow-hidden">
        <Providers>
          <div className="h-screen bg-gradient-to-b from-[#200052] via-[#3d2487] to-[#0d0021] flex flex-col">
            <nav className="h-[88px] px-6 flex items-center backdrop-blur-lg bg-[#200052]/20">
              <div className="flex-1">
                <ScoreDisplay />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="text-6xl font-black text-[#ccc4fc] tracking-wider"
                    style={{
                      textShadow: `
                        3px 3px 0 #5FEDDF,
                        -3px -3px 0 #836EF9,
                        0 2px 0 #200052,
                        2px 0 0 #200052,
                        -2px 0 0 #200052,
                        0 -2px 0 #200052
                      `,
                      filter: 'drop-shadow(0 4px 6px rgba(131, 110, 249, 0.3))'
                    }}>
                    MolandakTap
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5FEDDF]/10 via-transparent to-[#836EF9]/10 rounded-xl"></div>
                </div>
              </div>
              <div className="flex-1 flex justify-end">
                <CustomConnectButton />
              </div>
            </nav>
            <main className="px-6 flex-1 relative">
              {children}
            </main>
            <footer className="absolute bottom-0 left-0 right-0 px-6 py-2 text-center text-[#ccc4fc]/60">
              <div className="flex items-center justify-center gap-2">
                <a
                  href="https://github.com/skyMetaverse/molandaktap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ccc4fc] hover:text-white transition-colors"
                  aria-label="View source on GitHub"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    className="fill-current"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <p className="text-sm">
                  Made with ❤️ by{' '}
                  <a
                    href="https://x.com/skyMetaverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5FEDDF] hover:text-[#836EF9] transition-colors duration-300"
                  >
                    syskey
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
