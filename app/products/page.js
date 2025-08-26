"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import ProductCard from "@/components/product-card"
import AuthPopup from "@/components/auth-popup"
import Toast from "@/components/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchFruitsAndVegetables } from "@/lib/api"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [cartItems, setCartItems] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const [toast, setToast] = useState({ show: false, message: "", productName: "" })

  // Initialize search query from URL params
  useEffect(() => {
    const search = searchParams.get("search") || ""
    setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    // Check for user token
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

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchFruitsAndVegetables(currentPage, 12, searchQuery)

        let filteredProducts = data.products || []

        // Filter by category if not "all"
        if (selectedCategory !== "all") {
          filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory)
        }

        setProducts(filteredProducts)
        setTotalPages(data.totalPages || 1)
        setTotalProducts(data.totalProducts || 0)
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentPage, searchQuery, selectedCategory])

  useEffect(() => {
    const loadCart = async () => {
      if (!user) return

      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]

        const response = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setCartItems(data.cart || [])
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }

    loadCart()
  }, [user])

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!user) {
      setShowAuth(true)
      throw new Error("User not authenticated")
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      const data = await response.json()

      if (response.ok) {
        setCartItems(data.cart || [])
        // Find the product name from the current products list
        const product = products.find(p => p.id === productId)
        const productName = product?.name || "Item"

        setToast({
          show: true,
          message: quantity > 1 ? "Quantity updated!" : "Item added to cart!",
          productName,
        })
      } else {
        throw new Error(data.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!user) {
      setShowAuth(true)
      throw new Error("User not authenticated")
    }

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

      const data = await response.json()

      if (response.ok) {
        setCartItems(data.cart || [])

        // Show toast for quantity updates too
        const product = products.find(p => p.id === productId)
        const productName = product?.name || "Item"

        setToast({
          show: true,
          message: newQuantity === 0 ? "Item removed from cart!" : "Quantity updated!",
          productName,
        })

      } else {
        throw new Error(data.error || "Failed to update quantity")
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      throw error
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleViewCart = () => {
    window.location.href = "/cart"
  }

  const categories = [
    { id: "all", name: "All Products" },
    { id: "fruit", name: "Fruits" },
    { id: "vegetable", name: "Vegetables" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSearchClick={() => { }} onAuthClick={() => setShowAuth(true)} />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for fresh fruits & vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-base rounded-xl border-2 border-border/50 focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.id)
                  setCurrentPage(1) // Reset to first page when changing category
                }}
                className="rounded-xl font-semibold"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {searchQuery ? `Search results for "${searchQuery}"` : "Fresh Produce"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {totalProducts} products found • Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-xl mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products && products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                cartItems={cartItems}
              />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-12">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-xl bg-transparent"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="rounded-xl w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-xl bg-transparent"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && (!products || products.length === 0) && (
          <div className="text-center py-16">
            <div className="p-8 bg-muted/50 rounded-2xl max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-2 text-foreground">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setCurrentPage(1)
                }}
                className="rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </main>

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

      <Toast
        message={toast.message}
        productName={toast.productName}
        onViewCart={handleViewCart}
        onClose={() => setToast({ show: false, message: "", productName: "" })}
        isVisible={toast.show}
      />
    </div>
  )
}