import BN from "bn.js";
import { Constants } from "./constants";
import { SparseMerkleTree } from "./sparse_merkle_tree";

/**
 * The block type.
 */
export enum BlockType {
  UNIVERSAL = 0
}

/**
 * The transaction type.
 */
export enum TransactionType {
  NOOP = 0,
  TRANSFER,
  SPOT_TRADE,
  ORDER_CANCEL,
  APPKEY_UPDATE,
  BATCH_SPOT_TRADE,
  DEPOSIT,
  ACCOUNT_UPDATE,
  WITHDRAWAL
}

/**
 * The method in which an exchange is created.
 */
export enum ForgeMode {
  AUTO_UPGRADABLE = 0,
  MANUAL_UPGRADABLE,
  PROXIED,
  NATIVE
}

/**
 * A Loopring block.
 */
export interface Block {
  /** The exchange the block was committed on. */
  exchange: string;
  /** The block index of the block. */
  blockIdx: number;

  /** The type of requests handled in the block. */
  blockType: number;
  /** The block size (in number of requests). */
  blockSize: number;
  /** The block version. */
  blockVersion: number;
  /** The data for the block. */
  data: string;
  /** The custom data for the block. */
  offchainData: string;

  /** The operator when the block was committed (msg.sender). */
  operator: string;
  /** The sender of the block (tx.origin). Can be different from `operator` when an operator contract is used. */
  origin: string;

  /** The block fee received for this block (in ETH). */
  blockFee: BN;

  /** The Merkle root of the Merkle tree after doing all requests in the block. */
  merkleRoot: string;

  /** The Merkle root of the Merkle Asset tree after doing all requests in the block. */
  merkleAssetRoot: string;

  /** The time the block was submitted. */
  timestamp: number;

  /** The number of requests processed in this block. For on-chain request blocks this can differ from `blockSize`. */
  numRequestsProcessed: number;

  /** The total number of requests that were processed up to, and including, this block. */
  totalNumRequestsProcessed: number;

  /** The Ethereum transaction in which this block was committed. */
  transactionHash: string;
}

/**
 * A token registered on an exchange.
 */
export interface Token {
  /** The exchange of the token. */
  exchange: string;
  /** The tokenID of the token. */
  tokenID: number;
  /** The address of the token contract. */
  address: string;
  /** Whether deposits are enabled/disabled for this token. */
  enabled: boolean;
}

/**
 * A deposit on an exchange.
 */
export interface Deposit {
  /** The exchange this deposit is on. */
  exchange: string;
  /** If the request was processed: The block this deposit was pocessed in. */
  blockIdx?: number;
  /** If the request was processed: The request index of this deposit in the processed requests list. */
  requestIdx?: number;

  /** The time this deposit was done on-chain. */
  timestamp: number;

  /** The account this deposit is for. */
  owner: string;
  /** The token that was deposited. */
  token: number;
  /** The amount that was deposited. */
  amount: BN;
  /** The fee paid for the deposit. */
  fee: BN;

  /** The Ethereum transaction in which this deposit was done. */
  transactionHash: string;
}

/**
 * An on-chain withdrawal request on an exchange.
 */
export interface OnchainWithdrawal {
  /** The exchange this on-chain withdrawal is on. */
  exchange: string;
  /** If the request was processed: The block this on-chain withdrawal was pocessed in. */
  blockIdx?: number;
  /** If the request was processed: The request index of this on-chain withdrawal in the processed requests list (@see getProcessedRequest). */
  requestIdx?: number;

  /** The on-chain withdrawal index (in the queue on-chain, @see getDeposit). */
  withdrawalIdx: number;
  /** The time this on-chain withdrawal was done on-chain. */
  timestamp: number;

  /** The account this on-chain withdrawal is for. */
  accountID: number;
  /** The token that is being withdrawn. */
  tokenID: number;
  /** The amount that was requested to be withdrawn. */
  amountRequested: BN;
  /** If the request was processed: The amount that was actually withdrawn. */
  amountWithdrawn?: BN;

  /** The Ethereum transaction in which this on-chain withdrawal was done. */
  transactionHash: string;
}

/**
 * Trading data for a ring-settlement.
 */
export interface SpotTrade {
  /** The exchange the trade was made on. */
  exchange: string;
  /** The block this trade was pocessed in. */
  blockIdx: number;
  /** The request index of this trade in the processed requests list (@see getProcessedRequest). */
  requestIdx: number;

  /** The account of the taker. */
  accountIdA: number;
  /** The orderID of the taker order. */
  orderIdA: number;
  /** Whether the taker order is a buy or sell order. */
  fillAmountBorSA: boolean;
  /** The token the taker order sells. */
  tokenA: number;
  /** The amount of tokens (in tokenS) the taker sells. */
  fillSA: BN;
  /** The fee (in tokenB) paid by the taker. */
  feeA: BN;
  /** The protocol fee that needs to be paid by the operator for the taker. */
  protocolFeeA: BN;

