'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../ui/ui-layout'
import { useRouter } from 'next/navigation'

export default function LotteryInfo() {
  const { publicKey } = useWallet()
  const router = useRouter()

  return publicKey ? (
    <div>
      <AppHero
        title="Instructions"
        subtitle={
          <div>
            <p className="text-xl mb-6">
              🎉 Welcome to this exciting Solana-powered Lottery Game! 🎟️
            </p>
            <p className="text-lg mb-4">
              Buy a ticket and join the fun of this thrilling draw. Once the
              last ticket is sold, a winner is instantly chosen! 🏆
            </p>
            <p className="text-lg mb-4">
              Then, the game resets for a fresh round. If you&apos;re the lucky
              winner, you can claim your reward right away! 💰
            </p>
            <p className="text-sm mt-4 text-gray-500">
              Press <strong>Go to Lottery</strong> to start.
            </p>
            <button
              className="btn btn-primary mt-6"
              onClick={() => router.push('/lottery')}
            >
              Go to Lottery
            </button>
          </div>
        }
      >
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <AppHero
            title="Connect Your Wallet"
            subtitle={
              <div>
                <p className="text-lg mb-6">
                  To join the lottery, please connect your wallet first!
                </p>
                <WalletButton />
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
