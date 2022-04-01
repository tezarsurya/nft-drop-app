import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IoHomeOutline } from 'react-icons/io5'

const NFTDropPage = () => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  const router = useRouter()

  const { id } = router.query

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Head>
        <title>TT NFT Drop</title>
      </Head>

      {/* Left */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-700 to-rose-500 py-6 lg:col-span-4 lg:h-screen">
        <div className="rounded-lg bg-gradient-to-br from-yellow-400 to-cyan-700 p-2">
          <div className="relative h-40 w-40 lg:h-80 lg:w-64 xl:h-96 xl:w-72">
            <Image
              src={`/images/${id}.png`}
              layout="fill"
              objectFit="cover"
              priority
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h1 className="text-center text-2xl font-bold capitalize text-white lg:text-3xl">
            {id?.toString().replace(/-/g, ' ')}s
          </h1>
          <h2 className="text-center text-sm text-gray-300 lg:text-base">
            A collection of Apes who live & breathe React
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="flex h-full flex-col px-6 py-4 lg:col-span-6">
        {/* Header */}
        <header>
          <div className="flex items-center justify-between">
            <h1 className="text-sm text-slate-800 lg:text-base">
              The <b>TT</b> NFT Marketplace
            </h1>
            <div className="flex space-x-2">
              <Link href="/">
                <button className="rounded-full bg-gray-200 py-1 px-4 text-sm text-gray-600 transition-all ease-in-out hover:bg-gray-300 active:scale-95 lg:py-2">
                  <IoHomeOutline size={24} />
                </button>
              </Link>
              <button
                onClick={() => (address ? disconnect() : connectWithMetamask())}
                className="rounded-full bg-rose-400 py-1 px-4 text-sm text-white transition-all ease-in-out hover:bg-rose-600 active:scale-95 lg:py-2"
              >
                {address ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
          </div>
          <hr className="my-2 border-b-2 border-b-gray-300" />
          {address && (
            <p className="text-center text-sm text-red-500">
              You're logged in with wallet {address.substring(0, 5)}...
              {address.substring(address.length - 5)}
            </p>
          )}
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col items-center lg:justify-center">
          <div className="relative mt-12 h-72 w-72 rounded-lg border-4 border-rose-400 shadow-lg shadow-rose-300 lg:h-36 lg:w-80">
            <Image
              src="https://links.papareact.com/bdy"
              layout="fill"
              objectFit="cover"
              priority
              className="rounded-lg"
            />
          </div>
          <h1 className="my-4 text-center text-xl font-bold text-slate-800 lg:text-3xl">
            TT Ape Coding Club | NFT Drop
          </h1>
          <p className="text-sm text-green-500">13 / 21 NFT's claimed</p>
        </main>

        {/* Button */}
        <footer className="flex">
          <button className="mt-12 w-full rounded-full bg-rose-500 py-4 font-bold text-white transition-all ease-in-out hover:bg-rose-700 active:scale-95">
            Mint NFT (0.01 ETH)
          </button>
        </footer>
      </div>
    </div>
  )
}

export default NFTDropPage
