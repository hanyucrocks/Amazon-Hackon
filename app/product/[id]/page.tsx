"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Share2, Shield } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { use } from "react"

// Product data
const products = {
  1: {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviews: 1247,
    description: "Experience crystal-clear sound with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    images: [
      "/headphones-1.jpg",
      "/headphones-2.jpg",
      "/headphones-3.jpg",
      "/headphones-4.jpg"
    ],
    features: [
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Bluetooth 5.0",
      "Built-in Microphone",
      "Foldable Design"
    ],
    stock: 15,
    delivery: "Free delivery by Tomorrow",
    warranty: "2 Year Warranty"
  },
  2: {
    id: 2,
    name: "Smart Watch Series 5",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 892,
    description: "Stay connected and track your fitness with our latest smartwatch. Features heart rate monitoring, GPS, and water resistance up to 50m.",
    images: [
      "/watch-1.jpg",
      "/watch-2.jpg",
      "/watch-3.jpg",
      "/watch-4.jpg"
    ],
    features: [
      "Heart Rate Monitoring",
      "GPS Tracking",
      "Water Resistant (50m)",
      "7-day Battery Life",
      "Sleep Tracking"
    ],
    stock: 8,
    delivery: "Free delivery by Tomorrow",
    warranty: "1 Year Warranty"
  },
  3: {
    id: 3,
    name: "Wireless Earbuds Pro",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 2156,
    description: "Premium wireless earbuds with active noise cancellation and crystal-clear sound quality. Perfect for music, calls, and workouts.",
    images: [
      "/earbuds-1.jpg",
      "/earbuds-2.jpg",
      "/earbuds-3.jpg",
      "/earbuds-4.jpg"
    ],
    features: [
      "Active Noise Cancellation",
      "24-hour Battery Life",
      "IPX4 Water Resistance",
      "Touch Controls",
      "Voice Assistant Support"
    ],
    stock: 20,
    delivery: "Free delivery by Tomorrow",
    warranty: "1 Year Warranty"
  },
  4: {
    id: 4,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.3,
    reviews: 567,
    description: "Powerful portable speaker with deep bass and clear highs. Perfect for outdoor gatherings and indoor entertainment.",
    images: [
      "/speaker-1.jpg",
      "/speaker-2.jpg",
      "/speaker-3.jpg",
      "/speaker-4.jpg"
    ],
    features: [
      "20W Output Power",
      "12-hour Battery Life",
      "IPX7 Waterproof",
      "Bluetooth 5.0",
      "Built-in Microphone"
    ],
    stock: 12,
    delivery: "Free delivery by Tomorrow",
    warranty: "1 Year Warranty"
  }
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [price, setPrice] = useState<number | null>(null)
  const [manualDropPrice, setManualDropPrice] = useState(150);
  const [warning, setWarning] = useState("");
  
  // Use params at the top level
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id)
  const product = products[productId as keyof typeof products]

  // Redirect if product not found
  if (!product) {
    router.push('/')
    return null
  }

  // --- Price drop logic for product id 2 ---
  useEffect(() => {
    // Always fetch the current price from the API
    const fetchPrice = async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.item && data.item.price && data.item.price.N) {
          setPrice(Number(data.item.price.N));
        } else {
          setPrice(product.price);
        }
      } else {
        setPrice(product.price);
      }
    };
    fetchPrice();
  }, [productId, product.price]);

  // Update input handler to validate and remove leading zero
  const handleDropPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove leading zeros
    value = value.replace(/^0+(?!$)/, '');
    const num = Number(value);
    setManualDropPrice(num);
    if (num >= (price ?? product.price)) {
      setWarning("Drop price must be less than the current price.");
    } else {
      setWarning("");
    }
  };

  const handleManualPriceDrop = async () => {
    if (manualDropPrice >= (price ?? product.price)) {
      setWarning("Drop price must be less than the current price.");
      return;
    }
    setWarning("");
    // POST API call to trigger price drop and refunds
    console.log('Calling POST /api/products/2/price-drop to update product price and process refunds...');
    const res = await fetch('/api/products/2/price-drop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPrice: manualDropPrice })
    });
    const data = await res.json();
    console.log('Price drop API response:', data);
    // Re-fetch the price from the API to update the UI
    const priceRes = await fetch(`/api/products/${productId}`);
    if (priceRes.ok) {
      const priceData = await priceRes.json();
      if (priceData.item && priceData.item.price && priceData.item.price.N) {
        setPrice(Number(priceData.item.price.N));
      }
    }
  };

  const handleBuyWithAmazonPay = () => {
    // Redirect to VaultX app with the correct price (after drop if applicable)
    const payAmount = productId === 2 && price !== null ? price : product.price;
    router.push(`/vaultx?amount=${payAmount}&product=${encodeURIComponent(product.name)}&productId=${productId}`)
  }

  // Reset price handler for product 2
  const handleResetPrice = async () => {
    const res = await fetch('/api/products/2/price', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 299.99 })
    });
    if (res.ok) {
      // Re-fetch the price from the API to update the UI
      const priceRes = await fetch(`/api/products/2`);
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        if (priceData.item && priceData.item.price && priceData.item.price.N) {
          setPrice(Number(priceData.item.price.N));
        }
      }
    } else {
      alert('Failed to reset price!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Amazon</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5 mr-2" />
              Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white p-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviews.toLocaleString()} ratings)
                </span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${productId === 2 && price !== null ? price : product.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">{product.delivery}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">About this item</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <ul className="mt-4 space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleBuyWithAmazonPay}
              >
                Buy with Amazon Pay
                <Shield className="h-4 w-4 ml-2" />
              </Button>
              {productId === 2 && (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    max={price ?? product.price}
                    value={manualDropPrice === 0 ? '' : manualDropPrice}
                    onChange={handleDropPriceInput}
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter new price"
                  />
                  {warning && (
                    <div className="text-red-600 text-sm font-medium">{warning}</div>
                  )}
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handleManualPriceDrop}
                    disabled={manualDropPrice >= (price ?? product.price)}
                  >
                    Drop Price Now
                  </Button>
                  <Button
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={handleResetPrice}
                  >
                    Reset Price
                  </Button>
                </div>
              )}
              <Button variant="outline" className="w-full">
                Add to Cart
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>{product.warranty}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 