"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingCart, X } from "lucide-react"

export default function Toast({ message, productName, onViewCart, onClose, isVisible }) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const displayProductName = isMobile && productName.length > 15 
    ? `${productName.substring(0, 12)}...` 
    : productName

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300 w-full max-w-[95vw] sm:max-w-md">
      <div className="bg-green-500 text-white rounded-2xl shadow-2xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 w-full border border-green-400">
        <div className="p-1.5 sm:p-2 bg-white/20 rounded-full flex-shrink-0">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs sm:text-sm truncate">{displayProductName} added to cart!</p>
          {!isMobile && (
            <p className="text-xs text-green-100 mt-0.5">{message}</p>
          )}
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={onViewCart}
            className="bg-white text-green-600 hover:bg-green-50 font-semibold text-xs px-2 py-1 sm:px-3 rounded-lg h-7 sm:h-8"
          >
            {isMobile ? (
              <ShoppingCart className="h-3 w-3" />
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 mr-1" />
                View Cart
              </>
            )}
          </Button>

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-1 rounded-lg h-7 w-7 sm:h-8 sm:w-8"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}