  /** The account of the maker. */
  accountIdB: number;
  /** The orderID of the maker order. */
  orderIdB: number;
  /** Whether the maker order is a buy or sell order. */
  fillAmountBorSB: boolean;
  /** The token the maker order sells. */
  tokenB: number;
  /** The amount of tokens (in tokenS) the maker sells. */
  fillSB: BN;
  /** The fee (in tokenB) paid by the maker. */
  feeB: BN;
  /** The protocol fee that needs to be paid by the operator for the maker. */
  protocolFeeB: BN;
}

/**
 * Off-chain withdrawal data.
 */
export interface OffchainWithdrawal {
  /** The exchange the off-chain withdrawal request was made on. */
  exchange: string;
  /** The block this off-chain withdrawal request was pocessed in. */
  blockIdx: number;
  /** The request index of this off-chain withdrawal in the processed requests list (@see getProcessedRequest). */
  requestIdx: number;

  /** The account this withdrawal is for. */
  accountID: number;
  /** The token that is being withdrawn. */
  tokenID: number;
  /** The amount that was actually withdrawn. */
  amountWithdrawn: BN;
  /** The token the fee to the operator is paid in. */
  feeTokenID: number;
  /** The fee paid to the operator. */
  fee: BN;
}

/**
 * Order cancellation data.
 */
export interface OrderCancellation {
  /** The exchange the order cancellation request was made on. */
  exchange: string;
  /** The block this order cancellation request was pocessed in. */
  blockIdx: number;
  /** The request index of this oorder cancellation in the processed requests list (@see getProcessedRequest). */
  requestIdx: number;

  /** The account this order cancellation is for. */
  accountID: number;
  /** The tokenS of the order that is being cancelled. */
  orderTokenID: number;
  /** The orderID of the order that is being cancelled. */
  orderID: number;
  /** The token the fee to the operator is paid in. */
  feeTokenID: number;
  /** The fee paid to the operator. */
  fee: BN;
}

/**
 * Internal transfer data.
 */
export interface InternalTransfer {
  /** The exchange the internal transfer request was made on. */
  exchange: string;
  /** The block this internal transfer request was pocessed in. */
  blockIdx: number;
  /** The request index of this internal transfer in the processed requests list (@see getProcessedRequest). */
  requestIdx: number;

  /** The 'from' account for this internal transfer. */
  fromAccountID: number;
  /** The 'to' account for this internal transfer. */
  toAccountID: number;
  /** The token that is being transferred. */
  tokenID: number;
  /** The amount that was actually withdrawn. */
  amount: BN;
  /** The token the fee to the operator is paid in. */
  feeTokenID: number;
  /** The fee paid to the operator. */
  fee: BN;
  /** The type of the transfer. */
  type: number;
}

/**
 * Trade history data.
 */
export interface Storage {
  /** The data field. */
  data: BN;
  /** The storageID of the data that is currently stored for. */
  storageID: number;
}

/**
 * Balance data.
 */
export interface Balance {
  /** How amount of tokens the account owner has for a token. */
  balance: BN;
}

/**
 * Account data.
 */
export interface Account {
  /** The exchange the account is on. */
  exchange: string;
  /** The account ID of the account. */
  accountId: number;

  /** The owner of the account. */
  owner: string;
  /** The EdDSA public key X of the account (used for signing off-chain messages). */
  publicKeyX: string;
  /** The EdDSA public key Y of the account (used for signing off-chain messages). */
  publicKeyY: string;
  /** The nonce value of the account. */
  nonce: number;

  balancesMerkleTree?: SparseMerkleTree;
}

/**
 * The protocol fees that need to be paid for trades.
 */
export interface ProtocolFees {
  /** The exchange with these fees. */
  exchange: string;

  /** The fee charged (in bips of amount bought) for orders. */
  protocolFeeBips: number;

  /** The previous fee charged (in bips of amount bought) for orders. */
  previousProtocolFeeBips: number;
}

/**
 * The data needed to withdraw from the Merkle tree on-chain (@see getWithdrawFromMerkleTreeData)
 */
export interface OnchainAccountLeaf {
  /** The ID of the account. */
  accountID: number;
  /** The owner of the account. */
  owner: string;
  /** The public key X of the account. */
  pubKeyX: string;
  /** The public key Y of the account. */
  pubKeyY: string;
  /** The current nonce value of the account. */
  nonce: number;
  // storageRoot: string;
}
export interface OnchainBalanceLeaf {
  /** The ID of the token. */
  tokenID: number;
  /** The current balance the account has for the requested token. */
  balance: string;
}
export interface WithdrawFromMerkleTreeData {
  /** The account leaf. */
  accountLeaf: OnchainAccountLeaf;
  /** The balance leaf. */
  balanceLeaf: OnchainBalanceLeaf;
  /** The Merkle proof for the account leaf. */
  accountMerkleProof: string[];
  /** The Merkle proof for the balance leaf. */
  balanceMerkleProof: string[];
}

/**
 * The keypair data for EdDSA.
 */
export interface KeyPair {
  /** The public key X. */
  publicKeyX: string;
  /** The public key Y. */
  publicKeyY: string;
  /** The private key. */
  secretKey: string;
}

/**
 * The signature data for EdDSA.
 */
export interface Signature {
  Rx: string;
  Ry: string;
  s: string;
}

/// Private

export class StorageLeaf implements Storage {
  data: BN;
  storageID: number;
  gasFee: number;
  cancelled: number;
  tokenSID: number;
  tokenBID: number;
  forward: number;

  constructor() {
    this.data = new BN(0);
    this.storageID = 0;
    this.gasFee = 0;
    this.cancelled = 0;
    this.tokenSID = 0;
    this.tokenBID = 0;
    this.forward = 1; // default 1?
  }
}

export class BalanceLeaf implements Balance {
  balance: BN;

  constructor() {
    this.balance = new BN(0);
  }

  public init(
    balance: BN
  ) {
    this.balance = new BN(balance.toString(10));
  }

}

export class AccountLeaf implements Account {
  exchange: string;
  accountId: number;

  owner: string;
  publicKeyX: string;
  publicKeyY: string;
  appKeyPublicKeyX: string;
  appKeyPublicKeyY: string;

  disableAppKeySpotTrade: number;
  disableAppKeyWithdraw: number;
  disableAppKeyTransferToOther: number;

  nonce: number;
  balances: { [key: number]: BalanceLeaf };

  balancesMerkleTree?: SparseMerkleTree;

  storage: { [key: number]: StorageLeaf };

  storageTree?: SparseMerkleTree;

  constructor(accountId: number) {
    this.exchange = Constants.zeroAddress;
    this.accountId = accountId;
    this.owner = Constants.zeroAddress;
    this.publicKeyX = "0";
    this.publicKeyY = "0";
    this.appKeyPublicKeyX = "0";
    this.appKeyPublicKeyY = "0";
    this.disableAppKeySpotTrade = 0;
    this.disableAppKeyWithdraw = 0;
    this.disableAppKeyTransferToOther = 0;
    this.nonce = 0;
    this.balances = {};
    this.storage = {};
  }

  public init(
    owner: string,
    publicKeyX: string,
    publicKeyY: string,
    appKeyPublicKeyX: string,
    appKeyPublicKeyY: string,
    nonce: number,
    balances: { [key: number]: BalanceLeaf } = {},
    storage: { [key: number]: StorageLeaf } = {}
  ) {
    this.exchange = Constants.zeroAddress;
    this.accountId = 0;
    this.owner = owner;
    this.publicKeyX = publicKeyX;
    this.publicKeyY = publicKeyY;
    this.appKeyPublicKeyX = appKeyPublicKeyX;
    this.appKeyPublicKeyY = appKeyPublicKeyY;
    this.nonce = nonce;
    this.balances = balances;
    this.storage = storage;
  }

  public getBalance(tokenID: number) {
    if (this.balances[tokenID] === undefined) {
      this.balances[tokenID] = new BalanceLeaf();
    }
    return this.balances[tokenID];
  }

  public getStorage(storageID: number) {
    const address = storageID % 2 ** Constants.BINARY_TREE_DEPTH_STORAGE;
    if (this.storage[address] === undefined) {
      this.storage[address] = new StorageLeaf();
    }
    return this.storage[address];
  }
}

export class ExchangeState {
  exchange: string;
  accounts: AccountLeaf[];

  constructor(exchange: string, accounts: AccountLeaf[] = []) {
    this.exchange = exchange;
    this.accounts = accounts;

    this.accountIdToOwner = {};
    this.ownerToAccountId = {};

    this.deposits = [];
    this.onchainWithdrawals = [];

    this.processedRequests = [];

    // Create the protocol fee pool accounts
    this.getAccount(0);
  }

  public getAccount(accountID: number) {
    while (accountID >= this.accounts.length) {
      this.accounts.push(new AccountLeaf(this.accounts.length));
    }
    return this.accounts[accountID];
  }

  accountIdToOwner: { [key: number]: string };
  ownerToAccountId: { [key: string]: number };

  deposits: Deposit[];
  onchainWithdrawals: OnchainWithdrawal[];

  processedRequests: any[];
}

export interface BlockContext {
  protocolFeeBips: number;
  operatorAccountID: number;
}
