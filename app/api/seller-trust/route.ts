import { NextRequest, NextResponse } from 'next/server'

interface SellerRating {
  id: string
  rating: number
  review: string
  date: string
  productId: string
  userId: string
}

interface SellerSale {
  id: string
  productId: string
  amount: number
  date: string
  status: 'completed' | 'refunded' | 'disputed'
  userId: string
}

interface Seller {
  id: string
  name: string
  category: string
  verified: boolean
  joinDate: string
  totalSales: number
  totalRevenue: number
  ratings: SellerRating[]
  sales: SellerSale[]
}

// Mock data - in real implementation, this would come from your database
const mockSellers: Seller[] = [
  {
    id: "seller_001",
    name: "TechWorld Electronics",
    category: "Electronics",
    verified: true,
    joinDate: "2022-01-15",
    totalSales: 10500,
    totalRevenue: 2500000,
    ratings: [
      { id: "r1", rating: 5, review: "Excellent product quality", date: "2024-01-15", productId: "p1", userId: "u1" },
      { id: "r2", rating: 4, review: "Good service, fast delivery", date: "2024-01-10", productId: "p2", userId: "u2" },
      { id: "r3", rating: 5, review: "Perfect condition", date: "2024-01-05", productId: "p3", userId: "u3" },
      { id: "r4", rating: 3, review: "Product was okay", date: "2024-01-01", productId: "p4", userId: "u4" },
      { id: "r5", rating: 5, review: "Highly recommended", date: "2023-12-28", productId: "p5", userId: "u5" },
      { id: "r6", rating: 5, review: "Amazing service", date: "2023-12-20", productId: "p6", userId: "u6" },
      { id: "r7", rating: 4, review: "Good value for money", date: "2023-12-15", productId: "p7", userId: "u7" },
      { id: "r8", rating: 5, review: "Exceeded expectations", date: "2023-12-10", productId: "p8", userId: "u8" },
    ],
    sales: [
      { id: "s1", productId: "p1", amount: 1500, date: "2024-01-15", status: "completed", userId: "u1" },
      { id: "s2", productId: "p2", amount: 800, date: "2024-01-10", status: "completed", userId: "u2" },
      { id: "s3", productId: "p3", amount: 1200, date: "2024-01-05", status: "completed", userId: "u3" },
      { id: "s4", productId: "p4", amount: 600, date: "2024-01-01", status: "refunded", userId: "u4" },
      { id: "s5", productId: "p5", amount: 900, date: "2023-12-28", status: "completed", userId: "u5" },
      { id: "s6", productId: "p6", amount: 1100, date: "2023-12-20", status: "completed", userId: "u6" },
      { id: "s7", productId: "p7", amount: 750, date: "2023-12-15", status: "completed", userId: "u7" },
      { id: "s8", productId: "p8", amount: 950, date: "2023-12-10", status: "completed", userId: "u8" },
    ]
  },
  {
    id: "seller_002",
    name: "Fashion Hub",
    category: "Fashion",
    verified: true,
    joinDate: "2021-08-20",
    totalSales: 5200,
    totalRevenue: 1800000,
    ratings: [
      { id: "r9", rating: 4, review: "Nice clothing", date: "2024-01-12", productId: "p9", userId: "u9" },
      { id: "r10", rating: 5, review: "Perfect fit", date: "2024-01-08", productId: "p10", userId: "u10" },
      { id: "r11", rating: 3, review: "Average quality", date: "2024-01-03", productId: "p11", userId: "u11" },
      { id: "r12", rating: 4, review: "Good value", date: "2023-12-30", productId: "p12", userId: "u12" },
      { id: "r13", rating: 2, review: "Not as expected", date: "2023-12-25", productId: "p13", userId: "u13" },
      { id: "r14", rating: 4, review: "Decent quality", date: "2023-12-20", productId: "p14", userId: "u14" },
      { id: "r15", rating: 5, review: "Great style", date: "2023-12-15", productId: "p15", userId: "u15" },
    ],
    sales: [
      { id: "s9", productId: "p9", amount: 200, date: "2024-01-12", status: "completed", userId: "u9" },
      { id: "s10", productId: "p10", amount: 150, date: "2024-01-08", status: "completed", userId: "u10" },
      { id: "s11", productId: "p11", amount: 100, date: "2024-01-03", status: "completed", userId: "u11" },
      { id: "s12", productId: "p12", amount: 180, date: "2023-12-30", status: "completed", userId: "u12" },
      { id: "s13", productId: "p13", amount: 120, date: "2023-12-25", status: "refunded", userId: "u13" },
      { id: "s14", productId: "p14", amount: 90, date: "2023-12-20", status: "completed", userId: "u14" },
      { id: "s15", productId: "p15", amount: 160, date: "2023-12-15", status: "completed", userId: "u15" },
    ]
  },
  {
    id: "seller_003",
    name: "Home Essentials",
    category: "Home & Garden",
    verified: true,
    joinDate: "2020-03-10",
    totalSales: 15800,
    totalRevenue: 3200000,
    ratings: [
      { id: "r16", rating: 5, review: "Amazing quality", date: "2024-01-14", productId: "p16", userId: "u16" },
      { id: "r17", rating: 5, review: "Fast shipping", date: "2024-01-09", productId: "p17", userId: "u17" },
      { id: "r18", rating: 4, review: "Good product", date: "2024-01-04", productId: "p18", userId: "u18" },
      { id: "r19", rating: 5, review: "Exceeded expectations", date: "2023-12-29", productId: "p19", userId: "u19" },
      { id: "r20", rating: 5, review: "Perfect for my home", date: "2023-12-24", productId: "p20", userId: "u20" },
      { id: "r21", rating: 5, review: "High quality materials", date: "2023-12-19", productId: "p21", userId: "u21" },
      { id: "r22", rating: 4, review: "Good value", date: "2023-12-14", productId: "p22", userId: "u22" },
      { id: "r23", rating: 5, review: "Excellent service", date: "2023-12-09", productId: "p23", userId: "u23" },
      { id: "r24", rating: 5, review: "Highly recommended", date: "2023-12-04", productId: "p24", userId: "u24" },
    ],
    sales: [
      { id: "s16", productId: "p16", amount: 300, date: "2024-01-14", status: "completed", userId: "u16" },
      { id: "s17", productId: "p17", amount: 250, date: "2024-01-09", status: "completed", userId: "u17" },
      { id: "s18", productId: "p18", amount: 180, date: "2024-01-04", status: "completed", userId: "u18" },
      { id: "s19", productId: "p19", amount: 400, date: "2023-12-29", status: "completed", userId: "u19" },
      { id: "s20", productId: "p20", amount: 350, date: "2023-12-24", status: "completed", userId: "u20" },
      { id: "s21", productId: "p21", amount: 280, date: "2023-12-19", status: "completed", userId: "u21" },
      { id: "s22", productId: "p22", amount: 220, date: "2023-12-14", status: "completed", userId: "u22" },
      { id: "s23", productId: "p23", amount: 320, date: "2023-12-09", status: "completed", userId: "u23" },
      { id: "s24", productId: "p24", amount: 380, date: "2023-12-04", status: "completed", userId: "u24" },
    ]
  },
  {
    id: "seller_004",
    name: "QuickMart Express",
    category: "Electronics",
    verified: false,
    joinDate: "2023-06-15",
    totalSales: 800,
    totalRevenue: 120000,
    ratings: [
      { id: "r25", rating: 3, review: "Okay product", date: "2024-01-10", productId: "p25", userId: "u25" },
      { id: "r26", rating: 2, review: "Slow delivery", date: "2024-01-05", productId: "p26", userId: "u26" },
      { id: "r27", rating: 4, review: "Good price", date: "2023-12-30", productId: "p27", userId: "u27" },
      { id: "r28", rating: 1, review: "Poor quality", date: "2023-12-25", productId: "p28", userId: "u28" },
      { id: "r29", rating: 3, review: "Average", date: "2023-12-20", productId: "p29", userId: "u29" },
      { id: "r30", rating: 2, review: "Not worth it", date: "2023-12-15", productId: "p30", userId: "u30" },
    ],
    sales: [
      { id: "s25", productId: "p25", amount: 150, date: "2024-01-10", status: "completed", userId: "u25" },
      { id: "s26", productId: "p26", amount: 200, date: "2024-01-05", status: "completed", userId: "u26" },
      { id: "s27", productId: "p27", amount: 120, date: "2023-12-30", status: "completed", userId: "u27" },
      { id: "s28", productId: "p28", amount: 180, date: "2023-12-25", status: "refunded", userId: "u28" },
      { id: "s29", productId: "p29", amount: 90, date: "2023-12-20", status: "disputed", userId: "u29" },
      { id: "s30", productId: "p30", amount: 160, date: "2023-12-15", status: "refunded", userId: "u30" },
    ]
  },
  {
    id: "seller_005",
    name: "Premium Boutique",
    category: "Fashion",
    verified: true,
    joinDate: "2019-11-08",
    totalSales: 2200,
    totalRevenue: 880000,
    ratings: [
      { id: "r31", rating: 5, review: "Luxury quality", date: "2024-01-12", productId: "p31", userId: "u31" },
      { id: "r32", rating: 5, review: "Exquisite design", date: "2024-01-08", productId: "p32", userId: "u32" },
      { id: "r33", rating: 5, review: "Worth every penny", date: "2024-01-03", productId: "p33", userId: "u33" },
      { id: "r34", rating: 4, review: "Beautiful piece", date: "2023-12-28", productId: "p34", userId: "u34" },
      { id: "r35", rating: 5, review: "Premium experience", date: "2023-12-23", productId: "p35", userId: "u35" },
      { id: "r36", rating: 5, review: "Outstanding service", date: "2023-12-18", productId: "p36", userId: "u36" },
    ],
    sales: [
      { id: "s31", productId: "p31", amount: 800, date: "2024-01-12", status: "completed", userId: "u31" },
      { id: "s32", productId: "p32", amount: 1200, date: "2024-01-08", status: "completed", userId: "u32" },
      { id: "s33", productId: "p33", amount: 950, date: "2024-01-03", status: "completed", userId: "u33" },
      { id: "s34", productId: "p34", amount: 650, date: "2023-12-28", status: "completed", userId: "u34" },
      { id: "s35", productId: "p35", amount: 1100, date: "2023-12-23", status: "completed", userId: "u35" },
      { id: "s36", productId: "p36", amount: 750, date: "2023-12-18", status: "completed", userId: "u36" },
    ]
  }
]

