"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Clock, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { searchSuggestions } from "@/lib/api"

export default function SearchOverlay({ onClose, user, onAuthRequired }) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    setSearchHistory(history)

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true)
      const timeoutId = setTimeout(async () => {
        try {
          const results = await searchSuggestions(query)
          setSuggestions(results)
        } catch (error) {
          console.error("Search error:", error)
          setSuggestions([])
        } finally {
          setLoading(false)
        }
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setSuggestions([])
      setLoading(false)
    }
  }, [query])

  const handleSuggestionClick = (suggestion) => {

    const newHistory = [suggestion, ...searchHistory.filter((item) => item !== suggestion)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))

    window.location.href = `/products?search=${encodeURIComponent(suggestion)}`
  }

  const handleHistoryClick = (item) => {
    setQuery(item)
    handleSuggestionClick(item)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  const displayedSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 6)

  return (
    <div className="fixed inset-0 z-50 search-overlay animate-in fade-in-0 duration-300 overflow-y-auto">

      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose} />

      <div className="min-h-screen flex items-start justify-center pt-8 md:pt-16 px-4 pb-8">
        <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl animate-in slide-in-from-top-6 duration-300 border border-border/50">

          <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Search Fresh Produce</h2>
                <p className="text-sm text-muted-foreground mt-1">Find your favorite fruits & vegetables</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-10 w-10 rounded-full hover:bg-muted"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Try 'mango', 'tomato', 'spinach'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg border-2 border-border/50 focus:border-primary rounded-xl bg-muted/20 placeholder:text-muted-foreground/70"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    handleSuggestionClick(query.trim())
                  }
                }}
              />
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                </div>
              )}
            </div>

            {query.length === 0 && (
              <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                <span>Search for fresh fruits, vegetables, and organic produce</span>
              </div>
            )}
          </div>

          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 pb-6">
            {searchHistory.length > 0 && query.length === 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Recent Searches</span>
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearHistory} 
                    className="text-xs h-8 px-2"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchHistory.slice(0, 6).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 hover:bg-muted/70 rounded-xl cursor-pointer transition-colors border border-border/30 group"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Suggestions</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {displayedSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 hover:bg-muted/70 rounded-xl cursor-pointer transition-all duration-200 border border-border/30 hover:border-primary/30 hover:shadow-sm group"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Search className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground block truncate">{suggestion}</span>
                        <p className="text-xs text-muted-foreground mt-1">Fresh & organic</p>
                      </div>
                    </div>
                  ))}
                </div>

                {suggestions.length > 6 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-xl bg-transparent h-11 flex items-center justify-center gap-2"
                    onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                  >
                    {showAllSuggestions ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show All {suggestions.length} Results
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {query.length > 1 && suggestions.length === 0 && !loading && (
              <div className="py-8 text-center">
                <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">Try searching for "mango", "tomato", or "spinach"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}