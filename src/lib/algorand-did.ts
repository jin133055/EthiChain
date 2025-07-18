import algosdk from 'algosdk';

// Algorand configuration for DID creation
const ALGORAND_SERVER = 'https://testnet-api.algonode.cloud';
const ALGORAND_PORT = 443;
const ALGORAND_TOKEN = '';

export const algodClient = new algosdk.Algodv2(ALGORAND_TOKEN, ALGORAND_SERVER, ALGORAND_PORT);

export interface BusinessDIDMetadata {
  businessName: string;
  businessType?: string;
  registrationNumber?: string;
  website?: string;
  verificationLevel?: string;
  createdAt: string;
  ethicChainId: string;
}

export interface DIDCreationResult {
  did: string;
  transactionId: string;
  assetId: number;
  metadata: BusinessDIDMetadata;
  algorandAddress: string;
}

export class AlgorandDIDService {
  
  /**
   * Create a unique DID for a business (mock implementation for demo)
   */
  static async createBusinessDID(
    businessData: BusinessDIDMetadata,
    creatorAccount?: algosdk.Account
  ): Promise<DIDCreationResult> {
    try {
      // For demo purposes, create a mock DID without actual blockchain interaction
      // In production, this would require a proper wallet connection or backend service
      
      // Generate unique DID
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const didId = `did:ethicchain:${businessData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}:${timestamp}:${random}`;
      
      // Generate mock transaction data
      const mockTransactionId = `TXN${timestamp}${random.toUpperCase()}`;
      const mockAssetId = Math.floor(Math.random() * 1000000) + 100000;
      const mockAlgorandAddress = `MOCK${random.toUpperCase()}${'A'.repeat(32 - random.length)}`;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        did: didId,
        transactionId: mockTransactionId,
        assetId: mockAssetId,
        metadata: businessData,
        algorandAddress: mockAlgorandAddress
      };
      
    } catch (error) {
      console.error('Error creating business DID:', error);
      throw new Error(`Failed to create business DID: ${error.message}`);
    }
  }
  
  /**
   * Resolve a DID to get its document
   */
  static async resolveDID(did: string): Promise<any> {
    try {
      // Mock implementation
      return {
        "@context": ["https://www.w3.org/ns/did/v1"],
        "id": did,
        "controller": "mock-controller",
        "verificationMethod": [],
        "service": []
      };
    } catch (error) {
      console.error('Error resolving DID:', error);
      throw error;
    }
  }
  
  /**
   * Verify DID ownership (mock implementation)
   */
  static async verifyDIDOwnership(did: string, ownerAddress: string): Promise<boolean> {
    try {
      // Mock verification - always return true for demo
      return true;
    } catch (error) {
      console.error('Error verifying DID ownership:', error);
      return false;
    }
  }
  
  /**
   * Update DID document (mock implementation)
   */
  static async updateDIDDocument(
    did: string,
    updatedMetadata: Partial<BusinessDIDMetadata>,
    ownerAccount?: algosdk.Account
  ): Promise<string> {
    try {
      // Mock update
      const mockUpdateTxnId = `UPD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return mockUpdateTxnId;
    } catch (error) {
      console.error('Error updating DID document:', error);
      throw error;
    }
  }
  
  /**
   * Upload DID document to IPFS (mock implementation)
   */
  private static async uploadDIDDocument(didDocument: any): Promise<string> {
    // Mock IPFS URL
    const hash = `QmDID${Math.random().toString(36).substring(2, 15)}`;
    return `https://ipfs.io/ipfs/${hash}`;
  }
  
  /**
   * Generate a mock Algorand account for demo purposes
   */
  static generateDIDAccount(): { addr: string; sk: Uint8Array } {
    const random = Math.random().toString(36).substring(2, 15);
    return {
      addr: `MOCK${random.toUpperCase()}${'A'.repeat(32 - random.length)}`,
      sk: new Uint8Array(64) // Mock secret key
    };
  }
}

// Utility function to create business DID
export const createBusinessDID = async (
  businessName: string,
  businessType?: string,
  verificationLevel?: string,
  ethicChainId?: string,
  additionalData?: {
    registrationNumber?: string;
    website?: string;
  }
) => {
  // Only business name is required
  if (!businessName || businessName.trim() === '') {
    return {
      success: false,
      error: 'Business name is required'
    };
  }

  const metadata: BusinessDIDMetadata = {
    businessName: businessName.trim(),
    businessType: businessType || 'general',
    registrationNumber: additionalData?.registrationNumber,
    website: additionalData?.website,
    verificationLevel: verificationLevel || 'basic',
    createdAt: new Date().toISOString(),
    ethicChainId: ethicChainId || crypto.randomUUID()
  };
  
  try {
    const result = await AlgorandDIDService.createBusinessDID(metadata);
    
    return {
      success: true,
      did: result.did,
      transactionId: result.transactionId,
      assetId: result.assetId,
      algorandAddress: result.algorandAddress,
      metadata: result.metadata
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Utility function to generate a human-readable DID
export const generateReadableDID = (businessName: string): string => {
  const cleanName = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 12);
  
  const timestamp = Date.now().toString().substring(-6);
  const random = Math.random().toString(36).substring(2, 6);
  
  return `did:ethicchain:${cleanName}:${timestamp}:${random}`;
};