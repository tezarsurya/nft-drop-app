import { NFTMetadataOwner } from '@thirdweb-dev/sdk'

interface InventoryInterface {
  items: NFTMetadataOwner[] | undefined
  loading: boolean
}

const Inventory = ({ items, loading }: InventoryInterface) => {
  return (
    <main className="flex h-full flex-col items-center py-4">
      {loading ? (
        <img
          src="/images/loader.gif"
          alt=""
          className="my-4 h-48 w-48 object-contain lg:h-72 lg:w-72"
        />
      ) : !items ? (
        <div>No items</div>
      ) : items?.length === 0 ? (
        <div>No items</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid md:grid-cols-3 2xl:grid-cols-4">
          {items.map(({ metadata, owner }) => (
            <img
              key={[metadata.id].toString()}
              src={metadata.image}
              alt={metadata.description}
              className="h-64 w-64 rounded-lg object-cover 2xl:h-72 2xl:w-72"
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default Inventory
