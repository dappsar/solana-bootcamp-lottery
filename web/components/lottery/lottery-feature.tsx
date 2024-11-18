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
        title=""
        subtitle={
          <div>
            <p className="text-xl mb-4">
              🎉 Welcome to our exciting Solana-powered Lottery Game! 🎟️
            </p>
            <p className="text-lg mb-4">
              Buy a ticket and join the fun of this thrilling draw. Once the
              last ticket is sold, a winner is instantly chosen! 🏆
            </p>
            <p className="text-lg mb-4">
              Then, the game resets for a fresh round. If you&apos;re the lucky
              winner, you can claim your reward right away! 💰
            </p>
            <p className="text-lg mb-4">
              Join now and see if luck is on your side in the next round. 🍀 Let
              the fun begin! 🎉
            </p>
          </div>
        }
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
