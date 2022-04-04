import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { NFTMetadataOwner } from '@thirdweb-dev/sdk'
import { BigNumber } from 'ethers'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { IoHomeOutline } from 'react-icons/io5'
import Inventory from '../../components/Inventory'
import Tab from '../../components/Tabs'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'

interface NFTPageInterface {
  collection: Collection
}

const NFTDropPage = ({ collection }: NFTPageInterface) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setLoading] = useState<boolean>(true)
  const [price, setPrice] = useState<string>()
  const [maxQuantity, setMaxQuantity] = useState<BigNumber>()
  const [quantity, setQuantity] = useState<number>(1)
  const [quantityMaxError, setQuantityMaxError] = useState<boolean>(false)
  const [quantityMinError, setQuantityMinError] = useState<boolean>(false)
  const [priceEach, setPriceEach] = useState<string>()
  const [inventory, setInventory] = useState<NFTMetadataOwner[]>()
  const [remainingSupply, setRemainingSupply] = useState<number>()
  const [mintPage, setMintPage] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)

  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!priceEach) return
    setPrice((quantity * parseFloat(priceEach)).toString())
  })

  useEffect(() => {
    if (!maxQuantity) return

    setQuantityMaxError(false)
    setQuantityMinError(false)

    if (quantity > maxQuantity?.toNumber()) setQuantityMaxError(true)

    if (quantity < 1) setQuantityMinError(true)
  }, [quantity])

  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      const claimCond = await nftDrop.claimConditions.getActive()
      const maxQ = claimCond.quantityLimitPerTransaction

      setPrice(claimCond.currencyMetadata.displayValue)
      setPriceEach(claimCond.currencyMetadata.displayValue)
      setMaxQuantity(maxQ)
    }

    fetchPrice()
  }, [nftDrop])

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      const ownedNFTs = claimed.filter((nft) => nft.owner === address)

      setInventory(ownedNFTs)
      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  useEffect(() => {
    if (!totalSupply) return

    setRemainingSupply(totalSupply.toNumber() - claimedSupply)
  }, [claimedSupply, totalSupply])

  const mintNFT = () => {
    if (!nftDrop || !address) return

    setLoading(true)

    toast.loading('Minting...', {
      id: 'mint_loading',
    })

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        // const data = await tx[0].data()
        // const id = tx[0].id
        // const receipt = tx[0].receipt

        toast.dismiss('mint_loading')
        toast.success('Mint Success')
      })
      .catch((error) => {
        toast.dismiss('mint_loading')
        toast.error('Oops! Transaction failed / denied')
      })
      .finally(async () => {
        const claimed = await nftDrop.getAllClaimed()
        const supply = await nftDrop.totalSupply()

        setClaimedSupply(claimed.length)
        setTotalSupply(supply)
        setRemainingSupply(supply.toNumber() - claimed.length)
        const ownedNFTs = claimed.filter((nft) => nft.owner === address)

        setInventory(ownedNFTs)
        setLoading(false)
      })
  }

  const handleQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.currentTarget.value))

    if (!priceEach) return

    if (e.currentTarget.value == '') {
      setQuantity(0)
      return setPrice(priceEach)
    }

    setPrice(
      (parseFloat(e.currentTarget.value) * parseFloat(priceEach)).toString()
    )
  }

  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-10">
      <Head>
        <title>TT NFT Drop</title>
      </Head>

      {/* Left */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-700 to-rose-500 py-4 lg:col-span-4 lg:h-full lg:justify-start">
        <div className="mb-6 flex w-full px-6 lg:mb-0 lg:justify-end">
          <Link href="/">
            <button className="rounded-full bg-gray-100 bg-opacity-25 py-1 px-4 text-sm text-gray-600 transition-all ease-in-out hover:bg-gray-200 active:scale-95 lg:py-2">
              <IoHomeOutline size={24} />
            </button>
          </Link>
        </div>
        <div
          className={`flex flex-col items-center justify-center ${
            mintPage ? 'lg:h-full' : 'lg:h-screen'
          }`}
        >
          <div className="rounded-lg bg-gradient-to-br from-yellow-400 to-cyan-700 p-2">
            <div className="relative h-40 w-40 lg:h-80 lg:w-64 xl:h-96 xl:w-72">
              <Image
                src={urlFor(collection.previewImage).url()}
                layout="fill"
                objectFit="cover"
                priority
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h1 className="text-center text-2xl font-bold capitalize text-white lg:text-3xl">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-center text-sm text-gray-300 lg:text-base">
              {collection.description}
            </h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex min-h-full flex-col px-6 py-4 lg:col-span-6">
        {/* Header */}
        <header>
          <div className="relative flex items-center justify-end">
            {/* <h1 className="text-sm text-slate-800 lg:text-base">
              The <b>TT</b> NFT Marketplace
            </h1> */}
            <div className="absolute left-0 bottom-0 flex">
              <Tab
                onClick={() => setMintPage(true)}
                disabled={loading}
                text={`Mint (${loading ? '...' : remainingSupply})`}
                active={mintPage}
              />
              <Tab
                onClick={() => setMintPage(false)}
                disabled={loading}
                text={`Inventory (${loading ? '...' : inventory?.length})`}
                active={!mintPage}
              />
            </div>
            <div className="flex">
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
        {mintPage ? (
          <>
            <main className="flex flex-1 flex-col items-center lg:justify-center">
              <div className="relative mt-12 h-72 w-72 rounded-lg border-4 border-rose-400 shadow-lg shadow-rose-300 lg:h-36 lg:w-80">
                <Image
                  src={urlFor(collection.mainImage).url()}
                  layout="fill"
                  objectFit="cover"
                  priority
                  className="rounded-lg"
                />
              </div>
              <h1 className="my-4 text-center text-xl font-bold text-slate-800 lg:text-3xl">
                {collection.title}
              </h1>
              {loading ? (
                <p className="animate-pulse text-sm text-green-500">
                  Loading supply count...
                </p>
              ) : (
                <p className="text-sm text-green-500">
                  {claimedSupply} / {totalSupply?.toString()} NFT's claimed
                </p>
              )}

              {loading && (
                <img
                  src="/images/loader.gif"
                  alt=""
                  className="my-4 h-48 w-48 object-contain lg:h-24 lg:w-24"
                />
              )}
            </main>

            {/* Button */}
            <div className="mt-12 mb-2 flex items-center space-x-2 lg:mb-0">
              <div className="relative w-24">
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantity}
                  className="w-full rounded-xl border-2 border-rose-400 p-4 focus:outline-none"
                />
                <div className="absolute top-0 right-0 bottom-0 flex flex-col">
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity === maxQuantity?.toNumber()}
                    className="rounded-tr-xl border-t-2 border-r-2 border-l border-rose-400 border-l-gray-300 bg-gray-200 px-2 text-xl font-bold text-gray-700 transition-all ease-in-out hover:bg-gray-300 active:scale-95 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="rounded-br-xl border-b-2 border-r-2 border-l border-rose-400 border-l-gray-300 bg-gray-200 px-2 text-xl font-bold text-gray-700 transition-all ease-in-out hover:bg-gray-300 active:scale-95 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                </div>
              </div>

              <button
                onClick={mintNFT}
                disabled={
                  loading ||
                  claimedSupply === totalSupply?.toNumber() ||
                  !address ||
                  quantityMaxError ||
                  quantityMinError
                }
                className="w-full rounded-full bg-rose-500 py-4 font-bold text-white transition-all ease-in-out hover:bg-rose-700 active:scale-95 disabled:bg-gray-400"
              >
                {loading ? (
                  'Loading'
                ) : claimedSupply === totalSupply?.toNumber() ? (
                  'SOLD OUT'
                ) : !address ? (
                  'Sign in to Mint'
                ) : quantityMaxError ? (
                  `Maximum quantity per transaction is ${maxQuantity}`
                ) : quantityMinError ? (
                  `Minimum quantity per transaction is 1`
                ) : (
                  <span>Mint NFT ({price} ETH)</span>
                )}
              </button>
            </div>
          </>
        ) : (
          <Inventory items={inventory} loading={loading} />
        )}

        <Toaster
          position="bottom-left"
          toastOptions={{
            success: {
              duration: 3000,
            },
          }}
        />
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset,
    },
    previewImage {
      asset,
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
