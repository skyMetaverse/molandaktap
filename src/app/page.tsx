'use client'

import ClickButton from '@/components/ClickButton'
import Leaderboard from '@/components/Leaderboard'

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-88px)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="-translate-x-[200px]">
          <ClickButton />
        </div>
      </div>

      <div className="absolute right-[204px] top-[20px] w-[400px] overflow-auto">
        <Leaderboard />
      </div>
    </div>
  )
}
