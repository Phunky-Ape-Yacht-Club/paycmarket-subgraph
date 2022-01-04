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
import { PhunkyApe } from "../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
}

export function handlePaused(event: Paused): void {}

export function handlePaycBidEntered(event: PaycBidEntered): void {}

export function handlePaycBidWithdrawn(event: PaycBidWithdrawn): void {}

export function handlePaycBought(event: PaycBought): void {
  let id = event.params.paycIndex.toHex();
  let ape = PhunkyApe.load(id);
  if (ape == null) {
    ape = new PhunkyApe(id)
  }
  ape.isForSale = false;
  ape.currentOwner = event.transaction.from
  ape.blockNumberListedForSale = event.block.number.toString();
}

export function handlePaycNoLongerForSale(event: PaycNoLongerForSale): void {}

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