// Calculate seller trust score based on multiple factors
function calculateTrustScore(seller: Seller): number {
  const weights = {
    rating: 0.35,
    salesVolume: 0.25,
    refundRate: 0.20,
    verification: 0.10,
    timeActive: 0.10
  }

  // Average rating (0-5 scale, convert to 0-100)
  const avgRating = seller.ratings.length > 0 
    ? (seller.ratings.reduce((sum, r) => sum + r.rating, 0) / seller.ratings.length) * 20
    : 0

  // Sales volume score (normalize based on highest seller)
  const maxSales = Math.max(...mockSellers.map(s => s.totalSales))
  const salesVolumeScore = (seller.totalSales / maxSales) * 100

  // Refund rate (lower is better)
  const refundedSales = seller.sales.filter(s => s.status === 'refunded').length
  const refundRate = seller.sales.length > 0 ? refundedSales / seller.sales.length : 0
  const refundRateScore = (1 - refundRate) * 100

  // Verification bonus
  const verificationScore = seller.verified ? 100 : 0

  // Time active score (years since joining)
  const joinDate = new Date(seller.joinDate)
  const yearsActive = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  const timeActiveScore = Math.min(yearsActive * 20, 100) // Max 5 years = 100 points

  // Calculate weighted score
  const trustScore = 
    avgRating * weights.rating +
    salesVolumeScore * weights.salesVolume +
    refundRateScore * weights.refundRate +
    verificationScore * weights.verification +
    timeActiveScore * weights.timeActive

  return Math.round(trustScore)
}

