"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, User, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Header({ user, onSearchClick, onAuthClick }) {
  const [cartCount, setCartCount] = useState(0)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FM</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground">FreshMart</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onSearchClick}
              className="min-w-[300px] justify-start text-muted-foreground bg-transparent"
            >
              <Search className="mr-2 h-4 w-4" />
              Search for fruits & vegetables...
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                Products
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={user ? () => (window.location.href = "/cart") : onAuthClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>


            <Button
              variant="ghost"
              size="sm"
              onClick={user ? undefined : onAuthClick}
              className="flex items-center space-x-1"
            >
              {user ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="hidden sm:inline">{user.name}</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
