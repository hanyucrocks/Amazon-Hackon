"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Image from "next/image";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Local product data for dashboard display
const products: { [key: number]: { id: number; name: string; images: string[] } } = {
  1: {
    id: 1,
    name: "Premium Wireless Headphones",
    images: ["/headphones-1.jpg", "/headphones-2.jpg", "/headphones-3.jpg", "/headphones-4.jpg"]
  },
  2: {
    id: 2,
    name: "Smart Watch Series 5",
    images: ["/watch-1.jpg", "/watch-2.jpg", "/watch-3.jpg", "/watch-4.jpg"]
  },
  3: {
    id: 3,
    name: "Wireless Earbuds Pro",
    images: ["/earbuds-1.jpg", "/earbuds-2.jpg", "/earbuds-3.jpg", "/earbuds-4.jpg"]
  },
  4: {
    id: 4,
    name: "Portable Bluetooth Speaker",
    images: ["/speaker-1.jpg", "/speaker-2.jpg", "/speaker-3.jpg", "/speaker-4.jpg"]
  }
};

function PriceHistoryContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!productId) return;
    // Fetch price history for this product (stubbed for now)
    fetch(`/api/products/${productId}/price-history`)
      .then(res => res.json())
      .then(data => setPriceHistory(data.history || []));
  }, [productId]);

  // Prepare chart data (stubbed if no data)
  const chartData = {
    labels: priceHistory.map(item => new Date(Number(item.timestamp)).toLocaleString()),
    datasets: [
      {
        label: "Product Price",
        data: priceHistory.map(item => Number(item.newPrice)),
        borderColor: "#FF9900",
        backgroundColor: "transparent",
        pointBackgroundColor: "#FF9900",
        pointBorderColor: "#FF9900",
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.2,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Price History for Product ID: ${productId}`,
        color: "#232F3E",
        font: { size: 22 },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#232F3E",
        titleColor: "#FF9900",
        bodyColor: "#fff",
        borderColor: "#FF9900",
        borderWidth: 2,
        callbacks: {
          label: (context: any) => `Price: $${context.parsed.y}`,
        },
      },
      annotation: {},
    },
    scales: {
      x: {
        grid: { color: "#F3F4F6" },
        ticks: { color: "#232F3E", font: { size: 13 } },
      },
      y: {
        grid: { color: "#F3F4F6" },
        ticks: { color: "#232F3E", font: { size: 13 } },
        title: {
          display: true,
          text: "Price ($)",
          color: "#232F3E",
          font: { size: 15 },
        },
      },
    },
    elements: {
      line: { borderJoinStyle: 'round' as const },
      point: { pointStyle: "circle" },
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
  };

  // Price drop summary
  const priceDrops = priceHistory.filter(h => h.type === 'scheduled_drop');

  const product = productId ? products[parseInt(productId)] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        {/* Product Info Card */}
        <Card className="md:w-1/3 w-full shadow-lg border-orange-200 bg-white/90 flex flex-col justify-between">
          <CardHeader>
            <h2 className="text-xl font-bold text-orange-600 mb-2">Product Price Analysis</h2>
            <div className="text-sm text-gray-500">Product ID: <span className="font-semibold text-orange-700">{productId}</span></div>
            {product && (
              <div className="flex flex-col items-center mt-4">
                <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-orange-200 bg-white">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-base font-semibold text-gray-800 text-center">{product.name}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Price</span>
                <span className="text-2xl font-bold text-green-600">
                  ${priceHistory.length > 0 ? Number(priceHistory[priceHistory.length-1].newPrice).toLocaleString() : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Initial Price</span>
                <span className="text-lg font-semibold text-orange-500">
                  ${priceHistory.length > 0 ? Number(priceHistory[0].oldPrice).toLocaleString() : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Drops</span>
                <span className="text-lg font-semibold text-blue-600">
                  {priceDrops.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Chart Area */}
        <Card className="md:w-2/3 w-full shadow-2xl border-2 border-orange-100 bg-white/95">
          <CardHeader>
            <h2 className="text-2xl font-bold text-orange-600 mb-2">Price History Chart</h2>
          </CardHeader>
          <CardContent>
            {productId ? (
              priceHistory.length > 0 ? (
                <div className="relative w-full h-[400px] md:h-[500px] flex flex-col justify-center items-center">
                  <Line data={chartData} options={chartOptions} className="w-full h-full" />
                </div>
              ) : (
                <div className="text-center text-gray-500">No price history data found for this product.</div>
              )
            ) : (
              <div className="text-center text-gray-500">No product selected.</div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Price Drop Timeline */}
      <div className="w-full max-w-4xl mt-10">
        <Card className="shadow border-orange-100 bg-white/90">
          <CardHeader>
            <h3 className="text-lg font-semibold text-orange-700 mb-2">Price Drop Timeline</h3>
          </CardHeader>
          <CardContent>
            {priceDrops.length > 0 ? (
              <ul className="w-full space-y-3">
                {priceDrops.map((drop, i) => (
                  <li key={i} className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-700 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg px-4 py-2 shadow-sm border border-orange-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-600">${drop.oldPrice}</span>
                      <span className="mx-1 text-gray-400">→</span>
                      <span className="font-bold text-green-600">${drop.newPrice}</span>
                    </div>
                    <span className="text-gray-500 mt-1 md:mt-0">{new Date(Number(drop.timestamp)).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">No price drops recorded.</span>
            )}
          </CardContent>
        </Card>
      </div>
      <Button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => window.location.href = "/vaultx?tab=smartcoins"}>
        Back to SmartCoins
      </Button>
    </div>
  );
}

export default function PriceHistoryDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading price history...</p>
        </div>
      </div>
    }>
      <PriceHistoryContent />
    </Suspense>
  );
} 