// Enhanced Safe Shopping Score calculation with comprehensive formula
function calculateSafeShoppingScore(seller: Seller): number {
  // Define scoring factors and their weights
  const factors = {
    ratingQuality: 0.25,        // Quality of ratings (not just average)
    recentPerformance: 0.20,    // Recent ratings and sales performance
    consistency: 0.15,          // Consistency in ratings over time
    refundRate: 0.15,           // Low refund rate is better
    volumeReliability: 0.10,    // High volume with good ratings
    verification: 0.05,         // Verified seller status
    timeActive: 0.05,           // Time active on platform
    disputeRate: 0.05           // Low dispute rate is better
  }

  // 1. Rating Quality Score (0-100)
  const ratingQualityScore = calculateRatingQualityScore(seller.ratings)

  // 2. Recent Performance Score (0-100)
  const recentPerformanceScore = calculateRecentPerformanceScore(seller)

  // 3. Consistency Score (0-100)
  const consistencyScore = calculateConsistencyScore(seller.ratings)

  // 4. Refund Rate Score (0-100) - Lower refund rate is better
  const refundedSales = seller.sales.filter(s => s.status === 'refunded').length
  const refundRate = seller.sales.length > 0 ? refundedSales / seller.sales.length : 0
  const refundRateScore = Math.max(0, 100 - (refundRate * 100))

  // 5. Volume Reliability Score (0-100)
  const volumeReliabilityScore = calculateVolumeReliabilityScore(seller)

  // 6. Verification Score (0-100)
  const verificationScore = seller.verified ? 100 : 0

  // 7. Time Active Score (0-100)
  const joinDate = new Date(seller.joinDate)
  const yearsActive = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  const timeActiveScore = Math.min(yearsActive * 25, 100) // Max 4 years = 100 points

  // 8. Dispute Rate Score (0-100) - Lower dispute rate is better
  const disputedSales = seller.sales.filter(s => s.status === 'disputed').length
  const disputeRate = seller.sales.length > 0 ? disputedSales / seller.sales.length : 0
  const disputeRateScore = Math.max(0, 100 - (disputeRate * 100))

  // Calculate weighted Safe Shopping Score
  const safeShoppingScore = 
    ratingQualityScore * factors.ratingQuality +
    recentPerformanceScore * factors.recentPerformance +
    consistencyScore * factors.consistency +
    refundRateScore * factors.refundRate +
    volumeReliabilityScore * factors.volumeReliability +
    verificationScore * factors.verification +
    timeActiveScore * factors.timeActive +
    disputeRateScore * factors.disputeRate

  return Math.round(safeShoppingScore)
}

