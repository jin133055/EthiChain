export interface ScamReport {
  id: string;
  reporterId: string;
  targetUrl: string;
  category: 'fake_store' | 'unethical_labor' | 'plagiarized_content' | 'fake_reviews' | 'other';
  description: string;
  evidence: string[];
  timestamp: Date;
  blockchainHash: string;
  ipfsHash: string;
  verified: boolean;
  votes: number;
}

export interface Merchant {
  id: string;
  business_name: string;
  website: string;
  wallet_address: string;
  trust_score: number;
  certifications: string[];
  verification_date?: Date;
  nft_certificate_id?: string;
  verification_level: 'basic' | 'advanced' | 'premium';
}

export interface TrustScore {
  overall: number;
  components: {
    userVotes: number;
    scamReports: number;
    verification: number;
    transparency: number;
  };
  history: Array<{
    date: Date;
    score: number;
    reason: string;
  }>;
}

export interface AIAnalysis {
  riskScore: number;
  indicators: {
    type: 'red_flag' | 'yellow_flag' | 'green_flag';
    description: string;
    confidence: number;
  }[];
  recommendations: string[];
}

export interface UrlScanResult {
  url: string;
  isScam: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  domainAge: number;
  sslStatus: boolean;
  scamReports: number;
  aiAnalysis: AIAnalysis;
  whoisInfo: {
    registrar: string;
    registrationDate: Date;
    expirationDate: Date;
    privacy: boolean;
  };
}

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  role: 'consumer' | 'merchant' | 'regulator' | 'admin';
  reputation: number;
  joinDate: Date;
  totalVotes: number;
  reportsSubmitted: number;
}