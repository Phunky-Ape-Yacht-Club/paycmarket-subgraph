import { BigInt, store } from "@graphprotocol/graph-ts"
import {
  PAYCMarketplace,
  OwnershipTransferred,
  Paused,
  PaycBidEntered,
  PaycBidWithdrawn,
  PaycBought,
  PaycNoLongerForSale,
  PaycOffered,
  Unpaused
} from "../generated/PAYCMarketplace/PAYCMarketplace"

import {
  Transfer
} from "../generated/PAYC/PAYC"
import { PhunkyApe, Bid, PhunkyApeSale } from "../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toHex();
  let ape = PhunkyApe.load(id)
  if (ape == null) {
    ape = new PhunkyApe(id)
  }
  ape.currentOwner = event.params.to;
  ape.isForSale = false;
  ape.save();
}

export function handlePaused(event: Paused): void {}

export function handlePaycBidEntered(event: PaycBidEntered): void {
  let id = event.params.paycIndex.toString();
  let bid = Bid.load(id)
  if (bid == null) {
    bid = new Bid(id)
  }
  bid.bidAmount = event.transaction.value.toString();
  bid.blockNumber = event.block.number.toString();
  bid.phunkyApe = event.params.paycIndex.toHex()
  bid.from = event.params.fromAddress;
  bid.save()
}

export function handlePaycBidWithdrawn(event: PaycBidWithdrawn): void {
  let id = event.params.paycIndex.toString();
  let bid = Bid.load(id)
  if (bid !== null) {
    store.remove('Bid', id)
  }
}

export function handlePaycBought(event: PaycBought): void {
  let id = event.params.paycIndex.toHex();
  let ape = PhunkyApe.load(id);
  let bid = Bid.load(id)

  // Check for the case where there is a bid from the new owner and refund it.
  // Any other bid can stay in place.
  if (bid !== null && bid.from == event.params.toAddress) {
    store.remove("Bid", id)
  }
  if (ape == null) {
    ape = new PhunkyApe(id);
  }
  let saleId = event.transactionLogIndex.toHex() + event.transaction.hash.toHex()
  let phunkyApeSale = PhunkyApeSale.load(saleId);
  if (phunkyApeSale == null) {
    phunkyApeSale = new PhunkyApeSale(saleId)
  }

  // update ape entity
  ape.isForSale = false;

  // update sale entity
  phunkyApeSale.blockNumber = event.block.number.toString();
  phunkyApeSale.salePrice = event.params.value.toString();
  phunkyApeSale.soldFrom = event.params.fromAddress;
  phunkyApeSale.soldTo = event.params.toAddress;
  phunkyApeSale.phunkyApe = id;
  phunkyApeSale.save()
}

export function handlePaycNoLongerForSale(event: PaycNoLongerForSale): void {
  let id = event.params.paycIndex.toHex();
  let ape = PhunkyApe.load(id);
  if (ape == null) {
    ape = new PhunkyApe(id);
  }
  ape.isForSale = false;
  ape.save();
}

export function handlePaycOffered(event: PaycOffered): void {
  let id = event.params.paycIndex.toHex()
  let ape = PhunkyApe.load(id)
  if (ape == null) {
    ape = new PhunkyApe(id)
  }
  ape.isForSale = true;
  ape.minValue = event.params.minValue.toString()
  ape.blockNumberListedForSale = event.block.number.toString();
  ape.save()
}


export function handleUnpaused(event: Unpaused): void {}
