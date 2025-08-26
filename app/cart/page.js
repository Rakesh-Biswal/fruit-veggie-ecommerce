"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (token) {
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user)
            loadCart(token)
          }
        })
        .catch(() => {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const loadCart = async (token) => {
    try {
      const response = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || data.cart || []) 
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    if (!user) return
    
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      })

      if (response.ok) {
        loadCart(token)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeItem = async (productId) => {
    if (!user) return
    
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 0 }),
      })

      if (response.ok) {
        loadCart(token)
      }
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  const handleCheckout = () => {
    alert("This is a demo. Checkout functionality is under construction.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onSearchClick={() => {}} onAuthClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onSearchClick={() => {}} onAuthClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to access your shopping cart</p>
            <Link href="/">
              <Button className="rounded-xl">Go to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSearchClick={() => {}} onAuthClick={() => {}} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="rounded-xl w-full sm:w-auto justify-center sm:justify-start">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-8 bg-muted/50 rounded-2xl max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some fresh produce to get started!</p>
              <Link href="/products">
                <Button className="rounded-xl">Start Shopping</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id || item.productId} className="bg-card rounded-2xl p-4 sm:p-6 border border-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={item.image || "/fruits-placeholder.png"}
                      alt={item.name}
                      className="w-full sm:w-20 h-20 object-cover rounded-xl self-center sm:self-auto"
                    />

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-foreground">{item.name || `Product ${item.productId}`}</h3>
                      <p className="text-sm text-muted-foreground">{item.unit || "1 piece"}</p>
                      <p className="text-lg font-bold text-primary mt-1">₹{item.price || 0}</p>
                    </div>

                    <div className="flex items-center justify-center sm:justify-end gap-3">
                      <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.productId || item.id, (item.quantity || 1) - 1)}
                          className="h-8 w-8 p-0 rounded-lg"
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-foreground w-8 text-center">{item.quantity || 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.productId || item.id, (item.quantity || 1) + 1)}
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.productId || item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 w-10 p-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 border border-border/50 sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-semibold">₹5.00</span>
                  </div>
                  <hr className="border-border my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{(getTotalPrice() + 5).toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full rounded-xl py-3 text-base font-semibold">
                  Proceed to Checkout
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700 font-medium text-center">🚚 Free delivery in 10-15 minutes</p>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    * This is a demo. All features are under construction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}