// Calculate rating quality score based on rating distribution and sentiment
function calculateRatingQualityScore(ratings: SellerRating[]): number {
  if (ratings.length === 0) return 0

  // Calculate rating distribution
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratings.forEach(r => {
    ratingCounts[r.rating as keyof typeof ratingCounts]++
  })

  // Weighted score based on rating distribution
  // 5-star ratings are worth more than 4-star, etc.
  const weightedSum = 
    ratingCounts[5] * 5 + 
    ratingCounts[4] * 4 + 
    ratingCounts[3] * 3 + 
    ratingCounts[2] * 2 + 
    ratingCounts[1] * 1

  const totalRatings = ratings.length
  const averageRating = weightedSum / totalRatings

  // Bonus for high percentage of 4-5 star ratings
  const highRatingPercentage = (ratingCounts[4] + ratingCounts[5]) / totalRatings
  const highRatingBonus = highRatingPercentage * 20

  // Penalty for 1-2 star ratings
  const lowRatingPercentage = (ratingCounts[1] + ratingCounts[2]) / totalRatings
  const lowRatingPenalty = lowRatingPercentage * 30

  // Base score from average rating (0-100 scale)
  const baseScore = averageRating * 20

  return Math.max(0, Math.min(100, baseScore + highRatingBonus - lowRatingPenalty))
}

