'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../ui/ui-layout'
import { LotteryCreate } from './lottery-ui'

export default function LotteryFeature() {
  const { publicKey } = useWallet()

  return publicKey ? (
    <div>
      <AppHero
        title="Lottery"
        subtitle=""
      >
        <LotteryCreate />
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
