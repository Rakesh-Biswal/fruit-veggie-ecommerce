"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Loader2 } from "lucide-react"

export default function ProductCard({ product, onAddToCart, onUpdateQuantity, cartItems }) {
  const [isLoading, setIsLoading] = useState(false)
  const cartItem = cartItems?.find(item => item.productId === product.id)
  const quantity = cartItem?.quantity || 0

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await onAddToCart(product.id, 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleIncrease = async () => {
    setIsLoading(true)
    try {
      await onUpdateQuantity(product.id, quantity + 1)
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrease = async () => {
    if (quantity <= 1) {
      setIsLoading(true)
      try {
        await onUpdateQuantity(product.id, 0)
      } catch (error) {
        console.error("Error removing from cart:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(true)
      try {
        await onUpdateQuantity(product.id, quantity - 1)
      } catch (error) {
        console.error("Error updating quantity:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-card-foreground mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.unit}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${product.price}</span>

          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecrease}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
              
              <span className="text-sm font-medium min-w-[20px] text-center">
                {quantity}
              </span>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleIncrease}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              onClick={handleAddToCart} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[80px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}