// Calculate recent performance score (last 3 months weighted more heavily)
function calculateRecentPerformanceScore(seller: Seller): number {
  const now = new Date()
  const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000))
  const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000))

  // Separate ratings by time period
  const recentRatings = seller.ratings.filter(r => new Date(r.date) >= threeMonthsAgo)
  const olderRatings = seller.ratings.filter(r => {
    const ratingDate = new Date(r.date)
    return ratingDate >= sixMonthsAgo && ratingDate < threeMonthsAgo
  })

  // Calculate average ratings for each period
  const recentAvg = recentRatings.length > 0 
    ? recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length 
    : 0
  const olderAvg = olderRatings.length > 0 
    ? olderRatings.reduce((sum, r) => sum + r.rating, 0) / olderRatings.length 
    : 0

  // Weight recent performance more heavily (70% recent, 30% older)
  const weightedScore = (recentAvg * 0.7 + olderAvg * 0.3) * 20

  // Bonus for improving performance
  const improvementBonus = recentAvg > olderAvg ? 10 : 0

  return Math.max(0, Math.min(100, weightedScore + improvementBonus))
}

// Calculate consistency score based on rating variance
function calculateConsistencyScore(ratings: SellerRating[]): number {
  if (ratings.length < 2) return 50 // Neutral score for insufficient data

  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
  
  // Calculate variance (how much ratings deviate from average)
  const variance = ratings.reduce((sum, r) => {
    return sum + Math.pow(r.rating - averageRating, 2)
  }, 0) / ratings.length

  const standardDeviation = Math.sqrt(variance)

  // Lower standard deviation = more consistent = higher score
  // Convert to 0-100 scale (0 = very inconsistent, 100 = very consistent)
  const consistencyScore = Math.max(0, 100 - (standardDeviation * 20))

  return Math.round(consistencyScore)
}

// Calculate volume reliability score (high volume with good ratings)
function calculateVolumeReliabilityScore(seller: Seller): number {
  if (seller.totalSales === 0) return 0

  // Get the highest sales volume among all sellers for normalization
  const maxSales = Math.max(...mockSellers.map(s => s.totalSales))
  
  // Volume score (0-50 points)
  const volumeScore = (seller.totalSales / maxSales) * 50

  // Quality score based on average rating (0-50 points)
  const averageRating = seller.ratings.length > 0 
    ? seller.ratings.reduce((sum, r) => sum + r.rating, 0) / seller.ratings.length 
    : 0
  const qualityScore = averageRating * 10

  // Bonus for high volume with high ratings
  const volumeQualityBonus = (seller.totalSales > 1000 && averageRating >= 4.5) ? 10 : 0

  return Math.min(100, volumeScore + qualityScore + volumeQualityBonus)
}

