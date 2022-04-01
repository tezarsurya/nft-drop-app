import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import NFTCard from '../components/NFTCard'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface HomeInterface {
  collections: Collection[]
}

const Home = ({ collections }: HomeInterface) => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="relative flex h-screen flex-col overflow-x-hidden">
      <Head>
        <title>TT NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 z-10 m-0 flex h-20 items-center justify-between border-b-2 border-rose-200 bg-white px-4 shadow-md lg:px-8 2xl:px-40">
        <div className="flex items-center">
          <img
            src="/images/tt-logo.png"
            alt="logo"
            className="w-12 object-contain lg:w-20"
          />
          <h1 className="text-xl font-bold text-gray-600 lg:text-3xl">
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
      <main className="p-6 lg:px-10 2xl:px-48">
        <h2 className="text-lg font-semibold text-gray-600 lg:text-xl">
          Latest Drops
        </h2>
        <div className="mt-4 flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <NFTCard
              key={collection._id}
              title={collection.title}
              description={collection.description}
              slug={collection.slug.current}
              url={urlFor(collection.mainImage).url()}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    slug {
      current,
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}
