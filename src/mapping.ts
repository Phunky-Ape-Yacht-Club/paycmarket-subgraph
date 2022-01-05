import { BigInt } from "@graphprotocol/graph-ts"
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
import { PhunkyApe, Bid } from "../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handlePaused(event: Paused): void {}

export function handlePaycBidEntered(event: PaycBidEntered): void {
  let id = event.transaction.from.toHex() + "-" + event.params.paycIndex.toString();
  let bid = Bid.load(id)
  let ape = PhunkyApe.load(event.params.paycIndex.toHex());
  if (bid == null) {
    bid = new Bid(id)
  }
  if (ape == null) {
    ape = new PhunkyApe(event.params.paycIndex.toHex())
  }

  bid.bidAmount = event.transaction.value.toString();
  bid.blockNumber = event.block.number.toString();
  bid.phunkyApeId = event.params.paycIndex.toString()
  bid.save()
}

export function handlePaycBidWithdrawn(event: PaycBidWithdrawn): void {

}

export function handlePaycBought(event: PaycBought): void {
  let id = event.params.paycIndex.toHex();
  let ape = PhunkyApe.load(id);
  if (ape == null) {
    ape = new PhunkyApe(id)
  }
  ape.isForSale = false;
  ape.currentOwner = event.transaction.from
  ape.blockNumberListedForSale = event.block.number.toString();
  ape.save()
}

export function handlePaycNoLongerForSale(event: PaycNoLongerForSale): void {
  let id = event.params.paycIndex.toHex();
  let ape = PhunkyApe.load(id);
  if (ape == null) {
    ape = new PhunkyApe(id)
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
  ape.currentOwner = event.transaction.from
  ape.save()
}


export function handleUnpaused(event: Unpaused): void {}
