
import { createClient } from '@sanity/client';
import Groq from 'groq-sdk';

export const client = createClient({
  projectId: 'yourProjectId',   // ← replace this
  dataset: 'production',
  apiVersion: '2023-07-17',
  useCdn: false,
});

// Optional: keep your analyzeUrlWithGroq() function here

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export interface GroqAnalysisResult {
  isDropshippingScam: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  indicators: Array<{
    type: 'red_flag' | 'yellow_flag' | 'green_flag';
    description: string;
    confidence: number;
  }>;
  recommendations: string[];
  reasoning: string;
}

export const analyzeUrlWithGroq = async (url: string): Promise<GroqAnalysisResult> => {
  try {
    const prompt = `
Analyze the following URL for potential dropshipping scams and unethical e-commerce practices: ${url}

Please provide a comprehensive analysis focusing on:
1. Domain characteristics that suggest dropshipping scams
2. Common red flags in the URL structure
3. Potential indicators of fake stores or unethical practices
4. Risk assessment for consumers

Respond with a JSON object containing:
{
  "isDropshippingScam": boolean,
  "riskLevel": "low" | "medium" | "high" | "critical",
  "riskScore": number (0-100),
  "indicators": [
    {
      "type": "red_flag" | "yellow_flag" | "green_flag",
      "description": "specific indicator found",
      "confidence": number (0-1)
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "reasoning": "detailed explanation of the analysis"
}

Focus on dropshipping scam indicators such as:
- Suspicious domain patterns (random characters, misspellings)
- Generic store names
- Domains registered recently
- Lack of contact information patterns
- Unrealistic pricing indicators in URL
- Geographic inconsistencies
- Common dropshipping platform patterns

Provide actionable recommendations for consumers.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert in e-commerce fraud detection and dropshipping scam analysis. Analyze URLs for potential risks and provide detailed, actionable insights to protect consumers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq API');
    }

    const analysis = JSON.parse(response) as GroqAnalysisResult;
    
    // Validate and sanitize the response
    return {
      isDropshippingScam: Boolean(analysis.isDropshippingScam),
      riskLevel: ['low', 'medium', 'high', 'critical'].includes(analysis.riskLevel) 
        ? analysis.riskLevel 
        : 'medium',
      riskScore: Math.min(100, Math.max(0, Number(analysis.riskScore) || 50)),
      indicators: Array.isArray(analysis.indicators) 
        ? analysis.indicators.map(indicator => ({
            type: ['red_flag', 'yellow_flag', 'green_flag'].includes(indicator.type) 
              ? indicator.type 
              : 'yellow_flag',
            description: String(indicator.description || 'Analysis indicator'),
            confidence: Math.min(1, Math.max(0, Number(indicator.confidence) || 0.5))
          }))
        : [],
      recommendations: Array.isArray(analysis.recommendations) 
        ? analysis.recommendations.map(rec => String(rec))
        : ['Exercise caution when shopping on this website'],
      reasoning: String(analysis.reasoning || 'Analysis completed')
    };

  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Fallback analysis based on URL patterns
    return generateFallbackAnalysis(url);
  }
};

const generateFallbackAnalysis = (url: string): GroqAnalysisResult => {
  const domain = new URL(url).hostname.toLowerCase();
  let riskScore = 30;
  const indicators: GroqAnalysisResult['indicators'] = [];
  
  // Basic URL pattern analysis
  if (domain.includes('shop') || domain.includes('store') || domain.includes('buy')) {
    indicators.push({
      type: 'yellow_flag',
      description: 'Generic e-commerce domain pattern detected',
      confidence: 0.6
    });
    riskScore += 15;
  }
  
  if (domain.split('.')[0].length > 20) {
    indicators.push({
      type: 'red_flag',
      description: 'Unusually long domain name may indicate suspicious activity',
      confidence: 0.7
    });
    riskScore += 25;
  }
  
  if (/\d{3,}/.test(domain)) {
    indicators.push({
      type: 'red_flag',
      description: 'Domain contains multiple numbers, common in scam sites',
      confidence: 0.8
    });
    riskScore += 20;
  }
  
  // Add a positive indicator
  indicators.push({
    type: 'green_flag',
    description: 'URL structure appears standard for e-commerce',
    confidence: 0.5
  });
  
  const riskLevel: GroqAnalysisResult['riskLevel'] = 
    riskScore >= 80 ? 'critical' :
    riskScore >= 60 ? 'high' :
    riskScore >= 40 ? 'medium' : 'low';
  
  return {
    isDropshippingScam: riskScore >= 70,
    riskLevel,
    riskScore,
    indicators,
    recommendations: [
      'Verify merchant credentials before purchasing',
      'Check for secure payment methods',
      'Look for authentic customer reviews',
      'Research the company\'s background and contact information'
    ],
    reasoning: 'Fallback analysis based on URL pattern recognition due to API unavailability'
  };
};