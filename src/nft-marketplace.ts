
import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemListed as ItemListedEvent,
  ListingCanceled as ListingCanceledEvent
} from "../generated/NftMarketplace/NftMarketplace"

import {ItemListed, ActiveItem, ItemBought, ListingCanceled} from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
  // save that event in our graph
  // update our ActiveItems

  // get or create an itemListed object
  // each item needs a unique id

  // ItemBoughtEvent: Just the raw event
  // ItemBoughtObject: What we save
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams
    (event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(getIdFromEventParams
    (event.params.tokenId, event.params.nftAddress)
  )
  if(!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  if(!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  itemListed.save()
  activeItem.save()
}

export function handleListingCanceled(event: ListingCanceledEvent): void {
  let listingCanceled = ListingCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!listingCanceled) {
    listingCanceled = new ListingCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }
  listingCanceled.seller = event.params.seller
  listingCanceled.nftAddress = event.params.nftAddress
  listingCanceled.tokenId = event.params.tokenId
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  listingCanceled.save()
  activeItem!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}
