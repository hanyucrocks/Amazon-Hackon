"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  Shield, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  MessageSquare
} from 'lucide-react'

interface SellerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  sellerId: string | null
  isDarkMode: boolean
}

interface SellerData {
  id: string
  name: string
  category: string
  verified: boolean
  joinDate: string
  totalSales: number
  totalRevenue: number
  trustScore: number
  safeShoppingScore: number
  safeShoppingBreakdown?: {
    overall: number
    breakdown: {
      ratingQuality: { score: number, weight: number }
      recentPerformance: { score: number, weight: number }
      consistency: { score: number, weight: number }
      refundRate: { score: number, weight: number }
      volumeReliability: { score: number, weight: number }
      verification: { score: number, weight: number }
      timeActive: { score: number, weight: number }
      disputeRate: { score: number, weight: number }
    }
  }
  averageRating: number
  totalRatings: number
  refundRate: number
  disputeRate: number
  ratings: Array<{
    id: string
    rating: number
    review: string
    date: string
    productId: string
    userId: string
  }>
  sales: Array<{
    id: string
    productId: string
    amount: number
    date: string
    status: 'completed' | 'refunded' | 'disputed'
    userId: string
  }>
}

export default function SellerDetailModal({ isOpen, onClose, sellerId, isDarkMode }: SellerDetailModalProps) {
  const [sellerData, setSellerData] = useState<SellerData | null>(null)
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isOpen && sellerId) {
      fetchSellerData()
    }
  }, [isOpen, sellerId])

  const fetchSellerData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/seller-trust?sellerId=${sellerId}`)
      if (response.ok) {
        const data = await response.json()
        setSellerData(data.seller)
      }
    } catch (error) {
      console.error('Error fetching seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { level: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (score >= 60) return { level: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getSafeShoppingLevel = (score: number) => {
    if (score >= 85) return { level: 'Very Safe', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 70) return { level: 'Safe', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 50) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Risky', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const formatDate = (dateString: string) => {
    if (!isClient) return '' // Return empty string during SSR
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateYearsActive = (joinDate: string) => {
    if (!isClient) return 0 // Return 0 during SSR
    return Math.floor((Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))
  }

  if (!sellerData && !loading) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-0 h-auto">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Seller Details</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : sellerData ? (
          <div className="space-y-6">
            {/* Seller Header */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {sellerData.name}
                      </h2>
                      {sellerData.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {sellerData.category} • Joined {formatDate(sellerData.joinDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{sellerData.averageRating.toFixed(1)}</span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {sellerData.totalRatings} reviews
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trust Score */}
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Trust Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-3xl font-bold text-blue-600">{sellerData.trustScore}%</div>
                    <Badge className={`${getTrustLevel(sellerData.trustScore).bg} ${getTrustLevel(sellerData.trustScore).color}`}>
                      {getTrustLevel(sellerData.trustScore).level}
                    </Badge>
                    <Progress value={sellerData.trustScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Safe Shopping Score */}
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Safe Shopping Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-3xl font-bold text-green-600">{sellerData.safeShoppingScore}%</div>
                    <Badge className={`${getSafeShoppingLevel(sellerData.safeShoppingScore).bg} ${getSafeShoppingLevel(sellerData.safeShoppingScore).color}`}>
                      {getSafeShoppingLevel(sellerData.safeShoppingScore).level}
                    </Badge>
                    <Progress value={sellerData.safeShoppingScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-2">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sellerData.totalSales.toLocaleString()}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sales</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-2">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(sellerData.totalRevenue)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-2">
                      <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sellerData.totalRatings}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reviews</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-2">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sellerData.refundRate.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Refund Rate</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full mx-auto mb-2">
                      <XCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sellerData.disputeRate.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dispute Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <MessageSquare className="h-5 w-5" />
                  <span>Recent Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellerData.ratings.slice(0, 5).map((rating) => (
                    <div key={rating.id} className="border-b dark:border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDate(rating.date)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {rating.review}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Factors */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Trust Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Identity Verification
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Customer Rating
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sellerData.averageRating.toFixed(1)}/5.0
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Sales Volume
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {sellerData.totalSales.toLocaleString()} sales
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Time Active
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {calculateYearsActive(sellerData.joinDate)} years
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safe Shopping Score Breakdown */}
            {sellerData.safeShoppingBreakdown && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader>
                  <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Safe Shopping Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'ratingQuality', 
                        label: 'Rating Quality', 
                        icon: Star, 
                        color: 'text-yellow-500',
                        description: 'Quality of ratings based on distribution and sentiment'
                      },
                      { 
                        key: 'recentPerformance', 
                        label: 'Recent Performance', 
                        icon: TrendingUp, 
                        color: 'text-blue-500',
                        description: 'Recent ratings and sales performance (last 3 months)'
                      },
                      { 
                        key: 'consistency', 
                        label: 'Consistency', 
                        icon: CheckCircle, 
                        color: 'text-green-500',
                        description: 'Consistency in ratings over time'
                      },
                      { 
                        key: 'refundRate', 
                        label: 'Refund Rate', 
                        icon: Shield, 
                        color: 'text-purple-500',
                        description: 'Low refund rate indicates reliability'
                      },
                      { 
                        key: 'volumeReliability', 
                        label: 'Volume Reliability', 
                        icon: Users, 
                        color: 'text-orange-500',
                        description: 'High volume with good ratings'
                      },
                      { 
                        key: 'verification', 
                        label: 'Verification', 
                        icon: CheckCircle, 
                        color: 'text-indigo-500',
                        description: 'Identity and business verification status'
                      },
                      { 
                        key: 'timeActive', 
                        label: 'Time Active', 
                        icon: Calendar, 
                        color: 'text-pink-500',
                        description: 'Years of operation on the platform'
                      },
                      { 
                        key: 'disputeRate', 
                        label: 'Dispute Rate', 
                        icon: XCircle, 
                        color: 'text-red-500',
                        description: 'Low dispute rate shows good customer service'
                      },
                    ].map((factor) => {
                      const factorData = sellerData.safeShoppingBreakdown!.breakdown[factor.key as keyof typeof sellerData.safeShoppingBreakdown.breakdown]
                      return (
                        <div key={factor.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <factor.icon className={`h-4 w-4 ${factor.color}`} />
                              <div>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {factor.label}
                                </span>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {factor.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {factorData.score}%
                              </span>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Weight: {(factorData.weight * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          <Progress value={factorData.score} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
} 