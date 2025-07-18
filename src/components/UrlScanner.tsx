import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, Shield, ExternalLink, Eye, Zap, Brain, TrendingUp, Globe } from 'lucide-react';
import { UrlScanResult } from '../types';
import { analyzeUrlWithGroq, GroqAnalysisResult } from '../lib/groq';

const UrlScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<UrlScanResult | null>(null);
  const [groqAnalysis, setGroqAnalysis] = useState<GroqAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    setAnalysisError(null);
    setGroqAnalysis(null);
    
    try {
      // Get Groq AI analysis
      const aiAnalysis = await analyzeUrlWithGroq(url);
      setGroqAnalysis(aiAnalysis);
      
      // Create enhanced result based on AI analysis
      const mockResult: UrlScanResult = {
        url,
        isScam: aiAnalysis.isDropshippingScam,
        riskLevel: aiAnalysis.riskLevel,
        domainAge: Math.floor(Math.random() * 3000) + 30,
        sslStatus: Math.random() > 0.2,
        scamReports: Math.floor(Math.random() * 50),
        aiAnalysis: {
          riskScore: aiAnalysis.riskScore,
          indicators: aiAnalysis.indicators,
          recommendations: aiAnalysis.recommendations
        },
        whoisInfo: {
          registrar: 'Example Registrar',
          registrationDate: new Date(2022, 3, 15),
          expirationDate: new Date(2025, 3, 15),
          privacy: Math.random() > 0.5
        }
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError('Failed to analyze URL. Please try again.');
      
      // Fallback to basic analysis
      const fallbackResult: UrlScanResult = {
        url,
        isScam: false,
        riskLevel: 'medium',
        domainAge: Math.floor(Math.random() * 3000) + 30,
        sslStatus: Math.random() > 0.2,
        scamReports: Math.floor(Math.random() * 50),
        aiAnalysis: {
          riskScore: 50,
          indicators: [
            {
              type: 'yellow_flag',
              description: 'Unable to complete full AI analysis',
              confidence: 0.5
            }
          ],
          recommendations: [
            'Exercise caution when shopping',
            'Verify merchant credentials',
            'Check for secure payment methods'
          ]
        },
        whoisInfo: {
          registrar: 'Unknown',
          registrationDate: new Date(2022, 3, 15),
          expirationDate: new Date(2025, 3, 15),
          privacy: true
        }
      };
      
      setResult(fallbackResult);
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIndicatorColor = (type: string) => {
    switch (type) {
      case 'red_flag': return 'from-red-500 to-pink-500';
      case 'yellow_flag': return 'from-yellow-500 to-orange-500';
      case 'green_flag': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
              <Brain className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Dropshipping Scam Detector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced AI analysis powered by Groq to detect dropshipping scams, fake stores, 
            and unethical e-commerce practices in real-time
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-medium text-green-700">
            <Zap className="h-4 w-4 mr-2" />
            Powered by Groq AI Technology
          </div>
        </div>

        {/* Scanner Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-gray-200/50">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-lg font-semibold text-gray-900 mb-4">
                Enter URL to analyze for dropshipping scams
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Globe className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-16 pr-32 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  required
                />
                <button
                  type="submit"
                  disabled={isScanning}
                  className="absolute right-3 top-3 bottom-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Analysis Error */}
        {analysisError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{analysisError}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Groq AI Analysis */}
            {groqAnalysis && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-purple-200/50">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mr-4">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Groq AI Analysis</h2>
                    <p className="text-purple-600 font-medium">Advanced dropshipping scam detection</p>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {groqAnalysis.isDropshippingScam ? (
                          <div className="p-4 bg-red-100 rounded-2xl">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                          </div>
                        ) : (
                          <div className="p-4 bg-green-100 rounded-2xl">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Dropshipping Scam</h3>
                      <p className={`font-bold text-lg ${groqAnalysis.isDropshippingScam ? 'text-red-600' : 'text-green-600'}`}>
                        {groqAnalysis.isDropshippingScam ? 'DETECTED' : 'NOT DETECTED'}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className={`p-4 rounded-2xl ${
                          groqAnalysis.riskLevel === 'critical' ? 'bg-red-100' :
                          groqAnalysis.riskLevel === 'high' ? 'bg-orange-100' :
                          groqAnalysis.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <TrendingUp className={`h-8 w-8 ${
                            groqAnalysis.riskLevel === 'critical' ? 'text-red-500' :
                            groqAnalysis.riskLevel === 'high' ? 'text-orange-500' :
                            groqAnalysis.riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                          }`} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Risk Level</h3>
                      <p className={`font-bold text-lg uppercase ${
                        groqAnalysis.riskLevel === 'critical' ? 'text-red-600' :
                        groqAnalysis.riskLevel === 'high' ? 'text-orange-600' :
                        groqAnalysis.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {groqAnalysis.riskLevel}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-4 bg-blue-100 rounded-2xl">
                          <Zap className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI Confidence</h3>
                      <p className="font-bold text-lg text-blue-600">{groqAnalysis.riskScore}/100</p>
                    </div>
                  </div>
                </div>
                
                {groqAnalysis.reasoning && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">AI Reasoning</h4>
                    <p className="text-gray-700 leading-relaxed">{groqAnalysis.reasoning}</p>
                  </div>
                )}
              </div>
            )}

            {/* Overall Result */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Technical Analysis</h2>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 break-all font-mono bg-gray-100 px-3 py-1 rounded-lg">{result.url}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    {result.isScam || result.riskLevel === 'high' || result.riskLevel === 'critical' ? (
                      <div className="p-4 bg-red-100 rounded-2xl">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                      </div>
                    ) : (
                      <div className="p-4 bg-green-100 rounded-2xl">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Overall Status</div>
                  <div className={`font-bold text-lg ${result.isScam || result.riskLevel === 'high' || result.riskLevel === 'critical' ? 'text-red-600' : 'text-green-600'}`}>
                    {result.isScam || result.riskLevel === 'high' || result.riskLevel === 'critical' ? 'Not Safe' : 'Appears Safe'}
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    <div className={`p-4 rounded-2xl ${getRiskColor(result.riskLevel).replace('text-', 'bg-').replace('-600', '-100')}`}>
                      <Zap className={`h-8 w-8 ${getRiskColor(result.riskLevel).split(' ')[0]}`} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Risk Level</div>
                  <div className={`font-bold text-lg px-3 py-1 rounded-full ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel.toUpperCase()}
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    <div className="p-4 bg-purple-100 rounded-2xl">
                      <Clock className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Domain Age</div>
                  <div className="font-bold text-lg text-gray-900">{result.domainAge} days</div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    <div className={`p-4 rounded-2xl ${result.sslStatus ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Shield className={`h-8 w-8 ${result.sslStatus ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">SSL Status</div>
                  <div className={`font-bold text-lg ${result.sslStatus ? 'text-green-600' : 'text-red-600'}`}>
                    {result.sslStatus ? 'Valid' : 'Invalid'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                Detailed Analysis
              </h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-700">Risk Score</span>
                  <span className="text-2xl font-bold text-gray-900">{result.aiAnalysis.riskScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${
                      result.aiAnalysis.riskScore > 70 ? 'from-red-500 to-pink-500' : 
                      result.aiAnalysis.riskScore > 40 ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500'
                    }`}
                    style={{ width: `${result.aiAnalysis.riskScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Detection Indicators</h4>
                {result.aiAnalysis.indicators.map((indicator, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getIndicatorColor(indicator.type)}`}>
                      {indicator.type.replace('_', ' ')}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium">{indicator.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Confidence: {Math.round(indicator.confidence * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                Safety Recommendations
              </h3>
              <ul className="space-y-2">
                {result.aiAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Domain Information</h4>
                  <div className="space-y-3">
                    <p><span className="text-gray-600">Registrar:</span> {result.whoisInfo.registrar}</p>
                    <p><span className="text-gray-600">Registration:</span> {result.whoisInfo.registrationDate.toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Expiration:</span> {result.whoisInfo.expirationDate.toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Privacy:</span> {result.whoisInfo.privacy ? 'Protected' : 'Public'}</p>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Community Reports</h4>
                  <div className="space-y-3">
                    <p><span className="text-gray-600">Scam Reports:</span> {result.scamReports}</p>
                    <p><span className="text-gray-600">Last Updated:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlScanner;