"use client"

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Fingerprint, 
  Camera, 
  Shield, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"

export default function BiometricAuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  // Get parameters from URL
  const amount = searchParams.get('amount')
  const product = searchParams.get('product')
  const productId = searchParams.get('productId')
  
  // State management
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showPinInput, setShowPinInput] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showPin, setShowPin] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(20)
  const [isSettingPin, setIsSettingPin] = useState(false)
  const [confirmPin, setConfirmPin] = useState('')
  const [storedPin, setStoredPin] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [cameraActive, setCameraActive] = useState(false)
  const [authStep, setAuthStep] = useState<'camera' | 'pin' | 'success'>('camera')

  const MAX_RETRIES = 5
  const DEFAULT_PIN = '123456'

  // Initialize user ID and stored PIN on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedUserPin = localStorage.getItem('userPin')
    
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      // Generate new user ID if none exists
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setUserId(newUserId)
      localStorage.setItem('userId', newUserId)
    }
    
    if (storedUserPin) {
      setStoredPin(storedUserPin)
    } else {
      setStoredPin(DEFAULT_PIN)
      localStorage.setItem('userPin', DEFAULT_PIN)
    }
  }, [])

  // Start camera for biometric authentication
  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error('Camera access failed:', err)
      setError('Camera access denied. Please allow camera access or use PIN authentication.')
      setAuthStep('pin')
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  // Simulate biometric authentication
  const handleBiometricAuth = async () => {
    setIsAuthenticating(true)
    setError(null)
    
    try {
      // Simulate biometric processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate 80% success rate for biometric
      const isSuccess = Math.random() > 0.2
      
      if (isSuccess) {
        setAuthStep('success')
        stopCamera()
        // Redirect to VaultX after a brief success display
        setTimeout(() => {
          redirectToVaultX()
        }, 1500)
      } else {
        setRetryCount(prev => prev + 1)
        if (retryCount >= MAX_RETRIES) {
          setError('Biometric authentication failed. Please use PIN authentication.')
          setAuthStep('pin')
          stopCamera()
        } else {
          setError(`Authentication failed. Please try again. (${retryCount + 1}/${MAX_RETRIES})`)
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Handle PIN authentication
  const handlePinSubmit = () => {
    if (!storedPin) {
      setError('PIN not set. Please set a PIN first.')
      return
    }

    if (pin === storedPin) {
      setAuthStep('success')
      setTimeout(() => {
        redirectToVaultX()
      }, 1500)
    } else {
      setRetryCount(prev => prev + 1)
      if (retryCount >= MAX_RETRIES) {
        setIsLocked(true)
        setError('Too many failed attempts. Account locked for 20 seconds.')
        const interval = setInterval(() => {
          setLockoutTime(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              setIsLocked(false)
              setRetryCount(0)
              setError(null)
              return 20
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(`Incorrect PIN. Please try again. (${retryCount + 1}/${MAX_RETRIES})`)
      }
      setPin('')
    }
  }

  // Set new PIN
  const handleSetPin = () => {
    if (pin.length !== 6) {
      setError('PIN must be 6 digits.')
      return
    }

    if (pin !== confirmPin) {
      setError('PINs do not match.')
      return
    }

    setStoredPin(pin)
    localStorage.setItem('userPin', pin)
    setError(null)
    setIsSettingPin(false)
    setPin('')
    setConfirmPin('')
  }

  // Redirect to VaultX with all parameters
  const redirectToVaultX = () => {
    const params = new URLSearchParams()
    if (amount) params.append('amount', amount)
    if (product) params.append('product', product)
    if (productId) params.append('productId', productId)
    
    const vaultxUrl = `/vaultx?${params.toString()}`
    router.push(vaultxUrl)
  }

  // Start camera when component mounts
  useEffect(() => {
    startCamera()
    
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VaultX Security</h1>
              <p className="text-sm text-gray-600">Verifying User Facial Recognition</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {authStep === 'camera' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                {isAuthenticating && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Authenticating...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleBiometricAuth}
                disabled={isAuthenticating || !cameraActive}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Authenticate with Face
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setAuthStep('pin')}
                className="w-full"
              >
                Use PIN Instead
              </Button>
            </div>
          )}

          {authStep === 'pin' && (
            <div className="space-y-4">
              {isSettingPin ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Set New PIN</label>
                    <div className="relative">
                      <Input
                        type={showPin ? "text" : "password"}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter 6-digit PIN"
                        maxLength={6}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPin(!showPin)}
                      >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Confirm PIN</label>
                    <Input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Confirm 6-digit PIN"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSetPin}
                      className="flex-1"
                    >
                      Set PIN
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSettingPin(false)
                        setPin('')
                        setConfirmPin('')
                        setError(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enter PIN</label>
                    <div className="relative">
                      <Input
                        type={showPin ? "text" : "password"}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter 6-digit PIN"
                        maxLength={6}
                        disabled={isLocked}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPin(!showPin)}
                      >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handlePinSubmit}
                      disabled={isLocked || pin.length !== 6}
                      className="flex-1"
                    >
                      {isLocked ? `Locked (${lockoutTime}s)` : 'Authenticate'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsSettingPin(true)}
                    >
                      Set PIN
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setAuthStep('camera')}
                    className="w-full"
                  >
                    Use Face Authentication
                  </Button>
                </div>
              )}
            </div>
          )}

          {authStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Authentication Successful!</h3>
                <p className="text-sm text-gray-600">Redirecting to VaultX...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 