// Calculate detailed Safe Shopping Score breakdown for individual sellers
function calculateSafeShoppingScoreBreakdown(seller: Seller) {
  const factors = {
    ratingQuality: 0.25,
    recentPerformance: 0.20,
    consistency: 0.15,
    refundRate: 0.15,
    volumeReliability: 0.10,
    verification: 0.05,
    timeActive: 0.05,
    disputeRate: 0.05
  }

  const ratingQualityScore = calculateRatingQualityScore(seller.ratings)
  const recentPerformanceScore = calculateRecentPerformanceScore(seller)
  const consistencyScore = calculateConsistencyScore(seller.ratings)
  
  const refundedSales = seller.sales.filter(s => s.status === 'refunded').length
  const refundRate = seller.sales.length > 0 ? refundedSales / seller.sales.length : 0
  const refundRateScore = Math.max(0, 100 - (refundRate * 100))
  
  const volumeReliabilityScore = calculateVolumeReliabilityScore(seller)
  const verificationScore = seller.verified ? 100 : 0
  
  const joinDate = new Date(seller.joinDate)
  const yearsActive = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  const timeActiveScore = Math.min(yearsActive * 25, 100)
  
  const disputedSales = seller.sales.filter(s => s.status === 'disputed').length
  const disputeRate = seller.sales.length > 0 ? disputedSales / seller.sales.length : 0
  const disputeRateScore = Math.max(0, 100 - (disputeRate * 100))

  return {
    overall: Math.round(
      ratingQualityScore * factors.ratingQuality +
      recentPerformanceScore * factors.recentPerformance +
      consistencyScore * factors.consistency +
      refundRateScore * factors.refundRate +
      volumeReliabilityScore * factors.volumeReliability +
      verificationScore * factors.verification +
      timeActiveScore * factors.timeActive +
      disputeRateScore * factors.disputeRate
    ),
    breakdown: {
      ratingQuality: { score: Math.round(ratingQualityScore), weight: factors.ratingQuality },
      recentPerformance: { score: Math.round(recentPerformanceScore), weight: factors.recentPerformance },
      consistency: { score: Math.round(consistencyScore), weight: factors.consistency },
      refundRate: { score: Math.round(refundRateScore), weight: factors.refundRate },
      volumeReliability: { score: Math.round(volumeReliabilityScore), weight: factors.volumeReliability },
      verification: { score: Math.round(verificationScore), weight: factors.verification },
      timeActive: { score: Math.round(timeActiveScore), weight: factors.timeActive },
      disputeRate: { score: Math.round(disputeRateScore), weight: factors.disputeRate }
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sellerId = searchParams.get('sellerId')

  try {
    if (sellerId) {
      // Return specific seller data
      const seller = mockSellers.find(s => s.id === sellerId)
      if (!seller) {
        return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
      }

      const trustScore = calculateTrustScore(seller)
      const safeShoppingScore = calculateSafeShoppingScore(seller)
      const safeShoppingBreakdown = calculateSafeShoppingScoreBreakdown(seller)

      return NextResponse.json({
        seller: {
          ...seller,
          trustScore,
          safeShoppingScore,
          safeShoppingBreakdown,
          averageRating: seller.ratings.length > 0 
            ? seller.ratings.reduce((sum, r) => sum + r.rating, 0) / seller.ratings.length 
            : 0,
          totalRatings: seller.ratings.length,
          refundRate: seller.sales.length > 0 
            ? (seller.sales.filter(s => s.status === 'refunded').length / seller.sales.length) * 100 
            : 0,
          disputeRate: seller.sales.length > 0 
            ? (seller.sales.filter(s => s.status === 'disputed').length / seller.sales.length) * 100 
            : 0
        }
      })
    } else {
      // Return all sellers with trust scores
      const sellersWithScores = mockSellers.map(seller => {
        const trustScore = calculateTrustScore(seller)
        const safeShoppingScore = calculateSafeShoppingScore(seller)
        
        return {
          id: seller.id,
          name: seller.name,
          category: seller.category,
          verified: seller.verified,
          totalSales: seller.totalSales,
          totalRevenue: seller.totalRevenue,
          trustScore,
          safeShoppingScore,
          averageRating: seller.ratings.length > 0 
            ? seller.ratings.reduce((sum, r) => sum + r.rating, 0) / seller.ratings.length 
            : 0,
          totalRatings: seller.ratings.length,
          refundRate: seller.sales.length > 0 
            ? (seller.sales.filter(s => s.status === 'refunded').length / seller.sales.length) * 100 
            : 0
        }
      })

      // Sort by trust score (highest first)
      sellersWithScores.sort((a, b) => b.trustScore - a.trustScore)

      return NextResponse.json({ sellers: sellersWithScores })
    }
  } catch (error) {
    console.error('Error fetching seller trust data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 