"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SearchOverlay from "@/components/search-overlay"
import AuthPopup from "@/components/auth-popup"
import { Button } from "@/components/ui/button"
import { Search, Leaf, ShoppingCart, Star } from "lucide-react"

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

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
          }
        })
        .catch(() => {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSearchClick={() => setShowSearch(true)} onAuthClick={() => setShowAuth(true)} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
              Fresh<span className="text-primary">Mart</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the freshest fruits and vegetables delivered straight to your doorstep. Quality produce,
              unbeatable prices, and convenience at your fingertips.
            </p>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
              onClick={() => setShowSearch(true)}
            >
              <Search className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
              <p className="text-muted-foreground">Handpicked fresh produce sourced directly from local farms</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Shopping</h3>
              <p className="text-muted-foreground">
                Simple search, quick add to cart, and seamless checkout experience
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">100% satisfaction guarantee with our premium quality products</p>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Fruits", image: "/fresh-fruits-basket.png" },
              { name: "Vegetables", image: "/fresh-vegetables.png" },
              { name: "Leafy Greens", image: "/leafy-green-vegetables.png" },
              { name: "Herbs", image: "/fresh-herbs.png" },
            ].map((category) => (
              <div
                key={category.name}
                className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setShowSearch(true)}
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-card-foreground">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Search Overlay */}
      {showSearch && (
        <SearchOverlay
          onClose={() => setShowSearch(false)}
          user={user}
          onAuthRequired={() => {
            setShowSearch(false)
            setShowAuth(true)
          }}
        />
      )}

      {/* Auth Popup */}
      {showAuth && (
        <AuthPopup
          onClose={() => setShowAuth(false)}
          onSuccess={(userData) => {
            setUser(userData)
            setShowAuth(false)
          }}
        />
      )}
    </div>
  )
}
