import BN from "bn.js";
import { Bitstream } from "../bitstream";
import { Constants } from "../constants";
import { fromFloat } from "../float";
import { BlockContext, ExchangeState } from "../types";

interface Transfer {
  accountFromID?: number;
  accountToID?: number;
  tokenID?: number;
  amount?: BN;
  feeTokenID?: number;
  fee?: BN;
  validUntil?: number;
  storageID?: number;
  from?: string;
  to?: string;
  data?: string;
}

/**
 * Processes transfer requests.
 */
export class TransferProcessor {
  public static process(
    state: ExchangeState,
    block: BlockContext,
    txData: Bitstream
  ) {
    const transfer = this.extractData(txData);

    const from = state.getAccount(transfer.accountFromID);
    const to = state.getAccount(transfer.accountToID);
    if (transfer.to !== Constants.zeroAddress) {
      to.owner = transfer.to;
    }

    from.getBalance(transfer.tokenID).balance.isub(transfer.amount);
    to.getBalance(transfer.tokenID).balance.iadd(transfer.amount);

    from.getBalance(transfer.feeTokenID).balance.isub(transfer.fee);

    // Nonce
    const storage = from
      .getStorage(transfer.storageID);
    storage.storageID = transfer.storageID;
    storage.data = new BN(1);

    const operator = state.getAccount(block.operatorAccountID);
    operator.getBalance(transfer.feeTokenID).balance.iadd(transfer.fee);

    return transfer;
  }

  public static extractData(dataIn: Bitstream) {
    const transfer: Transfer = {};

    let dataInString = dataIn.getData();
    let data = new Bitstream(dataInString.slice(3));

    let offset = 0;

    // Check that this is a conditional update
    const transferType = data.extractUint8(offset);
    offset += 1;

    transfer.accountFromID = data.extractUint32(offset);
    offset += 4;
    transfer.accountToID = data.extractUint32(offset);
    offset += 4;

    transfer.tokenID = data.extractUint32(offset);
    offset += 4;
    transfer.amount = fromFloat(
      data.extractUint32(offset),
      Constants.Float32Encoding
    );
    offset += 4;

    transfer.feeTokenID = data.extractUint32(offset);
    offset += 4;
    transfer.fee = fromFloat(
      data.extractUint16(offset),
      Constants.Float16Encoding
    );
    offset += 2;
    transfer.storageID = data.extractUint32(offset);
    offset += 4;
    transfer.to = data.extractAddress(offset);
    offset += 20;
    transfer.from = data.extractAddress(offset);
    offset += 20;

    return transfer;
  }
}
