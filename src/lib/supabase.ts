import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UserProfile {
  id: string
  email?: string
  full_name: string
  wallet_address?: string
  role: 'buyer' | 'supplier'
  city?: string
  pincode?: string
  auth_method: 'email' | 'wallet'
  password?: string
  created_at: string
  updated_at: string
}

export interface Merchant {
  id: string
  user_id: string
  business_name: string
  website?: string
  description?: string
  business_type?: string
  registration_number?: string
  verification_level: 'basic' | 'advanced' | 'premium'
  trust_score: number
  certifications: string[]
  nft_certificate_id?: string
  algorand_did?: string
  did_transaction_id?: string
  did_created_at?: string
  verification_date: string
  created_at: string
  updated_at: string
  // Joined user profile data
  user_profile?: UserProfile
}

export const authService = {
  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, userData: Partial<UserProfile>) {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .eq('auth_method', 'email')
    
    if (existingUser && existingUser.length > 0) {
      throw new Error('An account with this email already exists')
    }
    
    // Create user profile with password
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: crypto.randomUUID(),
        email: email,
        password: password, // In production, this should be hashed
        full_name: userData.full_name,
        role: userData.role,
        city: userData.city,
        pincode: userData.pincode,
        auth_method: 'email'
      })
      .select()
      .single()
    
    if (profileError) throw profileError
    
    return { user: { id: profileData.id, email: profileData.email }, profile: profileData }
  },

  // Sign in with email and password
  async signInWithEmail(email: string, password: string) {
    // Check if user exists and password matches
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .eq('password', password) // In production, this should use password hashing
      .eq('auth_method', 'email')
    
    if (profileError) {
      throw new Error('Invalid email or password')
    }
    
    if (!userProfile || userProfile.length === 0) {
      throw new Error('Invalid email or password')
    }
    
    const user = userProfile[0]
    
    // Return user data without password
    const { password: _, ...profileWithoutPassword } = user
    return { 
      user: { id: user.id, email: user.email }, 
      profile: profileWithoutPassword 
    }
  },

  // Create merchant profile when supplier registers
  async createMerchantProfile(userId: string, merchantData: Partial<Merchant>) {
    try {
      // Check if merchant profile already exists
      const existingMerchant = await merchantService.getMerchantByUserId(userId);
      
      if (existingMerchant) {
        // Merchant profile already exists, return it
        return existingMerchant;
      }
    } catch (error) {
      // If error checking existing merchant, continue with creation
      console.log('Error checking existing merchant, proceeding with creation:', error);
    }
    
    // Get user profile to copy email or wallet address
    const userProfile = await this.getUserProfile(userId);
    
    // Create new merchant profile
    const { data, error } = await supabase
      .from('merchants')
      .insert({
        user_id: userId,
        business_name: userProfile.full_name, // Use full name as initial business name
        verification_level: merchantData.verification_level || 'basic',
        trust_score: 75, // Starting trust score for new merchants
        certifications: []
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Create wallet user profile
  async createWalletUser(userData: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: crypto.randomUUID(),
        full_name: userData.full_name,
        wallet_address: userData.wallet_address,
        role: userData.role,
        city: userData.city,
        pincode: userData.pincode,
        auth_method: 'wallet'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, wallet_address, role, city, pincode, auth_method, created_at, updated_at')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get user by wallet address
  async getUserByWallet(walletAddress: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, wallet_address, role, city, pincode, auth_method, created_at, updated_at')
      .eq('wallet_address', walletAddress)
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  },

  // Sign out
  async signOut() {
    // Since we're not using Supabase Auth, just clear local state
    // The actual sign out will be handled by the frontend
    return Promise.resolve()
  }
}

export const merchantService = {
  // Get all verified merchants
  async getAllMerchants() {
    const { data, error } = await supabase
      .from('merchants')
      .select(`
        *,
        user_profile:user_profiles(
          id,
          full_name,
          email,
          wallet_address,
          city,
          pincode,
          created_at
        )
      `)
      .order('trust_score', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get merchant by user ID
  async getMerchantByUserId(userId: string) {
    const { data, error } = await supabase
      .from('merchants')
      .select(`
        *,
        user_profile:user_profiles(
          id,
          full_name,
          email,
          wallet_address,
          city,
          pincode,
          created_at
        )
      `)
      .eq('user_id', userId)
    
    if (error) {
      throw error
    }
    return data && data.length > 0 ? data[0] : null
  },

  // Update merchant profile
  async updateMerchant(merchantId: string, updates: Partial<Merchant>) {
    const { data, error } = await supabase
      .from('merchants')
      .update(updates)
      .eq('id', merchantId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update merchant DID information
  async updateMerchantDID(merchantId: string, didData: {
    algorand_did: string;
    did_transaction_id: string;
    did_created_at: string;
  }) {
    const { data, error } = await supabase
      .from('merchants')
      .update({
        algorand_did: didData.algorand_did,
        did_transaction_id: didData.did_transaction_id,
        did_created_at: didData.did_created_at
      })
      .eq('id', merchantId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get merchant by DID
  async getMerchantByDID(did: string) {
    const { data, error } = await supabase
      .from('merchants')
      .select(`
        *,
        user_profile:user_profiles(
          id,
          full_name,
          email,
          wallet_address,
          city,
          pincode,
          created_at
        )
      `)
      .eq('algorand_did', did)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Search merchants
  async searchMerchants(searchTerm: string, verificationLevel?: string) {
    let query = supabase
      .from('merchants')
      .select(`
        *,
        user_profile:user_profiles(
          id,
          full_name,
          email,
          wallet_address,
          city,
          pincode,
          created_at
        )
      `)
    
    if (searchTerm) {
      query = query.or(`business_name.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }
    
    if (verificationLevel && verificationLevel !== 'all') {
      query = query.eq('verification_level', verificationLevel)
    }
    
    query = query.order('trust_score', { ascending: false })
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }
}