import algosdk from 'algosdk';

// Algorand configuration
const ALGORAND_SERVER = 'https://testnet-api.algonode.cloud';
const ALGORAND_PORT = 443;
const ALGORAND_TOKEN = '';

export const algodClient = new algosdk.Algodv2(ALGORAND_TOKEN, ALGORAND_SERVER, ALGORAND_PORT);

export interface TransactionNFTMetadata {
  transactionId: string;
  buyerAddress: string;
  sellerAddress: string;
  productName: string;
  purchaseAmount: number;
  timestamp: string;
  ethicalScore: number;
  verificationLevel: string;
}

export interface NFTCreationResult {
  assetId: number;
  txId: string;
  nftUrl: string;
  metadata: TransactionNFTMetadata;
}

export class AlgorandNFTService {
  
  /**
   * Create a unique NFT for a transaction between buyer and seller
   */
  static async createTransactionNFT(
    creatorAccount: algosdk.Account,
    metadata: TransactionNFTMetadata
  ): Promise<NFTCreationResult> {
    try {
      // Get suggested transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // Create unique asset name and unit name
      const assetName = `EthicChain-${metadata.transactionId.substring(0, 8)}`;
      const unitName = `ETH-${metadata.transactionId.substring(0, 4)}`;
      
      // Use placeholder for missing addresses
      const buyerAddress = (metadata.buyerAddress && metadata.buyerAddress.trim() !== '') ? metadata.buyerAddress : 'UNIDENTIFIED';
      const sellerAddress = (metadata.sellerAddress && metadata.sellerAddress.trim() !== '') ? metadata.sellerAddress : 'UNIDENTIFIED';
      
      // Create metadata JSON
      const nftMetadata = {
        name: assetName,
        description: `EthicChain Transaction Certificate for purchase from verified merchant`,
        image: `https://ethicchain.app/nft/${metadata.transactionId}`,
        properties: {
          transaction_id: metadata.transactionId,
          buyer: buyerAddress,
          seller: sellerAddress,
          product: metadata.productName,
          amount: metadata.purchaseAmount,
          timestamp: metadata.timestamp,
          ethical_score: metadata.ethicalScore,
          verification_level: metadata.verificationLevel,
          blockchain: 'Algorand',
          certificate_type: 'Transaction Proof'
        },
        external_url: `https://ethicchain.app/transaction/${metadata.transactionId}`
      };
      
      // Upload metadata to IPFS (in production, you'd use a proper IPFS service)
      const metadataUrl = await this.uploadToIPFS(nftMetadata);
      
      // Create asset creation transaction
      const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creatorAccount.addr,
        suggestedParams,
        total: 1, // NFT - only 1 unit
        decimals: 0, // NFT - no decimals
        defaultFrozen: false,
        manager: creatorAccount.addr,
        reserve: creatorAccount.addr,
        freeze: creatorAccount.addr,
        clawback: creatorAccount.addr,
        assetName: assetName,
        unitName: unitName,
        assetURL: metadataUrl,
        assetMetadataHash: new Uint8Array(32), // In production, hash the metadata
      });
      
      // Sign the transaction
      const signedTxn = assetCreateTxn.signTxn(creatorAccount.sk);
      
      // Submit the transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      // Get the asset ID from the confirmed transaction
      const assetId = confirmedTxn['asset-index'];
      
      // Transfer NFT to buyer if buyer address is a valid Algorand address
      if (algosdk.isValidAddress(buyerAddress)) {
        await this.transferNFTToBuyer(creatorAccount, assetId, buyerAddress);
      }
      // else skip transfer
      
      return {
        assetId,
        txId,
        nftUrl: metadataUrl,
        metadata: {
          ...metadata,
          buyerAddress,
          sellerAddress
        }
      };
      
    } catch (error) {
      console.error('Error creating Algorand NFT:', error);
      throw new Error(`Failed to create transaction NFT: ${error.message}`);
    }
  }
  
  /**
   * Transfer the NFT to the buyer's address
   */
  static async transferNFTToBuyer(
    creatorAccount: algosdk.Account,
    assetId: number,
    buyerAddress: string
  ): Promise<string> {
    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      
      // Create asset transfer transaction
      const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: creatorAccount.addr,
        to: buyerAddress,
        assetIndex: assetId,
        amount: 1,
        suggestedParams
      });
      
      // Sign and submit
      const signedTxn = assetTransferTxn.signTxn(creatorAccount.sk);
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      return txId;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw error;
    }
  }
  
  /**
   * Get NFT information by asset ID
   */
  static async getNFTInfo(assetId: number) {
    try {
      const assetInfo = await algodClient.getAssetByID(assetId).do();
      return assetInfo;
    } catch (error) {
      console.error('Error getting NFT info:', error);
      throw error;
    }
  }
  
  /**
   * Verify NFT ownership
   */
  static async verifyNFTOwnership(assetId: number, ownerAddress: string): Promise<boolean> {
    try {
      const accountInfo = await algodClient.accountInformation(ownerAddress).do();
      const asset = accountInfo.assets?.find((a: any) => a['asset-id'] === assetId);
      return asset && asset.amount > 0;
    } catch (error) {
      console.error('Error verifying NFT ownership:', error);
      return false;
    }
  }
  
  /**
   * Upload metadata to IPFS (mock implementation)
   */
  private static async uploadToIPFS(metadata: any): Promise<string> {
    // In production, you would use a service like Pinata, Infura, or Web3.Storage
    // For now, we'll return a mock IPFS URL
    const hash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    return `https://ipfs.io/ipfs/${hash}`;
  }
  
  /**
   * Generate a new Algorand account
   */
  static generateAccount(): algosdk.Account {
    return algosdk.generateAccount();
  }
  
  /**
   * Get account from mnemonic
   */
  static accountFromMnemonic(mnemonic: string): algosdk.Account {
    return algosdk.mnemonicToSecretKey(mnemonic);
  }
}

// Utility functions for transaction NFTs
export const createTransactionCertificate = async (
  buyerWallet: string,
  sellerWallet: string,
  transactionDetails: {
    productName: string;
    amount: number;
    sellerVerificationLevel: string;
    ethicalScore: number;
  }
) => {
  // Generate unique transaction ID
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  // Create metadata
  const metadata: TransactionNFTMetadata = {
    transactionId,
    buyerAddress: buyerWallet,
    sellerAddress: sellerWallet,
    productName: transactionDetails.productName,
    purchaseAmount: transactionDetails.amount,
    timestamp: new Date().toISOString(),
    ethicalScore: transactionDetails.ethicalScore,
    verificationLevel: transactionDetails.sellerVerificationLevel
  };
  
  // In production, you'd have a dedicated service account for minting
  // For demo purposes, we'll generate a temporary account
  const serviceAccount = AlgorandNFTService.generateAccount();
  
  try {
    const result = await AlgorandNFTService.createTransactionNFT(serviceAccount, metadata);
    
    return {
      success: true,
      nftId: result.assetId,
      transactionId: result.txId,
      certificateUrl: result.nftUrl,
      metadata: result.metadata
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};