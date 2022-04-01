import Image from 'next/image'
import Link from 'next/link'

interface NFTCardInterface {
  title: string
  description: string
  slug: string
  url: string
}

const NFTCard = ({ title, description, slug, url }: NFTCardInterface) => {
  return (
    <Link href={`/nft/${slug}`}>
      <div className="flex h-96 cursor-pointer flex-col rounded-lg border-2 transition-all ease-in-out hover:shadow-md hover:shadow-rose-300">
        <div className="relative h-3/4 w-full">
          <Image
            src={url}
            layout="fill"
            alt={title}
            objectFit="cover"
            priority
            className="rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <p className="text-gray-700 line-clamp-3">{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default NFTCard
