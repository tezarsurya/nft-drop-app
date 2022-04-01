import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import NFTCard from '../components/NFTCard'

const Home: NextPage = () => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="relative flex h-screen flex-col overflow-x-hidden">
      <Head>
        <title>TT NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 z-10 m-0 flex h-20 items-center justify-between border-b-2 border-rose-200 bg-white px-4 shadow-md lg:px-8">
        <div className="flex items-center">
          <img
            src="/images/tt-logo.png"
            alt="logo"
            className="w-16 object-contain lg:w-20"
          />
          <h1 className="text-2xl font-bold text-gray-600 lg:text-3xl">
            NFT Drop
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 py-1 px-4 text-sm text-white transition-all ease-in-out hover:bg-rose-600 active:scale-95 lg:py-2"
          >
            {address
              ? `${address.substring(0, 5)}...
              ${address.substring(address.length - 5)}`
              : 'Connect Wallet'}
          </button>
        </div>
      </header>
      <main className="p-6 lg:px-10">
        <h2 className="text-lg font-semibold text-gray-600 lg:text-xl">
          Latest Drops
        </h2>
        <div className="md: mt-4 flex grid-cols-2 flex-col gap-8 md:grid lg:grid-cols-3 lg:space-y-0">
          <NFTCard
            title="Gold Apes"
            id="gold-ape"
            description="A collection of Apes who live & breathe React"
          />
          <NFTCard
            title="Pink Apes"
            id="pink-ape"
            description="A collection of Apes who live & breathe React"
          />
          <NFTCard
            title="Bunny Apes"
            id="bunny-ape"
            description="A collection of Apes who live & breathe React"
          />
          <NFTCard
            title="Cowboy Apes"
            id="cowboy-ape"
            description="A collection of Apes who live & breathe React"
          />
          <NFTCard
            title="Captain Apes"
            id="captain-ape"
            description="A collection of Apes who live & breathe React"
          />
          <NFTCard
            title="Party Apes"
            id="party-ape"
            description="A collection of Apes who live & breathe React"
          />
        </div>
      </main>
    </div>
  )
}

export default Home
