"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Fingerprint,
  Wifi,
  WifiOff,
  Coins,
  Gift,
  Shield,
  Star,
  Mic,
  Globe,
  CreditCard,
  ChevronRight,
  Bell,
  Settings,
  User,
  Target,
  Award,
  Moon,
  Sun,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { BiometricAuth } from "../components/BiometricAuth"
import SellerDetailModal from "../components/SellerDetailModal"

interface PendingPayment {
  id: string
  amount: number
  merchant: string
  status: 'pending' | 'syncing'
}

interface Seller {
  id: string
  name: string
  category: string
  verified: boolean
  totalSales: number
  totalRevenue: number
  trustScore: number
  safeShoppingScore: number
  averageRating: number
  totalRatings: number
  refundRate: number
}

export default function VaultXApp() {
  const [activeTab, setActiveTab] = useState("snappay")
  const [isOnline, setIsOnline] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null)
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false)
  const [loadingSellers, setLoadingSellers] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount')
  const product = searchParams.get('product')
  const productId = searchParams.get('productId')

  const [smartCoinsBalance, setSmartCoinsBalance] = useState(0)
  const [refunds, setRefunds] = useState<any[]>([])

  const safeShoppingScore = 85

  const recentTransactions = [
    { id: 1, type: "redeemed", description: "make my trip booking ", amount: "-100", time: "2 hours ago" },
    { id: 2, type: "earned", description: "Safe purchase bonus", amount: "+100", time: "1 day ago" },
    { id: 3, type: "redeemed", description: "Amazon purchase", amount: "-75", time: "2 days ago" },
    { id: 4, type: "earned", description: "Trust mission completed", amount: "+75", time: "3 days ago" },
  ]

  const trustMissions = [
    { id: 1, title: "Shop from VaultX Preferred Sellers", progress: 60, reward: 100, completed: false },
    { id: 2, title: "Complete 5 safe purchases", progress: 80, reward: 150, completed: false },
    { id: 3, title: "Refer a friend to VaultX", progress: 0, reward: 200, completed: false },
  ]

  const partnerPlatforms = [
    { name: "Zomato", icon: "🍕", available: true },
    { name: "Uber", icon: "🚗", available: true },
    { name: "MakeMyTrip", icon: "✈️", available: true },
    { name: "BookMyShow", icon: "🎬", available: false },
  ]

  // Check if Pay Now button should be visible (only when both amount and productId are present)
  const shouldShowPayNow = amount && productId

  // Client-side only date formatting to prevent hydration mismatches
  const formatDate = (timestamp: number) => {
    if (!isClient) return '' // Return empty string during SSR
    return new Date(timestamp).toLocaleString()
  }

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Check network status
    const checkNetworkStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', checkNetworkStatus)
    window.addEventListener('offline', checkNetworkStatus)

    return () => {
      window.removeEventListener('online', checkNetworkStatus)
      window.removeEventListener('offline', checkNetworkStatus)
    }
  }, [])

  // Ensure user ID is initialized and persisted
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (!storedUserId) {
      // Generate new user ID if none exists
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('userId', newUserId)
    }
  }, [])

  useEffect(() => {
    // Fetch SmartCoins and refunds from API
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`/api/smartcoins?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setSmartCoinsBalance(data.balance || 0);
        setRefunds(data.refunds || []);
      });
  }, [activeTab])

  // Fetch sellers when trust tab is active
  useEffect(() => {
    if (activeTab === "trust" && sellers.length === 0) {
      fetchSellers()
    }
  }, [activeTab, sellers.length])

  const fetchSellers = async () => {
    setLoadingSellers(true)
    try {
      const response = await fetch('/api/seller-trust')
      if (response.ok) {
        const data = await response.json()
        setSellers(data.sellers || [])
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoadingSellers(false)
    }
  }

  const handleSellerClick = (sellerId: string) => {
    setSelectedSellerId(sellerId)
    setIsSellerModalOpen(true)
  }

  const handleTransactionSuccess = (transaction: { id: string }) => {
    if (!isOnline) {
      setPendingPayments(prev => [...prev, {
        id: transaction.id,
        amount: amount ? parseFloat(amount) : 0,
        merchant: product || 'Amazon',
        status: 'pending'
      }])
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { level: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (score >= 60) return { level: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Amazon Pay Header */}
      <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>Amazon Pay</h1>
              <p className="text-xs text-orange-500 font-medium">Powered by VaultX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Language & Accessibility Bar */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"} border-b px-4 py-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`text-sm border-none bg-transparent ${isDarkMode ? "text-gray-300" : "text-blue-700"} font-medium`}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <Mic className="h-4 w-4 mr-1" />
              Voice
            </Button>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Safe Shopping Score: {safeShoppingScore}%
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {activeTab === "snappay" && (
          <div className="p-4 space-y-6">
            {/* Online/Offline Status */}
            {/* <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isOnline ? (
                      <Wifi className="h-5 w-5 text-green-500" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {isOnline ? "Online – Syncing" : "Offline – Payment Locked"}
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {isOnline ? "All systems operational" : "Payments will sync when online"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                </div>
              </CardContent>
            </Card> */}

            {/* Pay Now Button */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <BiometricAuth
                      onSuccess={handleTransactionSuccess}
                      onError={(error) => console.error(error)}
                      onTabChange={handleTabChange}
                      amount={amount ? parseFloat(amount) : undefined}
                      productId={productId}
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-2">
                      <Fingerprint className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {shouldShowPayNow ? "Tap and authenticate with fingerprint or Face ID" : "Product not selected"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payments Queue */}
            {!isOnline && pendingPayments.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Pending Payments ({pendingPayments.length})
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            payment.status === "pending" ? "bg-yellow-500" : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {payment.merchant}
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {payment.status === "pending" ? "Waiting to sync" : "Syncing..."}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        ${payment.amount}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "smartcoins" && (
          <div className="p-4 space-y-6">
            {/* SmartCoins Balance */}
            <Card
              className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-orange-50 to-yellow-50"} border-2 border-orange-200`}
            >
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="relative">
                    <Coins className="h-16 w-16 text-orange-500 mx-auto" />
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {smartCoinsBalance.toLocaleString()}
                    </h2>
                    <p className="text-orange-600 font-medium">SmartCoins Available</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                      <Gift className="h-4 w-4 mr-2" />
                      Redeem
                    </Button>
                    <Button variant="outline" className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50">
                      <User className="h-4 w-4 mr-2" />
                      Gift
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Rewards Notification */}
            <Card
              className={`${isDarkMode ? "bg-green-900 border-green-700" : "bg-green-50"} border-2 border-green-200`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-green-100" : "text-green-800"}`}>
                      You earned SmartCoins!
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-green-200" : "text-green-600"}`}>
                      +{smartCoinsBalance} SmartCoins for price drop refunds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Refunds */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recent Refunds</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {refunds.length === 0 ? (
                  <div className="text-center text-gray-500">No refunds yet.</div>
                ) : (
                  refunds.map((refund, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900">
                          <Coins className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            Refund for Product ID: {refund.productId}
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {formatDate(refund.timestamp)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        +{refund.refundAmount} SC
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Older Activity</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "earned"
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {transaction.type === "earned" ? (
                          <Coins className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {transaction.description}
                        </p>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {transaction.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold ${
                        transaction.type === "earned"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.amount} SC
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Partner Platforms */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Use SmartCoins On</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {partnerPlatforms.map((platform) => (
                    <div
                      key={platform.name}
                      className={`p-4 rounded-lg border-2 text-center ${
                        platform.available
                          ? `${isDarkMode ? "border-gray-600 hover:border-orange-500" : "border-gray-200 hover:border-orange-300"} cursor-pointer hover:shadow-md transition-all`
                          : `${isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-100 bg-gray-50"} opacity-50`
                      }`}
                    >
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{platform.name}</p>
                      {!platform.available && (
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Coming Soon</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "missions" && (
          <div className="p-4 space-y-6">
            {/* Trust Missions Header */}
            <Card className={`${isDarkMode ? "bg-blue-900 border-blue-700" : "bg-blue-50"} border-2 border-blue-200`}>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-blue-100" : "text-blue-900"}`}>
                  Trust Missions
                </h2>
                <p className={`${isDarkMode ? "text-blue-200" : "text-blue-700"}`}>
                  Complete missions to earn bonus SmartCoins
                </p>
              </CardContent>
            </Card>

            {/* Active Missions */}
            <div className="space-y-4">
              {trustMissions.map((mission) => (
                <Card key={mission.id} className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {mission.title}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Reward: {mission.reward} SmartCoins
                          </p>
                        </div>
                        <Badge variant={mission.completed ? "default" : "secondary"}>
                          {mission.completed ? "Completed" : "Active"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Progress</span>
                          <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {mission.progress}%
                          </span>
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Safe Shopping Progress */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Safe Shopping Habits</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="h-8 w-8 text-green-500" />
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        3 safe purchases this month!
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Keep up the great work
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+25 SC</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Safe Purchases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Trust Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">1.2K</div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>SC Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "trust" && (
          <div className="p-4 space-y-6">
            {/* Seller Trust Index Header */}
            <Card
              className={`${isDarkMode ? "bg-green-900 border-green-700" : "bg-green-50"} border-2 border-green-200`}
            >
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-green-100" : "text-green-900"}`}>
                  Seller Trust Index
                </h2>
                <p className={`${isDarkMode ? "text-green-200" : "text-green-700"}`}>
                  Shop with confidence from verified sellers
                </p>
              </CardContent>
            </Card>

            {/* VaultX Preferred Sellers */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    VaultX Preferred Sellers
                  </h3>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingSellers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : sellers.length > 0 ? (
                  sellers.map((seller, index) => (
                    <button
                      key={seller.id}
                      onClick={() => handleSellerClick(seller.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {seller.name}
                              </p>
                              {seller.verified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-yellow-600 font-medium">
                                  {seller.averageRating.toFixed(1)}
                                </span>
                                <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                  ({seller.totalRatings})
                                </span>
                              </div>
                              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                                {seller.totalSales.toLocaleString()} sales
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 mt-2">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3 text-blue-500" />
                                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Trust: {seller.trustScore}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-green-500" />
                                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Safe: {seller.safeShoppingScore}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Refund: {seller.refundRate.toFixed(1)}%
                                </span>
                              </div>
                              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>•</span>
                              <div className="flex items-center space-x-1">
                                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {seller.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <ChevronRight className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
                          <Badge className={`text-xs ${getTrustLevel(seller.trustScore).bg} ${getTrustLevel(seller.trustScore).color}`}>
                            {getTrustLevel(seller.trustScore).level}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      No sellers found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Score Breakdown */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  How We Calculate Safe Shopping Scores
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { 
                    factor: "Rating Quality", 
                    weight: "25%", 
                    desc: "Quality of ratings based on distribution and sentiment",
                    icon: Star,
                    color: "text-yellow-500"
                  },
                  { 
                    factor: "Recent Performance", 
                    weight: "20%", 
                    desc: "Recent ratings and sales performance (last 3 months)",
                    icon: TrendingUp,
                    color: "text-blue-500"
                  },
                  { 
                    factor: "Consistency", 
                    weight: "15%", 
                    desc: "Consistency in ratings over time",
                    icon: CheckCircle,
                    color: "text-green-500"
                  },
                  { 
                    factor: "Refund Rate", 
                    weight: "15%", 
                    desc: "Low refund rate indicates reliability",
                    icon: Shield,
                    color: "text-purple-500"
                  },
                  { 
                    factor: "Volume Reliability", 
                    weight: "10%", 
                    desc: "High volume with good ratings",
                    icon: Users,
                    color: "text-orange-500"
                  },
                  { 
                    factor: "Verification", 
                    weight: "5%", 
                    desc: "Identity and business verification status",
                    icon: Award,
                    color: "text-indigo-500"
                  },
                  { 
                    factor: "Time Active", 
                    weight: "5%", 
                    desc: "Years of operation on the platform",
                    icon: Calendar,
                    color: "text-pink-500"
                  },
                  { 
                    factor: "Dispute Rate", 
                    weight: "5%", 
                    desc: "Low dispute rate shows good customer service",
                    icon: XCircle,
                    color: "text-red-500"
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${item.color.replace('text-', 'bg-').replace('-500', '-100')} dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {item.factor}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {item.weight}
                        </Badge>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trust Benefits */}
            <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Why Shop VaultX Preferred?
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Shield, title: "Verified Identity", desc: "All sellers are identity verified" },
                  { icon: Star, title: "Quality Guarantee", desc: "High-quality products guaranteed" },
                  { icon: Coins, title: "Bonus SmartCoins", desc: "Earn extra rewards on every purchase" },
                  { icon: Award, title: "Purchase Protection", desc: "100% refund guarantee" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{benefit.title}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t`}
      >
        <div className="flex items-center justify-around py-2">
          {[
            { id: "snappay", icon: CreditCard, label: "SnapPay" },
            { id: "smartcoins", icon: Coins, label: "SmartCoins" },
            { id: "missions", icon: Target, label: "Missions" },
            { id: "trust", icon: Shield, label: "Trust" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                  : `${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"}`
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amazon Pay Footer */}
      <div
        className={`fixed bottom-16 left-0 right-0 ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"} border-t px-4 py-2`}
      >
        <div className="flex items-center justify-center space-x-2 text-xs">
          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Powered by</span>
          <span className="font-bold text-orange-500">Amazon Pay</span>
          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>•</span>
          <span className="font-bold text-blue-600">VaultX</span>
        </div>
      </div>

      {/* Seller Detail Modal */}
      {selectedSellerId && (
        <SellerDetailModal
          isOpen={isSellerModalOpen}
          onClose={() => setIsSellerModalOpen(false)}
          sellerId={selectedSellerId}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
} 